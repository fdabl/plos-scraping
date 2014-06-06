# PLoS Scraping

Given some search criteria (see below), scrapes the PLoS ONE API.

```
npm install

# for tests
npm test

# for tests with code coverage
sudo npm -g install istanbul
istanbul cover _mocha
```

The PLoS One api provides the following search criteria:
* default
* author
* title
* subject
* abstract

You need to have your own api key though. Sign Up [here](http://alm.plos.org/docs/Home) and get your key.
Enter it in the api.json file and you're ready to go!

## How To

Scraper in lib/index.js is the main object. Use it like this:

```
var key = 'yourapikey';
var query = { 'type': 'abstract', 'term': 'cats' };
var metadata = ['author', 'title', 'abstract'];
var altmetrics = ['views', 'citations']; // you get url and pdf for free

var PLoS = new Scraper(key, query, metadata, altmetrics);

PLoS.scrape(function(err, data) {
  if (err) {
    console.log('Something horrible happened. Evacuate the room.');
    throw err;
	}

  /* data is a JSON array of articles with the query as key; e.g.:
   * { 'abstract-cat': { 'some-weird-doi': {
   *                       'id': 'some-weird-doi',
   *                       'title': 'bla',
   *                       'abstract': 'bla', 
   *                       'views': '9000',
   *                       'citations': '0'
   *                     }
   *               }
   * }
   */

	console.log(data);
});
```
