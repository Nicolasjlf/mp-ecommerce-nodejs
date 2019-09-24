if (process.env._ && process.env._.indexOf("heroku")) {
    module.exports = require('./keys_prod');
} else {
    module.exports = require('./keys_dev');
}