// scripts.js — animations, reveal-on-scroll, particle background, typewriter
document.addEventListener('DOMContentLoaded',()=>{
  // Typewriter animation that repeats every 10 seconds
  const titleEl = document.getElementById('title-typed');
  const text = 'Mahiru Shiina';
  let isFirstTime = true;

  function startTyping() {
    let i = 0;
    titleEl.textContent = '';
    titleEl.classList.remove('glitch', 'completed');
    
    function typeNext() {
      if (i <= text.length) {
        // Smooth typing with variable delays
        const delay = 80 + Math.sin(i / 2) * 40;
        titleEl.textContent = text.slice(0, i);
        i++;
        setTimeout(typeNext, delay);
      } else {
        // Add glitch effect after completion
        setTimeout(() => {
          titleEl.classList.add('glitch', 'completed');
          titleEl.setAttribute('data-text', text);
          
          // Only trigger subtitle animation first time
          if (isFirstTime) {
            const subtitle = document.querySelector('.hero-sub');
            if (subtitle) {
              subtitle.style.opacity = '0';
              subtitle.style.transform = 'translateY(20px)';
              subtitle.style.transition = 'all 0.8s cubic-bezier(0.2, 0.9, 0.3, 1)';
              
              setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'none';
              }, 100);
            }
            isFirstTime = false;
          }

          // Wait 10 seconds before restarting
          setTimeout(() => {
            // Fade out current text
            titleEl.style.transition = 'opacity 0.5s';
            titleEl.style.opacity = '0';
            
            // Start new typing sequence
            setTimeout(() => {
              titleEl.style.opacity = '1';
              startTyping();
            }, 500);
          }, 10000);
        }, 300);
      }
    }
    
    typeNext();
  }
  
  // Initial start after page load
  setTimeout(startTyping, 800);

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
      }
    })
  })

  // Reveal on scroll (IntersectionObserver)
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    })
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Parallax for portrait subtle movement
  const portrait = document.querySelector('.portrait-wrap');
  window.addEventListener('scroll', ()=>{
    if(!portrait) return;
    const rect = portrait.getBoundingClientRect();
    const offset = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    portrait.style.transform = `translateY(${Math.max(-8, (offset-0.5)*12)}px)`;
  }, {passive:true});

  // Particle canvas — subtle slow-moving circles
  const canvas = document.getElementById('particle-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize(){
      W = canvas.width = canvas.clientWidth;
      H = canvas.height = canvas.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function initParticles(count){
      particles = [];
      for(let i=0;i<count;i++){
        particles.push({
          x: Math.random()*W,
          y: Math.random()*H,
          r: 10 + Math.random()*30,
          a: 0.02 + Math.random()*0.06,
          vx: (Math.random()-0.5)*0.05,
          vy: (Math.random()-0.5)*0.1,
          hue: 20 + Math.random()*40
        });
      }
    }
    initParticles(Math.round((W*H)/90000));

    function draw(){
      ctx.clearRect(0,0,W,H);
      for(const p of particles){
        p.x += p.vx;
        p.y += p.vy + Math.sin(Date.now()*p.a + p.x*0.001)*0.12;
        if(p.x < -p.r) p.x = W + p.r;
        if(p.x > W + p.r) p.x = -p.r;
        if(p.y < -p.r) p.y = H + p.r;
        if(p.y > H + p.r) p.y = -p.r;
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
        g.addColorStop(0, `rgba(255,218,185,${0.18})`);
        g.addColorStop(1, `rgba(255,160,122,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
});
