const fs = require('fs');
const path = require('path');

function getAssetBase64(filename) {
  try {
    const fullPath = path.join(__dirname, '../assets', filename);
    if (fs.existsSync(fullPath)) {
      const bitmap = fs.readFileSync(fullPath);
      const ext = path.extname(filename).replace('.', '');
      return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${bitmap.toString('base64')}`;
    }
  } catch (err) {
    console.error('Error loading asset:', filename, err);
  }
  return null;
}

function generateSlideHtml(slide, index, totalSlides, config = {}) {
  const {
    authorName = "Ing. José Luis",
    authorHandle = "@joseluis_tech",
    category = "IA & INGENIERÍA 2026",
    isStory = false
  } = config;

  const currentNum = String(index + 1).padStart(2, '0');
  const totalNum = String(totalSlides).padStart(2, '0');

  let bodyHtml = '';

  switch (slide.type) {
    case 'cover_hero':
    case 'cover':
      const heroImg = slide.image ? getAssetBase64(slide.image) : getAssetBase64('hero.jpg');
      bodyHtml = `
        <div class="cover-hero-layout">
          <div class="cover-left">
            ${slide.hookTag ? `<div class="cover-hook-tag"><span>${slide.hookTag}</span></div>` : ''}
            <h1 class="cover-title-big">${slide.title}</h1>
            <p class="cover-subtitle-big">${slide.subtitle || ''}</p>
            ${slide.stats && slide.stats.length ? `
              <div class="cover-stats-row">
                ${slide.stats.map(st => `
                  <div class="cover-stat-card">
                    <div class="cover-stat-icon">${st.icon}</div>
                    <div class="cover-stat-text">
                      <h5>${st.title}</h5>
                      <p>${st.desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          ${heroImg ? `
            <div class="cover-image-container">
              <img src="${heroImg}" alt="Hero 3D Illustration" />
            </div>
          ` : ''}
        </div>
      `;
      break;

    case 'split_contrast':
    case 'comparison':
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.heading}</h2>
          ${slide.subheading ? `<p class="slide-subheading-large">${slide.subheading}</p>` : ''}
          <div class="contrast-cards-grid">
            <div class="contrast-box vibe">
              <div class="contrast-top-header">
                <span class="contrast-badge-pill">${slide.left?.badge || 'VIBECODING'}</span>
                <span style="font-size: 28px;">${slide.left?.icon || '🕹️'}</span>
              </div>
              <h3 class="contrast-title-main">${slide.left?.title}</h3>
              <div class="contrast-bullet-list">
                ${(slide.left?.items || []).map(it => `
                  <div class="contrast-bullet-row">
                    <span class="icon-tag">⚡</span>
                    <span>${it}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="contrast-box arch">
              <div class="contrast-top-header">
                <span class="contrast-badge-pill">${slide.right?.badge || 'INGENIERÍA'}</span>
                <span style="font-size: 28px;">${slide.right?.icon || '🏗️'}</span>
              </div>
              <h3 class="contrast-title-main">${slide.right?.title}</h3>
              <div class="contrast-bullet-list">
                ${(slide.right?.items || []).map(it => `
                  <div class="contrast-bullet-row">
                    <span class="icon-tag">✓</span>
                    <span>${it}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    case 'impact_matrix':
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.heading}</h2>
          ${slide.subheading ? `<p class="slide-subheading-large">${slide.subheading}</p>` : ''}
          <div class="impact-rows-stack">
            ${(slide.rows || []).map(r => `
              <div class="impact-row-item ${r.type === 'good' ? 'good' : r.type === 'warn' ? 'warn' : 'bad'}">
                <div class="impact-left-content">
                  <div class="impact-icon-circle">${r.icon || '📊'}</div>
                  <div class="impact-text-block">
                    <h4>${r.title}</h4>
                    <p>${r.desc}</p>
                  </div>
                </div>
                <div class="impact-metric-pill">${r.stat}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'process_pipeline':
    case 'architecture':
      const pipeImg = slide.image ? getAssetBase64(slide.image) : getAssetBase64('pipeline.jpg');
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.heading}</h2>
          ${slide.subheading ? `<p class="slide-subheading-large">${slide.subheading}</p>` : ''}
          <div class="pipeline-visual-layout">
            <div class="pipeline-steps-col">
              ${(slide.steps || []).map((s, i) => `
                <div class="pipeline-step-item ${s.active ? 'active' : ''}">
                  <div class="pipeline-step-num">0${i+1}</div>
                  <div class="pipeline-step-text">
                    <h5>${s.title}</h5>
                    <p>${s.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            ${pipeImg ? `
              <div class="pipeline-image-container">
                <img src="${pipeImg}" alt="3D Architecture Pipeline" />
              </div>
            ` : ''}
          </div>
        </div>
      `;
      break;

    case 'golden_rules':
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.heading}</h2>
          ${slide.subheading ? `<p class="slide-subheading-large">${slide.subheading}</p>` : ''}
          <div class="golden-rules-stack">
            ${(slide.rules || []).map(rl => `
              <div class="golden-rule-card">
                <div class="golden-rule-icon">${rl.icon || '🎯'}</div>
                <div class="golden-rule-content">
                  <h4>${rl.title}</h4>
                  <p>${rl.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;

    case 'summary_cta':
      const futureImg = slide.image ? getAssetBase64(slide.image) : getAssetBase64('future.jpg');
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.heading || 'Conclusión Ejecutiva'}</h2>
          ${slide.subheading ? `<p class="slide-subheading-large">${slide.subheading}</p>` : ''}
          <div class="cta-layout-rich">
            ${futureImg ? `
              <div class="cta-image-container">
                <img src="${futureImg}" alt="Future of Engineering" />
              </div>
            ` : ''}
            <div class="cta-right-box">
              <h3 class="cta-box-title">${slide.question || '¿Y en tu empresa?'}</h3>
              <p class="cta-box-desc">${slide.questionDesc || '¿Ya aplican Vibecoding para prototipar o prefieren el desarrollo 100% manual?'}</p>
              <div class="cta-buttons-stack">
                <button class="cta-btn-large">${slide.cta?.primaryBtn || 'Comentar mi opinión 💬'}</button>
                <button class="cta-btn-large secondary">${slide.cta?.secondaryBtn || 'Guardar este Post 🔖'}</button>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    default:
      bodyHtml = `<div><h2 class="slide-heading-large">${slide.title || ''}</h2><p>${slide.content || ''}</p></div>`;
  }

  const isLast = index === totalSlides - 1;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slide ${currentNum}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="slide ${isStory ? 'story-mode' : ''}">
    <!-- Header -->
    <header class="slide-header">
      <div class="category-badge">
        <span class="dot"></span>
        <span>${slide.category || category}</span>
      </div>
      <div class="slide-counter">${currentNum} / ${totalNum}</div>
    </header>

    <!-- Main Body Content -->
    <main class="slide-body">
      ${bodyHtml}
    </main>

    <!-- Footer -->
    <footer class="slide-footer">
      <div class="author-info">
        <div class="author-avatar"><span>JL</span></div>
        <div class="author-text">
          <span class="author-name">${authorName}</span>
          <span class="author-handle">${authorHandle}</span>
        </div>
      </div>
      <div class="swipe-indicator">
        <span>${isLast ? 'Fin del carrusel' : 'Desliza'}</span>
        <span class="swipe-arrow">${isLast ? '✨' : '→'}</span>
      </div>
    </footer>
  </div>
</body>
</html>
  `;
}

module.exports = { generateSlideHtml };
