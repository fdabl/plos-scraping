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
