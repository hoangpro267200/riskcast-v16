/* ============================================

   RISKCAST Home v27 - Cinematic AI Engine (B1)

   Pure Vanilla JS - 2D Canvas Only

============================================ */



document.addEventListener('DOMContentLoaded', () => {



  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



  // ==========================================

  // LAYER 1: STARS ENGINE

  // ==========================================



  function initStars() {

    if (prefersReducedMotion) return;



    const canvas = document.getElementById('rc-stars');

    if (!canvas) return;



    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;



    const stars = [];

    const starCount = 400;



    for (let i = 0; i < starCount; i++) {

      stars.push({

        x: Math.random() * canvas.width,

        y: Math.random() * canvas.height,

        radius: Math.random() * 1.5,

        opacity: Math.random() * 0.7 + 0.3,

        vx: (Math.random() - 0.5) * 0.04,

        vy: (Math.random() - 0.5) * 0.04,

        flicker: Math.random() * Math.PI * 2

      });

    }



    function animateStars() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);



      stars.forEach(star => {

        star.x += star.vx;

        star.y += star.vy;

        star.flicker += 0.02;



        if (star.x < 0) star.x = canvas.width;

        if (star.x > canvas.width) star.x = 0;

        if (star.y < 0) star.y = canvas.height;

        if (star.y > canvas.height) star.y = 0;



        const flickerOpacity = star.opacity * (0.7 + Math.sin(star.flicker) * 0.3);



        ctx.beginPath();

        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255, 255, 255, ${flickerOpacity})`;

        ctx.shadowBlur = 4;

        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';

        ctx.fill();

        ctx.shadowBlur = 0;

      });



      requestAnimationFrame(animateStars);

    }



    animateStars();



    window.addEventListener('resize', () => {

      canvas.width = window.innerWidth;

      canvas.height = window.innerHeight;

    });

  }



  // ==========================================

  // LAYER 2: NEURAL PARTICLES ENGINE

  // ==========================================



  function initParticles() {

    if (prefersReducedMotion) return;



    const canvas = document.getElementById('rc-particles');

    if (!canvas) return;



    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;



    const particles = [];

    const particleCount = 180;



    for (let i = 0; i < particleCount; i++) {

      particles.push({

        x: Math.random() * canvas.width,

        y: Math.random() * canvas.height,

        radius: Math.random() * 1.3 + 0.7, /* FIX reduce brightness */

        angle: Math.random() * Math.PI * 2,

        speed: Math.random() * 0.3 + 0.1,

        orbitRadius: Math.random() * 100 + 50,

        centerX: Math.random() * canvas.width,

        centerY: Math.random() * canvas.height,

        opacity: Math.random() * 0.6 + 0.4

      });

    }



    function animateParticles() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);



      const particlesLength = particles.length;

      particles.forEach((p, i) => {

        p.angle += p.speed * 0.01;

        p.x = p.centerX + Math.cos(p.angle) * p.orbitRadius;

        p.y = p.centerY + Math.sin(p.angle) * p.orbitRadius;



        ctx.beginPath();

        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(0, 245, 212, ${p.opacity})`;

        ctx.shadowBlur = 15;

        ctx.shadowColor = 'rgba(0, 245, 212, 0.8)';

        ctx.fill();

        ctx.shadowBlur = 0;



        // Connect nearby particles (cached length)

        for (let j = i + 1; j < particlesLength; j++) {

          const p2 = particles[j];

          const dx = p2.x - p.x;

          const dy = p2.y - p.y;

          const dist = Math.sqrt(dx * dx + dy * dy);



          if (dist < 110) { // FIX reduce beams clutter

            ctx.beginPath();

            ctx.moveTo(p.x, p.y);

            ctx.lineTo(p2.x, p2.y);

            ctx.strokeStyle = `rgba(0, 245, 212, ${0.15 * (1 - dist / 110)})`;

            ctx.lineWidth = 0.8;

            ctx.stroke();

          }

        }

      });



      requestAnimationFrame(animateParticles);

    }



    animateParticles();



    window.addEventListener('resize', () => {

      canvas.width = window.innerWidth;

      canvas.height = window.innerHeight;

    });

  }



  // ==========================================

  // LAYER 3: HOLOGRAM GLOBE ENGINE

  // ==========================================



  function initGlobe() {

    if (prefersReducedMotion) return;



    const canvas = document.getElementById('rc-globe');

    if (!canvas) return;



    const ctx = canvas.getContext('2d');

    const size = 400;

    canvas.width = size;

    canvas.height = size;



    const centerX = size / 2;

    const centerY = size / 2;

    const radius = 150;

    let rotation = 0;



    const ports = [];

    const portCount = 12;

    for (let i = 0; i < portCount; i++) {

      const angle = (i / portCount) * Math.PI * 2;

      ports.push({

        angle: angle,

        lat: (Math.random() - 0.5) * Math.PI * 0.6

      });

    }



    function drawGlobe() {

      // FIX: Skip drawing when off-screen

      const rect = canvas.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > window.innerHeight) {

        requestAnimationFrame(drawGlobe);

        return; // skip drawing when not visible

      }

      ctx.clearRect(0, 0, size, size);



      rotation += 0.005;



      // Draw globe outline

      ctx.beginPath();

      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

      ctx.strokeStyle = 'rgba(0, 245, 212, 0.3)';

      ctx.lineWidth = 2;

      ctx.shadowBlur = 20;

      ctx.shadowColor = 'rgba(0, 245, 212, 0.6)';

      ctx.stroke();

      ctx.shadowBlur = 0;



      // Draw longitude lines (cached count)

      const longitudeCount = 8;

      for (let i = 0; i < longitudeCount; i++) {

        const angle = (i / 8) * Math.PI * 2 + rotation;

        ctx.beginPath();

        for (let j = 0; j <= 50; j++) {

          const lat = ((j / 50) - 0.5) * Math.PI;

          const x = centerX + Math.cos(angle) * Math.cos(lat) * radius;

          const y = centerY + Math.sin(lat) * radius;

          const z = Math.sin(angle) * Math.cos(lat);



          if (z > 0) {

            if (j === 0) ctx.moveTo(x, y);

            else ctx.lineTo(x, y);

          }

        }

        ctx.strokeStyle = `rgba(0, 245, 212, ${0.15})`;

        ctx.lineWidth = 1;

        ctx.stroke();

      }



      // Draw latitude lines

      for (let i = -2; i <= 2; i++) {

        const lat = (i / 4) * Math.PI * 0.6;

        ctx.beginPath();

        for (let j = 0; j <= 100; j++) {

          const angle = (j / 100) * Math.PI * 2 + rotation;

          const x = centerX + Math.cos(angle) * Math.cos(lat) * radius;

          const y = centerY + Math.sin(lat) * radius;

          const z = Math.sin(angle) * Math.cos(lat);



          if (z > 0) {

            if (j === 0) ctx.moveTo(x, y);

            else ctx.lineTo(x, y);

          }

        }

        ctx.strokeStyle = `rgba(0, 245, 212, ${0.15})`;

        ctx.lineWidth = 1;

        ctx.stroke();

      }



      // Draw ports

      ports.forEach(port => {

        const angle = port.angle + rotation;

        const x = centerX + Math.cos(angle) * Math.cos(port.lat) * radius;

        const y = centerY + Math.sin(port.lat) * radius;

        const z = Math.sin(angle) * Math.cos(port.lat);



        if (z > 0) {

          const depth = (z + 1) / 2;

          ctx.beginPath();

          ctx.arc(x, y, 4, 0, Math.PI * 2);

          ctx.fillStyle = `rgba(0, 245, 212, ${depth * 0.8})`;

          ctx.shadowBlur = 10;

          ctx.shadowColor = 'rgba(0, 245, 212, 1)';

          ctx.fill();

          ctx.shadowBlur = 0;

        }

      });



      // Draw arcs between ports (cached length)

      const portsLength = ports.length;

      for (let i = 0; i < portsLength; i++) {

        for (let j = i + 1; j < portsLength; j++) {

          if (Math.random() > 0.7) {

            const p1 = ports[i];

            const p2 = ports[j];



            const angle1 = p1.angle + rotation;

            const angle2 = p2.angle + rotation;

            const x1 = centerX + Math.cos(angle1) * Math.cos(p1.lat) * radius;

            const y1 = centerY + Math.sin(p1.lat) * radius;

            const z1 = Math.sin(angle1) * Math.cos(p1.lat);



            const x2 = centerX + Math.cos(angle2) * Math.cos(p2.lat) * radius;

            const y2 = centerY + Math.sin(p2.lat) * radius;

            const z2 = Math.sin(angle2) * Math.cos(p2.lat);



            if (z1 > 0 && z2 > 0) {

              ctx.beginPath();

              ctx.moveTo(x1, y1);

              ctx.quadraticCurveTo(centerX, centerY - 50, x2, y2);

              ctx.strokeStyle = `rgba(153, 255, 234, 0.2)`;

              ctx.lineWidth = 1;

              ctx.stroke();

            }

          }

        }

      }



      requestAnimationFrame(drawGlobe);

    }



    drawGlobe();

    // Init data packets canvas

    initGlobePackets();

  }

  // ==========================================

  // GLOBE DATA PACKETS (v28)

  // ==========================================

  function initGlobePackets() {

    const canvas = document.getElementById('rc-globe-packets');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    canvas.width = 400;

    canvas.height = 400;

    const packets = [];

    const packetCount = 8;

    for (let i = 0; i < packetCount; i++) {

      packets.push({

        angle: (i / packetCount) * Math.PI * 2,

        radius: 180 + Math.random() * 20,

        speed: 0.01 + Math.random() * 0.01,

        size: 2 + Math.random() * 2

      });

    }

    function drawPackets() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;

      const centerY = canvas.height / 2;

      packets.forEach(packet => {

        packet.angle += packet.speed;

        const x = centerX + Math.cos(packet.angle) * packet.radius;

        const y = centerY + Math.sin(packet.angle) * packet.radius;

        ctx.beginPath();

        ctx.arc(x, y, packet.size, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(0, 245, 212, ${0.6})`;

        ctx.shadowBlur = 10;

        ctx.shadowColor = 'rgba(0, 245, 212, 1)';

        ctx.fill();

        ctx.shadowBlur = 0;

      });

      requestAnimationFrame(drawPackets);

    }

    drawPackets();

  }



  // ==========================================

  // PARALLAX CONTROLLER

  // ==========================================



  function initParallax() {

    if (prefersReducedMotion) return;



    const heroTitle = document.querySelector('.rc-hero__title');

    const heroSection = document.querySelector('.rc-hero');

    const holoGrid = document.getElementById('rcHoloGrid');

    const volumetric = document.querySelector('.rc-volumetric-light');



    if (!heroTitle || !heroSection) return;



    // Magnetic parallax

    let mouseX = 0;

    let mouseY = 0;

    let targetX = 0;

    let targetY = 0;

    heroSection.addEventListener('mousemove', (e) => {

      const rect = heroSection.getBoundingClientRect();

      mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;

      mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;

    });

    // Smooth magnetic effect

    function updateParallax() {

      targetX += (mouseX - targetX) * 0.1;

      targetY += (mouseY - targetY) * 0.1;

      heroTitle.style.transform = `translate(${targetX * 10}px, ${targetY * 5}px)`;

      // Globe tilt

      const globeContainer = document.getElementById('rcGlobeContainer');

      if (globeContainer) {

        const tiltX = targetY * 3;

        const tiltY = targetX * 3;

        globeContainer.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

      }

      requestAnimationFrame(updateParallax);

    }

    updateParallax();

    // Grid ripple on click

    if (holoGrid) {

      document.addEventListener('click', (e) => {

        const ripple = document.createElement('div');

        ripple.style.position = 'absolute';

        ripple.style.left = e.clientX + 'px';

        ripple.style.top = e.clientY + 'px';

        ripple.style.width = '0px';

        ripple.style.height = '0px';

        ripple.style.borderRadius = '50%';

        ripple.style.border = '2px solid rgba(0, 245, 212, 0.6)';

        ripple.style.transform = 'translate(-50%, -50%)';

        ripple.style.pointerEvents = 'none';

        ripple.style.zIndex = '1000';

        document.body.appendChild(ripple);

        requestAnimationFrame(() => {

          ripple.style.transition = 'width 0.6s ease-out, height 0.6s ease-out, opacity 0.6s ease-out';

          ripple.style.width = '200px';

          ripple.style.height = '200px';

          ripple.style.opacity = '0';

        });

        setTimeout(() => ripple.remove(), 600);

        holoGrid.classList.add('rc-holo-grid--ripple');

        setTimeout(() => holoGrid.classList.remove('rc-holo-grid--ripple'), 600);

      });

    }



    let ticking = false;

    window.addEventListener('scroll', () => {

      if (!ticking) {

        requestAnimationFrame(() => {

          const scrollY = window.scrollY;

          if (holoGrid) {

            holoGrid.style.transform = `translateY(${scrollY * 0.1}px)`;

          }

          if (volumetric) {

            volumetric.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.15}px)`;

          }

          ticking = false;

        });

        ticking = true;

      }

    });

  }



  // ==========================================

  // SECTION REVEAL ENGINE

  // ==========================================



  function initSectionReveal() {

    const sections = document.querySelectorAll('.rc-section:not(.rc-hero)');

    const sectionCount = sections.length;

    let revealedCount = 0;

    const observer = new IntersectionObserver((entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting && !entry.target.classList.contains('rc-section--revealed')) {

          entry.target.classList.add('rc-section--revealed');

          // Volumetric beam sweep

          const beam = document.createElement('div');

          beam.style.position = 'absolute';

          beam.style.top = '0';

          beam.style.left = '0';

          beam.style.width = '100%';

          beam.style.height = '2px';

          beam.style.background = 'linear-gradient(90deg, transparent, var(--rc-neon), transparent)';

          beam.style.boxShadow = '0 0 20px var(--rc-neon)';

          beam.style.transform = 'translateX(-100%)';

          beam.style.transition = 'transform 1s ease-out';

          beam.style.zIndex = '100';

          entry.target.style.position = 'relative';

          entry.target.appendChild(beam);

          requestAnimationFrame(() => {

            beam.style.transform = 'translateX(100%)';

          });

          setTimeout(() => beam.remove(), 1000);

          // Particle burst

          createParticleBurst(entry.target);

        }

      });

    }, {

      threshold: 0.05, /* FIX: lower threshold for earlier trigger */

      rootMargin: '0px 0px 0px 0px' /* FIX: remove negative margin */

    });

    sections.forEach(section => {

      // Check if section is already in viewport on load

      const rect = section.getBoundingClientRect();

      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      

      if (isVisible) {

        // Reveal immediately if already visible

        section.classList.add('rc-section--revealed');

      } else {

        // Otherwise set initial hidden state

        section.style.opacity = '0';

        section.style.transform = 'translateY(40px) translateZ(-30px)';

        section.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.4, 0, 0.2, 1)';

      }

      observer.observe(section);

    });

  }

  // ==========================================

  // PARTICLE BURST (v28)

  // ==========================================

  function createParticleBurst(element) {

    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;

    const centerY = rect.top + rect.height / 2;

    const particleCount = 8 + Math.floor(Math.random() * 5);

    for (let i = 0; i < particleCount; i++) {

      const particle = document.createElement('div');

      const angle = (i / particleCount) * Math.PI * 2;

      const distance = 50 + Math.random() * 50;

      const size = 2 + Math.random() * 3;

      particle.style.position = 'fixed';

      particle.style.left = centerX + 'px';

      particle.style.top = centerY + 'px';

      particle.style.width = size + 'px';

      particle.style.height = size + 'px';

      particle.style.background = 'var(--rc-neon)';

      particle.style.borderRadius = '50%';

      particle.style.boxShadow = '0 0 10px var(--rc-neon)';

      particle.style.pointerEvents = 'none';

      particle.style.zIndex = '9999';

      document.body.appendChild(particle);

      requestAnimationFrame(() => {

        particle.style.transition = 'all 0.8s ease-out';

        particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;

        particle.style.opacity = '0';

      });

      setTimeout(() => particle.remove(), 800);

    }

  }



  // ==========================================

  // NAVBAR INTELLIGENT BEHAVIOR

  // ==========================================



  // ==========================================

  // FUTUREOS NAVBAR (v28)

  // ==========================================

  function initNavbar() {

    const navbar = document.getElementById('rcNavbarFuture');

    if (!navbar) return;

    // Show navbar on load

    setTimeout(() => {

      navbar.classList.add('rc-navbar-future--visible');

    }, 500);

    // Shrink on scroll

    let lastScroll = 0;

    let ticking = false;

    window.addEventListener('scroll', () => {

      if (!ticking) {

        requestAnimationFrame(() => {

          const scrollY = window.scrollY;

          if (scrollY > 50) {

            navbar.classList.add('rc-navbar-future--scrolled');

          } else {

            navbar.classList.remove('rc-navbar-future--scrolled');

          }

          // Active state detection

          const sections = document.querySelectorAll('.rc-section');

          const navItems = navbar.querySelectorAll('.rc-navbar-future__item');

          let current = '';

          sections.forEach(section => {

            const rect = section.getBoundingClientRect();

            if (rect.top <= 100 && rect.bottom >= 100) {

              const id = section.id || section.className.split(' ').find(c => c.startsWith('rc-'));

              if (id) current = id;

            }

          });

          navItems.forEach(item => {

            item.classList.remove('rc-navbar-future__item--active');

            const href = item.getAttribute('href');

            if (href === '/' && current === '') {

              item.classList.add('rc-navbar-future__item--active');

            } else if (href && current.includes(href.replace('/', '').replace('#', ''))) {

              item.classList.add('rc-navbar-future__item--active');

            }

          });

          ticking = false;

        });

        ticking = true;

      }

    });

  }



  // ==========================================

  // RISK PULSE CARDS RENDERING

  // ==========================================



  const riskLanesData = [

    {

      id: 1,

      mode: 'Sea',

      route: 'VN → US (LA/LGB)',

      riskLevel: 'Moderate',

      riskScore: 46,

      trend: 'rising',

      trendLabel: 'Rising',

      color: 'warning',

      tags: ['Port Congestion', 'Weather', 'Schedule Reliability'],

      sparkline: [42, 44, 43, 45, 46, 48, 46]

    },

    {

      id: 2,

      mode: 'Air',

      route: 'VN → JP (Tokyo)',

      riskLevel: 'Low',

      riskScore: 18,

      trend: 'stable',

      trendLabel: 'Stable',

      color: 'success',

      tags: ['On-Time', 'Stable Demand', 'Clear Weather'],

      sparkline: [20, 19, 18, 19, 18, 17, 18]

    },

    {

      id: 3,

      mode: 'Rail',

      route: 'CN → EU (Hamburg)',

      riskLevel: 'High',

      riskScore: 79,

      trend: 'rising',

      trendLabel: 'Rising',

      color: 'danger',

      tags: ['Border Delay', 'Capacity Constraints', 'Political Tension'],

      sparkline: [72, 74, 76, 78, 79, 80, 79]

    }

  ];



  function renderRiskPulseCards() {

    const container = document.getElementById('riskPulseGrid');

    if (!container) return;



    container.innerHTML = '';



    riskLanesData.forEach(lane => {

      const card = createRiskPulseCard(lane);

      container.appendChild(card);

    });

  }



  function createRiskPulseCard(lane) {

    const card = document.createElement('div');

    card.className = 'rc-pulse-card';

    card.dataset.laneId = lane.id;

    // Set risk color for pulse

    if (lane.riskScore < 30) {

      card.setAttribute('data-risk-color', 'aqua');

    } else if (lane.riskScore < 60) {

      card.setAttribute('data-risk-color', 'amber');

    } else {

      card.setAttribute('data-risk-color', 'red');

    }

    const riskColorClass = lane.color;

    // Add prediction dot

    const predictionDot = document.createElement('div');

    predictionDot.className = 'rc-pulse-card__prediction-dot';

    // Add glow canvas

    const glowCanvas = document.createElement('canvas');

    glowCanvas.className = 'rc-pulse-card__glow-canvas';

    glowCanvas.width = 300;

    glowCanvas.height = 200;

    const glowCtx = glowCanvas.getContext('2d');

    const gradient = glowCtx.createRadialGradient(150, 100, 0, 150, 100, 150);

    gradient.addColorStop(0, 'rgba(0, 245, 212, 0.3)');

    gradient.addColorStop(1, 'transparent');

    glowCtx.fillStyle = gradient;

    glowCtx.fillRect(0, 0, 300, 200);



    card.innerHTML = `

      <div class="rc-pulse-card__header">

        <div>

          <h3 class="rc-pulse-card__route">${lane.route}</h3>

          <p class="rc-pulse-card__mode">${lane.mode}</p>

        </div>

        <div class="rc-pulse-card__live-indicator">

          <span class="rc-pulse-dot"></span>

        </div>

      </div>

      

      <div class="rc-pulse-card__risk">

        <span class="rc-pulse-card__risk-label">Risk Assessment</span>

        <div class="rc-pulse-card__risk-value">

          <span class="rc-pulse-card__risk-level" style="color: var(--rc-${riskColorClass})">

            ${lane.riskLevel}

          </span>

          <span class="rc-pulse-card__risk-score">(${lane.riskScore})</span>

          <span class="rc-pulse-card__trend rc-pulse-card__trend--${lane.trend}">

            ${getTrendIcon(lane.trend)} ${lane.trendLabel}

          </span>

        </div>

      </div>

      

      <div class="rc-pulse-card__tags">

        ${lane.tags.map(tag => `<span class="rc-tag rc-tag--${riskColorClass}">${tag}</span>`).join('')}

      </div>

      

      <div class="rc-pulse-card__sparkline">

        ${lane.sparkline.map(value => `

          <div class="rc-sparkline-bar" style="height: ${value}%"></div>

        `).join('')}

      </div>

    `;

    card.appendChild(predictionDot);

    card.appendChild(glowCanvas);

    return card;

  }



  function getTrendIcon(trend) {

    switch(trend) {

      case 'rising': return '↗';

      case 'falling': return '↘';

      case 'stable': return '→';

      default: return '→';

    }

  }



  // ==========================================

  // INITIALIZE ALL SYSTEMS

  // ==========================================



  // ==========================================

  // FUTUREOS HUD UPDATES (v28)

  // ==========================================

  function initHUD() {

    let fps = 60;

    let lastTime = performance.now();

    let frameCount = 0;

    function updateFPS() {

      frameCount++;

      const now = performance.now();

      if (now - lastTime >= 1000) {

        fps = frameCount;

        frameCount = 0;

        lastTime = now;

        const fpsEl = document.getElementById('rc-hud-fps');

        if (fpsEl) fpsEl.textContent = fps;

      }

      requestAnimationFrame(updateFPS);

    }

    updateFPS();

    // Simulate latency

    setInterval(() => {

      const latency = 8 + Math.floor(Math.random() * 10);

      const latEl = document.getElementById('rc-hud-latency');

      if (latEl) latEl.textContent = latency + 'ms';

    }, 2000);

    // Simulate temperature

    setInterval(() => {

      const temp = 38 + Math.floor(Math.random() * 8);

      const tempEl = document.getElementById('rc-hud-temp');

      if (tempEl) tempEl.textContent = temp + '°C';

    }, 3000);

  }

  // ==========================================

  // FUTUREOS SOUND HOOKS (v28)

  // ==========================================

  function initSoundHooks() {

    function rcSoundHover() {

      // Stub - no audio

    }

    function rcSoundSelect() {

      // Stub - no audio

    }

    function rcSoundActivate() {

      // Stub - no audio

    }

    // Attach to elements with data attributes

    document.querySelectorAll('[data-hover]').forEach(el => {

      el.addEventListener('mouseenter', rcSoundHover);

    });

    document.querySelectorAll('[data-select]').forEach(el => {

      el.addEventListener('click', rcSoundSelect);

    });

    document.querySelectorAll('[data-activate]').forEach(el => {

      el.addEventListener('click', rcSoundActivate);

    });

  }

  // ==========================================

  // PERFORMANCE OPTIMIZATION (v28)

  // ==========================================

  function optimizePerformance() {

    // Adaptive FPS throttling

    let lastFrameTime = 0;

    const targetFPS = 60;

    const frameInterval = 1000 / targetFPS;

    let lowPowerMode = false;

    // Detect low power device

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {

      lowPowerMode = true;

    }

    // Throttle animations if needed

    const originalRAF = window.requestAnimationFrame;

    window.requestAnimationFrame = function(callback) {

      const now = performance.now();

      const elapsed = now - lastFrameTime;

      if (elapsed >= frameInterval || !lowPowerMode) {

        lastFrameTime = now - (elapsed % frameInterval);

        return originalRAF(callback);

      } else {

        return originalRAF(function() { requestAnimationFrame(callback); });

      }

    };

  }

  function init() {

    console.log('🚀 RISKCAST Home v28 - FutureOS Interaction Engine initialized');



    optimizePerformance();

    initStars();

    initParticles();

    initGlobe();

    initParallax();

    initNavbar();

    initHUD();

    initSoundHooks();

    renderRiskPulseCards();

    // FIX: Delay section reveal to ensure DOM is ready

    setTimeout(() => {

      initSectionReveal();

    }, 100);



    console.log('✅ All FutureOS systems operational');

  }



  init();



});



// ==========================================

// PERFORMANCE: RESIZE HANDLER

// ==========================================



let resizeTimer;

window.addEventListener('resize', () => {

  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {

    console.log('Window resized - recalculating layout');

  }, 250);

});



// ==========================================

// LOG PAGE LOAD TIME

// ==========================================



window.addEventListener('load', () => {

  const loadTime = performance.now();

  console.log(`⚡ Page fully loaded in ${Math.round(loadTime)}ms`);

});

