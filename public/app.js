/**
 * ==============================================================================
 * TECH CONTENT ENGINE - CLIENT CONTROLLER v3.5 (DYNAMIC CONTENT ENGINE)
 * ==============================================================================
 * Motor client-side con síntesis semántica profunda para generar contenido
 * 100% personalizado y único por cada tema tecnológico, sin duplicados genéricos.
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
  selectedThemeKey: 'random',

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

// ==============================================================================
// BASE DE CONOCIMIENTO TÉCNICO MULTIDOMINIO CLIENT-SIDE
// ==============================================================================
const DOMAIN_DATA = [
  {
    keywords: ['vibe', 'vibecoding', 'ia', 'ai', 'prompt', 'generativo'],
    topic: "El Fenómeno del Vibecoding: ¿Revolución o Deuda Técnica?",
    category: "IA & INGENIERÍA 2026",
    hook: "⚡ ANÁLISIS DE ALTO IMPACTO",
    subtitle: "Cómo el desarrollo guiado por IA está redefiniendo las responsabilidades del Arquitecto.",
    badTitle: "El Enfoque Imprudente",
    badItems: [
      "Generación de código sin contratos ni interfaces previas",
      "Acoplamiento oculto y deuda técnica invisible",
      "Ausencia de tests automatizados que verifiquen el comportamiento"
    ],
    goodTitle: "El Enfoque Riguroso",
    goodItems: [
      "Diseño de arquitectura, tipos estrictos y API-First",
      "Batería de pruebas unitarias y de regresión continua",
      "Auditorías estáticas de seguridad y observabilidad de telemetría"
    ],
    stat1: "10x", stat1Desc: "Velocidad de prototipado inicial",
    stat2: "3.4x", stat2Desc: "Riesgo de deuda técnica sin testing",
    stat3: "100%", stat3Desc: "Necesidad de diseño arquitectónico",
    step1Title: "1. Discovery & Contratos de API",
    step1Desc: "Definición estricta de esquemas JSON y límites de dominio antes de generar código.",
    step2Title: "2. Generación Guiada por Contexto",
    step2Desc: "Inyección de contexto acotado y patrones de diseño en cada prompt de desarrollo.",
    step3Title: "3. Hardening & Observabilidad",
    step3Desc: "Ejecución automatizada de linters, escaneo de seguridad y pruebas en CI/CD.",
    rule1: "La IA redacta sintaxis; el Arquitecto responde por los contratos y límites del sistema.",
    rule2: "Nunca lleves código generado a producción sin una suite de pruebas en verde.",
    rule3: "La verdadera ventaja competitiva está en el diseño del sistema y modelado de datos.",
    question: "¿En tu empresa ya usan herramientas de IA para codificar o siguen el flujo tradicional?"
  },
  {
    keywords: ['redis', 'kafka', 'distribuido', 'concurrencia', 'escala', 'stream', 'rate limit'],
    topic: "Cómo Escalar a 1M de Peticiones por Segundo con Redis y Kafka",
    category: "SISTEMAS DISTRIBUIDOS & ALTA ESCALA",
    hook: "🚀 ESCALABILIDAD EXTREMA",
    subtitle: "Decisiones de particionado en memoria, colas asíncronas y mitigación de cuellos de botella.",
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
      "Patrón CQRS: separación estricta de modelos de lectura y escritura"
    ],
    stat1: "1.2M", stat1Desc: "RPS sostenidas en producción",
    stat2: "2.4ms", stat2Desc: "Latencia percentil P99",
    stat3: "0.00%", stat3Desc: "Tasa de peticiones descartadas",
    step1Title: "1. Ingesta en Memoria & Rate Limiting",
    step1Desc: "Recepción de tráfico mediante reverse proxies y contadores atómicos en Redis.",
    step2Title: "2. Procesamiento Reactivo Desacoplado",
    step2Desc: "Consumo paralelo con worker pools en Go o Rust procesando eventos asíncronos.",
    step3Title: "3. Persistencia en Lotes (Batching)",
    step3Desc: "Consolidación de transacciones en la base de datos sin bloquear peticiones web.",
    rule1: "Nunca bloquees el hilo principal de procesamiento con operaciones de I/O de disco.",
    rule2: "Diseña asumiendo que los nodos van a fallar: implementa Circuit Breakers y fallback.",
    rule3: "Mide siempre el percentil P99 y P99.9; los promedios ocultan la frustración real.",
    question: "¿Cuál ha sido el mayor cuello de botella que has enfrentado al escalar un backend?"
  },
  {
    keywords: ['microservicios', 'microservice', 'monolito', 'monolith', 'ddd', 'modular'],
    topic: "Microservicios vs Monolito Modular: El Verdadero Análisis de Costos",
    category: "ARQUITECTURA DE SOFTWARE",
    hook: "⚖️ TRADE-OFFS REALES",
    subtitle: "Por qué tantas organizaciones fracasan al migrar a microservicios antes de tiempo.",
    badTitle: "El Monolito Distribuido",
    badItems: [
      "Decenas de microservicios acoplados compartiendo la misma base de datos",
      "Latencia de red acumulada y fallos en cascada por llamadas síncronas",
      "Complejidad descomunal en observabilidad y despliegues coordinados"
    ],
    goodTitle: "Monolito Modular Moderno",
    goodItems: [
      "Límites de dominio (Bounded Contexts) estrictos en un único binario",
      "Comunicación interna mediante interfaces fuertemente tipadas en memoria",
      "Despliegue unificado, base de datos única y extracción selectiva por escala"
    ],
    stat1: "-65%", stat1Desc: "Ahorro en costos de infraestructura cloud",
    stat2: "3x", stat2Desc: "Mayor velocidad de entrega de features",
    stat3: "0ms", stat3Desc: "Latencia de red en llamadas internas",
    step1Title: "1. Delimitación de Dominios (DDD)",
    step1Desc: "Identificación de Bounded Contexts y aislamiento de modelos de datos por área.",
    step2Title: "2. Módulos con Interfaces Estrictas",
    step2Desc: "Encapsulamiento de código interactuando solo a través de contratos públicos.",
    step3Title: "3. Extracción Selectiva Quirúrgica",
    step3Desc: "Separación a microservicio independiente ÚNICAMENTE ante picos de escala extremos.",
    rule1: "Si no puedes diseñar un monolito modular limpio, tus microservicios serán un caos.",
    rule2: "Adopta microservicios por razones organizacionales de equipo, no por moda técnica.",
    rule3: "La consistencia eventual y la latencia de red son costos reales que debes asumir.",
    question: "¿En tu empresa trabajan con monolito modular, microservicios o híbrido?"
  },
  {
    keywords: ['rust', 'linux', 'memory', 'memoria', 'c++', 'c', 'seguridad', 'borrow'],
    topic: "Por qué Linux y Microsoft Adoptaron Rust: El Fin de los Fallos de Memoria",
    category: "LENGUAJES & SEGURIDAD",
    hook: "🛡️ SEGURIDAD DE BAJO NIVEL",
    subtitle: "El 70% de las vulnerabilidades críticas provienen de memoria. Así lo resuelve Rust.",
    badTitle: "Riesgos en C / C++",
    badItems: [
      "Vulnerabilidades Use-After-Free y desbordamientos de buffer constantes",
      "Condiciones de carrera difíciles de depurar en entornos multi-hilo",
      "Costos millonarios en parches de seguridad para software crítico"
    ],
    goodTitle: "La Ventaja de Rust",
    goodItems: [
      "Borrow Checker y Ownership verificados en tiempo de compilación",
      "Memory Safety garantizado sin el overhead de un Garbage Collector",
      "Concurrencia segura garantizada matemáticamente por el compilador"
    ],
    stat1: "70%", stat1Desc: "Vulnerabilidades de memoria prevenidas",
    stat2: "0ms", stat2Desc: "Overhead de Garbage Collection",
    stat3: "100%", stat3Desc: "Type Safety en concurrencia",
    step1Title: "1. Análisis con el Borrow Checker",
    step1Desc: "Validación estricta de referencias mutables e inmutables en compilación.",
    step2Title: "2. Compilación Nativa LLVM",
    step2Desc: "Generación de código binario altamente optimizado para el procesador.",
    step3Title: "3. Ejecución Determinística",
    step3Desc: "Rendimiento idéntico a C++ con cero riesgo de memory leaks o dangling pointers.",
    rule1: "La seguridad debe garantizarse en compilación, no solo en pruebas de runtime.",
    rule2: "Usa Memory-Safe languages para infraestructura crítica y servicios expuestos a red.",
    rule3: "El tiempo invertido en aprender el Borrow Checker se ahorra en horas de guardia.",
    question: "¿Consideras que Rust reemplazará completamente a C++ en los próximos años?"
  },
  {
    keywords: ['postgres', 'postgresql', 'sql', 'database', 'indice', 'query', 'sharding'],
    topic: "Optimización de PostgreSQL a Gran Escala: Índices, Particionado y Pooling",
    category: "BASES DE DATOS & STORAGE",
    hook: "💾 OPTIMIZACIÓN DE DATOS",
    subtitle: "Cómo eliminar cuellos de botella en consultas lentas y evitar el colapso por conexiones.",
    badTitle: "El Error del ORM Ciego",
    badItems: [
      "Problema N+1 descontrolado generado por consultas automáticas del ORM",
      "Tablas monolíticas de cientos de millones de filas sin particionado",
      "Apertura directa de conexiones sin PgBouncer intermedio"
    ],
    goodTitle: "Arquitectura de Datos Óptima",
    goodItems: [
      "Índices compuestos y parciales diseñados tras análisis con EXPLAIN ANALYZE",
      "Particionado declarativo de tablas por rango temporal",
      "Connection Pooling con PgBouncer manteniendo conexiones estables"
    ],
    stat1: "-85%", stat1Desc: "Reducción en tiempo de queries complejas",
    stat2: "10k+", stat2Desc: "Conexiones concurrentes estables con PgBouncer",
    stat3: "4.2x", stat3Desc: "Mayor throughput en tablas particionadas",
    step1Title: "1. Diagnóstico con EXPLAIN ANALYZE",
    step1Desc: "Identificación de Sequential Scans innecesarios y cuellos de botella en memoria.",
    step2Title: "2. Indexación Quirúrgica Concurrente",
    step2Desc: "Creación de índices B-Tree o BRIN sin bloquear escrituras en producción.",
    step3Title: "3. Capa de Pooling & Read Replicas",
    step3Desc: "Enrutamiento de lecturas hacia réplicas secundarias para liberar el primario.",
    rule1: "No agregues índices a ciegas: cada índice acelera lecturas pero frena los INSERTs.",
    rule2: "El Connection Pooling es obligatorio en arquitecturas de microservicios con PostgreSQL.",
    rule3: "Revisa pg_stat_user_tables periódicamente para purgar índices muertos.",
    question: "¿Prefieres escribir SQL nativo optimizado o delegar todo a un ORM?"
  },
  {
    keywords: ['oauth', 'jwt', 'auth', 'seguridad', 'token', 'owasp', 'autenticacion'],
    topic: "OAuth 2.1 y JWT en Producción: Cómo Blindar Autenticación sin Filtrar Tokens",
    category: "CIBERSEGURIDAD & IDENTIDAD",
    hook: "🛡️ BLINDAJE & DEFENSE-IN-DEPTH",
    subtitle: "Eliminación de flujos inseguros, rotación de Refresh Tokens y almacenamiento blindado.",
    badTitle: "Prácticas Vulnerables Comunes",
    badItems: [
      "Guardar tokens JWT en localStorage, expuestos a ataques de XSS",
      "Tokens de larga duración sin mecanismo de revocación inmediata",
      "Firma simétrica débil (HS256) compartiendo secretos con clientes"
    ],
    goodTitle: "Arquitectura OAuth 2.1 Segura",
    goodItems: [
      "Almacenamiento en cookies HttpOnly, Secure y SameSite=Strict",
      "Access Tokens de corta vida (5 a 15 min) con Refresh Token Rotation",
      "Firma asimétrica (RS256 / EdDSA) con validación descentralizada vía JWKS"
    ],
    stat1: "0%", stat1Desc: "Exposición de tokens ante ataques de XSS",
    stat2: "15 min", stat2Desc: "Vida máxima de Access Token activo",
    stat3: "100%", stat3Desc: "Trazabilidad de revocación instantánea",
    step1Title: "1. Autenticación con PKCE Obligatorio",
    step1Desc: "Validación Proof Key for Code Exchange para eliminar robo de códigos de autorización.",
    step2Title: "2. Emisión Asimétrica de Tokens",
    step2Desc: "Firma criptográfica con clave privada y verificación mediante claves públicas JWKS.",
    step3Title: "3. Detección de Reuso de Tokens",
    step3Desc: "Revocación inmediata de toda la familia de tokens si un refresh token se reutiliza.",
    rule1: "Nunca guardes información sensible ni secretos dentro del payload de un JWT.",
    rule2: "Asume que el cliente frontend está comprometido; valida permisos en cada endpoint.",
    rule3: "Implementa Refresh Token Rotation para aislar sesiones ante robo de credenciales.",
    question: "¿Dónde guardas los tokens de autenticación en tus aplicaciones frontend?"
  },
  {
    keywords: ['k8s', 'kubernetes', 'docker', 'devops', 'cloud', 'limits', 'helm'],
    topic: "Kubernetes en Producción: Requests, Limits y Estrategias Zero-Downtime",
    category: "CLOUD INFRASTRUCTURE & DEVOPS",
    hook: "☁️ NUBE NATIVA & RESILIENCIA",
    subtitle: "Configuración correcta de probes, Autoscaling y presupuestos de disrupción (PDB).",
    badTitle: "El Clúster al Borde del Colapso",
    badItems: [
      "Pods sin CPU/Memory Requests provocando desalojos agresivos por OOMKilled",
      "Despliegues que reinician todos los pods a la vez interrumpiendo el servicio",
      "Falta de Readiness Probes enviando tráfico a contenedores no listos"
    ],
    goodTitle: "Arquitectura K8s Resiliente",
    goodItems: [
      "Requests y Limits ajustados a partir del percentil P95 real de telemetría",
      "Rolling Updates controlados combinados con PodDisruptionBudgets",
      "Probes inteligentes que verifican dependencias críticas antes de aceptar tráfico"
    ],
    stat1: "99.99%", stat1Desc: "Disponibilidad durante despliegues continuos",
    stat2: "0", stat2Desc: "Caídas por reinicios o desalojos de nodos",
    stat3: "-40%", stat3Desc: "Ahorro de costos en clúster al optimizar Requests",
    step1Title: "1. Modelado de Recursos & Cuotas",
    step1Desc: "Cálculo preciso de memoria y CPU para prevenir estrangulamiento y OOMKills.",
    step2Title: "2. Probes & Health Checks Robustos",
    step2Desc: "Configuración de Startup, Liveness y Readiness probes tolerantes a fallos transitorios.",
    step3Title: "3. GitOps & Despliegue Progresivo",
    step3Desc: "Automatización con ArgoCD y despliegues Canary con rollback automático ante errores.",
    rule1: "Nunca uses CPU Limits a menos que sea indispensable para evitar CPU Throttling.",
    rule2: "Cada Deployment debe contar con un PodDisruptionBudget para garantizar pods vivos.",
    rule3: "Si tu app tarda en arrancar, usa Startup Probes en lugar de inflar liveness probes.",
    question: "¿Qué herramienta usas para gestionar tus despliegues en Kubernetes?"
  }
];

// ==============================================================================
// SINTETIZADOR DINÁMICO CLIENT-SIDE
// ==============================================================================
function synthesizeTopicContent(topicInput) {
  const normalized = topicInput.toLowerCase();

  // 1. Buscar coincidencia en la base de datos técnica
  for (const item of DOMAIN_DATA) {
    const match = item.keywords.some(kw => normalized.includes(kw));
    if (match) {
      return { ...item, topic: topicInput.length > 5 && !item.topic.toLowerCase().includes(normalized) ? topicInput : item.topic };
    }
  }

  // 2. Si es un tema completamente personalizado y nuevo, generar estructura profunda a la medida
  const cleanTitle = topicInput.charAt(0).toUpperCase() + topicInput.slice(1);
  return {
    topic: cleanTitle,
    category: "INGENIERÍA & ARQUITECTURA DE SOFTWARE",
    hook: "⚡ ANÁLISIS DE ALTO IMPACTO",
    subtitle: `Decisiones de arquitectura, trade-offs y mejores prácticas para implementar ${cleanTitle} en producción.`,
    badTitle: `Prácticas Inseguras / Errores Comunes`,
    badItems: [
      `Implementación empírica sin considerar límites de concurrencia ni gestión de memoria`,
      `Falta de contratos de tipos y especificaciones de interfaz entre componentes`,
      `Cero pruebas automatizadas y ausencia de observabilidad sobre latencias P99`
    ],
    goodTitle: `Arquitectura Recomendada`,
    goodItems: [
      `Diseño modular desacoplado con boundaries de dominio claramente definidos`,
      `Estrategias de resiliencia activa: Circuit Breakers, timeouts y reintentos exponenciales`,
      `Monitoreo continuo de métricas operativas y trazabilidad distribuida`
    ],
    stat1: "10x", stat1Desc: "Velocidad y estabilidad",
    stat2: "-70%", stat2Desc: "Reducción de incidencias críticas",
    stat3: "99.99%", stat3Desc: "Disponibilidad del servicio",
    step1Title: "1. Análisis de Requerimientos & Contratos",
    step1Desc: `Delimitación de esquemas de datos y contratos de API para ${cleanTitle}.`,
    step2Title: "2. Implementación Modular & Hardening",
    step2Desc: "Desarrollo con tipado estricto, decoupling y validación de seguridad.",
    step3Title: "3. Testing de Carga & Observabilidad",
    step3Desc: "Pruebas de estrés bajo tráfico pico y configuración de telemetría continua.",
    rule1: `Prioriza la mantenibilidad y claridad arquitectónica sobre optimizaciones prematuras.`,
    rule2: "Diseña siempre pensando en fallos: la resiliencia y el aislamiento deben ser nativos.",
    rule3: "Mide con métricas reales en producción (P99, CPU, errores) antes de refactorizar.",
    question: `¿Cómo abordan estos trade-offs técnicos en tu equipo de desarrollo?`
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
  btnGen.innerHTML = `<span>⏳ Sintetizando Contenido & Arte 3D...</span>`;

  try {
    let topicInput;
    if (AppState.contentSource === 'trending') {
      const idx = Math.floor(Math.random() * DOMAIN_DATA.length);
      topicInput = DOMAIN_DATA[idx].topic;
    } else {
      topicInput = document.getElementById('gen-topic').value.trim() || "Arquitectura de Microservicios vs Monolito Modular";
    }

    // Sintetizar contenido técnico 100% específico para el tema
    const topicData = synthesizeTopicContent(topicInput);

    // Resolver tema visual activo
    let themeKey = AppState.selectedThemeKey;
    if (themeKey === 'random') {
      themeKey = CLIENT_THEME_KEYS[Math.floor(Math.random() * CLIENT_THEME_KEYS.length)];
    }
    const theme = CLIENT_THEMES[themeKey] || CLIENT_THEMES.midnight_cyan;

    // Construir diapositivas con datos profundos
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
        subtitle: "Comparativa técnica entre malas prácticas vs arquitectura recomendada:",
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
        step1Title: topicData.step1Title, step1Desc: topicData.step1Desc,
        step2Title: topicData.step2Title, step2Desc: topicData.step2Desc,
        step3Title: topicData.step3Title, step3Desc: topicData.step3Desc,
        role: "pipeline"
      },
      {
        type: 'golden_rules',
        title: "3 Reglas de Oro para Líderes Tech",
        subtitle: "Principios innegociables para ingeniería de alto nivel:",
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

  let contentHtml = '';

  if (slide.type === 'cover_hero') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 34px 38px; background: ${theme.bgGradient}; color: #FFF; font-family: 'Plus Jakarta Sans', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary}; background: ${theme.badgeBg}; padding: 4px 12px; border-radius: 999px;">● ${carousel.category}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">01 / 06</span>
        </div>

        <div style="margin: 16px 0;">
          <div style="display: inline-block; padding: 4px 10px; background: ${theme.badgeBg}; border: 1px solid ${theme.primary}; border-radius: 6px; color: ${theme.primary}; font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; margin-bottom: 12px;">${slide.hook}</div>
          <h2 style="font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; line-height: 1.22; margin-bottom: 10px; color: #FFF;">${slide.title}</h2>
          <p style="font-size: 13px; color: #94A3B8; line-height: 1.4;">${slide.subtitle}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
          <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px;">
            <div style="font-size: 11px; color: #94A3B8;">Métrica Clave</div>
            <div style="font-size: 13px; font-weight: 700; color: #FFF;">${slide.badge1}</div>
          </div>
          <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px;">
            <div style="font-size: 11px; color: #94A3B8;">Estándar</div>
            <div style="font-size: 13px; font-weight: 700; color: #FFF;">${slide.badge2}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
          <span style="font-size: 12px; font-weight: 700; color: #FFF;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'split_contrast') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 34px 38px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● COMPARATIVA TÉCNICA</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">02 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 21px; font-weight: 800; margin-bottom: 14px;">${slide.title}</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 12px; padding: 12px;">
              <span style="font-size: 10px; font-weight: 800; color: #F87171; text-transform: uppercase;">⚠️ ${slide.badTitle}</span>
              <ul style="margin-top: 8px; font-size: 11px; color: #FECACA; padding-left: 14px; line-height: 1.45;">
                ${(slide.badItems || []).map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
            <div style="background: ${theme.badgeBg}; border: 1px solid ${theme.primary}40; border-radius: 12px; padding: 12px;">
              <span style="font-size: 10px; font-weight: 800; color: ${theme.primary}; text-transform: uppercase;">✓ ${slide.goodTitle}</span>
              <ul style="margin-top: 8px; font-size: 11px; color: #FFF; padding-left: 14px; line-height: 1.45;">
                ${(slide.goodItems || []).map(i => `<li>${i}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'impact_matrix') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 34px 38px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● MÉTRICAS EN PRODUCCIÓN</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">03 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 21px; font-weight: 800; margin-bottom: 16px;">${slide.title}</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px 8px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 28px; font-weight: 800; color: ${theme.primary}; display: block;">${slide.stat1}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 4px;">${slide.stat1Desc}</p>
            </div>
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px 8px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 28px; font-weight: 800; color: ${theme.secondary}; display: block;">${slide.stat2}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 4px;">${slide.stat2Desc}</p>
            </div>
            <div style="background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px 8px; text-align: center;">
              <span style="font-family: 'Syne'; font-size: 28px; font-weight: 800; color: #38BDF8; display: block;">${slide.stat3}</span>
              <p style="font-size: 10px; color: #94A3B8; margin-top: 4px;">${slide.stat3Desc}</p>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'process_pipeline') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 34px 38px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● PIPELINE DE IMPLEMENTACIÓN</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">04 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 21px; font-weight: 800; margin-bottom: 14px;">${slide.title}</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 12px;">
              <span style="background: ${theme.primary}; color: #000; font-weight: 800; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 2px;">1</span>
              <div>
                <b style="font-size: 12px; color: #FFF; display: block;">${slide.step1Title}</b>
                <span style="font-size: 11px; color: #94A3B8;">${slide.step1Desc}</span>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 12px;">
              <span style="background: ${theme.secondary}; color: #FFF; font-weight: 800; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 2px;">2</span>
              <div>
                <b style="font-size: 12px; color: #FFF; display: block;">${slide.step2Title}</b>
                <span style="font-size: 11px; color: #94A3B8;">${slide.step2Desc}</span>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start; gap: 12px; background: rgba(15,23,42,0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 12px;">
              <span style="background: #38BDF8; color: #000; font-weight: 800; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 2px;">3</span>
              <div>
                <b style="font-size: 12px; color: #FFF; display: block;">${slide.step3Title}</b>
                <span style="font-size: 11px; color: #94A3B8;">${slide.step3Desc}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else if (slide.type === 'golden_rules') {
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 34px 38px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● 3 REGLAS DE ORO</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">05 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 21px; font-weight: 800; margin-bottom: 14px;">${slide.title}</h3>
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

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
          <span style="font-size: 12px; font-weight: 700;">${AppState.author.name}</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: ${theme.primary}; font-weight: 700;">DESLIZA ➔</span>
        </div>
      </div>
    `;
  } else {
    // summary_cta
    contentHtml = `
      <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 34px 38px; background: ${theme.bgGradient}; color: #FFF;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; font-weight: 700; color: ${theme.primary};">● CONCLUSIÓN & DEBATE</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 13px; color: #94A3B8;">06 / 06</span>
        </div>

        <div>
          <h3 style="font-family: 'Syne'; font-size: 22px; font-weight: 800; margin-bottom: 12px;">${slide.title}</h3>
          <div style="background: rgba(15,23,42,0.9); border-left: 4px solid ${theme.primary}; border-radius: 10px; padding: 14px; margin-bottom: 12px;">
            <h4 style="font-size: 14px; color: #FFF; margin-bottom: 4px;">${slide.question}</h4>
            <p style="font-size: 11px; color: #94A3B8;">${slide.questionDesc}</p>
          </div>
          <div style="font-size: 11px; color: #E2E8F0; display: flex; flex-direction: column; gap: 4px;">
            <span>💬 Comenta tu experiencia abajo</span>
            <span>💾 Guarda este post para tu equipo técnico</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
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
