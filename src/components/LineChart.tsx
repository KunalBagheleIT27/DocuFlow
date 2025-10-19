import React from 'react';

type Props = {
  labels: string[];
  values: number[];
  height?: number;
};

function max(arr: number[]) { return arr.length ? Math.max(...arr) : 0; }

export default function LineChart({ labels, values, height = 120 }: Props) {
  const w = 600;
  const h = height;
  const padding = 16;
  const innerW = w - padding * 2;
  const innerH = h - padding * 2;
  const mx = max(values) || 1;
  const step = labels.length > 1 ? innerW / (labels.length - 1) : innerW;

  const points = values.map((v, i) => {
    const x = padding + i * step;
    const y = padding + innerH - (v / mx) * innerH;
    return `${x},${y}`;
  }).join(' ');

  // area path
  const areaPath = values.map((v, i) => {
    const x = padding + i * step;
    const y = padding + innerH - (v / mx) * innerH;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ') + ` L ${padding + innerW} ${padding + innerH} L ${padding} ${padding + innerH} Z`;

  const linePath = values.map((v, i) => {
    const x = padding + i * step;
    const y = padding + innerH - (v / mx) * innerH;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div style={{overflow: 'auto'}}>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{background:'transparent'}}>
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#5b8cff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#5b8cff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g>
          <path d={areaPath} fill="url(#g1)" />
          <path d={linePath} fill="none" stroke="#5b8cff" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {values.map((v, i) => {
            const x = padding + i * step;
            const y = padding + innerH - (v / mx) * innerH;
            return <circle key={i} cx={x} cy={y} r={3} fill="#5b8cff" />;
          })}
        </g>
        <g transform={`translate(0,${h - 18})`}>
          {labels.map((lab, i) => (
            <text key={i} x={padding + i * step} y={12} fontSize={11} fill="var(--muted)" textAnchor="middle">{lab}</text>
          ))}
        </g>
      </svg>
    </div>
  );
}
