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
const { ContentEngine } = require('./content-engine');
const { ConfigManager } = require('./config-manager');
const { addPublication, getConfiguration } = require('./sheets-db');

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
    const configMgr = new ConfigManager();
    const engine = new ContentEngine();

    // 1. Cargar Configuración de Marca y Base de Datos
    let brandConfig = configMgr.getBrand();
    try {
      const cloudConfig = await getConfiguration();
      if (cloudConfig && cloudConfig.author) {
        brandConfig = { ...brandConfig, ...cloudConfig.author };
      }
    } catch (e) {
      console.log("ℹ️ Usando configuración de marca local");
    }

    // 2. Seleccionar Tema para Publicar
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
    const plan = configMgr.buildCarouselPlan({
      topic: selectedItem.topic,
      category: selectedItem.category,
      format: format,
      slideCount: 6,
      blueprint: selectedItem.blueprint
    });

    const result = await engine.render({
      id: `carrusel-${Date.now()}`,
      title: plan.topic,
      category: plan.category,
      format: plan.format,
      slides: [
        { type: "cover_hero", title: plan.topic, subtitle: "Decisiones de arquitectura, trade-offs y mejores prácticas para ingeniería de sistemas.", hook: "⚡ ANÁLISIS DE ALTO IMPACTO", badge1: "10x Velocidad", badge2: "Cero Caídas" },
        { type: "split_contrast", title: "¿Dónde Falla el Enfoque Común?", subtitle: "Comparativa entre malas prácticas vs arquitectura recomendada:", badTitle: "Práctica Antigua", badItems: ["Acoplamiento excesivo", "Sin caché en capas", "Single point of failure"], goodTitle: "Diseño Moderno", goodItems: ["Arquitectura desacoplada", "Caché distribuido con Redis", "Resiliencia activa"] },
        { type: "impact_matrix", title: "Impacto & Métricas en Producción", subtitle: "Resultados reales observados tras aplicar la arquitectura:", stat1: "-85% Latency", stat1Desc: "Reducción en tiempo de respuesta P99", stat2: "10M+ RPS", stat2Desc: "Throughput sostenido bajo picos de carga", stat3: "3x Deuda Oculta", stat3Desc: "Riesgo de omitir revisión de arquitectura" },
        { type: "process_pipeline", title: "El Pipeline Seguro en 3 Fases", subtitle: "Cómo implementarlo en empresas serias sin romper producción:", step1: "1. Vibe & Exploración rápida", step2: "2. Filtro de Arquitectura Senior", step3: "3. Hardening & Tests automáticos" },
        { type: "golden_rules", title: "3 Reglas de Oro para Líderes Tech", subtitle: "Principios para liderar ingeniería de sistemas moderna:", rule1: "1. La IA escribe, el Arquitecto responde", rule2: "2. Cero 'Vibe' en el Core Crítico", rule3: "3. Los Tests son tu escudo protector" },
        { type: "summary_cta", title: "El Futuro del Ingeniero de Sistemas", subtitle: "La habilidad clave ya no es solo escribir sintaxis, sino diseñar arquitecturas:", question: "¿Y en tu empresa?", questionDesc: "¿Ya están adoptando estas prácticas o prefieren el flujo tradicional?" }
      ]
    });

    console.log(`\n✅ Renderizado completado exitosamente:`);
    console.log(`   📄 PDF para LinkedIn: ${result.pdfPath}`);
    console.log(`   🖼️ Diapositivas: ${result.slides.length} PNGs generados`);

    // 4. Preparar Payload para Make.com Webhook
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;

    const payloadForMake = {
      event: "PUBLISH_CAROUSEL",
      timestamp: new Date().toISOString(),
      topic: selectedItem.topic,
      category: selectedItem.category,
      networks: networks,
      format: format,
      slide_count: result.slides.length,
      captions: {
        linkedin: `¿Cómo resolver "${selectedItem.topic}" con estándares de alta escala? 🚀\n\nEn este carrusel técnico desglosamos las decisiones de arquitectura, los trade-offs y las 3 reglas de oro para implementar en producción.\n\n📌 Desliza el documento adjunto para ver el blueprint completo.\n\n#SystemDesign #SoftwareEngineering #Cloud #TechLeadership #DevOps`,
        instagram: `${selectedItem.topic} ⚡\n\nGuía visual paso a paso para líderes técnicos e ingenieros de software.\n\nDesliza para ver el desglose ➔\n\n#ingenieriadesistemas #arquitectura #programacion #tech #desarrollo`,
        facebook: `${selectedItem.topic} - Guía técnica de arquitectura de software para líderes y desarrolladores.`
      },
      assets: {
        pdf_local_path: result.pdfPath,
        images_count: result.slides.length,
        cover_image: result.slides[0] ? path.resolve(result.slides[0]) : null
      },
      author: brandConfig
    };

    // 5. Enviar al Webhook de Make.com si está configurado
    if (makeWebhookUrl && makeWebhookUrl.startsWith("http")) {
      console.log(`\n📡 Despachando payload al Webhook de Make.com...`);
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
      console.log("\nℹ️ Nota: Variable MAKE_WEBHOOK_URL no configurada en entorno local. El payload quedó listo para Make.");
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

if (require.main === module) {
  runAutoPublisher();
}

module.exports = { runAutoPublisher };
