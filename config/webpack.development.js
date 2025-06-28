// 使用html模板文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve, join } = require('path');
// 编译运行时控制台输出信息
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const notifier = require('node-notifier');
// 分析包体积
const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const port = 3003;

module.exports = {
    // 这段代码配置了 Webpack Dev Server，它是一个用于开发环境的本地服务器，提供热更新、代理等功能。
    devServer: {
        // 支持单页应用（SPA）的路由。
        historyApiFallback: true,
        // 指定静态文件的根目录（即 Webpack 输出目录）。服务器从 dist 目录提供静态资源（如 CSS、图片）。
        static: {
            directory: join(__dirname, '../dist'),
        },
        // 启用 Hot Module Replacement (HMR)，即热更新。
        hot: true,
        port,
        // proxy: [
        //     {
        //         context: ['/api'],
        //         target: 'http://localhost:3001',
        //         changeOrigin: true,
        //     },
        // ],
    },
    output: {
        publicPath: '/',
        //如果是通过loader 编译的 放到scripts文件夹里 filename
        filename: 'scripts/[name].bundle.js',
        //如果是通过'asset/resource' 编译的
        assetModuleFilename: 'images/[name].[ext]',
    },
    plugins: [
        new HtmlWebpackPlugin({
            // 指定生成的 HTML 文件名（相对于 output.path）。若 output.path = 'dist'，则最终生成 dist/index.html。
            filename: 'index.html',
            // 将指定的图标文件注入到 HTML 的 <head> 标签中。自动生成 <link rel="shortcut icon" href="favicon.ico">。
            favicon: "./public/favicon.ico",
            // 指定 HTML 模板文件的路径。__dirname：当前配置文件所在目录。resolve('../src/index-dev.html')：向上一级目录，再进入 src 目录，找到 index-dev.html。
            template: resolve(__dirname, '../src/index-dev.html'),
        }),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: ['You application is running here http://localhost:' + port],
                notes: ['💊 构建信息请及时关注窗口右上角'],
            },
            // new WebpackBuildNotifierPlugin({
            //   title: '💿 Solv Dvelopment Notification',
            //   logo,
            //   suppressSuccess: true,
            // }),
            onErrors: function (severity, errors) {
                if (severity !== 'error') {
                    return;
                }
                const error = errors[0];
                console.log(error);
                notifier.notify({
                    title: '👒 Webpack Build Error',
                    message: severity + ': ' + error.name,
                    subtitle: error.file || '',
                    icon: join(__dirname, 'icon.png'),
                });
            },
            clearConsole: true,
        }),
        new BundleAnalyzerPlugin(),
    ]
};