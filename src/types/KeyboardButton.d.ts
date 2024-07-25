import { LetterStatus } from '@/enums/letterStatus';
import type { KeyboardType } from '@/enums/keyboardType';

export type KeyboardButton = {
  symbol: string;
  type: KeyboardType;
  status: LetterStatus | null;
};
