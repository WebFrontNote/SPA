define(function (require, exports, module) {
    "use strict";

    require('../../lib/jquery.min.js');
    var PageBase = require('../../lib/basePage.js');

    var Page2 = PageBase.extend(new function () {
        var that;

        /**
         * 初始化时被调用
         */
        this.onInit = function ($el, tpl, data, indexRef) {
            this._super($el, tpl, data, indexRef);
            that = this;
            that.initTemplate(tpl, {});

            that.$container.on('click', '#actionButton', function () {
                that.openPage('page3', {page: 'page2'});
            });
        };

        /**
         * 页面销毁
         */
        this.destroy = function () {
            that.$container.off('click');
        };

    }());

    module.exports = Page2;
});