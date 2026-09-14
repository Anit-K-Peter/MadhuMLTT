/**
 * Madhu ML TT — Core Reordering and Transformation Engine
 */

export function buildReverseMapping(mapping) {
  const canonicalPriority = {
    'v': '്',
    'À': 'ർ',
    '³': 'ൻ',
    'Â': 'ൽ',
    'Ä': 'ൾ',
    '¬': 'ൺ'
  };

  const reverseMap = {};
  for (const [unicode, ascii] of Object.entries(mapping)) {
    if (canonicalPriority[ascii]) {
      reverseMap[ascii] = canonicalPriority[ascii];
    } else if (!reverseMap[ascii]) {
      reverseMap[ascii] = unicode;
    }
  }

  const sortedKeys = Object.keys(reverseMap).sort((a, b) => b.length - a.length);
  return { reverseMap, sortedKeys };
}

export function unicode2mlttEngine(text, mapping) {
  if (!text) return '';

  let chUnicode;
  let chAscii;
  let index;
  let lenChar;
  let bRepham = 0;
  let asciiText = '';

  for (index = 0; index < text.length; ) {
    let matched = false;
    for (lenChar = 3; lenChar > 0; lenChar--) {
      chUnicode = text.substring(index, index + lenChar);
      if (mapping[chUnicode]) {
        chAscii = mapping[chUnicode];
        matched = true;

        if (chUnicode === 'ൈ') {
          if (bRepham === 1) {
            bRepham = 0;
            asciiText =
              asciiText.substring(0, asciiText.length - 2) +
              chAscii +
              asciiText[asciiText.length - 2] +
              asciiText[asciiText.length - 1];
          } else {
            asciiText =
              asciiText.substring(0, asciiText.length - 1) +
              chAscii +
              asciiText[asciiText.length - 1];
          }
        } else if (chUnicode === 'ോ' || chUnicode === 'ൊ' || chUnicode === 'ൌ') {
          if (bRepham === 1) {
            bRepham = 0;
            asciiText =
              asciiText.substring(0, asciiText.length - 2) +
              chAscii[0] +
              asciiText[asciiText.length - 2] +
              asciiText[asciiText.length - 1] +
              chAscii[1];
          } else {
            asciiText =
              asciiText.substring(0, asciiText.length - 1) +
              chAscii[0] +
              asciiText[asciiText.length - 1] +
              chAscii[1];
          }
        } else if (chUnicode === '്യേ' || chUnicode === '്യെ') {
          bRepham = 0;
          asciiText =
            asciiText.substring(0, asciiText.length - 1) +
            chAscii[0] +
            asciiText[asciiText.length - 1] +
            chAscii[1];
        } else if (chUnicode === 'െ' || chUnicode === 'േ' || chUnicode === '്ര') {
          if (bRepham === 1) {
            asciiText =
              asciiText.substring(0, asciiText.length - 2) +
              chAscii[0] +
              asciiText[asciiText.length - 2] +
              asciiText[asciiText.length - 1];
            bRepham = 0;
          } else {
            asciiText =
              asciiText.substring(0, asciiText.length - 1) +
              chAscii[0] +
              asciiText[asciiText.length - 1];
          }
          if (chUnicode === '്ര') {
            bRepham = 1;
          }
        } else {
          bRepham = 0;
          asciiText += chAscii;
        }

        index += lenChar;
        break;
      }
    }

    if (!matched) {
      asciiText += text[index];
      index++;
      bRepham = 0;
    }
  }

  return asciiText;
}

export function mltt2unicodeEngine(asciiText, reverseMap, sortedKeys) {
  if (!asciiText) return '';

  let unicodeResult = '';
  let index = 0;
  const len = asciiText.length;
  const pendingPrefixVowels = [];

  while (index < len) {
    let matched = false;

    for (const asciiKey of sortedKeys) {
      if (asciiText.startsWith(asciiKey, index)) {
        const unicodeChar = reverseMap[asciiKey];
        matched = true;
        index += asciiKey.length;

        if (['െ', 'േ', 'ൈ', '്ര', 'ൊ', 'ോ', 'ൌ'].includes(unicodeChar)) {
          pendingPrefixVowels.push(unicodeChar);
        } else {
          unicodeResult += unicodeChar;
          while (pendingPrefixVowels.length > 0) {
            unicodeResult += pendingPrefixVowels.shift();
          }
        }
        break;
      }
    }

    if (!matched) {
      unicodeResult += asciiText[index];
      index++;
      while (pendingPrefixVowels.length > 0) {
        unicodeResult += pendingPrefixVowels.shift();
      }
    }
  }

  while (pendingPrefixVowels.length > 0) {
    unicodeResult += pendingPrefixVowels.shift();
  }

  return unicodeResult;
}
