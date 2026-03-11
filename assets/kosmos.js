// ════════════════════════════════════════
// KOSMOS — kosmos.js
// Shared + page-specific JS, all in one file.
// Page-specific sections are guarded by element checks.
// ════════════════════════════════════════

// ── Menu ──
const menuBtn = document.getElementById('menuBtn');
const menuSymbol = document.getElementById('menuSymbol');
const menuOverlay = document.getElementById('menuOverlay');
const menuBackdrop = document.getElementById('menuBackdrop');
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  menuOverlay.classList.toggle('open', menuOpen);
  menuBackdrop.classList.toggle('open', menuOpen);
  menuBtn.classList.toggle('open', menuOpen);
  menuSymbol.textContent = menuOpen ? '×' : '+';
}
menuBtn.addEventListener('click', toggleMenu);
menuBackdrop.addEventListener('click', toggleMenu);

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.06 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ════════════════════════════════════════
// index.html — Hero canvas animation
// ════════════════════════════════════════
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let W, H, grid = [];

  function resize() {
    W = heroCanvas.width = window.innerWidth;
    H = heroCanvas.height = window.innerHeight;
    grid = [];
    const cols = Math.ceil(W / 60), rows = Math.ceil(H / 60);
    for (let r = 0; r <= rows; r++)
      for (let c = 0; c <= cols; c++)
        grid.push({ x: c*60, y: r*60, ox: c*60, oy: r*60, phase: Math.random() * Math.PI * 2 });
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.006;
    const cols = Math.ceil(W / 60) + 1, rows = Math.ceil(H / 60) + 1;
    grid.forEach(p => {
      p.x = p.ox + Math.sin(t + p.phase) * 8;
      p.y = p.oy + Math.cos(t * 0.7 + p.phase) * 6;
    });
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const idx = r * cols + c;
        const p = grid[idx], pr = grid[idx+1], pb = grid[idx+cols];
        if (pr && pb) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(pr.x, pr.y);
          ctx.moveTo(p.x, p.y); ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
    }
    grid.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.15 + 0.15 * Math.sin(t * 1.5 + p.phase)})`;
      ctx.fill();
    });
    const scanY = (Math.sin(t * 0.3) * 0.5 + 0.5) * H;
    const grad = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.05)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, scanY - 80, W, 160);
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ════════════════════════════════════════
// projektid.html — Filter
// ════════════════════════════════════════
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  const projectItems = document.querySelectorAll('.project-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      projectItems.forEach(item => {
        item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
      });
    });
  });
}

// ════════════════════════════════════════
// teenused.html — Accordion
// ════════════════════════════════════════
const accordionItems = document.querySelectorAll('.accordion-item');
if (accordionItems.length) {
  accordionItems.forEach(item => {
    item.querySelector('.accordion-trigger').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ════════════════════════════════════════
// inimesed.html — People bio overlay
// ════════════════════════════════════════
const personCards = document.querySelectorAll('.person-card');
if (personCards.length) {
  const people = {
    kadri:    { name: 'Kadri Pukk',          role: 'Spatial Designer', phone: '5333 7278', email: 'kadri@ksms.ee',      bio: 'Visuaalsete ruumide kujundaja, kellel on üle 10 aasta kogemust brändi- ja digitaalse valdkonnas. Töö lähtub ideest, et disain peab olema strateegiast lähtuv ja emotsionaalselt kõnetav.', projects: ['Noblessner Quarter', 'Tallinn Airport Signage', 'Ülemiste City Branding', 'Fahle Park Wayfinding'] },
    mart:     { name: 'Mart Lankots',        role: 'Spatial Designer', phone: '5645 6777', email: 'mart@ksms.ee',      bio: 'Ruumidisainer ja strateegiline mõtleja, kelle töö keskmes on inimese kogemus füüsilises keskkonnas. Pikaajaline kogemus nii avalike kui eraruumide kujundamisel.', projects: ['Tallinn Old Town Wayfinding', 'Saarineni maja', 'Volta kvartal', 'Tark Kontor'] },
    kristian: { name: 'Kristian Kirsfeldt',   role: 'Spatial Designer', phone: '5665 6777', email: 'kristian@ksms.ee', bio: 'Kristian on ekspert ruumibrändingu ja visuaalse identiteedi valdkonnas. Tema projektid ühendavad funktsionaalsuse esteetilise keelega, luues terviklikke ruumikogemusi.', projects: ['Ülemiste City', 'Fahle Park', 'Liikumise linna südames', 'Space activation project'] },
    jessica:  { name: 'Jessica Keri',         role: 'Spatial Designer', phone: '5333 7278', email: 'jessica@ksms.ee',  bio: 'Jessica töötab peamiselt placemaking ja ruumi aktiveerimise projektidega. Tema tugevus on kogukondade kaasamine disainprotsessi ja tähenduslike kohtade loomine.', projects: ['Placemaking Tallinn', 'Temporary spaces 2024', 'Spatial installations', 'Community hub design'] },
    kerdi:    { name: 'Kerdi-Kiia',           role: 'Spatial Designer', phone: '5665 6777', email: 'kersti@ksms.ee',    bio: 'Kersti on spetsialiseerunud ajutistele ruumilistele installatsioonidele. Ta ühendab projekteerimisel käelise oskuse ja strateegilise mõtlemise.', projects: ['Temporary Pop-up Tallinn', 'Noblessner installations', 'Seasonal activations', 'Branded environments'] },
    helen:    { name: 'Helen Küppes',         role: 'Spatial Designer', phone: '5645 6777', email: 'helen@ksms.ee',    bio: 'Helen on kogenud graafilise disaini ja brändistrateegia valdkonnas. Tema töö tugevus peitub visuaalse kommunikatsiooni lihtsuses ja selguses.', projects: ['Spatial Branding 2024', 'Wayfinding systems', 'Brand identity spaces', 'Environmental graphics'] },
    liis:     { name: 'Liis Vainne',          role: 'Spatial Designer', phone: '5333 7278', email: 'lill@ksms.ee',     bio: 'Lill ühendab disainis looduslikud materjalid ja kaasaegsed ruumilahendused, luues harmoonilisi ja kestlikke keskkondi.', projects: ['Sustainable design 2024', 'Natural material study', 'Interior wayfinding', 'Biophilic spaces'] },
    katerina: { name: 'Katariina Mustasaar',  role: 'Spatial Designer', phone: '5665 6777', email: 'Katariina@ksms.ee', bio: 'Katariina on multidistsiplinaarne disainer, kelle kogemus ulatub ruumidisainist digitaalsete liidesteni. Tema projektides on alati tugev kontseptuaalne alus.', projects: ['Digital wayfinding', 'Mixed-reality spaces', 'Interactive installations', 'Tech-integrated signage'] },
    kristel:  { name: 'Kristel Linnutaja',    role: 'Spatial Designer', phone: '5645 6777', email: 'kristel@ksms.ee',  bio: 'Kristel on spetsialiseerunud kasutajakesksele disainile ja ruumianalüüsile. Ta toob projektidesse süsteemse lähenemise ja detailse viimistluse.', projects: ['User research 2024', 'Spatial analysis', 'Signage testing', 'Customer journey mapping'] },
    alan:     { name: 'Alan Reiss',           role: 'Spatial Designer', phone: '5333 7278', email: 'alan@ksms.ee',     bio: 'Alan on kogenud konstruktiivse disaini ja tootmise valdkonnas. Tema tugevus on ideede elluviimine — prototüübist valmis installatsioonini.', projects: ['Production management', 'Large-scale installations', 'Fabrication design', 'Installation supervision'] },
    jaak:     { name: 'Jaak Peep',           role: 'Spatial Designer', phone: '5665 6777', email: 'jaak@ksms.ee',     bio: 'Jaak on kogenud projektijuht ja ruumidisainer, kelle töö hõlmab nii avalikke ruume kui ka erasektori tellimusprojekte Eestis ja välismaal.', projects: ['International projects', 'Project management', 'Public space design', 'Client relations'] },
    siim:     { name: 'Siim Tiks',            role: 'Spatial Designer', phone: '5645 6777', email: 'siim@ksms.ee',     bio: 'Siim ühendab fotograafia ja ruumidisaini, luues projekte, mis räägivad lugu nii visuaalselt kui ruumiliselt. Tema dokumentatsioon on osa disainprotsessist.', projects: ['Visual documentation', 'Photography & space', 'Narrative design', 'Brand storytelling'] },
  };

  personCards.forEach(card => {
    const p = people[card.dataset.person];
    if (!p) return;
    const overlay = card.querySelector('.person-bio-overlay');
    overlay.innerHTML = `
      <button class="bio-close" aria-label="Sulge"></button>
      <div class="bio-overlay-name">${p.name}</div>
      <div class="bio-overlay-role">${p.role}</div>
      <p class="bio-overlay-text">${p.bio}</p>
      <div class="bio-overlay-contact">
        <a href="tel:${p.phone}">${p.phone}</a><br>
        <a href="mailto:${p.email}">${p.email}</a>
      </div>
      <div class="bio-overlay-projects">
        <div class="bio-overlay-projects-label">Projektid</div>
        <ul>${p.projects.map(pr => `<li>${pr}</li>`).join('')}</ul>
      </div>
    `;
    card.addEventListener('click', e => {
      if (e.target.closest('.bio-close') || e.target.closest('a')) return;
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.person-card.active').forEach(c => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    });
    overlay.querySelector('.bio-close').addEventListener('click', e => {
      e.stopPropagation();
      card.classList.remove('active');
    });
  });
}
