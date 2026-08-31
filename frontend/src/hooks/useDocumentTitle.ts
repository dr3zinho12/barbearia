import { useEffect } from 'react';
import { brand } from '../config/brand';

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · ${brand.name}`;
  }, [title]);
}
