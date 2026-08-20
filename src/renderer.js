const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const { generateSlideHtml } = require('./templates/slide-generator');
const { ImageGenerator } = require('./image-generator');
const { getTheme, getRandomTheme } = require('./templates/themes');

class CarouselRenderer {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(__dirname, '../output');
    this.imageGenerator = new ImageGenerator();
  }

  async render(carouselData) {
    const slug = carouselData.id || `carousel-${Date.now()}`;
    const targetFolder = path.join(this.outputDir, slug);
    await fs.ensureDir(targetFolder);

    const format = carouselData.format || 'square';
    const isStory = format === 'story';
    const isPortrait = format === 'portrait';
    const isLandscape = format === 'landscape';
    
    // Proporciones exactas
    let width = 1080;
    let height = 1080; // 1:1 Cuadrado por defecto (Feed LinkedIn, IG, FB)
    if (isStory) { width = 1080; height = 1920; }     // 9:16 Historia / Reel
    if (isPortrait) { width = 1080; height = 1350; }  // 4:5 Vertical Feed
    if (isLandscape) { width = 1920; height = 1080; } // 16:9 Panorámico

    // Seleccionar o rotar tema visual dinámico
    const themeKey = carouselData.themeKey || 'midnight_cyan';
    const activeTheme = getTheme(themeKey);

    console.log(`\n🎨 Iniciando renderizado: "${carouselData.title}"`);
    console.log(`🎭 Tema Visual: ${activeTheme.name}`);
    console.log(`📐 Proporción: ${width}x${height} (${format})`);
    console.log(`📁 Carpeta de salida: ${targetFolder}\n`);

    // 1. Generar o resolver imágenes 3D de apoyo conceptual para las diapositivas
    console.log(`🖼️ Generando arte conceptual 3D de apoyo con IA...`);
    const heroImageUri = await this.imageGenerator.getOrGenerateImage(carouselData.title, 'hero', activeTheme.primaryAccent);
    const archImageUri = await this.imageGenerator.getOrGenerateImage(carouselData.title, 'architecture', activeTheme.primaryAccent);
    const pipeImageUri = await this.imageGenerator.getOrGenerateImage(carouselData.title, 'pipeline', activeTheme.primaryAccent);
    const futureImageUri = await this.imageGenerator.getOrGenerateImage(carouselData.title, 'future', activeTheme.primaryAccent);

    // Inyectar las imágenes resueltas en los slides correspondientes
    const slidesWithImages = (carouselData.slides || []).map((s, idx) => {
      let img = s.image;
      if (s.type === 'cover_hero' || s.type === 'cover' || idx === 0) img = s.image || heroImageUri;
      if (s.type === 'split_contrast' || s.type === 'comparison') img = s.image || archImageUri;
      if (s.type === 'process_pipeline' || s.type === 'pipeline') img = s.image || pipeImageUri;
      if (s.type === 'summary_cta' || s.type === 'conclusion' || idx === carouselData.slides.length - 1) img = s.image || futureImageUri;
      return { ...s, image: img };
    });

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 2 // 2X Retina resolution
    });

    const page = await context.newPage();
    const generatedImages = [];

    for (let i = 0; i < slidesWithImages.length; i++) {
      const slide = slidesWithImages[i];
      const slideHtml = generateSlideHtml(slide, i, slidesWithImages.length, {
        authorName: carouselData.author?.name || "Ing. José Luis",
        authorHandle: carouselData.author?.handle || "@joseluis_tech",
        category: carouselData.category || "TECH & INGENIERÍA",
        themeKey: themeKey,
        format: format
      });

      await page.setContent(slideHtml, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300); // Esperar renderizado tipográfico

      const fileName = `slide_${String(i + 1).padStart(2, '0')}.png`;
      const filePath = path.join(targetFolder, fileName);

      await page.screenshot({
        path: filePath,
        type: 'png'
      });

      generatedImages.push(filePath);
      console.log(`  ✓ Slide ${String(i + 1).padStart(2, '0')}/${slidesWithImages.length} renderizada -> ${fileName}`);
    }

    await browser.close();

    // Compilar PDF para LinkedIn (únicamente si no es historia 9:16)
    let pdfPath = null;
    if (!isStory) {
      pdfPath = path.join(targetFolder, `${slug}_linkedin.pdf`);
      await this.compilePdfFromImages(generatedImages, pdfPath, width, height);
      console.log(`  ✓ Documento PDF para LinkedIn generado -> ${path.basename(pdfPath)}`);
    }

    // Generar archivo de copys y hashtags para redes sociales
    const captionsContent = this.generateCaptionsFile(carouselData);
    const captionsPath = path.join(targetFolder, 'copys_redes_sociales.md');
    await fs.writeFile(captionsPath, captionsContent, 'utf8');
    console.log(`  ✓ Copys y ganchos guardados -> copys_redes_sociales.md\n`);

    return {
      slug,
      folder: targetFolder,
      outputDir: targetFolder,
      images: generatedImages,
      slides: generatedImages,
      pdf: pdfPath,
      pdfPath: pdfPath,
      captions: captionsPath,
      themeKey: themeKey,
      format: format
    };
  }

  async compilePdfFromImages(imagePaths, outputPdfPath, width, height) {
    const pdfDoc = await PDFDocument.create();

    for (const imgPath of imagePaths) {
      const imgBytes = await fs.readFile(imgPath);
      const img = await pdfDoc.embedPng(imgBytes);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width,
        height
      });
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPdfPath, pdfBytes);
  }

  generateCaptionsFile(data) {
    return `# Copys para Publicación: ${data.title}
**Fecha:** ${new Date().toLocaleDateString('es-ES')} | **Categoría:** ${data.category || 'Tech'}

---

## 💼 Copy para LinkedIn (Publicar junto al archivo PDF)
\`\`\`text
${data.captions?.linkedin || `¿Cómo resolver "${data.title}" con estándares de alta escala? 🚀

En este carrusel técnico desglosamos las decisiones de arquitectura, los trade-offs y las 3 reglas de oro para implementar en producción.

📌 Desliza el documento adjunto para ver el blueprint completo.

#SoftwareArchitecture #Engineering #SystemDesign #TechLeadership #DevOps`}
\`\`\`

---

## 📸 Copy para Instagram / Facebook (Publicar con las imágenes)
\`\`\`text
${data.captions?.instagram || `${data.title} ⚡

Guía visual paso a paso para líderes técnicos e ingenieros de software.

Desliza para ver el desglose ➔

💾 Guarda este post para compartirlo con tu equipo técnico.
👉 Sígueme en @${(data.author?.handle || 'joseluis_tech').replace('@', '')} para más análisis tech diarios.

#ingenieriadesistemas #arquitectura #programacion #tech #desarrolloweb`}
\`\`\`
`;
  }
}

module.exports = { CarouselRenderer };
