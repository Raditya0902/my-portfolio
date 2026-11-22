import test from 'node:test';
import assert from 'node:assert/strict';
import { barAxis, formatTick, formatValue, lineGeometry, niceTicks, share } from '../src/lib/charts.ts';
import { chartSchema, type BarChart, type LineChart } from '../src/lib/content-schemas.ts';

const bar = (overrides: Partial<BarChart> = {}): BarChart => chartSchema.parse({
  type: 'bar', title: 'T', caption: 'C', unit: '', decimals: 1,
  series: [{ name: 'A', tone: 'green' }],
  rows: [{ label: 'x', values: [42], intervals: [[40, 45]] }],
  ...overrides,
}) as BarChart;

test('niceTicks rounds the maximum up to a readable step', () => {
  assert.deepEqual(niceTicks(1531.68), [0, 500, 1000, 1500, 2000]);
  assert.deepEqual(niceTicks(2187.9), [0, 500, 1000, 1500, 2000, 2500]);
  assert.deepEqual(niceTicks(0.97), [0, 0.2, 0.4, 0.6, 0.8, 1]);
  assert.deepEqual(niceTicks(0), [0, 1]);
});

test('bar axis honours a fixed maximum and otherwise covers intervals', () => {
  assert.deepEqual(barAxis(bar({ max: 100 })), { max: 100, ticks: [0, 20, 40, 60, 80, 100] });
  assert.equal(barAxis(bar()).max, 50);
});

test('share clamps to the track and formatting keeps units and separators', () => {
  assert.equal(share(150, 100), 100);
  assert.equal(share(-1, 100), 0);
  assert.equal(share(5, 0), 0);
  assert.equal(formatValue(1531.68, 1, ' ops/s'), '1,531.7 ops/s');
  assert.equal(formatTick(0.25), '0.25');
});

test('chart schema rejects mismatched rows, impossible intervals, and a short axis', () => {
  const base = { type: 'bar', title: 'T', caption: 'C', unit: '', decimals: 1, series: [{ name: 'A', tone: 'green' }] };
  assert.equal(chartSchema.safeParse({ ...base, rows: [{ label: 'x', values: [1, 2] }] }).success, false);
  assert.equal(chartSchema.safeParse({ ...base, rows: [{ label: 'x', values: [5], intervals: [[6, 7]] }] }).success, false);
  assert.equal(chartSchema.safeParse({ ...base, max: 4, rows: [{ label: 'x', values: [5] }] }).success, false);
  assert.equal(chartSchema.safeParse({ ...base, series: [...base.series, { name: 'B', tone: 'blue' }], rows: [{ label: 'x', tone: 'green', values: [1, 2] }] }).success, false);
});

test('line geometry stays inside the plot and keeps end labels apart', () => {
  const chart = chartSchema.parse({
    type: 'line', title: 'T', caption: 'C', unit: '', decimals: 0, xLabel: 'Clients', x: [1, 4, 32],
    series: [{ name: 'A', tone: 'green', values: [10, 20, 100] }, { name: 'B', tone: 'blue', values: [10, 20, 99] }],
  }) as LineChart;
  const geometry = lineGeometry(chart);
  const points = geometry.series.flatMap((series) => series.points);
  assert.ok(points.every((point) => point.x >= geometry.plot.left && point.x <= geometry.plot.right));
  assert.ok(points.every((point) => point.y >= geometry.plot.top && point.y <= geometry.plot.bottom));
  assert.equal(geometry.xTicks[0].x, geometry.plot.left);
  assert.equal(geometry.xTicks.at(-1)!.x, geometry.plot.right);
  const [first, second] = geometry.series.map((series) => series.labelY);
  assert.ok(Math.abs(first - second) >= 16);
});
