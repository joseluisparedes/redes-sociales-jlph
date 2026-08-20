/**
 * ==============================================================================
 * AUTO-PUBLISHER ENGINE v2.0 (GitHub Actions Cron & Desatendido)
 * ==============================================================================
 * Ciclo integral autónomo:
 * 1. Investigación del tema tecnológico más importante del día (o manual).
 * 2. Rotación dinámica de temas visuales (Midnight Cyan, Emerald, Amber, Violet...).
 * 3. Generación de imágenes e ilustraciones conceptuales 3D con IA.
 * 4. Renderizado Retina 2X y compilación de PDF para LinkedIn.
 * 5. Registro automático en Google Sheets Database.
 * 6. Despacho al Webhook de Make.com para publicación multired.
 */

require('dotenv').config();
const fs = require('fs-extra');
const path = require('path');
const { ContentEngine } = require('./content-engine');
const { ConfigManager } = require('./config-manager');
const { TopicResearcher } = require('./topic-researcher');
const { THEME_KEYS, getTheme } = require('./templates/themes');
const { addPublication, getConfiguration } = require('./sheets-db');

async function runAutoPublisher() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("⚡ INICIANDO AUTOPUBLICADOR TECH INTELIGENTE (IA & CRON)");
  console.log(`⏰ Fecha/Hora: ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  try {
    const configMgr = new ConfigManager();
    const engine = new ContentEngine();
    const researcher = new TopicResearcher();

    // 1. Cargar Configuración de Marca
    let brand = configMgr.getBrand();
    try {
      const cloudConfig = await getConfiguration();
      if (cloudConfig && cloudConfig.author) {
        brand = { ...brand, ...cloudConfig.author };
      }
    } catch (e) {
      console.log("ℹ️ Usando configuración de autor local");
    }

    // 2. Investigar Tema del Día o Procesar Tema Manual
    const manualTopicArg = process.argv[2];
    let topicData;

    if (manualTopicArg) {
      console.log(`📌 Modo: Tema Manual Personalizado -> "${manualTopicArg}"`);
      topicData = researcher.buildStructuredContent(manualTopicArg);
    } else {
      console.log(`🧠 Modo: Investigación Automática de Tendencias Tech del Día...`);
      topicData = await researcher.getDailyTrendingTopic();
      console.log(`📌 Tema Descubierto: "${topicData.topic}"`);
    }

    // 3. Rotación Dinámica de Tema Visual (6 Paletas Ejecutivas)
    const dayIndex = new Date().getDate();
    const themeKey = process.env.PUBLISH_THEME || THEME_KEYS[dayIndex % THEME_KEYS.length];
    const activeTheme = getTheme(themeKey);

    console.log(`🎭 Tema Visual Asignado: ${activeTheme.name}`);
    console.log(`🏷️ Categoría: ${topicData.category}\n`);

    // 4. Configuración Granular de Redes y Formatos
    const networks = (process.env.PUBLISH_NETWORKS || "linkedin,instagram,facebook")
      .split(',')
      .map(s => s.trim().toLowerCase());

    const format = process.env.PUBLISH_FORMAT || "square"; // 1:1 Cuadrado por defecto

    // 5. Construir Estructura de Diapositivas con el Guion Técnico
    const structuredSlides = [
      {
        type: "cover_hero",
        title: topicData.topic,
        subtitle: topicData.subtitle,
        hook: topicData.hook,
        badge1: topicData.stats?.[0]?.num ? `${topicData.stats[0].num} ${topicData.stats[0].label}` : "Alta Escala",
        badge2: "Estándar 2026"
      },
      {
        type: "split_contrast",
        title: "¿Dónde Falla el Enfoque Común?",
        subtitle: "Comparativa técnica entre malas prácticas vs arquitectura recomendada:",
        badTitle: topicData.badTitle,
        badItems: topicData.badItems,
        goodTitle: topicData.goodTitle,
        goodItems: topicData.goodItems
      },
      {
        type: "impact_matrix",
        title: "Métricas de Impacto en Producción",
        subtitle: "Resultados cuantificables observados tras aplicar la arquitectura:",
        stat1: topicData.stats?.[0]?.num || "10x",
        stat1Desc: topicData.stats?.[0]?.label || "Throughput",
        stat2: topicData.stats?.[1]?.num || "-70%",
        stat2Desc: topicData.stats?.[1]?.label || "Latencia P99",
        stat3: topicData.stats?.[2]?.num || "99.99%",
        stat3Desc: topicData.stats?.[2]?.label || "Disponibilidad"
      },
      {
        type: "process_pipeline",
        title: "El Pipeline en 3 Fases",
        subtitle: "Guía de implementación paso a paso:",
        step1: topicData.pipeline?.[0] || "1. Arquitectura & Contratos",
        step2: topicData.pipeline?.[1] || "2. Implementación Modular",
        step3: topicData.pipeline?.[2] || "3. Hardening & Observabilidad"
      },
      {
        type: "golden_rules",
        title: "3 Reglas de Oro para Líderes Tech",
        subtitle: "Principios innegociables para ingeniería de alto nivel:",
        rule1: topicData.rules?.[0] || "1. La IA escribe; el Arquitecto responde por los contratos.",
        rule2: topicData.rules?.[1] || "2. Cero código en producción sin tests en verde.",
        rule3: topicData.rules?.[2] || "3. La ventaja competitiva está en el diseño del sistema."
      },
      {
        type: "summary_cta",
        title: "Conclusión & Debate Técnico",
        subtitle: "La habilidad clave es diseñar arquitecturas resilientes:",
        question: topicData.question,
        questionDesc: "Comparte tu experiencia o debate en la sección de comentarios."
      }
    ];

    // 6. Renderizar con el Motor de Arte IA & Playwright Retina 2X
    console.log(`🚀 Renderizando carrusel con Ilustraciones 3D generadas por IA...`);
    const renderResult = await engine.render({
      id: `carrusel-${Date.now()}`,
      title: topicData.topic,
      category: topicData.category,
      format: format,
      themeKey: themeKey,
      author: brand,
      slides: structuredSlides
    });

    console.log(`\n✅ Renderizado completado:`);
    console.log(`   📄 Documento PDF: ${renderResult.pdfPath}`);
    console.log(`   🖼️ Láminas PNG: ${renderResult.slides.length} imágenes 2X Retina`);
    console.log(`   📝 Copys generados: ${renderResult.captions}`);

    // 7. Preparar Payload Estructurado para Make.com
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    const payloadForMake = {
      event: "PUBLISH_CAROUSEL",
      timestamp: new Date().toISOString(),
      topic: topicData.topic,
      category: topicData.category,
      theme: activeTheme.name,
      theme_key: themeKey,
      networks: networks,
      format: format,
      slide_count: renderResult.slides.length,
      captions: {
        linkedin: `¿Cómo resolver "${topicData.topic}" con estándares de ingeniería de alto nivel? 🚀\n\nEn este carrusel técnico desglosamos las decisiones de arquitectura, los trade-offs y las 3 reglas de oro.\n\n📌 Desliza el documento PDF adjunto para ver el blueprint completo.\n\n#SoftwareEngineering #SystemDesign #CloudArchitecture #TechLeadership #DevOps #Innovation`,
        instagram: `${topicData.topic} ⚡\n\nGuía visual paso a paso para arquitectos de software e ingenieros de sistemas.\n\nDesliza para ver el desglose ➔\n\n💾 Guarda este post para tu equipo técnico.\n👉 Sígueme en @${brand.handle?.replace('@', '') || 'joseluis_tech'} para análisis tech diarios.\n\n#ingenieriadesistemas #arquitectura #programacion #tech #desarrolloweb`,
        facebook: `${topicData.topic} - Guía técnica de arquitectura de software y mejores prácticas para ingeniería de sistemas.`
      },
      assets: {
        pdf_local_path: renderResult.pdfPath,
        images_count: renderResult.slides.length,
        cover_image: renderResult.slides[0] ? path.resolve(renderResult.slides[0]) : null
      },
      author: brand
    };

    // 8. Despachar a Make.com si el Webhook está configurado
    if (makeWebhookUrl && makeWebhookUrl.startsWith("http")) {
      console.log(`\n📡 Despachando payload al Webhook de Make.com...`);
      try {
        const response = await fetch(makeWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadForMake)
        });
        console.log(`✅ Webhook de Make.com respondió con código: ${response.status}`);
      } catch (webhookErr) {
        console.warn(`⚠️ Error despachando a Make.com: ${webhookErr.message}`);
      }
    } else {
      console.log("\nℹ️ Variable MAKE_WEBHOOK_URL no configurada en entorno local (el payload está listo para Make).");
    }

    // 9. Registrar en Google Sheets Database
    console.log(`\n📊 Registrando publicación en Google Sheets...`);
    try {
      await addPublication({
        id: `auto-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        topic: topicData.topic,
        category: topicData.category,
        format: format,
        slideCount: renderResult.slides.length,
        blueprint: "standard_executive",
        status: "Publicado",
        pdfPath: renderResult.pdfPath,
        folderPath: renderResult.outputDir
      });
      console.log("✅ Fila registrada en la base de datos Google Sheets.");
    } catch (dbErr) {
      console.warn("⚠️ No se pudo registrar en Google Sheets:", dbErr.message);
    }

    console.log("\n🎉 ¡PROCESO DE AUTOPUBLICACIÓN COMPLETADO CON ÉXITO!");
  } catch (error) {
    console.error("❌ Error en la ejecución desatendida:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  runAutoPublisher();
}

module.exports = { runAutoPublisher };
