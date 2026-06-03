import * as THREE from 'three';

/**
 * Стеклянная сфера-линза над кодом для Hero.
 * Метафора: «превращаю сложный код в чистое и прозрачное».
 * За сферой — плоскость с текстурой кода, которую сфера преломляет.
 * Чистый three.js, lazy, reduced-motion + слабые устройства → CSS-fallback.
 */
export function initHeroLens(canvas: HTMLCanvasElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEnd = (navigator.hardwareConcurrency || 4) < 4;
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (reduceMotion || isLowEnd || isTouch) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Окружение для преломления (aurora-цвета)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const gradTex = makeAuroraGradient();
  envScene.background = gradTex;
  const envMap = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;

  // === Плоскость с КОДОМ за сферой (её преломляет линза) ===
  const codeTex = makeCodeTexture();
  const codePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7),
    new THREE.MeshBasicMaterial({ map: codeTex, transparent: true, opacity: 0.5 })
  );
  codePlane.position.z = -2.2;
  scene.add(codePlane);

  // === Стеклянная сфера-линза ===
  const geometry = new THREE.SphereGeometry(1.35, 64, 64);
  const material = new THREE.MeshPhysicalMaterial({
    transmission: 1.0,
    thickness: 2.2,
    roughness: 0.02,
    ior: 1.45,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMap,
    envMapIntensity: 1.2,
    iridescence: 0.5,
    iridescenceIOR: 1.3,
    attenuationColor: new THREE.Color('#5FC6FF'),
    attenuationDistance: 3.5,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Свет — aurora
  const key = new THREE.PointLight('#5FC6FF', 35, 20);
  key.position.set(3, 2, 4);
  scene.add(key);
  const fill = new THREE.PointLight('#A280FF', 22, 20);
  fill.position.set(-3, -1, 3);
  scene.add(fill);
  scene.add(new THREE.AmbientLight('#1a1f3a', 1.4));

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);

  // Курсор-параллакс
  let targetX = 0, targetY = 0, curX = 0, curY = 0;
  const onMouse = (e: MouseEvent) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
  };
  window.addEventListener('mousemove', onMouse, { passive: true });

  // Скролл-прогресс (сфера уплывает вверх и тает при скролле)
  let scrollProgress = 0;
  const onScroll = () => {
    scrollProgress = Math.min(1, window.scrollY / (window.innerHeight * 0.9));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Пауза вне экрана
  let visible = true;
  const io = new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0.01 }
  );
  if (canvas.parentElement) io.observe(canvas.parentElement);

  let raf = 0;
  const clock = new THREE.Clock();
  function animate() {
    raf = requestAnimationFrame(animate);
    if (!visible) return;
    const t = clock.getElapsedTime();

    // Сфера медленно вращается (видно искажение кода)
    sphere.rotation.y = t * 0.1;

    // Параллакс к курсору (сглаженно)
    curX += (targetX - curX) * 0.05;
    curY += (targetY - curY) * 0.05;
    sphere.position.x = curX * 0.5;
    sphere.position.y = -curY * 0.5;
    codePlane.position.x = curX * 0.2;
    codePlane.position.y = -curY * 0.2;

    // Скролл: сфера уплывает вверх + уменьшается
    const s = 1 - scrollProgress * 0.4;
    sphere.scale.setScalar(s);
    sphere.position.y += scrollProgress * 2;
    codePlane.material.opacity = 0.5 * (1 - scrollProgress);

    camera.position.x = curX * 0.6;
    camera.position.y = -curY * 0.6;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMouse);
    window.removeEventListener('scroll', onScroll);
    ro.disconnect();
    io.disconnect();
    geometry.dispose();
    material.dispose();
    codePlane.geometry.dispose();
    (codePlane.material as THREE.Material).dispose();
    codeTex.dispose();
    envMap.dispose();
    gradTex.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}

/** Aurora-градиент как текстура окружения */
function makeAuroraGradient(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 512, 512);
  g.addColorStop(0, '#06070D');
  g.addColorStop(0.4, '#1a2456');
  g.addColorStop(0.6, '#5FC6FF');
  g.addColorStop(0.8, '#A280FF');
  g.addColorStop(1, '#FF6EC7');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

/** Текстура с фрагментом кода (рисуется на canvas) — её преломляет сфера */
function makeCodeTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = 'rgba(6,7,13,0)';
  ctx.fillRect(0, 0, 512, 512);
  ctx.font = '15px "JetBrains Mono", monospace';
  const lines = [
    'export async function build(site) {',
    "  const offer = await analyze(site.niche);",
    '  const page = render(offer, {',
    "    leads: 'telegram',",
    "    payments: 'tinkoff',",
    "    cms: 'sheets',",
    '  });',
    '  await deploy(page);',
    '  return { lighthouse: 98, ttfb: 120 };',
    '}',
    '',
    'const bot = new Automation()',
    "  .on('lead', notify)",
    "  .integrate('crm')",
    '  .start();',
  ];
  lines.forEach((line, i) => {
    // cyan для ключевых слов, приглушённый для остального
    ctx.fillStyle = /export|async|function|const|await|return|new/.test(line)
      ? 'rgba(95,198,255,0.85)'
      : 'rgba(138,144,166,0.7)';
    ctx.fillText(line, 30, 60 + i * 28);
  });
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}
