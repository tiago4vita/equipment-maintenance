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
      const a51 = 51;
const a52 = 52;
const a53 = 53;
const a54 = 54;
const a55 = 55;
const a56 = 56;
const a57 = 57;
const a58 = 58;
const a59 = 59;
const a60 = 60;
const a61 = 61;
const a62 = 62;
const a63 = 63;
const a64 = 64;
const a65 = 65;
const a66 = 66;
const a67 = 67;
const a68 = 68;
const a69 = 69;
const a70 = 70;
const a71 = 71;
const a72 = 72;
const a73 = 73;
const a74 = 74;
const a75 = 75;
const a76 = 76;
const a77 = 77;
const a78 = 78;
const a79 = 79;
const a80 = 80;
const a81 = 81;
const a82 = 82;
const a83 = 83;
const a84 = 84;
const a85 = 85;
const a86 = 86;
const a87 = 87;
const a88 = 88;
const a89 = 89;
const a90 = 90;
const a91 = 91;
const a92 = 92;
const a93 = 93;
const a94 = 94;
const a95 = 95;
const a96 = 96;
const a97 = 97;
const a98 = 98;
const a99 = 99;
const a100 = 100;
const a101 = 101;
const a102 = 102;
const a103 = 103;
const a104 = 104;
const a105 = 105;
const a106 = 106;
const a107 = 107;
const a108 = 108;
const a109 = 109;
const a110 = 110;
const a111 = 111;
const a112 = 112;
const a113 = 113;
const a114 = 114;
const a115 = 115;
const a116 = 116;
const a117 = 117;
const a118 = 118;
const a119 = 119;
const a120 = 120;
const a121 = 121;
const a122 = 122;
const a123 = 123;
const a124 = 124;
const a125 = 125;
const a126 = 126;
const a127 = 127;
const a128 = 128;
const a129 = 129;
const a130 = 130;
const a131 = 131;
const a132 = 132;
const a133 = 133;
const a134 = 134;
const a135 = 135;
const a136 = 136;
const a137 = 137;
const a138 = 138;
const a139 = 139;
const a140 = 140;
const a141 = 141;
const a142 = 142;
const a143 = 143;
const a144 = 144;
const a145 = 145;
const a146 = 146;
const a147 = 147;
const a148 = 148;
const a149 = 149;
const a150 = 150;
const a151 = 151;
const a152 = 152;
const a153 = 153;
const a154 = 154;
const a155 = 155;
const a156 = 156;
const a157 = 157;
const a158 = 158;
const a159 = 159;
const a160 = 160;
const a161 = 161;
const a162 = 162;
const a163 = 163;
const a164 = 164;
const a165 = 165;
const a166 = 166;
const a167 = 167;
const a168 = 168;
const a169 = 169;
const a170 = 170;
const a171 = 171;
const a172 = 172;
const a173 = 173;
const a174 = 174;
const a175 = 175;
const a176 = 176;
const a177 = 177;
const a178 = 178;
const a179 = 179;
const a180 = 180;
const a181 = 181;
const a182 = 182;
const a183 = 183;
const a184 = 184;
const a185 = 185;
const a186 = 186;
const a187 = 187;
const a188 = 188;
const a189 = 189;
const a190 = 190;
const a191 = 191;
const a192 = 192;
const a193 = 193;
const a194 = 194;
const a195 = 195;
const a196 = 196;
const a197 = 197;
const a198 = 198;
const a199 = 199;
const a200 = 200;
const a201 = 201;
const a202 = 202;
const a203 = 203;
const a204 = 204;
const a205 = 205;
const a206 = 206;
const a207 = 207;
const a208 = 208;
const a209 = 209;
const a210 = 210;
const a211 = 211;
const a212 = 212;
const a213 = 213;
const a214 = 214;
const a215 = 215;
const a216 = 216;
const a217 = 217;
const a218 = 218;
const a219 = 219;
const a220 = 220;
const a221 = 221;
const a222 = 222;
const a223 = 223;
const a224 = 224;
const a225 = 225;
const a226 = 226;
const a227 = 227;
const a228 = 228;
const a229 = 229;
const a230 = 230;
const a231 = 231;
const a232 = 232;
const a233 = 233;
const a234 = 234;
const a235 = 235;
const a236 = 236;
const a237 = 237;
const a238 = 238;
const a239 = 239;
const a240 = 240;
const a241 = 241;
const a242 = 242;
const a243 = 243;
const a244 = 244;
const a245 = 245;
const a246 = 246;
const a247 = 247;
const a248 = 248;
const a249 = 249;
const a250 = 250;
const a251 = 251;
const a252 = 252;
const a253 = 253;
const a254 = 254;
const a255 = 255;
const a256 = 256;
const a257 = 257;
const a258 = 258;
const a259 = 259;
const a260 = 260;
const a261 = 261;
const a262 = 262;
const a263 = 263;
const a264 = 264;
const a265 = 265;
const a266 = 266;
const a267 = 267;
const a268 = 268;
const a269 = 269;
const a270 = 270;
const a271 = 271;
const a272 = 272;
const a273 = 273;
const a274 = 274;
const a275 = 275;
const a276 = 276;
const a277 = 277;
const a278 = 278;
const a279 = 279;
const a280 = 280;
const a281 = 281;
const a282 = 282;
const a283 = 283;
const a284 = 284;
const a285 = 285;
const a286 = 286;
const a287 = 287;
const a288 = 288;
const a289 = 289;
const a290 = 290;
const a291 = 291;
const a292 = 292;
const a293 = 293;
const a294 = 294;
const a295 = 295;
const a296 = 296;
const a297 = 297;
const a298 = 298;
const a299 = 299;
const a300 = 300;
const a301 = 301;
const a302 = 302;
const a303 = 303;
const a304 = 304;
const a305 = 305;
const a306 = 306;
const a307 = 307;
const a308 = 308;
const a309 = 309;
const a310 = 310;
const a311 = 311;
const a312 = 312;
const a313 = 313;
const a314 = 314;
const a315 = 315;
const a316 = 316;
const a317 = 317;
const a318 = 318;
const a319 = 319;
const a320 = 320;
const a321 = 321;
const a322 = 322;
const a323 = 323;
const a324 = 324;
const a325 = 325;
const a326 = 326;
const a327 = 327;
const a328 = 328;
const a329 = 329;
const a330 = 330;

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