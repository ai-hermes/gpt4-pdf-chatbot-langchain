import { useSize } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { IHighlight } from '@/types/pdf';
import { group } from '@/utils/pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { HighlightLayer } from './highlight-layer';
import styles from './index.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface IPdfPreviewProps {
  highlights?: IHighlight[];
  src: string;
}

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

export const PdfPreview: React.FC<IPdfPreviewProps> = ({
  highlights = [],
  src,
}) => {
  const [total, setTotal] = useState(1);
  const [width, setWidth] = useState(800);
  const documentRef = useRef();
  const ref = useRef(null);
  const size = useSize(ref);

  const pdf = useMemo(() => {
    if (documentRef.current?.linkService) {
      return documentRef.current.linkService.pdfDocument;
    }
  }, [documentRef.current]);

  const highlightsMap = useMemo(() => {
    return group(highlights);
  }, [highlights]);

  const handleLoadSuccess = ({ numPages }) => {
    setTotal(numPages);
  };

  useEffect(() => {
    if (size) {
      setWidth(size.width);
    }
  }, [size]);

  useEffect(() => {
    if (documentRef.current?.pages) {
      const keys = Object.keys(highlightsMap);

      if (keys.length > 0) {
        const pages = documentRef.current.pages;
        const page = pages[Number(keys[0]) - 1];
        page.scrollIntoView();
      }
    }
  }, [documentRef.current, highlightsMap]);

  return (
    <div className={styles.preview} ref={ref}>
      {size && (
        <Document
          ref={documentRef}
          file={src}
          onLoadSuccess={handleLoadSuccess}
          options={options}
        >
          {Array.from(new Array(total), (el, index) => (
            <Page
              key={index + 1}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer
              width={width}
            >
              {highlightsMap[index + 1] && (
                <HighlightLayer
                  pageNumber={index + 1}
                  pdf={pdf}
                  rects={highlightsMap[index + 1]}
                  width={width}
                ></HighlightLayer>
              )}
            </Page>
          ))}
        </Document>
      )}
    </div>
  );
};
