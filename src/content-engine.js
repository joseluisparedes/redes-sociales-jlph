const fs = require('fs-extra');
const path = require('path');
const { CarouselRenderer } = require('./renderer');
const { ConfigManager } = require('./config-manager');

class ContentEngine {
  constructor(options = {}) {
    this.configManager = new ConfigManager();
    this.renderer = new CarouselRenderer(options);
  }

  /**
   * Genera el plan parametrizado del carrusel.
   */
  createPlan(params = {}) {
    return this.configManager.buildCarouselPlan(params);
  }

  /**
   * Renderiza el carrusel a partir de un plan o datos estructurados.
   */
  async render(carouselData) {
    const brand = this.configManager.getBrand();
    const fullData = {
      author: brand,
      ...carouselData
    };
    return await this.renderer.render(fullData);
  }

  /**
   * Devuelve todos los blueprints disponibles para elegir.
   */
  listBlueprints() {
    return this.configManager.getAllBlueprints();
  }
}

module.exports = { ContentEngine };
