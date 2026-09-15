# @madhu-mltt/css

CSS parser and `@font-mltt` transformer for Madhu ML TT.

## Features
- Parse `@font-mltt` custom CSS at-rules.
- Extract font family, mapping declarations, and font descriptors (`src`, `font-weight`, `font-style`, `font-display`).
- Transform `@font-mltt` into standard `@font-face` CSS.
- Framework-agnostic and lightweight.

## `@font-mltt` Mapping Resolution Rules

### 1. Default Mapping (Omitted `mapping:`)
No mapping specified? Madhu uses the **Karthika** mapping by default.

```css
@font-mltt {
  font-family: "MyMalayalamFont";
  src: url("./fonts/my-font.ttf");
}
```

### 2. Explicit Built-in Mapping
Specify an officially supported built-in mapping name (e.g. `"ML-TTRevathi"`):

```css
@font-mltt {
  font-family: "Revathi";
  mapping: "ML-TTRevathi";
  src: url("./fonts/revathi.ttf");
}
```

### 3. Custom File Mapping
Reference a local JSON mapping file path:

```css
@font-mltt {
  font-family: "MyFont";
  mapping: url("./mappings/my-font.json");
  src: url("./fonts/my-font.ttf");
}
```

## Resolution Precedence
```
explicit plugin option (e.g. madhuMLTTVite({ mapping: ... }))
    ↓
explicit @font-mltt mapping (declared in CSS)
    ↓
Karthika default
```
