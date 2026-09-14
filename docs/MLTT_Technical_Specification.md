# Technical Specification: ML-TT Malayalam Conversion Engine

**Project:** Madhu ML TT — Malayalam Text Technology Engine  
**Document Version:** 1.0.0  
**Phase:** 1 / Work 1 — Technical Foundation & Mapping Analysis  
**Status:** Complete Specification  

---

## Executive Summary

This document establishes the technical foundation for the **Madhu ML TT Conversion Engine**. Before the widespread adoption of Unicode (ISO/IEC 10646), desktop publishing (DTP) in Malayalam relied on proprietary 8-bit visual font encodings. Among these, the **ML-TT** (Malayalam TrueType) encoding standard developed by C-DAC / GIST and adopted by C-DIT became the dominant standard across Kerala for print software such as Adobe PageMaker, CorelDRAW, and Photoshop.

This specification details the font architecture, glyph mapping schemas, character reordering rules, OpenType characteristics, normalization challenges, and bidirectional conversion algorithms required to transform modern **Unicode Malayalam** into **ML-TT Legacy Encoding** and vice-versa.

---

## 1. Technical Understanding of ML-TT

### 1.1 What ML-TT Stands For
* **ML**: Malayalam (ISO 639-1: `ml`, ISO 639-3: `mal`).
* **TT**: TrueType (referring to TrueType Font format `.ttf`, or the standardized font naming prefix introduced in major Malayalam font series such as `ML-TTKarthika`, `ML-TTRevathi`, `ML-TTAathira`, `ML-TTAmbili`, `ML-TTIndulekha`).

### 1.2 Nature of Encoding
* **Classification**: ML-TT is a **legacy 8-bit glyph encoding convention** (byte-to-glyph visual mapping), **NOT** a standardized character set encoding registered with IANA or Unicode.
* **Mechanism**: In an ML-TT font, standard Latin ASCII keystrokes (e.g., key `A` / `0x41`) are remapped to output Malayalam glyph outlines (e.g., independent vowel `അ`) rather than Latin letters.
* **Rendering Architecture**: The font contains **no OpenType layout tables (GSUB/GPOS)**. All glyph positioning, reordering (e.g., placing left-vowel signs before consonants), and ligature selection must be performed programmatically by the text conversion engine before passing the byte string to the font.

### 1.3 Variants & Cross-Font Compatibility
* **Standard ML-TT Family**: Fonts carrying the `ML-TT*` prefix (e.g., `ML-TTKarthika`, `ML-TTRevathi`, `ML-TTAathira`, `ML-TTAmbili`, `ML-TTAyilya`) follow a unified C-DIT / GIST ISFOC mapping layout.
* **MLW-TT Family**: Variant fonts carrying the `MLW-TT*` prefix (where 'W' signifies Windows / Wide glyph set adjustments) share >98% of the core mapping, with minor variations in rare punctuation characters (`0xFE` dash/hyphen) or decorative symbols.
* **Non-ML-TT Encodings**: Non-ML-TT legacy Malayalam fonts (such as `Manorama`, `Mathrubhumi`, `Panchari`, `Varma`, `Super`, `Matweb`) use completely incompatible ASCII keymaps. The engine MUST NOT treat ML-TT as a universal layout for all non-Unicode Malayalam fonts.

---

## 2. Character Range & Mapping Architecture

ML-TT utilizes 8-bit character codepoints spanning printable ASCII (`0x20`–`0x7E`) and Extended ASCII (`0xA1`–`0xFE`).

```text
+-------------------+--------------------+----------------------------------------+
| Byte Range (Hex)  | Byte Range (Dec)   | Content / Usage                        |
+-------------------+--------------------+----------------------------------------+
| 0x00 - 0x1F       | 0 - 31             | Control characters (Unused)            |
| 0x20              | 32                 | Space                                  |
| 0x21 - 0x2F       | 33 - 47            | Punctuation & Special Symbols          |
| 0x30 - 0x39       | 48 - 57            | Numbers / Digits                       |
| 0x41 - 0x5A       | 65 - 90 (A-Z)      | Independent Vowels & Primary Consonants|
| 0x61 - 0x7A       | 97 - 122 (a-z)     | Secondary Consonants, Matras, Modifiers|
| 0x7B - 0x7E       | 123 - 126          | Subscript Modifiers & Brackets         |
| 0x7F - 0xA0       | 127 - 160          | Unused / Non-breaking space            |
| 0xA1 - 0xFE       | 161 - 254          | Conjunct Ligatures & Chillus           |
+-------------------+--------------------+----------------------------------------+
```

### 2.1 Independent Vowels (സ്വരാക്ഷരങ്ങൾ)

| Unicode Char | Unicode Hex | ML-TT Code | ASCII Char | Description |
| :--- | :--- | :--- | :--- | :--- |
| `അ` | `U+0D05` | `0x41` | `A` | Short A |
| `ആ` | `U+0D06` | `0x42` | `B` | Long AA |
| `ഇ` | `U+0D07` | `0x43` | `C` | Short I |
| `ഈ` | `U+0D08` | `0x43 0x75` | `Cu` | Long II (Combined `ഇ` + `ൗ` sign) |
| `ഉ` | `U+0D09` | `0x44` | `D` | Short U |
| `ഊ` | `U+0D0A` | `0x44 0x75` | `Du` | Long UU (Combined `ഉ` + `ൗ` sign) |
| `ഋ` | `U+0D0B` | `0x45` | `E` | Vocalic R |
| `ഌ` | `U+0D0C` | `0x70` | `p` | Vocalic L |
| `എ` | `U+0D0E` | `0x46` | `F` | Short E |
| `ഏ` | `U+0D0F` | `0x47` | `G` | Long EE |
| `ഐ` | `U+0D10` | `0x73 0x46` | `sF` | AI (Left matra `e` + `എ`) |
| `ഒ` | `U+0D12` | `0x48` | `H` | Short O |
| `ഓ` | `U+0D13` | `0x48 0x6D` | `Hm` | Long OO (Combined `ഒ` + `ാ` sign) |
| `ഔ` | `U+0D14` | `0x48 0x75` | `Hu` | AU (Combined `ഒ` + `ൗ` sign) |

---

### 2.2 Consonants (വ്യഞ്ജനാക്ഷരങ്ങൾ)

#### Ka-Varga (കവർഗ്ഗം)
| Unicode | Hex | ML-TT | ASCII |
| :--- | :--- | :--- | :--- |
| `ക` | `U+0D15` | `0x49` | `I` |
| `ഖ` | `U+0D16` | `0x4A` | `J` |
| `ഗ` | `U+0D17` | `0x4B` | `K` |
| `ഘ` | `U+0D18` | `0x4C` | `L` |
| `ങ` | `U+0D19` | `0x4D` | `M` |

#### Cha-Varga (ചവർഗ്ഗം)
| Unicode | Hex | ML-TT | ASCII |
| :--- | :--- | :--- | :--- |
| `ച` | `U+0D1A` | `0x4E` | `N` |
| `ഛ` | `U+0D1B` | `0x4F` | `O` |
| `ജ` | `U+0D1C` | `0x50` | `P` |
| `ഝ` | `U+0D1D` | `0x51` | `Q` |
| `ഞ` | `U+0D1E` | `0x52` | `R` |

#### Ta-Varga (ടവർഗ്ഗം)
| Unicode | Hex | ML-TT | ASCII |
| :--- | :--- | :--- | :--- |
| `ട` | `U+0D1F` | `0x53` | `S` |
| `ഠ` | `U+0D20` | `0x54` | `T` |
| `ഡ` | `U+0D21` | `0x55` | `U` |
| `ഢ` | `U+0D22` | `0x56` | `V` |
| `ണ` | `U+0D23` | `0x57` | `W` |

#### Tha-Varga (തവർഗ്ഗം)
| Unicode | Hex | ML-TT | ASCII |
| :--- | :--- | :--- | :--- |
| `ത` | `U+0D24` | `0x58` | `X` |
| `ഥ` | `U+0D25` | `0x59` | `Y` |
| `ദ` | `U+0D26` | `0x5A` | `Z` |
| `ധ` | `U+0D27` | `0x5B` | `[` |
| `ന` | `U+0D28` | `0x5C` | `\` |

#### Pa-Varga (പവർഗ്ഗം)
| Unicode | Hex | ML-TT | ASCII |
| :--- | :--- | :--- | :--- |
| `പ` | `U+0D2A` | `0x5D` | `]` |
| `ഫ` | `U+0D2B` | `0x5E` | `^` |
| `ബ` | `U+0D2C` | `0x5F` | `_` |
| `ഭ` | `U+0D2D` | `0x60` | `` ` `` |
| `മ` | `U+0D2E` | `0x61` | `a` |

#### Liquids, Fricatives & Semi-Vowels
| Unicode | Hex | ML-TT | ASCII |
| :--- | :--- | :--- | :--- |
| `യ` | `U+0D2F` | `0x62` | `b` |
| `ര` | `U+0D30` | `0x63` | `c` |
| `റ` | `U+0D31` | `0x64` | `d` |
| `ല` | `U+0D32` | `0x65` | `e` |
| `ള` | `U+0D33` | `0x66` | `f` |
| `ഴ` | `U+0D34` | `0x67` | `g` |
| `വ` | `U+0D35` | `0x68` | `h` |
| `ശ` | `U+0D36` | `0x69` | `i` |
| `ഷ` | `U+0D37` | `0x6A` | `j` |
| `സ` | `U+0D38` | `0x6B` | `k` |
| `ഹ` | `U+0D39` | `0x6C` | `l` |

---

### 2.3 Vowel Signs & Modifiers (സ്വരചിഹ്നങ്ങൾ)

#### Post-Base Matras (Right-Side)
| Unicode | Name | ML-TT Code | ASCII Char | Position in ML-TT Stream |
| :--- | :--- | :--- | :--- | :--- |
| `ാ` | AA Sign | `0x6D` | `m` | After base consonant |
| `ി` | I Sign | `0x6E` | `n` | After base consonant |
| `ീ` | II Sign | `0x6F` | `o` | After base consonant |
| `ു` | U Sign | `0x70` | `p` | After base consonant |
| `ൂ` | UU Sign | `0x71` | `q` | After base consonant |
| `ൃ` | Vocalic R Sign | `0x72` | `r` | After base consonant |
| `ൗ` | AU Sign | `0x75` | `u` | After base consonant |
| `ം` | Anusvara | `0x77` | `w` | After base consonant |
| `ഃ` | Visarga | `0x78` | `x` | After base consonant |
| `്` | Virama / Chandrakkala | `0x76` | `v` | After base consonant |

#### Pre-Base Matras (Left-Side — MUST BE REORDERED)
| Unicode | Name | ML-TT Code | ASCII Char | Position in ML-TT Stream |
| :--- | :--- | :--- | :--- | :--- |
| `െ` | E Sign | `0x73` | `s` | **BEFORE** base consonant |
| `േ` | EE Sign | `0x74` | `t` | **BEFORE** base consonant |
| `ൈ` | AI Sign | `0x73 0x73` | `ss` | **BEFORE** base consonant |

#### Split / Circumfix Matras (Split across Left and Right)
| Unicode | Name | Sequence | ML-TT Stream Order | Example (`ക`) |
| :--- | :--- | :--- | :--- | :--- |
| `ൊ` | O Sign | `െ` + `ാ` | `s` + `[Base]` + `m` | `sIm` |
| `ോ` | OO Sign | `േ` + `ാ` | `t` + `[Base]` + `m` | `tIm` |
| `ൌ` | AU Sign (Legacy) | `െ` + `ൗ` | `s` + `[Base]` + `u` | `sIu` |

---

### 2.4 Subscript Modifiers & Conjunct Ligatures

#### Subscript Modifiers
| Unicode Combination | Description | ML-TT Code | ASCII Char | Position |
| :--- | :--- | :--- | :--- | :--- |
| `്യ` (`്` + `യ`) | Ya-phala | `0x79` | `y` | After base consonant |
| `്വ` (`്` + `വ`) | Va-phala | `0x7A` | `z` | After base consonant |
| `്ര` (`്` + `ര`) | Ra-vattu | `0x7B` | `{` | **BEFORE** base consonant |

---

## 3. Reordering & Transformation Algorithm

### 3.1 Unicode -> ML-TT (Forward Conversion Rules)

1. **Greedy Multi-Character Matching**: Scan input using a greedy search matching conjuncts, chillus, and vowels.
2. **Left-Matra Reordering**:
   - When encountering `െ` (`s`), `േ` (`t`), `ൈ` (`ss`), `്ര` (`{`), or split matras (`ൊ`, `ോ`, `ൌ`):
   - The engine pops the preceding base consonant glyph(s) from the output buffer and inserts the left-matra glyph **in front of** the base consonant.
3. **Repham / Double Modifier Handling**:
   - If a consonant has BOTH a pre-base matra (`െ`/`േ`) AND a Ra-vattu (`്ര`), the stream order becomes:
     `[Left-Matra]` + `[{ Ra-vattu]` + `[Base Consonant]`.

---

### 3.2 ML-TT -> Unicode (Reverse Conversion Rules)

1. **Inverted Table Construction**: Invert the forward mapping dictionary, sorting ASCII keys descending by string length.
2. **Pending Prefix Vowel State Machine**:
   - Maintain a FIFO queue (`pendingPrefixVowels`) for left-side matras (`s`, `t`, `ss`, `{`).
   - When a pre-base matra (`െ`, `േ`, `ൈ`, `്ര`) is encountered, push it to `pendingPrefixVowels`.
   - When a base consonant or conjunct ligature is encountered, append the base symbol to `unicodeResult`, then immediately drain and append all `pendingPrefixVowels`.

---

## 4. Reversibility & Edge Case Handling

1. **Idempotency Guarantee**: For standard Malayalam prose:
   $$\text{mltt2unicode}(\text{unicode2mltt}(T)) \equiv T$$
2. **Atomic vs. Legacy Chillus**:
   - `unicode2mltt` converts both `ൻ` (`U+0D7N`) and `ന+്+ZWJ` to `³` (`0xB3`).
   - `mltt2unicode` deterministically outputs modern Atomic Unicode Chillus (`U+0D7K`–`U+0D7F`).
