module.exports = {
    publicPath: './',
    // baseUrl: process.env.NODE_ENV === 'production' ? '/online/' : '/',
    //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
    lintOnSave: true,
    // productionSourceMap：{ type:Bollean,default:true } 生产源映射
    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,
    devServer: {
        port: 8088, // 端口号
        host: 'localhost',
        https: false, // https:{type:Boolean}
        open: true, //配置自动启动浏览器
        hotOnly: false, // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        proxy:{
            '/api': {
                target: 'http://server.zh8848.com/Nusery.aspx/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },  // 配置多个代理

        // before: app => {}
    },
    // 第三方插件配置
    pluginOptions: {
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title= '校讯通';  // 修改title
                return args
            })
    }
};