import { reactive, ref } from 'vue';

import { TooltipEmojis, TooltipMessages } from '@/constants/tooltipMessages';
import { LetterStatus } from '@/enums/letterStatus';
import { TOOLTIP_MESSAGE } from '@/enums/tooltipMessage';
import type { Tooltip } from '@/types/Tooltip';

export default function useTooltip() {
  let tooltipTimeout: ReturnType<typeof setTimeout>;

  const preventCloseTooltip = ref(false);
  const tooltip = reactive<Tooltip>({
    show: false,
    message: TooltipMessages[TOOLTIP_MESSAGE.INVALID_WORD],
    emoji: TooltipEmojis[TOOLTIP_MESSAGE.INVALID_WORD],
    position: {
      rowIndex: 0,
      cellIndex: 0
    }
  });

  function getTooltipMessageByLetterStatus(status: LetterStatus): TOOLTIP_MESSAGE {
    switch (status) {
      case LetterStatus.NOT_IN_WORD:
        return TOOLTIP_MESSAGE.LETTER_NOT_IN_WORD;
      case LetterStatus.WRONG_PLACE:
        return TOOLTIP_MESSAGE.INCORRECT_LETTER_POSITION;
      default:
        return TOOLTIP_MESSAGE.CORRECT_LETTER_POSITION;
    }
  }
  function triggerTooltip(type: TOOLTIP_MESSAGE, row: number, cell: number) {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
    }
    preventCloseTooltip.value = true;
    tooltip.message = TooltipMessages[type];
    tooltip.emoji = TooltipEmojis[type];
    tooltip.position.rowIndex = row;
    tooltip.position.cellIndex = cell;
    tooltip.show = true;
    tooltipTimeout = setTimeout(() => {
      tooltip.show = false;
    }, 3000);
  }
  function hideTooltip() {
    if (preventCloseTooltip.value) {
      preventCloseTooltip.value = false;
      return;
    }
    tooltip.show = false;
  }

  return {
    tooltip,
    preventCloseTooltip,
    getTooltipMessageByLetterStatus,
    triggerTooltip,
    hideTooltip
  };
}
