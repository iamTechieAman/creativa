import { Group, Rect, Line, Textbox } from 'fabric';

/**
 * Creativa Pro Data Table Generator
 * Creates editable vector grid tables with customizable rows, columns, and color styling
 */
export const createDataTable = ({
  rows = 3,
  cols = 3,
  cellWidth = 130,
  cellHeight = 44,
  headerBg = '#7D2AE8',
  headerColor = '#ffffff',
  cellBg = '#ffffff',
  altCellBg = '#f8fafc',
  borderColor = '#cbd5e1',
  left = 400,
  top = 400,
  headers = ['Feature', 'Starter', 'Enterprise Plan'],
  data = [
    ['Storage', '5 GB', '1 TB'],
    ['AI Credits', '20 / mo', 'Unlimited']
  ]
}) => {
  const tableWidth = cols * cellWidth;
  const tableHeight = rows * cellHeight;
  const elements = [];

  // Table Background Card
  const outerBox = new Rect({
    width: tableWidth,
    height: tableHeight,
    rx: 8,
    ry: 8,
    fill: cellBg,
    stroke: borderColor,
    strokeWidth: 1.5,
    originX: 'center',
    originY: 'center',
    shadow: { color: 'rgba(0,0,0,0.08)', blur: 12, offsetY: 4 }
  });
  elements.push(outerBox);

  const startX = -tableWidth / 2;
  const startY = -tableHeight / 2;

  // Header row background
  const headerBar = new Rect({
    left: 0,
    top: startY + cellHeight / 2,
    width: tableWidth,
    height: cellHeight,
    fill: headerBg,
    originX: 'center',
    originY: 'center',
    rx: 8,
    ry: 8
  });
  elements.push(headerBar);

  // Rows and Cells
  for (let r = 0; r < rows; r++) {
    const rowY = startY + r * cellHeight;
    const isHeader = r === 0;

    // Alternate row zebra tint
    if (!isHeader && r % 2 === 1) {
      const zebra = new Rect({
        left: 0,
        top: rowY + cellHeight / 2,
        width: tableWidth,
        height: cellHeight,
        fill: altCellBg,
        originX: 'center',
        originY: 'center'
      });
      elements.push(zebra);
    }

    // Horizontal divider line
    if (r > 0) {
      const hLine = new Line([startX, rowY, startX + tableWidth, rowY], {
        stroke: borderColor,
        strokeWidth: 1
      });
      elements.push(hLine);
    }

    // Populate cell text
    for (let c = 0; c < cols; c++) {
      const cellX = startX + c * cellWidth + cellWidth / 2;
      const cellTextVal = isHeader 
        ? (headers[c] || `Header ${c + 1}`) 
        : (data[r - 1]?.[c] || `Data ${r},${c + 1}`);

      const cellText = new Textbox(cellTextVal, {
        left: cellX,
        top: rowY + cellHeight / 2,
        fontSize: isHeader ? 13 : 12,
        fontWeight: isHeader ? 'bold' : 'normal',
        fontFamily: 'Inter',
        fill: isHeader ? headerColor : '#1e293b',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        width: cellWidth - 12
      });
      elements.push(cellText);

      // Vertical divider lines
      if (c > 0 && r === 0) {
        const vLine = new Line([startX + c * cellWidth, startY, startX + c * cellWidth, startY + tableHeight], {
          stroke: borderColor,
          strokeWidth: 1
        });
        elements.push(vLine);
      }
    }
  }

  return new Group(elements, {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};
