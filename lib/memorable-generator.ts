interface WordList {
  adjectives: string[];
  nouns: string[];
  verbs: string[];
  connectors: string[];
}

export class MemorableGenerator {
  private readonly wordList: WordList = {
    adjectives: ['happy', 'quick', 'clever', 'brave'],
    nouns: ['fox', 'dog', 'cat', 'bird'],
    verbs: ['jumps', 'runs', 'flies', 'swims'],
    connectors: ['and', 'or', 'with', 'to']
  };

  generateMemorable(minLength: number): string {
    // Implement memorable password generation
    const adj = this.randomWord(this.wordList.adjectives);
    const noun = this.randomWord(this.wordList.nouns);
    const verb = this.randomWord(this.wordList.verbs);
    const number = Math.floor(Math.random() * 100);
    const symbol = '!@#$%^&*'[Math.floor(Math.random() * 8)];

    return `${adj}${noun}${verb}${number}${symbol}`;
  }

  private randomWord(words: string[]): string {
    return words[Math.floor(Math.random() * words.length)];
  }
} 