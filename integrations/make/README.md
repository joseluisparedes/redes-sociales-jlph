# ⚡ Guía de Integración con Make.com (Integromat)

Esta guía te explica cómo importar el escenario de Make.com para publicar automáticamente tus carruseles e historias en **LinkedIn**, **Instagram** y **Facebook**.

---

## 📦 Archivo Blueprint Incluido
El archivo de importación oficial se encuentra en:
👉 [`integrations/make/make-scenario-blueprint.json`](make-scenario-blueprint.json)

---

## 🚀 Pasos para Configurar en Make.com (3 Minutos)

### 1. Crear un Nuevo Escenario e Importar el Blueprint
1. Inicia sesión en [**Make.com**](https://www.make.com/).
2. Ve a **Scenarios** ➔ **Create a new scenario**.
3. Haz clic en el botón de los tres puntos **`...` (More options)** en la barra inferior.
4. Selecciona **"Import Blueprint"** y sube el archivo [`make-scenario-blueprint.json`](make-scenario-blueprint.json).
5. Verás el diagrama completo generado automáticamente con el Webhook, Router y las 3 ramas de redes sociales.

---

### 2. Conectar tu Webhook
1. Haz clic en el primer módulo **"1. Receptor Webhook"**.
2. Haz clic en **"Add"** (Agregar) y nómbralo `Tech Content Webhook`.
3. Haz clic en **Save** y Make te entregará una URL como:
   `https://hook.eu2.make.com/xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
4. **Copia esa URL del Webhook**.
5. Pégala en tu Panel Web (pestaña *⚙️ Configuración & Parámetros ➔ Webhook de Make.com*) o en las variables de entorno de GitHub.

---

### 3. Vincular tus Cuentas de Redes Sociales
Haz clic en cada módulo del diagrama para iniciar sesión con tus credenciales:
* 💼 **Módulo LinkedIn**: Haz clic en *Add Connection* e inicia sesión con tu cuenta de LinkedIn.
* 📸 **Módulo Instagram Business**: Haz clic en *Add Connection* y selecciona tu página de Instagram vinculada a Facebook.
* 📘 **Módulo Facebook Pages**: Haz clic en *Add Connection* y selecciona tu Fan Page.

---

### 4. Activar el Escenario
1. En la parte inferior izquierda de Make.com, cambia el interruptor a **"ON"** (Active).
2. ¡Listo! Cada vez que GitHub Actions se dispare en automático (2 veces al día) o generes una publicación manual, Make recibirá el contenido y lo publicará en las redes que hayas marcado. 🚀
