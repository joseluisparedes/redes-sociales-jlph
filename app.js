// ==============================================================================
// GITHUB PAGES CLIENT-SIDE APPLICATION & GOOGLE SHEETS SYNC
// ==============================================================================

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
      blueprint: "standard_executive"
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
      id: "carrusel-vibecoding-v2",
      date: new Date().toISOString().split('T')[0],
      topic: "El Fenómeno del Vibecoding en las Empresas",
      category: "IA & INGENIERÍA 2026",
      format: "square",
      slideCount: 6,
      blueprint: "standard_executive",
      status: "Generado"
    }
  ],
  googleSheetUrl: localStorage.getItem('tech_sheet_url') || "",
  generatedSlides: [],
  currentSlideIndex: 0
};

// ==============================================================================
// INICIALIZACIÓN
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initTabs();
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
  document.getElementById('sheet-webhook-url').value = state.googleSheetUrl || '';

  const pill = document.getElementById('sheets-status-pill');
  const txt = document.getElementById('sheets-status-text');

  if (state.googleSheetUrl) {
    pill.style.background = 'rgba(16, 185, 129, 0.15)';
    pill.style.color = '#10B981';
    txt.innerText = 'Google Sheets Conectado';
    syncFromGoogleSheets();
  } else {
    pill.style.background = 'rgba(245, 158, 11, 0.15)';
    pill.style.color = '#F59E0B';
    txt.innerText = 'Google Sheets (Sin URL)';
  }

  updateBlueprintSummary();
  renderHistoryTable();
}

async function syncFromGoogleSheets() {
  if (!state.googleSheetUrl) return;
  try {
    const res = await fetch(`${state.googleSheetUrl}?action=getConfig`);
    const data = await res.json();
    if (data && data.success && data.config) {
      if (data.config.author?.name) state.config.author = data.config.author;
      document.getElementById('nav-author-name').innerText = state.config.author.name;
    }
  } catch (err) {
    console.warn('Sync notice:', err.message);
  }
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
    const format = document.getElementById('gen-format').value;
    const blueprint = document.getElementById('gen-blueprint').value;
    const slideCount = Number(document.getElementById('gen-slide-count').value);

    const previewLoading = document.getElementById('preview-loading');
    const previewActions = document.getElementById('preview-actions');
    const captionsBox = document.getElementById('captions-container');

    previewLoading.style.display = 'block';
    previewActions.style.display = 'none';
    captionsBox.style.display = 'none';

    // Generar diapositivas en memoria
    state.generatedSlides = buildSlideData(topic, category, format, blueprint, slideCount);
    state.currentSlideIndex = 0;

    setTimeout(async () => {
      previewLoading.style.display = 'none';
      previewActions.style.display = 'flex';
      captionsBox.style.display = 'block';

      renderActiveSlide();
      updateCaptionText('linkedin');

      // Guardar en Historial y enviar a Google Sheets
      const pubRecord = {
        id: `carrusel-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        topic,
        category,
        format,
        slideCount,
        blueprint,
        status: "Generado"
      };

      state.publications.unshift(pubRecord);
      localStorage.setItem('tech_publications', JSON.stringify(state.publications));
      renderHistoryTable();

      // Enviar a Google Sheet si hay webhook
      if (state.googleSheetUrl) {
        try {
          fetch(state.googleSheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addPublication', record: pubRecord })
          });
        } catch (err) {}
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

  let contentHtml = "";

  if (slide.type === "cover") {
    contentHtml = `
      <div>
        <div style="font-family: var(--font-mono); color: var(--amber); font-size: 13px; font-weight: 700; margin-bottom: 12px;">${slide.hook}</div>
        <h2 style="font-size: 32px; font-weight: 900; line-height: 1.15; color: #FFF; margin-bottom: 12px;">${slide.title}</h2>
        <p style="font-size: 15px; color: var(--text-muted); line-height: 1.4; margin-bottom: 20px;">${slide.subtitle}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div style="background: rgba(6,182,212,0.1); border: 1px solid var(--cyan); padding: 12px; border-radius: 10px; font-weight: 800; font-size: 14px; color: #FFF;">⚡ ${slide.badge1}</div>
          <div style="background: rgba(16,185,129,0.1); border: 1px solid var(--emerald); padding: 12px; border-radius: 10px; font-weight: 800; font-size: 14px; color: #FFF;">🛡️ ${slide.badge2}</div>
        </div>
      </div>
    `;
  } else if (slide.type === "contrast") {
    contentHtml = `
      <div>
        <h3 style="font-size: 24px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">${slide.subheading}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.4); padding: 14px; border-radius: 12px;">
            <h4 style="color: var(--rose); font-size: 15px; margin-bottom: 8px;">❌ ${slide.badTitle}</h4>
            <ul style="list-style: none; font-size: 12px; color: #CBD5E1; display: flex; flex-direction: column; gap: 6px;">
              ${slide.badItems.map(i => `<li>• ${i}</li>`).join('')}
            </ul>
          </div>
          <div style="background: rgba(6,182,212,0.08); border: 1px solid var(--cyan); padding: 14px; border-radius: 12px;">
            <h4 style="color: var(--cyan); font-size: 15px; margin-bottom: 8px;">✅ ${slide.goodTitle}</h4>
            <ul style="list-style: none; font-size: 12px; color: #CBD5E1; display: flex; flex-direction: column; gap: 6px;">
              ${slide.goodItems.map(i => `<li>✓ ${i}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (slide.type === "matrix") {
    contentHtml = `
      <div>
        <h3 style="font-size: 24px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">${slide.subheading}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="background: rgba(16,185,129,0.1); border-left: 4px solid var(--emerald); padding: 12px 16px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: #FFF;">${slide.stat1Desc}</span>
            <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 900; color: var(--emerald);">${slide.stat1}</span>
          </div>
          <div style="background: rgba(245,158,11,0.1); border-left: 4px solid var(--amber); padding: 12px 16px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: #FFF;">${slide.stat2Desc}</span>
            <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 900; color: var(--amber);">${slide.stat2}</span>
          </div>
          <div style="background: rgba(244,63,94,0.1); border-left: 4px solid var(--rose); padding: 12px 16px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: #FFF;">${slide.stat3Desc}</span>
            <span style="font-family: var(--font-mono); font-size: 18px; font-weight: 900; color: var(--rose);">${slide.stat3}</span>
          </div>
        </div>
      </div>
    `;
  } else if (slide.type === "pipeline") {
    contentHtml = `
      <div>
        <h3 style="font-size: 24px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">${slide.subheading}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #FFF;">🔹 ${slide.step1}</div>
          <div style="background: rgba(6,182,212,0.15); border: 1px solid var(--cyan); padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 800; color: var(--cyan);">⚡ ${slide.step2}</div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #FFF;">🛡️ ${slide.step3}</div>
        </div>
      </div>
    `;
  } else if (slide.type === "rules") {
    contentHtml = `
      <div>
        <h3 style="font-size: 24px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">${slide.subheading}</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #FFF;">🎯 ${slide.rule1}</div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #FFF;">🛡️ ${slide.rule2}</div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #FFF;">🧪 ${slide.rule3}</div>
        </div>
      </div>
    `;
  } else {
    contentHtml = `
      <div>
        <h3 style="font-size: 24px; font-weight: 800; color: #FFF; margin-bottom: 6px;">${slide.heading}</h3>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">${slide.subheading}</p>
        <div style="background: rgba(6,182,212,0.1); border: 1.5px solid var(--cyan); border-radius: 14px; padding: 20px; text-align: center;">
          <h4 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 8px;">${slide.question}</h4>
          <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 16px;">${slide.questionDesc}</p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <span style="background: var(--cyan); color: #020617; font-weight: 800; font-size: 13px; padding: 8px 14px; border-radius: 8px;">Comentar 💬</span>
            <span style="background: rgba(255,255,255,0.1); color: #FFF; font-weight: 700; font-size: 13px; padding: 8px 14px; border-radius: 8px;">Guardar 🔖</span>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="slide-viewer">
      <div id="slide-capture-node" class="slide-rendered-frame">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: var(--cyan); background: rgba(6,182,212,0.12); padding: 4px 10px; border-radius: 999px; border: 1px solid var(--cyan);">TECH & IA 2026</span>
          <span style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--text-muted);">${currentNum} / 0${total}</span>
        </div>

        <!-- Body -->
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 14px 0;">
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
  } else {
    caption = `${topic} ⚡\n\nGuía visual paso a paso para líderes técnicos e ingenieros de software.\n\nDesliza para ver el desglose ➔\n\n💾 Guarda este post para tu próxima sesión de arquitectura.\n👉 Sígueme en ${author} para más contenido tech diario.\n\n#ingenieriadesistemas #arquitectura #programacion #tech #desarrollo`;
  }

  document.getElementById('caption-text-area').value = caption;
}

// Descarga en PDF (client-side con pdf-lib)
async function downloadPdfClient() {
  alert('⏳ Generando PDF para LinkedIn...');
  try {
    const { PDFDocument, rgb } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const node = document.getElementById('slide-capture-node');

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
    tr.innerHTML = `
      <td>${p.date || '-'}</td>
      <td><b>${p.topic || '-'}</b></td>
      <td><span class="tag-cyan">${p.category || '-'}</span></td>
      <td>${p.format || 'square'}</td>
      <td>${p.slideCount || 6}</td>
      <td>${p.blueprint || '-'}</td>
      <td>
        <span class="status-pill ${p.status === 'Publicado' ? 'publicado' : 'generado'}" data-id="${p.id}">
          ${p.status || 'Generado'}
        </span>
      </td>
      <td>
        <button class="btn-secondary btn-sm" onclick="alert('Publicación registrada en Google Sheets')">Ver</button>
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
  renderHistoryTable();
  alert('🔄 Tabla actualizada.');
});

// ==============================================================================
// CONFIGURACIÓN
// ==============================================================================
function initSettings() {
  const sheetsForm = document.getElementById('sheets-form');
  const brandForm = document.getElementById('brand-form');

  sheetsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = document.getElementById('sheet-webhook-url').value.trim();
    state.googleSheetUrl = url;
    localStorage.setItem('tech_sheet_url', url);
    alert('✅ URL de Google Sheets guardada.');
    loadData();
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
