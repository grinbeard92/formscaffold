import { trimCanvas } from '@/utils/canvasUtils';
import React, { useState, useRef, useEffect } from 'react';

import SignatureCanvas, { SignatureCanvasProps } from 'react-signature-canvas';

interface PropsSignaturePanel {
  onSignatureChange: (trimmedDataUrl: string) => void;
  onReset: () => void;
  props: SignatureCanvasProps;
}

function SignaturePanel({
  onSignatureChange,
  onReset,
  props,
}: PropsSignaturePanel) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [trimmedDataURL, setTrimmedDataURL] = useState<string>('');

  function signatureReset() {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setTrimmedDataURL('');
    onReset();
  }

  function signatureSave() {
    if (sigCanvas.current) {
      const canvas = sigCanvas.current.getCanvas();
      const trimmedUrl = trimCanvas(canvas);
      setTrimmedDataURL(trimmedUrl);
      onSignatureChange(trimmedUrl);
    }
  }

  useEffect(() => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      sigCanvas.current.willReadFrequently = true;
    }
  }, []);

  return (
    <div
      className={'grid h-50 grid-cols-[75%_1fr] grid-rows-[1fr] gap-3 md:h-70'}
    >
      {/* SIGNATURE PAD */}
      <div className={'bg-secondary flex h-50 w-full flex-row rounded-lg'}>
        {trimmedDataURL && trimmedDataURL !== null ? (
          <img className={''} alt='signature' src={trimmedDataURL} />
        ) : (
          <SignatureCanvas ref={sigCanvas} />
        )}
      </div>
      {/* BUTTON PANEL */}
      <div>
        <div className={'flex flex-col'}>
          {!trimmedDataURL && (
            <button
              className={
                'shadow-10 mx-2 my-3 gap-2 rounded-md bg-green-300 p-2 text-xs'
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                signatureSave();
              }}
            >
              Save
            </button>
          )}

          <button
            className={
              'shadow-10 mx-2 my-3 gap-2 rounded-md bg-orange-400 p-2 text-xs'
            }
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              signatureReset();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignaturePanel;
