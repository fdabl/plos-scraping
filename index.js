var fs      = require('fs');
var _       = require('lodash');
var async   = require('async');
var Scraper = require('./lib/index');
var apiKey  = require('./api.json').key;

var config  = { apiKey: apiKey }; // look at the defaults in lib/index.js

var PLoS = new Scraper(config);
var queries = [
  { 'type': 'subject', 'term': 'psychology' },
  { 'type': 'subject', 'term': 'biotechnology' },
  { 'type': 'subject', 'term': 'physics' },
  { 'type': 'subject', 'term': 'geography' },
  { 'type': 'subject', 'term': 'economics'},
  { 'type': 'subject', 'term': 'chemistry'},
  { 'type': 'subject', 'term': 'medicine'},
];

PLoS.parallel(queries, './final/merged.json');
