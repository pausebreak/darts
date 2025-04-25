import React from 'react';
import { ParentSize } from '@visx/responsive';
import { Pie } from '@visx/shape';
import { scaleOrdinal } from '@visx/scale';
import CHART_COLORS from './Palettes';

export interface PieChartData {
  label: string;
  value: number;
}

export interface PieChartProps {
  data: PieChartData[];
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const defaultMargin = { top: 24, right: 16, bottom: 40, left: 40 };

const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 240,
  margin = defaultMargin,
}) => {
  return (
    <ParentSize>{({ width }) => {
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const radius = Math.min(innerWidth, innerHeight) / 2 - 8;
      const colorScale = scaleOrdinal({
        domain: data.map(d => d.label),
        range: CHART_COLORS,
      });
      const centerX = margin.left + innerWidth / 2;
      const centerY = margin.top + innerHeight / 2;
      return (
        <svg width={width} height={height} role="img" aria-label="Pie chart">
          <g transform={`translate(${centerX},${centerY})`}>
            <Pie
              data={data}
              pieValue={d => d.value}
              outerRadius={radius}
              innerRadius={0}
              cornerRadius={4}
            >
              {pie =>
                pie.arcs.map((arc, i) => (
                  <g key={arc.data.label}>
                    <path
                      d={pie.path(arc) || undefined}
                      fill={colorScale(arc.data.label)}
                      aria-label={`${arc.data.label}: ${arc.data.value}`}
                    />
                    {/* Direct label */}
                    {(() => {
                      const [centroidX, centroidY] = pie.path.centroid(arc);
                      return (
                        <text
                          x={centroidX}
                          y={centroidY}
                          fontSize={13}
                          fill="#333"
                          fontWeight={600}
                          textAnchor="middle"
                          aria-label={arc.data.label}
                          style={{ userSelect: 'none' }}
                        >
                          {arc.data.value > 0 ? arc.data.label : ''}
                        </text>
                      );
                    })()}
                  </g>
                ))
              }
            </Pie>
          </g>
          {/* Legend */}
          <g transform={`translate(${margin.left},${height - margin.bottom + 16})`}>
            {data.map((d, i) => (
              <g key={d.label} transform={`translate(${i * 100},0)`}>
                <rect width={16} height={16} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                <text x={22} y={13} fontSize={13} fill="#333">{d.label}</text>
              </g>
            ))}
          </g>
        </svg>
      );
    }}</ParentSize>
  );
};

export default PieChart; 