var path = require('path');

module.exports = function(fileName) {
	return path.join(__dirname, '../views/', fileName);
};