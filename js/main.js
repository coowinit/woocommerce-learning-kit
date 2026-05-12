
document.addEventListener('DOMContentLoaded',function(){
  const search=document.querySelector('[data-product-search]');
  const cards=document.querySelectorAll('[data-card]');
  if(search&&cards.length){
    search.addEventListener('input',function(){
      const k=search.value.trim().toLowerCase();
      cards.forEach(c=>{
        const t=(c.dataset.name+' '+c.dataset.category).toLowerCase();
        c.style.display=t.includes(k)?'':'none';
      });
    });
  }
  document.querySelectorAll('[data-options]').forEach(g=>{
    g.querySelectorAll('button').forEach(b=>{
      b.addEventListener('click',()=>{g.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');});
    });
  });
  const tabs=document.querySelectorAll('[data-tab]');
  const panels=document.querySelectorAll('[data-panel]');
  tabs.forEach(t=>t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active'));t.classList.add('active');
    panels.forEach(p=>p.hidden=p.dataset.panel!==t.dataset.tab);
  }));
});
