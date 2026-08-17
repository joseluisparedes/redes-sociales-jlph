/**
 * ==============================================================================
 * AUTO-PUBLISHER ENGINE (GitHub Actions Cron & Desatendido)
 * ==============================================================================
 * Ejecuta el ciclo completo de renderizado, compilación de PDF, sincronización
 * con Google Sheets y despacho al Webhook de Make.com para publicación multired.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { renderCarousel } = require('./renderer');
const { getBlueprint, getBrandConfig } = require('./config-manager');
const { addPublication, getConfiguration } = require('./sheets-db');

// Catálogo de temas de alta escala para publicación desatendida
const CURATED_TECH_TOPICS = [
  {
    topic: "El Fenómeno del Vibecoding: ¿Revolución o Deuda Técnica?",
    category: "IA & INGENIERÍA 2026",
    blueprint: "standard_executive"
  },
  {
    topic: "Cómo Escalar a 1M de Peticiones por Segundo con Redis y Kafka",
    category: "ARQUITECTURA DE SISTEMAS",
    blueprint: "deep_dive_architecture"
  },
  {
    topic: "Por qué Linux Adoptó Rust en el Kernel: La Batalla del Memory Safety",
    category: "HISTORIA & EVOLUCIÓN TECH",
    blueprint: "historical_tech_story"
  },
  {
    topic: "Microservicios vs Monolito Modular: El Trade-off Real de Costos",
    category: "DISEÑO DE SOFTWARE",
    blueprint: "quick_contrast"
  },
  {
    topic: "Patrón CQRS y Event Sourcing en Producción: Cuándo Sí y Cuándo No",
    category: "DISTRIBUTED SYSTEMS",
    blueprint: "deep_dive_architecture"
  },
  {
    topic: "LLMOps: Arquitectura RAG con Embeddings y Vector Databases",
    category: "IA GENERATIVA & CLOUD",
    blueprint: "standard_executive"
  }
];

async function runAutoPublisher() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("⚡ INICIANDO EJECUCIÓN DESATENDIDA DE PUBLICACIÓN TECH");
  console.log(`⏰ Fecha/Hora: ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  try {
    // 1. Cargar Configuración de Marca y Base de Datos
    let brandConfig = getBrandConfig();
    try {
      const cloudConfig = await getConfiguration();
      if (cloudConfig && cloudConfig.author) {
        brandConfig.author = { ...brandConfig.author, ...cloudConfig.author };
      }
    } catch (e) {
      console.log("ℹ️ Usando configuración de marca local");
    }

    // 2. Seleccionar Tema para Publicar (Rotativo o de entrada)
    const topicArg = process.argv[2];
    let selectedItem = CURATED_TECH_TOPICS[Math.floor(Math.random() * CURATED_TECH_TOPICS.length)];
    if (topicArg) {
      selectedItem = {
        topic: topicArg,
        category: "IA & INGENIERÍA 2026",
        blueprint: "standard_executive"
      };
    }

    const format = process.env.PUBLISH_FORMAT || "square";
    const networks = (process.env.PUBLISH_NETWORKS || "linkedin,instagram,facebook")
      .split(',')
      .map(s => s.trim().toLowerCase());
    
    console.log(`📌 Tema a Publicar: "${selectedItem.topic}"`);
    console.log(`🏷️ Categoría: ${selectedItem.category}`);
    console.log(`📐 Formato: ${format} (3:3 / 1:1 Cuadrado)`);
    console.log(`🌐 Redes Destino: [${networks.join(', ')}]\n`);

    // 3. Renderizar Diapositivas en Alta Resolución Retina 2X y Compilar PDF
    const result = await renderCarousel({
      topic: selectedItem.topic,
      category: selectedItem.category,
      format: format,
      slideCount: 6,
      blueprintKey: selectedItem.blueprint,
      authorOverride: brandConfig.author
    });

    console.log(`\n✅ Renderizado completado exitosamente:`);
    console.log(`   📄 PDF para LinkedIn: ${result.pdfPath}`);
    console.log(`   🖼️ Diapositivas: ${result.slides.length} PNGs generados`);
    console.log(`   📝 Copys generados para redes sociales`);

    // 4. Preparar Payload para Make.com Webhook
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL || brandConfig.makeWebhookUrl;

    const payloadForMake = {
      event: "PUBLISH_CAROUSEL",
      timestamp: new Date().toISOString(),
      topic: selectedItem.topic,
      category: selectedItem.category,
      networks: networks,
      format: format,
      slide_count: result.slides.length,
      captions: {
        linkedin: result.copySummary?.linkedin || `¿Cómo aplicar ${selectedItem.topic} en producción? Desliza el documento adjunto para ver las reglas de arquitectura.\n\n#SoftwareArchitecture #Engineering #TechLeadership`,
        instagram: result.copySummary?.instagram || `${selectedItem.topic} ⚡\n\nGuía visual de ingeniería de sistemas.\n\nDesliza para ver el desglose ➔\n\n#ingenieriadesistemas #tech #arquitectura`,
        facebook: result.copySummary?.facebook || `${selectedItem.topic} - Guía técnica para líderes e ingenieros de software.`
      },
      assets: {
        pdf_local_path: result.pdfPath,
        images_count: result.slides.length,
        cover_image: result.slides[0] ? path.resolve(result.slides[0]) : null
      },
      author: brandConfig.author
    };

    // 5. Enviar al Webhook de Make.com si está configurado
    if (makeWebhookUrl && makeWebhookUrl.startsWith("http")) {
      console.log(`\n📡 Despachando payload al Webhook de Make.com (${makeWebhookUrl.slice(0, 45)}...)...`);
      try {
        const response = await fetch(makeWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadForMake)
        });
        console.log(`✅ Webhook de Make.com respondió con código: ${response.status}`);
      } catch (err) {
        console.warn(`⚠️ Error al enviar webhook a Make.com: ${err.message}`);
      }
    } else {
      console.log("\nℹ️ Nota: Variable MAKE_WEBHOOK_URL no configurada aún. El payload quedó listo para Make.");
    }

    // 6. Registrar Publicación en Google Sheets
    console.log("\n📊 Registrando publicación en Google Sheets...");
    try {
      await addPublication({
        id: `auto-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        topic: selectedItem.topic,
        category: selectedItem.category,
        format: format,
        slideCount: result.slides.length,
        blueprint: selectedItem.blueprint,
        status: "Publicado",
        pdfPath: result.pdfPath,
        folderPath: result.outputDir
      });
      console.log("✅ Publicación guardada en la base de datos Google Sheets.");
    } catch (dbErr) {
      console.warn("⚠️ No se pudo registrar en Google Sheets:", dbErr.message);
    }

    console.log("\n🎉 ¡PROCESO DE AUTOPUBLICACIÓN FINALIZADO CON ÉXITO!");
  } catch (error) {
    console.error("❌ Error en la ejecución desatendida:", error);
    process.exit(1);
  }
}

// Ejecutar
runAutoPublisher();
