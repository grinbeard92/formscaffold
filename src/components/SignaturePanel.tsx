import React, { useState, useRef, useEffect } from 'react';

import SignatureCanvas from 'react-signature-canvas';

interface PropsSignaturePanel {
  onSignatureChange: (trimmedDataUrl: string) => void;
  onReset: () => void;
}
function SignaturePanel({ onSignatureChange, onReset }: PropsSignaturePanel) {
  const sigCanvas = useRef(null);
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);

  function signatureReset() {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
    setTrimmedDataURL(null);
    onReset();
  }

  function signatureSave() {
    if (sigCanvas.current) {
      const trimmedUrl = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL('image/png');
      setTrimmedDataURL(trimmedUrl);
      onSignatureChange(trimmedUrl);
    }
  }

  // Clear signature pad on mount and set WillReadFrequently to true
  useEffect(() => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      sigCanvas.current.willReadFrequently = true;
    }
  }, []);

  return (
    <div className={'m-2 flex flex-row rounded-lg border-1 p-2'}>
      {/* SIGNATURE PAD */}
      <div className={'flex w-full'}>
        {trimmedDataURL && trimmedDataURL !== null ? (
          <img className={''} alt='signature' src={trimmedDataURL} />
        ) : (
          <SignatureCanvas
            canvasProps={{
              className: 'shadow-3 w-full',
            }}
            ref={sigCanvas}
          />
        )}
      </div>
      {/* BUTTON PANEL */}
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
  );
}

export default SignaturePanel;
