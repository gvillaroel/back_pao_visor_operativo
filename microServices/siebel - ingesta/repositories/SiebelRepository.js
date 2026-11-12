const db = require('../config/db');
const Schema = require('../models/init-models');

const { Siebel } = Schema.default(db);

exports.SaveSiebel = async (body) => {
  return await Siebel.create(body);
};
