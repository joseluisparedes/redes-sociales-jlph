const { CarouselRenderer } = require('./renderer');
const sampleData = require('./sample-carousel.json');

async function main() {
  const renderer = new CarouselRenderer();
  console.log('🚀 Ejecutando motor de renderizado de carruseles ejecutivos...\n');
  const result = await renderer.render(sampleData);

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ ¡CARRUSEL GENERADO CON ÉXITO!');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📁 Carpeta de salida: ${result.folder}`);
  console.log(`🖼️ Diapositivas generadas (${result.images.length} PNGs):`);
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
