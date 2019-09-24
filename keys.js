if (process.env._ && process.env._.indexOf("heroku") !== -1) {
    module.exports = require('./keys_prod');
} else {
    module.exports = require('./keys_dev');
}