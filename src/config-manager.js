const fs = require('fs-extra');
const path = require('path');

const BRAND_CONFIG_PATH = path.join(__dirname, '../config/brand-config.json');
const BLUEPRINTS_PATH = path.join(__dirname, '../config/blueprints.json');

class ConfigManager {
  constructor() {
    this.brandConfig = fs.readJsonSync(BRAND_CONFIG_PATH, { throws: false }) || {};
    this.blueprints = fs.readJsonSync(BLUEPRINTS_PATH, { throws: false })?.blueprints || {};
  }

  getBrand() {
    return this.brandConfig.author || {
      name: "Ing. José Luis",
      handle: "@joseluis_tech",
      title: "Software Architecture & AI"
    };
  }

  getBlueprint(name) {
    return this.blueprints[name] || this.blueprints['standard_executive'];
  }

  getAllBlueprints() {
    return this.blueprints;
  }

  /**
   * Genera el plan de diapositivas totalmente parametrizado.
   */
  buildCarouselPlan(options = {}) {
    const {
      topic = "Innovación en Arquitectura de Software",
      blueprint = this.brandConfig.defaults?.blueprint || 'standard_executive',
      slideCount = null,
      customStructure = null,
      format = this.brandConfig.defaults?.format || 'square',
      category = this.brandConfig.defaults?.category || 'TECH & INGENIERÍA'
    } = options;

    let selectedSlides = [];

    // 1. Si el usuario definió una estructura manual personalizada
    if (customStructure && Array.isArray(customStructure)) {
      selectedSlides = customStructure;
    } else {
      // 2. Si usa un blueprint predefinido
      const bp = this.getBlueprint(blueprint);
      selectedSlides = [...bp.slides];

      // 3. Si el usuario especificó una cantidad exacta de slides
      if (slideCount && typeof slideCount === 'number') {
        if (slideCount < selectedSlides.length) {
          // Tomar hasta slideCount asegurando que la última siempre sea CTA
          const lastSlide = selectedSlides[selectedSlides.length - 1];
          selectedSlides = selectedSlides.slice(0, slideCount - 1);
          selectedSlides.push(lastSlide);
        }
      }
    }

    return {
      topic,
      category,
      format,
      author: this.getBrand(),
      totalSlides: selectedSlides.length,
      blueprintName: blueprint,
      structure: selectedSlides
    };
  }
}

module.exports = { ConfigManager };
