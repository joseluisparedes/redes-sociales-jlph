const { CarouselRenderer } = require('./renderer');
const vibecodingData = require('./carrusel-vibecoding.json');

async function main() {
  const renderer = new CarouselRenderer();
  console.log('🚀 Renderizando Carrusel Visual 1:1 Cuadrado (3:3)...\n');
  const result = await renderer.render(vibecodingData);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ ¡CARRUSEL VIBECODING GENERADO CON ÉXITO!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📁 Carpeta de salida: ${result.folder}`);
  console.log(`🖼️ Diapositivas generadas (${result.images.length} PNGs 1080x1080):`);
  result.images.forEach(img => console.log(`   - ${img}`));
  if (result.pdf) {
    console.log(`📄 Documento PDF para LinkedIn: ${result.pdf}`);
  }
  console.log(`📝 Copys y Hashtags: ${result.captions}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('❌ Error al renderizar carrusel:', err);
  process.exit(1);
});
