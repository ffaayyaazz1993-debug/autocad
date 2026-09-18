import { useState, useEffect } from 'react';

interface CodeViewerProps {
  onClose: () => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ onClose }) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/2BHK_FloorPlan.lsp')
      .then(r => r.text())
      .then(setCode)
      .catch(() => setCode(';; Error loading file'));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2BHK_FloorPlan.lsp';
    a.click();
    URL.revokeObjectURL(url);
  };

  const highlightLisp = (src: string) => {
    return src.split('\n').map((line, i) => {
      let cls = 'text-gray-300';
      if (line.trim().startsWith(';;;')) cls = 'text-emerald-400';
      else if (line.trim().startsWith(';;')) cls = 'text-emerald-500/70';
      else if (line.trim().startsWith(';')) cls = 'text-emerald-600/60';

      // Highlight keywords
      let highlighted = line
        .replace(/(defun|setq|command|if|progn|not|and|or|cond|lambda|foreach|repeat|while|princ|itoa|rtos|list|tblsearch|load)\b/g, '<span class="text-purple-400 font-semibold">$1</span>')
        .replace(/("[^"]*")/g, '<span class="text-amber-300">$1</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-cyan-300">$1</span>')
        .replace(/(\/)\s/g, '<span class="text-pink-400">$1</span> ');

      return (
        <div key={i} className="flex hover:bg-white/5 group">
          <span className="select-none w-10 text-right pr-3 text-gray-600 text-[10px] leading-5 group-hover:text-gray-400 flex-shrink-0">
            {i + 1}
          </span>
          <span
            className={`${cls} whitespace-pre text-[11px] leading-5 flex-1`}
            dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">2BHK_FloorPlan.lsp</h3>
              <p className="text-[10px] text-gray-400">AutoLISP — AutoCAD Script</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 rounded transition-colors"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors font-medium"
            >
              ⬇ Download .lsp
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-2 font-mono bg-[#0d1117]">
          {highlightLisp(code)}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-700 bg-gray-800 rounded-b-xl flex justify-between items-center">
          <span className="text-[10px] text-gray-500">
            {code.split('\n').length} lines | AutoLISP for AutoCAD
          </span>
          <span className="text-[10px] text-gray-500">
            Usage: (load "2BHK_FloorPlan.lsp") → Type 2BHK
          </span>
        </div>
      </div>
    </div>
  );
};
