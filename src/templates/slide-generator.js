const fs = require('fs');
const path = require('path');
const { getTheme } = require('./themes');

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
    themeKey = "midnight_cyan",
    format = "square"
  } = config;

  const theme = getTheme(themeKey);
  const currentNum = String(index + 1).padStart(2, '0');
  const totalNum = String(totalSlides).padStart(2, '0');
  const isStory = format === 'story';
  const isPortrait = format === 'portrait';

  // Helper para resolver la imagen (Data URI directo o asset local)
  const resolveImage = (imgSrc, fallbackFilename) => {
    if (imgSrc && imgSrc.startsWith('data:image/')) return imgSrc;
    if (imgSrc && fs.existsSync(imgSrc)) {
      const bitmap = fs.readFileSync(imgSrc);
      return `data:image/jpeg;base64,${bitmap.toString('base64')}`;
    }
    return getAssetBase64(fallbackFilename || 'hero.jpg');
  };

  let bodyHtml = '';

  switch (slide.type) {
    case 'cover_hero':
    case 'cover':
      const heroImg = resolveImage(slide.image || slide.heroImage, 'hero.jpg');
      bodyHtml = `
        <div class="cover-hero-layout">
          <div class="cover-left">
            <div class="cover-hook-tag"><span>${slide.hook || slide.hookTag || '⚡ ANÁLISIS TÉCNICO'}</span></div>
            <h1 class="cover-title-big">${slide.title}</h1>
            <p class="cover-subtitle-big">${slide.subtitle || ''}</p>
            <div class="cover-stats-row">
              <div class="cover-stat-card">
                <div class="cover-stat-icon">🚀</div>
                <div class="cover-stat-text">
                  <h5>${slide.badge1 || 'Alta Escala'}</h5>
                  <p>Arquitectura 2026</p>
                </div>
              </div>
              <div class="cover-stat-card">
                <div class="cover-stat-icon">🛡️</div>
                <div class="cover-stat-text">
                  <h5>${slide.badge2 || 'Resiliencia'}</h5>
                  <p>Estándar Enterprise</p>
                </div>
              </div>
            </div>
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
      const contrastImg = resolveImage(slide.image || slide.architectureImage, 'pipeline.jpg');
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.title || slide.heading}</h2>
          ${slide.subtitle || slide.subheading ? `<p class="slide-subheading-large">${slide.subtitle || slide.subheading}</p>` : ''}
          <div class="contrast-cards-grid">
            <div class="contrast-box vibe">
              <div class="contrast-top-header">
                <span class="contrast-badge-pill" style="background: rgba(239, 68, 68, 0.15); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.3);">${slide.badTitle || slide.left?.title || 'Enfoque Tradicional'}</span>
                <span style="font-size: 28px;">⚠️</span>
              </div>
              <h3 class="contrast-title-main" style="color: #FECACA;">Riesgos & Deuda</h3>
              <div class="contrast-bullet-list">
                ${(slide.badItems || slide.left?.items || []).map(it => `
                  <div class="contrast-bullet-row">
                    <span class="icon-tag" style="color: #F87171;">✕</span>
                    <span>${it}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="contrast-box arch">
              <div class="contrast-top-header">
                <span class="contrast-badge-pill" style="background: ${theme.badgeBg}; color: ${theme.primaryAccent}; border: 1px solid ${theme.primaryAccent}40;">${slide.goodTitle || slide.right?.title || 'Arquitectura Recomendada'}</span>
                <span style="font-size: 28px;">🏗️</span>
              </div>
              <h3 class="contrast-title-main" style="color: #FFFFFF;">Diseño Sólido</h3>
              <div class="contrast-bullet-list">
                ${(slide.goodItems || slide.right?.items || []).map(it => `
                  <div class="contrast-bullet-row">
                    <span class="icon-tag" style="color: ${theme.primaryAccent};">✓</span>
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
    case 'metrics':
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.title || 'Impacto & Métricas'}</h2>
          ${slide.subtitle ? `<p class="slide-subheading-large">${slide.subtitle}</p>` : ''}
          <div class="stats-cards-grid">
            <div class="stat-big-box">
              <span class="stat-number-hero" style="color: ${theme.primaryAccent};">${slide.stat1 || slide.stats?.[0]?.num || '10x'}</span>
              <p class="stat-desc-hero">${slide.stat1Desc || slide.stats?.[0]?.label || 'Impacto en Rendimiento'}</p>
            </div>
            <div class="stat-big-box">
              <span class="stat-number-hero" style="color: ${theme.secondaryAccent};">${slide.stat2 || slide.stats?.[1]?.num || '-70%'}</span>
              <p class="stat-desc-hero">${slide.stat2Desc || slide.stats?.[1]?.label || 'Reducción de Latencia'}</p>
            </div>
            <div class="stat-big-box">
              <span class="stat-number-hero" style="color: #38BDF8;">${slide.stat3 || slide.stats?.[2]?.num || '100%'}</span>
              <p class="stat-desc-hero">${slide.stat3Desc || slide.stats?.[2]?.label || 'Disponibilidad P99'}</p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'process_pipeline':
    case 'pipeline':
      const pipeImg = resolveImage(slide.image || slide.pipelineImage, 'pipeline.jpg');
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.title || 'El Pipeline en 3 Fases'}</h2>
          ${slide.subtitle ? `<p class="slide-subheading-large">${slide.subtitle}</p>` : ''}
          <div class="pipeline-flow-container">
            <div class="pipeline-step-item">
              <div class="pipeline-step-badge" style="background: ${theme.primaryAccent}; color: #000;">1</div>
              <div class="pipeline-step-content">
                <h4>${slide.step1 || slide.pipeline?.[0] || '1. Diseño de Arquitectura'}</h4>
                <p>Delimitación de dominios, contratos de API y modelado de datos.</p>
              </div>
            </div>
            <div class="pipeline-step-item">
              <div class="pipeline-step-badge" style="background: ${theme.secondaryAccent}; color: #FFF;">2</div>
              <div class="pipeline-step-content">
                <h4>${slide.step2 || slide.pipeline?.[1] || '2. Implementación Modular'}</h4>
                <p>Desarrollo guiado por contexto, desacoplamiento y tipado estricto.</p>
              </div>
            </div>
            <div class="pipeline-step-item">
              <div class="pipeline-step-badge" style="background: #38BDF8; color: #000;">3</div>
              <div class="pipeline-step-content">
                <h4>${slide.step3 || slide.pipeline?.[2] || '3. Hardening & Observabilidad'}</h4>
                <p>Pruebas automatizadas, análisis de seguridad y monitoreo P99.</p>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    case 'golden_rules':
    case 'rules':
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.title || '3 Reglas de Oro'}</h2>
          ${slide.subtitle ? `<p class="slide-subheading-large">${slide.subtitle}</p>` : ''}
          <div class="rules-stack-grid">
            <div class="rule-card-item">
              <span class="rule-num-pill" style="color: ${theme.primaryAccent};">#1</span>
              <p class="rule-text-content">${slide.rule1 || slide.rules?.[0] || 'La IA escribe sintaxis; el Arquitecto define límites y contratos.'}</p>
            </div>
            <div class="rule-card-item">
              <span class="rule-num-pill" style="color: ${theme.primaryAccent};">#2</span>
              <p class="rule-text-content">${slide.rule2 || slide.rules?.[1] || 'Nunca lleves código a producción sin una suite de pruebas en verde.'}</p>
            </div>
            <div class="rule-card-item">
              <span class="rule-num-pill" style="color: ${theme.primaryAccent};">#3</span>
              <p class="rule-text-content">${slide.rule3 || slide.rules?.[2] || 'La verdadera ventaja competitiva está en el diseño del sistema.'}</p>
            </div>
          </div>
        </div>
      `;
      break;

    case 'summary_cta':
    case 'conclusion':
      const futureImg = resolveImage(slide.image || slide.futureImage, 'future.jpg');
      bodyHtml = `
        <div class="conclusion-split-layout">
          <div class="conclusion-left">
            <div class="cover-hook-tag"><span>DEBATE & CONCLUSIÓN</span></div>
            <h2 class="cover-title-big" style="font-size: 42px; margin-bottom: 20px;">${slide.title || 'El Futuro de la Ingeniería'}</h2>
            <div class="cta-question-card" style="border-left: 4px solid ${theme.primaryAccent};">
              <h3>${slide.question || '¿Y en tu empresa?'}</h3>
              <p>${slide.questionDesc || '¿Ya están adoptando estas prácticas o prefieren el flujo tradicional? Déjame tu opinión en los comentarios.'}</p>
            </div>
            <div class="cta-actions-bar">
              <div class="action-item"><span class="action-icon">💬</span><span>Comenta tu experiencia</span></div>
              <div class="action-item"><span class="action-icon">💾</span><span>Guarda para después</span></div>
              <div class="action-item"><span class="action-icon">🔄</span><span>Comparte con tu equipo</span></div>
            </div>
          </div>
          ${futureImg ? `
            <div class="conclusion-image-container">
              <img src="${futureImg}" alt="Futuro Tech" />
            </div>
          ` : ''}
        </div>
      `;
      break;

    default:
      bodyHtml = `
        <div>
          <h2 class="slide-heading-large">${slide.title || 'Análisis Técnico'}</h2>
          <p class="slide-subheading-large">${slide.subtitle || ''}</p>
          <div class="stat-big-box" style="margin-top: 40px;">
            <p style="font-size: 24px; color: #F8FAFC; line-height: 1.6;">${slide.content || 'Contenido técnico de alto impacto.'}</p>
          </div>
        </div>
      `;
      break;
  }

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Slide ${currentNum}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: ${theme.bgDark};
      --bg-card: ${theme.bgCard};
      --bg-card-elevated: ${theme.bgCardElevated};
      --primary-accent: ${theme.primaryAccent};
      --secondary-accent: ${theme.secondaryAccent};
      --accent-glow: ${theme.accentGlow};
      --text-main: ${theme.textMain};
      --text-muted: ${theme.textMuted};
      --gradient-hero: ${theme.gradientHero};
      --bg-gradient: ${theme.bgGradient};
      --badge-bg: ${theme.badgeBg};
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 100vw;
      height: 100vh;
      background: var(--bg-gradient);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: ${isStory ? '100px 70px' : '65px 75px'};
      position: relative;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Fondo de cuadrícula técnica */
    body::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 0;
    }

    /* Header superior */
    .slide-header {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 20px;
    }

    .header-category-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px;
      border-radius: 999px;
      background: var(--badge-bg);
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--primary-accent);
      text-transform: uppercase;
    }

    .header-page-counter {
      font-family: 'JetBrains Mono', monospace;
      font-size: 17px;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }

    .header-page-counter .curr { color: #FFFFFF; }

    /* Contenedor principal */
    .slide-body-content {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 25px 0;
    }

    /* Tipografías base */
    .slide-heading-large {
      font-family: 'Syne', sans-serif;
      font-size: 46px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: #FFFFFF;
      margin-bottom: 12px;
    }

    .slide-subheading-large {
      font-size: 22px;
      color: var(--text-muted);
      font-weight: 400;
      line-height: 1.45;
      margin-bottom: 30px;
    }

    /* Cover Hero Layout (2 Columnas) */
    .cover-hero-layout {
      display: grid;
      grid-template-columns: 1.35fr 0.85fr;
      gap: 40px;
      align-items: center;
    }

    .cover-hook-tag {
      display: inline-block;
      padding: 7px 16px;
      background: var(--badge-bg);
      border: 1px solid var(--primary-accent);
      border-radius: 6px;
      color: var(--primary-accent);
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .cover-title-big {
      font-family: 'Syne', sans-serif;
      font-size: 48px;
      font-weight: 800;
      line-height: 1.12;
      color: #FFFFFF;
      margin-bottom: 18px;
      letter-spacing: -0.02em;
    }

    .cover-subtitle-big {
      font-size: 21px;
      color: var(--text-muted);
      line-height: 1.45;
      margin-bottom: 30px;
    }

    .cover-stats-row {
      display: flex;
      gap: 18px;
    }

    .cover-stat-card {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 14px;
      background: var(--bg-card);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 14px 18px;
    }

    .cover-stat-icon { font-size: 26px; }
    .cover-stat-text h5 { font-size: 16px; font-weight: 700; color: #FFFFFF; }
    .cover-stat-text p { font-size: 12px; color: var(--text-muted); }

    .cover-image-container, .conclusion-image-container {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 35px var(--accent-glow);
      max-height: 480px;
    }

    .cover-image-container img, .conclusion-image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Split Contrast Cards */
    .contrast-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 26px;
    }

    .contrast-box {
      background: var(--bg-card);
      border-radius: 18px;
      padding: 30px 26px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
    }

    .contrast-box.arch {
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 25px var(--accent-glow);
    }

    .contrast-top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }

    .contrast-badge-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 999px;
      text-transform: uppercase;
    }

    .contrast-title-main {
      font-size: 23px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .contrast-bullet-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .contrast-bullet-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 17px;
      color: var(--text-main);
      line-height: 1.4;
    }

    .contrast-bullet-row .icon-tag {
      font-weight: 800;
      font-size: 18px;
    }

    /* Impact Matrix */
    .stats-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 22px;
    }

    .stat-big-box {
      background: var(--bg-card);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 40px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .stat-number-hero {
      font-family: 'Syne', sans-serif;
      font-size: 58px;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 14px;
      display: block;
    }

    .stat-desc-hero {
      font-size: 17px;
      color: var(--text-muted);
      line-height: 1.35;
    }

    /* Pipeline Flow */
    .pipeline-flow-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pipeline-step-item {
      display: flex;
      align-items: center;
      gap: 22px;
      background: var(--bg-card);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 20px 26px;
    }

    .pipeline-step-badge {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 800;
      flex-shrink: 0;
    }

    .pipeline-step-content h4 {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 4px;
    }

    .pipeline-step-content p {
      font-size: 15px;
      color: var(--text-muted);
    }

    /* Rules Stack */
    .rules-stack-grid {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .rule-card-item {
      display: flex;
      align-items: center;
      gap: 24px;
      background: var(--bg-card);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 24px 28px;
    }

    .rule-num-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      font-weight: 800;
      flex-shrink: 0;
    }

    .rule-text-content {
      font-size: 20px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 1.4;
    }

    /* Conclusion Split */
    .conclusion-split-layout {
      display: grid;
      grid-template-columns: 1.3fr 0.9fr;
      gap: 40px;
      align-items: center;
    }

    .cta-question-card {
      background: var(--bg-card);
      border-radius: 14px;
      padding: 22px 24px;
      margin-bottom: 24px;
    }

    .cta-question-card h3 {
      font-size: 22px;
      color: #FFFFFF;
      margin-bottom: 8px;
    }

    .cta-question-card p {
      font-size: 16px;
      color: var(--text-muted);
      line-height: 1.45;
    }

    .cta-actions-bar {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-item {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .action-icon {
      font-size: 22px;
    }

    /* Footer inferior */
    .slide-footer {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 20px;
    }

    .author-block {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .author-avatar-chip {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--gradient-hero);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 17px;
      color: #000000;
    }

    .author-meta .name {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .author-meta .handle {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--text-muted);
    }

    .footer-action-hint {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      color: var(--primary-accent);
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="slide-header">
    <div class="header-category-badge">
      <span>●</span>
      <span>${category}</span>
    </div>
    <div class="header-page-counter">
      <span class="curr">${currentNum}</span> / <span>${totalNum}</span>
    </div>
  </div>

  <div class="slide-body-content">
    ${bodyHtml}
  </div>

  <div class="slide-footer">
    <div class="author-block">
      <div class="author-avatar-chip">JL</div>
      <div class="author-meta">
        <div class="name">${authorName}</div>
        <div class="handle">${authorHandle}</div>
      </div>
    </div>
    <div class="footer-action-hint">
      <span>${index === totalSlides - 1 ? 'GUARDAR & COMPARTIR' : 'DESLIZA ➔'}</span>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = { generateSlideHtml };
