const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../build/webpack.config');

const port = 8080;
const host = 'localhost';


const runDevServer = function() {
    const compiler = Webpack(webpackConfig);

    const devServerConfig = Object.assign({}, webpackConfig.devServer, {
        open: true,
        host: '127.0.0.1',
        port: 8080,
        hot: true,
        proxy: {
            '/': {
                target: 'http://127.0.0.1:8081/',
                secure: false,
                changeOrigin: true,
            }
        }
    })
    const devServer = new WebpackDevServer(compiler, devServerConfig);
    
    
    devServer.listen(port, host, () => {
        console.log('页面启动');
    })
    
}


exports.runDevServer = runDevServer;

