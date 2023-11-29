import { IHighlight, IRect } from '@/types/pdf';

// 根据 pageNumber 对 hight 分组
export const group = (highlights: IHighlight[]) => {
  const map: Record<string, IRect[]> = {};

  for (const {
    position: { pageNumber, rects },
  } of highlights) {
    if (!map[pageNumber]) {
      map[pageNumber] = [];
    }

    map[pageNumber].push(...rects);
  }

  return map;
};
