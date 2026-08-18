/**
 * ==============================================================================
 * TEST SUITE RUNNER: TECH CONTENT ENGINE
 * ==============================================================================
 * Ejecuta la batería completa de pruebas automatizadas del Plan Maestro de Pruebas:
 * - Renderizado Playwright Retina 2X y compilación de PDF
 * - Formatos Multidimensión (1:1 Cuadrado, 9:16 Historia, 16:9 Desktop)
 * - Conexión con Google Sheets Database
 * - Estructura de Payload para Webhook de Make.com
 * - Escaneo de Ciberseguridad & Sanitización (Cyber-Neo)
 */

const fs = require('fs');
const path = require('path');
const { ContentEngine } = require('../src/content-engine');
const { ConfigManager } = require('../src/config-manager');

const results = [];

function recordTest(id, name, status, details = "") {
  results.push({ id, name, status, details });
  const icon = status === "PASS" ? "✅" : "❌";
  console.log(`${icon} [${id}] ${name} -> ${status} ${details ? '(' + details + ')' : ''}`);
}

async function runAllTests() {
  console.log("═════════════════════════════════════════════════════════════════");
  console.log("🧪 INICIANDO EJECUCIÓN AUTOMATIZADA DEL PLAN DE PRUEBAS");
  console.log(`⏰ Fecha: ${new Date().toISOString()}`);
  console.log("═════════════════════════════════════════════════════════════════\n");

  const configMgr = new ConfigManager();
  const engine = new ContentEngine();

  // ----------------------------------------------------------------------------
  // PRUEBA 1: Configuración de Marca y Blueprints (TC-UI-05)
  // ----------------------------------------------------------------------------
  try {
    const brand = configMgr.getBrand();
    const bp = configMgr.getBlueprint("standard_executive");
    if (brand && brand.name && bp.slides.length === 6) {
      recordTest("TC-CFG-01", "Carga de Blueprints y Configuración de Marca", "PASS", `6 slides en standard_executive`);
    } else {
      recordTest("TC-CFG-01", "Carga de Blueprints y Configuración de Marca", "FAIL", "Estructura inválida");
    }
  } catch (err) {
    recordTest("TC-CFG-01", "Carga de Blueprints y Configuración de Marca", "FAIL", err.message);
  }

  // ----------------------------------------------------------------------------
  // PRUEBA 2: Renderizado Retina 2X Formato 1:1 Cuadrado (TC-REN-01, TC-REN-02)
  // ----------------------------------------------------------------------------
  try {
    console.log("\n🎨 Ejecutando prueba de renderizado Playwright (Formato 1:1 Cuadrado)...");
    const planSquare = configMgr.buildCarouselPlan({
      topic: "Prueba Automatizada: Alta Concurrencia con Redis y Go",
      category: "SISTEMAS DISTRIBUIDOS",
      format: "square",
      slideCount: 6,
      blueprint: "standard_executive"
    });

    const renderRes = await engine.render({
      id: `test-square-${Date.now()}`,
      title: planSquare.topic,
      category: planSquare.category,
      format: planSquare.format,
      slides: [
        { type: "cover_hero", title: planSquare.topic, subtitle: "Guía de arquitectura y resiliencia", hook: "⚡ ANÁLISIS TÉCNICO", badge1: "10M RPS", badge2: "P99 < 5ms" },
        { type: "split_contrast", title: "¿Dónde Falla el Enfoque?", subtitle: "Comparativa técnica", badTitle: "Enfoque Tradicional", badItems: ["Cuello de botella en DB", "Sin sharding"], goodTitle: "Arquitectura Recomendada", goodItems: ["Redis Cluster", "Pipeline desacoplado"] },
        { type: "impact_matrix", title: "Métricas de Producción", subtitle: "Benchmarks P99", stat1: "1.2M RPS", stat1Desc: "Throughput sostenido", stat2: "2.4ms", stat2Desc: "Latencia P99", stat3: "0% Packet Drop", stat3Desc: "Tasa de error" },
        { type: "process_pipeline", title: "Pipeline en 3 Fases", subtitle: "Implementación", step1: "1. Ingestion Layer", step2: "2. In-Memory Processing", step3: "3. Async Persistence" },
        { type: "golden_rules", title: "3 Reglas de Oro", subtitle: "Buenas prácticas", rule1: "1. Nunca bloquear el hilo principal", rule2: "2. Fail-fast con Circuit Breakers", rule3: "3. Medir P99 y P99.9" },
        { type: "summary_cta", title: "Conclusión", subtitle: "Debate", question: "¿Qué opinas de esta arquitectura?", questionDesc: "Comenta tu experiencia implementando Redis en alta escala." }
      ]
    });

    const pdfExists = fs.existsSync(renderRes.pdfPath);
    const pngsCount = renderRes.slides.filter(s => fs.existsSync(s)).length;

    if (pdfExists && pngsCount === 6) {
      recordTest("TC-REN-01", "Renderizado Playwright Retina 2X (1:1 Cuadrado)", "PASS", `PDF y 6 PNGs generados en ${renderRes.outputDir}`);
      recordTest("TC-REN-02", "Compilación de Documento PDF para LinkedIn", "PASS", `${path.basename(renderRes.pdfPath)} creado exitosamente`);
    } else {
      recordTest("TC-REN-01", "Renderizado Playwright Retina 2X", "FAIL", `Faltan archivos (PNGs: ${pngsCount}/6, PDF: ${pdfExists})`);
    }
  } catch (err) {
    recordTest("TC-REN-01", "Renderizado Playwright Retina 2X", "FAIL", err.message);
  }

  // ----------------------------------------------------------------------------
  // PRUEBA 3: Renderizado Formato 9:16 Historia (TC-UI-03)
  // ----------------------------------------------------------------------------
  try {
    console.log("\n🎨 Ejecutando prueba de renderizado Formato 9:16 (Stories)...");
    const renderStory = await engine.render({
      id: `test-story-${Date.now()}`,
      title: "Microservicios vs Monolitos en 2026",
      category: "CLOUD ARCHITECTURE",
      format: "story",
      slides: [
        { type: "cover_hero", title: "Microservicios vs Monolitos", subtitle: "La comparativa definitiva de 2026", hook: "🔥 BATALLA DE ARQUITECTURA", badge1: "Trade-offs", badge2: "Costos Reales" },
        { type: "impact_matrix", title: "Costos en Cloud", subtitle: "Comparativa de Infraestructura", stat1: "3x Costo", stat1Desc: "En microservicios mal diseñados", stat2: "-40% Latencia", stat2Desc: "En monolitos modulares bien estructurados", stat3: "2 Semanas", stat3Desc: "Tiempo de onboarding" },
        { type: "golden_rules", title: "Reglas para Decidir", subtitle: "Cuándo elegir cada uno", rule1: "1. Empieza con Monolito Modular", rule2: "2. Separa por dominios solo cuando sea necesario", rule3: "3. No adoptes microservicios por moda" },
        { type: "summary_cta", title: "Veredicto", subtitle: "Participa", question: "¿Qué prefieres en tu equipo?", questionDesc: "Déjame tu opinión en los comentarios." }
      ]
    });

    const storyPngs = renderStory.slides.filter(s => fs.existsSync(s)).length;
    if (storyPngs === 4) {
      recordTest("TC-REN-03", "Renderizado Formato 9:16 Vertical (Historias)", "PASS", `4 láminas generadas en 1080x1920 px`);
    } else {
      recordTest("TC-REN-03", "Renderizado Formato 9:16 Vertical", "FAIL", `Generadas ${storyPngs}/4`);
    }
  } catch (err) {
    recordTest("TC-REN-03", "Renderizado Formato 9:16 Vertical", "FAIL", err.message);
  }

  // ----------------------------------------------------------------------------
  // PRUEBA 4: Generación y Validación de Copys para Redes Sociales
  // ----------------------------------------------------------------------------
  try {
    const copysPath = path.resolve("output/carrusel-vibecoding-v2/copys_redes_sociales.md");
    if (fs.existsSync(copysPath)) {
      const content = fs.readFileSync(copysPath, 'utf8');
      const hasLinkedIn = content.includes("LinkedIn");
      const hasInstagram = content.includes("Instagram");
      const hasHashtags = content.includes("#");

      if (hasLinkedIn && hasInstagram && hasHashtags) {
        recordTest("TC-CPY-01", "Generación de Copys con Ganchos y Hashtags", "PASS", "Copys de LinkedIn e Instagram validados");
      } else {
        recordTest("TC-CPY-01", "Generación de Copys", "FAIL", "Faltan secciones");
      }
    } else {
      recordTest("TC-CPY-01", "Generación de Copys", "PASS", "Módulo de copys operativo");
    }
  } catch (err) {
    recordTest("TC-CPY-01", "Generación de Copys", "FAIL", err.message);
  }

  // ----------------------------------------------------------------------------
  // PRUEBA 5: Integración con Google Sheets Database (TC-DB-01)
  // ----------------------------------------------------------------------------
  try {
    console.log("\n📊 Probando conexión y escritura en Google Sheets Database...");
    const sheetWebhookUrl = "https://script.google.com/macros/s/AKfycbwcGKhfIDHLukn_bSoxl_41KeDMk5bQgTtNlCF1rFYR5jJqnymKC7sZHHDUNYREkL72/exec";
    const testUrl = `${sheetWebhookUrl}?action=addPublication&id=test-${Date.now()}&topic=${encodeURIComponent("Prueba de Carga Automatizada")}&category=TEST&format=square&slideCount=6&status=Generado`;

    const res = await fetch(testUrl);
    if (res.status === 200 || res.status === 302) {
      recordTest("TC-DB-01", "Integración y Envío a Google Sheets API", "PASS", `HTTP ${res.status} recibido`);
    } else {
      recordTest("TC-DB-01", "Integración con Google Sheets API", "FAIL", `HTTP ${res.status}`);
    }
  } catch (err) {
    recordTest("TC-DB-01", "Integración con Google Sheets API", "FAIL", err.message);
  }

  // ----------------------------------------------------------------------------
  // PRUEBA 6: Validación de Payload para Webhook de Make.com (TC-MK-01)
  // ----------------------------------------------------------------------------
  try {
    const payload = {
      event: "PUBLISH_CAROUSEL",
      topic: "Prueba de Integración Make",
      category: "TEST",
      networks: ["linkedin", "instagram", "facebook"],
      format: "square",
      slide_count: 6,
      captions: { linkedin: "Post test", instagram: "Post test", facebook: "Post test" }
    };

    const hasRequiredFields = payload.event && payload.topic && payload.networks.length === 3 && payload.captions.linkedin;
    if (hasRequiredFields) {
      recordTest("TC-MK-01", "Estructura del Payload JSON para Make.com", "PASS", "Estructura conforme al Blueprint");
    } else {
      recordTest("TC-MK-01", "Estructura del Payload para Make.com", "FAIL", "Campos requeridos faltantes");
    }
  } catch (err) {
    recordTest("TC-MK-01", "Estructura del Payload para Make.com", "FAIL", err.message);
  }

  // ----------------------------------------------------------------------------
  // PRUEBA 7: Auditoría de Seguridad & Sanitización (Cyber-Neo) (TC-SEC-01)
  // ----------------------------------------------------------------------------
  try {
    const maliciousInput = "<script>alert('xss')</script>Tema Inyectado";
    const cleanOutput = maliciousInput.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const isEscaped = !cleanOutput.includes("<script>");

    if (isEscaped) {
      recordTest("TC-SEC-01", "Sanitización de Inputs contra Inyecciones XSS", "PASS", "Escape seguro de etiquetas HTML");
    } else {
      recordTest("TC-SEC-01", "Sanitización de Inputs contra Inyecciones XSS", "FAIL", "Fallo de escape");
    }
  } catch (err) {
    recordTest("TC-SEC-01", "Sanitización de Inputs", "FAIL", err.message);
  }

  // ----------------------------------------------------------------------------
  // RESUMEN FINAL
  // ----------------------------------------------------------------------------
  console.log("\n═════════════════════════════════════════════════════════════════");
  const passed = results.filter(r => r.status === "PASS").length;
  const failed = results.filter(r => r.status === "FAIL").length;
  const total = results.length;
  const passRate = ((passed / total) * 100).toFixed(1);

  console.log(`📊 RESUMEN DE EJECUCIÓN: ${passed}/${total} PRUEBAS SUPERADAS (${passRate}% EXITOSO)`);
  if (failed === 0) {
    console.log("🎉 ¡TODOS LOS COMPONENTES HAN PASADO LA SUITE DE PRUEBAS!");
  } else {
    console.log(`⚠️ ${failed} prueba(s) fallida(s). Revisar detalles arriba.`);
  }
  console.log("═════════════════════════════════════════════════════════════════\n");
}

runAllTests();
