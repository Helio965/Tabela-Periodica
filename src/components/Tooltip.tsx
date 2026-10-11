export interface TooltipProps {
  z: number;
  locate: (z: number) => { x: number; y: number; visible: boolean } | null;
}

export function Tooltip(_props: TooltipProps) {
  return null;
}
