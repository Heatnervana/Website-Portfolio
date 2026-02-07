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
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Main directional light
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Rim lights for white glow effect
    const rimLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    rimLight1.position.set(-5, 0, -5);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    rimLight2.position.set(5, -3, -5);
    scene.add(rimLight2);

    // Back light for edge glow
    const backLight = new THREE.DirectionalLight(0xffffff, 1.8);
    backLight.position.set(0, 0, -10);
    scene.add(backLight);

    // Subtle accent light
    const accent = new THREE.DirectionalLight(0x8b5cf6, 0.3);
    accent.position.set(-5, -5, -5);
    scene.add(accent);

    /* ======================
       Controls
    ====================== */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;

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

        // Add point light to the model for glow effect
        const modelLight = new THREE.PointLight(0xffffff, 2, 10);
        modelLight.position.set(0, 1, 2);
        model.add(modelLight);

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
  }, [userInteracted]);

  return (
    <section id="hero" className="relative w-full min-h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6 z-10">
            <div className="space-y-2">
              <p className="text-foreground/60 text-lg">Hi, I'm</p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
                John Patrick Yadao
              </h1>
            </div>
            
            <div className="space-y-1">
              <p className="text-foreground/80 text-xl">Computer Engineering Graduate</p>
              <p className="text-foreground/70 text-lg">Focused on IT & Systems</p>
            </div>

            <div className="flex gap-4 pt-4">
              <a 
                href="#projects"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
              >
                View Projects
              </a>
              <a 
                href="#contact"
                className="px-8 py-3 bg-foreground/10 hover:bg-foreground/20 text-foreground font-medium rounded-lg transition-colors duration-300 border border-foreground/20"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* Right 3D Model */}
          <div className="relative h-[500px] lg:h-[600px]">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab active:cursor-grabbing"
            />
          </div>
        </div>
      </div>
    </section>
  );
};