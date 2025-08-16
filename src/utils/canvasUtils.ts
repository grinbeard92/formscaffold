export function trimCanvas(canvas: HTMLCanvasElement): string {
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
    throw new Error('Invalid canvas element provided');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const canvasImage = cropImageFromCanvas(ctx);

  return canvasImage;
}

export function cropImageFromCanvas(ctx: CanvasRenderingContext2D) {
  const canvas = ctx.canvas,
    pix = { x: [], y: [] },
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let w: number = canvas.width,
    h: number = canvas.height,
    x: number,
    y: number,
    index: number;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index + 3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }
    }
  }
  pix.x.sort(function (a, b) {
    return a - b;
  });
  pix.y.sort(function (a, b) {
    return a - b;
  });
  const n = pix.x.length - 1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];
  const cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);

  return canvas.toDataURL('image/png');
}
