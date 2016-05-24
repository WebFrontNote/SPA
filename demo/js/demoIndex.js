define(function (require, exports, module) {
    "use strict";
    require('../../lib/jquery.min.js');
    var IndexBase = require('../../lib/baseIndex.js');

    var Index = IndexBase.extend({
        router: {
            page0: '',
            page1: 'Page1',
            page2: 'Page2',
            page3: 'Page3',
            page4: 'Page4'
        },

        // 模块根路径
        moduleBase: '../js/',
        // 页面根路径
        pageBase: './',
        defaultModule: 'page1'
    });

    module.exports = new Index();

});