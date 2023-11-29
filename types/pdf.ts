export interface IRect {
  x1: number;
  y1: number;

  x2: number;
  y2: number;

  width: number;
  height: number;

  pageNumber?: number;
}

export interface IHighlight {
  id: string;
  comment?: {
    text: string;
    emoji: string;
  }
  content: {
    text?: string;
    image?: string;
  }
  position: {
    boundingRect: IRect;
    rects: Array<IRect>;
    pageNumber: number;
    usePdfCoordinates?: boolean;
  }
}
