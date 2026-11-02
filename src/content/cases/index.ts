import { CaseDef } from '../../types/game';
import { CASE_1 } from './case1';
import { CASE_2 } from './case2';
import { CASE_3 } from './case3';
import { CASE_4 } from './case4';
import { CASE_5 } from './case5';

export const ALL_CASES: Record<string, CaseDef> = {
  case_1: CASE_1,
  case_2: CASE_2,
  case_3: CASE_3,
  case_4: CASE_4,
  case_5: CASE_5,
};

export const CASE_LIST: CaseDef[] = [CASE_1, CASE_2, CASE_3, CASE_4, CASE_5];
