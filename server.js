const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { SheetsDB } = require('./src/sheets-db');
const { ConfigManager } = require('./src/config-manager');
const { CarouselRenderer } = require('./src/renderer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const sheetsDb = new SheetsDB();
const configManager = new ConfigManager();
const renderer = new CarouselRenderer();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/output', express.static(path.join(__dirname, 'output')));

// ==============================================================================
// AUTENTICACIÓN SIMPLE (LOGIN)
// ==============================================================================
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "tech2026";
const AUTH_TOKEN = "token_auth_jlph_" + Buffer.from(ADMIN_PASS).toString('base64');

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true, token: AUTH_TOKEN, user: username });
  }
  return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
});

// Middleware de autenticación
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${AUTH_TOKEN}`) {
    return next();
  }
  return res.status(401).json({ success: false, message: "No autorizado. Inicie sesión." });
}

// ==============================================================================
// RUTAS DE CONFIGURACIÓN Y GOOGLE SHEETS
// ==============================================================================
app.get('/api/config', requireAuth, async (req, res) => {
  try {
    const config = await sheetsDb.getConfig();
    const webhookUrl = sheetsDb.getWebhookUrl();
    res.json({ success: true, config, webhookUrl, hasWebhook: Boolean(webhookUrl) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/config', requireAuth, async (req, res) => {
  try {
    const newConfig = req.body.config;
    await sheetsDb.saveConfig(newConfig);
    res.json({ success: true, config: newConfig });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sheets/webhook', requireAuth, async (req, res) => {
  try {
    const { url } = req.body;
    sheetsDb.setWebhookUrl(url);
    res.json({ success: true, message: "URL de Google Sheets guardada correctamente" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==============================================================================
// RUTAS DE BLUEPRINTS & GENERACIÓN
// ==============================================================================
app.get('/api/blueprints', requireAuth, (req, res) => {
  res.json({ success: true, blueprints: configManager.getAllBlueprints() });
});

app.get('/api/publications', requireAuth, async (req, res) => {
  try {
    const publications = await sheetsDb.getPublications();
    res.json({ success: true, publications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/publications/status', requireAuth, async (req, res) => {
  try {
    const { id, status } = req.body;
    const updated = await sheetsDb.updateStatus(id, status);
    res.json({ success: true, record: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Generador en vivo desde la UI
app.post('/api/generate', requireAuth, async (req, res) => {
  try {
    const {
      topic,
      category,
      format,
      slideCount,
      blueprint,
      customStructure,
      slidesData
    } = req.body;

    console.log(`\n🚀 [API Generate] Recibida orden de generación: "${topic}" (${format})`);

    const currentConfig = await sheetsDb.getConfig();
    const author = currentConfig.author || {
      name: "Ing. José Luis",
      handle: "@joseluis_tech",
      title: "Software Architecture & AI"
    };

    let fullSlides = [];

    // Si la UI mandó las diapositivas ya estructuradas
    if (slidesData && Array.isArray(slidesData) && slidesData.length > 0) {
      fullSlides = slidesData;
    } else {
      // Estructura por defecto según el blueprint
      const plan = configManager.buildCarouselPlan({
        topic,
        category,
        format,
        slideCount: Number(slideCount) || 6,
        blueprint: blueprint || 'standard_executive',
        customStructure
      });

      // Generar contenido demo/fallback enriquecido si no vino completo
      fullSlides = [
        {
          type: "cover_hero",
          hookTag: "⚡ INGENIERÍA DE SISTEMAS",
          title: topic,
          subtitle: "Análisis técnico y buenas prácticas para la toma de decisiones ejecutivas.",
          image: "hero.jpg",
          stats: [
            { icon: "⚡", title: "Alta Escala", desc: "Producción 2026" },
            { icon: "🛡️", title: "Cero Caídas", desc: "99.999% SLA" }
          ]
        },
        {
          type: "split_contrast",
          heading: "¿Dónde Falla el Enfoque Común?",
          subheading: "Comparativa entre malas prácticas vs arquitectura recomendada:",
          left: {
            badge: "ANTI-PATTERN",
            icon: "❌",
            title: "Práctica Antigua",
            items: ["Acoplamiento excesivo", "Sin caché en capas", "Single point of failure"]
          },
          right: {
            badge: "BEST PRACTICE",
            icon: "✅",
            title: "Diseño Moderno",
            items: ["Arquitectura desacoplada", "Caché distribuido con Redis", "Resiliencia activa"]
          }
        },
        {
          type: "impact_matrix",
          heading: "Impacto & Métricas en Producción",
          subheading: "Resultados reales tras aplicar la arquitectura:",
          rows: [
            { type: "good", icon: "🚀", title: "Reducción Latencia P99", desc: "De 300ms a 15ms", stat: "-85% Latency" },
            { type: "warn", icon: "⚡", title: "Throughput Sostenido", desc: "Bajo picos de concurrencia", stat: "10M+ RPS" },
            { type: "bad", icon: "💥", title: "Costo de No Aplicarlo", desc: "Caídas y clientes insatisfechos", stat: "Alto Riesgo" }
          ]
        },
        {
          type: "process_pipeline",
          heading: "Pipeline de Implementación",
          subheading: "Paso a paso para desplegar en tu infraestructura:",
          image: "pipeline.jpg",
          steps: [
            { title: "1. Diagnóstico & Métricas", desc: "Identificar cuellos de botella." },
            { title: "2. Diseño Arquitectónico", desc: "Modelar esquemas y resiliencia.", active: true },
            { title: "3. Despliegue en Producción", desc: "Migración con canary releases." }
          ]
        },
        {
          type: "golden_rules",
          heading: "3 Reglas de Oro para Ingenieros",
          subheading: "Principios clave para aplicar en tu próximo proyecto:",
          rules: [
            { icon: "🎯", title: "1. Mide antes de optimizar", desc: "No asumas cuellos de botella sin telemetría real." },
            { icon: "🛡️", title: "2. Aísla el fallo", desc: "Usa circuit breakers para evitar caídas en cascada." },
            { icon: "🧪", title: "3. Automatiza tus pruebas", desc: "Si no está testeado, está roto." }
          ]
        },
        {
          type: "summary_cta",
          heading: "Conclusión & Debate",
          subheading: "El rol del ingeniero es garantizar estabilidad y velocidad de negocio:",
          image: "future.jpg",
          question: "¿Cómo lo resuelves en tu empresa?",
          questionDesc: "¿Ya aplicas estos principios o enfrentas cuellos de botella similares?",
          cta: { primaryBtn: "Comentar mi opinión 💬", secondaryBtn: "Guardar este Post 🔖" }
        }
      ];

      // Ajustar cantidad si slideCount es diferente
      if (slideCount && Number(slideCount) < fullSlides.length) {
        const last = fullSlides[fullSlides.length - 1];
        fullSlides = fullSlides.slice(0, Number(slideCount) - 1);
        fullSlides.push(last);
      }
    }

    const carouselId = `carrusel-${Date.now()}`;
    const carouselData = {
      id: carouselId,
      title: topic,
      category: category || "TECH & INGENIERÍA",
      format: format || "square",
      author,
      slides: fullSlides
    };

    const renderResult = await renderer.render(carouselData);

    // Registrar en Base de Datos Google Sheets / Local
    const publicationRecord = {
      id: carouselId,
      date: new Date().toISOString().split('T')[0],
      topic: topic,
      category: category || "TECH & INGENIERÍA",
      format: format || "square",
      slideCount: fullSlides.length,
      blueprint: blueprint || "standard_executive",
      status: "Generado",
      pdfPath: renderResult.pdf ? `/output/${carouselId}/${path.basename(renderResult.pdf)}` : "",
      folderPath: `output/${carouselId}`,
      createdAt: new Date().toISOString()
    };

    await sheetsDb.recordPublication(publicationRecord);

    res.json({
      success: true,
      message: "Carrusel generado y registrado con éxito",
      record: publicationRecord,
      renderResult: {
        images: renderResult.images.map(img => `/output/${carouselId}/${path.basename(img)}`),
        pdf: publicationRecord.pdfPath
      }
    });

  } catch (err) {
    console.error('❌ Error en /api/generate:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n═══════════════════════════════════════════════════════════════`);
  console.log(`🌐 PANEL DE CONTROL TECH WEB ONLINE`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log(`👤 Usuario de Login: ${ADMIN_USER} | Password: ${ADMIN_PASS}`);
  console.log(`═══════════════════════════════════════════════════════════════\n`);
});
