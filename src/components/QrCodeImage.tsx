import { useQrCode } from '../hooks/useQrCode';

interface QrCodeImageProps {
  url: string;
}

export function QrCodeImage({ url }: QrCodeImageProps) {
  const qrCode = useQrCode(url);

  if (qrCode.status === 'ready') {
    return <img className="qr" src={qrCode.data} alt={`QR code that opens ${url}`} />;
  }
  if (qrCode.status === 'error') {
    return <p className="qr qr--placeholder">{qrCode.message}</p>;
  }
  return <div className="qr qr--placeholder" aria-hidden="true" />;
}
