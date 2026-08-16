/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: BASE DE DATOS Y CONFIGURACIÓN PARA AUTOMATIZACIÓN TECH
 * ==============================================================================
 * Instrucciones:
 * 1. Crea una hoja de Google Sheets.
 * 2. Ve a Extensiones -> Apps Script.
 * 3. Pega este código completo reemplazando todo.
 * 4. Haz clic en "Implementar" -> "Nueva implementación" -> Tipo: "Aplicación web".
 * 5. Ejecutar como: "Yo", Quién tiene acceso: "Cualquiera" (Anyone).
 * 6. Copia la URL generada y pégala en el Panel de Control Web -> Pestaña Configuración.
 * ==============================================================================
 */

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Hoja 1: Publicaciones
  let pubSheet = ss.getSheetByName("Publicaciones");
  if (!pubSheet) {
    pubSheet = ss.insertSheet("Publicaciones");
    pubSheet.appendRow([
      "ID", "Fecha", "Tema", "Categoria", "Formato", 
      "Cantidad_Slides", "Blueprint", "Estado", 
      "Ruta_PDF", "Ruta_Carpeta", "Copy_LinkedIn", "Copy_Instagram", "Creado_En"
    ]);
    pubSheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#0F172A").setFontColor("#38BDF8");
  }

  // Hoja 2: Parametros_Config
  let configSheet = ss.getSheetByName("Parametros_Config");
  if (!configSheet) {
    configSheet = ss.insertSheet("Parametros_Config");
    configSheet.appendRow(["Clave_Parametro", "Valor", "Descripcion"]);
    configSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#0F172A").setFontColor("#38BDF8");

    // Valores por defecto
    configSheet.appendRow(["author_name", "Ing. José Luis", "Nombre del autor visible en las diapositivas"]);
    configSheet.appendRow(["author_handle", "@joseluis_tech", "Usuario de redes sociales"]);
    configSheet.appendRow(["author_title", "Software Architecture & AI", "Título o especialidad profesional"]);
    configSheet.appendRow(["default_format", "square", "Formato por defecto (square, portrait, story)"]);
    configSheet.appendRow(["default_slide_count", "6", "Cantidad de diapositivas estándar"]);
    configSheet.appendRow(["default_blueprint", "standard_executive", "Estructura narrativa base"]);
    configSheet.appendRow(["default_category", "TECH & INGENIERÍA", "Categoría temática"]);
  }
}

function doGet(e) {
  setupDatabase();
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === "getConfig") {
    const configSheet = ss.getSheetByName("Parametros_Config");
    const data = configSheet.getDataRange().getValues();
    const configObj = { author: {}, defaults: {} };

    for (let i = 1; i < data.length; i++) {
      const key = data[i][0];
      const val = data[i][1];
      if (key === "author_name") configObj.author.name = val;
      if (key === "author_handle") configObj.author.handle = val;
      if (key === "author_title") configObj.author.title = val;
      if (key === "default_format") configObj.defaults.format = val;
      if (key === "default_slide_count") configObj.defaults.slideCount = Number(val);
      if (key === "default_blueprint") configObj.defaults.blueprint = val;
      if (key === "default_category") configObj.defaults.category = val;
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, config: configObj }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "getPublications") {
    const pubSheet = ss.getSheetByName("Publicaciones");
    const data = pubSheet.getDataRange().getValues();
    const records = [];

    for (let i = 1; i < data.length; i++) {
      records.push({
        id: data[i][0],
        date: data[i][1],
        topic: data[i][2],
        category: data[i][3],
        format: data[i][4],
        slideCount: data[i][5],
        blueprint: data[i][6],
        status: data[i][7],
        pdfPath: data[i][8],
        folderPath: data[i][9],
        copyLinkedIn: data[i][10],
        copyInstagram: data[i][11],
        createdAt: data[i][12]
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, records: records }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Google Sheets DB Online" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  setupDatabase();
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "saveConfig") {
      const configSheet = ss.getSheetByName("Parametros_Config");
      const cfg = body.config;
      configSheet.clearContents();
      configSheet.appendRow(["Clave_Parametro", "Valor", "Descripcion"]);
      configSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#0F172A").setFontColor("#38BDF8");

      if (cfg.author?.name) configSheet.appendRow(["author_name", cfg.author.name, "Nombre del autor"]);
      if (cfg.author?.handle) configSheet.appendRow(["author_handle", cfg.author.handle, "Usuario"]);
      if (cfg.author?.title) configSheet.appendRow(["author_title", cfg.author.title, "Título"]);
      if (cfg.defaults?.format) configSheet.appendRow(["default_format", cfg.defaults.format, "Formato"]);
      if (cfg.defaults?.slideCount) configSheet.appendRow(["default_slide_count", String(cfg.defaults.slideCount), "Slides"]);
      if (cfg.defaults?.blueprint) configSheet.appendRow(["default_blueprint", cfg.defaults.blueprint, "Blueprint"]);
      if (cfg.defaults?.category) configSheet.appendRow(["default_category", cfg.defaults.category, "Categoría"]);

      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "addPublication") {
      const pubSheet = ss.getSheetByName("Publicaciones");
      const r = body.record;
      pubSheet.appendRow([
        r.id || "",
        r.date || new Date().toISOString().split('T')[0],
        r.topic || "",
        r.category || "",
        r.format || "square",
        r.slideCount || 6,
        r.blueprint || "standard_executive",
        r.status || "Generado",
        r.pdfPath || "",
        r.folderPath || "",
        r.copyLinkedIn || "",
        r.copyInstagram || "",
        r.createdAt || new Date().toISOString()
      ]);

      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === "updateStatus") {
      const pubSheet = ss.getSheetByName("Publicaciones");
      const data = pubSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === body.id) {
          pubSheet.getRange(i + 1, 8).setValue(body.status); // Columna Estado
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Acción no reconocida" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
