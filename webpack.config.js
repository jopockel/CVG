const path = require('path');
const { library } = require('webpack');

module.exports = {
    entry: './CVG/CVG.js',
    output: {
        path: path.resolve(__dirname, 'CVG'),
        filename: 'bundled_CVG.js',
        library: 'cvg',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    mode: 'production'
};