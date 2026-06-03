import * as THREE from 'three';

/**
 * Преломляющая стеклянная линза для Hero.
 * Метафора: «превращаю сложное в чистое и прозрачное».
 * Чистый three.js (без R3F), lazy, с уважением к reduced-motion и слабым устройствам.
 */
export function initHeroLens(canvas: HTMLCanvasElement) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isLowEnd = (navigator.hardwareConcurrency || 4) < 4;
  const isTouch = window.matchMedia('(hover: none)').matches;

  // На слабых/мобильных/reduced-motion — 3D не запускаем (есть CSS-fallback)
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

  // Окружение для преломления (cubemap из aurora-цветов)
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const gradTex = makeAuroraGradient();
  envScene.background = gradTex;
  const envMap = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;

  // Стеклянное тело — тороидальный узел (оптическое стекло)
  const geometry = new THREE.TorusKnotGeometry(1.1, 0.38, 220, 36);
  const material = new THREE.MeshPhysicalMaterial({
    transmission: 1.0,
    thickness: 1.4,
    roughness: 0.04,
    ior: 1.5,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMap,
    envMapIntensity: 1.4,
    iridescence: 0.4,
    iridescenceIOR: 1.3,
    attenuationColor: new THREE.Color('#5FC6FF'),
    attenuationDistance: 2.5,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Ключевой свет — aurora cyan/violet
  const key = new THREE.PointLight('#5FC6FF', 40, 20);
  key.position.set(3, 2, 4);
  scene.add(key);
  const fill = new THREE.PointLight('#A280FF', 25, 20);
  fill.position.set(-3, -1, 2);
  scene.add(fill);
  scene.add(new THREE.AmbientLight('#1a1f3a', 1.2));

  // Resize под контейнер
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
    targetX = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  };
  window.addEventListener('mousemove', onMouse, { passive: true });

  // Пауза, когда секция вне экрана
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
    // Медленный idle-дрейф
    mesh.rotation.x = t * 0.12;
    mesh.rotation.y = t * 0.16;
    // Параллакс к курсору (сглаженно)
    curX += (targetX - curX) * 0.05;
    curY += (targetY - curY) * 0.05;
    mesh.position.x = curX * 0.6;
    mesh.position.y = -curY * 0.6;
    camera.position.x = curX;
    camera.position.y = -curY;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();

  // Cleanup
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMouse);
    ro.disconnect();
    io.disconnect();
    geometry.dispose();
    material.dispose();
    envMap.dispose();
    gradTex.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}

/** Aurora-градиент как текстура окружения (для преломления/отражений) */
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
