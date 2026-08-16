# ⚡ Tech Content Engine | Panel de Control de Automatización

Sistema ejecutivo de automatización y generación de carruseles e historias técnicas de alta calidad para redes sociales (**LinkedIn, Instagram, Facebook**), diseñado para ingenieros de sistemas y líderes de tecnología.

---

## 🚀 Características Principales

- **🌐 Panel de Control Web:** Interfaz gráfica ejecutiva (*Dark Slate Tech*) protegida con login para parametrizar guiones, formatos, número de slides y temas.
- **🎨 Motor Gráfico Ultra-Nítido (2X Retina):** Renderizado vectorial basado en HTML5/CSS3 con Playwright para generar imágenes cuadradas (1:1 / 3:3), verticales (4:5) o historias (9:16), y compilación automática del PDF para LinkedIn.
- **📊 Google Sheets como Base de Datos:** Registro bidireccional en tiempo real de publicaciones, métricas, estados (`Generado`, `Publicado`) y parámetros de configuración global.
- **📐 Catálogo de Blueprints Narrativos:** Plantillas de guiones parametrizables (Estándar 6 slides, Historia Tecnológica 5 slides, Deep Dive 8 slides, Comparativa 4 slides).
- **🤖 Integración de Arte 3D:** Ilustraciones tecnológicas e incorporates conceptuales 3D que respaldan cada tema.

---

## 🛠️ Instalación y Uso Local

1. **Clonar e instalar dependencias:**
   ```bash
   npm install
   npx playwright install chromium
   ```

2. **Iniciar el Panel de Control Web:**
   ```bash
   node server.js
   ```

3. **Abrir en el navegador:**
   - URL: `http://localhost:3000`
   - **Usuario:** `admin`
   - **Contraseña:** `tech2026`

---

## 📊 Configuración de Google Sheets como Base de Datos

1. Abre [Google Sheets](https://sheets.new) y crea una nueva hoja de cálculo.
2. Ve a **Extensiones ➔ Apps Script**.
3. Pega el código que se encuentra en [`config/google-apps-script-template.js`](./config/google-apps-script-template.js).
4. Haz clic en **Implementar ➔ Nueva implementación ➔ Tipo: Aplicación web**:
   - *Ejecutar como:* **Yo**
   - *Quién tiene acceso:* **Cualquiera**
5. Copia la URL generada y pégala en el Panel de Control Web en la pestaña **"⚙️ Configuración & Parámetros"**.

---

## 📁 Estructura del Proyecto

```text
├── config/
│   ├── brand-config.json              # Parámetros globales de autor y defaults
│   ├── blueprints.json                # Catálogo de estructuras narrativas
│   └── google-apps-script-template.js # Código para Google Sheets
├── public/                            # Frontend del Panel Web
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/                               # Backend y Motores
│   ├── renderer.js                    # Motor Playwright Retina
│   ├── sheets-db.js                   # Conector Google Sheets DB
│   ├── config-manager.js              # Gestor de parámetros y blueprints
│   ├── content-engine.js              # Orquestador
│   └── templates/                     # Plantillas HTML/CSS
├── output/                            # PDFs e imágenes generadas
└── server.js                          # Servidor Express & API REST
```
