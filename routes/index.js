var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

var getContent = function(url, cb) {
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var html = body;
			var $ = cheerio.load(html);
			$('[src]').each(function(i, elem) {
				console.log(elem.attribs.src.indexOf('//'));
				if(elem.attribs.src.indexOf('//') === -1) {
					console.log('hello there');
					var newUrl = '/?page=' + url + elem.attribs.src;
					var newElem = $(elem).attr('src', newUrl);
					$(elem).replaceWith(newElem);
					html = $.html();
				}
				else {
					var newUrl = '/page=?' + elem.attribs.src;
					$(elem,html).replaceWith($(elem,html).attr('src', newUrl));
				}
			});
			// console.log($('[src]', html));
			var script = '<script type="text/javascript" src="/js/proxy.js"></script>'
			var newHtml = $('html').append(script).html();
			cb(newHtml);
		}
	});
};

/* GET home page. */

router.get('/', function(req, res) {
	var query = req.query;
	if(query.page) {
		getContent(query.page, function(body) {
			res.sendStatus = 200;
			res.send(body);
		});
	}
	else {
		res.render('index', { title: 'Express' });
	}
});

module.exports = router;
