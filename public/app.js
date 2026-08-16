// Estado global
let state = {
  token: localStorage.getItem('tech_token') || null,
  config: null,
  blueprints: {},
  currentCarousel: null,
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
    loadInitialData();
  } else {
    loginView.style.display = 'flex';
    appView.style.display = 'none';
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.innerText = '';
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        state.token = data.token;
        localStorage.setItem('tech_token', data.token);
        loginView.style.display = 'none';
        appView.style.display = 'flex';
        loadInitialData();
      } else {
        loginError.innerText = data.message || 'Error de autenticación';
      }
    } catch (err) {
      loginError.innerText = 'No se pudo conectar con el servidor';
    }
  });

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('tech_token');
    state.token = null;
    window.location.reload();
  });
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${state.token}`
  };
}

// ==============================================================================
// NAVEGACIÓN POR TABS
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
        loadHistory();
      }
    });
  });
}

// ==============================================================================
// CARGA DE DATOS INICIALES
// ==============================================================================
async function loadInitialData() {
  try {
    // 1. Cargar Configuración
    const cfgRes = await fetch('/api/config', { headers: authHeaders() });
    const cfgData = await cfgRes.json();
    if (cfgData.success) {
      state.config = cfgData.config;
      document.getElementById('nav-author-name').innerText = cfgData.config?.author?.name || 'Ing. José Luis';
      
      const sheetsPill = document.getElementById('sheets-status-pill');
      const sheetsText = document.getElementById('sheets-status-text');
      if (cfgData.hasWebhook) {
        sheetsPill.style.background = 'rgba(16, 185, 129, 0.15)';
        sheetsPill.style.color = '#10B981';
        sheetsText.innerText = 'Google Sheets Conectado';
      } else {
        sheetsPill.style.background = 'rgba(245, 158, 11, 0.15)';
        sheetsPill.style.color = '#F59E0B';
        sheetsText.innerText = 'Local DB (Sin conectar)';
      }

      // Populate Settings inputs
      document.getElementById('cfg-author-name').value = cfgData.config?.author?.name || '';
      document.getElementById('cfg-author-handle').value = cfgData.config?.author?.handle || '';
      document.getElementById('cfg-author-title').value = cfgData.config?.author?.title || '';
      document.getElementById('sheet-webhook-url').value = cfgData.webhookUrl || '';
    }

    // 2. Cargar Blueprints
    const bpRes = await fetch('/api/blueprints', { headers: authHeaders() });
    const bpData = await bpRes.json();
    if (bpData.success) {
      state.blueprints = bpData.blueprints;
      updateBlueprintSummary();
    }
  } catch (err) {
    console.error('Error al cargar datos:', err);
  }
}

// ==============================================================================
// GENERADOR DE CARRUSELES
// ==============================================================================
function initGenerator() {
  const blueprintSelect = document.getElementById('gen-blueprint');
  const slideCountInput = document.getElementById('gen-slide-count');
  const slideCountVal = document.getElementById('slide-count-val');
  const generateForm = document.getElementById('generate-form');

  // Quick topics chips
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

  // Envío del formulario de generación
  generateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const topic = document.getElementById('gen-topic').value.trim();
    const category = document.getElementById('gen-category').value.trim();
    const format = document.getElementById('gen-format').value;
    const blueprint = document.getElementById('gen-blueprint').value;
    const slideCount = Number(document.getElementById('gen-slide-count').value);

    const previewContainer = document.getElementById('preview-container');
    const previewLoading = document.getElementById('preview-loading');
    const previewActions = document.getElementById('preview-actions');
    const captionsBox = document.getElementById('captions-container');

    previewContainer.innerHTML = '';
    previewLoading.style.display = 'block';
    previewActions.style.display = 'none';
    captionsBox.style.display = 'none';

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          topic,
          category,
          format,
          blueprint,
          slideCount
        })
      });

      const data = await res.json();
      previewLoading.style.display = 'none';

      if (data.success && data.renderResult) {
        state.currentCarousel = data.renderResult;
        state.currentSlideIndex = 0;
        renderSlideViewer(data.renderResult.images);

        if (data.renderResult.pdf) {
          previewActions.style.display = 'block';
          document.getElementById('btn-download-pdf').href = data.renderResult.pdf;
        }

        // Mostrar copys
        captionsBox.style.display = 'block';
        updateCaptionText('linkedin');
      } else {
        previewContainer.innerHTML = `<div class="error-msg">Error: ${data.error || 'No se pudo generar'}</div>`;
      }
    } catch (err) {
      previewLoading.style.display = 'none';
      previewContainer.innerHTML = `<div class="error-msg">Error de conexión con el motor de renderizado</div>`;
    }
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

function renderSlideViewer(images) {
  const container = document.getElementById('preview-container');
  if (!images || images.length === 0) return;

  container.innerHTML = `
    <div class="slide-viewer">
      <div class="slide-img-box">
        <img id="viewer-active-img" src="${images[state.currentSlideIndex]}" alt="Slide Preview" />
      </div>
      <div class="slide-nav-controls">
        <button id="btn-prev-slide" class="btn-secondary btn-sm" ${state.currentSlideIndex === 0 ? 'disabled' : ''}>← Anterior</button>
        <span id="viewer-counter" class="tag-cyan">${state.currentSlideIndex + 1} / ${images.length}</span>
        <button id="btn-next-slide" class="btn-secondary btn-sm" ${state.currentSlideIndex === images.length - 1 ? 'disabled' : ''}>Siguiente →</button>
      </div>
    </div>
  `;

  document.getElementById('btn-prev-slide').addEventListener('click', () => {
    if (state.currentSlideIndex > 0) {
      state.currentSlideIndex--;
      updateViewer(images);
    }
  });

  document.getElementById('btn-next-slide').addEventListener('click', () => {
    if (state.currentSlideIndex < images.length - 1) {
      state.currentSlideIndex++;
      updateViewer(images);
    }
  });
}

function updateViewer(images) {
  document.getElementById('viewer-active-img').src = images[state.currentSlideIndex];
  document.getElementById('viewer-counter').innerText = `${state.currentSlideIndex + 1} / ${images.length}`;
  document.getElementById('btn-prev-slide').disabled = state.currentSlideIndex === 0;
  document.getElementById('btn-next-slide').disabled = state.currentSlideIndex === images.length - 1;
}

function updateCaptionText(type) {
  const topic = document.getElementById('gen-topic').value.trim();
  const author = state.config?.author?.handle || '@joseluis_tech';

  let caption = "";
  if (type === 'linkedin') {
    caption = `¿Cómo resolver "${topic}" con estándares de alta escala? 🚀\n\nEn este carrusel técnico desglosamos las decisiones de arquitectura, los trade-offs y las 3 reglas de oro para implementar en producción.\n\n📌 Desliza el documento adjunto para ver el blueprint completo.\n\n¿Qué enfoque aplicas tú en tu empresa? Te leo en los comentarios. 👇\n\n#SystemDesign #SoftwareEngineering #Cloud #TechLeadership #DevOps`;
  } else {
    caption = `${topic} ⚡\n\nGuía visual paso a paso para líderes técnicos e ingenieros de software.\n\nDesliza para ver el desglose ➔\n\n💾 Guarda este post para tu próxima sesión de arquitectura.\n👉 Sígueme en ${author} para más contenido tech diario.\n\n#ingenieriadesistemas #arquitectura #programacion #tech #desarrollo`;
  }

  document.getElementById('caption-text-area').value = caption;
}

// ==============================================================================
// HISTORIAL & GOOGLE SHEETS
// ==============================================================================
async function loadHistory() {
  const tbody = document.getElementById('history-table-body');
  tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Cargando registros...</td></tr>';

  try {
    const res = await fetch('/api/publications', { headers: authHeaders() });
    const data = await res.json();
    if (data.success && Array.isArray(data.publications)) {
      tbody.innerHTML = '';
      if (data.publications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay publicaciones registradas aún.</td></tr>';
        return;
      }

      data.publications.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.date || '-'}</td>
          <td><b>${p.topic || '-'}</b></td>
          <td><span class="tag-cyan">${p.category || '-'}</span></td>
          <td>${p.format || 'square'}</td>
          <td>${p.slideCount || 6}</td>
          <td>${p.blueprint || '-'}</td>
          <td>
            <span class="status-pill ${p.status === 'Publicado' ? 'publicado' : 'generado'}" data-id="${p.id}" data-status="${p.status}">
              ${p.status || 'Generado'}
            </span>
          </td>
          <td>
            ${p.pdfPath ? `<a href="${p.pdfPath}" target="_blank" class="btn-secondary btn-sm">PDF</a>` : ''}
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Toggle status listener
      document.querySelectorAll('.status-pill').forEach(pill => {
        pill.addEventListener('click', async () => {
          const id = pill.dataset.id;
          const currentStatus = pill.dataset.status;
          const newStatus = currentStatus === 'Publicado' ? 'Generado' : 'Publicado';

          await fetch('/api/publications/status', {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ id, status: newStatus })
          });
          loadHistory();
        });
      });
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Error al sincronizar con la base de datos</td></tr>';
  }
}

document.getElementById('btn-refresh-history')?.addEventListener('click', loadHistory);

// ==============================================================================
// CONFIGURACIÓN & GOOGLE SHEETS FORM
// ==============================================================================
function initSettings() {
  const sheetsForm = document.getElementById('sheets-form');
  const brandForm = document.getElementById('brand-form');

  sheetsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('sheet-webhook-url').value.trim();

    try {
      const res = await fetch('/api/sheets/webhook', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Conexión con Google Sheets guardada con éxito.');
        loadInitialData();
      }
    } catch (err) {
      alert('❌ Error al guardar URL de Google Sheets');
    }
  });

  brandForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cfg-author-name').value.trim();
    const handle = document.getElementById('cfg-author-handle').value.trim();
    const title = document.getElementById('cfg-author-title').value.trim();
    const format = document.getElementById('cfg-default-format').value;
    const slideCount = Number(document.getElementById('cfg-default-slides').value);

    const newConfig = {
      ...state.config,
      author: { name, handle, title },
      defaults: { ...state.config?.defaults, format, slideCount }
    };

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ config: newConfig })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Parámetros de marca actualizados en Google Sheets y local.');
        loadInitialData();
      }
    } catch (err) {
      alert('❌ Error al guardar parámetros');
    }
  });
}
