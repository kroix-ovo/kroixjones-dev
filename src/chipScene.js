import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const BLUE = 0x4f8ef7;
const AMBER = 0xe8a838;

export function initChipScene(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 3.8, 9.2);

  const rig = new THREE.Group();
  rig.rotation.x = -0.24;
  rig.rotation.y = -0.34;
  rig.rotation.z = -0.08;
  rig.scale.set(1.32, 1.32, 1.32);
  scene.add(rig);

  scene.add(new THREE.AmbientLight(0x7d92c2, 0.72));
  const key = new THREE.DirectionalLight(0x8fb4ff, 1.15);
  key.position.set(-4, 6, 6);
  scene.add(key);
  const warm = new THREE.PointLight(AMBER, 3.1, 14);
  warm.position.set(3, 1.8, 2.8);
  scene.add(warm);
  const cool = new THREE.PointLight(BLUE, 5.2, 15);
  cool.position.set(-3.2, 1.9, 3.2);
  scene.add(cool);

  buildChip(rig);

  const pulses = createPulses(rig);
  const clock = new THREE.Clock();

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    if (clientWidth === 0 || clientHeight === 0) return;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.position.z = clientWidth < 700 ? 10.2 : 7.55;
    camera.position.y = clientWidth < 700 ? 4.8 : 4.05;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  function render() {
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      rig.rotation.y = -0.34 + Math.sin(t * 0.18) * 0.12;
      rig.rotation.x = -0.24 + Math.sin(t * 0.12) * 0.03;
      rig.rotation.z = -0.08 + Math.sin(t * 0.1) * 0.018;
      pulses.forEach((pulse, index) => {
        const progress = (t * pulse.speed + index * 0.17) % 1;
        pulse.mesh.position.copy(samplePath(pulse.path, progress));
        pulse.mesh.material.opacity = 0.45 + Math.sin(progress * Math.PI) * 0.45;
      });
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  resize();
  window.addEventListener("resize", resize);
  render();
}

function buildChip(group) {
  const substrateMaterial = new THREE.MeshStandardMaterial({
    color: 0x08090d,
    roughness: 0.42,
    metalness: 0.72,
    emissive: 0x05070d,
    emissiveIntensity: 0.4,
  });
  const dieMaterial = new THREE.MeshStandardMaterial({
    color: 0x101521,
    roughness: 0.28,
    metalness: 0.86,
    emissive: 0x081426,
    emissiveIntensity: 0.65,
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(8.3, 0.22, 5), substrateMaterial);
  base.position.y = -0.12;
  group.add(base);

  const die = new THREE.Mesh(new THREE.BoxGeometry(7.25, 0.12, 4.1), dieMaterial);
  die.position.y = 0.08;
  group.add(die);

  const baseEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(base.geometry),
    new THREE.LineBasicMaterial({ color: 0x273049, transparent: true, opacity: 0.72 })
  );
  baseEdges.position.copy(base.position);
  group.add(baseEdges);

  const dieEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(die.geometry),
    new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.42 })
  );
  dieEdges.position.copy(die.position);
  group.add(dieEdges);

  addMetalLattice(group);
  addOuterTraces(group);
  addBlocks(group);
  addTraceNetwork(group);
}

function addMetalLattice(group) {
  const material = new THREE.LineBasicMaterial({
    color: 0x426189,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
  });

  for (let z = -1.75; z <= 1.76; z += 0.35) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.3, 0.22, z),
      new THREE.Vector3(3.3, 0.22, z),
    ]);
    group.add(new THREE.Line(geometry, material));
  }
  for (let x = -3.1; x <= 3.11; x += 0.38) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0.225, -1.85),
      new THREE.Vector3(x, 0.225, 1.85),
    ]);
    group.add(new THREE.Line(geometry, material));
  }
}

function addOuterTraces(group) {
  const blueMaterial = new THREE.LineBasicMaterial({
    color: BLUE,
    transparent: true,
    opacity: 0.46,
    blending: THREE.AdditiveBlending,
  });
  const amberMaterial = new THREE.LineBasicMaterial({
    color: AMBER,
    transparent: true,
    opacity: 0.38,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < 13; i += 1) {
    const z = -2.1 + i * 0.35;
    const jog = i % 2 === 0 ? 0.22 : -0.18;
    const left = vecPath([[-3.95, z], [-4.75, z], [-5.15, z + jog], [-6.3, z + jog]], 0.17);
    const right = vecPath([[3.95, z], [4.7, z], [5.1, z - jog], [6.35, z - jog]], 0.17);
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(left), i % 3 === 0 ? amberMaterial : blueMaterial));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(right), i % 4 === 0 ? amberMaterial : blueMaterial));
  }

  for (let i = 0; i < 10; i += 1) {
    const x = -3.2 + i * 0.72;
    const bottom = vecPath([[x, -2.1], [x, -2.72], [x + 0.24, -3.05]], 0.16);
    const top = vecPath([[x, 2.1], [x, 2.72], [x - 0.24, 3.05]], 0.16);
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(bottom), i % 2 === 0 ? blueMaterial : amberMaterial));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(top), i % 2 === 0 ? amberMaterial : blueMaterial));
  }
}

function addBlocks(group) {
  const blocks = [
    { label: "ALU", x: -1.9, z: -0.85, w: 1.45, d: 0.9, color: BLUE },
    { label: "MEM", x: 1.65, z: -0.92, w: 1.65, d: 0.95, color: BLUE },
    { label: "CLK", x: -0.15, z: 0.9, w: 1.15, d: 0.82, color: AMBER },
    { label: "IO", x: 2.65, z: 0.95, w: 0.9, d: 0.8, color: AMBER },
  ];

  blocks.forEach((block) => {
    const material = new THREE.MeshStandardMaterial({
      color: 0x111722,
      roughness: 0.35,
      metalness: 0.75,
      emissive: block.color,
      emissiveIntensity: 0.14,
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(block.w, 0.075, block.d), material);
    mesh.position.set(block.x, 0.24, block.z);
    group.add(mesh);

    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry),
      new THREE.LineBasicMaterial({ color: block.color, transparent: true, opacity: 0.86 })
    );
    edge.position.copy(mesh.position);
    group.add(edge);

    const label = makeLabel(block.label, block.color === BLUE ? "#4F8EF7" : "#E8A838");
    label.position.set(block.x, 0.56, block.z);
    label.scale.set(0.68, 0.22, 1);
    group.add(label);
  });
}

function addTraceNetwork(group) {
  const paths = getTracePaths();
  paths.forEach((path, index) => {
    const material = new THREE.LineBasicMaterial({
      color: index % 3 === 0 ? AMBER : BLUE,
      transparent: true,
      opacity: index % 3 === 0 ? 0.76 : 0.9,
      blending: THREE.AdditiveBlending,
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(path);
    group.add(new THREE.Line(geometry, material));
  });
}

function createPulses(group) {
  return getTracePaths().slice(0, 9).map((path, index) => {
    const material = new THREE.MeshBasicMaterial({
      color: index % 3 === 0 ? AMBER : BLUE,
      transparent: true,
      opacity: 0.86,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(index % 3 === 0 ? 0.055 : 0.045, 16, 16), material);
    group.add(mesh);
    return { mesh, path, speed: index % 3 === 0 ? 0.115 : 0.15 };
  });
}

function getTracePaths() {
  const y = 0.34;
  return [
    vecPath([[-3.05, -1.45], [-1.9, -1.45], [-1.9, -0.85], [-0.8, -0.85], [-0.8, 0.9], [-0.15, 0.9]], y),
    vecPath([[-1.2, -1.72], [-1.2, -0.85], [-1.9, -0.85]], y),
    vecPath([[-1.2, 0.9], [-1.2, 1.65], [2.65, 1.65], [2.65, 0.95]], y),
    vecPath([[0.45, 0.9], [0.95, 0.9], [0.95, -0.92], [1.65, -0.92]], y),
    vecPath([[-1.9, -0.38], [-0.2, -0.38], [-0.2, -1.65], [2.85, -1.65]], y),
    vecPath([[1.65, -0.45], [2.65, -0.45], [2.65, 0.55], [3.35, 0.55]], y),
    vecPath([[-3.35, 1.25], [-0.15, 1.25], [-0.15, 0.9]], y),
    vecPath([[-2.65, 0.25], [-1.9, 0.25], [-1.9, -0.85]], y),
    vecPath([[1.65, -0.92], [1.65, -1.55], [3.2, -1.55]], y),
    vecPath([[3.35, 1.45], [2.65, 1.45], [2.65, 0.95]], y),
    vecPath([[-0.15, 0.5], [-0.15, -0.1], [1.65, -0.1], [1.65, -0.92]], y),
  ];
}

function vecPath(points, y) {
  return points.map(([x, z]) => new THREE.Vector3(x, y, z));
}

function samplePath(path, progress) {
  const lengths = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i += 1) {
    const len = path[i].distanceTo(path[i + 1]);
    lengths.push(len);
    total += len;
  }
  let target = progress * total;
  for (let i = 0; i < lengths.length; i += 1) {
    if (target <= lengths[i]) {
      return path[i].clone().lerp(path[i + 1], target / lengths[i]);
    }
    target -= lengths[i];
  }
  return path[path.length - 1].clone();
}

function makeLabel(text, color) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "600 38px JetBrains Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fillStyle = color;
  ctx.fillText(text, 128, 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Sprite(material);
}
