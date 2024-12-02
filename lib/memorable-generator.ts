export class MemorableGenerator {
  private readonly words = [
    // Common English words...
    'apple', 'book', 'cat', 'dog', 'elephant',
    'fish', 'green', 'house', 'ice', 'jump',
    // ... more words
  ];

  private readonly separators = ['!', '@', '#', '$', '%', '&', '*'];
  private readonly numbers = '0123456789';

  generateMemorable(options: {
    wordCount?: number;
    capitalize?: boolean;
    includeNumbers?: boolean;
    includeSeparators?: boolean;
  } = {}): string {
    const {
      wordCount = 3,
      capitalize = true,
      includeNumbers = true,
      includeSeparators = true
    } = options;

    let words = Array(wordCount).fill(0).map(() => 
      this.words[Math.floor(Math.random() * this.words.length)]
    );

    if (capitalize) {
      words = words.map(w => w[0].toUpperCase() + w.slice(1));
    }

    if (includeSeparators) {
      const separator = this.separators[Math.floor(Math.random() * this.separators.length)];
      words = words.join(separator).split('');
    }

    if (includeNumbers) {
      const number = Array(2).fill(0)
        .map(() => this.numbers[Math.floor(Math.random() * this.numbers.length)])
        .join('');
      words.push(number);
    }

    return words.join('');
  }
} 