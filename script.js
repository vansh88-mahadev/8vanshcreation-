// Smooth reveal animation
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
});

document.querySelectorAll(".card,.hero-text,.hero-image,.about-text").forEach(el=>{
  el.classList.add("hidden");
  observer.observe(el);
});

// Navbar background on scroll
window.addEventListener("scroll",()=>{
  const header=document.querySelector("header");
  if(window.scrollY>50){
    header.style.background="rgba(5,10,25,.9)";
  }else{
    header.style.background="rgba(8,12,28,.65)";
  }
});

// Floating particles
const bg=document.getElementById("particles");

for(let i=0;i<80;i++){

const p=document.createElement("span");

p.style.position="absolute";
p.style.width=Math.random()*4+2+"px";
p.style.height=p.style.width;
p.style.background="cyan";
p.style.borderRadius="50%";
p.style.left=Math.random()*100+"%";
p.style.top=Math.random()*100+"%";
p.style.opacity=Math.random();

const duration=Math.random()*20+10;

p.animate([
{transform:"translateY(0px)"},
{transform:"translateY(-120vh)"}
],{
duration:duration*1000,
iterations:Infinity
});

bg.appendChild(p);

  }
