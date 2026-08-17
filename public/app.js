// ==============================================================================
// GITHUB PAGES CLIENT-SIDE APPLICATION & BULLETPROOF GOOGLE SHEETS SYNC
// MULTIRED & MAKE.COM INTEGRATION
// ==============================================================================

const DEFAULT_SHEET_URL = "https://script.google.com/macros/s/AKfycbwcGKhfIDHLukn_bSoxl_41KeDMk5bQgTtNlCF1rFYR5jJqnymKC7sZHHDUNYREkL72/exec";

let state = {
  token: localStorage.getItem('tech_token') || null,
  config: {
    author: {
      name: "Ing. José Luis",
      handle: "@joseluis_tech",
      title: "Software Architecture & AI"
    },
    defaults: {
      format: "square",
      category: "IA & INGENIERÍA 2026",
      slideCount: 6,
      blueprint: "standard_executive",
      networks: ["linkedin", "instagram", "facebook"]
    }
  },
  blueprints: {
    "standard_executive": {
      "name": "Estándar Ejecutivo (6 Slides)",
      "slides": [
        { "type": "cover_hero", "purpose": "Gancho, título de impacto y badges" },
        { "type": "split_contrast", "purpose": "El Problema / Comparativa de Arquitectura" },
        { "type": "impact_matrix", "purpose": "Métricas y datos clave en la industria" },
        { "type": "process_pipeline", "purpose": "Mapa conceptual / Pipeline paso a paso" },
        { "type": "golden_rules", "purpose": "3 Reglas de oro o mejores prácticas" },
        { "type": "summary_cta", "purpose": "Pregunta de debate y llamada a la acción" }
      ]
    },
    "historical_tech_story": {
      "name": "Historia & Evolución (5 Slides)",
      "slides": [
        { "type": "cover_hero", "purpose": "El Origen / La chispa inicial" },
        { "type": "impact_matrix", "purpose": "Datos históricos / La crisis del modelo anterior" },
        { "type": "process_pipeline", "purpose": "El punto de inflexión de la industria" },
        { "type": "golden_rules", "purpose": "Lecciones aprendidas para el presente" },
        { "type": "summary_cta", "purpose": "Pregunta reflexiva y debate" }
      ]
    },
    "deep_dive_architecture": {
      "name": "Deep Dive Técnico (8 Slides)",
      "slides": [
        { "type": "cover_hero", "purpose": "Caso de Estudio / Gancho de alto nivel" },
        { "type": "split_contrast", "purpose": "Por qué la solución común fracasa" },
        { "type": "impact_matrix", "purpose": "Benchmarks y métricas de rendimiento (P99)" },
        { "type": "process_pipeline", "purpose": "Diagrama de arquitectura distribuida" },
        { "type": "split_contrast", "purpose": "Trade-offs / Pros vs Contras" },
        { "type": "process_pipeline", "purpose": "Estrategia de migración segura" },
        { "type": "golden_rules", "purpose": "3 Principios de diseño para producción" },
        { "type": "summary_cta", "purpose": "Resumen ejecutivo y CTA" }
      ]
    },
    "quick_contrast": {
      "name": "Comparativa Rápida (4 Slides)",
      "slides": [
        { "type": "cover_hero", "purpose": "La batalla técnica / ¿Cuál elegir?" },
        { "type": "split_contrast", "purpose": "Matriz de comparación directa" },
        { "type": "impact_matrix", "purpose": "Métricas de costo y latencia" },
        { "type": "summary_cta", "purpose": "Veredicto final y CTA" }
      ]
    }
  },
  publications: JSON.parse(localStorage.getItem('tech_publications')) || [
    {
      id: "carrusel-1",
      date: new Date().toISOString().split('T')[0],
      topic: "El Fenómeno del Vibecoding en las Empresas",
      category: "IA & INGENIERÍA 2026",
      format: "square",
      networks: ["linkedin", "instagram", "facebook"],
      slideCount: 6,
      blueprint: "standard_executive",
      status: "Generado"
    },
    {
      id: "carrusel-2",
      date: new Date().toISOString().split('T')[0],
      topic: "Cómo Diseñar un Rate Limiter con Redis",
      category: "IA & INGENIERÍA 2026",
      format: "square",
      networks: ["linkedin", "instagram"],
      slideCount: 6,
      blueprint: "standard_executive",
      status: "Generado"
    }
  ],
  googleSheetUrl: localStorage.getItem('tech_sheet_url') || DEFAULT_SHEET_URL,
  makeWebhookUrl: localStorage.getItem('tech_make_webhook_url') || "",
  selectedNetworks: ["linkedin", "instagram", "facebook"],
  selectedFormat: "square",
  generatedSlides: [],
  currentSlideIndex: 0
};

// ==============================================================================
// INICIALIZACIÓN
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initTabs();
  initSocialAndDimensionPickers();
  initGenerator();
  initSettings();
  loadData();
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

  if (state.token) {
    loginView.style.display = 'none';
    appView.style.display = 'flex';
  } else {
    loginView.style.display = 'flex';
    appView.style.display = 'none';
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginError.innerText = '';
    const u = document.getElementById('login-user').value.trim();
    const p = document.getElementById('login-pass').value.trim();

    if (u === 'admin' && p === 'tech2026') {
      state.token = 'auth_session_ok';
      localStorage.setItem('tech_token', state.token);
      loginView.style.display = 'none';
      appView.style.display = 'flex';
      loadData();
    } else {
      loginError.innerText = 'Usuario o contraseña incorrectos';
    }
  });

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('tech_token');
    state.token = null;
    window.location.reload();
  });
}

// ==============================================================================
// TABS
// ==============================================================================
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById(`tab-${tab.dataset.tab}`);
      if (target) target.classList.add('active');

      if (tab.dataset.tab === 'history') {
        renderHistoryTable();
      }
    });
  });
}

// ==============================================================================
// MÓDULOS DE REDES SOCIALES Y PROPORCIONES
// ==============================================================================
function initSocialAndDimensionPickers() {
  // Redes Sociales
  const socialCards = document.querySelectorAll('.social-card');
  socialCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const chk = card.querySelector('input[type="checkbox"]');
      chk.checked = !chk.checked;
      card.classList.toggle('active', chk.checked);

      // Actualizar array de redes seleccionadas
      state.selectedNetworks = [];
      document.querySelectorAll('.social-card input[type="checkbox"]').forEach(c => {
        if (c.checked) {
          state.selectedNetworks.push(c.closest('.social-card').dataset.network);
        }
      });
    });
  });

  // Dimensiones / Formatos
  const dimCards = document.querySelectorAll('.dimension-card');
  dimCards.forEach(card => {
    card.addEventListener('click', () => {
      dimCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        state.selectedFormat = radio.value;
      }
      if (state.generatedSlides.length > 0) {
        renderActiveSlide();
      }
    });
  });
}

// ==============================================================================
// CARGA Y SINCRONIZACIÓN GOOGLE SHEETS
// ==============================================================================
async function loadData() {
  const savedCfg = localStorage.getItem('tech_brand_config');
  if (savedCfg) {
    state.config = JSON.parse(savedCfg);
  }

  document.getElementById('nav-author-name').innerText = state.config.author?.name || 'Ing. José Luis';
  document.getElementById('cfg-author-name').value = state.config.author?.name || '';
  document.getElementById('cfg-author-handle').value = state.config.author?.handle || '';
  document.getElementById('cfg-author-title').value = state.config.author?.title || '';
  document.getElementById('sheet-webhook-url').value = state.googleSheetUrl || DEFAULT_SHEET_URL;
  document.getElementById('make-webhook-url').value = state.makeWebhookUrl || '';

  const pill = document.getElementById('sheets-status-pill');
  const txt = document.getElementById('sheets-status-text');

  if (state.googleSheetUrl) {
    pill.style.background = 'rgba(16, 185, 129, 0.15)';
    pill.style.color = '#10B981';
    txt.innerText = 'Google Sheets Conectado';
  } else {
    pill.style.background = 'rgba(245, 158, 11, 0.15)';
    pill.style.color = '#F59E0B';
    txt.innerText = 'Google Sheets (Sin URL)';
  }

  updateBlueprintSummary();
  renderHistoryTable();
}

/**
 * Envía un registro al Google Sheet
 */
function pushRecordToGoogleSheet(pubRecord) {
  const targetUrl = state.googleSheetUrl || DEFAULT_SHEET_URL;
  if (!targetUrl) return;

  const networksStr = Array.isArray(pubRecord.networks) ? pubRecord.networks.join(', ') : (pubRecord.networks || 'linkedin, instagram, facebook');

  const fullUrl = `${targetUrl}?action=addPublication` +
    `&id=${encodeURIComponent(pubRecord.id)}` +
    `&topic=${encodeURIComponent(pubRecord.topic)}` +
    `&category=${encodeURIComponent(pubRecord.category)}` +
    `&format=${encodeURIComponent(pubRecord.format)}` +
    `&slideCount=${encodeURIComponent(pubRecord.slideCount)}` +
    `&blueprint=${encodeURIComponent(pubRecord.blueprint)}` +
    `&status=${encodeURIComponent(pubRecord.status)}` +
    `&date=${encodeURIComponent(pubRecord.date)}`;

  // Invocar silenciosamente
  const img = new Image();
  img.src = fullUrl;
  console.log('📡 Publicación enviada a Google Sheet:', pubRecord.topic);
}

// ==============================================================================
// GENERADOR DE CARRUSELES EN CLIENTE (DOM & CANVAS)
// ==============================================================================
function initGenerator() {
  const blueprintSelect = document.getElementById('gen-blueprint');
  const slideCountInput = document.getElementById('gen-slide-count');
  const slideCountVal = document.getElementById('slide-count-val');
  const generateForm = document.getElementById('generate-form');

  document.querySelectorAll('.topic-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.getElementById('gen-topic').value = chip.dataset.topic;
    });
  });

  slideCountInput.addEventListener('input', (e) => {
    slideCountVal.innerText = e.target.value;
    updateBlueprintSummary();
  });

  blueprintSelect.addEventListener('change', () => {
    updateBlueprintSummary();
  });

  generateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const topic = document.getElementById('gen-topic').value.trim();
    const category = document.getElementById('gen-category').value.trim();
    const format = state.selectedFormat || "square";
    const blueprint = document.getElementById('gen-blueprint').value;
    const slideCount = Number(document.getElementById('gen-slide-count').value);
    const networks = [...state.selectedNetworks];

    if (networks.length === 0) {
      alert('⚠️ Por favor selecciona al menos una red social de destino.');
      return;
    }

    const previewLoading = document.getElementById('preview-loading');
    const previewActions = document.getElementById('preview-actions');
    const captionsBox = document.getElementById('captions-container');

    previewLoading.style.display = 'block';
    previewActions.style.display = 'none';
    captionsBox.style.display = 'none';

    state.generatedSlides = buildSlideData(topic, category, format, blueprint, slideCount);
    state.currentSlideIndex = 0;

    setTimeout(() => {
      previewLoading.style.display = 'none';
      previewActions.style.display = 'flex';
      captionsBox.style.display = 'block';

      renderActiveSlide();
      updateCaptionText('linkedin');

      const pubRecord = {
        id: `carrusel-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        topic,
        category,
        format,
        networks,
        slideCount,
        blueprint,
        status: "Generado"
      };

      state.publications.unshift(pubRecord);
      localStorage.setItem('tech_publications', JSON.stringify(state.publications));
      renderHistoryTable();

      // Enviar a Google Sheet
      pushRecordToGoogleSheet(pubRecord);

      // Enviar a Make.com si hay webhook configurado
      if (state.makeWebhookUrl) {
        dispatchToMakeWebhook(pubRecord);
      }
    }, 600);
  });

  // Copys tabs
  document.querySelectorAll('.cap-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cap-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      updateCaptionText(tab.dataset.cap);
    });
  });

  document.getElementById('btn-copy-caption').addEventListener('click', () => {
    const text = document.getElementById('caption-text-area').value;
    navigator.clipboard.writeText(text);
    alert('📋 ¡Texto copiado al portapapeles!');
  });

  document.getElementById('btn-download-pdf').addEventListener('click', downloadPdfClient);
  document.getElementById('btn-download-png').addEventListener('click', downloadPngClient);
  document.getElementById('btn-send-make').addEventListener('click', () => {
    if (!state.makeWebhookUrl) {
      alert('⚠️ Configura primero tu Webhook de Make.com en la pestaña "⚙️ Configuración, Make & Cron".');
      return;
    }
    const latest = state.publications[0];
    if (latest) {
      dispatchToMakeWebhook(latest);
      alert('⚡ ¡Contenido despachado exitosamente al Webhook de Make.com!');
    }
  });
}

function dispatchToMakeWebhook(pubRecord) {
  if (!state.makeWebhookUrl) return;
  const payload = {
    event: "PUBLISH_CAROUSEL",
    timestamp: new Date().toISOString(),
    topic: pubRecord.topic,
    category: pubRecord.category,
    networks: pubRecord.networks || state.selectedNetworks,
    format: pubRecord.format,
    slide_count: pubRecord.slideCount,
    captions: {
      linkedin: document.getElementById('caption-text-area').value,
      instagram: document.getElementById('caption-text-area').value,
      facebook: document.getElementById('caption-text-area').value
    },
    author: state.config.author
  };

  fetch(state.makeWebhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {});
}

function updateBlueprintSummary() {
  const bpKey = document.getElementById('gen-blueprint').value;
  const count = Number(document.getElementById('gen-slide-count').value);
  const bp = state.blueprints[bpKey] || state.blueprints['standard_executive'];

  document.getElementById('bp-name-tag').innerText = bp?.name || bpKey;
  const listEl = document.getElementById('bp-slides-list');
  listEl.innerHTML = '';

  if (bp && bp.slides) {
    const slidesToShow = bp.slides.slice(0, count);
    slidesToShow.forEach((s, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>Slide 0${i+1}:</span> <b>[${s.type}]</b> <span>${s.purpose}</span>`;
      listEl.appendChild(li);
    });
  }
}

function buildSlideData(topic, category, format, blueprint, slideCount) {
  const slides = [
    {
      type: "cover",
      hook: "⚡ ANÁLISIS DE ALTO IMPACTO",
      title: topic,
      subtitle: "Decisiones de arquitectura, trade-offs y mejores prácticas para ingeniería de sistemas.",
      badge1: "10x Velocidad",
      badge2: "Cero Caídas"
    },
    {
      type: "contrast",
      heading: "¿Dónde Falla el Enfoque Común?",
      subheading: "Comparativa entre malas prácticas vs arquitectura recomendada:",
      badTitle: "Práctica Antigua",
      badItems: ["Acoplamiento excesivo", "Sin caché en capas", "Single point of failure"],
      goodTitle: "Diseño Moderno",
      goodItems: ["Arquitectura desacoplada", "Caché distribuido con Redis", "Resiliencia activa"]
    },
    {
      type: "matrix",
      heading: "Impacto & Métricas en Producción",
      subheading: "Resultados reales observados tras aplicar la arquitectura:",
      stat1: "-85% Latency",
      stat1Desc: "Reducción en tiempo de respuesta P99",
      stat2: "10M+ RPS",
      stat2Desc: "Throughput sostenido bajo picos de carga",
      stat3: "3x Deuda Oculta",
      stat3Desc: "Riesgo de omitir revisión de arquitectura"
    },
    {
      type: "pipeline",
      heading: "El Pipeline Seguro en 3 Fases",
      subheading: "Cómo implementarlo en empresas serias sin romper producción:",
      step1: "1. Vibe & Exploración rápida",
      step2: "2. Filtro de Arquitectura Senior",
      step3: "3. Hardening & Tests automáticos"
    },
    {
      type: "rules",
      heading: "3 Reglas de Oro para Líderes Tech",
      subheading: "Principios para liderar ingeniería de sistemas moderna:",
      rule1: "1. La IA escribe, el Arquitecto responde",
      rule2: "2. Cero 'Vibe' en el Core Crítico",
      rule3: "3. Los Tests son tu escudo protector"
    },
    {
      type: "cta",
      heading: "El Futuro del Ingeniero de Sistemas",
      subheading: "La habilidad clave ya no es solo escribir sintaxis, sino diseñar arquitecturas:",
      question: "¿Y en tu empresa?",
      questionDesc: "¿Ya están adoptando estas prácticas o prefieren el flujo tradicional?"
    }
  ];

  if (slideCount < slides.length) {
    const last = slides[slides.length - 1];
    const sliced = slides.slice(0, slideCount - 1);
    sliced.push(last);
    return sliced;
  }
  return slides;
}

function renderActiveSlide() {
  const container = document.getElementById('preview-container');
  const slide = state.generatedSlides[state.currentSlideIndex];
  if (!slide) return;

  const total = state.generatedSlides.length;
  const currentNum = String(state.currentSlideIndex + 1).padStart(2, '0');
  const author = state.config.author || { name: "Ing. José Luis", handle: "@joseluis_tech" };
  const formatClass = `format-${state.selectedFormat || 'square'}`;

  let contentHtml = "";

  if (slide.type === "cover") {
    contentHtml = `
      <div>
        <div style="font-family: var(--font-mono); color: var(--amber); font-size: 13px; font-weight: 700; margin-bottom: 12px;">${slide.hook}</div>
        <h2 style="font-size: 30px; font-weight: 900; line-height: 1.15; color: #FFF; margin-bottom: 12px;">${slide.title}</h2>
        <p style="font-size: 14px; color: var(--text-muted); line-height: 1.4; margin-bottom: 18px;">${slide.subtitle}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: rgba(6,182,212,0.1); border: 1px solid var(--cyan); padding: 12px; border-radius: 10px; font-weight: 800; font-size: 13px; color: #FFF;">⚡ ${slide.badge1}</div>
          <div style="background: rgba(16,185,129,0.1); border: 1px solid var(--emerald); padding: 12px; border-radius: 10px; font-weight: 800; font-size: 13px; color: #FFF;">🛡️ ${slide.badge2}</div>
        </div>
      </div>
    `;
  } else if (slide.type === "contrast") {
    contentHtml = `
      <div>
        <h3 style="font-size: 22px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">${slide.subheading}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.4); padding: 12px; border-radius: 10px;">
            <h4 style="color: var(--rose); font-size: 14px; margin-bottom: 6px;">❌ ${slide.badTitle}</h4>
            <ul style="list-style: none; font-size: 12px; color: #CBD5E1; display: flex; flex-direction: column; gap: 4px;">
              ${slide.badItems.map(i => `<li>• ${i}</li>`).join('')}
            </ul>
          </div>
          <div style="background: rgba(6,182,212,0.08); border: 1px solid var(--cyan); padding: 12px; border-radius: 10px;">
            <h4 style="color: var(--cyan); font-size: 14px; margin-bottom: 6px;">✅ ${slide.goodTitle}</h4>
            <ul style="list-style: none; font-size: 12px; color: #CBD5E1; display: flex; flex-direction: column; gap: 4px;">
              ${slide.goodItems.map(i => `<li>✓ ${i}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (slide.type === "matrix") {
    contentHtml = `
      <div>
        <h3 style="font-size: 22px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">${slide.subheading}</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="background: rgba(16,185,129,0.1); border-left: 4px solid var(--emerald); padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; font-weight: 700; color: #FFF;">${slide.stat1Desc}</span>
            <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 900; color: var(--emerald);">${slide.stat1}</span>
          </div>
          <div style="background: rgba(245,158,11,0.1); border-left: 4px solid var(--amber); padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; font-weight: 700; color: #FFF;">${slide.stat2Desc}</span>
            <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 900; color: var(--amber);">${slide.stat2}</span>
          </div>
          <div style="background: rgba(244,63,94,0.1); border-left: 4px solid var(--rose); padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; font-weight: 700; color: #FFF;">${slide.stat3Desc}</span>
            <span style="font-family: var(--font-mono); font-size: 16px; font-weight: 900; color: var(--rose);">${slide.stat3}</span>
          </div>
        </div>
      </div>
    `;
  } else if (slide.type === "pipeline") {
    contentHtml = `
      <div>
        <h3 style="font-size: 22px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">${slide.subheading}</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #FFF;">🔹 ${slide.step1}</div>
          <div style="background: rgba(6,182,212,0.15); border: 1px solid var(--cyan); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 800; color: var(--cyan);">⚡ ${slide.step2}</div>
          <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #FFF;">🛡️ ${slide.step3}</div>
        </div>
      </div>
    `;
  } else if (slide.type === "rules") {
    contentHtml = `
      <div>
        <h3 style="font-size: 22px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">${slide.subheading}</p>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #FFF;">🎯 ${slide.rule1}</div>
          <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #FFF;">🛡️ ${slide.rule2}</div>
          <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 700; color: #FFF;">🧪 ${slide.rule3}</div>
        </div>
      </div>
    `;
  } else {
    contentHtml = `
      <div>
        <h3 style="font-size: 22px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">${slide.subheading}</p>
        <div style="background: rgba(6,182,212,0.1); border: 1.5px solid var(--cyan); border-radius: 12px; padding: 18px; text-align: center;">
          <h4 style="font-size: 18px; font-weight: 900; color: #FFF; margin-bottom: 6px;">${slide.question}</h4>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 14px;">${slide.questionDesc}</p>
          <div style="display: flex; gap: 8px; justify-content: center;">
            <span style="background: var(--cyan); color: #020617; font-weight: 800; font-size: 12px; padding: 6px 12px; border-radius: 6px;">Comentar 💬</span>
            <span style="background: rgba(255,255,255,0.1); color: #FFF; font-weight: 700; font-size: 12px; padding: 6px 12px; border-radius: 6px;">Guardar 🔖</span>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="slide-viewer">
      <div id="slide-capture-node" class="slide-rendered-frame ${formatClass}">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--cyan); background: rgba(6,182,212,0.12); padding: 4px 10px; border-radius: 999px; border: 1px solid var(--cyan);">TECH & IA 2026</span>
          <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--text-muted);">${currentNum} / 0${total}</span>
        </div>

        <!-- Body -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 12px 0;">
          ${contentHtml}
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 10px;">
          <div>
            <div style="font-size: 13px; font-weight: 800; color: #FFF;">${author.name}</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--cyan);">${author.handle}</div>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-muted);">${state.currentSlideIndex === total - 1 ? 'Fin ✨' : 'Desliza →'}</div>
        </div>
      </div>

      <!-- Controls -->
      <div class="slide-nav-controls">
        <button id="btn-prev-slide" class="btn-secondary btn-sm" ${state.currentSlideIndex === 0 ? 'disabled' : ''}>← Anterior</button>
        <span class="tag-cyan">${state.currentSlideIndex + 1} / ${total}</span>
        <button id="btn-next-slide" class="btn-secondary btn-sm" ${state.currentSlideIndex === total - 1 ? 'disabled' : ''}>Siguiente →</button>
      </div>
    </div>
  `;

  document.getElementById('btn-prev-slide').addEventListener('click', () => {
    if (state.currentSlideIndex > 0) {
      state.currentSlideIndex--;
      renderActiveSlide();
    }
  });

  document.getElementById('btn-next-slide').addEventListener('click', () => {
    if (state.currentSlideIndex < state.generatedSlides.length - 1) {
      state.currentSlideIndex++;
      renderActiveSlide();
    }
  });
}

function updateCaptionText(type) {
  const topic = document.getElementById('gen-topic').value.trim();
  const author = state.config.author?.handle || '@joseluis_tech';

  let caption = "";
  if (type === 'linkedin') {
    caption = `¿Cómo resolver "${topic}" con estándares de alta escala? 🚀\n\nEn este carrusel técnico desglosamos las decisiones de arquitectura, los trade-offs y las 3 reglas de oro para implementar en producción.\n\n📌 Desliza el documento adjunto para ver el blueprint completo.\n\n¿Qué enfoque aplicas tú en tu empresa? Te leo en los comentarios. 👇\n\n#SystemDesign #SoftwareEngineering #Cloud #TechLeadership #DevOps`;
  } else if (type === 'instagram') {
    caption = `${topic} ⚡\n\nGuía visual paso a paso para líderes técnicos e ingenieros de software.\n\nDesliza para ver el desglose ➔\n\n💾 Guarda este post para tu próxima sesión de arquitectura.\n👉 Sígueme en ${author} para más contenido tech diario.\n\n#ingenieriadesistemas #arquitectura #programacion #tech #desarrollo`;
  } else {
    caption = `${topic} 🚀\n\nNueva entrega técnica sobre ingeniería de sistemas y buenas prácticas de software. Revisa las láminas adjuntas para conocer las reglas de arquitectura recomendadas.`;
  }

  document.getElementById('caption-text-area').value = caption;
}

// Descarga en PDF
async function downloadPdfClient() {
  alert('⏳ Generando PDF para LinkedIn...');
  try {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < state.generatedSlides.length; i++) {
      state.currentSlideIndex = i;
      renderActiveSlide();
      const canvas = await html2canvas(document.getElementById('slide-capture-node'), { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const img = await pdfDoc.embedPng(imgData);

      const page = pdfDoc.addPage([1080, 1080]);
      page.drawImage(img, { x: 0, y: 0, width: 1080, height: 1080 });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carrusel_linkedin.pdf`;
    a.click();
  } catch (err) {
    alert('Error al generar PDF: ' + err.message);
  }
}

// Descarga PNG slide activa
async function downloadPngClient() {
  const node = document.getElementById('slide-capture-node');
  const canvas = await html2canvas(node, { scale: 2 });
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `slide_${state.currentSlideIndex + 1}.png`;
  a.click();
}

// ==============================================================================
// HISTORIAL & GOOGLE SHEETS
// ==============================================================================
function renderHistoryTable() {
  const tbody = document.getElementById('history-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (state.publications.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay publicaciones registradas aún.</td></tr>';
    return;
  }

  state.publications.forEach(p => {
    const tr = document.createElement('tr');
    const nets = Array.isArray(p.networks) ? p.networks.join(', ') : (p.networks || 'LinkedIn, IG, FB');
    tr.innerHTML = `
      <td>${p.date || '-'}</td>
      <td><b>${p.topic || '-'}</b></td>
      <td><span class="tag-cyan">${p.category || '-'}</span></td>
      <td>${p.format || 'square'}</td>
      <td><span style="font-size: 11px; color: var(--cyan);">${nets}</span></td>
      <td>${p.slideCount || 6}</td>
      <td>${p.blueprint || '-'}</td>
      <td>
        <span class="status-pill ${p.status === 'Publicado' ? 'publicado' : 'generado'}" data-id="${p.id}">
          ${p.status || 'Generado'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.status-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const id = pill.dataset.id;
      const item = state.publications.find(p => p.id === id);
      if (item) {
        item.status = item.status === 'Publicado' ? 'Generado' : 'Publicado';
        localStorage.setItem('tech_publications', JSON.stringify(state.publications));
        renderHistoryTable();
      }
    });
  });
}

document.getElementById('btn-refresh-history')?.addEventListener('click', () => {
  const targetUrl = state.googleSheetUrl || DEFAULT_SHEET_URL;
  if (state.publications.length > 0 && targetUrl) {
    state.publications.forEach(p => pushRecordToGoogleSheet(p));
    alert(`📡 Sincronizando ${state.publications.length} publicaciones con tu Google Sheet...`);
  } else {
    alert('🔄 Tabla actualizada.');
  }
  renderHistoryTable();
});

// ==============================================================================
// CONFIGURACIÓN
// ==============================================================================
function initSettings() {
  const sheetsForm = document.getElementById('sheets-form');
  const brandForm = document.getElementById('brand-form');
  const makeForm = document.getElementById('make-form');

  makeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('make-webhook-url').value.trim();
    state.makeWebhookUrl = url;
    localStorage.setItem('tech_make_webhook_url', url);
    alert('✅ Webhook de Make.com guardado exitosamente.');
  });

  sheetsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('sheet-webhook-url').value.trim();
    state.googleSheetUrl = url;
    localStorage.setItem('tech_sheet_url', url);
    alert('✅ URL de Google Sheets guardada.');
    loadData();

    if (state.publications.length > 0) {
      state.publications.forEach(p => pushRecordToGoogleSheet(p));
    }
  });

  brandForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cfg-author-name').value.trim();
    const handle = document.getElementById('cfg-author-handle').value.trim();
    const title = document.getElementById('cfg-author-title').value.trim();

    state.config.author = { name, handle, title };
    localStorage.setItem('tech_brand_config', JSON.stringify(state.config));
    alert('✅ Parámetros de marca guardados.');
    loadData();
  });
}
