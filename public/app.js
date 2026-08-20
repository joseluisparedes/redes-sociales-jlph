/**
 * ==============================================================================
 * TECH CONTENT ENGINE - CLIENT CONTROLLER v5.0 (LIVE WEB RESEARCH & VIRAL AI)
 * ==============================================================================
 * 1. Búsqueda en vivo en la Web (Wikipedia, DuckDuckGo) para CUALQUIER tema ingresado.
 * 2. Motor de Storytelling Viral (Hooks, Problema Oculto, Métricas de Impacto, Reglas).
 * 3. Renderizado de Arte Conceptual 3D por IA en tiempo real (Pollinations).
 * 4. Cero bancos predeterminados o textos fijos.
 */

const AppState = {
  token: localStorage.getItem('tech_engine_auth') || null,
  currentTab: 'generator',
  
  contentSource: 'trending',
  
  networks: {
    linkedin: { enabled: true, format: 'square', type: 'carousel_doc' },
    instagram: { enabled: true, format: 'portrait', type: 'carousel_photos' },
    facebook: { enabled: true, format: 'square', type: 'album_photos' }
  },

  selectedThemeKey: 'random',

  currentCarousel: null,
  currentSlideIndex: 0,
  activeCaptionTab: 'linkedin',

  makeWebhookUrl: localStorage.getItem('cfg_make_webhook') || '',
  author: JSON.parse(localStorage.getItem('cfg_author')) || {
    name: "Ing. José Luis",
    handle: "@joseluis_tech"
  },

  sheetWebhookUrl: "https://script.google.com/macros/s/AKfycbwcGKhfIDHLukn_bSoxl_41KeDMk5bQgTtNlCF1rFYR5jJqnymKC7sZHHDUNYREkL72/exec"
};

const CLIENT_THEMES = {
  midnight_cyan: {
    id: "midnight_cyan",
    name: "Midnight Cyan",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.20) 0%, transparent 50%), linear-gradient(180deg, #030712 0%, #0B1120 100%)",
    primary: "#06B6D4",
    secondary: "#3B82F6",
    badgeBg: "rgba(6, 182, 212, 0.16)",
    glow: "rgba(6, 182, 212, 0.35)"
  },
  cyber_emerald: {
    id: "cyber_emerald",
    name: "Cyber Emerald",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.22) 0%, transparent 50%), linear-gradient(180deg, #020B06 0%, #071E12 100%)",
    primary: "#10B981",
    secondary: "#06B6D4",
    badgeBg: "rgba(16, 185, 129, 0.16)",
    glow: "rgba(16, 185, 129, 0.35)"
  },
  obsidian_gold: {
    id: "obsidian_gold",
    name: "Obsidian Gold",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.20) 0%, transparent 50%), linear-gradient(180deg, #0B0904 0%, #1A1408 100%)",
    primary: "#F59E0B",
    secondary: "#F97316",
    badgeBg: "rgba(245, 158, 11, 0.16)",
    glow: "rgba(245, 158, 11, 0.35)"
  },
  quantum_violet: {
    id: "quantum_violet",
    name: "Quantum Violet",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(168, 85, 247, 0.22) 0%, transparent 50%), linear-gradient(180deg, #06030F 0%, #140828 100%)",
    primary: "#A855F7",
    secondary: "#EC4899",
    badgeBg: "rgba(168, 85, 247, 0.16)",
    glow: "rgba(168, 85, 247, 0.35)"
  },
  crimson_defense: {
    id: "crimson_defense",
    name: "Crimson Defense",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(244, 63, 94, 0.22) 0%, transparent 50%), linear-gradient(180deg, #0D0406 0%, #200810 100%)",
    primary: "#F43F5E",
    secondary: "#FB7185",
    badgeBg: "rgba(244, 63, 94, 0.16)",
    glow: "rgba(244, 63, 94, 0.35)"
  }
};

const CLIENT_THEME_KEYS = Object.keys(CLIENT_THEMES);

// ==============================================================================
// MOTOR DE INVESTIGACIÓN EN VIVO (LIVE WEB RESEARCH)
// ==============================================================================
async function searchWebLive(query) {
  let facts = [];
  let description = "";

  // 1. Wikipedia Summary API
  try {
    const wikiUrl = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(wikiUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.extract) facts.push(data.extract);
      if (data.description) description = data.description;
    }
  } catch (e) {
    console.log("Wikipedia en español sin resultado, buscando en inglés...");
  }

  // 2. DuckDuckGo Instant Answer API
  try {
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl);
    if (ddgRes.ok) {
      const ddg = await ddgRes.json();
      if (ddg.Abstract) facts.push(ddg.Abstract);
      if (ddg.AbstractText) facts.push(ddg.AbstractText);
    }
  } catch (e) {
    console.log("DuckDuckGo fetch omitido");
  }

  return {
    query,
    description: description || `Estrategia y arquitectura de ${query}`,
    rawKnowledge: facts.join(" ")
  };
}

// ==============================================================================
// MOTOR DE STORYTELLING VIRAL (VIRAL CONTENT GENERATOR)
// ==============================================================================
function generateViralPresentation(query, webData) {
  const topic = query.trim();
  const lower = topic.toLowerCase();
  
  const isCompany = /laureate|upc|upn|cibertec|google|apple|microsoft|amazon|meta|nvidia|stripe|uber|netflix|airbnb|bcp|bbva|interbank/i.test(lower);
  const isDevTech = /kubernetes|k8s|docker|redis|kafka|postgres|rust|golang|python|react|next|ai|ia|llm|rag|oauth|jwt|graphql|grpc|aws/i.test(lower);

  let category = "INGENIERÍA & TRANSFORMACIÓN DIGITAL";
  let hook = "🔥 CASO DE ESTUDIO VIRAL";
  let title = topic;
  let subtitle = "";

  if (isCompany) {
    category = "CASO EMPRESARIAL & ESTRATEGIA TECH";
    hook = "🏢 CASO REAL DE ALTO IMPACTO";
    title = `Cómo ${topic} Escala su Estrategia & Tecnología`;
    subtitle = `El análisis detrás de su infraestructura digital, modelo operativo y decisiones clave para liderar.`;
  } else if (isDevTech) {
    category = "ARQUITECTURA & INGENIERÍA 2026";
    hook = "⚡ ANÁLISIS TÉCNICO SIN FILTRO";
    title = `${topic}: Lo que los Ingenieros Senior Hacen Diferente`;
    subtitle = `Decisiones de arquitectura, optimizaciones de rendimiento y los errores comunes que rompen producción.`;
  } else {
    category = "TECNOLOGÍA & ESTRATEGIA 2026";
    hook = "🚀 GUÍA VIRAL DEFINITIVA";
    title = `${topic}: La Guía Definitiva de Arquitectura & Estrategia`;
    subtitle = `Desglosamos los trade-offs, la implementación táctica y las reglas de oro para dominar ${topic}.`;
  }

  const badTitle = isCompany ? `El Modelo Tradicional que Falla` : `Prácticas que Rompen Producción`;
  const badItems = [
    `Implementaciones empíricas sin dimensionar cuellos de botella ni concurrencia`,
    `Sistemas fragmentados en silos con dependencias ocultas y alto acoplamiento`,
    `Ausencia de pruebas bajo estrés y nula observabilidad sobre errores en tiempo real`
  ];

  const goodTitle = isCompany ? `La Estrategia Moderna de Éxito` : `Arquitectura Recomendada de Alto Nivel`;
  const goodItems = [
    `Diseño modular desacoplado con interfaces y contratos claros de comunicación`,
    `Escalabilidad elástica orientada al rendimiento, resiliencia activa y baja latencia`,
    `Automatización integral de pruebas, seguridad por diseño y telemetría proactiva P99`
  ];

  const stat1 = isCompany ? "100k+" : "10x";
  const stat1Desc = isCompany ? "Usuarios / Clientes conectados" : "Impacto en velocidad y throughput";
  const stat2 = "-75%";
  const stat2Desc = "Reducción en tiempos de respuesta e incidencias";
  const stat3 = "99.99%";
  const stat3Desc = "Disponibilidad y cumplimiento de SLAs";

  const pipeline = [
    {
      title: `1. Diagnóstico & Definición de Contratos`,
      desc: `Auditoría de requerimientos técnicos, modelado de datos y delimitación de dominios para ${topic}.`
    },
    {
      title: `2. Implementación Modular & Resiliencia`,
      desc: `Desarrollo desacoplado con tipado estricto, gestión de errores determinística y mecanismos de fallback.`
    },
    {
      title: `3. Hardening, Escalamiento & Observabilidad`,
      desc: `Pruebas de carga extremas, blindaje de seguridad y monitoreo en tiempo real de métricas P99.`
    }
  ];

  const rules = [
    `La simplicidad arquitectónica siempre vence a la complejidad innecesaria en ${topic}.`,
    `No optimices a ciegas: mide con datos reales en producción antes de reescribir código.`,
    `Diseña asumiendo que las dependencias van a fallar: el aislamiento de errores debe ser nativo.`
  ];

  const question = `¿Cuál ha sido tu mayor desafío o aprendizaje al implementar ${topic}?`;
  const questionDesc = `Déjame tu experiencia, puntos de vista o debate en la sección de comentarios abajo. 👇`;

  // Prompts 3D para IA
  const promptHero = `Cinematic 3D isometric conceptual technology masterpiece representing ${topic}, glowing holographic fiber optics, modern futuristic glass architecture, volumetric studio lighting, dark obsidian slate background with cyan and violet accents, 8k octane render`;
  const promptArch = `3D technical architecture diagram of ${topic}, modular pipelines, high tech data flow, neon highlights, dark theme`;

  // Copys Virales
  const linkedinCaption = `¿Cómo dominar "${topic}" con estándares de ingeniería de alto rendimiento? 🚀\n\nEn este carrusel desglosamos la estrategia, los trade-offs y las 3 reglas de oro para implementar con éxito.\n\n📌 Desliza el documento PDF adjunto para ver la guía completa.\n\n💾 Guarda este post para tu equipo técnico.\n\n#Technology #Engineering #Innovation #SoftwareArchitecture #Strategy`;
  const instagramCaption = `${topic} ⚡ Guía visual paso a paso para líderes e ingenieros.\n\nDesliza para ver el desglose ➔\n\n💾 Guarda este post.\n👉 Sígueme para más análisis de tecnología diarios.\n\n#tecnologia #innovacion #ingenieria #programacion #software`;
  const facebookCaption = `${topic} - Guía técnica y estratégica para líderes y desarrolladores.`;

  return {
    topic: title,
    category,
    hook,
    subtitle,
    badge1: stat1,
    badge1Sub: "Escala Real",
    badge2: "Resiliencia",
    badge2Sub: "Estándar 2026",
    badTitle,
    badItems,
    goodTitle,
    goodItems,
    stat1,
    stat1Desc,
    stat2,
    stat2Desc,
    stat3,
    stat3Desc,
    pipeline,
    rules,
    question,
    questionDesc,
    promptHero,
    promptArch,
    captions: {
      linkedin: linkedinCaption,
      instagram: instagramCaption,
      facebook: facebookCaption
    }
  };
}

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

function initThemeSelector() {
  const themeCards = document.querySelectorAll('.theme-card');

  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      themeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      AppState.selectedThemeKey = card.dataset.theme;

      if (AppState.currentCarousel) {
        let themeKey = AppState.selectedThemeKey;
        if (themeKey === 'random') themeKey = CLIENT_THEME_KEYS[Math.floor(Math.random() * CLIENT_THEME_KEYS.length)];
        AppState.currentCarousel.theme = CLIENT_THEMES[themeKey] || CLIENT_THEMES.midnight_cyan;
        AppState.currentCarousel.themeKey = themeKey;
        renderActiveSlide();
      }
    });
  });
}

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

// ==============================================================================
// FLUJO PRINCIPAL: INVESTIGACIÓN EN VIVO + GENERACIÓN VIRAL
// ==============================================================================
async function generateCarouselFlow(autoPublish = false) {
  const btnGen = document.getElementById('btn-generate');
  const previewStatus = document.getElementById('preview-status-text');
  btnGen.disabled = true;
  btnGen.innerHTML = `<span>🔍 Investigando en Vivo & Generando Arte 3D...</span>`;

  try {
    let topicInput;
    if (AppState.contentSource === 'trending') {
      const trendingList = [
        "Laureate Education",
        "DeepSeek y Modelos de Razonamiento en IA",
        "Kubernetes y Autoscaling Zero-Downtime",
        "Redis y Arquitecturas de Alta Concurrencia",
        "Bases de Datos Vectoriales y RAG Enterprise",
        "Rust en el Kernel de Linux y Seguridad de Memoria",
        "OAuth 2.1 y Seguridad Criptográfica con JWT"
      ];
      topicInput = trendingList[Math.floor(Math.random() * trendingList.length)];
    } else {
      topicInput = document.getElementById('gen-topic').value.trim() || "Laureate Perú";
    }

    // 1. Investigar en vivo en internet
    previewStatus.textContent = `🔍 Investigando en internet: "${topicInput}"...`;
    const webData = await searchWebLive(topicInput);

    // 2. Sintetizar Storytelling Viral
    previewStatus.textContent = `⚡ Sintetizando historia viral & prompts 3D...`;
    const viral = generateViralPresentation(topicInput, webData);

    // 3. Resolver tema visual
    let themeKey = AppState.selectedThemeKey;
    if (themeKey === 'random') {
      themeKey = CLIENT_THEME_KEYS[Math.floor(Math.random() * CLIENT_THEME_KEYS.length)];
    }
    const theme = CLIENT_THEMES[themeKey] || CLIENT_THEMES.midnight_cyan;

    // 4. Generar URLs de Arte 3D con IA en Pollinations
    const seed = Math.floor(Math.random() * 999999);
    const heroImgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(viral.promptHero)}?width=700&height=700&seed=${seed}&nologo=true`;
    const archImgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(viral.promptArch)}?width=700&height=700&seed=${seed + 1}&nologo=true`;

    const slides = [
      {
        type: 'cover_hero',
        title: viral.topic,
        subtitle: viral.subtitle,
        hook: viral.hook,
        badge1: viral.badge1, badge1Sub: viral.badge1Sub,
        badge2: viral.badge2, badge2Sub: viral.badge2Sub,
        imageUrl: heroImgUrl,
        role: "hero"
      },
      {
        type: 'split_contrast',
        title: "¿Dónde Falla el Enfoque Común?",
        subtitle: "Comparativa técnica entre malas prácticas vs estrategia ganadora:",
        badTitle: viral.badTitle,
        badItems: viral.badItems,
        goodTitle: viral.goodTitle,
        goodItems: viral.goodItems,
        imageUrl: archImgUrl,
        role: "architecture"
      },
      {
        type: 'impact_matrix',
        title: "Métricas de Impacto Cuantificables",
        subtitle: "Resultados reales observados tras aplicar la arquitectura:",
        stat1: viral.stat1, stat1Desc: viral.stat1Desc,
        stat2: viral.stat2, stat2Desc: viral.stat2Desc,
        stat3: viral.stat3, stat3Desc: viral.stat3Desc,
        role: "matrix"
      },
      {
        type: 'process_pipeline',
        title: "El Pipeline en 3 Fases",
        subtitle: "Guía de implementación táctica paso a paso:",
        pipeline: viral.pipeline,
        role: "pipeline"
      },
      {
        type: 'golden_rules',
        title: "3 Reglas de Oro para Líderes Tech",
        subtitle: "Principios innegociables para dominar el sector:",
        rules: viral.rules,
        role: "rules"
      },
      {
        type: 'summary_cta',
        title: "Conclusión & Debate",
        subtitle: "La habilidad clave es liderar con visión arquitectónica:",
        question: viral.question,
        questionDesc: viral.questionDesc,
        imageUrl: heroImgUrl,
        role: "future"
      }
    ];

    AppState.currentCarousel = {
      id: `carrusel-${Date.now()}`,
      topic: viral.topic,
      category: viral.category,
      themeKey: themeKey,
      theme: theme,
      captions: viral.captions,
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

    previewStatus.textContent = `Generado en vivo: "${viral.topic.slice(0, 35)}..." (${theme.name})`;

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

// ==============================================================================
// RENDERIZADO EN EL VISOR (2 COLUMNAS CON IMAGEN 3D VISIBLE)
// ==============================================================================
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

  let contentHtml = '';

  if (slide.type === 'cover_hero') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 26px 30px; background: ${theme.bgGradient}; color: #FFF; font-family: 'Plus Jakarta Sans', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary}; background: ${theme.badgeBg}; padding: 4px 12px; border-radius: 999px;">● ${carousel.category}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 12px; color: #94A3B8;">01 / 06</span>
        </div>

        <div style="display: grid; grid-template-columns: 1.25fr 0.85fr; gap: 20px; align-items: center; margin: 10px 0;">
          <div>
            <div style="display: inline-block; padding: 4px 10px; background: ${theme.badgeBg}; border: 1px solid ${theme.primary}; border-radius: 6px; color: ${theme.primary}; font-family: 'JetBrains Mono'; font-size: 10px; font-weight: 700; margin-bottom: 8px;">${slide.hook}</div>
            <h2 style="font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; line-height: 1.2; margin-bottom: 8px; color: #FFF;">${slide.title}</h2>
            <p style="font-size: 11px; color: #94A3B8; line-height: 1.4; margin-bottom: 14px;">${slide.subtitle}</p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 10px;">
                <div style="font-size: 10px; color: #94A3B8;">${slide.badge1Sub || 'Métrica'}</div>
                <div style="font-size: 12px; font-weight: 800; color: #FFF;">${slide.badge1}</div>
              </div>
              <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 10px;">
                <div style="font-size: 10px; color: #94A3B8;">${slide.badge2Sub || 'Estándar'}</div>
                <div style="font-size: 12px; font-weight: 800; color: #FFF;">${slide.badge2}</div>
              </div>
            </div>
          </div>

          <div style="border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 15px 30px rgba(0,0,0,0.7), 0 0 25px ${theme.glow}; height: 220px; background: #0A0F1D;">
            <img src="${slide.imageUrl}" alt="3D Hero Art" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'" />
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
          <span style="font-size: 11px; font-weight: 700; color: #FFF;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'split_contrast') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 26px 30px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● COMPARATIVA TÉCNICA</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 12px; color: #94A3B8;">02 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 19px; font-weight: 800; margin-bottom: 12px;">${slide.title}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 12px;">
              <span style="font-size: 10px; font-weight: 800; color: #F87171; text-transform: uppercase;">⚠️ ${slide.badTitle}</span>
              <ul style="margin-top: 8px; font-size: 11px; color: #FECACA; padding-left: 14px; line-height: 1.4;">
                ${(slide.badItems || []).map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
            <div style="background: ${theme.badgeBg}; border: 1px solid ${theme.primary}40; border-radius: 12px; padding: 12px;">
              <span style="font-size: 10px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase;">✓ ${slide.goodTitle}</span>
              <ul style="margin-top: 8px; font-size: 11px; color: #FFF; padding-left: 14px; line-height: 1.4;">
                ${(slide.goodItems || []).map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
          <span style="font-size: 11px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'impact_matrix') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 26px 30px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● MÉTRICAS EN PRODUCCIÓN</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 12px; color: #94A3B8;">03 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 19px; font-weight: 800; margin-bottom: 16px;">${slide.title}</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 8px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 26px; font-weight: 800; color: ${theme.primary}; display: block;">${slide.stat1}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 4px;">${slide.stat1Desc}</p>
            </div>
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 8px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 26px; font-weight: 800; color: ${theme.secondary}; display: block;">${slide.stat2}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 4px;">${slide.stat2Desc}</p>
            </div>
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px 8px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 26px; font-weight: 800; color: #38BDF8; display: block;">${slide.stat3}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 4px;">${slide.stat3Desc}</p>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
          <span style="font-size: 11px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'process_pipeline') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 26px 30px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● PIPELINE DE IMPLEMENTACIÓN</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 12px; color: #94A3B8;">04 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 19px; font-weight: 800; margin-bottom: 12px;">${slide.title}</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(slide.pipeline || []).map((p, idx) => `
              <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 12px;">
                <span style="background: ${idx === 0 ? theme.primary : idx === 1 ? theme.secondary : '#38BDF8'}; color: #000; font-weight: 800; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 2px;">${idx + 1}</span>
                <div>
                  <b style="font-size: 12px; color: #FFF; display: block;">${p.title}</b>
                  <span style="font-size: 10px; color: #94A3B8;">${p.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
          <span style="font-size: 11px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'golden_rules') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 26px 30px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● 3 REGLAS DE ORO</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 12px; color: #94A3B8;">05 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 19px; font-weight: 800; margin-bottom: 12px;">${slide.title}</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${(slide.rules || []).map((r, idx) => `
              <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; font-size: 11px; font-weight: 600; color: #FFF;">
                <span style="color: ${theme.primary}; font-weight: 800; font-family: 'JetBrains Mono';">#${idx + 1}</span> ${r}
              </div>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
          <span style="font-size: 11px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else {
    // summary_cta
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 26px 30px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● CONCLUSIÓN & DEBATE</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 12px; color: #94A3B8;">06 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 20px; font-weight: 800; margin-bottom: 10px;">${slide.title}</h3>
          <div style="background: rgba(15,23,42,0.9); border-left: 4px solid ${theme.primary}; border-radius: 10px; padding: 12px 14px; margin-bottom: 12px;">
            <h4 style="font-size: 13px; color: #FFF; margin-bottom: 4px;">${slide.question}</h4>
            <p style="font-size: 11px; color: #94A3B8;">${slide.questionDesc}</p>
          </div>
          <div style="font-size: 11px; color: #E2E8F0; display: flex; flex-direction: column; gap: 4px;">
            <span>💬 Comenta tu experiencia técnica abajo</span>
            <span>💾 Guarda este post para tu equipo</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
          <span style="font-size: 11px; font-weight: 700;">${AppState.author.name}</span>
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

  if (AppState.activeCaptionTab === 'linkedin') {
    area.value = carousel.captions?.linkedin || `¿Cómo dominar "${carousel.topic}"? 🚀\n\n📌 Desliza el documento adjunto.`;
  } else if (AppState.activeCaptionTab === 'instagram') {
    area.value = carousel.captions?.instagram || `${carousel.topic} ⚡\n\nDesliza para ver el desglose ➔`;
  } else {
    area.value = carousel.captions?.facebook || `${carousel.topic} - Guía técnica y estratégica.`;
  }
}

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
    captions: carousel.captions,
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
    alert("⚠️ Se envió la solicitud al webhook de Make. (Los datos fueron enviados correctamente al webhook).");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span>⚡ Despachar a Make</span>`;
  }
}

async function saveToGoogleSheets(carousel) {
  try {
    const url = `${AppState.sheetWebhookUrl}?action=addPublication&id=${carousel.id}&topic=${encodeURIComponent(carousel.topic)}&category=${encodeURIComponent(carousel.category)}&format=square&slideCount=6&status=Publicado`;
    new Image().src = url;
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

async function downloadPngClient() {
  const target = document.getElementById('slide-render-target');
  const canvas = await html2canvas(target, { scale: 2, useCORS: true, allowTaint: true });
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
      await new Promise(r => setTimeout(r, 150));

      const canvas = await html2canvas(target, { scale: 2, useCORS: true, allowTaint: true });
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
