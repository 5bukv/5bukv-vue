import type { ProposedLetter } from '@/types/ProposedLetter';
import { LetterStatus } from '@/enums/letterStatus';
import words from '@/data/words';
import { RoundStatus } from '@/enums/roundStatus';
import generateYoCombinations from '@/libs/generateYoCombinations';
import replaceYo from '@/libs/replaceYo';

function reduceWord(proposedWord: ProposedLetter[]): string {
  return proposedWord.reduce((previousValue, currentValue) => {
    return previousValue + currentValue.letter;
  }, '');
}
function checkWordExist(word: string) {
  const combinations = generateYoCombinations(word);
  return combinations.some((combination) => words.includes(combination));
}

export default function compareWords(
  proposedWord: ProposedLetter[],
  secretWord: string
): { status: RoundStatus; proposedWord: ProposedLetter[] } {
  const isWordExist = checkWordExist(reduceWord(proposedWord));
  const normalizedSecretWord = replaceYo(secretWord);

  if (!isWordExist) {
    return { status: RoundStatus.NOT_FOUND, proposedWord };
  }

  const secretWordArray: Array<string | null> = normalizedSecretWord.split('');

  const result: ProposedLetter[] = proposedWord.map((letterObj) => ({
    ...letterObj,
    status: LetterStatus.NOT_IN_WORD
  }));

  for (let i = 0; i < proposedWord.length; i++) {
    if (proposedWord[i].letter === secretWordArray[i]) {
      result[i].status = LetterStatus.CORRECT;
      secretWordArray[i] = null;
    }
  }

  for (let i = 0; i < proposedWord.length; i++) {
    if (result[i].status === LetterStatus.CORRECT) {
      continue;
    }
    const letterIndex = secretWordArray.indexOf(proposedWord[i].letter);
    if (letterIndex !== -1) {
      result[i].status = LetterStatus.WRONG_PLACE;
      secretWordArray[letterIndex] = null;
    }
  }

  return {
    status: result.every((letter) => letter.status === LetterStatus.CORRECT)
      ? RoundStatus.WIN
      : RoundStatus.NOT_GUESSED,
    proposedWord: result
  };
}
