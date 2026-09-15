# Madhu ML TT — Supported Font Mapping Registry

This document serves as the official registry of font encodings supported by **Madhu ML TT**.

Madhu ML TT converts modern Unicode Malayalam into legacy ML-TT font encodings, allowing web applications to support legacy Malayalam fonts while developers write standard Unicode Malayalam.

---

## Officially Supported Mappings

| Mapping Name | Alias / Brand Name | Vendor / Standard | Source / Reference | License | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ML-TTKarthika`** | `Karthika`, `default` | GIST / C-DIT Standard | Built-in Default | Open-Source / MIT (Core Engine) | **Verified (Built-in)** |
| **`ML-TTRevathi`** | `Revathi` | ISFOC Standard (C-DAC) | [SMC Payyans Map](https://github.com/smc/payyans/blob/master/maps/revathi.map) | GPL-2.0-or-later / LGPL | **Verified** |

---

## 1. `ML-TTKarthika` (Default Mapping)

- **Default Font Family Name**: `ML-TTKarthika`
- **Description**: The standard default Malayalam legacy font mapping based on GIST/C-DIT encodings.
- **Bidirectional Support**: Unicode ↔ ML-TT (Forward and Reverse conversion fully supported).

### Programmatic Usage

```javascript
import { createConverter, karthikaMapping } from '@madhu-mltt/core';

// Uses Karthika by default
const converter = createConverter();
const ascii = converter.toMLTT('കേരളത്തിന്റെ സ്വന്തം Coconut');
// Output: "tIcf¯nsâ kz´w Coconut"
```

### CSS Usage (`@font-mltt`)

```css
@font-mltt {
  font-family: "Karthika";
  mapping: "Karthika";
  src: url("./fonts/karthika.ttf");
}
```

---

## 2. `ML-TTRevathi`

- **Default Font Family Name**: `Revathi`
- **Description**: Legacy Malayalam font encoding standard historically used in DTP and printing systems.
- **Source**: [Swathanthra Malayalam Computing (SMC) Payyans](https://github.com/smc/payyans)
- **License**: GNU GPL-2.0-or-later / LGPL
- **Bidirectional Support**: Unicode ↔ ML-TT (Forward and Reverse conversion fully supported).

### Programmatic Usage

```javascript
import { createConverter, revathiMapping } from '@madhu-mltt/core';

const converter = createConverter({ mapping: revathiMapping });
const ascii = converter.toMLTT('കേരളത്തിന്റെ സ്വന്തം Coconut');
// Output: "tIcfXvXns‚ kz¥w Coconut"
```

### CSS Usage (`@font-mltt`)

```css
@font-mltt {
  font-family: "Revathi";
  mapping: "ML-TTRevathi";
  src: url("./fonts/revathi.ttf");
}
```

---

## Programmatic Registry API

`@madhu-mltt/core` exports built-in mapping objects and helper functions to inspect officially supported mappings dynamically:

```javascript
import { getMapping, supportedMappings } from '@madhu-mltt/core';

// Inspect all supported mappings
console.log(Object.keys(supportedMappings));
// ['Karthika', 'ML-TTKarthika', 'Revathi', 'ML-TTRevathi']

// Dynamically resolve a mapping schema by name (case-insensitive)
const schema = getMapping('Revathi');
console.log(schema.name); // "ML-TTRevathi"
```

---

## External & Custom Mappings

Developers can supply custom mappings externally via local JSON files or JavaScript objects without modifying Madhu Core.

### Custom CSS Mapping Reference
```css
@font-mltt {
  font-family: "MyCustomFont";
  mapping: url("./mappings/custom-font-map.json");
  src: url("./fonts/custom-font.ttf");
}
```

### Custom Mapping JSON Format
```json
{
  "name": "MyCustomFontMapping",
  "vendor": "Custom Standard",
  "version": "1.0",
  "mapping": {
    "അ": "A",
    "ആ": "B",
    "ഇ": "C"
  }
}
```

Every mapping supplied to Madhu is validated at build-time using `validateMapping()`.

---

## Note on Font Binaries
Madhu ML TT manages **text transformations and font mapping metadata only**. Font binary files (`.ttf`, `.otf`, `.woff2`) are **not bundled** by Madhu; developers provide their own font files via CSS `src: url(...)` or standard web font loading.
