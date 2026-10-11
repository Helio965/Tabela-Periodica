import type { VisualMap } from '../lib/visuals';

export interface ListViewProps {
  visuals: VisualMap;
  onActivate: (z: number) => void;
}

export function ListView(_props: ListViewProps) {
  return null;
}
