/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { WaveScene } from './components/WaveScene';
import { Controls } from './components/Controls';
import { DEFAULT_PARAMS, WaveParams } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Cuboid as Cube, Settings2, Info } from 'lucide-react';

export default function App() {
  const [params, setParams] = useState<WaveParams>(DEFAULT_PARAMS);
  const [showInfo, setShowInfo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [alignAxis, setAlignAxis] = useState<{axis: 'x' | '-x' | 'y' | '-y' | 'z' | '-z', count: number} | null>(null);

  const handleParamChange = useCallback((updates: Partial<WaveParams>) => {
    setParams(prev => ({ ...prev, ...updates }));
  }, []);

  const handleAlign = useCallback((axis: 'x' | '-x' | 'y' | '-y' | 'z' | '-z') => {
    setAlignAxis({ axis, count: (alignAxis?.count || 0) + 1 });
  }, [alignAxis]);

  const handleExport = useCallback(() => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `polarization-wave-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  return (
    <div className="w-full h-screen bg-[#050505] text-zinc-300 font-sans flex flex-col overflow-hidden">
      {/* Header Navigation */}
      <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#0a0a0a] z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-orange-600/20">P</div>
            <span className="text-sm font-semibold tracking-wider text-white uppercase italic">
              PolariGen <span className="font-light opacity-50">3D</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-[10px] font-medium uppercase tracking-widest opacity-60">
            <span className="text-white opacity-100 cursor-pointer">Workspace</span>
            <span className="hover:text-white transition-colors cursor-pointer">Materials</span>
            <span className="hover:text-white transition-colors cursor-pointer">Lighting</span>
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => setShowInfo(true)}>Help</span>
          </nav>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-[10px] uppercase tracking-tighter transition-colors font-semibold text-zinc-300">
            Settings
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 rounded text-[10px] uppercase tracking-tighter transition-colors font-bold text-white shadow-lg shadow-orange-600/20"
          >
            Export 2D Plane
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Controls */}
        <aside className="w-72 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col z-10 overflow-y-auto">
          <Controls 
            params={params} 
            onChange={handleParamChange} 
            onExport={handleExport} 
            onAlign={handleAlign}
          />
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 relative cursor-crosshair transition-colors duration-500" style={{ backgroundColor: params.bgColor }}>
          {/* Grid Background Effect - only visible in dark mode or subtle in light */}
          {params.bgColor === '#050505' && (
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          )}
          
          <Canvas
            key={params.isOrthographic ? 'ortho' : 'persp'}
            ref={canvasRef}
            gl={{ 
              preserveDrawingBuffer: true,
              antialias: true 
            }}
            shadows
            orthographic={params.isOrthographic}
            camera={params.isOrthographic ? { position: [10, 10, 10], zoom: 50 } : { position: [10, 10, 10], fov: 45 }}
          >
            <WaveScene params={params} alignAxis={alignAxis} />
          </Canvas>

          {/* Viewport HUD Overlay */}
          <div className="absolute top-6 left-6 p-4 border-l border-t border-zinc-800 pointer-events-none flex flex-col gap-1 bg-black/20 backdrop-blur-sm">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">Cam: {params.isOrthographic ? 'Orthographic' : 'Perspective'}</span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">{params.isOrthographic ? 'Scale: 1:1' : 'FOV: 45°'}</span>
          </div>

          <div className="absolute bottom-6 right-6 p-4 flex gap-6 text-[10px] font-mono text-zinc-400 pointer-events-none bg-black/20 backdrop-blur-sm">
            <div>FREQ: <span className="text-white">{params.frequency.toFixed(2)}Hz</span></div>
            <div>PHASE: <span className="text-white">{params.phaseDiff.toFixed(1)}°</span></div>
            <div>PLANE: <span className="text-white">{params.rotation.toFixed(1)}°</span></div>
          </div>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-8 border-t border-zinc-800 bg-[#0a0a0a] flex items-center justify-between px-6 text-[9px] uppercase tracking-tighter text-zinc-500 z-20">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1.5 font-bold">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500">System Ready</span>
          </span>
          <span>Render Engine: v2.4-Astra</span>
        </div>
        <div className="flex gap-4 font-mono">
          <span>GPU Load: 12%</span>
          <span>Mem: 4.2GB / 32GB</span>
        </div>
      </footer>

      {/* Info Modal Integration */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-8 space-y-6 text-zinc-400"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white tracking-tight uppercase italic border-b border-zinc-800 pb-4">
                PolariGen <span className="text-orange-500">Documentation</span>
              </h2>
              <div className="space-y-4 text-[11px] leading-relaxed uppercase tracking-widest font-medium">
                <p>
                  <strong className="text-orange-500">Control:</strong> Left-click to Rotate. Scroll to Zoom. Right-click to Pan.
                </p>
                <p>
                  <strong className="text-blue-500">Sin Waves:</strong> Adjust X and Y phases to create circular or elliptical patterns. 90° phase shift creates circularity.
                </p>
                <p>
                  <strong className="text-zinc-300">Plane:</strong> OSC. PLANE rotates the entire propagation frame in 3D space.
                </p>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-colors border border-zinc-700"
              >
                Close Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
