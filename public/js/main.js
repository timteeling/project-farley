(function(){
  'use strict';

  const canvas = document.querySelector('#js-particle-canvas');
  const ctx = canvas.getContext('2d');
  const play = document.querySelector('.btn-play-pause');
  const playIcons = play.querySelectorAll('svg');
  const container = document.querySelector('.container');
  const navBtns = document.querySelectorAll('nav .btn');

  let raf;
  let rainDrops = [];
  let snowFlakes = [];
  let particles = 200;
  let angle = 0;
  let isPlaying = true;
  let mode = 'snow'; // default mode
  let W = window.innerWidth;
  let H = window.innerHeight;

  canvas.width = W;
  canvas.height = H;

  /**
   * makeSnow
   * 
   * Makes our snowflakes
   */

  function makeSnow() {
    for (let i = 0; i < particles; i++) {
      snowFlakes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        radius: Math.random() * 0.75 + 1,
        density: Math.random() * particles
      });
    }
    
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.375)';
    ctx.beginPath();
    for (let i = 0; i < particles; i++) {
      let p = snowFlakes[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);
    }
    ctx.fill();
  }

  /**
   * letItSnow
   *
   * Animate our snowflakes
   */
   
  function letItSnow() {
    angle += 0.01;
    for (let i = 0; i < particles; i++) {
      let p = snowFlakes[i];
      
      // Snow fall with a breeze
      p.y += Math.cos(angle + p.density) + 1 + p.radius / 2;
      p.x += Math.sin(angle) * 2;

      // Sending snowflakes back from the top when it exits
      if (p.x > W + 5 || p.x < -5 || p.y > H) {
        if (i % 3 > 0) {
          snowFlakes[i] = { x: Math.random() * W, y: -10, radius: p.radius, density: p.density };
        } else {
          // If the snowflake is exiting to the right
          if (Math.sin(angle) > 0) {
            // Enter from the left
            snowFlakes[i] = { x: -5, y: Math.random() * H, radius: p.radius, density: p.density };
          } else {
            // Enter from the right
            snowFlakes[i] = { x: W + 5, y: Math.random() * H, radius: p.radius, density: p.density };
          }
        }
      }
    }
  }

  /**
   * makeRain
   *
   * Makes our rain drops
   */

  function makeRain() {
    for (let i = 0; i < particles; i++) {
      rainDrops.push({
        x: Math.random() * W,
        y: Math.random() * H,
        width: 3,
        height: Math.random() * 10,
        speed: Math.random() * 5 + 10
      });
    }
    
    ctx.clearRect(0,0,W,H);
    for (let i = 0; i < particles; i++) {
      let p = rainDrops[i];
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(p.x, p.y, p.width, p.height);
    }
  }

  /**
   * makeItRain
   *
   * Animate our rain drops
   */

  function makeItRain() {
    for (let i = 0; i < particles; i++) { 
      rainDrops[i].y += rainDrops[i].speed;
      
      if (rainDrops[i].y > H){
        rainDrops[i].y =- rainDrops[i].height;
      }
    }
  }

  /**
   * draw
   *
   * Logic to decide which scene is painted to the canvas
   */

  function draw() {
    if (mode === 'snow') {
      makeSnow();
      letItSnow();
    }
    
    if (mode === 'rain') {
      makeRain();
      makeItRain();
    }
    
    raf = requestAnimationFrame(draw);
  }

  /**
   * togglePlayIcon
   *
   * Swap between visual play & pause states
   */

  function togglePlayIcon() {
    playIcons.forEach((icon) => {
      icon.classList.toggle('hidden');
    });
  }

  /**
   * togglePlay
   *
   * Play and pause the canvas animation
   */

  function togglePlay() {
    if (isPlaying) {
      raf = window.requestAnimationFrame(draw);
      togglePlayIcon();
    } else {
      window.cancelAnimationFrame(raf);
      togglePlayIcon();
    }
  }
  
  function onResize() {
    ctx.clearRect(0, 0, W, H);
    ctx.canvas.width = W;
    ctx.canvas.height = H;
  }
  
  // Resize canvas when screen size changes
  window.addEventListener('resize', onResize);

  // Handle clicks on play/pause button
  play.addEventListener('click', (e) => {
    isPlaying = !isPlaying;
    togglePlay();
  });

  // Hack for IE11 & Edge not having forEach on node lists (needed for navBtns block below)
  if(!NodeList.prototype.forEach) {
  	NodeList.prototype.forEach = Array.prototype.forEach;
  }

  // Handle clicks on nav buttons
  navBtns.forEach((navBtn) => {
    navBtn.addEventListener('click', (e) => {
      navBtns.forEach((clearActiveBtnClass) => {
        // Reset other scene mode buttons
        clearActiveBtnClass.classList.remove('btn-active');
        container.classList.remove(`mode-${clearActiveBtnClass.dataset.mode}`);
      });
      
      // Now add active state and set to selected scene mode 
      navBtn.classList.add('btn-active');
      mode = navBtn.dataset.mode;
      container.classList.add(`mode-${mode}`);
      ctx.clearRect(0, 0, W, H);
    });
  });

  /**
   * Init
   *
   * Start the animation by default and set our first scene
   */
   
  togglePlay();
  container.classList.add(`mode-${mode}`);

  /**
   * Pay no attention to the man behind the curtain... nothing to see below
   */

  const keysPressed = [];
  const konamiCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
  const farley = document.querySelector('.farley');

  window.addEventListener('keyup', (e) => {
    keysPressed.push(e.key);
    keysPressed.splice(-konamiCode.length - 1, keysPressed.length - konamiCode.length);
    if (keysPressed.join('').includes(konamiCode)) {
      farley.classList.remove('hidden');
    }
  });
})();