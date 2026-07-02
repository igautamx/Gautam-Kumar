// ===== Typing animation in the hero console =====
(function typeConsole(){
  const el = document.getElementById('typedLine');
  const resultEl = document.getElementById('consoleResult');
  if(!el) return;

  const text = "> running query...";
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(reduceMotion){
    el.textContent = text;
    resultEl.classList.add('is-visible');
    return;
  }

  let i = 0;
  function tick(){
    if(i <= text.length){
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, 35);
    } else {
      setTimeout(() => resultEl.classList.add('is-visible'), 250);
    }
  }
  setTimeout(tick, 400);
})();

// ===== KPI count-up on scroll into view =====
(function kpiCountUp(){
  const nums = document.querySelectorAll('.kpi__num');
  if(!nums.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(el){
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if(reduceMotion){
      el.textContent = target.toLocaleString() + suffix;
      return;
    }
    const duration = 900;
    const start = performance.now();
    function frame(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if(progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  nums.forEach(n => observer.observe(n));
})();

// ===== Project filtering =====
(function projectFilter(){
  const bar = document.getElementById('filterBar');
  const grid = document.getElementById('projectGrid');
  if(!bar || !grid) return;

  const chips = bar.querySelectorAll('.filter-chip');
  const projects = grid.querySelectorAll('.project');

  bar.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if(!chip) return;

    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');

    const filter = chip.dataset.filter;
    projects.forEach(p => {
      const tags = p.dataset.tags || '';
      const show = filter === 'all' || tags.includes(filter);
      p.classList.toggle('is-hidden', !show);
    });
  });
})();
