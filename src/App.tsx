import {useState,useEffect} from "react"; import {Heart, Menu, X, ArrowRight, ShieldCheck, HandHeart, GraduationCap, Stethoscope, Users, Images, Mail, Phone, MapPin, ChevronRight, Copy, Check, MessageCircle, ArrowUp, Landmark, Send} from "lucide-react"; import {foundation,objectives,activities,trustees} from "./data/content"; import {orgConfig,outlookComposeLink} from "./data/orgConfig"; import logoIcon from "./assets/logo-icon.png"; import galMedical from "./pages/gallery/m1.jpg"; import galEducation from "./pages/gallery/e1.jpg";

const Img=({src,alt}:{src:string,alt:string})=><img src={src} alt={alt} loading="lazy"/>;

// Brand mark: real logo icon + colour-split wordmark (Food Express = peacock green, Foundation = black/light)
const Brand=({dark=false,size=48}:{dark?:boolean,size?:number})=>
 <span className="brand">
  <span className="brandmark" style={{width:size,height:size}}><img src={logoIcon} alt="Food Express Foundation"/></span>
  <span className={"brand-text"+(dark?" on-dark":"")}>FOOD EXPRESS<small>FOUNDATION</small></span>
 </span>;

// Small toast/snackbar used for "copied", "message sent" etc.
function Toast({msg,onDone}:{msg:string,onDone:()=>void}){
 useEffect(()=>{const t=setTimeout(onDone,2600); return ()=>clearTimeout(t)},[]);
 return <div className="toast"><Check size={16}/> {msg}</div>;
}

// Copy-to-clipboard row used inside the donation modal
function CopyRow({label,value}:{label:string,value:string}){
 const [copied,setCopied]=useState(false);
 const copy=()=>{navigator.clipboard?.writeText(value).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),1800);};
 return <div className="copy-row"><div><b>{label}</b><span>{value}</span></div><button onClick={copy} type="button">{copied?<Check size={15}/>:<Copy size={15}/>}{copied?"Copied":"Copy"}</button></div>;
}

// Hardcoded bank-details donation modal — opens directly from every "Donate" button
function DonationModal({amount,onClose}:{amount:string,onClose:()=>void}){
 const b=orgConfig.bank;
 return <div className="modal-overlay" onClick={onClose}>
  <div className="modal donate-modal" onClick={e=>e.stopPropagation()}>
   <button className="modal-close" onClick={onClose}><X size={18}/></button>
   <div className="modal-icon"><Landmark size={22}/></div>
   <h3>Bank Transfer Details</h3>
   <p className="modal-sub">{amount?<>Contribution amount: <b>{amount}</b><br/></>:null}Transfer directly using the verified account details below, or scan/share with your bank app.</p>
   <div className="copy-rows">
    <CopyRow label="Account Name" value={b.accountName}/>
    <CopyRow label="Account Number" value={b.accountNumber}/>
    <CopyRow label="IFSC Code" value={b.ifsc}/>
    <CopyRow label="Bank & Branch" value={b.bankName+", "+b.branch}/>
    <CopyRow label="PAN" value={b.pan}/>
   </div>
   <p className="modal-note">After transferring, please share your payment reference on <a href={outlookComposeLink("Donation Payment Proof")} target="_blank" rel="noreferrer"><b>{orgConfig.email}</b></a> or WhatsApp so we can send you a receipt.</p>
   <a className="donate full" href={`https://wa.me/${orgConfig.countryCode.replace("+","")}${orgConfig.phone}?text=${encodeURIComponent("Hi, I have just made a donation to Food Express Foundation"+(amount?` of ${amount}`:"")+". Sharing my payment details here.")}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> Share Payment Proof on WhatsApp</a>
  </div>
 </div>;
}

// Auto-advancing images for the Nepal Flood Relief appeal (shown as a compact card on the side of the hero).
const nepalSlides=[
 ["https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=900&q=80","Reaching flood-affected families with emergency relief"],
 ["https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80","Volunteers mobilising relief supplies"],
 ["https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=900&q=80","Food and essential kits for displaced families"],
 ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80","Standing with communities as they rebuild"]
];

// Nepal Flood Relief appeal — small auto-rotating card floated on the side of the hero (not a full section).
function NepalSideCard({onDonate}:{onDonate:(amount:string)=>void}){
 const [idx,setIdx]=useState(0);
 useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%nepalSlides.length),3200); return ()=>clearInterval(t)},[]);
 return <div className="nepal-side-card">
  <div className="nepal-side-slides">
   {nepalSlides.map(([src,cap],i)=><div className={"nepal-side-slide"+(i===idx?" active":"")} key={src}><Img src={src} alt={cap}/></div>)}
   <span className="nepal-side-badge">URGENT · NEPAL FLOOD</span>
   <div className="nepal-side-dots">{nepalSlides.map((_,i)=><button key={i} type="button" className={i===idx?"active":""} onClick={()=>setIdx(i)} aria-label={`Show slide ${i+1}`}/>)}</div>
  </div>
  <div className="nepal-side-body">
   <h4>Nepal Flood Relief</h4>
   <p>Thousands of families need urgent help. Support our relief effort.</p>
   <button className="donate full" onClick={()=>onDonate("Nepal Flood Relief")}>Donate Now <ArrowRight size={15}/></button>
  </div>
 </div>;
}

function App(){
 const [menu,setMenu]=useState(false); const [admin,setAdmin]=useState(false);
 const [donateOpen,setDonateOpen]=useState<string|null>(null); // holds selected amount label, "" for none
 const [pickedAmount,setPickedAmount]=useState("");
 const [customAmount,setCustomAmount]=useState("");
 const [toast,setToast]=useState("");
 const [showTop,setShowTop]=useState(false);
 const [sending,setSending]=useState(false);

 useEffect(()=>{const onScroll=()=>setShowTop(window.scrollY>600); window.addEventListener("scroll",onScroll); return ()=>window.removeEventListener("scroll",onScroll)},[]);

 const openDonate=(amount:string)=>{setDonateOpen(amount||"General Contribution")};
 const nav=[["Home","#home"],["About Us","#about"],["Our Work","#work"],["Campaigns","#campaigns"],["Gallery","#gallery"],["Transparency","#transparency"],["Contact","#contact"]];

 const sendMessage=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  const f=new FormData(e.currentTarget);
  const name=f.get("name") as string, email=f.get("email") as string, phone=f.get("phone") as string, reason=f.get("reason") as string, message=f.get("message") as string;
  const body=`Food Express Foundation – Website Enquiry\nName: ${name||"-"}\nEmail: ${email||"-"}\nPhone: ${phone||"-"}\nReason: ${reason||"-"}\nMessage: ${message||"-"}`;
  setSending(true);
  // Opens the device's SMS app with the Foundation's number & message pre-filled — works without any backend.
  window.location.href=`sms:${orgConfig.countryCode}${orgConfig.phone}?&body=${encodeURIComponent(body)}`;
  setTimeout(()=>{setSending(false); setToast("Opening Messages app to send to "+orgConfig.countryCode+orgConfig.phone+"…"); e.currentTarget.reset();},400);
 };

 if(admin) return <Admin onBack={()=>setAdmin(false)}/>;
 return <div>
  {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
  {donateOpen!==null&&<DonationModal amount={donateOpen} onClose={()=>setDonateOpen(null)}/>}
  <div className="topbar"><span>Serving charitable & humanitarian causes across India</span><span><Mail size={14}/> <a className="topbar-email" href={outlookComposeLink()} target="_blank" rel="noreferrer">{orgConfig.email}</a></span></div>
  <header><a className="brand-link" href="#home"><Brand/></a>
   <nav>{nav.map(([n,h])=><a key={n} href={h}>{n}</a>)}</nav>
   <div className="head-actions"><a className="outline" href="#contact">Get Involved</a><button className="donate" onClick={()=>openDonate("")}>Donate Now</button></div>
   <button className="menu" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
  </header>
  {menu&&<div className="mobile-nav">{nav.map(([n,h])=><a onClick={()=>setMenu(false)} href={h} key={n}>{n}</a>)}<button className="donate" onClick={()=>{setMenu(false);openDonate("")}}>Donate Now</button></div>}
  <main>
   <section id="home" className="hero"><div className="hero-bg"><Img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=2200&q=85" alt="Volunteers helping a community"/></div><div className="hero-overlay"/><div className="hero-content"><div className="eyebrow"><span/> PUBLIC CHARITABLE TRUST</div><h1>Together, we can bring <em>hope</em> where it is needed most.</h1><p>Food Express Foundation works to support poor and needy communities and provide relief and assistance during natural disasters and difficult times.</p><div className="hero-buttons"><button className="donate big" onClick={()=>openDonate("")}>Donate Now <ArrowRight size={18}/></button><a className="light-btn" href="#work">See Our Work <ChevronRight size={18}/></a></div><div className="hero-note"><ShieldCheck size={18}/> Working for charitable and humanitarian causes across India.</div></div><NepalSideCard onDonate={openDonate}/></section>

   <section className="intro section"><div className="section-tag">WHO WE ARE</div><h2>Serving communities through <span>compassion and action.</span></h2><p className="lead">Food Express Foundation is a Public Charitable Trust established to support people in need through relief, education, medical assistance and community welfare.</p></section>

   <section className="purpose section"><div className="grid6">{objectives.map(([t,d],i)=><div className="purpose-card" key={t}><div className="icon">{[<HandHeart/>,<Heart/>,<Stethoscope/>,<GraduationCap/>,<Users/>,<ShieldCheck/>][i]}</div><h3>{t}</h3><p>{d}</p></div>)}</div></section>

   <section id="work" className="relief"><div className="relief-image"><Img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1500&q=85" alt="Relief volunteers"/></div><div className="relief-copy"><div className="section-tag">DISASTER RELIEF</div><h2>When disaster strikes, every <span>helping hand matters.</span></h2><p>The Trust's charitable objectives include providing assistance, relief and rehabilitation support to people affected by floods, earthquakes, cyclones, famine, fire, epidemics and other natural calamities.</p><a className="text-link" href="#donate">Support Relief Efforts <ArrowRight size={17}/></a></div></section>

   <section className="section" id="about"><div className="two"><div><div className="section-tag">OUR MISSION</div><h2>Help that reaches people when they need it most.</h2><p className="lead">The Foundation's stated objects cover poverty relief, education, medical assistance, disaster relief, community welfare and support for vulnerable people.</p></div><div className="about-card"><div className="about-row"><b>Established</b><span>{foundation.established}</span></div><div className="about-row"><b>Type</b><span>{foundation.type}</span></div><div className="about-row"><b>Area of Operation</b><span>{foundation.area}</span></div><div className="about-row"><b>Initial Trust Fund</b><span>₹1,000</span></div></div></div></section>

   <section className="section soft"><div className="section-head"><div><div className="section-tag">OUR ACTIVITIES</div><h2>Turning purpose into <span>action.</span></h2></div><a className="text-link" href="#gallery">View Gallery <ArrowRight size={17}/></a></div><div className="activity-grid">{activities.map(([t,s])=><div className="activity" key={t}><Img src={s} alt={t}/><div><span>FOOD EXPRESS FOUNDATION</span><h3>{t}</h3><a href="#contact">Learn more <ArrowRight size={15}/></a></div></div>)}</div></section>

   <section id="campaigns" className="section"><div className="section-head"><div><div className="section-tag">CAMPAIGNS</div><h2>Support a cause that <span>matters.</span></h2></div></div><div className="campaign-grid">{["Maharashtra Flood Relief","Food Assistance","Medical Relief"].map((t,i)=><div className="campaign" key={t}><div className="campaign-img"><Img src={activities[i][1]} alt={t}/><b>DEMO CAMPAIGN</b></div><div className="campaign-body"><h3>{t}</h3><p>Food and essential support for communities facing difficult circumstances.</p><div className="bar"><i style={{width:[62,45,35][i]+"%"}}/></div><div className="money"><span>₹6,25,000 raised</span><small>Target ₹10,00,000</small></div><button className="donate full" onClick={()=>openDonate("")}>Donate to this campaign</button></div></div>)}</div><p className="demo">Demo campaign values — replace with verified campaign data.</p></section>

   <section id="donate" className="donate-banner"><div><div className="section-tag">MAKE A DIFFERENCE</div><h2>Your support can become someone's <span>hope.</span></h2><p>Online donations are currently available within India. International contribution enquiries can be made by email.</p></div><div className="donate-box"><h3>Choose your contribution</h3><div className="amounts">{["₹500","₹1,000","₹2,500","₹5,000"].map(x=><button key={x} type="button" className={pickedAmount===x?"picked":""} onClick={()=>{setPickedAmount(x);setCustomAmount("")}}>{x}</button>)}</div><input placeholder="Custom amount (₹)" value={customAmount} onChange={e=>{setCustomAmount(e.target.value);setPickedAmount("")}}/><button type="button" className="donate full" onClick={()=>openDonate(customAmount?`₹${customAmount}`:pickedAmount)}>Continue to Indian Payment</button><a className="international" href={outlookComposeLink("International Donation Enquiry")} target="_blank" rel="noreferrer">International Donation Enquiry →</a></div></section>

   <section id="gallery" className="section"><div className="section-head"><div><div className="section-tag">GALLERY</div><h2>Stories of <span>service.</span></h2></div><Images/></div><div className="gallery-marquee"><div className="gallery-track">{(()=>{const items=[...activities,["On-ground Medical Camp",galMedical],["Girl Child Education",galEducation],["Community Support","https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80"],["Rural Community","https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"]]; return [...items,...items].map(([t,s],i)=><div className="g-item" key={t+i}><Img src={s} alt={t}/><span>{t}</span></div>)})()}</div></div></section>

   <section id="transparency" className="section soft"><div className="section-tag">TRANSPARENCY</div><h2>Your trust <span>matters.</span></h2><p className="lead">Financial and activity information will be published from verified organizational records.</p><div className="stats"><div><b>₹60,000- </b><span>Total Donations Received</span></div><div><b>6,500+</b><span>People / Communities Assisted</span></div><div><b>3,200+</b><span>Relief Distributed</span></div><div><b>12+</b><span>Active Campaigns</span></div></div></section>

   <section className="section trustees"><div className="section-tag">TRUST GOVERNANCE</div><h2>Meet the <span>trustees.</span></h2><div className="trustee-grid">{trustees.map(([n,r])=><div className="trustee" key={n}><div className="avatar">{n.split(" ").slice(-2).map(x=>x[0]).join("")}</div><h3>{n}</h3><p>{r}</p></div>)}</div></section>

   <section id="contact" className="contact section"><div><div className="section-tag">GET IN TOUCH</div><h2>Be part of the <span>change.</span></h2><p className="lead">Have a question, want to volunteer, or need information about supporting our work?</p><div className="contact-lines"><div><Mail/> <a href={outlookComposeLink()} target="_blank" rel="noreferrer">{orgConfig.email}</a></div><div><Phone/> <span>{orgConfig.countryCode} {orgConfig.phone}</span></div><div><MapPin/> <span>{orgConfig.address}</span></div></div></div>
    <form onSubmit={sendMessage}><input name="name" placeholder="Your name" required/><input name="email" type="email" placeholder="Email address"/><input name="phone" placeholder="Phone number"/><select name="reason" defaultValue=""><option value="" disabled>Reason for contacting</option><option>General Enquiry</option><option>Volunteer</option><option>International Donation Enquiry</option><option>Partnership</option></select><textarea name="message" placeholder="Your message" required/><button className="donate full" disabled={sending}><Send size={15}/> {sending?"Opening Messages…":"Send Message"}</button></form>
   </section>
  </main>
  <footer><div className="footer-brand-wrap"><Brand dark size={34}/></div><p>Working for charitable and humanitarian causes.</p><div className="footer-links">{nav.map(([n,h])=><a href={h} key={n}>{n}</a>)}<a href="#donate">Donate</a></div><div className="copyright">© {new Date().getFullYear()} Food Express Foundation. All rights reserved. <button onClick={()=>setAdmin(true)}>Admin</button></div><div className="tech-credit">Technical Head: L. Vaidehi &nbsp;|&nbsp; +91 7506808321</div></footer>

  <a className="fab whatsapp-fab" href={`https://wa.me/${orgConfig.countryCode.replace("+","")}${orgConfig.phone}?text=${encodeURIComponent("Hi, I'd like to know more about Food Express Foundation.")}`} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><MessageCircle size={24}/></a>
  {showTop&&<button className="fab top-fab" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} aria-label="Back to top"><ArrowUp size={20}/></button>}
 </div>
}

function Admin({onBack}:{onBack:()=>void}){const [logged,setLogged]=useState(false); if(!logged)return <div className="admin-login"><div className="login-card"><Brand/><h1>Admin Login</h1><p>Manage foundation content securely.</p><input placeholder="Email / Username"/><input placeholder="Password" type="password"/><button className="donate full" onClick={()=>setLogged(true)}>Login</button><button className="back" onClick={onBack}>← Back to website</button></div></div>; return <div className="admin"><aside><div className="admin-side-brand"><Brand dark size={34}/></div>{["Dashboard","Events","Gallery","Trustees","Activities","Donations","Documents","Messages","Settings"].map(x=><a key={x}>{x}</a>)}<button onClick={onBack}>Logout</button></aside><div className="admin-main"><div className="admin-head"><div><div className="section-tag">ADMIN PANEL</div><h1>Dashboard</h1></div><button className="outline">View Website</button></div><div className="admin-stats">{[["📊","Total Donations","₹ —"],["👥","Total Donors","—"],["📅","Total Events","—"],["🖼️","Gallery Images","—"],["📩","Contact Messages","—"]].map(x=><div className="admin-stat" key={x[1]}><span>{x[0]}</span><b>{x[2]}</b><small>{x[1]}</small></div>)}</div><div className="admin-grid"><div className="admin-panel"><h3>Quick Management</h3>{["＋ Add New Event","＋ Upload Gallery Photos","＋ Add Activity","＋ Upload Document","View Donation Records","View Contact Messages"].map(x=><button key={x}>{x}</button>)}</div><div className="admin-panel"><h3>Recent Activity</h3><p>No verified activity yet.</p><p>No verified donations yet.</p><p>No new messages.</p></div></div></div></div>}
export default App;
