/**
 * ==============================================================================
 * GENERADOR DE IMÁGENES & ARTE CONCEPTUAL 3D CON IA
 * ==============================================================================
 * Genera ilustraciones 3D cinematográficas y mapas conceptuales de arquitectura
 * para enriquecer visualmente las láminas de cada carrusel.
 */

const fs = require('fs-extra');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const CACHE_DIR = path.join(__dirname, '../assets/generated_cache');

class ImageGenerator {
  constructor() {
    fs.ensureDirSync(CACHE_DIR);
    this.fallbackAssets = {
      hero: path.join(ASSETS_DIR, 'hero.jpg'),
      pipeline: path.join(ASSETS_DIR, 'pipeline.jpg'),
      future: path.join(ASSETS_DIR, 'future.jpg')
    };
  }

  /**
   * Genera el prompt optimizado para renderizado 3D de alta gama según el tema y rol de la lámina.
   */
  buildImagePrompt(topic, role = 'hero', theme = 'cyan') {
    const cleanTopic = topic.replace(/["'<>]/g, '').trim();

    if (role === 'hero') {
      return `Cinematic 3D isometric masterpiece illustration representing ${cleanTopic}, glowing holographic nodes, high tech cybernetic server cluster, volumetric lighting, octanerender 8k, dark obsidian slate environment, sleek ${theme} laser accents, unreal engine 5, executive tech aesthetic`;
    }

    if (role === 'architecture' || role === 'contrast') {
      return `3D visual technical architecture flow diagram of ${cleanTopic}, modular pipelines connecting glowing data streams, distributed systems concept, clean isometric perspective, high contrast dark theme, ${theme} neon highlights, professional software engineering concept`;
    }

    if (role === 'pipeline' || role === 'matrix') {
      return `Isometric 3D multi-layered cloud computing pipeline, automated CI CD flow, futuristic server racks, high throughput streaming data, dark moody studio lighting, ${theme} glowing circuitry, ultra sharp details 8k`;
    }

    if (role === 'future' || role === 'cta') {
      return `Futuristic 3D conceptual sculpture of senior software architect collaborating with holographic AI neural interfaces, crystal glass textures, modern minimal dark background, subtle ${theme} ambient glow, inspiring vision of technology`;
    }

    return `Futuristic 3D technology artwork about ${cleanTopic}, minimal dark luxury background, ${theme} glowing accents, 8k octane render`;
  }

  /**
   * Obtiene la imagen (generada por IA o fallback) en formato Data URI en base64 para incrustar en HTML.
   */
  async getOrGenerateImage(topic, role = 'hero', theme = 'cyan') {
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 35);
    const cacheFilename = `${role}-${slug}-${theme}.jpg`;
    const cachedFilePath = path.join(CACHE_DIR, cacheFilename);

    // 1. Si ya existe en caché local
    if (await fs.pathExists(cachedFilePath)) {
      try {
        const buffer = await fs.readFile(cachedFilePath);
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
      } catch (e) {
        console.warn(`Error leyendo caché de imagen: ${e.message}`);
      }
    }

    // 2. Intentar generar en tiempo real vía motor IA (Pollinations)
    try {
      const prompt = this.buildImagePrompt(topic, role, theme);
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

      console.log(`  🎨 Generando arte 3D (${role}) para: "${topic.slice(0, 40)}..."`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(imageUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Guardar en caché
        await fs.writeFile(cachedFilePath, buffer);
        console.log(`  ✓ Arte 3D generado exitosamente (${(buffer.length / 1024).toFixed(0)} KB)`);
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }
    } catch (aiErr) {
      console.log(`  ℹ️ Generador IA offline o timeout (${aiErr.message}), usando asset de respaldo optimizado.`);
    }

    // 3. Fallback inteligente a los assets empaquetados
    const fallbackPath = this.fallbackAssets[role] || this.fallbackAssets.hero;
    if (await fs.pathExists(fallbackPath)) {
      const buffer = await fs.readFile(fallbackPath);
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }

    // 4. Fallback SVG procedural si no hay archivo físico
    return this.createProceduralSvgDataUri(topic, role, theme);
  }

  createProceduralSvgDataUri(topic, role, theme) {
    const color = theme === 'emerald' ? '#10B981' : theme === 'gold' ? '#F59E0B' : theme === 'violet' ? '#A855F7' : '#06B6D4';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="800" height="800" fill="#0A0F1D"/>
        <circle cx="400" cy="400" r="300" fill="url(#g1)"/>
        <rect x="150" y="150" width="500" height="500" rx="30" fill="none" stroke="${color}" stroke-width="3" stroke-opacity="0.4"/>
        <circle cx="400" cy="400" r="120" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="10 15"/>
        <text x="400" y="390" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="28" font-weight="bold" text-anchor="middle">3D CONCEPT</text>
        <text x="400" y="430" fill="${color}" font-family="system-ui, sans-serif" font-size="20" font-weight="600" text-anchor="middle">${role.toUpperCase()}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }
}

module.exports = { ImageGenerator };
