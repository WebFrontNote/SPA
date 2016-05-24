define(function (require, exports, module) {
    "use strict";

    require('../../lib/jquery.min.js');
    var PageBase = require('../../lib/basePage.js');

    var Page1 = PageBase.extend(new function () {
        var that;

        /**
         * 初始化时被调用
         */
        this.onInit = function ($el, tpl, data, indexRef) {
            this._super($el, tpl, data, indexRef);
            that = this;
            that.initTemplate(tpl, {
                tips: '下面内容由template生成：',
                list: ['1.....', '2.<<<<<', '3.#####']
            });

        };

        /**
         * 页面销毁
         */
        this.destroy = function () {

        };

    }());

    module.exports = Page1;
});