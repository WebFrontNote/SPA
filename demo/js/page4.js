define(function (require, exports, module) {
    "use strict";

    require('../../lib/jquery.min.js');
    var PageBase = require('../../lib/basePage.js');

    var Page4 = PageBase.extend(new function () {
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

            that.$container.on('click', 'li', function () {
                that.close({select: $(this).text()});
            });

            that.$container.on('click', '#backButton', function () {
                that.close();
            });
        };

        /**
         * 页面销毁
         */
        this.destroy = function () {
            that.$container.off('click');
        };

    }());

    module.exports = Page4;
});