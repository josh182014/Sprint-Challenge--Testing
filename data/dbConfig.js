const knex = require('knex');
const config = require('../knexfile.js');

const environment =  'testing';

module.exports = knex(config[environment]);
