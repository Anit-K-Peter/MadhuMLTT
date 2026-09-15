# Madhu ML TT — Supported Font Mapping Registry

This document serves as the official registry of font encodings supported by **Madhu ML TT**.

Madhu ML TT converts modern Unicode Malayalam into legacy ML-TT font encodings, allowing web applications to support legacy Malayalam fonts while developers write standard Unicode Malayalam.

---

## Officially Supported Mappings

| Mapping Name | Alias / Brand Name | Vendor / Standard | Source / Reference | License | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`ML-TTKarthika`** | `Karthika`, `default` | GIST / C-DIT Standard | Built-in Default | Open-Source / MIT (Core Engine) | **Verified (Built-in Default)** |
| **`ML-TTRevathi`** | `Revathi` | ISFOC Standard (C-DAC) | [SMC Payyans Map](https://github.com/smc/payyans/blob/master/maps/revathi.map) | GPL-2.0-or-later / LGPL | **Verified** |

---

## `@font-mltt` Resolution Rules & Default Fallback

No mapping specified in `@font-mltt`? Madhu uses the **Karthika** mapping by default.

### 1. Default Mapping (Omitted `mapping:`)
```css
@font-mltt {
  font-family: "MyMalayalamFont";
  src: url("./fonts/my-font.ttf");
}
```
*Behaves internally like `mapping: "Karthika"`.*

### 2. Explicit Built-in Mapping
```css
@font-mltt {
  font-family: "Revathi";
  mapping: "ML-TTRevathi";
  src: url("./fonts/revathi.ttf");
}
```

### 3. Custom File Mapping
```css
@font-mltt {
  font-family: "MyFont";
  mapping: url("./mappings/my-font.json");
  src: url("./fonts/my-font.ttf");
}
```

### Precedence Rule
```
explicit plugin option (e.g. madhuMLTTVite({ mapping: ... }))
    ↓
explicit @font-mltt mapping (declared in CSS)
    ↓
Karthika default
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
