const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const LOCAL_DB_PATH = path.join(__dirname, '../config/local-db.json');
const BRAND_CONFIG_PATH = path.join(__dirname, '../config/brand-config.json');

class SheetsDB {
  constructor() {
    this.ensureLocalDb();
  }

  ensureLocalDb() {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initialData = {
        publications: [
          {
            id: "carrusel-vibecoding-v2",
            date: new Date().toISOString().split('T')[0],
            topic: "El Fenómeno del Vibecoding en las Empresas",
            category: "IA & INGENIERÍA 2026",
            format: "square",
            slideCount: 6,
            blueprint: "standard_executive",
            status: "Generado",
            pdfPath: "/output/carrusel-vibecoding-v2/carrusel-vibecoding-v2_linkedin.pdf",
            folderPath: "output/carrusel-vibecoding-v2",
            createdAt: new Date().toISOString()
          }
        ],
        googleSheetWebhookUrl: ""
      };
      fs.writeJsonSync(LOCAL_DB_PATH, initialData, { spaces: 2 });
    }
  }

  getLocalDb() {
    this.ensureLocalDb();
    return fs.readJsonSync(LOCAL_DB_PATH);
  }

  saveLocalDb(data) {
    fs.writeJsonSync(LOCAL_DB_PATH, data, { spaces: 2 });
  }

  getWebhookUrl() {
    const db = this.getLocalDb();
    return db.googleSheetWebhookUrl || process.env.GOOGLE_SHEETS_WEBHOOK_URL || "";
  }

  setWebhookUrl(url) {
    const db = this.getLocalDb();
    db.googleSheetWebhookUrl = url;
    this.saveLocalDb(db);
  }

  /**
   * Obtiene todos los parámetros de configuración (desde Google Sheet si está conectado, o local).
   */
  async getConfig() {
    const webhook = this.getWebhookUrl();
    if (webhook) {
      try {
        const response = await axios.get(`${webhook}?action=getConfig`, { timeout: 8000 });
        if (response.data && response.data.success) {
          return response.data.config;
        }
      } catch (err) {
        console.warn('⚠️ Google Sheets no respondió a getConfig, usando config local:', err.message);
      }
    }

    // Fallback local
    return fs.readJsonSync(BRAND_CONFIG_PATH, { throws: false }) || {};
  }

  /**
   * Guarda parámetros de configuración en Google Sheet y en local.
   */
  async saveConfig(newConfig) {
    fs.writeJsonSync(BRAND_CONFIG_PATH, newConfig, { spaces: 2 });

    const webhook = this.getWebhookUrl();
    if (webhook) {
      try {
        await axios.post(webhook, {
          action: "saveConfig",
          config: newConfig
        }, { timeout: 8000 });
        console.log('✅ Parámetros guardados en Google Sheets');
      } catch (err) {
        console.warn('⚠️ No se pudo sincronizar parámetros con Google Sheets:', err.message);
      }
    }
    return newConfig;
  }

  /**
   * Obtiene la lista de publicaciones.
   */
  async getPublications() {
    const webhook = this.getWebhookUrl();
    if (webhook) {
      try {
        const response = await axios.get(`${webhook}?action=getPublications`, { timeout: 8000 });
        if (response.data && response.data.success && Array.isArray(response.data.records)) {
          return response.data.records;
        }
      } catch (err) {
        console.warn('⚠️ Fallback a BD local para publicaciones:', err.message);
      }
    }

    const db = this.getLocalDb();
    return db.publications || [];
  }

  /**
   * Registra una nueva publicación en Google Sheet y localmente.
   */
  async recordPublication(publicationData) {
    const db = this.getLocalDb();
    db.publications = db.publications || [];
    // Insert at beginning
    db.publications.unshift(publicationData);
    this.saveLocalDb(db);

    const webhook = this.getWebhookUrl();
    if (webhook) {
      try {
        await axios.post(webhook, {
          action: "addPublication",
          record: publicationData
        }, { timeout: 8000 });
        console.log('✅ Publicación registrada en Google Sheets BD');
      } catch (err) {
        console.warn('⚠️ No se pudo registrar en Google Sheets:', err.message);
      }
    }

    return publicationData;
  }

  /**
   * Actualiza el estado de una publicación (ej. "Publicado").
   */
  async updateStatus(id, newStatus) {
    const db = this.getLocalDb();
    const item = (db.publications || []).find(p => p.id === id);
    if (item) {
      item.status = newStatus;
      item.updatedAt = new Date().toISOString();
      this.saveLocalDb(db);
    }

    const webhook = this.getWebhookUrl();
    if (webhook) {
      try {
        await axios.post(webhook, {
          action: "updateStatus",
          id,
          status: newStatus
        }, { timeout: 8000 });
      } catch (err) {
        console.warn('⚠️ Error al actualizar estado en Google Sheets:', err.message);
      }
    }

    return item;
  }
}

module.exports = { SheetsDB };
