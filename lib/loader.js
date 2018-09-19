"use strict";

const path = require("path");
const { Sequelize, DataTypes, models } = require("sequelize");
const Model = require("./model");
const SequelizeManager = require("./sequelize_manager");
const { extendClassMethods } = require('./utils')

class Loader {
	constructor(app, opts) {
		this.opts = opts;
		this.app = app;
		this.models = new Map();
		this.sequelizeManager = new SequelizeManager(opts);
	}

	load() {
		this.initModel();
    this.initAssociate();
    
    return this.models;
	}

	initModel() {
		const models = this.models;
		const app = this.app;
		const sequelizeManager = this.sequelizeManager;
		const modelDir = path.join(app.baseDir, "app/models");

		function initializer(obj, opts) {
			const modelClass = obj({ Model, DataTypes, Sequelize });
      const { attributes, options, database = "default" } = modelClass.definitions;
      const sequelize = sequelizeManager.get(database);
      
      models[modelClass.name] = sequelize.define(modelClass.name, attributes, Object.assign(options, { sequelize:  sequelize }))
			// models[modelClass.name] = modelClass.init(
			// 	attributes,
			// 	Object.assign(options, { sequelize: sequelizeManager.get(database) })
      // );
      
      extendClassMethods(models[modelClass.name], modelClass.prototype);

			return null;
		}
		app.loader.loadToApp(modelDir, "model", {
			caseStyle: "upper",
			initializer: initializer
		});
	}

	initAssociate() {
		for (let model of this.models) {
			if (model.associate) {
				model.association(models);
			}
		}
	}
}

module.exports = Loader;
