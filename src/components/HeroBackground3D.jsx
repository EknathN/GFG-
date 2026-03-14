import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles({ count = 2000 }) {
  const pointsRef = useRef();
  
  // Create a spherical distribution of points
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Randomly distribute points in a large cube
        pos[i * 3] = (Math.random() - 0.5) * 10;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
        // Subtle rotation
        pointsRef.current.rotation.x += delta * 0.05;
        pointsRef.current.rotation.y += delta * 0.075;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#2F8D46"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group> group>
  );
}

function GlowingBlob() {
    const meshRef = useRef();
    
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(t * 0.5) * 0.2;
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} position={[2, 0, -2]}>
            <sphereGeometry args={[1.5, 64, 64]} />
            <meshStandardMaterial 
                color="#2F8D46" 
                emissive="#1a4d2e" 
                emissiveIntensity={2} 
                transparent 
                opacity={0.15} 
                wireframe
            />
        </mesh>
    );
}

export default function HeroBackground3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingParticles />
        <GlowingBlob />
      </Canvas>
    </div>
  );
}
