import { useState } from 'react';
import { FloorPlan } from './FloorPlan';
import { LayerState } from './types';

const initialLayers: LayerState[] = [
  { name: 'A-WALL-EXT', visible: true, color: '#1a1a1a', description: 'External Walls (9")' },
  { name: 'A-WALL-INT', visible: true, color: '#2a2a2a', description: 'Internal Walls (4½")' },
  { name: 'A-DOOR', visible: true, color: '#c41e1e', description: 'Doors & Swing Arcs' },
  { name: 'A-WINDOW', visible: true, color: '#1565c0', description: 'Windows & Ventilators' },
  { name: 'A-TEXT', visible: true, color: '#111111', description: 'Room Names & Labels' },
  { name: 'A-DIMS', visible: true, color: '#1b5e20', description: 'Dimensions & Annotations' },
  { name: 'A-FURNITURE', visible: true, color: '#555555', description: 'Furniture Layout' },
  { name: 'A-NORTH', visible: true, color: '#111111', description: 'North Arrow Indicator' },
];

export default function App() {
  const [layers, setLayers] = useState<LayerState[]>(initialLayers);
  const [showPanel, setShowPanel] = useState(true);

  const toggleLayer = (name: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.name === name ? { ...l, visible: !l.visible } : l))
    );
  };

  const toggleAll = (visible: boolean) => {
    setLayers((prev) => prev.map((l) => ({ ...l, visible })));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white px-4 py-2.5 shadow-lg flex-shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <rect x="1" y="1" width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" />
                <line x1="6" y1="1" x2="6" y2="15" stroke="white" strokeWidth="0.75" />
                <line x1="1" y1="8" x2="15" y2="8" stroke="white" strokeWidth="0.75" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide">ARCHITECTURAL FLOOR PLAN</h1>
              <p className="text-[10px] text-gray-400">
                2BHK Residential | 30'-0" × 40'-0" | AutoCAD Standard Drawing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-[10px] text-gray-400 hidden sm:block">
              <div>Units: Feet &amp; Inches</div>
              <div>Scale: 1/8" = 1'-0"</div>
              <div>North: Upward</div>
            </div>
            <button
              onClick={() => setShowPanel(!showPanel)}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-xs font-medium transition-colors border border-gray-600"
            >
              {showPanel ? '◀ Hide' : '▶ Show'} Layers
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Layer Panel */}
        {showPanel && (
          <aside className="w-56 bg-white border-r border-gray-200 overflow-y-auto shadow-sm flex-shrink-0">
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Layer Manager</h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleAll(true)}
                    className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded hover:bg-green-100 border border-green-200"
                  >
                    All On
                  </button>
                  <button
                    onClick={() => toggleAll(false)}
                    className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded hover:bg-red-100 border border-red-200"
                  >
                    Off
                  </button>
                </div>
              </div>
              <div className="space-y-0.5">
                {layers.map((layer) => (
                  <label
                    key={layer.name}
                    className={`flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer transition-all text-left ${
                      layer.visible ? 'bg-gray-50 hover:bg-gray-100' : 'opacity-40 hover:opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => toggleLayer(layer.name)}
                      className="w-3 h-3 rounded-sm border-gray-300 flex-shrink-0"
                    />
                    <div
                      className="w-2.5 h-2.5 rounded-sm border border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono font-semibold text-gray-800 truncate leading-tight">
                        {layer.name}
                      </div>
                      <div className="text-[9px] text-gray-500 truncate leading-tight">{layer.description}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Drawing Info */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-600 uppercase mb-1.5">Project Data</h3>
                <div className="space-y-0.5 text-[10px] text-gray-600">
                  <div className="flex justify-between">
                    <span>Building:</span>
                    <span className="font-mono font-medium">30'-0" × 40'-0"</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ext. Wall:</span>
                    <span className="font-mono">9" (230mm)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Int. Wall:</span>
                    <span className="font-mono">4½" (115mm)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plot Side:</span>
                    <span className="font-mono">30' E-W × 40' N-S</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Rooms:</span>
                    <span className="font-mono font-medium">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carpet Area:</span>
                    <span className="font-mono">~971 sq.ft</span>
                  </div>
                </div>
              </div>

              {/* Room Schedule */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-600 uppercase mb-1.5">Room Schedule</h3>
                <table className="w-full text-[9px]">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-100">
                      <th className="text-left py-0.5 font-medium">Room</th>
                      <th className="text-right py-0.5 font-medium">Size</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr><td className="py-0.5">Living Room</td><td className="text-right font-mono">12'×15'</td></tr>
                    <tr><td className="py-0.5">Dining</td><td className="text-right font-mono">10'×10'</td></tr>
                    <tr><td className="py-0.5">Master Bedroom</td><td className="text-right font-mono">11'×12'</td></tr>
                    <tr><td className="py-0.5">Bedroom 2</td><td className="text-right font-mono">10'×11'</td></tr>
                    <tr><td className="py-0.5">Kitchen</td><td className="text-right font-mono">9'×10'</td></tr>
                    <tr><td className="py-0.5">Common Toilet</td><td className="text-right font-mono">5'×7'</td></tr>
                    <tr><td className="py-0.5">Attached Toilet</td><td className="text-right font-mono">5'×7'</td></tr>
                    <tr><td className="py-0.5">Utility/Wash</td><td className="text-right font-mono">5'×8'</td></tr>
                  </tbody>
                </table>
              </div>

              {/* Opening Schedule */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-600 uppercase mb-1.5">Opening Schedule</h3>
                <div className="space-y-0.5 text-[10px] text-gray-600">
                  <div className="flex justify-between">
                    <span>Main Door:</span>
                    <span className="font-mono">4'-0" wide</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bedroom Doors:</span>
                    <span className="font-mono">3'-0" wide</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kitchen Door:</span>
                    <span className="font-mono">3'-0" wide</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Toilet Doors:</span>
                    <span className="font-mono">2'-6" wide</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Windows:</span>
                    <span className="font-mono">4'-0" wide</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ventilators:</span>
                    <span className="font-mono">2'-0" × 1'-6"</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h3 className="text-[10px] font-bold text-gray-600 uppercase mb-1.5">Symbol Legend</h3>
                <div className="space-y-1.5 text-[10px] text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-2.5 rounded-sm" style={{ background: 'repeating-linear-gradient(45deg, #1a1a1a22, #1a1a1a22 1px, transparent 1px, transparent 3px)', border: '1px solid #1a1a1a' }}></div>
                    <span>External Wall (9")</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-1.5 bg-gray-700 rounded-sm"></div>
                    <span>Internal Wall (4½")</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="14" viewBox="0 0 20 14">
                      <line x1="2" y1="12" x2="2" y2="2" stroke="#c41e1e" strokeWidth="1.5" />
                      <path d="M 2 2 A 10 10 0 0 1 12 12" fill="none" stroke="#c41e1e" strokeWidth="0.6" strokeDasharray="2,1" />
                    </svg>
                    <span>Door with Swing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="8" viewBox="0 0 20 8">
                      <line x1="1" y1="2" x2="19" y2="2" stroke="#1565c0" strokeWidth="0.7" />
                      <line x1="1" y1="4" x2="19" y2="4" stroke="#1565c0" strokeWidth="1.4" />
                      <line x1="1" y1="6" x2="19" y2="6" stroke="#1565c0" strokeWidth="0.7" />
                    </svg>
                    <span>Window</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="8" viewBox="0 0 20 8">
                      <line x1="1" y1="2.5" x2="19" y2="2.5" stroke="#0097a7" strokeWidth="0.6" />
                      <line x1="1" y1="4" x2="19" y2="4" stroke="#0097a7" strokeWidth="1" />
                      <line x1="1" y1="5.5" x2="19" y2="5.5" stroke="#0097a7" strokeWidth="0.6" />
                    </svg>
                    <span>Ventilator</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Drawing Area */}
        <main className="flex-1 overflow-auto p-4 flex items-start justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="bg-white shadow-2xl rounded border border-gray-200 p-3 inline-block max-w-full">
            <FloorPlan layers={layers} />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 px-4 py-1.5 text-[10px] flex-shrink-0">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <span>Drawing: 2BHK Residential Floor Plan | 30'-0" × 40'-0" | 8 Rooms | 8 Layers</span>
          <span className="hidden sm:inline">Layers: A-WALL-EXT | A-WALL-INT | A-DOOR | A-WINDOW | A-TEXT | A-DIMS | A-FURNITURE | A-NORTH</span>
        </div>
      </footer>
    </div>
  );
}
