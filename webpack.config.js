const path = require('path');

module.exports = {
    entry: {
        'index': './CVG/index.js',
        'CVG': './CVG/CVG.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: {
            name: 'cvg',
            type: 'umd',
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    mode: 'production',
    target: 'web',
};