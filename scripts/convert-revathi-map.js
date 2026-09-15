/**
 * Converter script: Normalizes SMC Payyans revathi.map into Madhu ML-TT JSON Mapping Schema.
 */

import fs from 'node:fs';
import path from 'node:path';
import { validateMapping } from '../src/factory.js';

const rawMapText = `
A=അ
B=ആ
C=ഇ
D=ഉ
E=ഋ
F=എ
G=ഏ
H=ഒ
I=ക
J=ഖ
K=ഗ
L=ഘ
M=ങ
N=ച
O=ഛ
P=ജ
Q=ഝ
R=ഞ
S=ട
T=ഠ
U=ഡ
V=ഢ
W=ണ
X=ത
Y=ഥ
Z=ദ
[=ധ
\\=ന
]=പ
^=ഫ
_=ബ
\`=ഭ
a=മ
b=യ
c=ര
d=റ
e=ല
f=ള
g=ഴ
h=വ
i=ശ
j=ഷ
k=സ
l=ഹ
m=ാ
n=ി
o=ീ
p=ു
q=ൂ
r=ൃ
s=െ
t=േ
u=ൗ
v=്
w=ം
x=ഃ
y=്യ
z=്വ
{=്ര
‚=ന്റ
ƒ=ള്‍
„=ഷ്ട
…=സ്ല
‡=ക്ത
‰=റ്റ
‹=ഗ്മ
Œ=ക്ട
™=ഞ്ഞ
›=ശ്ച
œ=ബ്ധ
Ÿ=ന്ഥ
¡=ററ
¢=ക്ല
£=ക്ഷ
¤=ത്ഭ
¥=ന്ത
§=ഗ്ഗ
¨=ണ്‍
©=ഞ്ച
ª=ബ്ല
«=ശ
`;

function buildMadhuRevathiMapping() {
  const mappingDict = {};

  const lines = rawMapText.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const asciiChar = trimmed.slice(0, eqIdx);
    const unicodeChar = trimmed.slice(eqIdx + 1);

    if (unicodeChar && asciiChar) {
      mappingDict[unicodeChar] = asciiChar;
    }
  }

  // Derived composite vowels and matra pairs for ML-TT standard
  mappingDict['ഈ'] = 'Cu';  // C (ഇ) + u (ൗ/ീ modifier in ISFOC)
  mappingDict['ഊ'] = 'Du';  // D (ഉ) + u
  mappingDict['ഓ'] = 'Hm';  // H (ഒ) + m (ാ)
  mappingDict['ഔ'] = 'Hu';  // H (ഒ) + u
  mappingDict['ഐ'] = 'sF';  // s (െ) + F (എ)
  mappingDict['ൈ'] = 'ss';  // double e-matra
  mappingDict['ൊ'] = 'sm';  // e-matra + aa-matra
  mappingDict['ോ'] = 'tm';  // ee-matra + aa-matra
  mappingDict['ൌ'] = 'su';  // e-matra + au-length mark

  // Normalize chillu character variations (Atomic vs Virama + ZWJ)
  mappingDict['ൺ'] = mappingDict['ണ്‍'] || '¨';
  mappingDict['ൻ'] = mappingDict['ന്‍'] || '³';
  mappingDict['ർ'] = mappingDict['ര്‍'] || 'À';
  mappingDict['ൽ'] = mappingDict['ല്‍'] || 'Â';
  mappingDict['ൾ'] = mappingDict['ള്‍'] || 'ƒ';

  const schema = {
    name: 'ML-TTRevathi',
    vendor: 'Swathanthra Malayalam Computing (SMC) Payyans Map',
    version: '1.0',
    license: 'GPL-2.0-or-later / LGPL-2.1-or-later',
    source: 'https://github.com/smc/payyans/blob/master/maps/revathi.map',
    mapping: mappingDict
  };

  const validation = validateMapping(schema);
  if (!validation.valid) {
    throw new Error('Revathi mapping schema validation failed: ' + validation.errors.join(', '));
  }

  return schema;
}

const revathiSchema = buildMadhuRevathiMapping();
const outDir = path.join(process.cwd(), 'mappings', 'revathi');
fs.mkdirSync(outDir, { recursive: true });

fs.writeFileSync(
  path.join(outDir, 'mapping.json'),
  JSON.stringify(revathiSchema, null, 2),
  'utf-8'
);

console.log(`[SUCCESS]: Revathi mapping JSON created cleanly with ${Object.keys(revathiSchema.mapping).length} character pairs!`);
