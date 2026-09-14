#!/usr/bin/env python3
"""
Madhu ML TT — Font Rendering & Glyph Mapping Verification
Verifies that output ML-TT ASCII codepoints map directly to valid glyphs in Fonts/ML_TT_Karthika_Normal.ttf
"""

import os
from fontTools.ttLib import TTFont

font_path = os.path.join(os.path.dirname(__file__), '../Fonts/ML_TT_Karthika_Normal.ttf')
print(f'Loading reference font: {font_path}')

font = TTFont(font_path)
cmap = font.getBestCmap()

sample_ascii_tokens = ['\\akvImcw', 'aebmfw', 'tIcfw', 'kzX{´w', '{io', '{]hÀ¯\\w', 'C´y', '`mj', '\\µn']

print('====================================================')
print('FONT GLYPH CORRESPONDENCE VERIFICATION')
print('====================================================')

total_chars = 0
valid_glyphs = 0

for token in sample_ascii_tokens:
    glyphs = []
    for char in token:
        cp = ord(char)
        total_chars += 1
        if cp in cmap:
            valid_glyphs += 1
            glyphs.append(f'{char}({cmap[cp]})')
        else:
            glyphs.append(f'{char}(MISSING)')
    print(f'Token: {token:15s} -> Glyphs: {" ".join(glyphs)}')

print('----------------------------------------------------')
print(f'Glyph Verification Rate: {valid_glyphs}/{total_chars} ({valid_glyphs/total_chars*100:.1f}%)')
print('====================================================')
