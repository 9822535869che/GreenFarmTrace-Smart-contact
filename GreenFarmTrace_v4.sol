// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title GreenFarmTrace v4
/// @notice ห่วงโซ่ประวัติสินค้าบนบล็อกเชน
///  - กำหนดสิทธิ์ตามบทบาท (เกษตรกร, ผู้ขนส่ง, ผู้จัดจำหน่าย, ผู้ดูแลระบบ)
///  - ผู้ดูแลระบบได้รับสิทธิ์ได้เฉพาะเจ้าของสัญญาเท่านั้น
///  - การเปลี่ยนผู้ครอบครองต้องให้ผู้รับกดยืนยันเอง
///  - ระหว่างเรียกคืนส่งได้เฉพาะเส้นทางส่งคืน และเรียกคืนต้องให้ผู้ดูแลอนุมัติ
///  - ทุกเหตุการณ์ผูกกับ hash ก่อนหน้า (head) จึงแก้ไขหรือลบย้อนหลังไม่ได้
contract GreenFarmTrace {
    enum Role { None, Farmer, Transporter, Distributor, Admin }
    enum Kind { Register, TransferInit, TransferAccept, Status, RecallRequest, RecallApprove, RecallClose, Dispose, Reject, RecallReject }

    struct Lot {
        bool exists;
        bool recalled;
        address holder;
        address pending;
        string status;
    }

    struct Ev {
        Kind kind;
        address actor;
        address to;
        string status;
        string note;
        uint256 ts;
        bytes32 prev;
        bytes32 hash;
    }

    address public immutable owner;
    bytes32 public head;
    mapping(address => Role) public roleOf;
    mapping(string => Lot) private lots;
    mapping(string => Ev[]) private evs;

    event RoleSet(address indexed who, uint8 role);
    event Logged(string lot, uint8 kind, address indexed actor, bytes32 hash);

    modifier onlyAdmin() {
        require(roleOf[msg.sender] == Role.Admin, "admin only");
        _;
    }

    constructor() {
        owner = msg.sender;
        roleOf[msg.sender] = Role.Admin;
        emit RoleSet(msg.sender, uint8(Role.Admin));
    }

    /// @notice กำหนดบทบาทให้กระเป๋า (ผู้ดูแลระบบเท่านั้น)
    /// @dev การให้หรือถอนสิทธิ์ผู้ดูแลระบบทำได้เฉพาะเจ้าของสัญญา
    function setRole(address who, Role r) external onlyAdmin {
        require(who != address(0), "zero address");
        require(
            (r != Role.Admin && roleOf[who] != Role.Admin) || msg.sender == owner,
            "owner only for admin role"
        );
        roleOf[who] = r;
        emit RoleSet(who, uint8(r));
    }

    /// @notice เกษตรกรลงทะเบียนล็อตใหม่ (info เป็น JSON ของข้อมูลการผลิตและการรับรอง)
    function registerLot(string calldata lot, string calldata status, string calldata info) external {
        require(roleOf[msg.sender] == Role.Farmer, "farmer only");
        Lot storage L = lots[lot];
        require(!L.exists, "lot exists");
        L.exists = true;
        L.holder = msg.sender;
        L.status = status;
        _log(lot, Kind.Register, address(0), status, info);
    }

    /// @notice ผู้ถือครองส่งมอบให้ผู้รับ ผู้รับต้องมาเรียก acceptTransfer เอง
    function initTransfer(string calldata lot, address to) external {
        Lot storage L = lots[lot];
        require(L.exists, "no lot");
        require(L.holder == msg.sender, "not holder");
        require(L.pending == address(0), "transfer pending");
        Role from = roleOf[msg.sender];
        Role dest = roleOf[to];
        if (L.recalled) {
            // ระหว่างเรียกคืน: จัดจำหน่าย -> ขนส่ง -> เกษตรกร เท่านั้น
            require(
                (from == Role.Distributor && dest == Role.Transporter) ||
                (from == Role.Transporter && dest == Role.Farmer),
                "recall: return route only"
            );
        } else {
            require(
                (from == Role.Farmer && dest == Role.Transporter) ||
                (from == Role.Transporter && dest == Role.Distributor),
                "invalid route"
            );
        }
        L.pending = to;
        _log(lot, Kind.TransferInit, to, L.status, "");
    }

    /// @notice ผู้รับยืนยันการรับสินค้า ทำให้เป็นผู้ถือครองใหม่
    function acceptTransfer(string calldata lot, string calldata status) external {
        Lot storage L = lots[lot];
        require(L.exists && L.pending == msg.sender, "not pending receiver");
        L.holder = msg.sender;
        L.pending = address(0);
        L.status = status;
        _log(lot, Kind.TransferAccept, address(0), status, "");
    }

    /// @notice ผู้รับปฏิเสธการรับมอบ ล็อตกลับเป็นของผู้ส่งเดิม (ไม่เปลี่ยนผู้ถือครอง)
    function rejectTransfer(string calldata lot, string calldata note) external {
        Lot storage L = lots[lot];
        require(L.exists && L.pending == msg.sender, "not pending receiver");
        L.pending = address(0);
        _log(lot, Kind.Reject, address(0), L.status, note);
    }

    /// @notice ผู้ถือครองอัปเดตสถานะ เช่น อยู่ระหว่างขนส่ง ถึงคลังสินค้า
    function updateStatus(string calldata lot, string calldata status, string calldata note) external {
        Lot storage L = lots[lot];
        require(L.exists && L.holder == msg.sender && L.pending == address(0), "not holder");
        L.status = status;
        _log(lot, Kind.Status, address(0), status, note);
    }

    /// @notice ผู้จัดจำหน่ายขอเรียกคืนล็อต พร้อมเหตุผล
    function requestRecall(string calldata lot, string calldata reason) external {
        Role r = roleOf[msg.sender];
        require(r == Role.Distributor || r == Role.Admin, "distributor or admin only");
        Lot storage L = lots[lot];
        require(L.exists && !L.recalled, "bad recall state");
        _log(lot, Kind.RecallRequest, address(0), L.status, reason);
    }

    /// @notice ผู้ดูแลระบบอนุมัติการเรียกคืน
    function approveRecall(string calldata lot, string calldata reason) external onlyAdmin {
        Lot storage L = lots[lot];
        require(L.exists && !L.recalled, "bad recall state");
        L.recalled = true;
        _log(lot, Kind.RecallApprove, address(0), L.status, reason);
    }

    /// @notice ผู้ดูแลระบบไม่อนุมัติการเรียกคืน (บันทึกไว้ในประวัติ ล็อตไม่เปลี่ยนสถานะ)
    function rejectRecall(string calldata lot, string calldata reason) external onlyAdmin {
        Lot storage L = lots[lot];
        require(L.exists, "no lot");
        _log(lot, Kind.RecallReject, address(0), L.status, reason);
    }

    /// @notice ผู้ดูแลระบบปิดการเรียกคืน
    function closeRecall(string calldata lot, string calldata note) external onlyAdmin {
        Lot storage L = lots[lot];
        require(L.exists && L.recalled, "not recalled");
        L.recalled = false;
        _log(lot, Kind.RecallClose, address(0), L.status, note);
    }

    /// @notice ผู้ถือครองบันทึกการทำลายสินค้า
    function dispose(string calldata lot, string calldata note) external {
        Lot storage L = lots[lot];
        require(L.exists && L.holder == msg.sender && L.pending == address(0), "not holder");
        _log(lot, Kind.Dispose, address(0), L.status, note);
    }

    /// @notice ข้อมูลปัจจุบันของล็อต
    function lotInfo(string calldata lot)
        external
        view
        returns (bool exists, address holder, address pending, bool recalled, string memory status)
    {
        Lot storage L = lots[lot];
        return (L.exists, L.holder, L.pending, L.recalled, L.status);
    }

    /// @notice จำนวนเหตุการณ์ของล็อต
    function eventCount(string calldata lot) external view returns (uint256) {
        return evs[lot].length;
    }

    /// @notice อ่านเหตุการณ์ลำดับที่ i ของล็อต
    function getEvent(string calldata lot, uint256 i)
        external
        view
        returns (
            uint8 kind,
            address actor,
            address to,
            string memory status,
            string memory note,
            uint256 ts,
            bytes32 prev,
            bytes32 hash
        )
    {
        Ev storage e = evs[lot][i];
        return (uint8(e.kind), e.actor, e.to, e.status, e.note, e.ts, e.prev, e.hash);
    }

    /// @dev บันทึกเหตุการณ์ และคำนวณ hash จากข้อมูลทั้งหมดรวม hash ก่อนหน้า
    /// hash = keccak256(abi.encode(prev, lot, kind, actor, to, status, note, ts))
    function _log(string memory lot, Kind k, address to, string memory status, string memory note) internal {
        bytes32 p = head;
        bytes32 h = keccak256(abi.encode(p, lot, uint8(k), msg.sender, to, status, note, block.timestamp));
        evs[lot].push(Ev({
            kind: k,
            actor: msg.sender,
            to: to,
            status: status,
            note: note,
            ts: block.timestamp,
            prev: p,
            hash: h
        }));
        head = h;
        emit Logged(lot, uint8(k), msg.sender, h);
    }
}
