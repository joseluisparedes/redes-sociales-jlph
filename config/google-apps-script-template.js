/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT: BASE DE DATOS Y CONFIGURACIÓN PARA AUTOMATIZACIÓN TECH
 * (VERSIÓN BULLETPROOF: SOPORTA GET Y POST SIN BLOQUEOS DE CORS)
 * ==============================================================================
 */

const SHEET_ID_OPTIONAL = '13s9kJ-VRFhW_TsVjMitsFkfLaOcOpFDe7-Mbim2hW00'; // Tu ID de Google Sheet

function getSpreadsheet() {
  if (SHEET_ID_OPTIONAL && SHEET_ID_OPTIONAL.trim() !== "") {
    return SpreadsheetApp.openById(SHEET_ID_OPTIONAL);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function setupDatabase() {
  const ss = getSpreadsheet();

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
  const params = e.parameter || {};
  const action = params.action || "test";
  const ss = getSpreadsheet();

  // 1. Agregar publicación vía GET (100% libre de CORS en navegadores)
  if (action === "addPublication") {
    const pubSheet = ss.getSheetByName("Publicaciones");
    pubSheet.appendRow([
      params.id || ("carrusel-" + Date.now()),
      params.date || (new Date().toISOString().split('T')[0]),
      params.topic || "Tema sin título",
      params.category || "TECH",
      params.format || "square",
      params.slideCount || 6,
      params.blueprint || "standard_executive",
      params.status || "Generado",
      params.pdfPath || "",
      params.folderPath || "",
      params.copyLinkedIn || "",
      params.copyInstagram || "",
      new Date().toISOString()
    ]);
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Registro guardado en Google Sheet" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Obtener Configuración
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

  // 3. Obtener todas las publicaciones
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

  // 4. Guardar Parámetros de Configuración vía GET
  if (action === "saveConfig") {
    const configSheet = ss.getSheetByName("Parametros_Config");
    configSheet.clearContents();
    configSheet.appendRow(["Clave_Parametro", "Valor", "Descripcion"]);
    configSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#0F172A").setFontColor("#38BDF8");

    if (params.author_name) configSheet.appendRow(["author_name", params.author_name, "Nombre del autor"]);
    if (params.author_handle) configSheet.appendRow(["author_handle", params.author_handle, "Usuario"]);
    if (params.author_title) configSheet.appendRow(["author_title", params.author_title, "Título"]);
    if (params.default_format) configSheet.appendRow(["default_format", params.default_format, "Formato"]);
    if (params.default_slide_count) configSheet.appendRow(["default_slide_count", String(params.default_slide_count), "Slides"]);
    if (params.default_blueprint) configSheet.appendRow(["default_blueprint", params.default_blueprint, "Blueprint"]);
    if (params.default_category) configSheet.appendRow(["default_category", params.default_category, "Categoría"]);

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Google Sheets DB Online" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return doGet(e);
}
