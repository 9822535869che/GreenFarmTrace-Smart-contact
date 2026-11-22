/* ---------- Static config ---------- */
const ICONS={
  home:'<path d="M3 10.5 12 3l9 7.5V21H3z"/><path d="M9 21v-6h6v6"/>',
  box:'<path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7.5 12 12.5l8.7-5M12 22V12.5"/>',
  truck:'<path d="M2 6h12v10H2zM14 10h4l4 4v2h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  qr:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM20 14v7M14 20h3"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12"/>',
  store:'<path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 21V11M19 21V11M9 21v-6h6v6"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  back:'<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'
};
const ROLES={
  farmer:{label:'เกษตรกร',title:'บันทึกข้อมูลผลผลิต',desc:'ลงทะเบียนรหัสล็อตและส่งมอบให้ผู้ขนส่ง',next:'transporter',perms:['register','send'],icon:'leaf'},
  transporter:{label:'ผู้ขนส่ง',title:'อัปเดตสถานะการขนส่ง',desc:'รับมอบจากเกษตรกรและส่งต่อให้ผู้จัดจำหน่าย',next:'distributor',perms:['receive','send'],icon:'truck'},
  distributor:{label:'ผู้จัดจำหน่าย',title:'ตรวจสอบและจัดจำหน่าย',desc:'รับเข้าคลัง ส่งถึงร้านค้า และระบุล็อตที่ต้องเรียกคืน',next:null,perms:['receive','status','recall'],icon:'store'},
  admin:{label:'ผู้ดูแลระบบ',title:'จัดการข้อมูลทั้งหมด',desc:'กำหนดสิทธิ์ผู้ใช้งานและตรวจสอบห่วงโซ่ประวัติ',next:null,perms:['manage','recall'],icon:'shield'}
};
ROLES.guest={label:'ยังไม่ได้รับบทบาท',title:'ยังไม่ได้รับบทบาท',desc:'ติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์การใช้งาน',next:null,perms:[],icon:'shield'};
const STAKE_ROLES=['farmer','transporter','distributor'];
const CHECK_OPTS='<option value="">เลือกผล</option><option value="pass">ผ่าน</option><option value="fail">ไม่ผ่าน</option>';
const RETURN_REASONS=['สินค้าไม่ตรงกับที่สั่ง','คุณภาพไม่ผ่านเกณฑ์','ฉลากหรือเอกสารไม่ถูกต้อง','ไม่สามารถรับได้ตามเวลาที่กำหนด'];
const DEFAULT_PERMS=Object.fromEntries(Object.entries(ROLES).map(([k,v])=>[k,v.perms]));
const PERM_LABEL={register:'ลงทะเบียนสินค้า',send:'ส่งมอบ',receive:'รับมอบ',status:'อัปเดตสถานะ',recall:'เรียกคืนสินค้า',manage:'จัดการผู้ใช้'};
const ALL_PERMS=Object.keys(PERM_LABEL);
const STATUSES=['เก็บเกี่ยวแล้ว','อยู่ระหว่างขนส่ง','ถึงคลังสินค้า','ส่งถึงร้านค้า'];
const STEP_ICON=['leaf','truck','home','store'];
const EVT={REGISTER:'ลงทะเบียนล็อตสินค้า',TRANSFER_INIT:'ส่งมอบ (รอการยืนยัน)',TRANSFER_ACCEPT:'รับมอบสินค้า',STATUS:'อัปเดตสถานะ',RECALL:'เรียกคืนสินค้า',RECALL_APPROVE:'อนุมัติการเรียกคืน',RECALL_REJECT:'ไม่อนุมัติการเรียกคืน',RECALL_CLOSE:'ปิดการเรียกคืน',TRANSFER_RETURN:'คืนสินค้าให้ผู้ส่งมอบ',RETURN_TO_FARMER:'ส่งสินค้าคืนให้เกษตรกร',RETURN_DONE:'ส่งคืนสินค้าสำเร็จ',SHIP_SHOP:'ส่งถึงร้านค้า',DISPOSE:'บันทึกการทำลายสินค้าเสียหาย'};
const REASONS=RETURN_REASONS;
const REASONS_OLD=['ตรวจพบสารตกค้างเกินมาตรฐาน','ตรวจพบเชื้อจุลินทรีย์ปนเปื้อน','ฉลากหรือบรรจุภัณฑ์ไม่ถูกต้อง','ข้อมูลการรับรองไม่ถูกต้อง'];
const CERTS=['GAP','Organic Thailand','GMP','ไม่มีการรับรอง'];
const PRODUCTS=['ผักสลัด','มะเขือเทศ','แตงกวา','พริกหวาน','ผักกาดหอม','ผักคะน้า','ผักบุ้ง'];

/* ---------- Utilities ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
const fmt=iso=>new Date(iso).toLocaleString('th-TH-u-ca-gregory',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Asia/Bangkok'});
const fmtDate=s=>new Date(s+'T00:00:00+07:00').toLocaleDateString('th-TH-u-ca-gregory',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'Asia/Bangkok'});
const at=(d,h,m=0)=>new Date(`${d}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00+07:00`).toISOString();

/* Demo hash (cyrb53). Good for a prototype; a production ledger would use SHA-256 plus consensus. */
function cyrb53(str,seed=0){
  let h1=0xdeadbeef^seed,h2=0x41c6ce57^seed;
  for(let i=0;i<str.length;i++){const ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677);}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);
  h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);
  return (4294967296*(2097151&h2)+(h1>>>0)).toString(16).padStart(14,'0');
}
const FIELDS=['index','ts','type','lot','from','to','actor','status','note','prev'];
const hashOf=b=>cyrb53(JSON.stringify(FIELDS.map(k=>b[k]??null)));

/* ---------- State ---------- */
let S;
const U=id=>S.users.find(u=>u.id===id);
const cur=()=>U(S.me);
const can=p=>cur().perms.includes(p);
const lot=code=>S.lots.find(l=>l.code===code);
const sel=()=>lot(S.selected)??S.lots[0];
const nameOf=id=>U(id)?.name??'—';
const orgOf=id=>U(id)?.org??'—';
const productOf=code=>lot(code)?.product??'—';
const blocksOf=code=>S.chain.filter(b=>b.lot===code);
const lastTs=code=>blocksOf(code).at(-1)?.ts;
const openRecalls=()=>S.recalls.filter(r=>r.status==='กำลังเรียกคืน');
const openReason=code=>S.recalls.find(r=>r.lot===code&&r.status==='กำลังเรียกคืน')?.reason;
const nextCode=()=>'GF-2026-'+String(Math.max(0,...S.lots.map(l=>+l.code.slice(-3)))+1).padStart(3,'0');
const pillOf=L=>{
  const st=L.recalled?'เรียกคืน':L.status;
  const c={'เรียกคืน':'p-recall','เก็บเกี่ยวแล้ว':'p-harvest','อยู่ระหว่างขนส่ง':'p-transit','ถึงคลังสินค้า':'p-ware','ส่งถึงร้านค้า':'p-shop','ส่งคืนสำเร็จ':'p-shop'}[st];
  return `<span class="pill ${c}">${st}</span>`;
};

/* ---------- Ledger operations (every change appends one block) ---------- */
const CHAIN_Q=[]; let CHAIN_BUSY=false;
function backlogQueue(){ S.chain.forEach(b=>{ if(!b.onchain&&!CHAIN_Q.includes(b)) CHAIN_Q.push(b); }); }
function chainQueue(b){ if(!CHAIN_Q.includes(b)) CHAIN_Q.push(b); chainFlush(); }
async function chainFlush(){
  if(CHAIN_BUSY||!W.addr||typeof ethers==='undefined'||CONTRACT_ADDRESS.startsWith('0x0000000000')) return;
  CHAIN_BUSY=true;
  try{
    while(CHAIN_Q.length){
      const b=CHAIN_Q[0];
      try{
        const provider=new ethers.BrowserProvider(window.ethereum);
        const signer=await provider.getSigner();
        const c=new ethers.Contract(CONTRACT_ADDRESS,TRACE_ABI,signer);
        const payload={...b,who:orgOf(b.actor),fromName:b.from?orgOf(b.from):null,toName:b.to?orgOf(b.to):null};
        const tx=await c.recordEvent(b.lot,JSON.stringify(payload));
        W.tx=tx.hash; W.msg=`กำลังบันทึกบล็อก #${b.index}…`; render();
        await tx.wait();
        b.onchain=true; CHAIN_Q.shift();
        W.msg=`บันทึกบล็อก #${b.index} ลงบล็อกเชนแล้ว (เหลือคิว ${CHAIN_Q.length})`;
      }catch(err){ W.msg='บันทึกไม่สำเร็จ: '+(err.shortMessage||err.message||String(err)); break; }
    }
  } finally { CHAIN_BUSY=false; render(); }
}
function addBlock(ev,ts){
  const b={index:S.chain.length,ts,type:ev.type,lot:ev.lot,from:ev.from??null,to:ev.to??null,actor:ev.actor??null,status:ev.status??null,note:ev.note??null,prev:S.chain.length?S.chain.at(-1).hash:'0'.repeat(14)};
  b.hash=hashOf(b);
  S.chain.push(b);
  return b;
}
function opRegister(d,actor,ts){
  S.lots.push({...d,holder:actor,pending:null,status:STATUSES[0],recalled:false});
  addBlock({type:'REGISTER',lot:d.code,to:actor,actor,status:STATUSES[0],note:`${d.product} · ${d.cert}`},ts);
}
function opInit(code,toId,ts){
  const L=lot(code);
  L.pending=toId;
  addBlock({type:'TRANSFER_INIT',lot:code,from:L.holder,to:toId,actor:L.holder,status:L.status,note:'ผู้ส่งยืนยันการส่งมอบ รอผู้รับยืนยัน'},ts);
}
function opAccept(code,ts,note,extra={}){
  const L=lot(code),me=L.pending,st=extra.status??(U(me).role==='transporter'?STATUSES[1]:STATUSES[2]);
  addBlock({type:'TRANSFER_ACCEPT',lot:code,from:L.holder,to:me,actor:me,status:st,note:note||'ผู้รับยืนยันการรับมอบสินค้า'},ts);
  Object.assign(L,{holder:me,pending:null,status:st,remaining:L.qty??0},extra);
}
function opStatus(code,st,actor,ts,note){
  const L=lot(code);
  L.status=st;
  addBlock({type:'STATUS',lot:code,to:L.holder,actor,status:st,note},ts);
}
function opShip(code,shop,qty,actor,ts){
  const L=lot(code);
  L.remaining-=qty;
  if(L.remaining<=0) L.status=STATUSES[3];
  addBlock({type:'SHIP_SHOP',lot:code,actor,status:L.status,note:`ส่งให้ ${shop} ${qty} กก. · คงเหลือ ${L.remaining} กก.`},ts);
}
function opDispose(code,actor,ts){
  const L=lot(code), kg=L.damaged||0;
  L.disposedKg=(L.disposedKg||0)+kg;
  L.damaged=0;
  addBlock({type:'DISPOSE',lot:code,actor,status:L.status,note:`ทำลายสินค้าเสียหาย ${kg} กก.`},ts);
}
function opRecall(code,reason,note,actor,ts){
  const L=lot(code);
  
  S.recalls.unshift({id:'RC-'+String(S.recalls.length+1).padStart(3,'0'),lot:code,reason,note,by:actor,status:'รออนุมัติ',ts});
  addBlock({type:'RECALL',lot:code,actor,status:'เรียกคืน',note:reason+(note?` — ${note}`:'')},ts);
}
function opApprove(id,actor,ts){
  const r=S.recalls.find(x=>x.id===id);
  r.status='กำลังเรียกคืน';
  lot(r.lot).recalled=true;
  S.popup={title:'มีการเรียกคืนสินค้าใหม่',body:`ล็อต ${r.lot} (${productOf(r.lot)}) · ${r.reason}`};
  addBlock({type:'RECALL_APPROVE',lot:r.lot,actor,status:'เรียกคืน',note:`อนุมัติการเรียกคืน ${r.id}`},ts);
}
function opReject(id,actor,ts,reason){
  const r=S.recalls.find(x=>x.id===id);
  r.status='ไม่อนุมัติ';
  if(reason) r.note=[r.note,reason].filter(Boolean).join(' · ');
  addBlock({type:'RECALL_REJECT',lot:r.lot,actor,status:lot(r.lot).status,note:`ไม่อนุมัติการเรียกคืน ${r.id}${reason?` — ${reason}`:''}`},ts);
}
function opCloseRecall(id,actor,ts){
  const r=S.recalls.find(x=>x.id===id);
  r.status='เรียกคืนแล้ว';
  const L=lot(r.lot);
  L.recalled=S.recalls.some(x=>x.lot===r.lot&&x.status==='กำลังเรียกคืน');
  addBlock({type:'RECALL_CLOSE',lot:r.lot,actor,status:L.status,note:`ปิดการเรียกคืน ${r.id}`},ts);
}
function opReturn(code,reason,ts){
  const L=lot(code), rejected=L.pending;
  L.pending=null;
  addBlock({type:'TRANSFER_RETURN',lot:code,from:L.holder,to:rejected,actor:rejected,status:L.status,note:`ผู้รับคืนสินค้า: ${reason}`},ts);
}
function opReturnPickup(code,actor,ts){
  const L=lot(code), from=L.holder;
  L.pending=null;
  addBlock({type:'RETURN_TO_FARMER',lot:code,from,to:L.farmer,actor,status:L.status,note:'ผู้ขนส่งสินค้าคืนให้เกษตรกรตามการเรียกคืน'},ts);
}
function opReturnDone(code,actor,ts){
  const L=lot(code), from=L.holder;
  L.holder=L.farmer;
  addBlock({type:'RETURN_DONE',lot:code,from,to:L.farmer,actor,status:L.status,note:'ส่งคืนสินค้าให้เกษตรกรสำเร็จ'},ts);
}
function verify(){
  let prev='0'.repeat(14);
  for(const b of S.chain){
    if(b.prev!==prev) return {ok:false,at:b.index,why:'ลิงก์กับบล็อกก่อนหน้าไม่ตรงกัน'};
    if(hashOf(b)!==b.hash) return {ok:false,at:b.index,why:'ข้อมูลในบล็อกไม่ตรงกับแฮช (ถูกแก้ไข)'};
    prev=b.hash;
  }
  return {ok:true,at:-1};
}
function tamper(){
  if(S.tampered){
    S.chain[S.tampered.index].status=S.tampered.original;
    S.tampered=null;
    return 'คืนค่าข้อมูลเดิมในบล็อกแล้ว';
  }
  const i=S.chain.findIndex(b=>b.lot==='GF-2026-001'&&b.type==='STATUS');
  S.tampered={index:i,original:S.chain[i].status};
  S.chain[i].status=STATUSES[0];
  return 'จำลองการแก้ไขสถานะในบล็อกแล้ว ไปที่หน้าประวัติเพื่อดูผลการตรวจสอบ';
}

/* ---------- Seed data (mirrors the dashboard sample) ---------- */
function seed(){
  for(const k in ROLES) ROLES[k].perms=[...DEFAULT_PERMS[k]];
  S={me:'u6',view:'dash',selected:'GF-2026-002',ledgerCode:null,recallQueue:[],tampered:null,lots:[],chain:[],recalls:[],
    users:[
      {id:'u1',name:'คุณสุภาวดี ใจดี',org:'สวนสุภาวดี จ.เชียงใหม่',role:'farmer',wallet:'0x3b9e0d7a14c2f85e60b9a3d1f7c4e28b05a7d1f4'},
      {id:'u2',name:'คุณสมชาย ไร่ทอง',org:'ไร่สมชาย จ.ราชบุรี',role:'farmer',wallet:'0xc41a7e92f0b35d86a2e7c10f9b4d63e8a25e0b7c'},
      {id:'u3',name:'คุณกิตติ สวนเขียว',org:'สวนกิตติ จ.นครปฐม',role:'farmer',wallet:'0x2e5a9c81d07b43f6a1e90d7c35b28f4e6a1d0c93'},
      {id:'u4',name:'คุณวิชัย ขนส่งเร็วใจ',org:'ขนส่งเร็วใจ จำกัด',role:'transporter',wallet:'0x9d2f6b03e8a14c7f5d90b2e6a31c8f74d0b6a28e'},
      {id:'u5',name:'คุณนภา คลังกลาง',org:'GreenFarm Supply Chain',role:'distributor',wallet:'0x51e8c4a27b09d3f6e1a85c20b7d94f3e6c1a0d58'},
      {id:'u6',name:'ผู้ดูแลระบบ',org:'GreenFarm Trace',role:'admin',wallet:'0x7f3a51c0b2d84e9fa1c63b07d5e28a41e7e19c2e'}
    ].map(u=>({...u,perms:[...DEFAULT_PERMS[u.role]]}))};

  opRegister({code:'GF-2026-001',product:'ผักสลัด',farm:'สวนสุภาวดี จ.เชียงใหม่',farmer:'u1',harvest:'2026-11-01',cert:'GAP · CM-2026-0182',qty:80},'u1',at('2026-11-01',7,30));
  opInit('GF-2026-001','u4',at('2026-11-01',9));
  opAccept('GF-2026-001',at('2026-11-01',10,15));
  opInit('GF-2026-001','u5',at('2026-11-02',8));
  opAccept('GF-2026-001',at('2026-11-02',14,20));
  opShip('GF-2026-001','ร้านผักสดสุขใจ',80,'u5',at('2026-11-03',6,45));

  opRegister({code:'GF-2026-002',product:'มะเขือเทศ',farm:'ไร่สมชาย จ.ราชบุรี',farmer:'u2',harvest:'2026-10-31',cert:'Organic Thailand · RB-2026-0457',qty:60},'u2',at('2026-10-31',6,50));
  opInit('GF-2026-002','u4',at('2026-10-31',8,10));
  opAccept('GF-2026-002',at('2026-10-31',9,5));
  opRecall('GF-2026-002','ตรวจพบสารตกค้างเกินมาตรฐาน','ผลตรวจห้องปฏิบัติการ ล็อตนี้','u5',at('2026-11-04',16));
S.recalls[0].status='กำลังเรียกคืน';
lot('GF-2026-002').recalled=true;
addBlock({type:'RECALL_APPROVE',lot:'GF-2026-002',actor:'u6',status:'เรียกคืน',note:'อนุมัติการเรียกคืน RC-001'},at('2026-11-04',17));

  opRegister({code:'GF-2026-003',product:'แตงกวา',farm:'สวนกิตติ จ.นครปฐม',farmer:'u3',harvest:'2026-10-30',cert:'GAP · NP-2026-0931',qty:95},'u3',at('2026-10-30',6,40));
  opInit('GF-2026-003','u4',at('2026-10-30',7,30));
  opAccept('GF-2026-003',at('2026-10-30',8,20));
  opInit('GF-2026-003','u5',at('2026-10-30',10));
  opAccept('GF-2026-003',at('2026-10-30',13,45));

  opRegister({code:'GF-2026-004',product:'พริกหวาน',farm:'สวนสุภาวดี จ.เชียงใหม่',farmer:'u1',harvest:'2026-11-14',cert:'GAP · CM-2026-0182',qty:40},'u1',at('2026-11-14',6,30));
  opInit('GF-2026-004','u4',at('2026-11-14',7));

  opRegister({code:'GF-2026-005',product:'ผักกาดหอม',farm:'สวนกิตติ จ.นครปฐม',farmer:'u3',harvest:'2026-11-15',cert:'GMP · NP-2026-1107',qty:30},'u3',at('2026-11-15',6,20));

  opRegister({code:'GF-2026-006',product:'ฝรั่ง',farm:'ไร่สมชาย จ.ราชบุรี',farmer:'u2',harvest:'2026-11-18',cert:'GAP · RB-2026-0612',qty:120},'u2',at('2026-11-18',6,30));
  opInit('GF-2026-006','u4',at('2026-11-18',8));
  opAccept('GF-2026-006',at('2026-11-18',9,10));
  opInit('GF-2026-006','u5',at('2026-11-19',14,30));
}

/* ---------- Navigation (visibility follows permissions) ---------- */
const NAV=[
  {id:'dash',label:'ภาพรวม',icon:'home',ok:()=>true},
  {id:'register',label:'ลงทะเบียนสินค้า',icon:'box',ok:()=>can('register')},
  {id:'receive',label:'ตรวจสอบสินค้า',icon:'box',ok:()=>can('receive')},
  {id:'received',label:'คลังสินค้า',icon:'check',ok:()=>can('receive')&&cur().role!=='transporter'},
  
  {id:'transfer',label:'ส่งมอบสินค้า',icon:'truck',ok:()=>can('send')||can('receive')||can('status')},
  {id:'returns',label:'ส่งคืนสินค้า',icon:'back',ok:()=>cur().role==='transporter'},
  {id:'farmerReturns',label:'คืนสินค้า',icon:'back',ok:()=>cur().role==='farmer'},
  {id:'ledger',label:'ประวัติการตรวจสอบ',icon:'clock',ok:()=>true},
  {id:'qr',label:'QR Code',icon:'qr',ok:()=>true},
  {id:'recall',label:'เรียกคืนสินค้า',icon:'alert',ok:()=>can('recall')},
  {id:'users',label:'จัดการผู้ใช้งาน',icon:'users',ok:()=>can('manage')},
  {id:'settings',label:'ตั้งค่า',icon:'gear',ok:()=>cur().role!=='transporter'}
];

/* ---------- Views ---------- */
const stat=(label,val,tone,icon)=>`<div class="stat"><div class="si" style="background:var(--${tone}-soft);color:var(--${tone})">${svg(icon)}</div><div><small>${label}</small><strong>${val}</strong></div></div>`;
const lotSelect=(lots=S.lots,withSelect=true)=>`<div class="inline lot-pick"><div class="search lot-search" style="width:250px;height:40px;min-width:0;max-width:none;border:1.5px solid #2f7d4f;background:#f1f8f3;border-radius:10px"><input data-lot-search style="background:transparent;border:0;outline:none;color:#1f2d24" placeholder="รหัสล็อต หรือชื่อสินค้า" aria-label="ค้นหาล็อต"></div><button type="button" data-act="lotSearch" aria-label="ค้นหา" style="width:40px;height:40px;flex:0 0 40px;border:1.5px solid #2f7d4f;background:#f1f8f3;border-radius:10px;color:#2f7d4f;cursor:pointer;display:grid;place-items:center;padding:0;margin-left:-4px"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>${withSelect?`<select data-select="lot" aria-label="เลือกล็อตสินค้า" style="width:auto;min-width:200px">${lots.map(l=>`<option value="${l.code}" ${l.code===sel().code?'selected':''}>${l.code} · ${esc(l.product)}</option>`).join('')}</select>`:''}</div>`;

function roleBtn(k,r){
  const on=cur().role===k;
  return `<button class="rolebtn ${on?'on':''}" data-act="role" data-role="${k}" ${on?'aria-current="true"':''}>
    <span class="rico">${svg(r.icon)}</span><span><b>${r.label}</b><small>${r.title}</small></span>
  </button>`;
}

const EMPTY_LOT={code:'—',product:'—',farm:'—',harvest:null,status:'',holder:null,pending:null,recalled:false,qty:null,remaining:null,damaged:0,cert:'—',farmer:null};
function viewDash(){
  const L=sel()||EMPTY_LOT, idx=STATUSES.indexOf(L.status), open=openRecalls(), cnt=st=>S.lots.filter(l=>!l.recalled&&l.status===st).length;
  const rows=[...S.lots].sort((a,b)=>a.code.localeCompare(b.code)).map((l,i)=>`<tr class="click ${l.code===L.code?'sel':''}" data-act="select" data-code="${l.code}">
    <td>${i+1}</td><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${esc(l.farm)}</td><td>${pillOf(l)}</td><td>${fmtDate(l.harvest)}</td>
    <td><button class="btn btn-sm ghost" data-act="qrof" data-code="${l.code}" aria-label="ดู QR Code ${l.code}">${svg('qr')}</button></td></tr>`).join('');
  const bsL=blocksOf(L.code), hasRec=S.recalls.some(r=>r.lot===L.code), recNow=!!openReason(L.code);
  const jdone=[
    bsL.some(b=>b.type==='REGISTER'),
    bsL.some(b=>b.type==='TRANSFER_ACCEPT'&&U(b.actor)?.role==='transporter'),
    bsL.some(b=>b.type==='TRANSFER_ACCEPT'&&U(b.actor)?.role==='distributor')||U(L.holder)?.role==='distributor',
    bsL.some(b=>b.type==='SHIP_SHOP')&&!hasRec
  ];
  const jlast=jdone.lastIndexOf(true), jicons=['leaf','truck','home','store'];
  const jsteps=STATUSES.map((s,i)=>({s,i})).filter(x=>!(hasRec&&x.i===3)).map(({s,i})=>`<div class="st ${jdone[i]?'done':''} ${i===jlast&&!hasRec?'now':''}"><div class="dotc">${svg(jicons[i])}</div>${s}</div>`);
  const rtfD=bsL.some(b=>b.type==='TRANSFER_INIT'&&U(b.to)?.role==='farmer'), doneD=bsL.some(b=>b.type==='TRANSFER_ACCEPT'&&U(b.actor)?.role==='farmer');
  if(hasRec||rtfD){
    const ph=(cls,icon,label)=>`<div class="st ${cls}"><div class="dotc">${svg(icon)}</div>${label}</div>`;
    jsteps.push(ph(recNow&&!rtfD?'now':'done','alert','เรียกคืนสินค้า'));
    jsteps.push(ph(doneD?'done':(rtfD?'now':''),'truck','กำลังส่งคืน'));
  }
  const lastOn=jsteps.reduce((m,s,k)=>/class="st [^"]*(done|now)/.test(s)?k:m,-1);
  jsteps.forEach((s,k)=>{ if(k<=lastOn) jsteps[k]=s.replace('class="st ','class="st done '); });
  const steps=jsteps.join('');
  const fillW=jlast<0?0:(jlast/(STATUSES.length-1))*75;
  const r=open[0];
  const pendN=can('manage')?S.recalls.filter(x=>x.status==='รออนุมัติ').length:0;
  const pendCard=pendN?`<div class="card alert-card" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><div class="warn-ico">${pendN}</div><div style="flex:1;min-width:200px"><h3 style="margin:0 0 4px;color:var(--red)">มีคำขอเรียกคืนรอการอนุมัติ</h3><p class="muted" style="margin:0">รอคุณอนุมัติ ${pendN} รายการ</p></div><button class="btn red btn-sm" data-act="go" data-view="recall">ไปหน้าเรียกคืนสินค้า</button></div>`:'';
  return `
  <section class="hero">
    <div>
      <h1>ตรวจสอบย้อนกลับสินค้าเกษตรปลอดภัย</h1>
      <p>โปร่งใสทุกขั้นตอน ตั้งแต่แปลงเกษตรถึงมือผู้บริโภค</p>
      <button class="btn" data-act="go" data-view="qr">${svg('qr')} ตรวจสอบสินค้าเลย →</button>
    </div>
    <svg class="hero-art" viewBox="0 0 330 190" aria-hidden="true">
      <ellipse cx="165" cy="178" rx="150" ry="10" fill="#0f3d2a" opacity=".15"/>
      <rect x="30" y="118" width="270" height="52" rx="6" fill="#b07d45"/>
      <path d="M30 134h270M30 152h270" stroke="#8c5f30" stroke-width="3"/>
      <circle cx="88" cy="104" r="30" fill="#e5484d"/>
      <circle cx="150" cy="94" r="34" fill="#f04e3e"/>
      <circle cx="214" cy="106" r="26" fill="#f5b400"/>
      <path d="M248 92c18-30 44-30 56-22-10 22-30 34-56 22z" fill="#2f9e4f"/>
      <path d="M60 100c-30-20-12-60 20-54 14 2 14 24 0 40-6 8-14 14-20 14z" fill="#3f9d4a"/>
      <ellipse cx="282" cy="108" rx="14" ry="30" fill="#4caf50" transform="rotate(20 282 108)"/>
      <path d="M120 66c8-18 26-22 40-14-6 16-24 22-40 14z" fill="#6bbf59"/>
    </svg>
  </section>
  <section class="stats" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
    ${stat('ล็อตสินค้าทั้งหมด',S.lots.length,'leaf','leaf')}
    ${cur().role==='transporter'?stat('รอรับจากเกษตรกร',S.lots.filter(l=>l.pending===S.me).length,'amber','truck'):stat('อยู่ระหว่างขนส่ง',cnt('อยู่ระหว่างขนส่ง'),'blue','truck')}
    ${cur().role==='transporter'?stat('อยู่ในความดูแลของฉัน',S.lots.filter(l=>l.holder===S.me&&!l.pending).length,'leaf','store'):stat('ถึงคลังสินค้า',cnt('ถึงคลังสินค้า'),'amber','home')}
    ${stat('ล็อตเรียกคืน',open.length,'red','alert')}
    ${stat('ส่งคืนสำเร็จ',S.lots.filter(l=>l.status==='ส่งคืนสำเร็จ').length,'shop','back')}
  </section>
  <section class="grid">
    <div class="card">
      <div class="card-head"><h3>รายการล็อตสินค้า</h3><button class="btn btn-sm ghost" data-act="go" data-view="ledger">ดูประวัติทั้งหมด →</button></div>
      <div class="tw"><table>
        <thead><tr><th>ลำดับ</th><th>รหัสล็อต</th><th>สินค้า</th><th>แหล่งผลิต</th><th>สถานะ</th><th>วันที่เก็บเกี่ยว</th><th>QR</th></tr></thead>
        <tbody>${rows||'<tr><td colspan="7" class="empty">ยังไม่มีล็อตสินค้าในระบบ</td></tr>'}</tbody>
      </table></div>
    </div>
    <div class="card">
      <div class="card-head"><h3>เส้นทางการตรวจสอบสินค้า</h3>${lotSelect()}</div>
      <div class="path"><div class="fill" style="width:${lastOn/jsteps.length*100}%"></div>${steps}</div>
      <div class="cur"><span>สถานะปัจจุบัน: ${pillOf(L)}</span><small>อัปเดตล่าสุด ${lastTs(L.code)?fmt(lastTs(L.code)):'—'}</small></div>
    </div>
  </section>
  <section class="grid-b">
    <div class="card">
      <div class="promo">
        <div class="qrbig">${svg('qr')}</div>
        <div>
          <h3>สแกน QR Code เพื่อดูประวัติ</h3>
          <p>ดูแหล่งผลิตและประวัติการเดินทางของสินค้าแบบครบถ้วน</p>
          <button class="btn leaf" data-act="go" data-view="qr" data-code="${L.code}">${svg('qr')} สแกน QR Code</button>
        </div>
      </div>
    </div>
    <div class="card ${r?'alert-card':''}">
      ${r ? `
        <div class="card-head"><h3 style="color:var(--red)">แจ้งเตือนล็อตสินค้าที่มีปัญหา</h3></div>
        <div class="alert-body">
          <div class="warn-ico">!</div>
          <div>
            <div>รหัสล็อตที่ต้องเรียกคืน: <b style="color:var(--red)">${r.lot}</b> (${esc(productOf(r.lot))})</div>
            <div>เหตุผล: ${esc(r.reason)}</div>
          </div>
        </div>
        <button class="btn red btn-sm" data-act="go" data-view="ledger" data-code="${r.lot}">ดูรายละเอียด →</button>`
      : `<div class="card-head"><h3>แจ้งเตือนล็อตสินค้าที่มีปัญหา</h3></div><p class="muted" style="margin:0">ยังไม่มีการแจ้งเตือนล็อตที่มีปัญหา</p>`}
    </div>
  </section>`;
}

function viewRegister(){
  const me=cur(), mine=S.lots.filter(l=>l.farmer===me.id);
  return `
  <section class="grid">
    <div class="card">
      <div class="card-head"><h3>ลงทะเบียนล็อตสินค้าใหม่</h3><span class="muted">รหัสล็อต <b>${nextCode()}</b> (สร้างอัตโนมัติ)</span></div>
      <form class="form" id="regForm">
        <label>ชื่อสินค้า<input name="product" list="prodList" required placeholder="เช่น ผักสลัด"></label>
        <label>วันที่เก็บเกี่ยว<input type="date" name="harvest" value="2026-11-16" required></label>
        <label class="full">แหล่งผลิต (แปลง / ฟาร์ม)<input name="farm" value="${esc(me.org)}" required></label>
        <label>ปริมาณ (กก.)<input type="number" min="0" step="0.1" name="qty" required></label>
        <label>การรับรอง<select name="cert">${CERTS.map(c=>`<option>${c}</option>`).join('')}</select></label>
        <label>เลขที่ใบรับรอง<input name="certNo" placeholder="เช่น CM-2026-0190"></label>
        <div class="btnrow"><button class="btn" type="submit">${svg('box')} บันทึกลงทะเบียนล็อต</button></div>
      </form>
      <datalist id="prodList">${PRODUCTS.map(p=>`<option value="${p}">`).join('')}</datalist>
    </div>
    <div class="card">
      <h3>ล็อตที่ฉันลงทะเบียน</h3>
      ${mine.length ? `<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>สถานะ</th></tr></thead><tbody>
        ${mine.map(l=>`<tr><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${pillOf(l)}</td></tr>`).join('')}</tbody></table></div>`
      : '<div class="empty">ยังไม่มีล็อตที่ลงทะเบียน</div>'}
    </div>
  </section>`;
}

function viewTransfer(){
  const me=cur(), next=ROLES[me.role].next;
  const holding=me.role==='farmer'?S.lots.filter(l=>blocksOf(l.code).some(b=>b.type==='REGISTER'&&b.actor===me.id)):S.lots.filter(l=>l.holder===me.id||(me.role==='transporter'&&blocksOf(l.code).some(b=>b.type==='TRANSFER_ACCEPT'&&b.actor===me.id)));
  const holdRows=holding.map(l=>{
    let action='—';
    if(l.pending) action=`<span class="muted">รอ ${esc(nameOf(l.pending))} ยืนยัน</span>`;
    else if(next && can('send')){
      const opts=S.users.filter(u=>u.role===next&&u.perms.includes('receive'));
      action=opts.length
        ? `<div class="inline"><select id="rcv-${l.code}" aria-label="ผู้รับมอบ">${opts.map(u=>`<option value="${u.id}">${esc(u.org)}</option>`).join('')}</select><button class="btn btn-sm" data-act="send" data-code="${l.code}">ส่งมอบ</button></div>`
        : '<span class="muted">ไม่มีผู้รับในบทบาทถัดไป</span>';
    }
    else if(me.role==='distributor' && can('status') && l.status===STATUSES[2])
      action=l.recalled?'<span class="muted">เรียกคืนอยู่ ส่งต่อไม่ได้</span>':`<div class="inline"><input id="shop-${l.code}" placeholder="ชื่อร้านปลายทาง" style="width:auto;min-width:160px"><input id="shq-${l.code}" type="number" min="0.1" step="0.1" max="${l.remaining??0}" placeholder="จำนวน (กก.)" style="width:auto;max-width:130px"><button class="btn btn-sm leaf" data-act="ship" data-code="${l.code}">ส่งถึงร้าน</button></div><small class="muted">คงเหลือ ${l.remaining??0} กก.</small>`;
    return `<tr ${me.role==='transporter'||me.role==='farmer'||(l.recalled&&l.holder===me.id)?`class="click" data-act="pickup" data-code="${l.code}"`:''}><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${l.qty!=null?l.qty+' กก.':'—'}</td><td>${(l.remaining??l.qty)!=null?(l.remaining??l.qty)+' กก.':'—'}</td>${me.role==='farmer'?`<td>${pillOf(l)}</td>`:''}<td>${(l.status==='ส่งคืนสำเร็จ')?'<span class="muted">ส่งคืนสำเร็จแล้ว</span>':(l.recalled&&l.holder===me.id)?'<span class="muted">เรียกคืนอยู่</span>':l.holder!==me.id?'<span class="muted">ส่งมอบแล้ว</span>':l.pending?'<span class="muted">รอยืนยัน</span>':`${(l.remaining??l.qty??0)<=0?`<button class="btn btn-sm" disabled style="opacity:.45;cursor:not-allowed">หมดจากคลัง</button>`:`<button class="btn btn-sm" data-act="go" data-view="handover" data-code="${l.code}">ส่งมอบ</button>`}`}</td></tr>`;
  }).join('');
  return `
  <section class="stack">
    <div class="card">
      <div class="card-head"><h3>สินค้าในความดูแลของฉัน</h3><span class="muted">${me.role==='transporter'?'ขนส่งและส่งมอบให้ผู้จัดจำหน่าย':me.role==='farmer'?'ส่งมอบสินค้า':ROLES[me.role].label}</span></div>
      ${holding.length ? `<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>จำนวน</th><th>คงเหลือ</th>${me.role==='farmer'?'<th>สถานะ</th>':''}<th>ส่งมอบ</th></tr></thead><tbody>${holdRows}</tbody></table></div>`
      : '<div class="empty">ยังไม่มีสินค้าในความดูแล</div>'}
    </div>
    <p class="note">กฎ: เจ้าของสินค้าจะเปลี่ยนก็ต่อเมื่อผู้รับกดยืนยัน และทุกรายการถูกบันทึกลงประวัติเพื่อตรวจย้อนหลังได้</p>
  </section>`;
}

function txFilterUI(){
  const tf=S.txFilter||[];
  const boxes=Object.entries(EVT).map(([k,label])=>`<label style="display:flex;align-items:center;gap:8px;font-weight:600;font-size:13.5px;cursor:pointer"><input type="checkbox" data-txf="${k}" ${tf.includes(k)?'checked':''} style="width:auto;margin:0"> ${label}</label>`).join('');
  return `<details class="txf" ${S.filterOpen?'open':''} style="position:relative"><summary class="btn ghost btn-sm" style="list-style:none">ตัวกรอง${tf.length?` (${tf.length})`:''}</summary><div style="position:absolute;top:calc(100% + 6px);left:0;z-index:5;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;box-shadow:0 10px 24px rgba(20,60,40,.12);display:flex;flex-direction:column;gap:10px;min-width:260px"><div class="small muted" style="font-weight:700">ประเภทธุรกรรม</div>${boxes}${tf.length?'<button type="button" class="btn btn-sm ghost" data-act="clearTxf">ล้างตัวกรอง</button>':''}</div></details>`;
}
function latestLotCode(){
  const me=cur();
  const b=S.chain.filter(x=>(me.role!=='distributor'&&me.role!=='transporter')||x.actor===me.id).at(-1);
  return b?b.lot:sel().code;
}
function viewDecisionList(){
  const rows=S.recalls.filter(r=>r.status!=='รออนุมัติ').map(r=>{
    const ok=r.status!=='ไม่อนุมัติ';
    return `<tr><td><b>${r.id}</b></td><td>${r.lot}<br><small class="muted">${esc(productOf(r.lot))}</small></td><td>${esc(r.reason)}${r.note?`<br><small class="muted">${esc(r.note)}</small>`:''}</td><td><span class="pill ${ok?'p-recall':'p-harvest'}">${ok?'อนุมัติ':'ไม่อนุมัติ'}</span></td><td>${esc(nameOf(r.by))}<br><small class="muted">${fmt(r.ts)}</small></td></tr>`;
  }).join('');
  return `<section class="stack"><div class="card"><div class="card-head"><h3>รายการที่อนุมัติและไม่อนุมัติการเรียกคืน</h3></div>${rows?`<div class="tw"><table><thead><tr><th>เลขที่</th><th>ล็อต</th><th>เหตุผล</th><th>ผลการอนุมัติ</th><th>ผู้ส่งคำขอ</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="empty">ยังไม่มีรายการที่อนุมัติหรือไม่อนุมัติ</div>'}</div></section>`;
}
function viewAdminLedger(){
  const v=verify();
  const rf=S.adminRole||'';
  const q=(S.q||'').trim().toLowerCase();
  const list=[...S.chain].reverse().filter(b=>(!rf||U(b.actor)?.role===rf)&&(!q||b.lot.toLowerCase().includes(q)||productOf(b.lot).toLowerCase().includes(q)));
  const banner=v.ok?`<div class="banner ok">${svg('check')} ห่วงโซ่สมบูรณ์ ตรวจแล้ว ${S.chain.length} บล็อก ไม่พบการแก้ไขข้อมูล</div>`:`<div class="banner bad">${svg('alert')} พบความผิดปกติที่บล็อก #${v.at}: ${v.why}</div>`;
  const opts='<option value="">ทุกบทบาท</option>'+['farmer','transporter','distributor','admin'].map(k=>`<option value="${k}" ${rf===k?'selected':''}>${ROLES[k].label}</option>`).join('');
  const items=list.map(b=>`<div class="block ${!v.ok&&v.at===b.index?'bad':''}">
      <div class="bno">#${b.index}</div>
      <div>
        <div class="btitle">${EVT[b.type]}<span class="lotc">${b.lot}</span></div>
        <div class="bsub">${b.from?`${esc(orgOf(b.from))} → ${esc(orgOf(b.to))}`:esc(orgOf(b.actor))}</div>
        <div class="bnote">${esc(b.note)}</div>
      </div>
      <div class="bmeta"><div>${fmt(b.ts)}</div><small>ผู้ทำรายการ: ${addrOf(b)}</small>${chainTag(b)}<code>${b.hash}</code><small>แชตก่อนหน้า ${b.prev}</small></div>
    </div>`).join('');
  return `<section class="stack"><div class="card"><div class="card-head"><h3>ประวัติธุรกรรมทั้งหมด</h3><div class="inline" style="flex-wrap:nowrap">${lotSelect(S.lots,false)}</div></div><div class="stack" style="gap:12px">${banner}<div class="inline"><select data-admin-role aria-label="กรองตามบทบาท" style="width:auto;min-width:200px">${opts}</select><span class="muted small">แสดง ${list.length} จาก ${S.chain.length} บล็อก</span></div></div></div><div class="card">${items||'<div class="empty">ไม่มีธุรกรรมที่ตรงกับตัวกรอง</div>'}</div></section>`;
}
// ---- MetaMask + สัญญาอัจฉริยะ (เครือข่ายทดสอบ Sepolia) ----
const CHAIN={hex:'0xaa36a7',name:'Sepolia'};
const CONTRACT_ADDRESS='0x40444cCCDF12b5280FE679984De0d689843c0BC0'; // ใส่ที่อยู่สัญญาหลัง deploy
const TRACE_ABI=[
  'function registerLot(string lot, string status, string info)',
  'function initTransfer(string lot, address to)',
  'function acceptTransfer(string lot, string status)',
  'function updateStatus(string lot, string status, string note)',
  'function requestRecall(string lot, string reason)',
  'function approveRecall(string lot, string reason)',
  'function closeRecall(string lot, string note)',
  'function dispose(string lot, string note)',
  'function rejectTransfer(string lot, string note)',
  'function rejectRecall(string lot, string reason)',
  'function setRole(address who, uint8 r)'
];
const CONTRACT_ON=()=>!CONTRACT_ADDRESS.startsWith('0x0000000000');
// ส่งธุรกรรมไปที่สัญญาก่อนบันทึกในเครื่อง ถ้าไม่สำเร็จจะไม่มีการเปลี่ยนแปลงใดๆ
let TX_LOCK=false; // ล็อกระหว่างรอยืนยันใน MetaMask และรอให้บล็อกเชนยืนยัน กันการกดซ้ำ
async function chainTx(fn,args){
  if(!CONTRACT_ON()) return true;
  if(TX_LOCK){ fail('มีรายการกำลังรอยืนยันใน MetaMask อยู่ กรุณารอให้รายการนั้นเสร็จก่อน'); return false; }
  if(typeof ethers==='undefined'){ fail('โหลดไลบรารี ethers ไม่สำเร็จ'); return false; }
  TX_LOCK=true; W.busy=true; render();
  try{
    if(!W.addr) await walletConnect(); else await walletEnsureChain();
    const want=U(S.me)?.wallet;
    if(!userIdByWallet(W.addr)) throw new Error('บัญชี MetaMask นี้ยังไม่มีบทบาทในระบบ ให้เชื่อมกระเป๋าแอดมินที่ลงทะเบียนแล้ว');
    if(want&&W.addr.toLowerCase()!==want.toLowerCase()) throw new Error('บัญชี MetaMask ไม่ตรงกับผู้ใช้งานนี้');
    if(args.some(a=>a===undefined||a===null)) throw new Error(`ข้อมูลไม่ครบสำหรับ ${fn}`);
    if(fn==='initTransfer'&&!/^0x[0-9a-fA-F]{40}$/.test(args[1])) throw new Error('ยังไม่มีที่อยู่กระเป๋าของผู้รับในข้อมูลผู้ใช้');
    const bp=new ethers.BrowserProvider(window.ethereum);
    if((await bp.getCode(CONTRACT_ADDRESS))==='0x') throw new Error('ไม่พบสัญญาที่ที่อยู่นี้บน Sepolia จึงยังไม่ได้ส่งธุรกรรม ที่อยู่ CONTRACT_ADDRESS อาจผิด');
    const signer=await bp.getSigner();
    const c=new ethers.Contract(CONTRACT_ADDRESS,TRACE_ABI,signer);
    W.busy=true; W.msg=`กำลังส่ง ${fn} ไปยังบล็อกเชน กรุณายืนยันใน MetaMask`; render();
    const tx=await c[fn](...args);
    W.tx=tx.hash; W.msg='รอการยืนยันจากบล็อกเชน...'; render();
    await tx.wait();
    W.msg=`บันทึก ${fn} บนบล็อกเชนแล้ว`;
    return true;
  }catch(e){ fail(`บันทึกบนบล็อกเชนไม่สำเร็จ: ${e.shortMessage||e.reason||e.message}`); return false; }
  finally{ TX_LOCK=false; W.busy=false; render(); }
}
const VIEWER_URL='https://claude.ai/artifact/PBU4S3b6kZzCCmXx6QES3S';
const W={addr:'',busy:false,msg:'',tx:''};
async function walletEnsureChain(){
  const cid=await window.ethereum.request({method:'eth_chainId'});
  if(cid!==CHAIN.hex) await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:CHAIN.hex}]});
}
async function walletConnect(){
  if(!window.ethereum) throw new Error('ยังไม่ได้ติดตั้ง MetaMask');
  try{ await window.ethereum.request({method:'wallet_requestPermissions',params:[{eth_accounts:{}}]}); }catch(e){}
  const accts=await window.ethereum.request({method:'eth_requestAccounts'});
  W.addr=accts[0];
  await walletEnsureChain();
  if(!W.listening&&window.ethereum.on){ W.listening=true; window.ethereum.on('accountsChanged',a=>{ W.addr=a[0]||''; W.tx=''; W.msg=a[0]?'เปลี่ยนบัญชีแล้ว เชื่อมต่อใหม่แล้ว':'MetaMask ยกเลิกการเชื่อมต่อแล้ว'; render(); }); }
}
async function chainSave(code){
  if(typeof ethers==='undefined') throw new Error('โหลดไลบรารี ethers ไม่สำเร็จ');
  if(CONTRACT_ADDRESS.startsWith('0x0000000000')) throw new Error('ยังไม่ได้ตั้งค่า CONTRACT_ADDRESS');
  if(!W.addr) await walletConnect(); else await walletEnsureChain();
  await chainFlush();
  return {hash:'', block:''};
}
function viewLedger(){
  if(can('manage')) return viewAdminLedger();
  const me=cur(), isDist=me.role==='distributor', ownOnly=isDist||me.role==='transporter', mine=b=>b.actor===me.id||b.from===me.id||b.to===me.id;
  if(!S.ledgerCode||!lot(S.ledgerCode)) S.ledgerCode=latestLotCode();
  const L=lot(S.ledgerCode), v=verify(), list=(me.role==='transporter'&&S.ledgerSort==='old'?blocksOf(L.code):[...blocksOf(L.code)].reverse()).filter(b=>(!ownOnly||b.actor===me.id)&&(!(S.txFilter||[]).length||S.txFilter.includes(b.type)));
  const myLots=S.lots.filter(l=>blocksOf(l.code).some(mine));
  const hs=['TRANSFER_INIT','TRANSFER_ACCEPT','SHIP_SHOP','TRANSFER_RETURN'];
  const qq=(S.q||'').trim().toLowerCase();
  const hits=qq?S.lots.filter(l=>l.code.toLowerCase().includes(qq)||l.product.toLowerCase().includes(qq)).filter(l=>!isDist||myLots.includes(l)):[];
  const hitRows=hits.map(l=>{ const rel=blocksOf(l.code).filter(b=>(!isDist||b.actor===me.id)&&hs.includes(b.type)); return `<tr class="click ${l.code===L.code?'sel':''}" data-act="select" data-code="${l.code}"><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${pillOf(l)}</td></tr>`; }).join('');
  const resultsHTML=qq?`<div class="card"><div class="card-head"><h3>ผลการค้นหา "${esc(S.q)}" (${hits.length} ล็อต)</h3><button class="btn btn-sm ghost" data-act="clearSearch">ล้างการค้นหา</button></div>${hits.length?`<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>สถานะ</th></tr></thead><tbody>${hitRows}</tbody></table></div>`:'<div class="empty">ไม่พบล็อตที่ตรงกับคำค้นหา</div>'}</div>`:'';
  const banner=v.ok
    ? `<div class="banner ok">${svg('check')} ห่วงโซ่สมบูรณ์ ตรวจแล้ว ${S.chain.length} บล็อก ไม่พบการแก้ไขข้อมูล</div>`
    : `<div class="banner bad">${svg('alert')} พบความผิดปกติที่บล็อก #${v.at}: ${v.why}</div>`;
  const items=list.map((b,i)=>`<div class="block ${!v.ok&&v.at===b.index?'bad':''}">
      <div class="bno">${me.role==='transporter'||me.role==='farmer'?i+1:'#'+b.index}</div>
      <div>
        <div class="btitle">${EVT[b.type]}<span class="lotc">${b.lot}</span></div>
        <div class="bsub">${b.from?`${esc(orgOf(b.from))} → ${esc(orgOf(b.to))}`:esc(orgOf(b.actor))}</div>
        <div class="bnote">${esc(b.note)}</div>
      </div>
      <div class="bmeta"><div>${fmt(b.ts)}</div><small>ผู้ทำรายการ: ${addrOf(b)}</small>${chainTag(b)}${me.role==='transporter'||me.role==='farmer'?'':`<code>${b.hash}</code><small>แฮชก่อนหน้า ${b.prev}</small>`}</div>
    </div>`).join('');
  return `
  <section class="stack">
    
    <div class="card">
      <div class="card-head"><h3>ตรวจสอบประวัติล็อต</h3><div class="inline" style="flex-wrap:nowrap">${lotSelect(S.lots,false)}</div></div>
      <div class="stack" style="gap:12px">
        ${isDist||me.role==='transporter'?'':banner}
        <div class="inline" style="justify-content:space-between;flex-wrap:wrap;gap:10px"><span class="muted small">${W.addr?`MetaMask: ${W.addr.slice(0,6)}…${W.addr.slice(-4)}`:'ยังไม่ได้เชื่อมต่อ MetaMask'}</span><div class="inline">${W.addr?'':'<button class="btn btn-sm ghost" data-act="walletConnect">เชื่อมต่อ MetaMask</button>'}</div></div>${W.msg?`<div class="muted small">${esc(W.msg)}${W.tx?` · <a href="https://sepolia.etherscan.io/tx/${W.tx}" target="_blank" rel="noopener">ดูบน Etherscan</a>`:''}</div>`:''}
        <div class="ledger-tools">
          
          ${can('manage')?`<button class="btn btn-sm ghost" data-act="tamper">${S.tampered?'คืนค่าข้อมูลเดิม':'จำลองการแก้ไขประวัติ (สาธิต)'}</button>`:''}
        </div>
      </div>
    </div>
    <div class="card-head" style="margin:0 4px"><h3 style="margin:0">รายการ</h3>${me.role==='transporter'?`<select data-sort-ledger aria-label="เรียงตามเวลา" style="width:auto;min-width:160px"><option value="new" ${S.ledgerSort!=='old'?'selected':''}>ล่าสุดก่อน</option><option value="old" ${S.ledgerSort==='old'?'selected':''}>เก่าสุดก่อน</option></select>`:''}</div>
    <div class="card">
      ${isDist&&L.holder===me.id?`<p class="note">คงเหลือในคลังตอนนี้ ${L.remaining??0} กก.</p>`:''}
      ${items || `<div class="empty">${ownOnly?'ล็อตนี้ยังไม่มีธุรกรรมที่คุณเป็นผู้ดำเนินการ':'ยังไม่มีประวัติ'}</div>`}
    </div>
  </section>`;
}

function viewQR(){
  const L=sel(), ev=blocksOf(L.code);
  const rows=ev.map(b=>`<li><div class="tl-dot"></div><div><b>${EVT[b.type]}</b>
      <div class="bsub">${b.from?`${esc(orgOf(b.from))} → ${esc(orgOf(b.to))}`:esc(orgOf(b.actor))}</div>
      <div class="bsub">${fmt(b.ts)}</div></div></li>`).join('');
  return `
  <section class="grid">
    <div class="card">
      <div class="card-head"><h3>ตรวจสอบย้อนกลับสำหรับผู้บริโภค</h3>${lotSelect()}</div>
      <div class="qrwrap">
        <div id="qrbox"></div>
        <div class="lotcode">${L.code}</div>
        <span class="muted small">จำลองการสแกน: เลือกล็อตจากรายการ ในแอปจริงจะใช้กล้องสแกน QR Code บนบรรจุภัณฑ์</span>
      </div>
      <div class="banner ${L.recalled?'bad':'ok'}">${L.recalled?`${svg('alert')} ล็อตนี้อยู่ระหว่างเรียกคืน: ${esc(openReason(L.code))}`:`${svg('check')} ไม่มีการเรียกคืนสำหรับล็อตนี้`}</div>
    </div>
    <div class="card">
      <h3>ข้อมูลสินค้า</h3>
      <dl class="info">
        <dt>สินค้า</dt><dd>${esc(L.product)}</dd>
        <dt>แหล่งผลิต</dt><dd>${esc(L.farm)}</dd>
        <dt>วันที่เก็บเกี่ยว</dt><dd>${fmtDate(L.harvest)}</dd>
        <dt>การรับรอง</dt><dd>${esc(L.cert)}</dd>
        <dt>สถานะปัจจุบัน</dt><dd>${pillOf(L)}</dd>
        <dt>ความสมบูรณ์ของประวัติ</dt><dd>${verify().ok?'ตรวจแล้ว ไม่พบการแก้ไข':'พบความผิดปกติ'}</dd>
      </dl>
      <h3 style="margin-top:20px">เส้นทางการเดินทาง</h3>
      <ol class="tl">${rows}</ol>
    </div>
  </section>`;
}

function viewRecallPage(){
  const isAdmin=can('manage');
  const pending=S.recalls.filter(r=>r.status==='รออนุมัติ');
  const queue=isAdmin?[]:(S.recallQueue||[]).filter(c=>lot(c)&&!lot(c).recalled);
  const pick=queue.includes(S.recallPick)?S.recallPick:queue.at(-1);
  const avail=S.lots.filter(l=>!l.recalled);
  const chips=(!isAdmin&&queue.length)?`<div class="card"><p class="note" style="margin:0 0 10px">รายการที่รอเรียกคืน กดเพื่อกรอกข้อมูลลงในฟอร์ม</p><div class="chips">${queue.map(c=>`<button type="button" class="btn btn-sm ${c===pick?'':'ghost'}" data-act="pickRecall" data-code="${c}">${c} · ${esc(productOf(c))}</button>`).join('')}</div></div>`:'';
  const form=isAdmin?'':`<div class="card"><div class="card-head"><h3>ระบุล็อตที่ต้องเรียกคืน</h3></div>${avail.length?`<form class="form" id="recallForm" ${queue.length?'':'inert'} style="${queue.length?'':'opacity:.5'}"><label class="full">รหัสล็อต<select name="code" ${queue.length<=1?'disabled':''}>${queue.map(c=>`<option value="${c}" ${c===pick?'selected':''}>${c} · ${esc(productOf(c))}</option>`).join('')}</select></label><label class="full">เหตุผล<select name="reason">${REASONS.map(r=>`<option>${r}</option>`).join('')}</select></label><label class="full">รายละเอียดเพิ่มเติม<textarea name="note" rows="3" placeholder="เช่น เลขที่ผลตรวจ หรือวันที่ตรวจ"></textarea></label><div class="btnrow"><button class="btn red" type="submit">ส่งคำขอเรียกคืนล็อต</button></div></form>`:'<div class="empty">ไม่มีล็อตที่เรียกคืนได้ในขณะนี้</div>'}</div>`;
  const pendRows=pending.map(r=>`<tr><td><b>${r.lot}</b><br><small class="muted">${esc(productOf(r.lot))}</small></td><td>${esc(r.reason)}${r.note?`<br><small class="muted">${esc(r.note)}</small>`:''}</td><td>${esc(nameOf(r.by))}<br><small class="muted">${fmt(r.ts)}</small></td><td><div class="inline" style="flex-wrap:nowrap"><button type="button" class="btn btn-sm" data-act="approveRecall" data-id="${r.id}">อนุมัติ</button><input id="apr-${r.id}" placeholder="เหตุผลเพิ่มเติม" style="width:180px"><button type="button" class="btn btn-sm leaf" data-act="approveRecallReason" data-id="${r.id}">อนุมัติพร้อมเหตุผล</button></div></td></tr>`).join('');
  const pendCard=isAdmin?`<div class="card"><div class="card-head"><h3>รายการรออนุมัติการเรียกคืน</h3></div>${pending.length?`<div class="tw"><table><thead><tr><th>ล็อต</th><th>เหตุผล</th><th>ผู้ส่งคำขอ</th><th>การอนุมัติ</th></tr></thead><tbody>${pendRows}</tbody></table></div>`:'<div class="empty">ไม่มีรายการที่รออนุมัติ</div>'}</div>`:'';
  const rows=S.recalls.map(r=>`<tr><td><b>${r.id}</b></td><td>${r.lot}<br><small class="muted">${esc(productOf(r.lot))}</small></td><td>${esc(r.reason)}${r.note?`<br><small class="muted">${esc(r.note)}</small>`:''}</td><td><span class="pill ${r.status==='กำลังเรียกคืน'?'p-recall':r.status==='รออนุมัติ'?'p-transit':'p-shop'}">${r.status}</span></td><td>${esc(nameOf(r.by))}<br><small class="muted">${fmt(r.ts)}</small></td><td>${r.status==='รออนุมัติ'?'<span class="muted small">รออนุมัติ</span>':r.status==='กำลังเรียกคืน'?`<button class="btn btn-sm ghost" data-act="closeRecall" data-id="${r.id}">ปิดการเรียกคืน</button>`:'—'}</td></tr>`).join('');
  const pendCard2=isAdmin?`<div class="card"><div class="card-head"><h3>รายการรออนุมัติการเรียกคืน</h3></div>${pending.length?`<div class="tw"><table><thead><tr><th>ล็อต</th><th>เหตุผล</th><th>ผู้ส่งคำขอ</th><th></th></tr></thead><tbody>${pending.map(r=>`<tr><td><b>${r.lot}</b><br><small class="muted">${esc(productOf(r.lot))}</small></td><td>${esc(r.reason)}</td><td>${esc(nameOf(r.by))}<br><small class="muted">${fmt(r.ts)}</small></td><td><button type="button" class="btn btn-sm" data-act="openApprove" data-id="${r.id}">สรุปและอนุมัติ</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">ไม่มีรายการที่รออนุมัติ</div>'}</div>`:'';
  return `<section class="stack">${chips}${form}${pendCard2}<div class="card"><div class="card-head"><h3>รายการเรียกคืน</h3></div><div class="tw"><table><thead><tr><th>เลขที่</th><th>ล็อต</th><th>เหตุผล</th><th>สถานะ</th><th>ผู้บันทึก</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="6" class="empty">ยังไม่มีรายการเรียกคืน</td></tr>'}</tbody></table></div></div></section>`;
}
function viewRecall(){
  const queue0=(S.recallQueue||[]).filter(c=>lot(c)&&!lot(c).recalled);
  const pick=queue0.includes(S.recallPick)?S.recallPick:queue0.at(-1);
  const queue=can('manage')?[]:(S.recallQueue||[]).filter(c=>lot(c)&&!lot(c).recalled);
  const avail=S.lots.filter(l=>!l.recalled);
  const rows=S.recalls.map(r=>`<tr>
      <td><b>${r.id}</b></td>
      <td>${r.lot}<br><small class="muted">${esc(productOf(r.lot))}</small></td>
      <td>${esc(r.reason)}${r.note?`<br><small class="muted">${esc(r.note)}</small>`:''}</td>
      <td><span class="pill ${r.status==='กำลังเรียกคืน'?'p-recall':'p-shop'}">${r.status}</span></td>
      <td>${esc(nameOf(r.by))}<br><small class="muted">${fmt(r.ts)}</small></td>
      <td>${r.status==='รออนุมัติ'?(can('manage')?`<button class="btn btn-sm" data-act="approveRecall" data-id="${r.id}">อนุมัติ</button>`:'<span class="muted small">รออนุมัติ</span>'):r.status==='กำลังเรียกคืน'?`<button class="btn btn-sm ghost" data-act="closeRecall" data-id="${r.id}">ปิดการเรียกคืน</button>`:'—'}</td>
    </tr>`).join('');
  return `
  ${can('manage')?'':`<div class="card"><p class="note" style="margin:0 0 10px">รายการที่รอเรียกคืน กดเพื่อกรอกข้อมูลลงในฟอร์ม</p><div class="chips">${queue.length?queue.map(c=>`<button type="button" class="btn btn-sm ${c===pick?'':'ghost'}" data-act="pickRecall" data-code="${c}">${c} · ${esc(productOf(c))}</button>`).join(''):'<span class="muted small">ยังไม่มีล็อตที่รอเรียกคืน</span>'}</div></div>`}
  <section class="stack">
    <div class="card">
      <div class="card-head"><h3>ระบุล็อตที่ต้องเรียกคืน</h3></div>
      
      ${avail.length ? `<form class="form" id="recallForm" ${queue.length?'':'inert'} style="${queue.length?'':'opacity:.5'}">
        <label class="full">รหัสล็อต<select name="code" ${queue.length<=1?'disabled':''}>${queue.map(c=>`<option value="${c}" ${c===pick?'selected':''}>${c} · ${esc(productOf(c))}</option>`).join('')}</select></label>
        <label class="full">เหตุผล<select name="reason">${REASONS.map(r=>`<option>${r}</option>`).join('')}</select></label>
        <label class="full">รายละเอียดเพิ่มเติม<textarea name="note" rows="3" placeholder="เช่น เลขที่ผลตรวจ หรือวันที่ตรวจ"></textarea></label>
        <div class="btnrow"><button class="btn red" type="submit">ยืนยันเรียกคืนล็อต</button></div>
      </form>` : '<div class="empty">ไม่มีล็อตที่เรียกคืนได้ในขณะนี้</div>'}
    </div>
    <div class="card">
      <div class="card-head"><h3>รายการเรียกคืน</h3></div>
      <div class="tw"><table>
        <thead><tr><th>เลขที่</th><th>ล็อต</th><th>เหตุผล</th><th>สถานะ</th><th>ผู้บันทึก</th><th></th></tr></thead>
        <tbody>${rows || '<tr><td colspan="6" class="empty">ยังไม่มีรายการเรียกคืน</td></tr>'}</tbody>
      </table></div>
    </div>
  </section>`;
}

function regList(role){
  const rows=S.users.filter(u=>u.role===role&&u.wallet&&(u.onchain||!CONTRACT_ON()));
  return `<div class="rcv-sub">รายการที่ลงทะเบียนแล้ว (${rows.length})</div>${rows.length?`<div class="tw"><table><thead><tr><th>#</th><th>ชื่อ / องค์กร</th><th>Address</th></tr></thead><tbody>${rows.map((u,i)=>`<tr><td>${i+1}</td><td>${esc(u.name)}</td><td><code style="font-size:12.5px;word-break:break-all">${esc(u.wallet)}</code></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">ยังไม่มีรายการ</div>'}`;
}
function viewUsers(){
  return `
  <section class="stack">
    ${STAKE_ROLES.map(k=>`<div class="card">
      <div class="card-head"><h3>ลงทะเบียน${ROLES[k].label}</h3></div>
      <form class="form" data-role-form="${k}">
        <label class="full">ชื่อ / องค์กร<input name="name" required placeholder="ชื่อบุคคลหรือองค์กร"></label>
        <label class="full">Address (ที่อยู่กระเป๋า 0x…)<input name="wallet" required placeholder="0x…"></label>
        <div class="btnrow"><button class="btn" type="submit">ลงทะเบียน${ROLES[k].label}</button></div>
      </form>
      ${regList(k)}
    </div>`).join('')}
    <div class="card">
      <div class="card-head"><h3>ลงทะเบียนผู้ดูแลระบบ</h3></div>
      <form class="form" data-role-form="admin">
        <label class="full">ชื่อ<input name="name" required placeholder="ชื่อผู้ดูแลระบบ"></label>
        <label class="full">Address (ที่อยู่กระเป๋า 0x…)<input name="wallet" required placeholder="0x…"></label>
        <div class="btnrow"><button class="btn" type="submit">ลงทะเบียนผู้ดูแลระบบ</button></div>
      </form>
      ${regList('admin')}
    </div>
  </section>`;
}

function viewSettings(){
  return `
  <section class="grid">
    <div class="card">
      <h3>ข้อมูลระบบ (จำลอง)</h3>
      <dl class="info">
        <dt>จำนวนบล็อกในห่วงโซ่</dt><dd>${S.chain.length}</dd>
        <dt>จำนวนล็อตสินค้า</dt><dd>${S.lots.length}</dd>
        <dt>ฟังก์ชันแฮช</dt><dd>cyrb53 (สำหรับสาธิต)</dd>
      </dl>
      <div style="margin-top:16px">
        ${can('manage')?'<button class="btn ghost" data-act="reset">รีเซ็ตเป็นข้อมูลตัวอย่าง</button>':'<p class="muted small" style="margin:0">การรีเซ็ตข้อมูลทำได้เฉพาะผู้ดูแลระบบ</p>'}
      </div>
    </div>
    <div class="card">
      <h3>กฎที่บังคับใช้ในระบบ</h3>
      <ol class="rules">
        <li>การเปลี่ยนผู้ครอบครองต้องให้ผู้ส่งเริ่มรายการ และผู้รับยืนยันเท่านั้น</li>
        <li>ผู้ใช้ต้องมีสิทธิ์ของแต่ละรายการ ระบบจะไม่ดำเนินการหากไม่มีสิทธิ์</li>
        <li>ทุกบล็อกเชื่อมกับแฮชของบล็อกก่อนหน้า หากมีการแก้ไขย้อนหลังจะตรวจพบได้ทันที</li>
      </ol>
    </div>
  </section>`;
}

function dmgOf(code){
  const mode=document.querySelector(`[data-insp-extra="dmgMode"][data-code="${code}"]`)?.value;
  const got=Number(document.querySelector(`[data-insp="qty"][data-code="${code}"]`)?.value)||0;
  if(mode==='none') return 0;
  if(mode==='all') return got;
  if(mode==='partial'){
    const raw=document.querySelector(`[data-insp-extra="damaged"][data-code="${code}"]`)?.value;
    return raw===''||raw==null ? null : Number(raw);
  }
  return null;
}
function missingOf(code){
  const boxes=[...document.querySelectorAll(`[data-insp="chk"][data-code="${code}"]`)];
  const got=Number(document.querySelector(`[data-insp="qty"][data-code="${code}"]`)?.value)||0;
  const dmg=dmgOf(code), m=[];
  if(!can('receive')) m.push('บัญชีนี้ไม่มีสิทธิ์รับสินค้า');
  if(!boxes.every(b=>b.value)) m.push('เลือกผลตรวจสอบให้ครบ 3 ข้อ');
  else if(boxes.some(b=>b.value==='fail')) m.push('มีผลตรวจที่ไม่ผ่าน');
  if(got<=0) m.push('กรอกจำนวนที่รับจริง');
  if(dmg===null) m.push('เลือกจำนวนที่เสียหาย');
  else if(dmg>got) m.push('จำนวนที่เสียหายต้องไม่เกินจำนวนที่รับ');
  else if(got-dmg<=0) m.push('ยอดเข้าคลังต้องมากกว่า 0');
  if(lot(code)?.recalled) m.push('ล็อตนี้อยู่ระหว่างเรียกคืน รับเข้าไม่ได้');
  
  if(!verify().ok) m.push('ประวัติไม่ผ่านการตรวจสอบ');
  return m;
}
function retMissing(code){
  const m=[];
  if(!can('receive')) m.push('บัญชีนี้ไม่มีสิทธิ์รับสินค้า');
  if(dmgOf(code)===null) m.push('เลือกจำนวนที่เสียหาย');
  return m;
}
function refreshInsp(code){
  const boxes=[...document.querySelectorAll(`[data-insp="chk"][data-code="${code}"]`)];
  const got=Number(document.querySelector(`[data-insp="qty"][data-code="${code}"]`)?.value)||0;
  const dmg=dmgOf(code), chosen=dmg!==null;
  document.getElementById('btnret-'+code).classList.toggle('locked',retMissing(code).length>0);
  document.getElementById('acc-'+code).classList.toggle('locked',missingOf(code).length>0);
  const st=document.getElementById('st-'+code), m=missingOf(code);
  if(st){ st.textContent=m.length?'ยังไม่ครบ: '+m.join(' · '):'ตรวจแล้ว พร้อมรับเข้าคลัง'; st.style.color=m.length?'var(--red)':''; }
}
function recallPickupCard(){
  const me=cur();
  const rows=S.lots.filter(l=>openReason(l.code)&&!blocksOf(l.code).some(b=>b.type==='TRANSFER_INIT'&&U(b.to)?.role==='farmer')&&blocksOf(l.code).some(b=>(b.type==='TRANSFER_INIT'||b.type==='TRANSFER_ACCEPT')&&b.actor===me.id));
  return `<div class="card"><div class="card-head"><h3>สินค้าเรียกคืนที่ต้องส่งคืนให้เกษตรกร</h3><span class="muted">${rows.length} ล็อต</span></div>${rows.length?`<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>เหตุผลการเรียกคืน</th><th>อยู่กับ</th><th></th></tr></thead><tbody>${rows.map(l=>`<tr><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${esc(openReason(l.code))}</td><td>${esc(orgOf(l.holder))}</td><td><button class="btn btn-sm red" data-act="returnPickup" data-code="${l.code}">ส่งสินค้าคืนให้เกษตรกร</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">ไม่มีสินค้าเรียกคืนที่ต้องไปรับ</div>'}</div>`;
}
function viewReceive(){
  const me=cur(), v=verify();
  const incoming=S.lots.filter(l=>l.pending===me.id);
  const cards=me.role==='transporter'?'':incoming.map(l=>{
    const init=[...blocksOf(l.code)].reverse().find(b=>b.type==='TRANSFER_INIT');
    const recall=openReason(l.code);
    const tile=(k,val,cls='')=>`<div class="rcv-tile"><dt>${k}</dt><dd class="${cls}">${val}</dd></div>`;
    return `<div class="card">
      <div class="rcv-head">
        <div><h3>${l.code} · ${esc(l.product)}</h3><small class="muted">ส่งมอบจาก ${esc(orgOf(l.holder))}</small></div>
        ${pillOf(l)}
      </div>
      ${recall?`<div class="banner bad" style="margin-top:14px">${svg('alert')} ล็อตนี้อยู่ระหว่างเรียกคืน: ${esc(recall)} </div>`:''}
      <div class="rcv-sub">ข้อมูลจากเกษตรกร</div>
      <dl class="rcv-grid">
        ${tile('แหล่งผลิต',esc(l.farm))}
        ${tile('เกษตรกร',esc(orgOf(l.farmer)))}
        ${tile('วันที่เก็บเกี่ยว',fmtDate(l.harvest))}
        ${tile('การรับรอง',esc(l.cert))}
        ${tile('ปริมาณที่ส่งมอบ',l.qty!=null?l.qty+' กก.':'—')}
      </dl>
      <div class="rcv-sub">ข้อมูลการขนส่งและประวัติ</div>
      <dl class="rcv-grid">
        ${tile('ผู้ส่งมอบ',esc(orgOf(l.holder)))}
        ${tile('วันที่ส่งมอบ',init?fmt(init.ts):'—')}
      </dl>
      <div class="insp-body" id="insp-${l.code}" hidden>
          <div class="insp-title">การตรวจสอบสินค้าก่อนรับ</div>
          <p class="note">ส่งมอบมา ${l.qty??'—'} กก. หากจำนวนที่รับจริงต่างไป ระบบจะบันทึกความต่างไว้ในประวัติ</p>
          <div class="insp-left"><label>จำนวนที่รับจริง (กก.)<input type="number" min="0" step="0.1" value="${l.qty??''}" data-insp="qty" data-code="${l.code}"></label><label>จำนวนที่เสียหาย<select data-insp-extra="dmgMode" data-code="${l.code}"><option value="">เลือกผล</option><option value="none">ไม่มีความเสียหาย</option><option value="partial">เสียหายบางส่วน</option><option value="all">เสียหายทั้งหมด</option></select><input type="number" min="0" step="0.1" placeholder="ระบุจำนวนที่เสียหาย (กก.)" data-insp-extra="damaged" data-code="${l.code}" data-dmg-kg hidden></label><label>หมายเหตุการตรวจสอบ<textarea rows="2" data-insp-extra="memo" data-code="${l.code}"></textarea></label></div>
          <div class="chklist"><label class="chk">สภาพสินค้าไม่เน่าเสียและไม่บุบ<select data-insp="chk" data-code="${l.code}">${CHECK_OPTS}</select></label>
          <label class="chk">ฉลากและใบรับรองตรงกับข้อมูลในระบบ<select data-insp="chk" data-code="${l.code}">${CHECK_OPTS}</select></label>
          <label class="chk">ไม่มีสิ่งแปลกปลอม<select data-insp="chk" data-code="${l.code}">${CHECK_OPTS}</select></label></div>
        </div>
        <div class="ret-pop" id="ret-${l.code}" hidden>
          <p class="note">คืนสินค้ากลับไปยังผู้ส่งมอบ ระบบจะยกเลิกการส่งมอบนี้และบันทึกเหตุผลไว้ในประวัติ</p>
          <label>เหตุผลการคืน<select id="rsn-${l.code}">${RETURN_REASONS.map(r=>`<option>${r}</option>`).join('')}</select></label>
          <button class="btn red" data-act="returnLot" data-code="${l.code}">ยืนยันคืนสินค้า</button>
        </div>
        <div class="rcv-foot">
        <small id="st-${l.code}">กดตรวจสอบสินค้าก่อนรับเพื่อเริ่มการตรวจ</small>
        <div class="inline"><button class="btn ghost" data-act="toggleInsp" data-code="${l.code}">${svg('check')} ตรวจสอบสินค้าก่อนรับ</button><button class="btn ghost" id="btnret-${l.code}" style="color:var(--red)" data-act="toggleRet" data-code="${l.code}" hidden>คืนสินค้า</button><button class="btn leaf" id="acc-${l.code}" data-act="accept" data-code="${l.code}" hidden>${me.role==='transporter'?'ยืนยันรับจากเกษตรกร':'ยืนยันรับสินค้า'}</button></div>
      </div>
    </div>`;
  }).join('');
  return `
  <section class="stack">
    ${S.returnNotice?`<div class="banner bad">${svg('alert')} คืนสินค้า ${S.returnNotice} แล้ว <button type="button" class="btn btn-sm red" data-act="go" data-view="recall" style="margin-left:auto">ไปดูการเรียกคืน</button><button type="button" class="btn btn-sm ghost" data-act="dismissNotice">ปิด</button></div>`:''}
    ${me.role==='transporter'?`<div class="card"><div class="card-head"><h3>รายการที่รอรับจากเกษตรกร</h3><span class="muted">${incoming.length} ล็อต</span></div>${incoming.length?`<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>แหล่งผลิต</th><th>ปริมาณ</th><th>วันที่เก็บเกี่ยว</th><th>รับเมื่อ</th><th></th></tr></thead><tbody>${incoming.map(l=>{const init=[...blocksOf(l.code)].reverse().find(b=>b.type==='TRANSFER_INIT');return `<tr class="click" data-act="pickup" data-code="${l.code}"><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${esc(l.farm)}</td><td>${l.qty!=null?l.qty+' กก.':'—'}</td><td>${fmtDate(l.harvest)}</td><td>${init?fmt(init.ts):'—'}</td><td><button class="btn btn-sm leaf" data-act="pickup" data-code="${l.code}">ไปรับสินค้า</button></td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty">ยังไม่มีรายการที่รอรับจากเกษตรกร</div>'}</div>`:''}
    ${me.role==='transporter'?'':(cards || `<div class="card empty">ไม่มีสินค้ารอรับเข้า</div>`)}
    ${me.role==='transporter'?'':'<p class="note">เมื่อยืนยันรับแล้ว สินค้าจะเข้าคลัง สถานะเปลี่ยนเป็น "ถึงคลังสินค้า" และพร้อมส่งถึงร้านค้า</p>'}
  </section>`;
}

function viewReceived(){
  const me=cur();
  const received=S.lots.filter(l=>blocksOf(l.code).some(b=>b.type==='TRANSFER_ACCEPT'&&b.actor===me.id));
  const rows=received.map(l=>{
    const acc=[...blocksOf(l.code)].reverse().find(b=>b.type==='TRANSFER_ACCEPT'&&b.actor===me.id);
    return `<tr><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${esc(orgOf(acc.from))}</td><td>${fmt(acc.ts)}</td><td>${l.qty!=null?l.qty+' กก.':'—'}</td><td>${l.remaining!=null?l.remaining+' กก.':'—'}</td></tr>`;
  }).join('');
  const inStock=received.filter(l=>l.holder===me.id&&!l.recalled&&l.status===STATUSES[2]);
  const soldOut=received.filter(l=>l.status===STATUSES[3]);
  const recalledCnt=received.filter(l=>l.recalled).length;
  const kgOf=arr=>arr.reduce((s,l)=>s+(Number(l.remaining)||0),0);
  return `
  <section class="stats">
    ${stat('จำนวนล็อตทั้งหมด',received.length,'leaf','box')}
    ${stat('ในคลังตอนนี้',inStock.length,'amber','home')}
    ${stat('หมดจากคลังแล้ว',soldOut.length,'shop','store')}
  </section>
  <p class="note">ปริมาณคงเหลือในคลังตอนนี้ ${kgOf(inStock)} กก. · ล็อตที่ถูกเรียกคืน ${recalledCnt} รายการ</p>
  <section class="card">
    ${received.length ? `<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>ผู้ส่งมอบ</th><th>วันที่รับ</th><th>จำนวน</th><th>คงเหลือ</th></tr></thead><tbody>${rows}</tbody></table></div>` : '<div class="empty">ยังไม่มีสินค้าที่รับแล้ว</div>'}
  </section>`;
}
function viewReturn(){
  const me=cur();
  const recalled=S.lots.filter(l=>l.recalled&&(l.holder===me.id||l.pending===me.id));
  const rows=recalled.map(l=>{
    const r=S.recalls.find(x=>x.lot===l.code&&x.status==='กำลังเรียกคืน');
    const action=l.pending===me.id
      ?`<div class="inline"><select id="rsn-${l.code}" aria-label="เหตุผลการคืน"><option value="">เลือกเหตุผล</option>${RETURN_REASONS.map(x=>`<option>${x}</option>`).join('')}</select><button class="btn btn-sm red" data-act="returnLot" data-code="${l.code}">คืนสินค้า</button></div>`
      :'<span class="muted small">อยู่ในความดูแลของคุณ ยังไม่มีการส่งมอบรอยืนยัน</span>';
    return `<tr><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${esc(r?r.reason:'—')}</td><td>${pillOf(l)}</td><td>${action}</td></tr>`;
  }).join('');
  return `<section class="stack"><div class="card"><div class="card-head"><h3>สินค้าที่เรียกคืน</h3></div>${recalled.length?`<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>เหตุผลการเรียกคืน</th><th>สถานะ</th><th>การดำเนินการ</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="empty">ไม่มีสินค้าที่เรียกคืนที่เกี่ยวข้องกับคุณ</div>'}</div></section>`;
}
function viewApprove(){
  const r=S.recalls.find(x=>x.id===S.approveId);
  const back='<button class="btn ghost btn-sm" data-act="go" data-view="recall">← กลับ</button>';
  if(!r||r.status!=='รออนุมัติ'||!can('manage')) return `<section class="card"><div class="card-head"><h3>อนุมัติการเรียกคืน</h3>${back}</div><p class="note">ไม่พบรายการที่รออนุมัติ</p></section>`;
  const L=lot(r.lot);
  return `<section class="card"><div class="card-head"><h3>อนุมัติการเรียกคืน ${r.id}</h3>${back}</div><dl class="kvgrid" style="margin-bottom:18px"><div><dt>รหัสล็อต</dt><dd>${r.lot}</dd></div><div><dt>สินค้า</dt><dd>${esc(L.product)}</dd></div><div><dt>ผู้ส่งคำขอ</dt><dd>${esc(nameOf(r.by))}</dd></div><div><dt>วันที่ส่งคำขอ</dt><dd>${fmt(r.ts)}</dd></div><div><dt>เหตุผลการเรียกคืน</dt><dd>${esc(r.reason)}</dd></div><div><dt>รายละเอียดจากผู้ส่งคำขอ</dt><dd>${esc(r.note||'—')}</dd></div></dl><form class="form" id="approveForm" data-approve="${r.id}"><label class="full">เหตุผลเพิ่มเติมจากผู้อนุมัติ (ไม่บังคับ)<textarea name="reason" rows="3" placeholder="เช่น ตรวจสอบเอกสารผลตรวจแล้ว"></textarea></label><div class="btnrow"><button class="btn ghost" type="button" data-act="rejectRecall" data-id="${r.id}" style="color:var(--red)">ไม่อนุมัติ</button><button class="btn red" type="submit">ยืนยันอนุมัติการเรียกคืน</button></div></form></section>`;
}
function viewHandover(){
  const me=cur(), L=sel(), next=ROLES[me.role].next;
  const back=`<button class="btn ghost btn-sm" data-act="go" data-view="transfer">← กลับ</button>`;
  const head=`<div class="card-head"><h3>ฟอร์มส่งมอบสินค้า</h3>${back}</div>`;
  if(!L||L.holder!==me.id||L.pending) return `<section class="card">${head}<p class="note">ไม่สามารถส่งมอบล็อตนี้ได้</p></section>`;
  const left=L.remaining??L.qty??0;
  const ro=(label,val)=>`<label>${label}<input value="${esc(val)}" readonly style="background:#f7faf8"></label>`;
  const common=`${ro('รหัสล็อต',L.code)}${ro('สินค้า',L.product)}${ro('คงเหลือ (กก.)',left)}`;
  let fields, btn;
  if(me.role==='distributor'){
    if(L.recalled) return `<section class="card">${head}<div class="banner bad">${svg('alert')} ล็อตนี้อยู่ระหว่างเรียกคืน ส่งต่อไม่ได้</div></section>`;
    if(left<=0) return `<section class="card">${head}<div class="banner ok">${svg('check')} ส่งครบทั้งหมดแล้ว ไม่มียอดคงเหลือ</div></section>`;
    fields=`<label class="full">ชื่อร้านปลายทาง<input id="shop-${L.code}" placeholder="เช่น ร้านผักสดสุขใจ" autocomplete="off"></label><label>จำนวนที่ส่ง (กก.)<input id="shq-${L.code}" type="number" min="0.1" step="0.1" max="${left}" placeholder="ไม่เกิน ${left}"></label>`;
    btn=`<button type="button" class="btn leaf" data-act="ship" data-code="${L.code}">ส่งถึงร้านค้า</button>`;
  } else if(next && can('send')){
    const opts=S.users.filter(u=>u.role===next&&u.perms.includes('receive'));
    if(!opts.length) return `<section class="card">${head}<p class="note">ไม่มีผู้รับในบทบาทถัดไป</p></section>`;
    fields=`<label class="full">ผู้รับมอบ (${ROLES[next].label})<select id="rcv-${L.code}">${opts.map(u=>`<option value="${u.id}">${esc(u.org)}</option>`).join('')}</select></label>`;
    btn=`<button type="button" class="btn" data-act="send" data-code="${L.code}">ยืนยันส่งมอบ</button>`;
  } else return `<section class="card">${head}<p class="note">บัญชีนี้ไม่มีสิทธิ์ส่งมอบ</p></section>`;
  return `<section class="card">${head}<div class="form">${common}${fields}<div class="btnrow">${btn}</div></div></section>`;
}
function viewHandoverOld(){
  const me=cur(), L=sel(), next=ROLES[me.role].next;
  const back=`<button class="btn ghost btn-sm" data-act="go" data-view="transfer">← กลับ</button>`;
  if(!L||L.holder!==me.id||L.pending) return `<section class="card empty"><p>ไม่สามารถส่งมอบล็อตนี้ได้</p>${back}</section>`;
  const left=L.remaining??L.qty;
  const info=`<dl class="info"><dt>รหัสล็อต</dt><dd>${L.code}</dd><dt>สินค้า</dt><dd>${esc(L.product)}</dd><dt>จำนวน</dt><dd>${L.qty!=null?L.qty+' กก.':'—'}</dd><dt>คงเหลือ</dt><dd>${left!=null?left+' กก.':'—'}</dd><dt>สถานะ</dt><dd>${pillOf(L)}</dd></dl>`;
  let body;
  if(me.role==='distributor'){
    body=L.recalled
      ?`<div class="banner bad">${svg('alert')} ล็อตนี้อยู่ระหว่างเรียกคืน ส่งต่อไม่ได้</div>`
      :`<div class="form"><label class="full">ชื่อร้านปลายทาง<input id="shop-${L.code}" placeholder="เช่น ร้านผักสดสุขใจ"></label><label class="full">จำนวนที่ส่ง (กก.)<input id="shq-${L.code}" type="number" min="0.1" step="0.1" max="${left??0}" placeholder="ไม่เกิน ${left??0} กก."></label><div class="btnrow"><button class="btn leaf" data-act="ship" data-code="${L.code}">ส่งถึงร้านค้า</button></div></div>`;
  } else if(next && can('send')){
    const opts=S.users.filter(u=>u.role===next&&u.perms.includes('receive'));
    body=opts.length
      ?`<div class="form"><label class="full">ผู้รับมอบ<select id="rcv-${L.code}">${opts.map(u=>`<option value="${u.id}">${esc(u.org)}</option>`).join('')}</select></label><div class="btnrow"><button class="btn" data-act="send" data-code="${L.code}">ยืนยันส่งมอบ</button></div></div>`
      :'<p class="note">ไม่มีผู้รับในบทบาทถัดไป</p>';
  } else body='<p class="note">บัญชีนี้ไม่มีสิทธิ์ส่งมอบ</p>';
  return `<section class="card"><div class="card-head"><h3>ฟอร์มส่งมอบสินค้า</h3>${back}</div>${info}<div style="margin-top:18px">${body}</div></section>`;
}
function viewHandoverDesign(){
  const me=cur(), L=sel(), next=ROLES[me.role].next;
  const back=`<button class="btn ghost btn-sm" data-act="go" data-view="transfer">← กลับ</button>`;
  if(!L||L.holder!==me.id||L.pending) return `<section class="card empty"><p>ไม่สามารถส่งมอบล็อตนี้ได้</p>${back}</section>`;
  const qty=L.qty??0, left=L.remaining??qty, sent=Math.max(qty-left,0), pct=qty>0?Math.round(left/qty*100):0;
  const summary=`<div class="ho-top"><div><div class="lotcode">${L.code}</div><div class="muted small">${esc(L.product)} · ${esc(L.farm)}</div></div>${pillOf(L)}</div>
    <div class="ho-stats">
      <div class="ho-tile"><small>จำนวนเดิม</small><b>${qty} กก.</b></div>
      <div class="ho-tile"><small>ส่งออกแล้ว</small><b>${sent} กก.</b></div>
      <div class="ho-tile hl"><small>คงเหลือ</small><b>${left} กก.</b></div>
    </div>
    <div class="ho-bar"><span style="width:${pct}%"></span></div>
    <div class="ho-cap"><span>${pct}% ของยอดรับเข้า</span>${L.recalled?'<span class="ho-warn">อยู่ระหว่างเรียกคืน</span>':''}</div>`;
  let form;
  if(me.role==='distributor'){
    form = L.recalled
      ? `<div class="banner bad">${svg('alert')} ล็อตนี้อยู่ระหว่างเรียกคืน จึงส่งต่อไม่ได้</div>`
      : left<=0
        ? `<div class="banner ok">${svg('check')} ส่งครบทั้งหมดแล้ว ไม่มียอดคงเหลือให้ส่ง</div>`
        : `<div class="ho-form">
            <label>ชื่อร้านปลายทาง<input id="shop-${L.code}" placeholder="เช่น ร้านผักสดสุขใจ" autocomplete="off"></label>
            <label>จำนวนที่ส่ง (กก.)<div class="ho-row"><input id="shq-${L.code}" type="number" min="0.1" step="0.1" max="${left}" placeholder="ไม่เกิน ${left} กก."><button class="btn btn-sm ghost" data-act="fillAll" data-code="${L.code}">ส่งทั้งหมด</button></div></label>
            <div class="ho-after" id="after-${L.code}">คงเหลือหลังส่ง <b>${left} กก.</b></div>
            <div class="btnrow"><button class="btn leaf" data-act="ship" data-code="${L.code}">ยืนยันส่งถึงร้านค้า</button></div>
          </div>`;
  } else if(next && can('send')){
    const opts=S.users.filter(u=>u.role===next&&u.perms.includes('receive'));
    form = opts.length
      ? `<div class="ho-form">
          <label>ผู้รับมอบ (${ROLES[next].label})<select id="rcv-${L.code}">${opts.map(u=>`<option value="${u.id}">${esc(u.org)}</option>`).join('')}</select></label>
          <div class="ho-after">ส่งทั้งล็อต <b>${left} กก.</b> ไปยังผู้รับที่เลือก</div>
          <div class="btnrow"><button class="btn" data-act="send" data-code="${L.code}">ยืนยันส่งมอบ</button></div>
        </div>`
      : `<p class="note">ไม่มีผู้รับในบทบาทถัดไป</p>`;
  } else form = `<p class="note">บัญชีนี้ไม่มีสิทธิ์ส่งมอบ</p>`;
  return `
  <div class="ho-wrap">
    <div class="ho-bar-top">${back}<span class="muted small">ฟอร์มส่งมอบสินค้า</span></div>
    <div class="ho-grid">
      <section class="card">${summary}</section>
      <section class="card"><h3 class="ho-title">รายละเอียดการส่งมอบ</h3>${form}</section>
    </div>
  </div>`;
}
function returnedRows(title=true){
  const me=cur();
  const rows=S.chain.filter(b=>b.type==='TRANSFER_INIT'&&U(b.to)?.role==='farmer'&&b.actor===me.id).reverse();
  return `${title?'<div class="rcv-sub">ส่งคืนสินค้าให้เกษตรกร</div>':''}${rows.length?`<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>ส่งคืนให้</th><th>เหตุผลการเรียกคืน</th><th>วันที่ส่งคืน</th><th></th></tr></thead><tbody>${rows.map(b=>`<tr><td><b>${b.lot}</b></td><td>${esc(productOf(b.lot))}</td><td>${esc(orgOf(b.to))}</td><td>${esc(openReason(b.lot)||'—')}</td><td>${fmt(b.ts)}</td><td>${(lot(b.lot)?.status==='ส่งคืนสำเร็จ')?'<button class="btn btn-sm" disabled style="opacity:.45;cursor:not-allowed">สำเร็จแล้ว</button>':`<button class="btn btn-sm" data-act="pickup" data-code="${b.lot}">ดำเนินการ</button>`}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">ยังไม่มีรายการที่ส่งคืนแล้ว</div>'}`;
}
function viewFarmerReturn(){
  const me=cur();
  const lots=S.lots.filter(l=>l.farmer===me.id&&(l.pending===me.id||blocksOf(l.code).some(b=>b.type==='TRANSFER_ACCEPT'&&b.actor===me.id)));
  const newRet=lots.filter(l=>l.pending===me.id);
  const rows=lots.map(l=>{
    const bs=blocksOf(l.code);
    const rtf=bs.filter(b=>b.type==='TRANSFER_INIT'&&b.to===me.id).at(-1)||bs.at(-1);
    const done=bs.some(b=>b.type==='TRANSFER_ACCEPT'&&b.actor===me.id);
    const rc=S.recalls.find(r=>r.lot===l.code);
    return `<tr><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${esc(rc?.reason||rtf.note)}</td><td>${esc(orgOf(rtf.actor))}</td><td>${fmt(rtf.ts)}</td><td>${done?'<span class="pill p-ware">ได้รับคืนแล้ว</span>':`<span class="pill p-transit">รอคุณยืนยันรับคืน</span> <button class="btn btn-sm leaf" data-act="returnAccept" data-code="${l.code}">ยืนยันรับคืน</button>`}</td></tr>`;
  }).join('');
  return `
  <section class="stack">${newRet.length?`<div class="banner bad">${svg('alert')} มีการคืนสินค้าจากผู้จัดจำหน่าย ${newRet.length} ล็อตใหม่</div>`:''}
    <div class="card">
      <div class="card-head"><h3>สินค้าที่ถูกส่งคืนให้เกษตรกร</h3><span class="muted">${lots.length} ล็อต</span></div>
      ${lots.length?`<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>เหตุผลการเรียกคืน</th><th>ผู้ส่งคืน</th><th>วันที่ส่งคืน</th><th>สถานะ</th></tr></thead><tbody>${rows}</tbody></table></div>`:'<div class="empty">ยังไม่มีสินค้าที่ถูกส่งคืนให้เกษตรกร</div>'}
    </div>
  </section>`;
}
function viewTransporterReturn(){
  const me=cur();
  const incoming=S.lots.filter(l=>l.pending===me.id&&openReason(l.code));
  const rows=incoming.map(l=>`<tr><td><b>${l.code}</b></td><td>${esc(l.product)}</td><td>${esc(l.farm)}</td><td>${l.qty!=null?l.qty+' กก.':'—'}</td><td>${esc(openReason(l.code)||'ยังไม่มีเหตุผลที่อนุมัติ')}<input type="hidden" id="rsn-${l.code}" value="${esc(openReason(l.code)||'')}"></td><td><button class="btn btn-sm red" ${openReason(l.code)?'':'disabled style="opacity:.45;cursor:not-allowed"'} data-act="returnLot" data-code="${l.code}">ปฏิเสธการรับคืน</button></td></tr>`).join('');
  return `<section class="stack">${recallPickupCard()}<div class="card"><div class="card-head"><h3>ส่งคืนสินค้าให้เกษตรกร</h3><span class="muted">${incoming.length} ล็อต</span></div>${incoming.length?`<div class="tw"><table><thead><tr><th>รหัสล็อต</th><th>สินค้า</th><th>แหล่งผลิต</th><th>ปริมาณ</th><th>เหตุผล</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`:returnedRows(false)}${incoming.length?returnedRows(true):''}</div><p class="note">การส่งคืนจะยกเลิกการส่งมอบ และบันทึกเหตุผลไว้ในประวัติ</p></section>`;
}
function viewPickup(){
  const me=cur(), L=lot(S.selected);
  const back='<button class="btn ghost btn-sm" data-act="go" data-view="receive">← กลับ</button>';
  if(!L) return `<section class="card"><div class="card-head"><h3>สถานะการขนส่ง</h3>${back}</div><p class="note">ไม่พบล็อตนี้</p></section>`;
  const idx=STATUSES.indexOf(L.status);
  const steps=[
    {label:'เก็บเกี่ยวแล้ว',icon:'leaf',done:true,now:false},
    {label:'ไปรับสินค้า',icon:'truck',done:idx>=1,now:L.pending===me.id},
    {label:'อยู่ระหว่างการขนส่ง',icon:'truck',done:idx>=2,now:idx===1&&L.holder===me.id&&!L.pending},
    {label:'ส่งถึงคลัง',icon:'home',done:idx>=2,now:false}
  ];
  const path=steps.map(s=>`<div class="st ${s.done?'done':''} ${s.now?'now':''}"><div class="dotc">${svg(s.icon)}</div>${s.label}</div>`).join('');
  let action='';
  if(L.pending===me.id) action=`<button class="btn leaf" data-act="pickupAccept" data-code="${L.code}">ยืนยันรับสินค้า</button>`;
  else if(L.pending) action=`<span class="muted">รอ ${esc(nameOf(L.pending))} ยืนยัน</span>`;
  else if(L.holder===me.id&&idx===1) action=`<button class="btn" data-act="go" data-view="handover" data-code="${L.code}">ส่งมอบให้ผู้จัดจำหน่าย</button>`;
  return `<section class="stack"><div class="card"><div class="card-head"><h3>สถานะการขนส่ง ${L.code} · ${esc(L.product)}</h3>${back}</div><div class="path">${path}</div><div class="cur"><span>สถานะปัจจุบัน: ${pillOf(L)}</span>${action}</div></div><div class="card"><dl class="info"><dt>แหล่งผลิต</dt><dd>${esc(L.farm)}</dd><dt>ปริมาณ</dt><dd>${L.qty!=null?L.qty+' กก.':'—'}</dd><dt>วันที่เก็บเกี่ยว</dt><dd>${fmtDate(L.harvest)}</dd></dl></div></section>`;
}
function viewPickupDetail(){
  const me=cur(), L=lot(S.selected);
  const back=`<button class="btn ghost btn-sm" data-act="go" data-view="${S.pickupFrom||'receive'}">← กลับ</button>`;
  if(!L) return `<section class="card"><div class="card-head"><h3>รายละเอียดสินค้า</h3>${back}</div><p class="note">ไม่พบล็อตนี้</p></section>`;
  const idx=STATUSES.indexOf(L.status);
  const steps=[
    {label:'เก็บเกี่ยวแล้ว',icon:'leaf',done:true,now:false},
    {label:'ไปรับสินค้า',icon:'truck',done:idx>=1,now:L.pending===me.id},
    {label:'อยู่ระหว่างการขนส่ง',icon:'truck',done:idx>=2,now:idx===1&&L.holder===me.id&&!L.pending},
    {label:'ส่งถึงคลัง',icon:'home',done:idx>=2,now:false}
  ];
  const path=steps.map(s=>`<div class="st ${s.done?'done':''} ${s.now?'now':''}"><div class="dotc">${svg(s.icon)}</div>${s.label}</div>`).join('');
  let action='', hint='';
  if(L.pending===me.id){ action=`<button class="btn leaf" data-act="pickupAccept" data-code="${L.code}">ยืนยันรับสินค้า</button>`; hint='รอคุณยืนยันการรับสินค้าจากเกษตรกร'; }
  else if(L.pending){ action=`<span class="muted">รอ ${esc(nameOf(L.pending))} ยืนยัน</span>`; hint=`ส่งให้ ${esc(orgOf(L.pending))} แล้ว รอการยืนยัน`; }
  else if(L.holder===me.id&&idx===1){ action=`<button class="btn" data-act="go" data-view="handover" data-code="${L.code}">ส่งมอบให้ผู้จัดจำหน่าย</button>`; hint='อยู่ในความดูแลของคุณ พร้อมส่งมอบให้ผู้จัดจำหน่าย'; }
  else if(idx>=2) hint='ส่งถึงคลังสินค้าแล้ว';
  const info=[
    ['รหัสล็อต',L.code],['สินค้า',esc(L.product)],['แหล่งผลิต',esc(L.farm)],['เกษตรกร',esc(orgOf(L.farmer))],['การรับรอง',esc(L.cert)],['วันที่เก็บเกี่ยว',fmtDate(L.harvest)],['ปริมาณที่เกษตรกรแจ้ง',L.qty!=null?L.qty+' กก.':'—'],['ผู้ถือครองปัจจุบัน',esc(orgOf(L.holder))],['สถานะล็อต',pillOf(L)],['การเรียกคืน',openReason(L.code)?esc(openReason(L.code)):'ไม่มี']
  ].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  const tl=[...blocksOf(L.code)].reverse().map(b=>`<li><div class="tl-dot"></div><div><b>${EVT[b.type]}</b><div class="bsub">${b.from?`${esc(orgOf(b.from))} → ${esc(orgOf(b.to))}`:esc(orgOf(b.actor))} · ${fmt(b.ts)}</div><div class="bnote">${esc(b.note)}</div></div></li>`).join('');
  return `<section class="stack"><div class="card"><div class="card-head"><h3>สถานะการขนส่ง ${L.code} · ${esc(L.product)}</h3>${back}</div><div class="path">${path}</div><div class="cur"><span>สถานะปัจจุบัน: ${pillOf(L)}${hint?` · ${hint}`:''}</span>${action}</div></div><div class="card"><h3>ข้อมูลล็อต</h3><dl class="kvgrid">${info}</dl></div><div class="card"><h3>ประวัติการขนส่ง</h3><ol class="tl">${tl||'<li class="muted">ยังไม่มีประวัติ</li>'}</ol></div></section>`;
}
function viewPickupFull(){
  const me=cur(), L=lot(S.selected);
  const back=`<button class="btn ghost btn-sm" data-act="go" data-view="${S.pickupFrom||'receive'}">← กลับ</button>`;
  if(!L) return `<section class="card"><div class="card-head"><h3>รายละเอียดสินค้า</h3>${back}</div><p class="note">ไม่พบล็อตนี้</p></section>`;
  const idx=STATUSES.indexOf(L.status);
  const hasRecall=!!openReason(L.code);
  const hasRTF=blocksOf(L.code).some(b=>b.type==='TRANSFER_INIT'&&U(b.to)?.role==='farmer');
  const hasDone=blocksOf(L.code).some(b=>b.type==='TRANSFER_ACCEPT'&&U(b.actor)?.role==='farmer');
  const atDist=U(L.holder)?.role==='distributor';
  const steps=[
    {label:'เก็บเกี่ยวแล้ว',icon:'leaf',done:true,now:false},
    {label:'ไปรับสินค้า',icon:'truck',done:idx>=1,now:L.pending===me.id},
    {label:'อยู่ระหว่างการขนส่ง',icon:'truck',done:idx>=2,now:idx===1&&L.holder===me.id&&!L.pending},
    {label:'ส่งถึงคลัง',icon:'home',done:idx>=2,now:false}
  ];
  if(hasRecall||hasRTF) steps.push(
    {label:'ผู้จัดจำหน่ายคืนสินค้า',icon:'store',done:!atDist,now:atDist&&!hasRTF},
    {label:'อยู่ระหว่างการขนส่ง',icon:'truck',done:hasDone,now:hasRTF&&!hasDone},
    {label:'ส่งคืนสำเร็จ',icon:'leaf',done:hasDone,now:false}
  );
  if(hasRecall) steps[2].now=false;
  const lastDone=steps.reduce((m,s,i)=>s.done?i:m,-1);
  steps.forEach((s,i)=>{ if(i<=lastDone) s.done=true; });
  const path=steps.map(s=>`<div class="st ${s.done?'done':''} ${s.now?'now':''}"><div class="dotc">${svg(s.icon)}</div>${s.label}</div>`).join('');
  let action='', hint='';
  if(L.pending===me.id){ action=`<button class="btn leaf" data-act="pickupAccept" data-code="${L.code}">ยืนยันรับสินค้า</button>`; hint='รอคุณยืนยันการรับสินค้าจากเกษตรกร'; }
  else if(L.pending){ action=`<span class="muted">รอ ${esc(nameOf(L.pending))} ยืนยัน</span>`; hint=`ส่งให้ ${esc(orgOf(L.pending))} แล้ว รอการยืนยัน`; }
  else if(L.holder===me.id&&idx===1&&!hasRecall){ action=`<button class="btn" data-act="go" data-view="handover" data-code="${L.code}">ส่งมอบให้ผู้จัดจำหน่าย</button>`; hint='อยู่ในความดูแลของคุณ พร้อมส่งมอบให้ผู้จัดจำหน่าย'; }
  else if(idx>=2) hint='ส่งถึงคลังสินค้าแล้ว';

  if(hasRecall&&!hasRTF&&!L.pending){
    if(atDist&&L.holder===me.id&&me.role==='distributor'){ action=`<button class="btn red" data-act="returnToCarrier" data-code="${L.code}">ส่งคืนให้ผู้ขนส่ง</button>`; hint='ล็อตถูกเรียกคืน กดส่งคืนให้ผู้ขนส่งเพื่อนำไปส่งคืนเกษตรกร'; }
    else if(atDist) hint='รอผู้จัดจำหน่ายส่งสินค้าคืน';
    else if(L.holder===me.id){ action=`<button class="btn red" data-act="returnPickup" data-code="${L.code}">ส่งสินค้าคืนให้เกษตรกร</button>`; hint='รอคุณส่งสินค้าคืนให้เกษตรกร'; }
  }
  if(hasDone) hint='ส่งคืนสำเร็จแล้ว';
  else if(hasRTF&&L.holder!==me.id) hint='ส่งคืนให้เกษตรกรแล้ว';
  const info=[
    ['รหัสล็อต',L.code],['สินค้า',esc(L.product)],['แหล่งผลิต',esc(L.farm)],['เกษตรกร',esc(orgOf(L.farmer))],['การรับรอง',esc(L.cert)],['วันที่เก็บเกี่ยว',fmtDate(L.harvest)],['ปริมาณที่เกษตรกรแจ้ง',L.qty!=null?L.qty+' กก.':'—'],['ผู้ถือครองปัจจุบัน',esc(orgOf(L.holder))],['สถานะล็อต',pillOf(L)],['การเรียกคืน',openReason(L.code)?esc(openReason(L.code)):'ไม่มี']
  ].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  const tl=[...blocksOf(L.code)].reverse().map(b=>`<li><div class="tl-dot"></div><div><b>${EVT[b.type]}</b><div class="bsub">${b.from?`${esc(orgOf(b.from))} → ${esc(orgOf(b.to))}`:esc(orgOf(b.actor))} · ${fmt(b.ts)}</div><div class="bnote">${esc(b.note)}</div></div></li>`).join('');
  return `<section class="stack"><div class="card"><div class="card-head"><h3>สถานะการขนส่ง ${L.code} · ${esc(L.product)}</h3>${back}</div><div class="path">${path}</div><div class="cur"><span>สถานะปัจจุบัน: ${pillOf(L)}${hint?` · ${hint}`:''}</span>${action}</div></div><div class="card"><h3>ข้อมูลล็อต</h3><dl class="kvgrid">${info}</dl></div><div class="card"><h3>ประวัติการขนส่ง</h3><ol class="tl">${tl||'<li class="muted">ยังไม่มีประวัติ</li>'}</ol></div></section>`;
}
const VIEWS={handover:viewHandover,farmerReturns:viewFarmerReturn,approve:viewApprove,pickup:viewPickupFull,returns:viewTransporterReturn,dash:viewDash,register:viewRegister,transfer:viewTransfer,receive:viewReceive,received:viewReceived,ledger:viewLedger,qr:viewQR,recall:viewRecallPage,users:viewUsers,settings:viewSettings};

/* ---------- Rendering ---------- */
/* ผู้ใช้งานกำหนดจากกระเป๋า MetaMask ที่เชื่อมต่อ ไม่มีตัวเลือกผู้ใช้ */
let _syncAddr='';
function syncMe(){
  if(!W.addr||W.addr===_syncAddr) return;
  _syncAddr=W.addr;
  if(!S.users.some(u=>u.wallet&&u.wallet.toLowerCase()===W.addr.toLowerCase())){ if(!S.users.some(u=>u.id==='guest')) S.users.push({id:'guest',name:'ยังไม่ได้รับบทบาท',org:'ยังไม่ได้รับบทบาท',role:'guest',wallet:'',perms:[]}); if(S.me!=='guest'){ S.me='guest'; S.view='dash'; } return; }
  const x=S.users.find(u=>u.wallet&&u.wallet.toLowerCase()===W.addr.toLowerCase());
  if(!x){ W.msg='กระเป๋านี้ยังไม่ได้ลงทะเบียนในระบบ'; return; }
  if(x.id!==S.me){ S.me=x.id; S.view='dash'; }
}
function render(){
  syncMe();
  if(!['handover','approve','pickup'].includes(S.view)&&!NAV.find(n=>n.id===S.view&&n.ok())) S.view='dash';
  const u=cur();
  $('#nav').innerHTML=NAV.filter(n=>n.ok()).map(n=>`<button data-act="go" data-view="${n.id}" class="${S.view===n.id?'on':''}" ${S.view===n.id?'aria-current="page"':''}>${svg(n.icon)}<span>${n.id==='receive'&&cur().role==='transporter'?'รับสินค้า':n.label}</span>${n.id==='recall'&&can('manage')&&S.recalls.some(x=>x.status==='รออนุมัติ')?`<b class="nbadge">${S.recalls.filter(x=>x.status==='รออนุมัติ').length}</b>`:''}</button>`).join('');
  {const sb=$('#scBtn'); if(sb){ sb.dataset.act=W.addr?'walletDisconnect':'walletConnect'; sb.textContent=W.addr?`ยกเลิก (${W.addr.slice(0,6)}…${W.addr.slice(-4)})`:'เชื่อมต่อ Smart Contract'; }}
  $('#wallet').textContent=W.addr?`${W.addr.slice(0,6)}…${W.addr.slice(-4)}`:'ยังไม่ได้เชื่อมต่อ';
  if($('#walletState')) $('#walletState').textContent=W.addr?(userIdByWallet(W.addr)?'ลงทะเบียนแล้ว':'ยังไม่ได้ลงทะเบียนในระบบ'):'';
  const _skel=!S.lots.length, _sv={lots:S.lots,sel:S.selected,led:S.ledgerCode};
  if(_skel){ S.lots=[EMPTY_LOT]; S.selected='—'; S.ledgerCode='—'; }
  let html='';
  try{ html=VIEWS[S.view](); }catch(err){ console.error(err); html=S.lots.length?'<div class="card empty">เกิดข้อผิดพลาดในการแสดงผล</div>':'<div class="card empty">ยังไม่มีล็อตสินค้าในระบบ</div>'; }
  if(_skel){ S.lots=_sv.lots; S.selected=_sv.sel; S.ledgerCode=_sv.led; html='<div class="banner ok" style="margin-bottom:12px">ยังไม่มีข้อมูลล็อตในระบบ แสดงเฉพาะโครงสร้างของหน้า</div>'+html; }
  $('#content').style.pointerEvents=TX_LOCK?'none':'';
  $('#nav').style.pointerEvents=TX_LOCK?'none':'';
  if(S.loadInfo) html=loadBanner()+html;
  if(TX_LOCK) html='<div class="banner bad" style="margin-bottom:12px">กำลังรอยืนยันรายการใน MetaMask อย่ากดซ้ำ จนกว่ารายการจะเสร็จ</div>'+html;
  $('#content').innerHTML=html;
  renderPopup();
  if(TX_LOCK) document.querySelectorAll('#content button,#nav button').forEach(b=>{ b.disabled=true; b.style.opacity='.45'; b.style.cursor='not-allowed'; });
  if(S.view==='qr') drawQR();
}
function loadBanner(){
  const li=S.loadInfo;
  if(li.error) return `<div class="banner bad" style="margin-bottom:12px">${svg('alert')} ${esc(li.error)} <button type="button" class="btn btn-sm ghost" data-act="dismissLoad" style="margin-left:auto">ปิด</button></div>`;
  return `<div class="banner ok" style="margin-bottom:12px">${svg('check')} โหลดจากสัญญา ${li.addr.slice(0,8)}…${li.addr.slice(-4)} · บล็อก ${li.from}–${li.head} · บทบาท ${li.roles} รายการ · เหตุการณ์ ${li.logs} รายการ · ล็อต ${li.lots} · ข้ามเพราะกระเป๋าไม่มีบทบาท ${li.skipped} รายการ <button type="button" class="btn btn-sm ghost" data-act="dismissLoad" style="margin-left:auto">ปิด</button></div>`;
}
function renderPopup(){
  document.getElementById('alertPop')?.remove();
  const p=S.popup;
  if(!p) return;
  const o=document.createElement('div');
  o.id='alertPop';
  o.setAttribute('style','position:fixed;inset:0;background:rgba(15,40,30,.35);display:grid;place-items:center;z-index:60;padding:16px');
  o.innerHTML=`<div role="alertdialog" aria-modal="true" style="background:#fff;border-radius:16px;padding:24px;max-width:400px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.2);text-align:center"><div class="warn-ico" style="margin:0 auto 14px">!</div><h3 style="margin:0 0 8px;font-size:18px">${esc(p.title)}</h3><p class="muted" style="margin:0 0 18px">${esc(p.body)}</p><button type="button" class="btn red" data-close-pop>รับทราบ</button></div>`;
  o.addEventListener('click',e=>{ if(e.target===o||e.target.closest('[data-close-pop]')){ S.popup=null; o.remove(); } });
  document.body.appendChild(o);
}
function drawQR(){
  const box=$('#qrbox');
  if(!box) return;
  if(!sel()){ box.innerHTML='<div class="muted small">QR Code จะแสดงเมื่อมีล็อตสินค้า</div>'; return; }
  box.innerHTML='';
  if(window.QRCode){
    new QRCode(box,{text:CONTRACT_ADDRESS.startsWith('0x0000000000')?`GREENFARM|${sel().code}`:`${VIEWER_URL}#lot=${sel().code}&c=${CONTRACT_ADDRESS}`,width:160,height:160,colorDark:'#0f3d2a',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
  } else {
    box.textContent='โหลดตัวสร้าง QR ไม่สำเร็จ';
  }
}
let toastTimer;
function toast(msg,ok=true){
  const t=$('#toast');
  t.textContent=msg;
  t.className='show'+(ok?'':' err');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{t.className='';},2600);
}
const done=m=>{toast(m);render();};
const fail=m=>toast(m,false);
function guard(p){
  if(can(p)) return true;
  fail('บัญชีนี้ไม่มีสิทธิ์ทำรายการนี้');
  return false;
}
function go(view,code){
  if(code) S.selected=code;
  S.view=view;
  render();
  $('#content').scrollTop=0;
}

/* ---------- Events ---------- */
document.addEventListener('click',async e=>{
  const el=e.target.closest('[data-act]');
  if(!el) return;
  const d=el.dataset, ts=()=>new Date().toISOString();
  if(!S.lots.length&&!['go','walletConnect','walletDisconnect','clearSearch'].includes(d.act)) return;
  if(TX_LOCK&&!['walletConnect','walletDisconnect'].includes(d.act)){ fail('กำลังรอยืนยันรายการใน MetaMask อยู่ ห้ามกดซ้ำ'); return; }
  switch(d.act){
    case 'go': go(d.view,d.code); break;
    case 'qrof': go('qr',d.code); break;
    case 'role': {
      const x=S.users.find(u=>u.role===d.role);
      S.me=x.id; S.view='dash';
      done(`สลับเป็น ${ROLES[d.role].label}: ${x.name}`);
      break;
    }
    case 'toggleInsp': { const p=document.getElementById('insp-'+d.code); p.hidden=!p.hidden; document.getElementById('ret-'+d.code).hidden=true; document.getElementById('btnret-'+d.code).hidden=p.hidden; document.getElementById('acc-'+d.code).hidden=p.hidden; refreshInsp(d.code); break; }
    case 'toggleRet': { if(el.classList.contains('locked')) return fail('ยังไม่ครบ: '+retMissing(d.code).join(' · ')); openReturnModal(d.code); break; }
    case 'lotSearch': findLot(el.parentElement.querySelector('[data-lot-search]').value); break;
    case 'toggleSend': { const p=document.getElementById('sendrow-'+d.code); p.hidden=!p.hidden; break; }
    case 'select': S.selected=d.code; render(); break;
    case 'approveRecall': { if(!guard('manage')) break; const rc=S.recalls.find(x=>x.id===d.id); if(!rc||rc.status!=='รออนุมัติ') return fail('รายการนี้ไม่อยู่ในสถานะรออนุมัติ'); if(!await chainTx('approveRecall',[rc.lot,rc.reason])) return; opApprove(d.id,S.me,ts()); return done('อนุมัติการเรียกคืนแล้ว'); }
    case 'approveRecallReason': { if(!guard('manage')) break; const v=document.getElementById('apr-'+d.id)?.value.trim(); if(!v) return fail('กรุณาระบุเหตุผลเพิ่มเติมก่อนอนุมัติ'); const rec=S.recalls.find(x=>x.id===d.id); if(!rec||rec.status!=='รออนุมัติ') return fail('รายการนี้ไม่อยู่ในสถานะรออนุมัติ'); if(!await chainTx('approveRecall',[rec.lot,rec.reason])) return; rec.note=[rec.note,v].filter(Boolean).join(' · '); opApprove(d.id,S.me,ts()); return done('อนุมัติการเรียกคืนพร้อมเหตุผลแล้ว'); }
    case 'openApprove': S.approveId=d.id; S.view='approve'; render(); break;
    case 'rejectRecall': { if(!guard('manage')) break; if(!_okReject){ askConfirm('ยืนยันไม่อนุมัติการเรียกคืนรายการนี้ใช่หรือไม่?',()=>{ _okReject=true; el.click(); _okReject=false; }); break; } const rec=S.recalls.find(x=>x.id===d.id); if(!rec||rec.status!=='รออนุมัติ') return fail('รายการนี้ไม่อยู่ในสถานะรออนุมัติ'); const v=(document.querySelector('#approveForm textarea[name="reason"]')?.value||'').trim(); if(!await chainTx('rejectRecall',[rec.lot,v||rec.reason])) return; opReject(d.id,S.me,ts(),v); S.view='recall'; return done('ไม่อนุมัติการเรียกคืนแล้ว'); }
    case 'pickRecall': S.recallPick=d.code; render(); break;
    case 'dismissNotice': S.returnNotice=null; render(); break;
    case 'dismissLoad': S.loadInfo=null; render(); break;
    case 'clearSearch': S.q=null; render(); break;
    case 'clearTxf': { S.txFilter=[]; const q=document.querySelector('[data-lot-search]')?.value; render(); const i=document.querySelector('[data-lot-search]'); if(i&&q) i.value=q; break; }
    case 'returnToCarrier': {
      if(!guard('send')) break;
      const L=lot(d.code), carrier=S.users.find(u=>u.role==='transporter'&&u.perms.includes('receive'));
      const prev=[...blocksOf(d.code)].reverse().find(b=>b.type==='TRANSFER_ACCEPT'&&U(b.actor)?.role==='transporter');
      const to=prev?prev.actor:carrier?.id;
      if(!L||L.holder!==S.me||cur().role!=='distributor'||!L.recalled||L.pending||!to) return fail('ไม่สามารถส่งคืนให้ผู้ขนส่งได้');
      if(!await chainTx('initTransfer',[d.code,U(to).wallet])) return;
      opInit(d.code,to,ts());
      return done(`ส่งคืน ${d.code} ให้ผู้ขนส่งแล้ว รอการยืนยัน`);
    }
    case 'returnAccept': {
      if(!guard('register')) break;
      const L=lot(d.code);
      if(!L||L.pending!==S.me||L.farmer!==S.me) return fail('ไม่สามารถยืนยันรับคืนล็อตนี้ได้');
      if(!await chainTx('acceptTransfer',[d.code,'ส่งคืนสำเร็จ'])) return;
      opAccept(d.code,ts(),'เกษตรกรยืนยันรับสินค้าคืนตามการเรียกคืน',{status:'ส่งคืนสำเร็จ',remaining:L.remaining});
      return done(`รับสินค้าคืน ${d.code} แล้ว`);
    }
    case 'returnPickup': {
      if(!guard('receive')) break;
      const L=lot(d.code);
      if(cur().role!=='transporter'||!L||L.holder!==S.me||!openReason(d.code)||L.pending) return fail('ไม่สามารถส่งคืนล็อตนี้ให้เกษตรกรได้');
      if(!await chainTx('initTransfer',[d.code,U(L.farmer).wallet])) return;
      opInit(d.code,L.farmer,ts());
      return done(`ส่งคืน ${d.code} ให้เกษตรกรแล้ว รอเกษตรกรยืนยันรับคืน`);
    }
    case 'pickup': { S.pickupFrom=S.view; go('pickup', d.code); break; }
    case 'walletConnect': {
      try{ await walletConnect(); W.msg='เชื่อมต่อ MetaMask แล้ว'; toast('เชื่อมต่อ MetaMask แล้ว'); }
      catch(err){ W.msg=err.shortMessage||err.message||String(err); toast(W.msg,false); }
      render(); break;
    }
    case 'walletDisconnect': { W.addr=''; W.tx=''; W.msg='ยกเลิกการเชื่อมต่อแล้ว'; render(); break; }
    case 'chainSave': {
      W.busy=true; W.tx=''; W.msg='กำลังส่งธุรกรรมไปยัง MetaMask…'; render();
      try{ const r=await chainSave(d.code); W.tx=r.hash; W.msg='ตรวจสอบคิวการบันทึกแล้ว'; toast('บันทึกลงบล็อกเชนแล้ว'); }
      catch(err){ W.msg=err.shortMessage||err.message||String(err); toast('บันทึกไม่สำเร็จ',false); }
      W.busy=false; render(); break;
    }
    case 'pickupAccept': {
      if(!guard('receive')) break;
      const L=lot(d.code);
      if(!L||L.pending!==S.me) return fail('รายการนี้ไม่ได้ส่งมอบมาให้บัญชีนี้');
      if(L.recalled&&cur().role!=='transporter') return fail('ล็อตนี้อยู่ระหว่างเรียกคืน รับเข้าไม่ได้');
      if(!await chainTx('acceptTransfer',[d.code,cur().role==='transporter'?STATUSES[1]:STATUSES[2]])) return;
      opAccept(d.code,ts(),`ผู้ขนส่งรับสินค้าครบ ${L.qty??0} กก.`);
      return done(`รับสินค้า ${d.code} แล้ว`);
    }
    case 'accept': {
      if(el.classList.contains('locked')) return fail('ยังไม่ครบ: '+missingOf(d.code).join(' · '));
      if(!guard('receive')) break;
      const L=lot(d.code);
      if(!L||L.pending!==S.me) return fail('รายการนี้ไม่ได้ส่งมอบมาให้บัญชีนี้');
      const got=Number(document.querySelector(`[data-insp="qty"][data-code="${d.code}"]`)?.value)||0;
      const dmg=dmgOf(d.code); if(dmg===null) return fail('กรุณาเลือกจำนวนที่เสียหายก่อน'); const exp=document.querySelector(`[data-insp-extra="expiry"][data-code="${d.code}"]`)?.value; const chks=[...document.querySelectorAll(`[data-insp="chk"][data-code="${d.code}"]`)].map(b=>b.value); const mv=document.querySelector(`[data-insp-extra="memo"][data-code="${d.code}"]`)?.value.trim();
      const ext=['ผลตรวจ: ผ่านทั้ง 3 ข้อ',dmg>0?`เสียหาย ${dmg} กก. เข้าคลัง ${got-dmg} กก.`:'ไม่มีความเสียหาย',exp?`วันหมดอายุ ${fmtDate(exp)}`:'',mv?`หมายเหตุ: ${mv}`:''].filter(Boolean).join(' · ');
      if(!await chainTx('acceptTransfer',[d.code,cur().role==='transporter'?STATUSES[1]:STATUSES[2]])) return;
      opAccept(d.code,ts(),(got===L.qty?`ตรวจสอบแล้ว รับครบ ${got} กก.`:`ตรวจสอบแล้ว รับจริง ${got} กก. (ส่งมอบ ${L.qty??'—'} กก.)`)+(ext?' · '+ext:''),{expiry:exp,remaining:got-dmg,damaged:dmg,inspection:{checks:chks,damagedMode:document.querySelector(`[data-insp-extra="dmgMode"][data-code="${d.code}"]`)?.value,damagedKg:dmg,qtyReceived:got,memo:mv||'',at:ts()}});
      return done(`ยืนยันรับมอบ ${d.code} แล้ว`);
    }
    case 'send': {
      if(!guard('send')) break;
      const L=lot(d.code), next=ROLES[cur().role].next, r=U(document.querySelector('#rcv-'+d.code)?.value);
      if(!L||L.holder!==S.me||L.pending) return fail('ไม่สามารถส่งมอบล็อตนี้ได้');
      if(!r||r.role!==next||!r.perms.includes('receive')) return fail('ผู้รับต้องอยู่ในบทบาทถัดไปและมีสิทธิ์รับมอบ');
      if(!await chainTx('initTransfer',[d.code,r.wallet])) return;
      opInit(d.code,r.id,ts());
      S.view='transfer';
      return done(`ส่งมอบ ${d.code} ให้ ${r.org} แล้ว รอการยืนยัน`);
    }
    case 'ship': {
      if(!guard('status')) break;
      const L=lot(d.code);
      const shop=document.getElementById('shop-'+d.code)?.value.trim(), q=Number(document.getElementById('shq-'+d.code)?.value);
      if(L.holder!==S.me||L.status!==STATUSES[2]||L.recalled) return fail('ยังไม่สามารถส่งล็อตนี้ได้');
      if(!shop) return fail('กรุณาระบุชื่อร้านปลายทาง');
      if(!(q>0)||q>(L.remaining??0)) return fail('จำนวนที่ส่งต้องมากกว่า 0 และไม่เกินยอดคงเหลือ');
      const remAfter=(L.remaining??0)-q;
      if(!await chainTx('updateStatus',[d.code,remAfter<=0?STATUSES[3]:L.status,`ส่งให้ ${shop} ${q} กก. · คงเหลือ ${remAfter} กก.`])) return;
      opShip(d.code,shop,q,S.me,ts());
      S.view='transfer';
      return done(`ส่ง ${d.code} ${q} กก. ให้ ${shop} แล้ว`);
    }
    case 'fillAll': { const L=lot(d.code), i=document.getElementById('shq-'+d.code); if(i){ i.value=(L.remaining??L.qty)??''; i.dispatchEvent(new Event('input',{bubbles:true})); } break; }
    case 'dispose': {
      if(!guard('status')) break;
      const L=lot(d.code);
      if(!L||!(L.damaged>0)) return fail('ไม่มีสินค้าเสียหายที่ต้องทำลาย');
      if(!await chainTx('dispose',[d.code,`ทำลายสินค้าเสียหาย ${L.damaged} กก.`])) return;
      opDispose(d.code,S.me,ts());
      return done(`บันทึกการทำลายของ ${d.code} แล้ว`);
    }
    case 'returnLot': {
      if(!guard('receive')) break;
      const L=lot(d.code);
      if(!L||L.pending!==S.me) return fail('รายการนี้ไม่ได้ส่งมอบมาให้บัญชีนี้');
      const rsn=(document.querySelector('#retModal select')||document.getElementById('rsn-'+d.code)).value;
      if(!await chainTx('rejectTransfer',[d.code,rsn])) return;
      opReturn(d.code,rsn,ts());
      document.getElementById('retModal')?.remove(); if(cur().role!=='transporter'){ S.returnNotice=d.code; S.recallQueue=[...new Set([...(S.recallQueue||[]),d.code])]; }
      return done(`คืนสินค้า ${d.code} ให้ผู้ส่งมอบแล้ว`);
    }
    case 'closeRecall': {
      if(!guard('recall')) break;
      const rc=S.recalls.find(x=>x.id===d.id);
      if(!rc) return fail('ไม่พบรายการเรียกคืน');
      if(!await chainTx('closeRecall',[rc.lot,`ปิดการเรียกคืน ${rc.id}`])) return;
      opCloseRecall(d.id,S.me,ts());
      return done(`ปิดการเรียกคืน ${d.id} แล้ว`);
    }
    case 'verify': {
      const v=verify();
      toast(v.ok?'ห่วงโซ่สมบูรณ์ ไม่พบการแก้ไข':'พบความผิดปกติในห่วงโซ่',v.ok);
      render();
      break;
    }
    case 'tamper': {
      if(!guard('manage')) break;
      return done(tamper());
    }
    case 'reset': {
      if(!guard('manage')) break;
      seed();
      return done('รีเซ็ตเป็นข้อมูลตัวอย่างแล้ว');
    }
  }
});

document.addEventListener('submit',async e=>{
  e.preventDefault();
  const f=e.target, d=Object.fromEntries(new FormData(f)), ts=new Date().toISOString();
  if(TX_LOCK){ fail('กำลังรอยืนยันรายการใน MetaMask อยู่ ห้ามส่งซ้ำ'); return; }
  if(f.id==='regForm'){
    if(!guard('register')) return;
    const code=nextCode();
    const cert=d.cert==='ไม่มีการรับรอง'?'ไม่มีการรับรอง':`${d.cert} · ${d.certNo?.trim()||'ไม่ระบุเลขที่'}`;
    if(!await chainTx('registerLot',[code,STATUSES[0],JSON.stringify({product:d.product.trim(),farm:d.farm.trim(),farmer:S.me,harvest:d.harvest,cert,qty:Number(d.qty)||0})])) return;
    opRegister({code,product:d.product.trim(),farm:d.farm.trim(),farmer:S.me,harvest:d.harvest,cert,qty:Number(d.qty)||0},S.me,ts);
    S.selected=code;
    S.view='transfer';
    return done(`ลงทะเบียนล็อต ${code} แล้ว ส่งมอบต่อให้ผู้ขนส่งได้ที่หน้านี้`);
  }
  if(f.id==='approveForm'&&!_okApprove){ askConfirm('ยืนยันอนุมัติการเรียกคืนรายการนี้ใช่หรือไม่?',()=>{ _okApprove=true; f.requestSubmit(); _okApprove=false; }); return; }
  if(f.id==='approveForm'){
    if(!guard('manage')) return;
    const rec=S.recalls.find(x=>x.id===f.dataset.approve);
    if(!rec||rec.status!=='รออนุมัติ') return fail('รายการนี้ไม่อยู่ในสถานะรออนุมัติ');
    const v=(d.reason||'').trim();
    if(v) rec.note=[rec.note,v].filter(Boolean).join(' · ');
    if(!await chainTx('approveRecall',[rec.lot,rec.reason])) return;
    opApprove(rec.id,S.me,ts);
    S.view='recall';
    return done(`อนุมัติการเรียกคืน ${rec.id} แล้ว`);
  }
  if(f.id==='recallForm'){
    if(!(S.recallQueue||[]).length) return fail('ยังไม่มีรายการที่รอเรียกคืน');
    if(!guard('recall')) return;
    d.code=d.code||(S.recallQueue||[]).at(-1);
    if(lot(d.code)?.recalled||S.recalls.some(r=>r.lot===d.code&&r.status==='รออนุมัติ')) return fail('ล็อตนี้อยู่ระหว่างเรียกคืนแล้ว');
    if(!await chainTx('requestRecall',[d.code,d.reason])) return;
    opRecall(d.code,d.reason,d.note?.trim(),S.me,ts);
    S.recallQueue=(S.recallQueue||[]).filter(c=>c!==d.code);
    S.popup={title:'ส่งคำขอเรียกคืนแล้ว',body:`ล็อต ${d.code} รอผู้ดูแลระบบอนุมัติ`};
    S.selected=d.code;
    return done(`ส่งคำขอเรียกคืนล็อต ${d.code} แล้ว รอผู้ดูแลระบบอนุมัติ`);
  }
  if(f.dataset.roleForm){
    const role=f.dataset.roleForm;
    if(!guard('manage')) return;
    const w=d.wallet.trim();
    if(!/^0x[0-9a-fA-F]{20,}$/.test(w)) return fail('ที่อยู่กระเป๋าต้องขึ้นต้นด้วย 0x ตามด้วยตัวอักษรฐานสิบหก');
    if(role==='admin'){
      let ownerAddr='';
      try{ ownerAddr=await new ethers.Contract(CONTRACT_ADDRESS,['function owner() view returns (address)'],new ethers.BrowserProvider(window.ethereum)).owner(); }
      catch(err){ return fail('ตรวจสอบเจ้าของสัญญาไม่สำเร็จ ปรับ CONTRACT_ADDRESS และเชื่อม MetaMask ก่อน'); }
      if(w.toLowerCase()!==ownerAddr.toLowerCase()) return fail('ลงทะเบียนผู้ดูแลระบบได้เฉพาะกระเป๋าเจ้าของสัญญาเท่านั้น: '+ownerAddr.slice(0,6)+'…'+ownerAddr.slice(-4)); 
    }
    if(CONTRACT_ON()&&!await chainTx('setRole',[w,{farmer:1,transporter:2,distributor:3,admin:4}[role]])) return;
    saveName(w,d.name.trim());
    S.users.push({id:'u'+(S.users.length+1),name:d.name.trim(),org:d.name.trim(),role,wallet:w,perms:[...ROLES[role].perms],onchain:CONTRACT_ON()});
    return done(`ลงทะเบียน ${d.name.trim()} แล้ว`);
  }
});

document.addEventListener('change',e=>{
  const t=e.target;
  if(t.dataset.insp||t.dataset.inspExtra){
    const code=t.dataset.code, boxes=[...document.querySelectorAll(`[data-insp="chk"][data-code="${code}"]`)], qty=document.querySelector(`[data-insp="qty"][data-code="${code}"]`);
    if(t.dataset.inspExtra==='dmgMode') t.closest('.insp-left').querySelector('[data-dmg-kg]').hidden=t.value!=='partial';
    refreshInsp(code);
    return;
  }
  if(t.dataset.adminRole!==undefined){ S.adminRole=t.value; const iq=document.querySelector('[data-lot-search]')?.value; render(); const i=document.querySelector('[data-lot-search]'); if(i&&iq) i.value=iq; return; }
  if(t.dataset.txf!==undefined){ S.txFilter=[...document.querySelectorAll('[data-txf]:checked')].map(c=>c.dataset.txf); const q=document.querySelector('[data-lot-search]')?.value; render(); const i=document.querySelector('[data-lot-search]'); if(i&&q) i.value=q; return; }
  if(t.dataset.sortLedger!==undefined){ S.ledgerSort=t.value; const iq=document.querySelector('[data-lot-search]')?.value; render(); const i=document.querySelector('[data-lot-search]'); if(i&&iq) i.value=iq; return; }
  if(t.dataset.select){ S.selected=t.value; render(); return; }
  if(t.id==='userSel'){ S.me=t.value; render(); toast(`เข้าใช้งานเป็น ${cur().name}`); return; }
});

document.addEventListener('input',e=>{
  const t=e.target;
  if(!t.id||!t.id.startsWith('shq-')) return;
  const code=t.id.slice(4), L=lot(code), left=(L.remaining??L.qty)??0, v=Number(t.value)||0, el=document.getElementById('after-'+code);
  if(!el) return;
  el.innerHTML = v>left ? `<span style="color:var(--red)">เกินยอดคงเหลือ ${v-left} กก.</span>` : `คงเหลือหลังส่ง <b>${left-v} กก.</b>`;
});
function findLot(raw){
  const q=raw.trim().toLowerCase();
  if(!q) return;
  const L=S.lots.find(l=>l.code.toLowerCase().includes(q)||l.product.toLowerCase().includes(q));
  S.q=S.view==='ledger'?raw.trim():null; if(L){ S.selected=L.code; if(S.view==='ledger') S.ledgerCode=L.code; render(); const i=document.querySelector('[data-lot-search]'); if(i) i.value=raw; } else { render(); const i=document.querySelector('[data-lot-search]'); if(i) i.value=raw; fail('ไม่พบล็อตที่ตรงกับคำค้นหา'); }
}
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&e.target.dataset.lotSearch!==undefined) findLot(e.target.value);
});
document.addEventListener('keydown',e=>{
  if(e.target.id!=='q'||e.key!=='Enter') return;
  const q=e.target.value.trim().toLowerCase();
  if(!q) return;
  const L=S.lots.find(l=>l.code.toLowerCase().includes(q)||l.product.includes(q));
  if(L) go('ledger',L.code); else fail('ไม่พบล็อตที่ตรงกับคำค้นหา');
});

document.addEventListener('toggle',e=>{ if(e.target.classList&&e.target.classList.contains('txf')) S.filterOpen=e.target.open; },true);
function openReturnModal(code){
  document.getElementById('retModal')?.remove();
  const o=document.createElement('div');
  o.id='retModal';
  o.setAttribute('style','position:fixed;inset:0;background:rgba(15,40,30,.35);display:grid;place-items:center;z-index:50;padding:16px');
  o.innerHTML=`<div role="dialog" aria-modal="true" style="background:#fff;border-radius:16px;padding:22px;max-width:440px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.2);display:flex;flex-direction:column;gap:12px"><h3 style="margin:0;font-size:17px">ยืนยันคืนสินค้า ${code}</h3><p class="note" style="margin:0">คืนสินค้ากลับไปยังผู้ส่งมอบ ระบบจะยกเลิกการส่งมอบนี้และบันทึกเหตุผลไว้ในประวัติ</p><label style="display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:13.5px">เหตุผลการคืน<select id="rsnm">${RETURN_REASONS.map(r=>`<option>${r}</option>`).join('')}</select></label><div class="btnrow" style="margin:0"><button type="button" class="btn ghost" data-close-ret>ยกเลิก</button><button type="button" class="btn red" data-act="returnLot" data-code="${code}">ยืนยันคืนสินค้า</button></div></div>`;
  o.addEventListener('click',e=>{ if(e.target===o||e.target.closest('[data-close-ret]')) o.remove(); });
  document.body.appendChild(o);
}
let _okApprove=false, _okReject=false;
function askConfirm(msg,onYes){
  const o=document.createElement('div');
  o.setAttribute('style','position:fixed;inset:0;background:rgba(15,40,30,.35);display:grid;place-items:center;z-index:50;padding:16px');
  o.innerHTML=`<div role="dialog" aria-modal="true" style="background:#fff;border-radius:16px;padding:22px;max-width:380px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.2)"><p style="margin:0 0 18px;font-weight:700;font-size:16px">${msg}</p><div class="btnrow" style="margin:0"><button type="button" class="btn ghost" data-no>ยกเลิก</button><button type="button" class="btn red" data-yes>ยืนยัน</button></div></div>`;
  const close=()=>o.remove();
  o.querySelector('[data-no]').onclick=close;
  o.querySelector('[data-yes]').onclick=()=>{ close(); onYes(); };
  o.addEventListener('click',e=>{ if(e.target===o) close(); });
  document.body.appendChild(o);
}
/* ---------- อ่านข้อมูลจากสมาร์ทคอนแทรคต์ ---------- */
const DEPLOY_BLOCK=0; // ใส่เลขบล็อกที่ deploy สัญญาเพื่ออ่านเร็วขึ้น
const RPC_URL='https://ethereum-sepolia-rpc.publicnode.com';
const CHAIN_READ=[
  'event RoleSet(address indexed who, uint8 role)',
  'event Logged(string lot, uint8 kind, address indexed actor, bytes32 hash)',
  'function getEvent(string lot, uint256 i) view returns (uint8 kind, address actor, address to, string status, string note, uint256 ts, bytes32 prev, bytes32 hash)',
  'function owner() view returns (address)'
];
const ROLE_BY_NUM=[null,'farmer','transporter','distributor','admin'];
const KIND_NAME=['REGISTER','TRANSFER_INIT','TRANSFER_ACCEPT','STATUS','RECALL','RECALL_APPROVE','RECALL_CLOSE','DISPOSE','TRANSFER_RETURN','RECALL_REJECT'];
const NAME_KEY='greenfarm_names';
function savedNames(){ try{ return JSON.parse(localStorage.getItem(NAME_KEY)||'{}'); }catch(e){ return {}; } }
function saveName(addr,name){ try{ const m=savedNames(); m[addr.toLowerCase()]=name; localStorage.setItem(NAME_KEY,JSON.stringify(m)); }catch(e){} }
function userIdByWallet(a){ const x=S.users.find(u=>u.wallet&&u.wallet.toLowerCase()===(a||'').toLowerCase()); return x?.id; }
// เล่นเหตุการณ์จากสัญญาซ้ำด้วยฟังก์ชันเดิม เพื่อให้สถานะและบล็อกตรงกับบนเชน
function replayEvent(code,e){
  const actor=userIdByWallet(e.actor), to=userIdByWallet(e.to);
  if(!actor){ S.skipped=(S.skipped||0)+1; return; } // กระเป๋าที่ไม่ได้ลงทะเบียนจะไม่แสดง
  const note=e.note||'';
  const _before=S.chain.length;
  switch(KIND_NAME[e.kind]){
    case 'REGISTER': {
      let p={}; try{ p=JSON.parse(note)||{}; }catch(x){}
      opRegister({code,product:p.product||'',farm:p.farm||'',farmer:actor,harvest:p.harvest||'',cert:p.cert||'',qty:Number(p.qty)||0},actor,e.ts); break;
    }
    case 'TRANSFER_INIT': if(to&&lot(code)) opInit(code,to,e.ts); break;
    case 'TRANSFER_ACCEPT': if(lot(code)&&lot(code).pending){ const isFarmer=U(actor)?.role==='farmer'; opAccept(code,e.ts,e.note||'',isFarmer?{status:'ส่งคืนสำเร็จ',remaining:lot(code).remaining}:{status:e.status}); } break;
    case 'STATUS': {
      const m=note.match(/^ส่งให้ (.+?) (\d+) กก\./);
      if(!lot(code)) break;
      if(m) opShip(code,m[1],Number(m[2]),actor,e.ts); else opStatus(code,e.status,actor,e.ts,note);
      break;
    }
    case 'RECALL': opRecall(code,note,'',actor,e.ts); break;
    case 'RECALL_APPROVE': { const r=S.recalls.find(x=>x.lot===code&&x.status==='รออนุมัติ'); if(r) opApprove(r.id,actor,e.ts); break; }
    case 'RECALL_CLOSE': { const r=S.recalls.find(x=>x.lot===code&&x.status==='กำลังเรียกคืน'); if(r) opCloseRecall(r.id,actor,e.ts); break; }
    case 'DISPOSE': { const L=lot(code); if(L){ const m=note.match(/(\d+(?:\.\d+)?) กก/); L.damaged=Number(m?.[1])||0; opDispose(code,actor,e.ts); } break; }
    case 'TRANSFER_RETURN': if(lot(code)&&lot(code).pending) opReturn(code,note,e.ts); break;
    case 'RECALL_REJECT': { const r=S.recalls.find(x=>x.lot===code&&x.status==='รออนุมัติ'); if(r) opReject(r.id,actor,e.ts,note); break; }
  }
  if(S.chain.length>_before) annotateChain(S.chain.at(-1),code,e);
}
const LOG_STEP=10000; // อ่านทีละช่วงบล็อก เพื่อไม่ให้ RPC ปฏิเสธคำขอที่กว้างเกินไป
// หาบล็อกที่ deploy สัญญาอัตโนมัติ (ค้นแบบแบ่งครึ่งจากโค้ดที่ที่อยู่สัญญา) ถ้าหาไม่ได้จะใช้ DEPLOY_BLOCK หรือย้อนไปไม่เกิน 500,000 บล็อก
async function findDeployBlock(p,head){
  try{
    if((await p.getCode(CONTRACT_ADDRESS,head))==='0x') throw new Error('ไม่พบสัญญาที่ที่อยู่ CONTRACT_ADDRESS บน Sepolia');
    let lo=DEPLOY_BLOCK, hi=head;
    while(lo<hi){ const mid=Math.floor((lo+hi)/2); if((await p.getCode(CONTRACT_ADDRESS,mid))!=='0x') hi=mid; else lo=mid+1; }
    return lo;
  }catch(e){
    if(String(e.message).startsWith('ไม่พบ')) throw e;
    return DEPLOY_BLOCK||Math.max(0,head-500000);
  }
}
async function queryAll(c,filter,from,to){
  const out=[];
  for(let s=from;s<=to;s+=LOG_STEP){ out.push(...await c.queryFilter(filter,s,Math.min(s+LOG_STEP-1,to))); }
  return out;
}
// หาผู้อ่านที่ใช้ได้: MetaMask ก่อน แล้วประกอบ RPC สาธารณะหลายตัว (RPC ที่ตอบไม่ได้จะไม่ขึ้น แต่หน้าเว็บอ่านไม่ได้)
async function readProvider(){
  const cands=[];
  if(window.ethereum) cands.push(new ethers.BrowserProvider(window.ethereum));
  for(const u of [RPC_URL,'https://rpc.sepolia.org','https://1rpc.io/sepolia','https://sepolia.drpc.org']) cands.push(new ethers.JsonRpcProvider(u,11155111,{staticNetwork:true}));
  let lastErr=null;
  for(const p of cands){
    try{ const n=await p.getNetwork(); if(Number(n.chainId)!==11155111) throw new Error('ประกอบไม่ได้อยู่ใน Sepolia'); await p.getBlockNumber(); return p; }
    catch(e){ lastErr=e; }
  }
  throw new Error('อ่านหลาย RPC ไม่ได้: '+(lastErr?.shortMessage||lastErr?.message||lastErr));
}
// ตรวจว่าแต่ละบล็อกในหน้าตรงกับ hash ที่สัญญาเก็บไว้ ผ่าน keccak256 ของค่าเดียวกันกับที่สัญญาคำนวณ
function annotateChain(b,code,e){
  b.actorAddr=e.actor;
  try{
    const ts=Math.floor(new Date(e.ts).getTime()/1000);
    const enc=ethers.AbiCoder.defaultAbiCoder().encode(['bytes32','string','uint8','address','address','string','string','uint256'],[e.prev,code,e.kind,e.actor,e.to,e.status,e.note,ts]);
    b.chainOk=ethers.keccak256(enc)===e.hash;
  }catch(err){ b.chainOk=false; }
}
function addrOf(b){ const a=b.actorAddr||U(b.actor)?.wallet||''; return a?`<code title="${a}" style="font-size:12px">${a.slice(0,6)}…${a.slice(-4)}</code>`:'—'; }
function chainTag(b){ if(b.chainOk===undefined) return ''; return b.chainOk?'<small style="color:var(--shop)">✓ ตรงกับบล็อกเชน</small>':'<small style="color:var(--red)">✗ ไม่ตรงกับบล็อกเชน</small>'; }
async function chainLoad(){
  try{
    const p=await readProvider();
    const c=new ethers.Contract(CONTRACT_ADDRESS,CHAIN_READ,p);
    // ผู้ใช้และบทบาท: ค่า RoleSet ล่าสุดของแต่ละกระเป๋า (0 = ถูกถอนสิทธิ์)
    // เจ้าของสัญญาเป็นแอดมินเสมอ อ่านค่าตรงจากสัญญา ไม่ต้องพึ่งการค้นหาเหตุการณ์ย้อนหลัง
    if((await p.getCode(CONTRACT_ADDRESS))==='0x') throw new Error('ไม่พบสัญญาที่ที่อยู่ '+CONTRACT_ADDRESS.slice(0,8)+'… บน Sepolia ที่อยู่อาจผิด');
    let owner=''; try{ owner=(await c.owner()).toLowerCase(); }catch(e){ owner=''; } // ถ้าอ่านไม่ได้ แอดมินจะมาจาก RoleSet ของตอนสร้างแทน
    if(owner&&!S.users.some(u=>u.wallet&&u.wallet.toLowerCase()===owner)){ const nm=savedNames()[owner]||'เจ้าของสัญญา (ผู้ดูแลระบบ)'; S.users.push({id:'w'+owner.slice(2,10),name:nm,org:nm,role:'admin',wallet:owner,perms:[...ROLES.admin.perms],onchain:true}); }
    S.users.forEach(u=>{ if(u.wallet&&u.wallet.toLowerCase()===owner) u.onchain=true; });
    const head=await p.getBlockNumber();
    const from=await findDeployBlock(p,head);
    const roles=await queryAll(c,c.filters.RoleSet(),from,head);
    const latest={};
    roles.forEach(l=>{ latest[l.args.who.toLowerCase()]=Number(l.args.role); });
    const names=savedNames();
    Object.entries(latest).forEach(([addr,r])=>{
      const i=S.users.findIndex(u=>u.wallet&&u.wallet.toLowerCase()===addr);
      if(r===0){ if(i>=0) S.users.splice(i,1); return; }
      const role=ROLE_BY_NUM[r];
      if(i>=0){ S.users[i].role=role; S.users[i].perms=[...ROLES[role].perms]; S.users[i].onchain=true; return; }
      const nm=names[addr]||`ผู้ใช้ ${addr.slice(0,6)}…${addr.slice(-4)}`;
      S.users.push({id:'w'+addr.slice(2,10),name:nm,org:nm,role,wallet:addr,perms:[...ROLES[role].perms],onchain:true});
    });
    // ล็อตและประวัติ: เล่นเหตุการณ์ตามลำดับบล็อก
    S.lots=[]; S.chain=[]; S.recalls=[]; S.recallQueue=[];
    const logs=await queryAll(c,c.filters.Logged(),from,head);
    S.skipped=0;
    const pos={};
    for(const l of logs){
      const code=l.args.lot, i=pos[code]??0; pos[code]=i+1;
      const e=await c.getFunction('getEvent')(code,i);
      replayEvent(code,{kind:Number(e.kind),actor:e.actor,to:e.to,status:e.status,note:e.note,prev:e.prev,hash:e.hash,ts:new Date(Number(e.ts)*1000).toISOString()});
    }
    S.loadInfo={addr:CONTRACT_ADDRESS,from,head,roles:roles.length,logs:logs.length,lots:S.lots.length,skipped:S.skipped||0};
    S.popup=null; S.ledgerCode=null;
    S.selected=S.lots.at(-1)?.code??null;
    W.msg=`โหลดข้อมูลจากบล็อกเชนแล้ว ${S.lots.length} ล็อต`;
  }catch(err){ W.msg='โหลดข้อมูลจากบล็อกเชนไม่สำเร็จ: '+(err.shortMessage||err.info?.error?.message||err.error?.message||err.message||err); S.loadInfo={error:W.msg}; toast(W.msg,false); }
  render();
}
/* ---------- Boot ---------- */
seed();
$('#shield').innerHTML=svg('shield');
if(CONTRACT_ON()){ S.lots=[]; S.chain=[]; S.recalls=[]; S.recallQueue=[]; $('#content').innerHTML='<div class="card muted">กำลังโหลดข้อมูลจากบล็อกเชน…</div>'; chainLoad(); }
else render();