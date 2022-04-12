const sequelizeBusiness = require("../business/sequelize.business");

module.exports = {
  async connection(req, res, next) {
    try {
      const response = await sequelizeBusiness.connection();
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async generate(req, res, next) {
    try {
      const response = await sequelizeBusiness.generate();
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },

  async force(req, res, next) {
    try {
      const response = await sequelizeBusiness.force();
      res.status(response.statusCode).json(response.body);
    } catch (error) {
      next(error);
    }
  },
};
