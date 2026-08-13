const loader=document.querySelector('#loader');
window.addEventListener('load',()=>{
  setTimeout(()=>{loader.classList.add('done');setTimeout(()=>loader.remove(),900)},650);
});

const cursor=document.querySelector('.cursor');
window.addEventListener('mousemove',e=>{
  cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px';
  document.documentElement.style.setProperty('--mx',(e.clientX/innerWidth*100)+'%');
  document.documentElement.style.setProperty('--my',(e.clientY/innerHeight*100)+'%');
});

const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(x=>revealObs.observe(x));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}
}));

/* Floating particles */
const canvas=document.getElementById('particles'),ctx=canvas.getContext('2d');
let W,H,dots=[];
function resize(){
  const dpr=devicePixelRatio||1;
  W=canvas.width=innerWidth*dpr; H=canvas.height=innerHeight*dpr;
  canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px';
  dots=Array.from({length:Math.min(120,Math.floor(innerWidth/11))},()=>({
    x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.25,
    v:Math.random()*.42+.04,a:Math.random()*.45+.08
  }));
}
function draw(){
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#b6f000';
  dots.forEach(d=>{d.y-=d.v;if(d.y<0)d.y=H;ctx.globalAlpha=d.a;
    ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill()});
  requestAnimationFrame(draw);
}
resize();draw();addEventListener('resize',resize);

/* Football cursor trail */
let trail=[];
window.addEventListener('mousemove',e=>{
  trail.push({x:e.clientX,y:e.clientY,t:performance.now()});
  if(trail.length>10)trail.shift();
});

/* 3D tilt cards */
document.querySelectorAll('.skill-card,.project-card,.score,.timeline-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const rx=-(e.clientY-r.top-r.height/2)/20;
    const ry=(e.clientX-r.left-r.width/2)/20;
    card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='');
});

/* Hero parallax */
const hero=document.querySelector('.hero');
const art=document.querySelector('.hero-art');
const copy=document.querySelector('.hero-copy');
window.addEventListener('scroll',()=>{
  const y=scrollY;
  if(hero && y<innerHeight*1.25){
    art.style.transform=`translate3d(${Math.min(y*.015,14)}px,${y*.08}px,0)`;
    copy.style.transform=`translate3d(0,${y*.025}px,0)`;
  }
});

/* Scroll progress / section number */
const progress=document.createElement('div');
progress.className='scroll-progress';
document.body.appendChild(progress);
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(scrollY/Math.max(h,1)*100)+'%';
});

/* Matchday keyboard shortcuts */
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') window.scrollTo({top:0,behavior:'smooth'});
});
