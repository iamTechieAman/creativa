import { Rect, Circle, Textbox, Group } from 'fabric';

/**
 * Builds a vector Bar Chart Group in Fabric
 */
export const createBarChart = ({
  data = [
    { label: 'Jan', value: 45, color: '#7D2AE8' },
    { label: 'Feb', value: 72, color: '#00C4CC' },
    { label: 'Mar', value: 60, color: '#f59e0b' },
    { label: 'Apr', value: 88, color: '#ec4899' },
    { label: 'May', value: 95, color: '#10b981' }
  ],
  title = 'Monthly Growth',
  left = 400,
  top = 400,
  width = 380,
  height = 240
}) => {
  const objects = [];

  // Background card
  const bg = new Rect({
    width,
    height,
    fill: '#ffffff',
    rx: 16,
    ry: 16,
    stroke: '#e2e8f0',
    strokeWidth: 1.5,
    originX: 'center',
    originY: 'center',
    shadow: {
      color: 'rgba(0,0,0,0.06)',
      blur: 12,
      offsetX: 0,
      offsetY: 4
    }
  });
  objects.push(bg);

  // Title text
  const titleObj = new Textbox(title, {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    fill: '#1e293b',
    textAlign: 'left',
    left: -width / 2 + 24,
    top: -height / 2 + 20,
    width: width - 48
  });
  objects.push(titleObj);

  // Bars
  const maxVal = Math.max(...data.map(d => d.value), 100);
  const barAreaHeight = height - 100;
  const barAreaWidth = width - 60;
  const barWidth = Math.min(36, (barAreaWidth / data.length) * 0.65);
  const startX = -width / 2 + 30 + (barAreaWidth / data.length) / 2;
  const baseY = height / 2 - 40;

  data.forEach((item, index) => {
    const barHeight = (item.value / maxVal) * barAreaHeight;
    const x = startX + index * (barAreaWidth / data.length);

    // The Bar rect
    const bar = new Rect({
      left: x,
      top: baseY - barHeight / 2,
      width: barWidth,
      height: barHeight,
      fill: item.color || '#7D2AE8',
      rx: 6,
      ry: 6,
      originX: 'center',
      originY: 'center'
    });
    objects.push(bar);

    // Label below
    const label = new Textbox(item.label, {
      left: x,
      top: baseY + 12,
      fontSize: 11,
      fontFamily: 'Inter',
      fontWeight: '600',
      fill: '#64748b',
      textAlign: 'center',
      originX: 'center',
      originY: 'top',
      width: 50
    });
    objects.push(label);

    // Value on top
    const valText = new Textbox(`${item.value}%`, {
      left: x,
      top: baseY - barHeight - 16,
      fontSize: 10,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#1e293b',
      textAlign: 'center',
      originX: 'center',
      originY: 'top',
      width: 50
    });
    objects.push(valText);
  });

  return new Group(objects, {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};

/**
 * Builds a vector Donut / Progress Chart Group
 */
export const createDonutChart = ({
  percentage = 78,
  title = 'Completion',
  color = '#7D2AE8',
  left = 400,
  top = 400,
  size = 220
}) => {
  const objects = [];

  // Card background
  const bg = new Rect({
    width: size,
    height: size + 40,
    fill: '#ffffff',
    rx: 16,
    ry: 16,
    stroke: '#e2e8f0',
    strokeWidth: 1.5,
    originX: 'center',
    originY: 'center',
    shadow: {
      color: 'rgba(0,0,0,0.06)',
      blur: 10,
      offsetX: 0,
      offsetY: 3
    }
  });
  objects.push(bg);

  // Outer track circle
  const track = new Circle({
    radius: 60,
    stroke: '#f1f5f9',
    strokeWidth: 14,
    fill: 'transparent',
    originX: 'center',
    originY: 'center',
    top: -15
  });
  objects.push(track);

  // Progress circle
  const progress = new Circle({
    radius: 60,
    stroke: color,
    strokeWidth: 14,
    fill: 'transparent',
    strokeDashArray: [2 * Math.PI * 60 * (percentage / 100), 2 * Math.PI * 60],
    originX: 'center',
    originY: 'center',
    top: -15,
    angle: -90
  });
  objects.push(progress);

  // Center percentage
  const pctText = new Textbox(`${percentage}%`, {
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'Montserrat',
    fill: '#1e293b',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    top: -15,
    width: 100
  });
  objects.push(pctText);

  // Label at bottom
  const titleText = new Textbox(title, {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    fill: '#64748b',
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    top: size / 2 - 10,
    width: size - 30
  });
  objects.push(titleText);

  return new Group(objects, {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};
