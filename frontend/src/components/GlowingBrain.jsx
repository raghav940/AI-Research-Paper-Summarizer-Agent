import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Procedural particle system for Neural Network effect
const NeuralParticles = ({ count = 500 }) => {
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const distance = Math.random() * 2 + 1.5;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      let x = distance * Math.sin(theta) * Math.cos(phi);
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <Points ref={points} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7" // Neon Purple
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};

// Core glowing sphere
const CoreNode = () => {
  const mesh = useRef();

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
      // Pulse scale
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      mesh.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Sphere ref={mesh} args={[1.2, 64, 64]}>
      <MeshDistortMaterial
        color="#3b82f6" // Secondary blue
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive="#60a5fa"
        emissiveIntensity={0.5}
        wireframe={true}
      />
    </Sphere>
  );
};

const GlowingBrain = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent blur-3xl rounded-full scale-150 animate-pulse-glow" />
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#a855f7" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#3b82f6" />
        
        <CoreNode />
        <NeuralParticles count={800} />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2 + 0.2}
          minPolarAngle={Math.PI / 2 - 0.2}
        />
      </Canvas>
    </div>
  );
};

export default GlowingBrain;
