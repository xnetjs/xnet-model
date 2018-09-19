const Loader = require("./lib/loader");
const Sequelize = require("sequelize");

module.exports = {
	name: "model",
	install: function(app, opts) {
		const models = new Loader(app, opts).load();
    app.inject('model', models);
    app.inject('Sequelize', Sequelize);
		app.getDelegator()(app.context, "app").getter("model");
	}
};
