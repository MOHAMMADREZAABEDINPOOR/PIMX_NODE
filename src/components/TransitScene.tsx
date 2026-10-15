import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type Props = {
  active?: boolean;
  peers?: number;
  low?: boolean;
  dark?: boolean;
  hero?: boolean;
  label: string;
  devices?: { id: string; name: string; selected: boolean }[];
  onSelect?: (id: string) => void;
};

/** An authored file handoff: open laptop, phone and pages travelling between them. */
export default function TransitScene({ label, low = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !low,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      setFallback(true);
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor(0, 0);
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60);
    camera.position.set(0, 2.4, 10.8);
    camera.lookAt(0, 0.2, 0);
    const world = new THREE.Group();
    scene.add(world);
    const geometry: THREE.BufferGeometry[] = [];
    const textures: THREE.Texture[] = [];
    const material = (color: number, metalness = 0.12, roughness = 0.4) =>
      new THREE.MeshPhysicalMaterial({
        color,
        metalness,
        roughness,
        clearcoat: 0.4,
      });
    const ink = material(0x61275b, 0.3),
      berry = material(0xa60533),
      pink = material(0xfa166e),
      red = material(0xcd0a42),
      purple = material(0x7c3aa4),
      violet = material(0x8b50d0),
      flamingo = material(0xf55df7),
      shell = material(0xdcc5e7, 0.35),
      paper = material(0xfff1fa),
      screen = material(0xf4e5f7);
    const materials: THREE.Material[] = [
      ink,
      berry,
      pink,
      red,
      purple,
      violet,
      flamingo,
      shell,
      paper,
      screen,
    ];
    scene.add(new THREE.HemisphereLight(0xfff6fc, 0x61275b, 2.2));
    const keyLight = new THREE.DirectionalLight(0xfff7fc, 3.2);
    keyLight.position.set(-3, 6, 5);
    scene.add(keyLight);
    const edgeLight = new THREE.DirectionalLight(0xeac5ff, 2);
    edgeLight.position.set(4, 2, -3);
    scene.add(edgeLight);
    const box = (
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      radius = 0.04,
    ) => {
      const geo = new RoundedBoxGeometry(
        w,
        h,
        d,
        low ? 1 : 3,
        Math.min(radius, d * 0.45),
      );
      geometry.push(geo);
      return new THREE.Mesh(geo, mat);
    };
    const addBox = (
      parent: THREE.Group,
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      x = 0,
      y = 0,
      z = 0,
    ) => {
      const mesh = box(w, h, d, mat);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    };
    const dot = (
      parent: THREE.Group,
      x: number,
      y: number,
      z: number,
      size: number,
      mat: THREE.Material,
    ) => {
      const geo = new THREE.SphereGeometry(size, low ? 8 : 16, 8);
      geometry.push(geo);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.z = 0.3;
      mesh.position.set(x, y, z);
      parent.add(mesh);
    };
    const text = (
      parent: THREE.Group,
      value: string,
      x: number,
      y: number,
      z: number,
      width: number,
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 96;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.font = "600 48px sans-serif";
      ctx.fillStyle = "#61275b";
      ctx.textBaseline = "middle";
      ctx.fillText(value, 8, 48);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.push(texture);
      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      materials.push(mat);
      const geo = new THREE.PlaneGeometry(width, (width * 96) / 512);
      geometry.push(geo);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      parent.add(mesh);
    };
    const file = (color: THREE.Material, scale = 1) => {
      const group = new THREE.Group();
      const outline = new THREE.Shape();
      outline.moveTo(-0.31, -0.41);
      outline.lineTo(0.31, -0.41);
      outline.lineTo(0.31, 0.2);
      outline.lineTo(0.1, 0.41);
      outline.lineTo(-0.31, 0.41);
      outline.closePath();
      const geo = new THREE.ExtrudeGeometry(outline, {
        depth: 0.035,
        bevelEnabled: true,
        bevelSize: 0.009,
        bevelThickness: 0.009,
        bevelSegments: low ? 1 : 2,
        steps: 1,
      });
      geometry.push(geo);
      group.add(new THREE.Mesh(geo, color));
      const fold = new THREE.Shape();
      fold.moveTo(0.1, 0.41);
      fold.lineTo(0.1, 0.2);
      fold.lineTo(0.31, 0.2);
      fold.closePath();
      const foldGeo = new THREE.ShapeGeometry(fold);
      geometry.push(foldGeo);
      const corner = new THREE.Mesh(foldGeo, paper);
      corner.position.z = 0.047;
      group.add(corner);
      addBox(group, 0.35, 0.025, 0.014, paper, -0.025, -0.13, 0.052);
      addBox(group, 0.23, 0.025, 0.014, paper, -0.085, -0.23, 0.052);
      group.scale.setScalar(scale);
      return group;
    };
    const laptop = new THREE.Group();
    laptop.position.set(-1.55, -0.45, -0.1);
    laptop.rotation.set(0.02, 0.16, -0.035);
    addBox(laptop, 2.65, 1.83, 0.13, ink, 0, 0.36, 0);
    addBox(laptop, 2.47, 1.64, 0.025, screen, 0, 0.36, 0.082);
    addBox(laptop, 2.47, 0.16, 0.016, shell, 0, 1.08, 0.102);
    for (let i = 0; i < 3; i++)
      dot(
        laptop,
        -1.09 + i * 0.11,
        1.08,
        0.122,
        0.025,
        [berry, purple, violet][i],
      );
    text(laptop, "PIMXNODE", -0.41, 0.79, 0.114, 1.22);
    const tile = file(berry, 0.7);
    tile.position.set(-0.67, 0.14, 0.13);
    laptop.add(tile);
    const tile2 = file(purple, 0.7);
    tile2.position.set(0.03, 0.14, 0.13);
    laptop.add(tile2);
    const tile3 = file(violet, 0.7);
    tile3.position.set(0.73, 0.14, 0.13);
    laptop.add(tile3);
    addBox(laptop, 2.85, 0.1, 1.65, shell, 0, -0.62, 0.76);
    addBox(laptop, 2.3, 0.025, 0.67, ink, 0, -0.555, 0.45);
    // The keyboard has actual key geometry, instead of generic bars.
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 10; col++)
        addBox(
          laptop,
          0.17,
          0.017,
          0.12,
          purple,
          -0.96 + col * 0.213,
          -0.53,
          0.23 + row * 0.18,
        );
    addBox(laptop, 0.72, 0.018, 0.34, purple, 0, -0.555, 1.15);
    world.add(laptop);
    const phone = new THREE.Group();
    phone.position.set(2.12, -0.35, 0.6);
    phone.rotation.set(-0.06, -0.2, 0.065);
    addBox(phone, 1.12, 2.23, 0.18, ink);
    addBox(phone, 0.99, 2.08, 0.035, screen, 0, 0, 0.105);
    addBox(phone, 0.3, 0.065, 0.025, ink, 0, 0.88, 0.135);
    addBox(phone, 0.28, 0.028, 0.025, purple, 0, -0.91, 0.135);
    const received = file(pink, 1.05);
    received.position.set(0, 0.04, 0.15);
    phone.add(received);
    text(phone, "Received", -0.12, -0.61, 0.147, 0.76);
    world.add(phone);
    // A bowed route rises out of the laptop and lands at the phone.
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.45, 1.23, 0.18),
      new THREE.Vector3(-0.75, 3.1, 0.38),
      new THREE.Vector3(2.1, 2.75, 0.34),
      new THREE.Vector3(2.17, 0.65, 0.67),
    );
    const pathGeo = new THREE.TubeGeometry(
      curve,
      low ? 32 : 80,
      0.013,
      6,
      false,
    );
    geometry.push(pathGeo);
    world.add(new THREE.Mesh(pathGeo, violet));
    const pages: THREE.Group[] = [];
    for (let i = 0; i < (low ? 3 : 4); i++) {
      const page = file([berry, pink, red, flamingo][i], 0.78);
      pages.push(page);
      world.add(page);
    }
    const resize = () => {
      const { width, height } = element.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    let visible = true,
      dragging = false,
      lastX = 0,
      target = -0.08,
      rotation = -0.08,
      time = 0,
      previous = 0,
      frame = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(element);
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      element.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (dragging) {
        target = THREE.MathUtils.clamp(
          target + (e.clientX - lastX) * 0.005,
          -0.7,
          0.7,
        );
        lastX = e.clientX;
      }
    };
    const up = () => {
      dragging = false;
    };
    const keyboard = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        target = THREE.MathUtils.clamp(
          target + (e.key === "ArrowRight" ? 0.22 : -0.22),
          -0.7,
          0.7,
        );
      }
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    element.addEventListener("keydown", keyboard);
    const render = (now: number) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (!visible || document.hidden) return;
      if (!reduced.matches) time += delta;
      rotation += (target - rotation) * (1 - Math.exp(-delta * 7));
      world.rotation.y = rotation;
      pages.forEach((page, i) => {
        const progress = (time * 0.055 + i / pages.length + 0.13) % 1;
        page.position.copy(curve.getPointAt(progress));
        page.rotation.set(
          -0.1,
          0.15 + Math.sin(progress * Math.PI) * 0.15,
          -0.18 + progress * 0.35,
        );
        const envelope = Math.min(progress / 0.12, (1 - progress) / 0.12, 1);
        page.scale.setScalar(0.78 * Math.max(0.1, envelope));
      });
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
      element.removeEventListener("keydown", keyboard);
      geometry.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [low]);
  return (
    <div
      ref={host}
      className="transit-scene hero-scene device-bridge"
      role="img"
      aria-label={label}
      tabIndex={0}
    >
      {fallback && (
        <div className="scene-fallback">
          <img
            className="transit-poster"
            src="/illustrations/device-bridge.png"
            alt=""
          />
        </div>
      )}
    </div>
  );
}
