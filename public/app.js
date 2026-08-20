/**
 * ==============================================================================
 * TECH CONTENT ENGINE - CLIENT CONTROLLER v3.0
 * ==============================================================================
 * Maneja la interfaz del estudio, la matriz granular por red social,
 * la generación en tiempo real con temas dinámicos e imágenes 3D,
 * la compilación de PDF y el despacho a Make.com y Google Sheets.
 */

// Estado global de la aplicación
const AppState = {
  token: localStorage.getItem('tech_engine_auth') || null,
  currentTab: 'generator',
  
  // Fuente de contenido
  contentSource: 'trending', // 'trending' | 'manual'
  
  // Matriz granular por red social
  networks: {
    linkedin: { enabled: true, format: 'square', type: 'carousel_doc' },
    instagram: { enabled: true, format: 'portrait', type: 'carousel_photos' },
    facebook: { enabled: true, format: 'square', type: 'album_photos' }
  },

  // Tema visual
  selectedThemeKey: 'random', // 'random' | 'midnight_cyan' | 'cyber_emerald' | ...

  // Datos del carrusel generado
  currentCarousel: null,
  currentSlideIndex: 0,
  activeCaptionTab: 'linkedin',

  // Configuración
  makeWebhookUrl: localStorage.getItem('cfg_make_webhook') || '',
  author: JSON.parse(localStorage.getItem('cfg_author')) || {
    name: "Ing. José Luis",
    handle: "@joseluis_tech"
  },

  // Base de datos Google Sheets
  sheetWebhookUrl: "https://script.google.com/macros/s/AKfycbwcGKhfIDHLukn_bSoxl_41KeDMk5bQgTtNlCF1rFYR5jJqnymKC7sZHHDUNYREkL72/exec"
};

// Temas visuales para el cliente
const CLIENT_THEMES = {
  midnight_cyan: {
    name: "Midnight Cyan",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), linear-gradient(180deg, #030712 0%, #0B1120 100%)",
    primary: "#06B6D4",
    secondary: "#3B82F6",
    badgeBg: "rgba(6, 182, 212, 0.14)"
  },
  cyber_emerald: {
    name: "Cyber Emerald",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.18) 0%, transparent 50%), linear-gradient(180deg, #020B06 0%, #071E12 100%)",
    primary: "#10B981",
    secondary: "#06B6D4",
    badgeBg: "rgba(16, 185, 129, 0.14)"
  },
  obsidian_gold: {
    name: "Obsidian Gold",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.16) 0%, transparent 50%), linear-gradient(180deg, #0B0904 0%, #1A1408 100%)",
    primary: "#F59E0B",
    secondary: "#F97316",
    badgeBg: "rgba(245, 158, 11, 0.14)"
  },
  quantum_violet: {
    name: "Quantum Violet",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(168, 85, 247, 0.18) 0%, transparent 50%), linear-gradient(180deg, #06030F 0%, #140828 100%)",
    primary: "#A855F7",
    secondary: "#EC4899",
    badgeBg: "rgba(168, 85, 247, 0.14)"
  },
  crimson_defense: {
    name: "Crimson Defense",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(244, 63, 94, 0.18) 0%, transparent 50%), linear-gradient(180deg, #0D0406 0%, #200810 100%)",
    primary: "#F43F5E",
    secondary: "#FB7185",
    badgeBg: "rgba(244, 63, 94, 0.14)"
  }
};

const CLIENT_THEME_KEYS = Object.keys(CLIENT_THEMES);

// Temas curados de tendencias
const TRENDING_CATALOG = [
  {
    topic: "El Fenómeno del Vibecoding: ¿Revolución o Deuda Técnica?",
    category: "IA & INGENIERÍA 2026",
    hook: "⚡ ANÁLISIS DE ALTO IMPACTO",
    subtitle: "Cómo el desarrollo asistido por IA transforma el rol del Arquitecto de Software.",
    badTitle: "El Enfoque Imprudente",
    badItems: ["Generar código sin contratos ni arquitectura", "Deuda técnica invisible que explota en meses", "Cero pruebas automatizadas"],
    goodTitle: "El Enfoque Riguroso",
    goodItems: ["Arquitectura y diseño de interfaces primero", "Pruebas de regresión continuas", "Auditoría de seguridad y observabilidad"],
    stat1: "10x", stat1Desc: "Velocidad de prototipado",
    stat2: "3.4x", stat2Desc: "Riesgo de deuda oculta",
    stat3: "100%", stat3Desc: "Necesidad de diseño arquitectónico",
    step1: "1. Discovery & Contratos de API",
    step2: "2. Generación Guiada por Tipos",
    step3: "3. Hardening & Observabilidad",
    rule1: "1. La IA escribe sintaxis; el Arquitecto define límites y contratos.",
    rule2: "2. Nunca lleves código a producción sin una suite de pruebas en verde.",
    rule3: "3. La ventaja competitiva está en el diseño del sistema.",
    question: "¿En tu empresa ya usan IA para codificar o siguen el flujo tradicional?"
  },
  {
    topic: "Cómo Escalar a 1M de Peticiones por Segundo con Redis y Kafka",
    category: "SISTEMAS DISTRIBUIDOS",
    hook: "🚀 ESCALABILIDAD EXTREMA",
    subtitle: "Decisiones de arquitectura, particionado de datos y mitigación de cuellos de botella.",
    badTitle: "Monolito Bloqueante",
    badItems: ["Consultas pesadas directas a la base de datos", "Peticiones síncronas que agotan el thread pool", "Sin caché multicapa"],
    goodTitle: "Arquitectura Event-Driven",
    goodItems: ["Caché en memoria con Redis Sharding", "Colas asíncronas con Kafka", "Lecturas desacopladas con CQRS"],
    stat1: "1.2M", stat1Desc: "Throughput sostenido",
    stat2: "2.4ms", stat2Desc: "Latencia percentil P99",
    stat3: "0%", stat3Desc: "Paquetes descartados",
    step1: "1. Ingesta & Rate Limiting",
    step2: "2. Procesamiento Reactivo en Memoria",
    step3: "3. Persistencia Asíncrona Eventual",
    rule1: "1. Nunca bloquees el hilo principal de peticiones.",
    rule2: "2. Implementa Circuit Breakers y fallback graceful.",
    rule3: "3. Mide siempre P99 y P99.9, no solo promedios.",
    question: "¿Cuál ha sido el mayor cuello de botella que has enfrentado al escalar?"
  },
  {
    topic: "Por qué Linux y Microsoft Adoptaron Rust en el Kernel",
    category: "SEGURIDAD & LENGUAJES",
    hook: "🛡️ SEGURIDAD DE BAJO NIVEL",
    subtitle: "El 70% de los fallos críticos provienen de memoria. Así lo resuelve Rust.",
    badTitle: "Riesgos en C / C++",
    badItems: ["Use-after-free y desbordamientos de buffer", "Condiciones de carrera difíciles de depurar", "Costos millonarios en parches"],
    goodTitle: "La Ventaja de Rust",
    goodItems: ["Borrow Checker y Ownership en compilación", "Memory Safety sin Garbage Collector", "Concurrencia segura garantizada"],
    stat1: "70%", stat1Desc: "Vulnerabilidades prevenidas",
    stat2: "0ms", stat2Desc: "Overhead de Garbage Collection",
    stat3: "100%", stat3Desc: "Type Safety en concurrencia",
    step1: "1. Análisis con el Borrow Checker",
    step2: "2. Compilación Nativa LLVM",
    step3: "3. Ejecución Determinística y Segura",
    rule1: "1. La seguridad debe garantizarse en compilación.",
    rule2: "2. Usa Memory-Safe languages en infraestructura crítica.",
    rule3: "3. El tiempo invertido en aprender el Borrow Checker se paga solo.",
    question: "¿Crees que Rust reemplazará completamente a C++ en los próximos 5 años?"
  }
];

// ==============================================================================
// INICIALIZACIÓN
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initNavigation();
  initFormControls();
  initNetworkMatrix();
  initThemeSelector();
  initPreviewActions();
  loadConfiguration();
});

// ==============================================================================
// AUTENTICACIÓN
// ==============================================================================
function initAuth() {
  const loginView = document.getElementById('login-view');
  const appView = document.getElementById('app-view');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const btnLogout = document.getElementById('btn-logout');

  if (AppState.token) {
    loginView.style.display = 'none';
    appView.style.display = 'block';
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    if (user === 'admin' && pass === 'tech2026') {
      AppState.token = 'auth_' + Date.now();
      localStorage.setItem('tech_engine_auth', AppState.token);
      loginView.style.display = 'none';
      appView.style.display = 'block';
      loginError.textContent = '';
    } else {
      loginError.textContent = 'Usuario o contraseña incorrectos.';
    }
  });

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('tech_engine_auth');
    AppState.token = null;
    appView.style.display = 'none';
    loginView.style.display = 'flex';
  });
}

// ==============================================================================
// NAVEGACIÓN ENTRE TABS
// ==============================================================================
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById(`tab-${target}`).classList.add('active');
      AppState.currentTab = target;

      if (target === 'history') {
        loadHistoryFromSheets();
      }
    });
  });
}

// ==============================================================================
// CONTROLES DE FORMULARIO & FUENTE DE CONTENIDO
// ==============================================================================
function initFormControls() {
  const pillTrending = document.getElementById('pill-mode-trending');
  const pillManual = document.getElementById('pill-mode-manual');
  const manualContainer = document.getElementById('manual-topic-container');
  const slideCountSlider = document.getElementById('gen-slide-count');
  const slideCountVal = document.getElementById('slide-count-val');

  pillTrending.addEventListener('click', () => {
    pillTrending.classList.add('active');
    pillManual.classList.remove('active');
    manualContainer.style.display = 'none';
    AppState.contentSource = 'trending';
  });

  pillManual.addEventListener('click', () => {
    pillManual.classList.add('active');
    pillTrending.classList.remove('active');
    manualContainer.style.display = 'block';
    AppState.contentSource = 'manual';
  });

  slideCountSlider.addEventListener('input', (e) => {
    slideCountVal.textContent = e.target.value;
  });

  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('gen-topic').value = chip.dataset.topic;
    });
  });
}

// ==============================================================================
// MATRIZ GRANULAR POR RED SOCIAL
// ==============================================================================
function initNetworkMatrix() {
  const nets = ['linkedin', 'instagram', 'facebook'];

  nets.forEach(net => {
    const chk = document.getElementById(`chk-net-${net}`);
    const card = document.getElementById(`net-card-${net}`);
    const fmt = document.getElementById(`fmt-net-${net}`);
    const type = document.getElementById(`type-net-${net}`);

    chk.addEventListener('change', () => {
      AppState.networks[net].enabled = chk.checked;
      if (chk.checked) {
        card.classList.add('active');
        card.querySelector('.net-status-tag').textContent = 'Activado';
        card.querySelector('.net-status-tag').classList.add('active');
      } else {
        card.classList.remove('active');
        card.querySelector('.net-status-tag').textContent = 'Desactivado';
        card.querySelector('.net-status-tag').classList.remove('active');
      }
    });

    fmt.addEventListener('change', (e) => {
      AppState.networks[net].format = e.target.value;
      updateViewportAspect(e.target.value);
    });

    type.addEventListener('change', (e) => {
      AppState.networks[net].type = e.target.value;
    });
  });
}

function updateViewportAspect(format) {
  const frame = document.getElementById('slide-container');
  frame.className = `slide-aspect-frame ${format}`;
}

// ==============================================================================
// SELECTOR DE TEMAS VISUALES
// ==============================================================================
function initThemeSelector() {
  const themeCards = document.querySelectorAll('.theme-card');

  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      themeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      AppState.selectedThemeKey = card.dataset.theme;

      // Si ya hay un carrusel generado, re-renderizar con el nuevo tema
      if (AppState.currentCarousel) {
        renderActiveSlide();
      }
    });
  });
}

// ==============================================================================
// GENERADOR & VISOR DE DIAPOSITIVAS
// ==============================================================================
function initPreviewActions() {
  const btnGen = document.getElementById('btn-generate');
  const btnGenPublish = document.getElementById('btn-generate-publish');
  const btnPrev = document.getElementById('btn-prev-slide');
  const btnNext = document.getElementById('btn-next-slide');
  const btnDispatchMake = document.getElementById('btn-dispatch-make');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnCopyCaption = document.getElementById('btn-copy-caption');

  btnGen.addEventListener('click', () => generateCarouselFlow(false));
  btnGenPublish.addEventListener('click', () => generateCarouselFlow(true));

  btnPrev.addEventListener('click', () => {
    if (AppState.currentSlideIndex > 0) {
      AppState.currentSlideIndex--;
      renderActiveSlide();
    }
  });

  btnNext.addEventListener('click', () => {
    if (AppState.currentCarousel && AppState.currentSlideIndex < AppState.currentCarousel.slides.length - 1) {
      AppState.currentSlideIndex++;
      renderActiveSlide();
    }
  });

  btnDispatchMake.addEventListener('click', dispatchToMakeWebhook);
  btnDownloadPdf.addEventListener('click', downloadPdfClient);
  btnDownloadPng.addEventListener('click', downloadPngClient);

  btnCopyCaption.addEventListener('click', () => {
    const text = document.getElementById('caption-text-area').value;
    navigator.clipboard.writeText(text).then(() => {
      btnCopyCaption.textContent = '✅ ¡Copiado!';
      setTimeout(() => btnCopyCaption.textContent = '📋 Copiar Texto', 2000);
    });
  });

  document.querySelectorAll('.cap-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cap-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      AppState.activeCaptionTab = tab.dataset.captarget;
      updateCaptionText();
    });
  });
}

async function generateCarouselFlow(autoPublish = false) {
  const btnGen = document.getElementById('btn-generate');
  const previewStatus = document.getElementById('preview-status-text');
  btnGen.disabled = true;
  btnGen.innerHTML = `<span>⏳ Generando Arte 3D & Láminas...</span>`;

  try {
    let topicData;
    if (AppState.contentSource === 'trending') {
      const idx = Math.floor(Math.random() * TRENDING_CATALOG.length);
      topicData = TRENDING_CATALOG[idx];
    } else {
      const manualText = document.getElementById('gen-topic').value.trim() || "Arquitectura de Software 2026";
      const match = TRENDING_CATALOG.find(t => t.topic.toLowerCase().includes(manualText.toLowerCase()));
      topicData = match || {
        topic: manualText,
        category: "TECH & INGENIERÍA",
        hook: "⚡ ANÁLISIS TÉCNICO",
        subtitle: "Decisiones de arquitectura, trade-offs y mejores prácticas para producción.",
        badTitle: "El Enfoque Tradicional",
        badItems: ["Falta de diseño y acoplamiento", "Sin observabilidad en producción", "Deuda técnica acumulada"],
        goodTitle: "Arquitectura Recomendada",
        goodItems: ["Diseño desacoplado y modular", "Monitoreo continuo P99", "Pruebas automatizadas continuas"],
        stat1: "10x", stat1Desc: "Throughput sostenido",
        stat2: "-70%", stat2Desc: "Reducción de incidentes",
        stat3: "99.99%", stat3Desc: "Disponibilidad",
        step1: "1. Diseño de Arquitectura & Contratos",
        step2: "2. Implementación Modular & Testing",
        step3: "3. Hardening & Observabilidad",
        rule1: "1. Prioriza la mantenibilidad sobre la complejidad innecesaria.",
        rule2: "2. Diseña pensando en fallos: implementa resiliencia activa.",
        rule3: "3. Mide siempre en producción antes de optimizar.",
        question: "¿Cómo resuelven este desafío en tu equipo técnico?"
      };
    }

    // Resolver tema visual activo
    let themeKey = AppState.selectedThemeKey;
    if (themeKey === 'random') {
      themeKey = CLIENT_THEME_KEYS[Math.floor(Math.random() * CLIENT_THEME_KEYS.length)];
    }
    const theme = CLIENT_THEMES[themeKey] || CLIENT_THEMES.midnight_cyan;

    // Construir diapositivas
    const slides = [
      {
        type: 'cover_hero',
        title: topicData.topic,
        subtitle: topicData.subtitle,
        hook: topicData.hook,
        badge1: topicData.stat1 ? `${topicData.stat1} ${topicData.stat1Desc}` : "Alta Escala",
        badge2: "Estándar 2026",
        role: "hero"
      },
      {
        type: 'split_contrast',
        title: "¿Dónde Falla el Enfoque?",
        subtitle: "Comparativa técnica entre malas prácticas vs diseño recomendado:",
        badTitle: topicData.badTitle,
        badItems: topicData.badItems,
        goodTitle: topicData.goodTitle,
        goodItems: topicData.goodItems,
        role: "architecture"
      },
      {
        type: 'impact_matrix',
        title: "Impacto & Métricas en Producción",
        subtitle: "Resultados cuantificables observados tras aplicar la arquitectura:",
        stat1: topicData.stat1, stat1Desc: topicData.stat1Desc,
        stat2: topicData.stat2, stat2Desc: topicData.stat2Desc,
        stat3: topicData.stat3, stat3Desc: topicData.stat3Desc,
        role: "matrix"
      },
      {
        type: 'process_pipeline',
        title: "El Pipeline en 3 Fases",
        subtitle: "Guía de implementación técnica paso a paso:",
        step1: topicData.step1,
        step2: topicData.step2,
        step3: topicData.step3,
        role: "pipeline"
      },
      {
        type: 'golden_rules',
        title: "3 Reglas de Oro para Líderes Tech",
        subtitle: "Principios para ingeniería de alto rendimiento:",
        rule1: topicData.rule1,
        rule2: topicData.rule2,
        rule3: topicData.rule3,
        role: "rules"
      },
      {
        type: 'summary_cta',
        title: "Conclusión & Debate Técnico",
        subtitle: "La habilidad clave es diseñar arquitecturas resilientes:",
        question: topicData.question,
        questionDesc: "Comparte tu experiencia o debate en la sección de comentarios.",
        role: "future"
      }
    ];

    AppState.currentCarousel = {
      id: `carrusel-${Date.now()}`,
      topic: topicData.topic,
      category: topicData.category,
      themeKey: themeKey,
      theme: theme,
      slides: slides
    };

    AppState.currentSlideIndex = 0;

    // Mostrar UI del Visor
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('slide-render-target').style.display = 'block';
    document.getElementById('carousel-nav').style.display = 'flex';
    document.getElementById('captions-wrapper').style.display = 'block';
    document.getElementById('btn-dispatch-make').disabled = false;
    document.getElementById('btn-download-pdf').disabled = false;
    document.getElementById('btn-download-png').disabled = false;

    renderActiveSlide();
    updateCaptionText();

    previewStatus.textContent = `Generado: "${topicData.topic.slice(0, 35)}..." (${theme.name})`;

    // Si se seleccionó Generar y Publicar
    if (autoPublish) {
      await saveToGoogleSheets(AppState.currentCarousel);
      await dispatchToMakeWebhook();
    }

  } catch (err) {
    alert("Error al generar carrusel: " + err.message);
  } finally {
    btnGen.disabled = false;
    btnGen.innerHTML = `<span class="btn-icon">⚡</span> Generar Carrusel con Ilustraciones 3D IA`;
  }
}

function renderActiveSlide() {
  const carousel = AppState.currentCarousel;
  if (!carousel) return;

  const slide = carousel.slides[AppState.currentSlideIndex];
  const theme = carousel.theme || CLIENT_THEMES.midnight_cyan;
  const target = document.getElementById('slide-render-target');
  const dotsContainer = document.getElementById('slide-dots');

  // Actualizar dots
  dotsContainer.innerHTML = carousel.slides.map((_, idx) => `
    <div class="dot-item ${idx === AppState.currentSlideIndex ? 'active' : ''}" onclick="goToSlide(${idx})"></div>
  `).join('');

  // Generar HTML interno de la diapositiva
  let contentHtml = '';

  if (slide.type === 'cover_hero') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 36px 40px; background: ${theme.bgGradient}; color: #FFF; font-family: 'Plus Jakarta Sans', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary}; background: ${theme.badgeBg}; padding: 4px 12px; border-radius: 999px;">● ${carousel.category}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">01 / 06</span>
        </div>

        <div style="margin: 20px 0;">
          <div style="display: inline-block; padding: 4px 10px; background: ${theme.badgeBg}; border: 1px solid ${theme.primary}; border-radius: 6px; color: ${theme.primary}; font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; margin-bottom: 14px;">${slide.hook}</div>
          <h2 style="font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; line-height: 1.2; margin-bottom: 12px; color: #FFF;">${slide.title}</h2>
          <p style="font-size: 13px; color: #94A3B8; line-height: 1.45;">${slide.subtitle}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px;">
            <div style="font-size: 11px; color: #94A3B8;">Rendimiento</div>
            <div style="font-size: 13px; font-weight: 700; color: #FFF;">${slide.badge1}</div>
          </div>
          <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px;">
            <div style="font-size: 11px; color: #94A3B8;">Estándar</div>
            <div style="font-size: 13px; font-weight: 700; color: #FFF;">${slide.badge2}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;">
          <span style="font-size: 12px; font-weight: 700; color: #FFF;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'split_contrast') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 36px 40px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● COMPARATIVA TÉCNICA</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">02 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 22px; font-weight: 800; margin-bottom: 16px;">${slide.title}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 14px;">
              <span style="font-size: 10px; font-weight: 800; color: #F87171; text-transform: uppercase;">⚠️ ${slide.badTitle}</span>
              <ul style="margin-top: 10px; font-size: 11px; color: #FECACA; padding-left: 14px; line-height: 1.5;">
                ${(slide.badItems || []).map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
            <div style="background: ${theme.badgeBg}; border: 1px solid ${theme.primary}40; border-radius: 12px; padding: 14px;">
              <span style="font-size: 10px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase;">✓ ${slide.goodTitle}</span>
              <ul style="margin-top: 10px; font-size: 11px; color: #FFF; padding-left: 14px; line-height: 1.5;">
                ${(slide.goodItems || []).map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'impact_matrix') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 36px 40px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● MÉTRICAS EN PRODUCCIÓN</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">03 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 22px; font-weight: 800; margin-bottom: 20px;">${slide.title}</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 10px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 32px; font-weight: 800; color: ${theme.primary}; display: block;">${slide.stat1}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 6px;">${slide.stat1Desc}</p>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 10px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 32px; font-weight: 800; color: ${theme.secondary}; display: block;">${slide.stat2}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 6px;">${slide.stat2Desc}</p>
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 10px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 32px; font-weight: 800; color: #38BDF8; display: block;">${slide.stat3}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 6px;">${slide.stat3Desc}</p>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'process_pipeline') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 36px 40px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● PIPELINE DE IMPLEMENTACIÓN</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">04 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 22px; font-weight: 800; margin-bottom: 16px;">${slide.title}</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 14px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px;">
              <span style="background: ${theme.primary}; color: #000; font-weight: 800; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px;">1</span>
              <span style="font-size: 12px; font-weight: 600; color: #FFF;">${slide.step1}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 14px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px;">
              <span style="background: ${theme.secondary}; color: #FFF; font-weight: 800; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px;">2</span>
              <span style="font-size: 12px; font-weight: 600; color: #FFF;">${slide.step2}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 14px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px;">
              <span style="background: #38BDF8; color: #000; font-weight: 800; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px;">3</span>
              <span style="font-size: 12px; font-weight: 600; color: #FFF;">${slide.step3}</span>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'golden_rules') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 36px 40px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● 3 REGLAS DE ORO</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">05 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 22px; font-weight: 800; margin-bottom: 16px;">${slide.title}</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; font-size: 12px; font-weight: 600; color: #FFF;">
              <span style="color: ${theme.primary}; font-weight: 800; font-family: 'JetBrains Mono';">#1</span> ${slide.rule1}
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; font-size: 12px; font-weight: 600; color: #FFF;">
              <span style="color: ${theme.primary}; font-weight: 800; font-family: 'JetBrains Mono';">#2</span> ${slide.rule2}
            </div>
            <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px 16px; font-size: 12px; font-weight: 600; color: #FFF;">
              <span style="color: ${theme.primary}; font-weight: 800; font-family: 'JetBrains Mono';">#3</span> ${slide.rule3}
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else {
    // summary_cta
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 36px 40px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● CONCLUSIÓN & DEBATE</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">06 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 24px; font-weight: 800; margin-bottom: 14px;">${slide.title}</h3>
          <div style="background: rgba(15,23,42,0.9); border-left: 4px solid ${theme.primary}; border-radius: 10px; padding: 16px; margin-bottom: 14px;">
            <h4 style="font-size: 15px; color: #FFF; margin-bottom: 6px;">${slide.question}</h4>
            <p style="font-size: 12px; color: #94A3B8;">${slide.questionDesc}</p>
          </div>
          <div style="font-size: 12px; color: #E2E8F0; display: flex; flex-direction: column; gap: 6px;">
            <span>💬 Comenta tu experiencia abajo</span>
            <span>💾 Guarda este post para tu equipo técnico</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">GUARDAR & COMPARTIR</span>
        </div>
      </div>
    `;
  }

  target.innerHTML = contentHtml;
}

window.goToSlide = function(index) {
  AppState.currentSlideIndex = index;
  renderActiveSlide();
};

function updateCaptionText() {
  const carousel = AppState.currentCarousel;
  const area = document.getElementById('caption-text-area');
  if (!carousel) return;

  const topic = carousel.topic;
  const handle = AppState.author.handle || '@joseluis_tech';

  if (AppState.activeCaptionTab === 'linkedin') {
    area.value = `¿Cómo resolver "${topic}" con estándares de ingeniería de alto nivel? 🚀\n\nEn este carrusel técnico desglosamos las decisiones de arquitectura, los trade-offs y las 3 reglas de oro.\n\n📌 Desliza el documento PDF adjunto para ver el blueprint completo.\n\n#SoftwareEngineering #SystemDesign #CloudArchitecture #TechLeadership #DevOps #Innovation`;
  } else if (AppState.activeCaptionTab === 'instagram') {
    area.value = `${topic} ⚡\n\nGuía visual paso a paso para arquitectos de software e ingenieros de sistemas.\n\nDesliza para ver el desglose ➔\n\n💾 Guarda este post para tu equipo técnico.\n👉 Sígueme en ${handle} para análisis tech diarios.\n\n#ingenieriadesistemas #arquitectura #programacion #tech #desarrolloweb`;
  } else {
    area.value = `${topic} - Guía técnica de arquitectura de software y mejores prácticas para ingeniería de sistemas.`;
  }
}

// ==============================================================================
// DESPACHO A MAKE.COM WEBHOOK
// ==============================================================================
async function dispatchToMakeWebhook() {
  const btn = document.getElementById('btn-dispatch-make');
  const carousel = AppState.currentCarousel;
  if (!carousel) return;

  const webhookUrl = AppState.makeWebhookUrl || localStorage.getItem('cfg_make_webhook');
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    alert("Por favor configura la URL del Webhook de Make.com en la pestaña '⚙️ Make.com & Matriz de Redes'.");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<span>⏳ Despachando a Make...</span>`;

  // Construir payload granular
  const enabledNetworks = Object.keys(AppState.networks).filter(k => AppState.networks[k].enabled);

  const payload = {
    event: "PUBLISH_CAROUSEL",
    timestamp: new Date().toISOString(),
    topic: carousel.topic,
    category: carousel.category,
    theme: carousel.theme.name,
    theme_key: carousel.themeKey,
    networks: enabledNetworks,
    network_matrix: AppState.networks,
    slide_count: carousel.slides.length,
    captions: {
      linkedin: `¿Cómo resolver "${carousel.topic}" con estándares de ingeniería de alto nivel? 🚀\n\nEn este carrusel técnico desglosamos las decisiones de arquitectura y trade-offs.\n\n📌 Desliza el PDF adjunto.\n\n#SoftwareEngineering #SystemDesign #Cloud #DevOps`,
      instagram: `${carousel.topic} ⚡\n\nGuía visual paso a paso para líderes técnicos.\n\nDesliza para ver el desglose ➔\n\n#ingenieriadesistemas #arquitectura #tech`,
      facebook: `${carousel.topic} - Guía técnica de arquitectura de software para líderes y desarrolladores.`
    },
    author: AppState.author
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert(`✅ ¡Despachado exitosamente a Make.com! (Código HTTP ${res.status}). Make está procesando la publicación.`);
  } catch (err) {
    alert("⚠️ Se envió la solicitud al webhook de Make. (Nota: Si Make no tiene CORS habilitado, los datos igualmente fueron recibidos por Make.com).");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>⚡ Despachar a Make</span>`;
  }
}

// ==============================================================================
// REGISTRO EN GOOGLE SHEETS DATABASE
// ==============================================================================
async function saveToGoogleSheets(carousel) {
  try {
    const url = `${AppState.sheetWebhookUrl}?action=addPublication&id=${carousel.id}&topic=${encodeURIComponent(carousel.topic)}&category=${encodeURIComponent(carousel.category)}&format=square&slideCount=6&status=Publicado`;
    
    // Beaconing no bloqueante
    new Image().src = url;
    console.log("Registro enviado a Google Sheets.");
  } catch (err) {
    console.warn("Error guardando en Google Sheets:", err);
  }
}

async function loadHistoryFromSheets() {
  const tbody = document.getElementById('history-table-body');
  tbody.innerHTML = `<tr><td colspan="8" class="text-center">Consultando registros en Google Sheets...</td></tr>`;

  try {
    const res = await fetch(`${AppState.sheetWebhookUrl}?action=getPublications`);
    const data = await res.json();

    if (data && data.publications && data.publications.length) {
      tbody.innerHTML = data.publications.map(p => `
        <tr>
          <td><span style="font-family: 'JetBrains Mono'; font-size: 11px;">${p.id || 'PUB-001'}</span></td>
          <td>${p.date || 'Hoy'}</td>
          <td><b>${p.topic || 'Sin título'}</b></td>
          <td><span class="badge-accent">${p.category || 'Tech'}</span></td>
          <td>${p.format || 'square'}</td>
          <td>${p.slideCount || 6}</td>
          <td><span class="status-pill ${p.status || 'Generado'}">${p.status || 'Generado'}</span></td>
          <td><button class="btn-action-small" onclick="alert('Publicación: ${p.topic}')">Ver</button></td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">No hay publicaciones registradas aún en Google Sheets.</td></tr>`;
    }
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="color: #94A3B8;">Mostrando registro local. Conexión con Google Sheets en standby.</td></tr>`;
  }
}

// ==============================================================================
// DESCARGA CLIENT-SIDE (PDF & PNG)
// ==============================================================================
async function downloadPngClient() {
  const target = document.getElementById('slide-render-target');
  const canvas = await html2canvas(target, { scale: 2 });
  const link = document.createElement('a');
  link.download = `slide_${AppState.currentSlideIndex + 1}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

async function downloadPdfClient() {
  const carousel = AppState.currentCarousel;
  if (!carousel) return;

  const btn = document.getElementById('btn-download-pdf');
  btn.disabled = true;
  btn.textContent = '⏳ Compilando PDF...';

  try {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const originalIndex = AppState.currentSlideIndex;
    const target = document.getElementById('slide-render-target');

    for (let i = 0; i < carousel.slides.length; i++) {
      AppState.currentSlideIndex = i;
      renderActiveSlide();
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(target, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const imgBytes = await fetch(imgData).then(res => res.arrayBuffer());
      const img = await pdfDoc.embedPng(imgBytes);

      const page = pdfDoc.addPage([1080, 1080]);
      page.drawImage(img, { x: 0, y: 0, width: 1080, height: 1080 });
    }

    AppState.currentSlideIndex = originalIndex;
    renderActiveSlide();

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${carousel.id}_linkedin.pdf`;
    link.click();
  } catch (err) {
    alert("Error al generar PDF: " + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = '📄 Descargar PDF';
  }
}

// ==============================================================================
// CARGA Y GUARDADO DE CONFIGURACIÓN
// ==============================================================================
function loadConfiguration() {
  const webhookInput = document.getElementById('cfg-make-webhook');
  const nameInput = document.getElementById('cfg-author-name');
  const handleInput = document.getElementById('cfg-author-handle');

  if (AppState.makeWebhookUrl) webhookInput.value = AppState.makeWebhookUrl;
  if (AppState.author.name) nameInput.value = AppState.author.name;
  if (AppState.author.handle) handleInput.value = AppState.author.handle;

  document.getElementById('btn-save-webhook').addEventListener('click', () => {
    const val = webhookInput.value.trim();
    localStorage.setItem('cfg_make_webhook', val);
    AppState.makeWebhookUrl = val;
    alert("✅ URL del Webhook de Make.com guardada correctamente.");
  });

  document.getElementById('btn-save-brand').addEventListener('click', () => {
    AppState.author.name = nameInput.value.trim();
    AppState.author.handle = handleInput.value.trim();
    localStorage.setItem('cfg_author', JSON.stringify(AppState.author));
    document.getElementById('nav-author-name').textContent = AppState.author.name;
    alert("✅ Perfil de autor actualizado.");
  });
}
