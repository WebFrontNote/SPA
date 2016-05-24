;(function (win) {
    "use strict";

    var resize = win.resize || (win.resize = {});

    var timer = null;
    var rem = 12;
    var doc = win.document;
    var docEl = doc.documentElement;

    /**
     * 刷新页面REM值
     */
    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        width = width > 768 ? 640 : width;
        rem = width / 6.4;
        docEl.style.fontSize = rem + 'px';
    }

    /**
     * 页面缩放或重载时刷新REM
     */
    win.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(timer);
            timer = setTimeout(refreshRem, 300);
        }
    }, false);

    refreshRem();

    /**
     * rem to px
     * @param d
     * @returns {number}
     */
    resize.rem2px = function (d) {
        var val = parseFloat(d) * rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    };

    /**
     * px to rem
     * @param d
     * @returns {number}
     */
    resize.px2rem = function (d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    };

})(window);