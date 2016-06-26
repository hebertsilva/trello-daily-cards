var template = require('../utils/template');
var express = require('express');
var session = require('express-session');
var Trello = require("node-trello");
var nunjucks = require('nunjucks');
var moment = require('moment');

var app = express();
var sess;

function authorize(req) {
	sess = req.session;
	// console.log('autorize', sess);

	if ( sess.key && sess.token ) {
		return t = new Trello(sess.key, sess.token);
	}
}

module.exports = function( app ) {	
	app.get('/profile/me/', function(req, res){
		if ( authorize(req) ) {
			t.get('/1/members/me', function(err, customer) {
			  	if (err) throw err;
				res.render(template('profile.html'), { 'customer': customer });
			});
		} else {
			res.redirect('/');
		}
	});

	app.get('/cards/me/', function(req, res){
		if ( authorize( req ) ) {
			var boards;
			t.get('/1/members/me/boards/', function(err, data) {
				boards = data.map(function( item ){
					return {
						id: item.id,
						name: item.name,
						url: item.url,
						bg: item.prefs.backgroundColor
					}
				});
				
				t.get('/1/members/me/', { cards: 'open' }, function(err, data) {
				  	if (err) throw err;
				  	
				  	cards = data.cards.map(function( item ){
				  		return {
				  			idBoard: item.idBoard,
				  			id: item.id,
				  			date: item.dateLastActivity,
				  			dateCurrent: moment(item.dateLastActivity).format('DD/MM/YYYY'),
				  			name: item.name,
				  			idList: item.idList,
				  			url: item.url
				  		}
				  	}).filter(function( item ){
				  		var dc = moment(item.date);

				  		if ( moment().subtract(20, 'd').isBefore(dc) ) {
							return item;
						}
				  	});

				  	boards.forEach(function(board){
				  		board.cards = [];

				  		cards.forEach(function(card){
				  			if ( board.id == card.idBoard ) {
				  				delete card.idBoard;
				  				board.cards.push(card);
				  			}
				  		});
				  	});

				  	// console.log(boards);

				  	res.json(boards);
				});
			});
		}
	});

	// get = boards -> cards = boards

	app.get('/logout/', function(req, res){
		// res.clearCookie('key');
		// res.clearCookie('token');

		res.json({ url : '/' });
	});

	// get all cards
	// app.get('/cards/all/', function(req, res){
	// 	t.get("/1/members/me", { cards: 'open' }, function(err, data) {
	// 	  	if (err) throw err;
	// 	  	res.json(data);
	// 	});
	// });
}