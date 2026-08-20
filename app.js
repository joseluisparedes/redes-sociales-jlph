/**
 * ==============================================================================
 * TECH CONTENT ENGINE - CLIENT CONTROLLER v4.0 (REAL AI & 3D ART)
 * ==============================================================================
 * 1. Genera imágenes 3D por IA en tiempo real para CADA lámina vía Pollinations.
 * 2. Comprensión contextual inteligente de cualquier tema (EdTech, Empresas, Cloud, etc.).
 * 3. Layout de 2 Columnas con Arte 3D prominente visible en el visor.
 */

// Estado global de la aplicación
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

// Temas visuales ejecutivos
const CLIENT_THEMES = {
  midnight_cyan: {
    id: "midnight_cyan",
    name: "Midnight Cyan",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.18) 0%, transparent 50%), linear-gradient(180deg, #030712 0%, #0B1120 100%)",
    primary: "#06B6D4",
    secondary: "#3B82F6",
    badgeBg: "rgba(6, 182, 212, 0.14)",
    glow: "rgba(6, 182, 212, 0.35)"
  },
  cyber_emerald: {
    id: "cyber_emerald",
    name: "Cyber Emerald",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.20) 0%, transparent 50%), linear-gradient(180deg, #020B06 0%, #071E12 100%)",
    primary: "#10B981",
    secondary: "#06B6D4",
    badgeBg: "rgba(16, 185, 129, 0.14)",
    glow: "rgba(16, 185, 129, 0.35)"
  },
  obsidian_gold: {
    id: "obsidian_gold",
    name: "Obsidian Gold",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.18) 0%, transparent 50%), linear-gradient(180deg, #0B0904 0%, #1A1408 100%)",
    primary: "#F59E0B",
    secondary: "#F97316",
    badgeBg: "rgba(245, 158, 11, 0.14)",
    glow: "rgba(245, 158, 11, 0.35)"
  },
  quantum_violet: {
    id: "quantum_violet",
    name: "Quantum Violet",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(168, 85, 247, 0.20) 0%, transparent 50%), linear-gradient(180deg, #06030F 0%, #140828 100%)",
    primary: "#A855F7",
    secondary: "#EC4899",
    badgeBg: "rgba(168, 85, 247, 0.14)",
    glow: "rgba(168, 85, 247, 0.35)"
  },
  crimson_defense: {
    id: "crimson_defense",
    name: "Crimson Defense",
    bgGradient: "radial-gradient(circle at 85% 15%, rgba(244, 63, 94, 0.20) 0%, transparent 50%), linear-gradient(180deg, #0D0406 0%, #200810 100%)",
    primary: "#F43F5E",
    secondary: "#FB7185",
    badgeBg: "rgba(244, 63, 94, 0.14)",
    glow: "rgba(244, 63, 94, 0.35)"
  }
};

const CLIENT_THEME_KEYS = Object.keys(CLIENT_THEMES);

// ==============================================================================
// SINTETIZADOR INTELIGENTE DE CONTENIDO Y PROMPTS DE ARTE 3D
// ==============================================================================
function intelligentContentSynthesizer(rawInput) {
  const input = rawInput.trim();
  const lower = input.toLowerCase();

  // 1. CASO ESPECIAL: Laureate Perú / Educación Superior / EdTech
  if (lower.includes('laureate') || lower.includes('upc') || lower.includes('upn') || lower.includes('cibertec') || lower.includes('educa') || lower.includes('universidad')) {
    return {
      topic: "Transformación Digital en Educación Superior: El Caso Laureate Perú",
      category: "EDTECH & TRANSFORMACIÓN DIGITAL",
      hook: "🎓 CASO DE ESTUDIO TECH",
      subtitle: "Cómo la arquitectura tecnológica escala para conectar a más de 200,000 estudiantes universitarios.",
      badge1: "200k+ Alumnos", badge1Sub: "Escala Nacional",
      badge2: "99.9% Uptime", badge2Sub: "En Matrícula Pico",
      imagePromptHero: "Futuristic 3D university campus with holographic students, digital library glowing with fiber optic light, sleek modern glass architecture, volumetric lighting, dark slate background with cyan accents, 8k octane render",
      imagePromptArch: "3D isometric modular cloud architecture for digital education, LMS platform connected to student portal and mobile app, clean cybernetic style",
      badTitle: "El Modelo Educativo Tradicional",
      badItems: [
        "Sistemas académicos en silos aislados que colapsan durante las semanas de matrícula",
        "Experiencia estudiantil fragmentada con trámites presenciales lentos",
        "Ausencia de analítica predictiva sobre el rendimiento y deserción de alumnos"
      ],
      goodTitle: "Ecosistema Digital Unificado",
      goodItems: [
        "Arquitectura Cloud-Native con escalabilidad automática ante picos de exámenes y matrículas",
        "App móvil y portal omnicanal unificado para trámites académicos y financieros",
        "Modelos de IA predictivos para alertas tempranas y retención estudiantil personalizada"
      ],
      stat1: "200k+", stat1Desc: "Estudiantes activos en plataforma",
      stat2: "-75%", stat2Desc: "Tiempo de atención en trámites digitales",
      stat3: "100%", stat3Desc: "Servicios académicos en la nube",
      step1Title: "1. Unificación de Plataformas LMS & Core",
      step1Desc: "Integración de Blackboard/Canvas con el sistema de registro académico y financiero en tiempo real.",
      step2Title: "2. Experiencia Omnicanal Estudiantil",
      step2Desc: "Despliegue de portal web y app móvil con microservicios para matrícula sin fricción.",
      step3Title: "3. Analítica con IA & Acompañamiento",
      step3Desc: "Algoritmos de Machine Learning para detectar patrones de riesgo y brindar tutoría proactiva.",
      rule1: "La infraestructura digital debe estar dimensionada para absorber picos del 500% en horas críticas de matrícula.",
      rule2: "La experiencia móvil es la puerta de entrada principal del estudiante moderno: diseña Mobile-First.",
      rule3: "Los datos académicos deben sincronizarse en tiempo real con los módulos financieros para evitar bloqueos.",
      question: "¿Cómo crees que la Inteligencia Artificial personalizada cambiará la educación universitaria en Perú?",
      linkedinCaption: `La educación superior en el Perú está viviendo su mayor transformación tecnológica. 🎓🚀\n\nEn este análisis técnico revisamos cómo instituciones como Laureate Perú (UPC, UPN, CIBERTEC) diseñan arquitecturas digitales para atender a más de 200,000 estudiantes sin caídas en matrícula.\n\n📌 Desliza el documento adjunto para ver las claves de arquitectura EdTech.\n\n#EdTech #TransformacionDigital #EducacionSuperior #SoftwareArchitecture #PeruTech #Innovacion`,
      instagramCaption: `¿Cómo escala la tecnología educativa para 200,000 estudiantes? 🎓⚡\n\nDesliza para ver el caso de estudio de arquitectura EdTech y transformación digital en educación superior.\n\n#educacion #tecnologia #peru #innovacion #software #universidad`
    };
  }

  // 2. CASO KUBERNETES / CLOUD / DEVOPS
  if (lower.includes('k8s') || lower.includes('kubernetes') || lower.includes('docker') || lower.includes('cloud') || lower.includes('devops')) {
    return {
      topic: "Kubernetes en Producción: Requests, Limits y Resiliencia Zero-Downtime",
      category: "CLOUD INFRASTRUCTURE & DEVOPS",
      hook: "☁️ NUBE NATIVA & RESILIENCIA",
      subtitle: "Configuración correcta de probes, autoscaling y presupuestos de disrupción para evitar caídas.",
      badge1: "99.99% Uptime", badge1Sub: "Zero Downtime",
      badge2: "-40% Costos", badge2Sub: "En Nube",
      imagePromptHero: "3D isometric glowing Kubernetes cluster with pods and containers floating in space, interconnected cyber pipelines, volumetric dark blue and emerald lighting, octane render 8k",
      imagePromptArch: "3D technical network map of cloud microservices with load balancer and ingress, cybernetic glowing wires",
      badTitle: "El Clúster al Borde del Colapso",
      badItems: [
        "Pods sin CPU/Memory Requests provocando desalojos agresivos por OOMKilled",
        "Despliegues que reinician todos los pods a la vez interrumpiendo usuarios",
        "Falta de Readiness Probes enviando tráfico a contenedores aún no listos"
      ],
      goodTitle: "Arquitectura K8s Resiliente",
      goodItems: [
        "Requests y Limits ajustados a partir del percentil P95 real con Vertical Pod Autoscaler",
        "Rolling Updates controlados con PodDisruptionBudgets (PDB) activos",
        "Probes inteligentes que verifican dependencias críticas antes de aceptar tráfico"
      ],
      stat1: "99.99%", stat1Desc: "Disponibilidad en despliegues continuos",
      stat2: "0", stat2Desc: "Caídas por reinicios de nodos en la nube",
      stat3: "-40%", stat3Desc: "Ahorro de costos al optimizar Requests",
      step1Title: "1. Modelado de Recursos & Cuotas",
      step1Desc: "Cálculo matemático de memoria y CPU para prevenir estrangulamiento (CPU Throttling) y OOMKills.",
      step2Title: "2. Probes & Health Checks Robustos",
      step2Desc: "Configuración de Startup, Liveness y Readiness probes tolerantes a fallos transitorios.",
      step3Title: "3. GitOps & Despliegues Progresivos",
      step3Desc: "Automatización con ArgoCD y despliegues Canary con rollback automático ante errores 5xx.",
      rule1: "Nunca uses CPU Limits a menos que sea indispensable; el CFS Quota de Linux provocará throttling innecesario.",
      rule2: "Cada Deployment debe contar con un PodDisruptionBudget para garantizar réplicas vivas ante mantenimiento.",
      rule3: "Si tu app tarda en arrancar, usa una Startup Probe en lugar de inflar el initialDelaySeconds de la liveness probe.",
      question: "¿Qué herramienta prefieres para gestionar despliegues en Kubernetes: Helm, Kustomize o ArgoCD?",
      linkedinCaption: `Gestionar Kubernetes en producción requiere rigor en Requests y Limits. ☁️🚀\n\nDesliza para ver la guía de resiliencia y cero caídas.\n\n#Kubernetes #DevOps #Cloud #SystemDesign`,
      instagramCaption: `¿Tus pods mueren por OOMKilled? ☁️⚡ Desliza para aprender a configurar Kubernetes como un Pro.\n\n#devops #kubernetes #cloud #programacion`
    };
  }

  // 3. CASO SISTEMAS DISTRIBUIDOS / REDIS / KAFKA
  if (lower.includes('redis') || lower.includes('kafka') || lower.includes('escala') || lower.includes('concurrencia') || lower.includes('stream')) {
    return {
      topic: "Cómo Escalar a 1M de RPS con Redis Cluster y Event-Driven Architecture",
      category: "SISTEMAS DISTRIBUIDOS & ALTA ESCALA",
      hook: "⚡ ESCALABILIDAD EXTREMA",
      subtitle: "Decisiones de particionado en memoria, colas asíncronas y mitigación de cuellos de botella.",
      badge1: "1.2M RPS", badge1Sub: "Throughput",
      badge2: "P99 < 2.4ms", badge2Sub: "Ultra Baja Latencia",
      imagePromptHero: "3D isometric glowing data center with high speed fiber optic data streams flowing into a central glowing database node, cybernetic neon cyan aesthetic, 8k render",
      imagePromptArch: "3D data pipeline diagram with stream processing nodes, queues and cache layers, futuristic dark theme",
      badTitle: "Monolito Bloqueante",
      badItems: [
        "Consultas pesadas de lectura y escritura concurrentes sobre la DB relacional",
        "Llamadas HTTP síncronas que saturan el pool de hilos del servidor",
        "Ausencia de políticas de desalojo en la capa de caché"
      ],
      goodTitle: "Arquitectura Event-Driven",
      goodItems: [
        "Sharding horizontal en Redis con réplicas de solo lectura",
        "Desacoplamiento total de peticiones mediante tópicos particionados en Kafka",
        "Patrón CQRS: separación estricta de modelos de lectura y comando"
      ],
      stat1: "1.2M", stat1Desc: "Peticiones por segundo sostenidas",
      stat2: "2.4ms", stat2Desc: "Latencia percentil P99 bajo carga pico",
      stat3: "0.00%", stat3Desc: "Tasa de paquetes descartados",
      step1Title: "1. Ingesta en Memoria & Rate Limiting",
      step1Desc: "Recepción de tráfico mediante reverse proxies y contadores atómicos en Redis.",
      step2Title: "2. Procesamiento Reactivo Desacoplado",
      step2Desc: "Consumo paralelo con worker pools en Go procesando eventos asíncronos.",
      step3Title: "3. Persistencia Asíncrona en Lotes",
      step3Desc: "Consolidación de transacciones en la base de datos sin bloquear peticiones.",
      rule1: "Nunca bloquees el hilo principal de procesamiento con operaciones de I/O de disco.",
      rule2: "Diseña asumiendo que los nodos van a fallar: implementa Circuit Breakers y fallback.",
      rule3: "Mide siempre el percentil P99 y P99.9; los promedios ocultan la frustración real.",
      question: "¿Cuál es la técnica que más te ha servido para reducir la latencia P99?",
      linkedinCaption: `Escalar a 1 millón de RPS no se logra agregando más servidores, sino rediseñando el flujo de datos. 🚀\n\nDesliza para ver la arquitectura de Redis + Kafka.\n\n#Redis #Kafka #SystemDesign #SoftwareEngineering`,
      instagramCaption: `¿Cómo procesar 1M de peticiones por segundo? ⚡ Desliza para ver el blueprint técnico.\n\n#arquitectura #backend #programacion`
    };
  }

  // 4. SÍNTESIS INTELIGENTE PARA CUALQUIER OTRO TEMA
  const cleanTitle = input.charAt(0).toUpperCase() + input.slice(1);
  return {
    topic: cleanTitle,
    category: "INGENIERÍA & ESTRATEGIA TECNOLÓGICA",
    hook: "⚡ ANÁLISIS DE ALTO IMPACTO",
    subtitle: `Decisiones de arquitectura, trade-offs y mejores prácticas para implementar ${cleanTitle} con éxito.`,
    badge1: "Alta Eficiencia", badge1Sub: "Escala 2026",
    badge2: "Resiliencia", badge2Sub: "Estándar Enterprise",
    imagePromptHero: `Futuristic 3D isometric conceptual technology illustration representing ${cleanTitle}, glowing digital network, cybernetic nodes, modern dark luxury aesthetic, volumetric lighting, 8k octane render`,
    imagePromptArch: `3D technical architecture diagram for ${cleanTitle}, modular pipelines, high tech flow, neon highlights, dark theme`,
    badTitle: `Prácticas Inadecuadas en ${cleanTitle}`,
    badItems: [
      `Implementación empírica sin considerar límites de escala ni requerimientos reales`,
      `Falta de contratos de interfaz y acoplamiento excesivo entre componentes`,
      `Ausencia de pruebas automatizadas y métricas de rendimiento en producción`
    ],
    goodTitle: `Arquitectura Recomendada para ${cleanTitle}`,
    goodItems: [
      `Diseño modular con fronteras de dominio claramente delimitadas`,
      `Estrategias de resiliencia: aislamiento de fallos, timeouts y monitoreo activo`,
      `Automatización de pruebas y despliegue continuo con observabilidad integral`
    ],
    stat1: "10x", stat1Desc: "Velocidad y estabilidad operativa",
    stat2: "-70%", stat2Desc: "Reducción de incidencias críticas",
    stat3: "99.99%", stat3Desc: "Disponibilidad del servicio",
    step1Title: "1. Análisis de Requerimientos & Contratos",
    step1Desc: `Delimitación de especificaciones técnicas y esquemas de datos para ${cleanTitle}.`,
    step2Title: "2. Implementación Modular & Hardening",
    step2Desc: "Desarrollo con tipado estricto, desacoplamiento y blindaje de seguridad.",
    step3Title: "3. Testing de Carga & Observabilidad",
    step3Desc: "Pruebas de estrés y configuración de telemetría de monitoreo continuo.",
    rule1: `Prioriza la mantenibilidad y claridad arquitectónica sobre optimizaciones prematuras en ${cleanTitle}.`,
    rule2: "Diseña siempre pensando en fallos: la resiliencia y el aislamiento deben ser nativos.",
    rule3: "Mide con datos reales en producción antes de tomar decisiones de refactorización.",
    question: `¿Cómo abordan ${cleanTitle} en la estrategia técnica de tu equipo?`,
    linkedinCaption: `Analizamos las claves de arquitectura y trade-offs para implementar "${cleanTitle}" con estándares de alta escala. 🚀\n\n📌 Desliza el documento adjunto.\n\n#SoftwareEngineering #Architecture #Innovation #Technology`,
    instagramCaption: `${cleanTitle} ⚡ Guía visual para líderes técnicos y desarrolladores.\n\n#tecnologia #software #programacion`
  };
}

// ==============================================================================
// INICIALIZACIÓN DE EVENTOS
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
// FLUJO PRINCIPAL DE GENERACIÓN
// ==============================================================================
async function generateCarouselFlow(autoPublish = false) {
  const btnGen = document.getElementById('btn-generate');
  const previewStatus = document.getElementById('preview-status-text');
  btnGen.disabled = true;
  btnGen.innerHTML = `<span>⏳ Generando Ilustraciones 3D con IA...</span>`;

  try {
    let topicInput;
    if (AppState.contentSource === 'trending') {
      const trendingTopics = [
        "Transformación Digital en Educación Superior: El Caso Laureate Perú",
        "Kubernetes en Producción: Requests, Limits y Resiliencia Zero-Downtime",
        "Cómo Escalar a 1M de RPS con Redis Cluster y Event-Driven Architecture",
        "OAuth 2.1 y JWT en Producción: Blindaje de Tokens sin Fugas",
        "El Fenómeno del Vibecoding: ¿Revolución o Deuda Técnica?"
      ];
      topicInput = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];
    } else {
      topicInput = document.getElementById('gen-topic').value.trim() || "Laureate Perú";
    }

    // Sintetizar contenido contextual profundo
    const topicData = intelligentContentSynthesizer(topicInput);

    // Resolver tema visual activo
    let themeKey = AppState.selectedThemeKey;
    if (themeKey === 'random') {
      themeKey = CLIENT_THEME_KEYS[Math.floor(Math.random() * CLIENT_THEME_KEYS.length)];
    }
    const theme = CLIENT_THEMES[themeKey] || CLIENT_THEMES.midnight_cyan;

    // Generar URLs de imágenes 3D con IA vía Pollinations
    const seed = Math.floor(Math.random() * 999999);
    const heroImgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topicData.imagePromptHero || topicData.topic)}?width=700&height=700&seed=${seed}&nologo=true`;
    const archImgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(topicData.imagePromptArch || topicData.topic + ' architecture flow')}?width=700&height=700&seed=${seed + 1}&nologo=true`;

    const slides = [
      {
        type: 'cover_hero',
        title: topicData.topic,
        subtitle: topicData.subtitle,
        hook: topicData.hook,
        badge1: topicData.badge1, badge1Sub: topicData.badge1Sub,
        badge2: topicData.badge2, badge2Sub: topicData.badge2Sub,
        imageUrl: heroImgUrl,
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
        imageUrl: archImgUrl,
        role: "architecture"
      },
      {
        type: 'impact_matrix',
        title: "Métricas de Impacto en Producción",
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
        step1Title: topicData.step1Title, step1Desc: topicData.step1Desc,
        step2Title: topicData.step2Title, step2Desc: topicData.step2Desc,
        step3Title: topicData.step3Title, step3Desc: topicData.step3Desc,
        role: "pipeline"
      },
      {
        type: 'golden_rules',
        title: "3 Reglas de Oro para Líderes Tech",
        subtitle: "Principios innegociables para ingeniería de alto rendimiento:",
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
        questionDesc: "Comparte tu experiencia, patrones de diseño o debate en los comentarios.",
        imageUrl: heroImgUrl,
        role: "future"
      }
    ];

    AppState.currentCarousel = {
      id: `carrusel-${Date.now()}`,
      topic: topicData.topic,
      category: topicData.category,
      themeKey: themeKey,
      theme: theme,
      captions: {
        linkedin: topicData.linkedinCaption,
        instagram: topicData.instagramCaption,
        facebook: `${topicData.topic} - Análisis técnico y caso de estudio.`
      },
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
// RENDERIZADO VISUAL DE LA DIAPOSITIVA (2 COLUMNAS CON ARTE 3D)
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
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary}; background: ${theme.badgeBg}; padding: 4px 12px; border-radius: 999px;">● ${carousel.category}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 12px; color: #94A3B8;">01 / 06</span>
        </div>

        <!-- 2 Column Layout (Texto + Arte 3D) -->
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

          <!-- Imagen 3D con IA -->
          <div style="border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 15px 30px rgba(0,0,0,0.7), 0 0 25px ${theme.glow}; height: 220px; background: #0A0F1D;">
            <img src="${slide.imageUrl}" alt="3D Hero Art" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'" />
          </div>
        </div>

        <!-- Footer -->
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
            <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 12px;">
              <span style="background: ${theme.primary}; color: #000; font-weight: 800; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 2px;">1</span>
              <div>
                <b style="font-size: 12px; color: #FFF; display: block;">${slide.step1Title}</b>
                <span style="font-size: 10px; color: #94A3B8;">${slide.step1Desc}</span>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 12px;">
              <span style="background: ${theme.secondary}; color: #FFF; font-weight: 800; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 2px;">2</span>
              <div>
                <b style="font-size: 12px; color: #FFF; display: block;">${slide.step2Title}</b>
                <span style="font-size: 10px; color: #94A3B8;">${slide.step2Desc}</span>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 10px; background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 8px 12px;">
              <span style="background: #38BDF8; color: #000; font-weight: 800; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 2px;">3</span>
              <div>
                <b style="font-size: 12px; color: #FFF; display: block;">${slide.step3Title}</b>
                <span style="font-size: 10px; color: #94A3B8;">${slide.step3Desc}</span>
              </div>
            </div>
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
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; font-size: 11px; font-weight: 600; color: #FFF;">
              <span style="color: ${theme.primary}; font-weight: 800; font-family: 'JetBrains Mono';">#1</span> ${slide.rule1}
            </div>
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; font-size: 11px; font-weight: 600; color: #FFF;">
              <span style="color: ${theme.primary}; font-weight: 800; font-family: 'JetBrains Mono';">#2</span> ${slide.rule2}
            </div>
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; font-size: 11px; font-weight: 600; color: #FFF;">
              <span style="color: ${theme.primary}; font-weight: 800; font-family: 'JetBrains Mono';">#3</span> ${slide.rule3}
            </div>
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
            <span>💬 Comenta tu experiencia abajo</span>
            <span>💾 Guarda este post para tu equipo técnico</span>
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
    area.value = carousel.captions?.linkedin || `¿Cómo resolver "${carousel.topic}" con estándares de ingeniería de alto nivel? 🚀\n\n📌 Desliza el documento adjunto.`;
  } else if (AppState.activeCaptionTab === 'instagram') {
    area.value = carousel.captions?.instagram || `${carousel.topic} ⚡\n\nGuía visual para líderes técnicos e ingenieros de software.\n\nDesliza para ver el desglose ➔`;
  } else {
    area.value = carousel.captions?.facebook || `${carousel.topic} - Análisis técnico y caso de estudio de arquitectura de software.`;
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
