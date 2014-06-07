var fs      = require('fs');
var _       = require('lodash');
var Scraper = require('./lib/index');
var apiKey  = require('./api.json').key;

var config = {
  apiKey     : apiKey,
  directory  : './results',
  altmetrics : ['views', 'citations'],
  query      : { 'type': 'abstract', 'term' : 'cats' },
  meta       : ['author_display', 'title_display', 'abstract', 'publication_date']
};

var PLoS = new Scraper(config);

PLoS.scrape(PLoS.writeJSON);

//PLoS.mergeJSON('./final/merged.json');
