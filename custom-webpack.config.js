console.log('custom webpack config');
var nodeExternals = require('webpack-node-externals');

module.exports = {

    resolve: {
        extensions: ['.ts', '.js', '.json']
    },    
    target: 'node', 
    externals: [nodeExternals()], 

};