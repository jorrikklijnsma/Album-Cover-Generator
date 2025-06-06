// src/utils/placeholderVariants.ts
export const placeholderVariants = {
  VISUAL_CONCEPT: [
    'a shattered mirror reflecting multiple fragments of the same figure',
    'an abandoned shopping cart in an empty supermarket aisle at night',
    'a small golden throne with disconnected puppet strings hanging above it',
    'an industrial skyline with factory smokestacks against a dramatic sky',
    'a handwritten list with all items crossed out except one word at the bottom',
    'urban street signs showing different directions at a nighttime intersection',
    'a vintage clock with broken face and exposed mechanical interior',
    'surreal floating objects arranged in ritualistic circular pattern',
    'a solitary figure silhouetted against vibrant geometric patterns',
    'ordinary household objects arranged in impossible architectural formations',
  ],
  TEXT_PLACEMENT: [
    'centered boldly across the image',
    'integrated into the environment as if physically present in the scene',
    'appearing as if scratched directly into the surface of the image',
    'floating above the composition with dimensional shadow',
    'wrapped around the central object creating visual tension',
    'emerging from the background through strategic negative space',
    'positioned asymmetrically in the bottom third creating balanced weight',
    'fragmented across multiple planes adding depth perception',
    'flowing through the composition like liquid or smoke',
    'appearing on a digital display within the scene',
  ],
  TYPOGRAPHY_STYLE: [
    'weathered stencil lettering with spray paint texture and dripping details',
    'elegant serif typography with subtle distressing and metallic sheen',
    'brutalist sans-serif with sharp edges and industrial construction',
    'handwritten script with emotional pressure marks and ink splatters',
    'glitched digital typography with data corruption artifacts',
    'dimensional cut-paper letters casting soft shadows',
    'neon tube lettering with realistic glow and reflection effects',
    'vintage letterpress typography with deep impression and ink texture',
    'geometric modernist typography with precise construction and minimal weight',
    'organic letterforms that appear to grow like plants or vines',
  ],
  COLOR_SCHEME: [
    'high-contrast black and white with single red accent element',
    'complementary orange and blue creating vibrant tension throughout',
    'monochromatic blue tones with subtle temperature variations',
    'rich jewel tones of emerald, ruby and sapphire against dark background',
    'muted pastel palette with unexpected neon highlight',
    'split-complementary scheme creating harmonious but energetic atmosphere',
    'warm analog film colors with slight color shift toward amber',
    'duotone effect combining deep purple and acid green',
    'desaturated vintage colors with subtle sepia undertones',
    'hyperreal saturated colors pushing beyond natural limitations',
  ],
  MOOD_ATMOSPHERE: [
    'an ominous sense of anticipation and tension',
    'nostalgic melancholy with emotional depth',
    'energetic urban urgency and movement',
    'dreamlike surrealism disconnected from reality',
    'raw, authentic vulnerability and intimacy',
    'industrial alienation and mechanical coldness',
    'psychedelic transcendence beyond ordinary perception',
    'minimalist contemplation with negative space',
    'chaotic information overload and sensory stimulation',
    'serene stillness with meditative quality',
  ],
  ARTISTIC_STYLE: [
    'photorealistic documentary style',
    'collage technique combining analog and digital elements',
    'graphic illustration with bold simplified forms',
    'experimental double-exposure photography',
    'glitch art with digital artifacts and corruption',
    'painterly mixed media with visible brushstrokes and texture',
    'vector art with clean lines and mathematical precision',
    'analog film photography with authentic grain and imperfections',
    '3D rendering with hyperrealistic materials and lighting',
    'retro screen print aesthetic with limited color separations',
  ],
  COMPOSITION_DETAILS: [
    'central focal point with radial balance drawing eye inward',
    'dynamic diagonal lines creating movement across frame',
    'symmetrical arrangement with perfect mirroring effect',
    'use of negative space creating secondary shapes and forms',
    'tight cropping focusing on textural details and surfaces',
    'multiple layers creating depth illusion in flat medium',
    'rule of thirds placement with strategic visual tension',
    'frame within frame technique suggesting multiple realities',
    'forced perspective exaggerating spatial relationships',
    'off-kilter framing creating sense of imbalance and unease',
  ],
  TECHNICAL_QUALITY: [
    'professional studio photography with precision lighting and sharp detail',
    'high resolution digital art with intricate texture and clean edges',
    'cinematic aspect ratio with film grain and slight vignetting',
    'pristine vector quality with mathematical precision and scalability',
    'authentic analog imperfections including film scratches and light leaks',
    '8K detail showcasing microscopic textures and surface qualities',
    'mixed media integration with seamless blending between techniques',
    'ultra-sharp focus throughout with extreme depth of field',
    'deliberately degraded resolution creating textural noise and distortion',
    'HDR rendering with extended dynamic range revealing shadow detail',
  ],
};

export type PlaceholderKeys = keyof typeof placeholderVariants;
