const path = require('path');

module.exports = {
    entry: {
        'dist/main': path.resolve(__dirname, './src/index.js'),
        'docs/dist/demo': path.resolve(__dirname, './docs/demo.js')
    },
    output: {
        path: path.resolve(__dirname, './'),
        filename: '[name].js',
        library: 'Derekstrap',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.s?css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: {
                                mode: 'icss' // css-loader 5.x used "compileType, 6.x uses "mode
                            }
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    stats: {
        loggingDebug: ["sass-loader"],
    },
};