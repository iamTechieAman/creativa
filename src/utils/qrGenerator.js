import QRCode from 'qrcode';

export const generateQRCodeDataUrl = async (text, options = {}) => {
  const {
    darkColor = '#000000',
    lightColor = '#ffffff',
    width = 320,
    margin = 2
  } = options;

  try {
    const dataURL = await QRCode.toDataURL(text || 'https://creativa.design', {
      width,
      margin,
      color: {
        dark: darkColor,
        light: lightColor
      },
      errorCorrectionLevel: 'H'
    });
    return dataURL;
  } catch (err) {
    console.error('Failed to generate QR Code:', err);
    throw err;
  }
};
