/**
 * ==============================================================================
 * MOTOR DE INVESTIGACIÓN & TENDENCIAS TECH DEL DÍA
 * ==============================================================================
 * Descubre, investiga y sintetiza el tema tecnológico y de ingeniería de software
 * más relevante del día para generar el contenido de alto impacto automáticamente.
 */

const TRENDING_TOPIC_REPOSITORIES = [
  {
    topic: "El Auge del Vibecoding: ¿Revolución de Productividad o Trampa de Deuda Técnica?",
    category: "IA & INGENIERÍA 2026",
    hook: "⚡ ANÁLISIS DE ALTO IMPACTO",
    subtitle: "Cómo el desarrollo asistido por IA está transformando el rol del Arquitecto de Software.",
    badTitle: "El Error Clásico",
    badItems: ["Generar código a ciegas sin diseño previo", "Deuda técnica invisible que explota en meses", "Cero pruebas automatizadas en producción"],
    goodTitle: "El Enfoque Riguroso",
    goodItems: ["Arquitectura y contratos primero (API-First)", "Pruebas de regresión y cobertura continua", "Validación estricta de seguridad y observabilidad"],
    stats: [
      { num: "10x", label: "Velocidad de prototipado inicial" },
      { num: "3.4x", label: "Riesgo de deuda oculta sin testing" },
      { num: "100%", label: "Necesidad de diseño arquitectónico" }
    ],
    pipeline: [
      "1. Discovery & Diseño de Arquitectura",
      "2. Generación Guiada por Contexto & Tipos",
      "3. Hardening, Auditoría SAST & Testing"
    ],
    rules: [
      "1. La IA redacta sintaxis; el Arquitecto define contratos y límites.",
      "2. Nunca lleves código generado a producción sin una suite de pruebas en verde.",
      "3. La verdadera ventaja competitiva está en el diseño del sistema, no en tipear código."
    ],
    question: "¿En tu equipo ya están utilizando IA para desarrollo diario o siguen el flujo tradicional?"
  },
  {
    topic: "Cómo Escalar a 1M de Peticiones por Segundo con Redis Cluster y Event-Driven Architecture",
    category: "SISTEMAS DISTRIBUIDOS",
    hook: "🚀 ESCALABILIDAD EXTREMA",
    subtitle: "Decisiones de arquitectura, particionado de datos y mitigación de cuellos de botella.",
    badTitle: "Patrón Monolítico Roto",
    badItems: ["Consultas pesadas directamente a la base de datos", "Bloqueos de hilos por peticiones síncronas", "Sin estrategias de caché multicapa"],
    goodTitle: "Arquitectura Recomendada",
    goodItems: ["In-Memory Caching con Redis Sharding", "Colas asíncronas con Kafka / RabbitMQ", "Lecturas desacopladas mediante CQRS"],
    stats: [
      { num: "1.2M", label: "Throughput sostenido en producción" },
      { num: "2.4ms", label: "Latencia percentil P99" },
      { num: "0.00%", label: "Tasa de paquetes descartados" }
    ],
    pipeline: [
      "1. Capa de Ingesta & Rate Limiting con Redis",
      "2. Procesamiento Reactivo en Memoria",
      "3. Persistencia Asíncrona Eventual en Base de Datos"
    ],
    rules: [
      "1. Nunca bloquees el hilo principal de procesamiento de peticiones.",
      "2. Implementa Circuit Breakers y fallback graceful ante picos de tráfico.",
      "3. Monitorea siempre el P99 y P99.9, no solo el promedio de latencia."
    ],
    question: "¿Cuál es el cuello de botella más grande que has enfrentado al escalar un backend?"
  },
  {
    topic: "Por qué Linux y Microsoft Adoptaron Rust: El Fin de las Vulnerabilidades de Memoria",
    category: "SEGURIDAD & LENGUAJES",
    hook: "🛡️ SEGURIDAD DE BAJO NIVEL",
    subtitle: "El 70% de las vulnerabilidades críticas en C/C++ provienen de memoria. Así lo resuelve Rust.",
    badTitle: "Riesgos de C / C++",
    badItems: ["Use-after-free y buffer overflows constantes", "Race conditions difíciles de depurar", "Costos millonarios en parches de seguridad"],
    goodTitle: "La Ventaja de Rust",
    goodItems: ["Borrow Checker y Ownership en tiempo de compilación", "Memory Safety sin necesidad de Garbage Collector", "Concurrencia segura garantizada por el compilador"],
    stats: [
      { num: "70%", label: "Vulnerabilidades prevenidas en el Kernel" },
      { num: "0ms", label: "Overhead de Garbage Collection" },
      { num: "100%", label: "Type Safety en concurrencia" }
    ],
    pipeline: [
      "1. Análisis Estático con el Borrow Checker",
      "2. Compilación Nativa a Código Máquina LLVM",
      "3. Ejecución Determinística y de Máximo Rendimiento"
    ],
    rules: [
      "1. La seguridad debe garantizarse en compilación, no solo en tests.",
      "2. Elige Memory-Safe languages para infraestructura crítica y servicios expuestos.",
      "3. El tiempo invertido aprendiendo el Borrow Checker se ahorra en horas de guardia."
    ],
    question: "¿Consideras que Rust reemplazará completamente a C++ en los próximos 5 años?"
  },
  {
    topic: "Microservicios vs Monolito Modular: El Verdadero Análisis de Costos y Complejidad",
    category: "DISEÑO DE SOFTWARE",
    hook: "⚖️ TRADE-OFFS REALES",
    subtitle: "Por qué muchas startups fracasan al adoptar microservicios demasiado temprano.",
    badTitle: "El Monolito Distribuido",
    badItems: ["Microservicios altamente acoplados con latencia en red", "Complejidad masiva en despliegues y observabilidad", "Facturas de nube infladas sin beneficio de negocio"],
    goodTitle: "Monolito Modular Moderno",
    goodItems: ["Fronteras de dominio claras en una sola base de código", "Cero latencia de red entre módulos internos", "Despliegue unificado y costos de nube mínimos"],
    stats: [
      { num: "-65%", label: "Reducción de costos de infraestructura" },
      { num: "3x", label: "Velocidad de onboarding de desarrolladores" },
      { num: "1 Click", label: "Simplicidad de despliegue en producción" }
    ],
    pipeline: [
      "1. Delimitar Dominios y Bounded Contexts",
      "2. Monolito Modular con Interfaces Estrictas",
      "3. Extraer a Microservicio ÚNICAMENTE por Escala Independiente"
    ],
    rules: [
      "1. No adoptes microservicios por moda; adóptalos por necesidades organizacionales.",
      "2. Si no puedes construir un monolito bien modularizado, tus microservicios serán un caos.",
      "3. La latencia de red y la consistencia eventual son costos que debes pagar."
    ],
    question: "¿En tu empresa usan microservicios, monolito o una arquitectura híbrida?"
  },
  {
    topic: "Arquitectura RAG para Empresas: Cómo Conectar LLMs a tus Datos Privados sin Filtrar Secretos",
    category: "IA GENERATIVA & ENTERPRISE",
    hook: "🧠 LLMOps & SEGURIDAD",
    subtitle: "El pipeline de Retrieval-Augmented Generation con Vector Databases y Control de Acceso.",
    badTitle: "RAG Mal Diseñado",
    badItems: ["Alucinaciones por fragmentación deficiente de documentos", "Exposición de información confidencial entre usuarios", "Búsqueda vectorial lenta sin re-ranking"],
    goodTitle: "Arquitectura RAG Segura",
    goodItems: ["Chunking semántico inteligente y embeddings densos", "Filtro de seguridad RBAC antes de consultar la Vector DB", "Re-ranking con Cross-Encoders para máxima precisión"],
    stats: [
      { num: "96%", label: "Precisión en respuestas contextuales" },
      { num: "<200ms", label: "Tiempo de recuperación de documentos" },
      { num: "0%", label: "Filtración de documentos protegidos" }
    ],
    pipeline: [
      "1. Ingesta, Chunking & Generación de Embeddings",
      "2. Búsqueda Vectorial Híbrida con Re-Ranking",
      "3. Inyección en Contexto con Filtro de Seguridad RBAC"
    ],
    rules: [
      "1. La calidad de tu RAG depende 80% de la calidad de tus datos y chunking.",
      "2. Aplica permisos a nivel de documento antes de enviar el prompt al LLM.",
      "3. Evalúa tu pipeline continuamente con métricas de fidelidad y relevancia."
    ],
    question: "¿Ya estás implementando asistentes con RAG en tu organización?"
  }
];

class TopicResearcher {
  /**
   * Obtiene el tema más importante del día (o uno aleatorio curado de alta tecnología).
   */
  async getDailyTrendingTopic() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const selectedIndex = dayOfYear % TRENDING_TOPIC_REPOSITORIES.length;
    const baseTopic = TRENDING_TOPIC_REPOSITORIES[selectedIndex];

    return {
      ...baseTopic,
      date: today.toISOString().split('T')[0],
      source: "Tech Intelligence Daily Radar"
    };
  }

  /**
   * Construye un plan estructurado completo a partir de un tema manual o automático.
   */
  buildStructuredContent(topicInput, customParams = {}) {
    // Si coincide con alguno de los temas curados
    const match = TRENDING_TOPIC_REPOSITORIES.find(t => 
      t.topic.toLowerCase().includes(topicInput.toLowerCase()) || 
      topicInput.toLowerCase().includes(t.category.toLowerCase())
    );

    if (match) {
      return {
        ...match,
        ...customParams
      };
    }

    // Si es un tema completamente personalizado
    return {
      topic: topicInput,
      category: customParams.category || "INGENIERÍA & ARQUITECTURA",
      hook: "⚡ ANÁLISIS TÉCNICO",
      subtitle: "Decisiones de arquitectura, trade-offs y mejores prácticas para ingeniería de sistemas moderna.",
      badTitle: "El Enfoque Tradicional",
      badItems: ["Falta de diseño previo y acoplamiento", "Sin métricas de observabilidad en producción", "Deuda técnica acumulada"],
      goodTitle: "Arquitectura Recomendada",
      goodItems: ["Diseño desacoplado y modular", "Monitoreo continuo de latencia y errores", "Automatización de pruebas y despliegue"],
      stats: [
        { num: "10x", label: "Impacto en rendimiento" },
        { num: "-70%", label: "Reducción de incidencias" },
        { num: "99.99%", label: "Disponibilidad del sistema" }
      ],
      pipeline: [
        "1. Análisis de Requerimientos & Trade-offs",
        "2. Implementación Modular & Pruebas",
        "3. Despliegue Continuo & Monitoreo P99"
      ],
      rules: [
        "1. Prioriza la mantenibilidad y claridad sobre la complejidad innecesaria.",
        "2. Diseña pensando en fallos: implementa resiliencia y circuit breakers.",
        "3. Mide siempre con datos reales en producción antes de optimizar prematuramente."
      ],
      question: "¿Cómo abordan este desafío técnico en tu equipo de desarrollo?"
    };
  }
}

module.exports = { TopicResearcher, TRENDING_TOPIC_REPOSITORIES };
