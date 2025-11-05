import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ModelRender = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Kích thước cửa sổ Electron
    const WINDOW_WIDTH = 500;
    const WINDOW_HEIGHT = 500;

    //Scene
    const scene = new THREE.Scene();

    //Camera - Đặt ở dưới đáy, nhìn lên
    const camera = new THREE.PerspectiveCamera(
      50,
      WINDOW_WIDTH / WINDOW_HEIGHT,
      0.1,
      1000
    );
    // Camera ở dưới đáy (y âm), nhìn lên model
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    //Render - Tối ưu hóa
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance", // Dùng GPU mạnh hơn
    });
    renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Giới hạn pixel ratio
    currentMount.appendChild(renderer.domElement);

    //Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
      RIGHT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
    };
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 2;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // GLTF loader - Fix: Use absolute path from public folder
    const loader = new GLTFLoader();
    loader.load(
      "/src/assets/model_1/scene.gltf",
      (gltf) => {
        const model = gltf.scene;

        // Tính bounding box để scale model vừa với cửa sổ
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim; // Scale để model chiếm ~2 units

        model.scale.set(scale, scale, scale);

        // Căn giữa model
        const center = box.getCenter(new THREE.Vector3());
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        scene.add(model);
        console.log("Model loaded successfully!");
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.error("Lỗi load model:", error);
      }
    );

    // Animation loop - Chỉ render khi cần
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Chỉ render nếu controls có thay đổi
      if (controls.enabled) {
        controls.update();
        renderer.render(scene, camera);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const WINDOW_WIDTH = 500;
      const WINDOW_HEIGHT = 500;
      camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return <div ref={mountRef}></div>;
};

export default ModelRender;
