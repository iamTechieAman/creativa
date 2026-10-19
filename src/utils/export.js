import { jsPDF } from 'jspdf';
import { StaticCanvas } from 'fabric';

/**
 * Cleanly exports the canvas stage area without selection overlays or viewport offsets
 */
export const exportCanvasAsImage = ({
  canvas,
  format = 'png',
  quality = 0.95,
  multiplier = 2,
  transparent = false,
  canvasWidth,
  canvasHeight
}) => {
  if (!canvas) return null;

  // Deselect any active object to avoid exporting bounding boxes/handles
  const active = canvas.getActiveObject();
  canvas.discardActiveObject();

  // Remember current viewport transform & background
  const originalTransform = [...canvas.viewportTransform];
  const originalBg = canvas.backgroundColor;

  if (transparent && format === 'png') {
    canvas.backgroundColor = null;
  }

  // Reset transform to 1:1 for export
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const dataURL = canvas.toDataURL({
    format: format === 'jpg' ? 'jpeg' : format,
    quality: quality,
    multiplier: multiplier,
    left: 0,
    top: 0,
    width: canvasWidth,
    height: canvasHeight
  });

  // Restore state
  canvas.backgroundColor = originalBg;
  canvas.setViewportTransform(originalTransform);
  if (active) {
    canvas.setActiveObject(active);
  }
  canvas.requestRenderAll();

  return dataURL;
};

export const downloadDataUrl = (dataURL, filename) => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportCanvasAsSVG = ({ canvas, canvasWidth, canvasHeight, filename = 'design.svg' }) => {
  if (!canvas) return;

  const active = canvas.getActiveObject();
  canvas.discardActiveObject();

  const originalTransform = [...canvas.viewportTransform];
  canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

  const svgMarkup = canvas.toSVG({
    viewBox: {
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight
    },
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`
  });

  canvas.setViewportTransform(originalTransform);
  if (active) {
    canvas.setActiveObject(active);
  }
  canvas.requestRenderAll();

  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  URL.revokeObjectURL(url);
};

/**
 * Multi-page PDF Export: Renders all pages or single active page into a single PDF document
 */
export const exportCanvasAsPDF = async ({
  canvas,
  canvasWidth,
  canvasHeight,
  filename = 'design.pdf',
  multiplier = 2,
  pages = [],
  activePageIndex = 0,
  exportAllPages = false
}) => {
  if (!canvas) return;

  const orientation = canvasWidth > canvasHeight ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format: [canvasWidth, canvasHeight]
  });

  if (!exportAllPages || !pages || pages.length <= 1) {
    // Single page export
    const dataURL = exportCanvasAsImage({
      canvas,
      format: 'jpg',
      quality: 0.95,
      multiplier,
      canvasWidth,
      canvasHeight
    });
    if (!dataURL) return;
    pdf.addImage(dataURL, 'JPEG', 0, 0, canvasWidth, canvasHeight);
    pdf.save(filename);
    return;
  }

  // Multi-page export using Fabric StaticCanvas
  const offscreenCanvasEl = document.createElement('canvas');
  offscreenCanvasEl.width = canvasWidth;
  offscreenCanvasEl.height = canvasHeight;
  const tempStaticCanvas = new StaticCanvas(offscreenCanvasEl, {
    width: canvasWidth,
    height: canvasHeight
  });

  for (let i = 0; i < pages.length; i++) {
    let imgDataUrl;
    if (i === activePageIndex) {
      imgDataUrl = exportCanvasAsImage({
        canvas,
        format: 'jpg',
        quality: 0.95,
        multiplier,
        canvasWidth,
        canvasHeight
      });
    } else {
      const page = pages[i];
      tempStaticCanvas.clear();
      tempStaticCanvas.backgroundColor = page.backgroundColor || '#ffffff';
      if (page.canvasData) {
        await tempStaticCanvas.loadFromJSON(page.canvasData);
      }
      tempStaticCanvas.requestRenderAll();
      imgDataUrl = tempStaticCanvas.toDataURL({
        format: 'jpeg',
        quality: 0.95,
        multiplier
      });
    }

    if (i > 0) {
      pdf.addPage([canvasWidth, canvasHeight], orientation);
    }
    if (imgDataUrl) {
      pdf.addImage(imgDataUrl, 'JPEG', 0, 0, canvasWidth, canvasHeight);
    }
  }

  tempStaticCanvas.dispose();
  pdf.save(filename);
};
