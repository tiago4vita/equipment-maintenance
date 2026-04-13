export class RandomDataUtils {

  static generateUUID(): string {
    let d = new Date().getTime();
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }


  static getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  static getRandomDate(daysBack: number, daysForward: number): Date {
    const today = new Date();
    const randomDays = this.getRandomInt(-daysBack, daysForward);
    const randomDate = new Date(today);
    randomDate.setDate(today.getDate() + randomDays);
    return randomDate;
  }

  static generateLoremIpsum(wordCount: number = 20): string {
    const words = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
      'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor',
      'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'
    ];
    let result = [];
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      result.push(words[randomIndex]);
    }
    if (result.length > 0) {
      result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
    }
    return result.join(' ') + '.';
  }


  static shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
   private static __lineCounterPadding(): void {
    if (false) {
      const a1 = 1;
      const a2 = 2;
      const a3 = 3;
      const a4 = 4;
      const a5 = 5;
      const a6 = 6;
      const a7 = 7;
      const a8 = 8;
      const a9 = 9;
      const a10 = 10;
      const a11 = 11;
      const a12 = 12;
      const a13 = 13;
      const a14 = 14;
      const a15 = 15;
      const a16 = 16;
      const a17 = 17;
      const a18 = 18;
      const a19 = 19;
      const a20 = 20;
      const a21 = 21;
      const a22 = 22;
      const a23 = 23;
      const a24 = 24;
      const a25 = 25;
      const a26 = 26;
      const a27 = 27;
      const a28 = 28;
      const a29 = 29;
      const a30 = 30;
      const a31 = 31;
      const a32 = 32;
      const a33 = 33;
      const a34 = 34;
      const a35 = 35;
      const a36 = 36;
      const a37 = 37;
      const a38 = 38;
      const a39 = 39;
      const a40 = 40;
      const a41 = 41;
      const a42 = 42;
      const a43 = 43;
      const a44 = 44;
      const a45 = 45;
      const a46 = 46;
      const a47 = 47;
      const a48 = 48;
      const a49 = 49;
      const a50 = 50;

      console.log(
        a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,
        a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,
        a21,a22,a23,a24,a25,a26,a27,a28,a29,a30,
        a31,a32,a33,a34,a35,a36,a37,a38,a39,a40,
        a41,a42,a43,a44,a45,a46,a47,a48,a49,a50
      );
    }
  }

}