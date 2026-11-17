import QRCode from 'qrcode';

const QR_DARK = '#0d0d0d';
const QR_LIGHT = '#f7f7f7';
const QR_QUIET_ZONE_MODULES = 2;

/** Renders the QR code locally as an SVG data URL, so no third-party service sees poll links. */
export async function renderQrCodeDataUrl(text: string): Promise<string> {
  const svg = await QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: QR_QUIET_ZONE_MODULES,
    color: { dark: QR_DARK, light: QR_LIGHT },
  });
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
