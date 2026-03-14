import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const BarcodeScanner = ({ onScan, onError }) => {
  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5Qrcode = new Html5Qrcode('barcode-reader');
        html5QrcodeRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            onScan && onScan(decodedText);
            html5Qrcode.stop().catch(() => {});
            setIsScanning(false);
          },
          () => {} // ignore errors during scanning
        );
        setIsScanning(true);
      } catch (err) {
        onError && onError(err.message || 'Failed to start camera');
      }
    };

    startScanner();

    return () => {
      if (html5QrcodeRef.current && html5QrcodeRef.current.isScanning) {
        html5QrcodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="relative">
      <div
        id="barcode-reader"
        ref={scannerRef}
        className="rounded-2xl overflow-hidden bg-black"
        style={{ width: '100%', minHeight: '300px' }}
      />
      {isScanning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-40 border-2 border-saffron rounded-xl relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-saffron rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-saffron rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-saffron rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-saffron rounded-br-lg" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-saffron/50 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
