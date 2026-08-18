const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const { generateSlideHtml } = require('./templates/slide-generator');

class CarouselRenderer {
  constructor(options = {}) {
    this.outputDir = options.outputDir || path.join(__dirname, '../output');
    this.cssPath = path.join(__dirname, 'templates/styles.css');
  }

  async render(carouselData) {
    const slug = carouselData.id || `carousel-${Date.now()}`;
    const targetFolder = path.join(this.outputDir, slug);
    await fs.ensureDir(targetFolder);

    const isStory = carouselData.format === 'story';
    const isPortrait = carouselData.format === 'portrait';
    
    // Proporciones exactas
    const width = 1080;
    let height = 1080; // Default 1:1 / 3:3 Square para Feed de LinkedIn, IG y FB
    if (isStory) height = 1920; // 9:16 para Historias
    if (isPortrait) height = 1350; // 4:5 Vertical

    console.log(`\n🎨 Iniciando renderizado: "${carouselData.title}"`);
    console.log(`📐 Proporción: ${isStory ? '9:16 Historia (1080x1920)' : isPortrait ? '4:5 Vertical (1080x1350)' : '3:3 / 1:1 Cuadrado (1080x1080)'}`);
    console.log(`📁 Carpeta de salida: ${targetFolder}\n`);

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 2 // 2X Retina resolution
    });

    const page = await context.newPage();
    const slides = carouselData.slides;
    const generatedImages = [];

    // Read CSS content to inject directly
    const cssContent = await fs.readFile(this.cssPath, 'utf8');

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const slideNum = String(i + 1).padStart(2, '0');
      const filename = `slide_${slideNum}.png`;
      const imagePath = path.join(targetFolder, filename);

      let html = generateSlideHtml(slide, i, slides.length, {
        authorName: carouselData.author?.name || "Ing. José Luis",
        authorHandle: carouselData.author?.handle || "@joseluis_tech",
        authorTitle: carouselData.author?.title || "Software Architecture & AI",
        avatarUrl: carouselData.author?.avatarUrl,
        category: carouselData.category || "TECH & IA 2026",
        isStory
      });

      // Embed CSS inline
      html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${cssContent}</style>`);

      await page.setContent(html, { waitUntil: 'networkidle' });
      await page.evaluateHandle('document.fonts.ready');

      const slideElement = await page.$('.slide');
      await slideElement.screenshot({
        path: imagePath,
        type: 'png'
      });

      console.log(`  ✓ Slide ${slideNum}/${slides.length} renderizada -> ${filename}`);
      generatedImages.push(imagePath);
    }

    await browser.close();

    // Compile PDF for LinkedIn (only if not story)
    let pdfPath = null;
    if (!isStory) {
      pdfPath = path.join(targetFolder, `${slug}_linkedin.pdf`);
      await this.compilePdfFromImages(generatedImages, pdfPath, width, height);
      console.log(`  ✓ Documento PDF para LinkedIn generado -> ${path.basename(pdfPath)}`);
    }

    // Write Captions file
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
      captions: captionsPath
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
${data.captions?.linkedin || `El "Vibecoding" está cambiando cómo construimos software, pero... ¿es viable en empresas reales? 🤖⚡

Popularizado por Andrej Karpathy, el Vibecoding consiste en programar guiado casi 100% por prompts e intuición.

Para prototipar y validar MVPs en 48 horas es una revolución absoluta. Pero cuando entra a producción en sistemas corporativos, la deuda técnica puede explotar en meses si no hay arquitectura detrás.

📌 Desliza este carrusel para ver:
- El choque: Vibecoding vs Ingeniería Rigurosa
- Métricas de impacto real en empresas
- El modelo híbrido para adoptarlo con seguridad

¿En tu empresa ya usan herramientas de IA para codificar o siguen el flujo tradicional? Te leo en los comentarios. 👇

#Vibecoding #SoftwareEngineering #ArtificialIntelligence #SystemDesign #TechLeadership #DevOps #Innovation`}
\`\`\`

---

## 📸 Copy para Instagram / Facebook (Publicar con las imágenes cuadradas 1:1)
\`\`\`text
${data.captions?.instagram || `¿El fin de los programadores o la era del Arquitecto con IA? 🔥

El Vibecoding promete crear aplicaciones en minutos, pero en empresas serias las reglas son distintas.

Desliza para ver la guía visual ➔

1️⃣ ¿Qué es el Vibecoding?
2️⃣ El impacto real en productividad vs deuda técnica
3️⃣ El pipeline híbrido para no romper producción
4️⃣ 3 Reglas de oro para ingenieros

💾 Guarda este post para compartirlo con tu equipo técnico.
👉 Sígueme en @${(data.author?.handle || 'tu_usuario').replace('@', '')} para más análisis tech diarios.

#vibecoding #ia #ingenieriadesistemas #programadores #tecnologia #startups #desarrolloweb #software`}
\`\`\`
`;
  }
}

module.exports = { CarouselRenderer };
