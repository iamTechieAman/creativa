import { Group, Textbox, Shadow } from 'fabric';

/**
 * Canva TypeCraft Plugin: 3D Extruded & Stylized Typography Generator
 */
export const createTypeCraftText = ({
  text = 'TYPECRAFT',
  fontSize = 54,
  fontFamily = 'Montserrat',
  fill = '#00F0FF',
  extrudeColor = '#3a0ca3',
  shadowColor = 'rgba(0,0,0,0.4)',
  depth = 8,
  stroke = '#ffffff',
  strokeWidth = 2,
  left = 400,
  top = 400
}) => {
  const elements = [];

  // 1. Build extrusion depth layers
  for (let d = depth; d > 0; d--) {
    const layer = new Textbox(text, {
      left: d * 1.5,
      top: d * 1.5,
      fontSize,
      fontFamily,
      fontWeight: '900',
      fill: extrudeColor,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      selectable: false
    });
    elements.push(layer);
  }

  // 2. Main foreground text
  const frontText = new Textbox(text, {
    left: 0,
    top: 0,
    fontSize,
    fontFamily,
    fontWeight: '900',
    fill,
    stroke,
    strokeWidth,
    textAlign: 'center',
    originX: 'center',
    originY: 'center',
    shadow: new Shadow({
      color: shadowColor,
      blur: 14,
      offsetX: 4,
      offsetY: 6
    })
  });
  elements.push(frontText);

  return new Group(elements, {
    left,
    top,
    originX: 'center',
    originY: 'center'
  });
};
