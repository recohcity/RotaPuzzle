const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        historyApiFallback: true,
        compress: true,
        port: 3001,
        hot: true
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname),
            'pages': path.resolve(__dirname, 'pages'),
            'demo': path.resolve(__dirname, 'pages/demo')
        }
    },
    devtool: 'inline-source-map'
};
