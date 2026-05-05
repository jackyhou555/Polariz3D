/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Line } from '@react-three/drei';
import * as THREE from 'three';
import { WaveParams } from '../types';

interface WaveSceneProps {
  params: WaveParams;
  alignAxis?: { axis: 'x' | '-x' | 'y' | '-y' | 'z' | '-z', count: number } | null;
}

const WaveLine = ({ points, color, opacity = 1, thickness = 2 }: { points: THREE.Vector3[], color: string, opacity?: number, thickness?: number }) => {
  return (
    <Line
      points={points}
      color={color}
      lineWidth={thickness}
      transparent
      opacity={opacity}
    />
  );
};

const ConnectingLines = ({ basePoints, wavePoints, color, thickness = 1, opacity = 0.3 }: { basePoints: THREE.Vector3[], wavePoints: THREE.Vector3[], color: string, thickness?: number, opacity?: number }) => {
  return (
    <group>
      {basePoints.map((bp, i) => (
        <Line 
          key={i}
          points={[bp, wavePoints[i]]}
          color={color}
          lineWidth={thickness * 0.5}
          transparent
          opacity={opacity}
        />
      ))}
    </group>
  );
};

export const WaveScene: React.FC<WaveSceneProps> = ({ params, alignAxis }) => {
  const controlsRef = useRef<any>(null);

  const {
    amplitude,
    frequency,
    phase,
    phaseDiff,
    rotation,
    segments,
    arrowDensity,
    length,
    showX,
    showY,
    showResultant,
    beamThickness,
    waveThickness,
    showBeam,
    beamColor,
    bgColor,
    colorX,
    colorY,
    colorResultant
  } = params;

  const arrowColor = showBeam ? beamColor : (showResultant ? colorResultant : (showX ? colorX : (showY ? colorY : beamColor)));

  // Align camera logic
  useEffect(() => {
    if (!alignAxis || !controlsRef.current) return;
    const { axis } = alignAxis;
    const controls = controlsRef.current;
    const camera = controls.object;

    const distance = 18;
    if (axis === 'x') camera.position.set(distance, 0, 0);
    else if (axis === '-x') camera.position.set(-distance, 0, 0);
    else if (axis === 'y') camera.position.set(0, distance, 0);
    else if (axis === '-y') camera.position.set(0, -distance, 0);
    else if (axis === 'z') camera.position.set(0, 0, distance);
    else if (axis === '-z') camera.position.set(0, 0, -distance);

    controls.target.set(0, 0, 0);
    controls.update();
  }, [alignAxis]);

  // Generate wave data
  const data = useMemo(() => {
    // ... same as before
    const points: { x: THREE.Vector3[], y: THREE.Vector3[], res: THREE.Vector3[], base: THREE.Vector3[] } = {
      x: [], y: [], res: [], base: []
    };
    
    const arrowPoints: { x: THREE.Vector3[], y: THREE.Vector3[], res: THREE.Vector3[], base: THREE.Vector3[] } = {
      x: [], y: [], res: [], base: []
    };

    const radPhaseDiff = (phaseDiff * Math.PI) / 180;
    const radRotation = (rotation * Math.PI) / 180;

    for (let i = 0; i <= segments; i++) {
      const z = (i / segments) * length - length / 2;
      const t = (z / length) * frequency * Math.PI * 2 + phase;
      
      const eX_orig = Math.sin(t) * amplitude;
      const eY_orig = Math.sin(t + radPhaseDiff) * amplitude;

      const ex = eX_orig * Math.cos(radRotation) - eY_orig * Math.sin(radRotation);
      const ey = eX_orig * Math.sin(radRotation) + eY_orig * Math.cos(radRotation);

      const base = new THREE.Vector3(0, 0, z);
      points.base.push(base);
      points.x.push(new THREE.Vector3(ex, 0, z));
      points.y.push(new THREE.Vector3(0, ey, z));
      points.res.push(new THREE.Vector3(ex, ey, z));

      const isArrowPoint = i === 0 || i === segments || i % Math.floor(segments / arrowDensity) === 0;
      if (isArrowPoint) {
        arrowPoints.base.push(base);
        arrowPoints.x.push(new THREE.Vector3(ex, 0, z));
        arrowPoints.y.push(new THREE.Vector3(0, ey, z));
        arrowPoints.res.push(new THREE.Vector3(ex, ey, z));
      }
    }

    return { points, arrowPoints };
  }, [amplitude, frequency, phase, phaseDiff, rotation, segments, arrowDensity, length]);

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.05} rotateSpeed={0.5} />
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      <Center>
        <group>
          {/* Main propagation axis / Light Beam - Uniform Thickness */}
          {showBeam && (
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <cylinderGeometry args={[beamThickness, beamThickness, length, 16]} />
              <meshStandardMaterial color={beamColor} />
            </mesh>
          )}

          {/* Direction Arrow at the end - Scaled with beam thickness */}
          <group position={[0, 0, length/2]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, beamThickness * 3]}>
              <coneGeometry args={[beamThickness * 3, beamThickness * 6, 16]} />
              <meshStandardMaterial color={arrowColor} />
            </mesh>
          </group>

          {/* X Component */}
          {showX && (
            <group>
              <WaveLine points={data.points.x} color={colorX} opacity={0.6} thickness={waveThickness} />
            </group>
          )}

          {/* Y Component */}
          {showY && (
            <group>
              <WaveLine points={data.points.y} color={colorY} opacity={0.6} thickness={waveThickness} />
            </group>
          )}

          {/* Resultant Wave */}
          {showResultant && (
            <group>
              <WaveLine points={data.points.res} color={colorResultant} thickness={waveThickness} />
            </group>
          )}
        </group>
      </Center>
    </>
  );
};
