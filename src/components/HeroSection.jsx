import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export const HeroSection = () => {
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    /* ======================
       Scene
    ====================== */
    const scene = new THREE.Scene();

    const width = canvasRef.current.clientWidth || 400;
    const height = canvasRef.current.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 1;

    /* ======================
       Renderer
    ====================== */
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* ======================
       Lights
    ====================== */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const accent = new THREE.DirectionalLight(0x8b5cf6, 0.4);
    accent.position.set(-5, -5, -5);
    scene.add(accent);

    /* ======================
       Controls
    ====================== */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;

    const onInteract = () => setUserInteracted(true);
    renderer.domElement.addEventListener("pointerdown", onInteract);
    renderer.domElement.addEventListener("wheel", onInteract);

    /* ======================
       Load Model
    ====================== */
    const loader = new GLTFLoader();
    loader.load(
      "/models/3d.glb",
      (gltf) => {
        const model = gltf.scene;

        model.scale.set(1.2, 1.2, 1.2);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        scene.add(model);
        modelRef.current = model;
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error("GLTF error:", error);
        setIsLoading(false);
      }
    );

    /* ======================
       Animate
    ====================== */
    const animate = () => {
      requestAnimationFrame(animate);

      if (modelRef.current && !userInteracted) {
        modelRef.current.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    /* ======================
       Resize
    ====================== */
    const onResize = () => {
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      if (!w || !h) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    /* ======================
       Cleanup
    ====================== */
    return () => {
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onInteract);
      renderer.domElement.removeEventListener("wheel", onInteract);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section id="hero" className="w-full h-screen">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </section>
  );
};
