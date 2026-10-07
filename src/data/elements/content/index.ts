import type { ElementContent } from '../../types';
import { CONTENT_001_010 } from './001-010';
import { CONTENT_011_020 } from './011-020';
import { CONTENT_021_030 } from './021-030';
import { CONTENT_031_040 } from './031-040';
import { CONTENT_041_050 } from './041-050';
import { CONTENT_051_060 } from './051-060';
import { CONTENT_061_072 } from './061-072';
import { CONTENT_073_083 } from './073-083';
import { CONTENT_084_094 } from './084-094';
import { CONTENT_095_106 } from './095-106';
import { CONTENT_107_118 } from './107-118';

/** Conteúdo longo de todos os elementos (carregado sob demanda pela interface). */
export const ALL_CONTENT: ElementContent[] = [
  ...CONTENT_001_010,
  ...CONTENT_011_020,
  ...CONTENT_021_030,
  ...CONTENT_031_040,
  ...CONTENT_041_050,
  ...CONTENT_051_060,
  ...CONTENT_061_072,
  ...CONTENT_073_083,
  ...CONTENT_084_094,
  ...CONTENT_095_106,
  ...CONTENT_107_118,
];
