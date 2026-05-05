/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PolarizationType {
  LINEAR = 'linear',
  CIRCULAR = 'circular',
  ELLIPTICAL = 'elliptical',
}

export interface WaveParams {
  amplitude: number;
  frequency: number;
  phase: number;
  phaseDiff: number; // Angle in degrees between X and Y
  rotation: number;  // Overall rotation angle of the polarization plane
  segments: number;
  arrowDensity: number;
  length: number;
  showX: boolean;
  showY: boolean;
  showResultant: boolean;
  arrowSize: number;
  beamThickness: number;
  waveThickness: number;
  isOrthographic: boolean;
  showBeam: boolean;
  beamColor: string;
  bgColor: string;
  colorX: string;
  colorY: string;
  colorResultant: string;
}

export const DEFAULT_PARAMS: WaveParams = {
  amplitude: 2,
  frequency: 1,
  phase: 0,
  phaseDiff: 0,
  rotation: 0,
  segments: 400,
  arrowDensity: 40,
  length: 10,
  showX: true,
  showY: false,
  showResultant: true,
  arrowSize: 0.2,
  beamThickness: 0.05,
  waveThickness: 2,
  isOrthographic: false,
  showBeam: true,
  beamColor: '#ffffff',
  bgColor: '#050505',
  colorX: '#3b82f6', // blue-500
  colorY: '#ef4444', // red-500
  colorResultant: '#10b981', // emerald-500
};
