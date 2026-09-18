import React from 'react';
import { LayerState } from './types';

interface FloorPlanProps {
  layers: LayerState[];
}

// Building constants (feet)
const BW = 30;   // width E-W
const BH = 40;   // height N-S
const EW = 0.75; // external wall 9"
const IW = 0.375; // internal wall 4.5"

// Drawing
const S = 17;  // px per foot
const MX = 95; // margin left/right
const MY = 65; // margin top
const MB = 85; // margin bottom

// Coordinate transforms (architectural Y-up → SVG Y-down)
const sx = (ft: number) => MX + ft * S;
const sy = (ft: number) => MY + (BH - ft) * S;

const vis = (layers: LayerState[], name: string) =>
  layers.find((l) => l.name === name)?.visible ?? true;

// ────────────────────────────────────────────────────
//  ROOM LAYOUT  (all coords are INTERIOR faces)
// ────────────────────────────────────────────────────
//
//  N (40')
//  ┌──────────┬───────┬────────────┐
//  │          │       │            │
//  │  Master  │ Att.  │            │
//  │  BR      │ Toil  │ Bedroom 2  │
//  │ 12×11    │ 5×7   │  10×11     │
//  │          │       │            │
//  ├──────────┤       │            │
//  │          ├───────┤            │
//  │  Living  │ Com.  │            │
//  │  12×15   │ Toil  ├────────────┤
//  │          │ 5×7   │  Utility   │
//  ├─────┬────┤       │  5×8       │
//  │     │Entr│       │            │
//  │     │Lobby│      ├────────────┤
//  │     │    ├───────┤  Kitchen   │
//  │     │Dining│     │  9×10      │
//  │     │10×10│      │            │
//  └─────┴────┴───────┴────────────┘
//  S (0')        → E

const rooms = [
  { id:'living',  name:'Living Room',     dim:'12\'-0" × 15\'-0"', x1:0.75,   y1:0.75,   x2:12.75,  y2:15.75   },
  { id:'dining',  name:'Dining',          dim:'10\'-0" × 10\'-0"', x1:13.125, y1:0.75,   x2:23.125, y2:10.75   },
  { id:'kitchen', name:'Kitchen',         dim:'9\'-0" × 10\'-0"',  x1:20.25,  y1:11.125, x2:29.25,  y2:21.125  },
  { id:'utility', name:'Utility / Wash',  dim:'5\'-0" × 8\'-0"',   x1:13.125, y1:27.5,   x2:18.125, y2:35.5    },
  { id:'master',  name:'Master Bedroom',  dim:'11\'-0" × 12\'-0"', x1:0.75,   y1:16.125, x2:12.75,  y2:27.125  },
  { id:'ct',      name:'Common Toilet',   dim:'5\'-0" × 7\'-0"',   x1:13.125, y1:11.125, x2:18.125, y2:18.125  },
  { id:'at',      name:'Attached Toilet', dim:'5\'-0" × 7\'-0"',   x1:13.125, y1:20.125, x2:18.125, y2:27.125  },
  { id:'bed2',    name:'Bedroom 2',       dim:'10\'-0" × 11\'-0"', x1:18.5,   y1:28.25,  x2:28.5,   y2:39.25   },
];

// Internal walls as rectangles: [x, y, w, h] in feet (x,y = SW corner of wall rect)
const iWalls: [number, number, number, number][] = [
  // ── Living / Dining partition (vertical at X≈12.9375) ──
  [12.75, 0.75, IW, 15],          // Living east / Dining west

  // ── Dining north wall (horizontal at Y≈10.9375) ──
  [13.125, 10.75, 16.125, IW],    // from Dining west to Kitchen east

  // ── Kitchen west wall (vertical at X≈20.0625) ──
  [20.0625, 11.125, IW, 10],      // Kitchen left side

  // ── Living / Master partition (horizontal at Y≈15.9375) ──
  [0.75, 15.75, 12, IW],          // between Living and Master

  // ── Master east wall (vertical at X≈12.9375) ──
  [12.75, 16.125, IW, 11],        // Master right side

  // ── Toilet column walls (vertical at X≈12.9375 and X≈18.3125) ──
  [12.75, 11.125, IW, 16],        // left column wall from Dining to Utility
  [18.125, 11.125, IW, 7],        // CT/AT east wall
  [18.125, 20.125, IW, 7],        // AT east wall continued

  // ── CT south wall ──
  [13.125, 11.125, 5, IW],        // CT bottom (shared with wall above Dining)

  // ── CT north / AT south partition (horizontal at Y≈19.9375) ──
  [13.125, 18.125, 5, IW],        // CT top
  [13.125, 19.75, 5, IW],         // AT bottom

  // ── AT north wall / Utility south wall area (horizontal at Y≈27.125) ──
  [13.125, 27.125, 5, IW],        // AT top / below Utility

  // ── Utility walls ──
  [13.125, 27.5, 5, IW],          // Utility south wall (just above AT)
  [18.125, 27.5, IW, 8],          // Utility east wall
  [13.125, 35.5, 5, IW],          // Utility north wall

  // ── Bedroom 2 walls ──
  [18.3125, 28.25, IW, 11],       // Bed2 west wall
  [18.5, 28.25, 10, IW],          // Bed2 south wall
  [28.5, 28.25, IW, 11],          // Bed2 east wall

  // ── Wall between Kitchen upper area and corridor to Bed2 ──
  [20.25, 21.125, IW, 7.125],     // vertical from Kitchen north to Bed2 south level

  // ── Lobby / entrance area walls ──
  [23.125, 0.75, IW, 10],         // lobby division
  [20.25, 10.75, 2.875, IW],      // lobby south edge
];

// Doors: position is the CENTER of the door opening in the wall
const doorData = [
  // Main entrance – south external wall of Living
  { id:'main', cx:6.5,  cy:0.75,   w:4,   wall:'H', openDir:1  },
  // Living → Dining (in partition wall at X≈12.9375)
  { id:'d1',   cx:12.9375, cy:8,   w:3,   wall:'V', openDir:1  },
  // Dining → Kitchen (in wall at Y≈10.9375)
  { id:'d2',   cx:22,   cy:10.9375, w:3,   wall:'H', openDir:1  },
  // Living → Master (in wall at Y≈15.9375)
  { id:'d3',   cx:6.5,  cy:15.9375, w:3,   wall:'H', openDir:1  },
  // Master → AT (in wall at X≈12.9375, shared with AT)
  { id:'d4',   cx:12.9375, cy:23,   w:2.5, wall:'V', openDir:1  },
  // Corridor → CT (in CT west wall at X≈13.125)
  { id:'d5',   cx:13.125, cy:15,    w:2.5, wall:'V', openDir:-1 },
  // Utility → Kitchen area (in Utility south wall at Y≈27.5)
  { id:'d6',   cx:15.5, cy:27.3125, w:3,   wall:'H', openDir:-1 },
  // Corridor → Bed2 (in Bed2 west wall)
  { id:'d7',   cx:18.5, cy:33,      w:3,   wall:'V', openDir:-1 },
  // Between toilet zones (in wall at Y≈19.9375)
  { id:'d8',   cx:15.5, cy:19.9375, w:2.5, wall:'H', openDir:1  },
];

// Windows
const winData = [
  { id:'w1', cx:3,     cy:0.75,    w:4, wall:'H', vent:false },  // Living south
  { id:'w2', cx:0.75,  cy:8,       w:4, wall:'V', vent:false },  // Living west
  { id:'w3', cx:18,    cy:0.75,    w:4, wall:'H', vent:false },  // Dining south
  { id:'w4', cx:29.25, cy:16,      w:4, wall:'V', vent:false },  // Kitchen east
  { id:'w5', cx:0.75,  cy:22,      w:4, wall:'V', vent:false },  // Master west
  { id:'w6', cx:7,     cy:27.125,  w:4, wall:'H', vent:false },  // Master north
  { id:'w7', cx:24,    cy:39.25,   w:4, wall:'H', vent:false },  // Bed2 north
  { id:'w8', cx:28.5,  cy:34,      w:4, wall:'V', vent:false },  // Bed2 east
  { id:'v1', cx:15.625, cy:18.125, w:2, wall:'H', vent:true  },  // CT ventilator (north)
  { id:'v2', cx:15.625, cy:27.125, w:2, wall:'H', vent:true  },  // AT ventilator (north)
  { id:'v3', cx:15.625, cy:35.5,   w:2, wall:'H', vent:true  },  // Utility ventilator (north)
];

// ────────────────────────────────────────────────────
export const FloorPlan: React.FC<FloorPlanProps> = ({ layers }) => {
  const svgW = MX * 2 + BW * S;
  const svgH = MY + MB + BH * S;

  const ec = layers.find(l => l.name === 'A-WALL-EXT')?.color || '#1a1a1a';
  const ic = layers.find(l => l.name === 'A-WALL-INT')?.color || '#2d2d2d';
  const dc = layers.find(l => l.name === 'A-DOOR')?.color   || '#c62828';
  const wc = layers.find(l => l.name === 'A-WINDOW')?.color || '#1565c0';
  const tc = layers.find(l => l.name === 'A-TEXT')?.color   || '#111';
  const xc = layers.find(l => l.name === 'A-DIMS')?.color   || '#2e7d32';
  const fc = layers.find(l => l.name === 'A-FURNITURE')?.color || '#555';
  const nc = layers.find(l => l.name === 'A-NORTH')?.color  || '#111';

  const ewt = EW * S; // external wall thickness in px
  const iwt = IW * S; // internal wall thickness in px

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto" style={{ background: '#fff', fontFamily: 'Arial,Helvetica,sans-serif' }}>
      <defs>
        <pattern id="wh" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke={ec} strokeWidth=".4" opacity=".22" />
        </pattern>
      </defs>

      {/* ── TITLE ── */}
      <text x={svgW/2} y={20} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#222" letterSpacing=".5">
        2BHK RESIDENTIAL FLOOR PLAN
      </text>
      <text x={svgW/2} y={34} textAnchor="middle" fontSize="8.5" fill="#777">
        30'-0" × 40'-0"  |  Scale 1/8" = 1'-0"  |  All dimensions in Feet-Inches  |  North ↑
      </text>

      {/* ── EXTERNAL WALLS ── */}
      {vis(layers,'A-WALL-EXT') && <g id="A-WALL-EXT">
        <rect x={sx(0)} y={sy(BH)} width={BW*S} height={BH*S} fill="none" stroke={ec} strokeWidth={ewt}/>
        <rect x={sx(EW)} y={sy(BH-EW)} width={(BW-2*EW)*S} height={(BH-2*EW)*S} fill="none" stroke={ec} strokeWidth=".4"/>
        {/* hatch fills */}
        <rect x={sx(0)} y={sy(EW)} width={BW*S} height={ewt} fill="url(#wh)"/>
        <rect x={sx(0)} y={sy(BH)} width={BW*S} height={ewt} fill="url(#wh)"/>
        <rect x={sx(0)} y={sy(BH)} width={ewt} height={BH*S} fill="url(#wh)"/>
        <rect x={sx(BW-EW)} y={sy(BH)} width={ewt} height={BH*S} fill="url(#wh)"/>
      </g>}

      {/* ── INTERNAL WALLS ── */}
      {vis(layers,'A-WALL-INT') && <g id="A-WALL-INT">
        {iWalls.map(([x,y,w,h],i)=>(
          <rect key={i} x={sx(x)} y={sy(y+h)} width={w*S} height={h*S} fill={ic}/>
        ))}
      </g>}

      {/* ── DOORS ── */}
      {vis(layers,'A-DOOR') && <g id="A-DOOR">
        {doorData.map(d=>{
          const cx=sx(d.cx), cy=sy(d.cy), w=d.w*S, h2=w/2;
          const gap=d.wall==='H'
            ? <rect x={cx-h2} y={cy-ewt/2-1} width={w} height={ewt+2} fill="#fff"/>
            : <rect x={cx-ewt/2-1} y={cy-h2} width={ewt+2} height={w} fill="#fff"/>;
          // leaf + arc
          let leaf:React.ReactElement, arc:React.ReactElement;
          const dir = d.openDir; // 1 = one direction, -1 = other
          if(d.wall==='H'){
            // horizontal wall → door leaf goes vertically
            const lx=cx-h2;
            if(dir>0){
              leaf=<line x1={lx} y1={cy} x2={lx} y2={cy-w} stroke={dc} strokeWidth={1.4}/>;
              arc=<path d={`M${lx} ${cy-w}A${w} ${w} 0 0 1 ${lx+w} ${cy}`} fill="none" stroke={dc} strokeWidth=".55" strokeDasharray="3,2"/>;
            } else {
              leaf=<line x1={lx+w} y1={cy} x2={lx+w} y2={cy+w} stroke={dc} strokeWidth={1.4}/>;
              arc=<path d={`M${lx+w} ${cy+w}A${w} ${w} 0 0 1 ${lx} ${cy}`} fill="none" stroke={dc} strokeWidth=".55" strokeDasharray="3,2"/>;
            }
          } else {
            // vertical wall → door leaf goes horizontally
            const ly=cy-h2;
            if(dir>0){
              leaf=<line x1={cx} y1={ly} x2={cx-w} y2={ly} stroke={dc} strokeWidth={1.4}/>;
              arc=<path d={`M${cx-w} ${ly}A${w} ${w} 0 0 0 ${cx} ${ly+w}`} fill="none" stroke={dc} strokeWidth=".55" strokeDasharray="3,2"/>;
            } else {
              leaf=<line x1={cx} y1={ly+w} x2={cx+w} y2={ly+w} stroke={dc} strokeWidth={1.4}/>;
              arc=<path d={`M${cx+w} ${ly+w}A${w} ${w} 0 0 0 ${cx} ${ly}`} fill="none" stroke={dc} strokeWidth=".55" strokeDasharray="3,2"/>;
            }
          }
          return <g key={d.id}>{gap}{leaf}{arc}</g>;
        })}
      </g>}

      {/* ── WINDOWS ── */}
      {vis(layers,'A-WINDOW') && <g id="A-WINDOW">
        {winData.map(win=>{
          const cx=sx(win.cx), cy=sy(win.cy), w=win.w*S, h2=w/2;
          const t = win.vent ? 2.5 : 4.5;
          const c = win.vent ? '#00838f' : wc;
          if(win.wall==='H'){
            return <g key={win.id}>
              <rect x={cx-h2} y={cy-t} width={w} height={t*2} fill="#fff"/>
              <line x1={cx-h2} y1={cy-1.5} x2={cx+h2} y2={cy-1.5} stroke={c} strokeWidth=".7"/>
              <line x1={cx-h2} y1={cy}     x2={cx+h2} y2={cy}     stroke={c} strokeWidth={win.vent?1:1.4}/>
              <line x1={cx-h2} y1={cy+1.5} x2={cx+h2} y2={cy+1.5} stroke={c} strokeWidth=".7"/>
            </g>;
          } else {
            return <g key={win.id}>
              <rect x={cx-t} y={cy-h2} width={t*2} height={w} fill="#fff"/>
              <line x1={cx-1.5} y1={cy-h2} x2={cx-1.5} y2={cy+h2} stroke={c} strokeWidth=".7"/>
              <line x1={cx}     y1={cy-h2} x2={cx}     y2={cy+h2} stroke={c} strokeWidth={win.vent?1:1.4}/>
              <line x1={cx+1.5} y1={cy-h2} x2={cx+1.5} y2={cy+h2} stroke={c} strokeWidth=".7"/>
            </g>;
          }
        })}
      </g>}

      {/* ── FURNITURE ── */}
      {vis(layers,'A-FURNITURE') && <g id="A-FURNITURE" opacity=".5">
        {/* Living – sofa */}
        <rect x={sx(1.5)} y={sy(14)} width={7*S} height={2*S} rx={2} fill="none" stroke={fc} strokeWidth=".7"/>
        <rect x={sx(1.5)} y={sy(14)} width={7*S} height={.6*S} fill={fc} opacity=".15" rx={1}/>
        <text x={sx(5)} y={sy(12.8)} textAnchor="middle" fontSize="5" fill={fc}>SOFA</text>
        {/* Living – TV */}
        <rect x={sx(4)} y={sy(1.8)} width={4*S} height={.5*S} fill={fc} opacity=".1" stroke={fc} strokeWidth=".4"/>

        {/* Dining – table + chairs */}
        <rect x={sx(15)} y={sy(8.5)} width={5*S} height={3*S} rx={3} fill="none" stroke={fc} strokeWidth=".7"/>
        {[.25,.5,.75].map((p,i)=>(<React.Fragment key={i}>
          <circle cx={sx(15+5*p)} cy={sy(9)} r={2.2} fill="none" stroke={fc} strokeWidth=".5"/>
          <circle cx={sx(15+5*p)} cy={sy(5.5)} r={2.2} fill="none" stroke={fc} strokeWidth=".5"/>
        </React.Fragment>))}
        <circle cx={sx(14.6)} cy={sy(7)} r={2.2} fill="none" stroke={fc} strokeWidth=".5"/>
        <circle cx={sx(20.4)} cy={sy(7)} r={2.2} fill="none" stroke={fc} strokeWidth=".5"/>

        {/* Kitchen – L-counter */}
        <rect x={sx(20.75)} y={sy(20.5)} width={1.2*S} height={8*S} fill={fc} opacity=".08" stroke={fc} strokeWidth=".6"/>
        <rect x={sx(21.95)} y={sy(12)} width={5.5*S} height={1.2*S} fill={fc} opacity=".08" stroke={fc} strokeWidth=".6"/>
        <circle cx={sx(24)} cy={sy(12.4)} r={2.2} fill="none" stroke={fc} strokeWidth=".4"/>
        <circle cx={sx(25.5)} cy={sy(12.4)} r={2.2} fill="none" stroke={fc} strokeWidth=".4"/>

        {/* Master BR – bed */}
        <rect x={sx(2)} y={sy(25.5)} width={5*S} height={6*S} rx={1} fill="none" stroke={fc} strokeWidth=".7"/>
        <rect x={sx(2.3)} y={sy(25)} width={2*S} height={.9*S} rx={2} fill={fc} opacity=".1"/>
        <rect x={sx(4.6)} y={sy(25)} width={2*S} height={.9*S} rx={2} fill={fc} opacity=".1"/>
        <line x1={sx(2.3)} y1={sy(22)} x2={sx(6.7)} y2={sy(22)} stroke={fc} strokeWidth=".3" strokeDasharray="2,1"/>

        {/* Bed2 – bed */}
        <rect x={sx(20)} y={sy(37.5)} width={4.5*S} height={5.5*S} rx={1} fill="none" stroke={fc} strokeWidth=".7"/>
        <rect x={sx(20.3)} y={sy(37)} width={3.9*S} height={.9*S} rx={2} fill={fc} opacity=".1"/>
        <line x1={sx(20.3)} y1={sy(34)} x2={sx(24.2)} y2={sy(34)} stroke={fc} strokeWidth=".3" strokeDasharray="2,1"/>

        {/* CT – WC + basin */}
        <ellipse cx={sx(14.5)} cy={sy(14)} rx={.55*S} ry={.75*S} fill="none" stroke={fc} strokeWidth=".6"/>
        <rect x={sx(14.1)} y={sy(15.2)} width={.8*S} height={.35*S} fill="none" stroke={fc} strokeWidth=".4" rx={1}/>
        <ellipse cx={sx(16.8)} cy={sy(14)} rx={.45*S} ry={.4*S} fill="none" stroke={fc} strokeWidth=".6"/>

        {/* AT – WC + basin */}
        <ellipse cx={sx(14.5)} cy={sy(23)} rx={.55*S} ry={.75*S} fill="none" stroke={fc} strokeWidth=".6"/>
        <rect x={sx(14.1)} y={sy(24.2)} width={.8*S} height={.35*S} fill="none" stroke={fc} strokeWidth=".4" rx={1}/>
        <ellipse cx={sx(16.8)} cy={sy(23)} rx={.45*S} ry={.4*S} fill="none" stroke={fc} strokeWidth=".6"/>

        {/* Utility – basin */}
        <rect x={sx(14)} y={sy(34)} width={2*S} height={1*S} fill="none" stroke={fc} strokeWidth=".5" rx={1}/>
        <ellipse cx={sx(15)} cy={sy(33)} rx={.45*S} ry={.3*S} fill="none" stroke={fc} strokeWidth=".4"/>
      </g>}

      {/* ── ROOM LABELS ── */}
      {vis(layers,'A-TEXT') && <g id="A-TEXT">
        {rooms.map(r=>{
          const cx=sx((r.x1+r.x2)/2), cy=sy((r.y1+r.y2)/2);
          return <g key={r.id}>
            <text x={cx} y={cy-3} textAnchor="middle" fontSize="7.5" fontWeight="bold" fill={tc}>{r.name}</text>
            <text x={cx} y={cy+7} textAnchor="middle" fontSize="6" fill={tc} fontStyle="italic">{r.dim}</text>
          </g>;
        })}
        {/* Entrance lobby label */}
        <text x={sx(26)} y={sy(5)} textAnchor="middle" fontSize="5.5" fill="#999" fontStyle="italic">Entrance</text>
        <text x={sx(26)} y={sy(4)} textAnchor="middle" fontSize="5.5" fill="#999" fontStyle="italic">Lobby</text>
      </g>}

      {/* ── DIMENSIONS ── */}
      {vis(layers,'A-DIMS') && <g id="A-DIMS">
        <DimH x1={sx(0)} x2={sx(BW)} y={sy(0)} off={58} label='30&apos;-0"' c={xc}/>
        <DimV y1={sy(0)} y2={sy(BH)} x={sx(0)} off={58} label='40&apos;-0"' c={xc}/>
        <DimH x1={sx(.75)} x2={sx(12.75)} y={sy(0)} off={34} label='12&apos;-0"' c={xc}/>
        <DimH x1={sx(13.125)} x2={sx(23.125)} y={sy(0)} off={34} label='10&apos;-0"' c={xc}/>
        <DimV y1={sy(.75)} y2={sy(15.75)} x={sx(0)} off={34} label='15&apos;-0"' c={xc}/>
        <DimV y1={sy(16.125)} y2={sy(27.125)} x={sx(0)} off={34} label='11&apos;-0"' c={xc}/>
        <DimH x1={sx(18.5)} x2={sx(28.5)} y={sy(BH)} off={34} label='10&apos;-0"' c={xc}/>
        <DimV y1={sy(28.25)} y2={sy(39.25)} x={sx(BW)} off={34} label='11&apos;-0"' c={xc}/>
        <DimH x1={sx(20.25)} x2={sx(29.25)} y={sy(11.125)} off={-18} label='9&apos;-0"' c={xc}/>
        <text x={svgW/2} y={sy(0)+75} textAnchor="middle" fontSize="5.5" fill={xc}>
          EXT. WALL = 9" (230mm)  |  INT. PARTITION = 4½" (115mm)
        </text>
      </g>}

      {/* ── NORTH ARROW ── */}
      {vis(layers,'A-NORTH') && <g id="A-NORTH" transform={`translate(${svgW-52},${MY+22})`}>
        <circle r={17} fill="none" stroke={nc} strokeWidth=".7"/>
        <polygon points="0,-15 -4,3.5 0,-.5 4,3.5" fill={nc}/>
        <polygon points="0,-15 4,3.5 0,-.5" fill={nc} opacity=".35"/>
        <text y={-19} textAnchor="middle" fontSize="9" fontWeight="bold" fill={nc}>N</text>
        <line x1={0} y1={3.5} x2={0} y2={15} stroke={nc} strokeWidth=".7"/>
        <text y={24} textAnchor="middle" fontSize="5" fill={nc}>NORTH</text>
      </g>}

      {/* subtle grid */}
      <g opacity=".04">
        {Array.from({length:31},(_,i)=><line key={`v${i}`} x1={sx(i)} y1={sy(0)} x2={sx(i)} y2={sy(BH)} stroke="#000" strokeWidth=".3"/>)}
        {Array.from({length:41},(_,i)=><line key={`h${i}`} x1={sx(0)} y1={sy(i)} x2={sx(BW)} y2={sy(i)} stroke="#000" strokeWidth=".3"/>)}
      </g>
    </svg>
  );
};

// ── Dimension helpers ──
const DimH:React.FC<{x1:number;x2:number;y:number;off:number;label:string;c:string}> = ({x1,x2,y,off,label,c})=>{
  const dy=y+off;
  return <g>
    <line x1={x1} y1={y+3} x2={x1} y2={dy+3} stroke={c} strokeWidth=".35"/>
    <line x1={x2} y1={y+3} x2={x2} y2={dy+3} stroke={c} strokeWidth=".35"/>
    <line x1={x1} y1={dy} x2={x2} y2={dy} stroke={c} strokeWidth=".55"/>
    <line x1={x1} y1={dy-2.5} x2={x1} y2={dy+2.5} stroke={c} strokeWidth=".55"/>
    <line x1={x2} y1={dy-2.5} x2={x2} y2={dy+2.5} stroke={c} strokeWidth=".55"/>
    {/* arrows */}
    <polygon points={`${x1+4},${dy-1.5} ${x1+4},${dy+1.5} ${x1},${dy}`} fill={c}/>
    <polygon points={`${x2-4},${dy-1.5} ${x2-4},${dy+1.5} ${x2},${dy}`} fill={c}/>
    <rect x={(x1+x2)/2-16} y={dy-7} width={32} height={8} fill="#fff"/>
    <text x={(x1+x2)/2} y={dy-1} textAnchor="middle" fontSize="6" fill={c} fontWeight="600">{label}</text>
  </g>;
};

const DimV:React.FC<{y1:number;y2:number;x:number;off:number;label:string;c:string}> = ({y1,y2,x,off,label,c})=>{
  const dx=x-off;
  return <g>
    <line x1={x-3} y1={y1} x2={dx-3} y2={y1} stroke={c} strokeWidth=".35"/>
    <line x1={x-3} y1={y2} x2={dx-3} y2={y2} stroke={c} strokeWidth=".35"/>
    <line x1={dx} y1={y1} x2={dx} y2={y2} stroke={c} strokeWidth=".55"/>
    <line x1={dx-2.5} y1={y1} x2={dx+2.5} y2={y1} stroke={c} strokeWidth=".55"/>
    <line x1={dx-2.5} y1={y2} x2={dx+2.5} y2={y2} stroke={c} strokeWidth=".55"/>
    <polygon points={`${dx-1.5},${y1-4} ${dx+1.5},${y1-4} ${dx},${y1}`} fill={c}/>
    <polygon points={`${dx-1.5},${y2+4} ${dx+1.5},${y2+4} ${dx},${y2}`} fill={c}/>
    <text x={dx} y={(y1+y2)/2} textAnchor="middle" fontSize="6" fill={c} fontWeight="600"
      transform={`rotate(-90,${dx},${(y1+y2)/2})`}>{label}</text>
  </g>;
};
