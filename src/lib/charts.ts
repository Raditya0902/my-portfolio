import type { BarChart, LineChart } from './content-schemas.ts';

const NICE_STEPS = [1, 2, 2.5, 5, 10] as const;
const TARGET_TICKS = 5;

/** Rounds an axis maximum up to a readable step and returns the evenly spaced ticks. */
export function niceTicks(max: number, targetTicks = TARGET_TICKS): number[] {
  if (!(max > 0)) return [0, 1];
  const rough = max / targetTicks;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = NICE_STEPS.map((factor) => factor * magnitude).find((candidate) => candidate >= rough) ?? 10 * magnitude;
  const count = Math.ceil(max / step - 1e-9);
  return Array.from({ length: count + 1 }, (_, index) => Number((index * step).toPrecision(12)));
}

export function formatValue(value: number, decimals: number, unit = ''): string {
  const number = value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${number}${unit}`;
}

/** Percentage of the axis, clamped so a bad value can never escape the track. */
export function share(value: number, max: number): number {
  if (!(max > 0)) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}

export function barAxis(chart: BarChart): { max: number; ticks: number[] } {
  const largest = Math.max(...chart.rows.flatMap((row) => [...row.values, ...(row.intervals?.map(([, high]) => high) ?? [])]));
  if (chart.max !== undefined) {
    const ticks = niceTicks(chart.max).filter((tick) => tick <= chart.max!);
    return { max: chart.max, ticks: ticks.at(-1) === chart.max ? ticks : [...ticks, chart.max] };
  }
  const ticks = niceTicks(largest);
  return { max: ticks.at(-1)!, ticks };
}

export interface LineGeometry {
  width: number;
  height: number;
  plot: { left: number; right: number; top: number; bottom: number };
  yTicks: { value: number; y: number }[];
  xTicks: { value: number; x: number }[];
  series: { name: string; tone: string; dashed: boolean; path: string; points: { x: number; y: number; xValue: number; value: number }[]; labelY: number }[];
}

const LINE_LAYOUT = { width: 640, height: 320, left: 56, right: 120, top: 16, bottom: 44 } as const;
const LABEL_GAP = 16;

/** Lays out a line chart on a log2 x-axis (concurrency-style data) with a zero-based y-axis. */
export function lineGeometry(chart: LineChart): LineGeometry {
  const { width, height, left, right, top, bottom } = LINE_LAYOUT;
  const plot = { left, right: width - right, top, bottom: height - bottom };
  const yValues = niceTicks(Math.max(...chart.series.flatMap((series) => series.values)));
  const yMax = yValues.at(-1)!;
  const logs = chart.x.map((value) => Math.log2(value));
  const [minLog, maxLog] = [Math.min(...logs), Math.max(...logs)];
  const xAt = (value: number) => plot.left + ((Math.log2(value) - minLog) / (maxLog - minLog || 1)) * (plot.right - plot.left);
  const yAt = (value: number) => plot.bottom - (value / yMax) * (plot.bottom - plot.top);
  const series = chart.series.map((entry) => {
    const points = entry.values.map((value, index) => ({ x: xAt(chart.x[index]), y: yAt(value), xValue: chart.x[index], value }));
    const path = points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');
    return { name: entry.name, tone: entry.tone, dashed: entry.dashed, path, points, labelY: points.at(-1)!.y };
  });
  return { width, height, plot, yTicks: yValues.map((value) => ({ value, y: yAt(value) })), xTicks: chart.x.map((value) => ({ value, x: xAt(value) })), series: spreadLabels(series, plot) };
}

/** Pushes end-of-line labels apart so neighbouring series never overlap. */
function spreadLabels<T extends { labelY: number }>(series: T[], plot: { top: number; bottom: number }): T[] {
  const order = series.map((entry, index) => ({ index, y: entry.labelY })).sort((a, b) => a.y - b.y);
  const placed: number[] = [];
  for (const item of order) {
    const previous = placed.at(-1);
    placed.push(previous === undefined ? Math.max(item.y, plot.top + 6) : Math.max(item.y, previous + LABEL_GAP));
  }
  const overflow = (placed.at(-1) ?? 0) - plot.bottom;
  const adjusted = overflow > 0 ? placed.map((y) => y - overflow) : placed;
  const byIndex = new Map(order.map((item, position) => [item.index, adjusted[position]]));
  return series.map((entry, index) => ({ ...entry, labelY: byIndex.get(index)! }));
}

export function formatTick(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
