var _       = require('lodash');
var async   = require('async');
var request = require('request');
var parse   = require('./parser');


var Scraper = function(apiKey, query, metrics, altmetrics) {

  var self        = this;
  this.apiKey     = apiKey;
  this.metrics    = metrics || [];
  this.altmetrics = altmetrics || ['citations', 'views'];
  this.query      = query || { 'subject': 'psychology' };

  /********************************************
  * Scraper.getArticles:
  *
  * Takes a URL (prepared with utility.query)
  * and makes a GET Request. Example URL:
  * http://api.plos.org/search?q={type:}"{term}"&api_key={key}
  *
  * where type could be "subject", "author", "title" etc.
  * The ressource is an XML blob, which gets parsed and then returns
  * a JSON blob, like so:
  * {
  *   "10.1371/journal.pone.0083558": {
  *                     "id": "10.1371/journal.pone.0083558",
  *                     "author": ["Random", "People"],
  *                     "title": "Random Title",
  *                     "abstract": "Complex random thingy",
  *                     "journal": "PLoS ONE"
  *                   }
  *
  * }
  ********************************************/

  this.getArticles = function(query, cb) {
    var url = this.prepare(query);
    request(url, function(err, res, body) {
      if (err) return cb(err);

      var articles = parse(body, self.metrics);
      cb(null, articles);
    });
  };

  /********************************************
  * Scraper.getAltmetrics:
  *
  * takes the articles (JSON blob) from the main.getArticles function;
  * extracts the keys (which are the DOIs); wraps them into another URL:
  * 
  * 10.1371/journal.pone.0083558 =>
  *
  * http://alm.plos.org/api/v3/articles?api_key={key}&ids=10.1371/journal.pone.0083558
  * 
  * with async.map we make several concurrent GET requests to different URLS
  * (as specified by the DOIs); the response body is a JSON array, holding
  * the altmetrics data; extracts them and adds them to the article JSON blob.
  *
  ********************************************/

  this.getAltmetrics = function(articles, callback) {
    var dois = Object.keys(articles);
    var urls = dois.map(this.wrapDOI);

    async.map(urls, function(url, cb) {
      request(url, function(err, res, body) {
        var altjson = JSON.parse(body)[0];
        var key = _.last(url.split('='));

        var specifics = _.reduce(self.altmetrics, function(base, item) {
          base[item] = altjson[item];
          return base;
        }, {});

        _.extend(specifics, {
          url: altjson.url,
          pdf: self.wrapPDF(altjson.url),
        });

        _.extend(articles[key], specifics);
        cb(null, articles);
      });

      }, function(err, articles) {
        if (err) return callback(err);
        var res = {};
        var key = _.values(self.query).join('-');
        res[key] = _.first(articles);
        callback(null, JSON.stringify(res));
    });
  };

  /*
   * main function; wraps both GET Requests
   */

  this.scrape = function(callback) {
    return this.getArticles(this.query, function(err, articles) {
      self.getAltmetrics(articles, callback);
    });
  };


  /*
   * Some utility functions
   */

  this.prepare = function() {
    return 'http://api.plos.org/search?q={subject}:"{term}"&api_key={key}'
                .replace('{key}', self.apiKey)
                .replace('{term}', self.query.term || 'cats')
                .replace('{subject}', self.query.subject || 'abstract');
  };


  // first wrap; wraps the DOI from the parsed results
  this.wrapDOI = function(doi) {
    return 'http://alm.plos.org/api/v3/articles?api_key={key}&ids={doi}'
            .replace('{key}', self.apiKey)
            .replace('{doi}', doi.replace('/', '%2F')); // url encode the slash
  };


  // second wrap; wraps the URL to a representation of URL as pdf
  this.wrapPDF = function(url) {
    var start  = url.substring(0, url.indexOf('article') + 7);
    var middle = '/fetchObject.action?uri=';
    var end    = url.substring(url.indexOf('info'), url.length);
    return [start, middle, end, '&representation=PDF'].join('');
  };

};


module.exports = Scraper;