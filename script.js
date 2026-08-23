const loader=document.getElementById('loader');
const percent=document.getElementById('loaderPercent');

window.addEventListener('load',()=>{
  const start=performance.now(),duration=2850;
  function tick(now){
    const progress=Math.min((now-start)/duration,1);
    if(percent) percent.textContent=String(Math.round(progress*100)).padStart(2,'0')+'%';
    if(progress<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  setTimeout(()=>{
    loader?.classList.add('done');
    document.body.classList.add('site-ready');
  },duration+120);
});

const menu=document.querySelector('.menu');
const nav=document.querySelector('nav');
menu?.addEventListener('click',()=>nav?.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav?.classList.remove('open')));

const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('show');
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

document.querySelectorAll('a[href="#top"]').forEach(link=>{
  link.addEventListener('click',event=>{
    event.preventDefault();
    window.scrollTo({top:0,behavior:'smooth'});
  });
});
