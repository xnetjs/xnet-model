"use strict";

const Sequelize = require("sequelize");

class BaseModel extends Sequelize.Model {
	constructor() {
		super(...arguments);
		this.root = true;
	}
	async getList({
		where,
		attributes = null,
		include = [],
		order = [],
		page = 1,
		pageSize = 20
	}) {
		let queryParams = {
			where: where,
			order: order,
			limit: pageSize,
			offset: (page - 1) * pageSize,
			include: include
		};
		if (attributes) {
			queryParams.attributes = attributes;
		}
		const result = await this.findAndCountAll(queryParams);

		return result;
	}
}
BaseModel.definitions = {
	attributes: {},
	options: {},
	database: "default"
};
BaseModel.association = function() {};

module.exports = BaseModel;
