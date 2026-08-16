const loader=document.getElementById('loader');
const percent=document.getElementById('loaderPercent');

window.addEventListener('load',()=>{
  const start=performance.now();
  const duration=2850;

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

const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting)e.target.classList.add('show');
}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
