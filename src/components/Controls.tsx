/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WaveParams } from '../types';

interface ControlsProps {
  params: WaveParams;
  onChange: (updates: Partial<WaveParams>) => void;
  onExport: () => void;
  onAlign?: (axis: 'x' | '-x' | 'y' | '-y' | 'z' | '-z') => void;
}

export const Controls: React.FC<ControlsProps> = ({ params, onChange, onExport, onAlign }) => {
  return (
    <div className="flex flex-col gap-8 p-6 overflow-y-auto h-full">
      {/* Geometry Section */}
      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-orange-500 font-bold mb-6">Wave Geometry</h3>
        <div className="space-y-6">
          <ControlItem label="Amplitude" value={params.amplitude} min={0} max={5} step={0.1} unit="m"
                       onChange={(v: number) => onChange({ amplitude: v })} />
          <ControlItem label="Beam Thickness" value={params.beamThickness} min={0.01} max={0.5} step={0.01} unit="x"
                       onChange={(v: number) => onChange({ beamThickness: v })} />
          <ControlItem label="Wave Thickness" value={params.waveThickness} min={1} max={10} step={1} unit="px"
                       onChange={(v: number) => onChange({ waveThickness: v })} />
        </div>
      </section>

      {/* Beam Aesthetic Section added */}
      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Scene & Beam</h3>
        <div className="grid grid-cols-2 gap-4 h-12 mb-4">
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-3 rounded flex-1">
            <input 
              type="color" 
              value={params.beamColor} 
              onChange={(e) => onChange({ beamColor: e.target.value })}
              className="w-6 h-6 rounded border border-zinc-700 bg-transparent cursor-pointer ring-offset-2 focus:ring-1 ring-orange-500 transition-all"
            />
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Beam</span>
          </div>
          <button 
            onClick={() => onChange({ bgColor: params.bgColor === '#050505' ? '#ffffff' : '#050505' })}
            className={`flex items-center justify-center gap-2 border px-3 rounded flex-1 transition-all text-[10px] font-bold uppercase tracking-widest ${
              params.bgColor === '#050505' 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' 
              : 'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm'
            }`}
          >
            {params.bgColor === '#050505' ? 'DARK BG' : 'LIGHT BG'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {([{ label: 'X', val: 'x' }, { label: 'Y', val: 'y' }, { label: 'Z', val: 'z' }] as const).map(({ label, val }) => (
            <div key={val} className="flex gap-2">
              <button 
                onClick={() => onAlign?.(val as any)}
                className="flex-1 h-8 bg-zinc-900 border border-zinc-800 rounded text-[9px] font-bold text-zinc-500 hover:text-white hover:border-zinc-600 transition-all uppercase tracking-tighter"
              >
                Align {label}+
              </button>
              <button 
                onClick={() => onAlign?.(`-${val}` as any)}
                className="flex-1 h-8 bg-zinc-900 border border-zinc-800 rounded text-[9px] font-bold text-zinc-500 hover:text-white hover:border-zinc-600 transition-all uppercase tracking-tighter"
              >
                Align {label}-
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Polarization Section */}
      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-orange-500 font-bold mb-6">Polarization (Sin)</h3>
        <div className="space-y-6">
          <ControlItem label="Frequency" value={params.frequency} min={0.5} max={10} step={0.1} unit="Hz"
                       onChange={(v: number) => onChange({ frequency: v })} />
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded">
              <span className="block text-[8px] opacity-40 uppercase tracking-tighter mb-1 font-mono">Phase Diff</span>
              <span className="text-xs font-mono text-white">{params.phaseDiff.toFixed(1)}°</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded">
              <span className="block text-[8px] opacity-40 uppercase tracking-tighter mb-1 font-mono">Osc. Plane</span>
              <span className="text-xs font-mono text-white">{params.rotation.toFixed(1)}°</span>
            </div>
          </div>

          <ControlItem label="Phase Shift" value={params.phaseDiff} min={0} max={360} step={0.1} unit="°"
                       onChange={(v: number) => onChange({ phaseDiff: v })} color="blue" />
          <ControlItem label="Osc. Plane" value={params.rotation} min={0} max={360} step={0.1} unit="°"
                       onChange={(v: number) => onChange({ rotation: v })} />
        </div>
      </section>

      {/* Visibility */}
      <section className="pt-4 border-t border-zinc-800/50">
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Camera System</h3>
        <div className="space-y-1">
          <Checkbox 
            label="Orthographic" 
            checked={params.isOrthographic} 
            onChange={(v: boolean) => onChange({ isOrthographic: v })} 
            dotColor="#ea580c" 
          />
        </div>
      </section>

      {/* Visibility */}
      <section className="pt-4 border-t border-zinc-800/50">
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Display Layers</h3>
        <div className="space-y-1">
          <Checkbox label="SHOW BEAM" checked={params.showBeam} onChange={(v: boolean) => onChange({ showBeam: v })} dotColor={params.beamColor} />
          <Checkbox label="X COMPONENT" checked={params.showX} onChange={(v: boolean) => onChange({ showX: v })} dotColor={params.colorX} />
          <Checkbox label="Y COMPONENT" checked={params.showY} onChange={(v: boolean) => onChange({ showY: v })} dotColor={params.colorY} />
          <Checkbox label="RESULTANT" checked={params.showResultant} onChange={(v: boolean) => onChange({ showResultant: v })} dotColor={params.colorResultant} />
        </div>
      </section>

      {/* Colors Section */}
      <section className="pt-4 border-t border-zinc-800/50">
        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Color Profile</h3>
        <div className="grid grid-cols-3 gap-2">
          <ColorPicker label="X" color={params.colorX} onChange={(v: string) => onChange({ colorX: v })} />
          <ColorPicker label="Y" color={params.colorY} onChange={(v: string) => onChange({ colorY: v })} />
          <ColorPicker label="RES" color={params.colorResultant} onChange={(v: string) => onChange({ colorResultant: v })} />
        </div>
      </section>

      {/* Presets */}
      <div className="mt-auto pt-6 border-t border-zinc-800 grid grid-cols-3 gap-2">
        <PresetButton 
          active={params.phaseDiff === 0} 
          onClick={() => onChange({ phaseDiff: 0 })}
          label="Linear"
          icon={<div className="w-4 h-0.5 bg-zinc-400 rotate-45" />}
        />
        <PresetButton 
          active={params.phaseDiff === 90} 
          onClick={() => onChange({ phaseDiff: 90 })}
          label="Circular"
          icon={<div className="w-3.5 h-3.5 border border-zinc-400 rounded-full" />}
        />
        <PresetButton 
          active={params.phaseDiff !== 0 && params.phaseDiff !== 90} 
          onClick={() => onChange({ phaseDiff: 45 })}
          label="Ellipt"
          icon={<div className="w-3.5 h-3.5 border border-zinc-400 rounded-full skew-x-12" />}
        />
      </div>

      <div className="mt-4 bg-orange-600/5 border border-orange-600/10 p-3 rounded text-[9px] text-orange-400/80 italic leading-snug">
        "Vector states are derived from phase shift and amplitude ratios."
      </div>
    </div>
  );
};

const ControlItem = ({ label, value, min, max, step, onChange, unit = "", color = "orange" }: any) => (
  <div className="space-y-3">
    <div className="flex justify-between text-[11px] font-mono tracking-tighter">
      <span className="uppercase opacity-50">{label}</span>
      <span className="text-zinc-400 font-bold">{value.toFixed(1)}{unit}</span>
    </div>
    <div className="relative h-1.5 bg-zinc-900 rounded-full group border border-white/5 shadow-inner">
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
      />
      {/* Track */}
      <div 
        className={`absolute h-full rounded-full ${color === 'orange' ? 'bg-orange-600' : 'bg-blue-600'}`}
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
      {/* Thumb Indicator */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border border-zinc-400 z-0 pointer-events-none transition-transform group-hover:scale-110"
        style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 6px)` }}
      />
    </div>
  </div>
);

const Checkbox = ({ label, checked, onChange, dotColor }: any) => (
  <button 
    onClick={() => onChange(!checked)}
    className="w-full flex items-center justify-between p-2 hover:bg-white/[0.03] rounded cursor-pointer transition-all group outline-none"
  >
    <span className={`text-[10px] tracking-widest font-mono ${checked ? 'text-white' : 'text-zinc-600'}`}>{label}</span>
    <div 
      className={`w-8 h-4 rounded-full border border-zinc-800 transition-all flex items-center px-1 ${checked ? 'bg-zinc-800' : 'bg-black'}`}
    >
      <div 
        className={`w-2 h-2 rounded-full transition-all ${checked ? 'translate-x-3.5' : 'translate-x-0'}`}
        style={{ backgroundColor: checked ? dotColor : '#333' }}
      />
    </div>
  </button>
);

const PresetButton = ({ active, onClick, label, icon }: any) => (
  <button 
    onClick={onClick}
    className={`aspect-square rounded border flex flex-col items-center justify-center gap-1.5 transition-all outline-none ${
      active 
      ? 'bg-orange-600/20 border-orange-600 text-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.2)]' 
      : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 hover:border-zinc-700 opacity-60 hover:opacity-100'
    }`}
  >
    {icon}
    <span className="text-[7px] uppercase tracking-tighter font-bold">{label}</span>
  </button>
);

const ColorPicker = ({ label, color, onChange }: any) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[8px] font-mono text-zinc-600 uppercase text-center">{label}</span>
    <div className="relative w-full h-8 rounded border border-zinc-800 overflow-hidden group">
      <input 
        type="color" 
        value={color} 
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
      />
      <div 
        className="w-full h-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);
