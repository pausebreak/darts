import React from 'react';
import { ParentSize } from '@visx/responsive';
import { LinePath } from '@visx/shape';
import { scaleLinear, scalePoint } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import CHART_COLORS from '../graphs/Palettes';

// Types for props
export interface LineChartSeries {
  label: string;
  data: { x: string | number; y: number }[];
}

export interface LineChartProps {
  series: LineChartSeries[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const defaultMargin = { top: 24, right: 16, bottom: 40, left: 40 };

export const LineChart: React.FC<LineChartProps> = ({
  series,
  xLabel,
  yLabel,
  height = 240,
  margin = defaultMargin,
}) => {
  // Flatten all x values for scale
  const allX = Array.from(
    new Set(series.flatMap(s => s.data.map(d => d.x)))
  );
  // Find y domain
  const allY = series.flatMap(s => s.data.map(d => d.y));
  const yMin = Math.min(...allY, 0);
  const yMax = Math.max(...allY, 1);

  return (
    <ParentSize>{({ width }) => {
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      // Scales
      const xScale = scalePoint({
        domain: allX,
        range: [0, innerWidth],
        padding: 0.5,
      });
      const yScale = scaleLinear({
        domain: [yMin, yMax],
        range: [innerHeight, 0],
        nice: true,
      });
      return (
        <svg width={width} height={height} role="img" aria-label="Line chart">
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Y Axis */}
            <AxisLeft
              scale={yScale}
              stroke="#888"
              tickStroke="#888"
              tickLabelProps={() => ({
                fill: '#888',
                fontSize: 12,
                textAnchor: 'end',
                dy: '0.33em',
              })}
              label={yLabel}
              labelProps={{
                fill: '#888',
                fontSize: 14,
                textAnchor: 'middle',
                fontWeight: 600,
                dy: '-2em',
              }}
            />
            {/* X Axis */}
            <AxisBottom
              top={innerHeight}
              scale={xScale}
              stroke="#888"
              tickStroke="#888"
              tickLabelProps={() => ({
                fill: '#888',
                fontSize: 12,
                textAnchor: 'middle',
                dy: '0.5em',
              })}
              label={xLabel}
              labelProps={{
                fill: '#888',
                fontSize: 14,
                textAnchor: 'middle',
                fontWeight: 600,
                dy: '2.5em',
              }}
            />
            {/* Lines */}
            {series.map((s, i) => (
              <LinePath
                key={s.label}
                data={s.data}
                x={d => xScale(d.x) ?? 0}
                y={d => yScale(d.y)}
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth={2.5}
                curve={undefined}
              />
            ))}
            {/* Direct labels at last point (dynamically offset to avoid overlap) */}
            {(() => {
              // Gather label positions
              const labelData = series.map((s, i) => {
                const last = s.data[s.data.length - 1];
                return last
                  ? {
                      label: s.label,
                      x: xScale(last.x) ?? 0,
                      y: yScale(last.y),
                      color: CHART_COLORS[i % CHART_COLORS.length],
                    }
                  : null;
              }).filter(Boolean);
              // Sort by y
              labelData.sort((a, b) => a.y - b.y);
              // Apply dynamic vertical offsets
              const minSpacing = 18; // px
              for (let i = 1; i < labelData.length; i++) {
                if (labelData[i].y - labelData[i - 1].y < minSpacing) {
                  labelData[i].y = labelData[i - 1].y + minSpacing;
                }
              }
              return labelData.map((d, i) => (
                <text
                  key={d.label + '-label'}
                  x={d.x + 8}
                  y={d.y + 4}
                  fontSize={12}
                  fill={d.color}
                  fontWeight={600}
                  aria-label={d.label}
                  style={{ userSelect: 'none' }}
                >
                  {d.label}
                </text>
              ));
            })()}
          </g>
        </svg>
      );
    }}</ParentSize>
  );
};

export default LineChart; 