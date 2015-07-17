var Trello = require('node-trello');

// var t = new Trello("<your key>", "<token>");

module.exports = function() {
	Trello.authorize({
       	type: "popup",
        success: this.onAuthorize
    });
}