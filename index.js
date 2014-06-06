var Scraper = require('./lib/index');
var apiKey  = require('./api.json').key;

var query = { 'subject': 'author', 'term': 'ischebeck' };
var PLoS  = new Scraper(apiKey, query, undefined, undefined);


PLoS.scrape(function(err, data) {
  if (err) throw err;
  console.log(data);
});
