var fs      = require('fs');
var Scraper = require('./lib/index');
var apiKey  = require('./api.json').key;

var query = { 'type': 'abstract', 'term': 'dogs' };
var metadata = ['author_display', 'title_display', 'abstract', 'publication_date'];
var altmetrics = ['views', 'citations'];

var PLoS = new Scraper(apiKey, query, metadata, altmetrics);

var write = function(err, data) {
  fs.writeFile('result.json', JSON.stringify(data, null, 4), function(err) {
    if (err) {
      console.log('Something horrible happened. Evacuate the room.');
      throw err;
    }
  });
};

PLoS.scrape(write);
