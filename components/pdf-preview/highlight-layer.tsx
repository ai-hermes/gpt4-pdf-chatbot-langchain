import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import React, { useEffect, useState } from 'react';

import { IRect } from '@/types/pdf';

export interface Viewport {
  convertToPdfPoint: (x: number, y: number) => Array<number>;
  convertToViewportRectangle: (pdfRectangle: Array<number>) => Array<number>;
  width: number;
  height: number;
}

export const scaledToViewport = (
  scaled: IRect,
  viewport: { width: number, height: number },
) => {
  const x1 = (viewport.width * scaled.x1) / scaled.width;
  const y1 = (viewport.height * scaled.y1) / scaled.height;

  const x2 = (viewport.width * scaled.x2) / scaled.width;
  const y2 = (viewport.height * scaled.y2) / scaled.height;

  return {
    left: x1,
    top: y1,
    width: x2 - x1,
    height: y2 - y1,
    pageNumber: scaled.pageNumber,
  };
};

interface IHighlightLayerProps {
  pageNumber: number;
  pdf: PDFDocumentProxy;
  rects: IRect[];
  width: number;
}

export const HighlightLayer: React.FC<IHighlightLayerProps> = ({ pdf, pageNumber, rects, width }) => {
  const [page, setPage] = useState<PDFPageProxy>()

  useEffect(() => {
    if (pdf) {
      pdf.getPage(pageNumber).then(page => setPage(page))
    }
  }, [pageNumber, pdf])

  if (!page) {
    return null
  }

  const viewport = page.getViewport({ scale: 1 })
  const height = width * viewport.height / viewport.width;
  const highlights = rects.map(item => scaledToViewport(item, { width, height }))

  return (
    <>
      {highlights.map(item => (
        <span className="highlight" style={item} />
      ))}
    </>
  );
};
