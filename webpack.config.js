const path = require('path');

module.exports = {
    entry: './CVG/CVG.js',
    output: {
        path: path.resolve(__dirname, 'CVG'),
        filename: 'bundled_CVG.js',
        library: 'cvg',
        libraryTarget: 'var',
    },
    module: {
        rules: [
            {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
            },
        ],
    },
    mode: 'production'
};