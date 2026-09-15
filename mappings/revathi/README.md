# ML-TTRevathi Mapping Specification

## Metadata
- **Mapping Name**: `ML-TTRevathi`
- **Vendor / Standard**: ISFOC Revathi Standard (C-DAC / SMC Map)
- **Source Repository**: [Swathanthra Malayalam Computing (SMC) Payyans](https://github.com/smc/payyans/blob/master/maps/revathi.map)
- **Authors**: Santhosh Thottingal, Nishan Naseer, Rajeesh K Nambiar
- **License**: GNU General Public License v2+ (GPL-2.0-or-later) / LGPL (Swathanthra Malayalam Computing)
- **Status**: Verified Madhu ML TT Mapping

## Overview
`ML-TTRevathi` is a verified mapping for legacy Revathi font encodings. It maps modern Unicode Malayalam characters into ML-TT Revathi ASCII character combinations.

## Bidirectional Support
- **Forward Conversion (Unicode → ML-TTRevathi)**: Fully supported with automatic matra reordering, chillu handling, and English/ASCII preservation.
- **Reverse Conversion (ML-TTRevathi → Unicode)**: Fully supported using reverse map dictionary lookup with LRU caching.

## Usage with `@font-mltt`

```css
@font-mltt {
  font-family: "Revathi";
  mapping: "ML-TTRevathi";
  src: url("./fonts/revathi.ttf");
}
```

```jsx
export default function App() {
  return (
    <main>
      <h1>കേരളത്തിന്റെ സ്വന്തം Coconut</h1>
      <p>നാടൻ Coconut Oil</p>
    </main>
  );
}
```

## Known Limitations
- Standard ISFOC Revathi font files must be provided by the developer (`src: url(...)`). Madhu does not bundle font binaries.
- Complex rare ligatures rely on standard ASCII character combination fallbacks if not mapped directly by the font glyph set.
