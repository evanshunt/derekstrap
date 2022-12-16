const path = require('path');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
        demo: path.resolve(__dirname, './demo/demo.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
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
};