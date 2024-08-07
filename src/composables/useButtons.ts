import { ref } from 'vue';

import { BUTTON_APPLY, BUTTON_DELETE } from '@/constants/buttons';
import { KeyboardType } from '@/enums/keyboardType';
import { LetterStatus } from '@/enums/letterStatus';
import type { KeyboardButton } from '@/types/KeyboardButton';

const createLetterButton = (symbol: string): KeyboardButton => ({
  symbol,
  type: KeyboardType.LETTER,
  status: LetterStatus.DEFAULT
});
const createServiceButton = (symbol: string): KeyboardButton => ({
  symbol,
  type: KeyboardType.SERVICE,
  status: null
});
const initialButtons = [
  [
    createLetterButton('Й'),
    createLetterButton('Ц'),
    createLetterButton('У'),
    createLetterButton('К'),
    createLetterButton('Е'),
    createLetterButton('Н'),
    createLetterButton('Г'),
    createLetterButton('Ш'),
    createLetterButton('Щ'),
    createLetterButton('З'),
    createLetterButton('Х'),
    createLetterButton('Ъ')
  ],
  [
    createLetterButton('Ф'),
    createLetterButton('Ы'),
    createLetterButton('В'),
    createLetterButton('А'),
    createLetterButton('П'),
    createLetterButton('Р'),
    createLetterButton('О'),
    createLetterButton('Л'),
    createLetterButton('Д'),
    createLetterButton('Ж'),
    createLetterButton('Э')
  ],
  [
    createServiceButton(BUTTON_APPLY),
    createLetterButton('Я'),
    createLetterButton('Ч'),
    createLetterButton('С'),
    createLetterButton('М'),
    createLetterButton('И'),
    createLetterButton('Т'),
    createLetterButton('Ь'),
    createLetterButton('Б'),
    createLetterButton('Ю'),
    createServiceButton(BUTTON_DELETE)
  ]
];

function shouldUpdateStatus(currentStatus: LetterStatus | null, newStatus: LetterStatus): boolean {
  if (newStatus === LetterStatus.CORRECT) return true;
  if (newStatus === LetterStatus.WRONG_PLACE && currentStatus !== LetterStatus.CORRECT) return true;
  return newStatus === LetterStatus.NOT_IN_WORD && currentStatus === LetterStatus.DEFAULT;
}

function updateButton(button: KeyboardButton, newStatus: LetterStatus) {
  if (button.type === KeyboardType.LETTER && shouldUpdateStatus(button.status, newStatus)) {
    button.status = newStatus;
  }
}

export default function useButtons() {
  const buttons = ref<KeyboardButton[][]>(initialButtons);

  const updateButtonStatus = (symbol: string, newStatus: LetterStatus) => {
    for (const row of buttons.value) {
      for (const button of row) {
        if (button.symbol === symbol) {
          updateButton(button, newStatus);
        }
      }
    }
  };

  const resetButtons = () => {
    buttons.value = initialButtons.map((row) => row.map((button) => ({ ...button })));
  };

  return { buttons, updateButtonStatus, resetButtons };
}
