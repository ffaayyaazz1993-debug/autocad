export interface Room {
  id: string;
  name: string;
  x: number; // SW corner X in feet from building SW
  y: number; // SW corner Y in feet from building SW
  width: number; // internal width in feet (E-W)
  height: number; // internal height in feet (N-S)
  labelDim: string; // dimension label to show
}

export interface Door {
  id: string;
  x: number; // center X of door opening
  y: number; // center Y of door opening
  width: number; // door width in feet
  direction: 'north' | 'south' | 'east' | 'west';
  swing: 'cw' | 'ccw'; // clockwise or counter-clockwise
  type: 'main' | 'bedroom' | 'kitchen' | 'toilet';
}

export interface Window {
  id: string;
  x: number; // center X
  y: number; // center Y
  width: number; // width in feet
  direction: 'north' | 'south' | 'east' | 'west';
  type: 'window' | 'ventilator';
}

export interface FurnitureItem {
  id: string;
  roomId: string;
  type: 'sofa' | 'dining-table' | 'bed' | 'counter' | 'wc' | 'basin' | 'shower';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export type LayerName = 
  | 'A-WALL-EXT' 
  | 'A-WALL-INT' 
  | 'A-DOOR' 
  | 'A-WINDOW' 
  | 'A-TEXT' 
  | 'A-DIMS' 
  | 'A-FURNITURE' 
  | 'A-NORTH';

export interface LayerState {
  name: LayerName;
  visible: boolean;
  color: string;
  description: string;
}
