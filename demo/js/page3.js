define(function (require, exports, module) {
    "use strict";

    require('../../lib/jquery.min.js');
    var PageBase = require('../../lib/basePage.js');

    var Page3 = PageBase.extend(new function () {
        var that;

        /**
         * 初始化时被调用
         * @param $el
         * @param tpl
         * @param data
         * @param indexRef
         */
        this.onInit = function ($el, tpl, data, indexRef) {
            this._super($el, tpl, data, indexRef);
            that = this;
            that.initTemplate(tpl, {});
            if (data) {
                alert('打开参数：' + JSON.stringify(data));
            }
        };

        /**
         * 返回时被调用
         * @param data
         */
        this.onBack = function (data) {
            this._super(data);
            if (data) {
                alert('返回参数：' + JSON.stringify(data));
            }
        };

        /**
         * 页面销毁
         */
        this.destroy = function () {

        };

    }());

    module.exports = Page3;
});