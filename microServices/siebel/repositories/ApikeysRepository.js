const db = require('../config/db');
const Schema = require('../models/init-models');

const { Apikeys } = Schema.default(db);

// @desc  Get one Apikey
exports.FetchOne = async (apikey) => {
  const key = await Apikeys.findOne({
    where: { api_key: apikey },
  });
  return key;
};
