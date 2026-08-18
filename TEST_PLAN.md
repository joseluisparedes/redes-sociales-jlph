# 🧪 Plan Maestro de Pruebas: Tech Content Engine & Autopublicador Multired

Este plan de pruebas ha sido diseñado combinando la rigurosidad de **The Architect** (criterios de aceptación EARS y trazabilidad de arquitectura), **Cyber-Neo** (análisis de riesgos y blindaje de seguridad OWASP) y **All-Deploy** (pruebas de humo, salud operativa y despliegue).

---

## 🎯 1. Matriz de Cobertura y Tipos de Prueba

1. **🌐 Interfaz & Renderizado (Frontend):** Autenticación, selectores de redes/formatos, canvas 2X Retina y compilación de PDF para LinkedIn.
2. **📊 Base de Datos (Google Sheets DB):** Sincronización libre de bloqueos de CORS, integridad de columnas y conmutador de estados.
3. **⏰ Automatización (GitHub Actions Cron):** Motor headless Playwright, cron desatendido (8:00 AM y 6:00 PM) y disparo manual.
4. **⚡ Despacho Multired (Make.com):** Enrutamiento según redes seleccionadas (LinkedIn Document, Instagram Carousel, Facebook Album).
5. **🛡️ Ciberseguridad (Cyber-Neo):** Prevención de XSS, control de acceso y protección de secretos.

---

## 🏗️ 2. Casos de Prueba con Criterios de Aceptación EARS

> **Formato EARS:** *WHEN `<disparador>` THE SYSTEM SHALL `<respuesta observable>`*

### 🔹 Módulo A: Interfaz de Usuario y Selección de Parámetros
* **TC-UI-01 (Login):** **WHEN** el usuario ingresa `admin` / `tech2026` **THE SYSTEM SHALL** desbloquear el dashboard y almacenar el token en `localStorage`. *(Prioridad: P0)*
* **TC-UI-02 (Validación Redes):** **WHEN** el usuario desmarca todas las redes e intenta generar **THE SYSTEM SHALL** alertar `Por favor selecciona al menos una red social`. *(Prioridad: P1)*
* **TC-UI-03 (Formatos 1:1, 9:16, 16:9, 4:5):** **WHEN** el usuario selecciona una proporción **THE SYSTEM SHALL** adaptar el contenedor de previsualización en vivo. *(Prioridad: P1)*

### 🔹 Módulo B: Renderizado y Compilación Gráfica
* **TC-REN-01 (Generación de Láminas):** **WHEN** se presiona Generar **THE SYSTEM SHALL** construir las diapositivas con tipografía Google Fonts y acentos cromáticos. *(Prioridad: P0)*
* **TC-REN-02 (Descarga de PDF):** **WHEN** se hace clic en `📄 Descargar PDF` **THE SYSTEM SHALL** compilar y descargar el documento PDF vectorial de 1080x1080 px para LinkedIn. *(Prioridad: P0)*

### 🔹 Módulo C: Base de Datos en Google Sheets
* **TC-DB-01 (Registro Automático):** **WHEN** se genera un carrusel **THE SYSTEM SHALL** enviar el registro a Google Apps Script e insertar la fila en `Publicaciones`. *(Prioridad: P0)*
* **TC-DB-02 (Conmutador de Estado):** **WHEN** se hace clic en la píldora de estado **THE SYSTEM SHALL** alternar entre `Generado` y `Publicado`. *(Prioridad: P2)*

### 🔹 Módulo D: Make.com & GitHub Actions Cron
* **TC-MK-01 (Despacho a Make):** **WHEN** se presiona `⚡ Despachar a Make` **THE SYSTEM SHALL** emitir el payload JSON con `topic`, `captions`, `networks` y `assets`. *(Prioridad: P0)*
* **TC-CRON-01 (Ejecución Desatendida):** **WHEN** el cron de GitHub alcanza las 8:00 AM o 6:00 PM **THE SYSTEM SHALL** renderizar el tema diario y enviarlo a Make sin intervención humana. *(Prioridad: P0)*

---

## 🛡️ 3. Auditoría de Ciberseguridad (Cyber-Neo)

* **Prevención de XSS:** Los títulos y temas se escapan en el DOM para evitar inyección de scripts.
* **Control de Acceso:** Redirección automática al login si no existe token válido.
* **Gestión Segura de Secretos:** La URL del webhook de Make se guarda en `GitHub Secrets` (`MAKE_WEBHOOK_URL`).
