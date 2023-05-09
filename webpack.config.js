const path = require('path');

module.exports = {
    entry: {
        'index_dist': './CVG/index.js',
        'CVG_dist': './CVG/CVG.js',
    },
    output: {
        path: path.resolve(__dirname, 'CVG'),
        filename: '[name].js',
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