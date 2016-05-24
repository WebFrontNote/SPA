/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function () {
    var initializing = false, fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /.*/;
    // The base Class implementation (does nothing)
    this.Class = function () {
    };

    // Create a new Class that inherits from this class
    this.Class.extend = function (prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] === "function" &&
            typeof _super[name] === "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;
        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

define(function (require, exports, module) {
    "use strict";

    var $ = window.Zepto || window.jQuery;

    /**
     * Index页基类
     * Index也为简化版Single-Page-Application页面管理模块，管理页面路由及数据初始化
     */
    var BaseIndex = Class.extend({
        // 子类必须覆盖defaultModule
        defaultModule: '',
        // 子类一般需要覆盖router（不要直接向父类router添加）
        router: {},
        // 模块脚本根路径
        moduleBase: './',
        // 页面模板根路径
        pageBase: './',
        // 已经加载的子模块对象
        subModules: {},
        // 页面栈是否前向移动
        //forward: false,
        historyLength: 0,
        hashHistory: [],

        /**
         * 判断导航是否后退
         */
        isBackward: function () {
            var hash = window.location.hash, length = window.history.length;
            if (this.hashHistory.length && this.historyLength === length) {
                if (this.hashHistory[this.hashHistory.length - 2] === hash) {
                    this.hashHistory.pop();
                    return true;
                } else {
                    this.hashHistory.push(hash);
                    return false;
                }
            } else {
                this.hashHistory.push(hash);
                this.historyLength = length;
                return false;
            }
        },

        /**
         * 保存并获取已经初始化的模块
         * @param Module 模块，需要为构造器函数
         * @param hash 模块hash
         * @returns {*}
         */
        getModule: function (hash, Module) {
            // 如果模块未初始化，且存在，则初始化模块
            if (!this.subModules[hash] && Module) {
                this.subModules[hash] = new Module();
            }
            return this.subModules[hash];
        },

        /**
         * 释放模块
         * @param hash
         */
        destroyModule: function (hash) {
            var module = this.getModule(hash);
            // 如果存在且模块有销毁方法则调用
            if (module && typeof module.destroy === 'function') {
                try {
                    module.destroy();
                } catch (e) {
                    console.error('Destroy module error: %s', module);
                }
            }

            //  销毁DOM
            $('#page_' + hash).remove();
            // 移除对象引用
            delete this.subModules[hash];
        },

        /**
         * 根据hash加载模块
         * @param hash
         */
        loadModule: function (hash) {
            // 禁止在模块加载时加载模块
            if (this.loadingModule) {
                return;
            }
            // 找不到则默认加载首页
            var moduleName = this.router[hash] === undefined ? this.defaultModule : this.router[hash];
            var $el = $('#page_' + hash);
            if ($el.length > 0) {
                // 已经存在，直接显示并调用show方法
                $('.page-container').hide();
                // 显示新的页面前滚动到页面顶端
                document.body.scrollTop = 0;
                $el.show();
                var module = this.getModule(hash);
                if (module) {
                    var data = this.closePageData || undefined;
                    // onShow只有后退时才触发
                    if (typeof module.onShow === 'function') {
                        module.onShow(data);
                    }
                }
                // 关闭完成后清空closePageData
                this.closePageData = undefined;
            } else {
                // 不存在则动态加载
                // 重新动态加载
                this.loadingModule = true;
                var modules = [this.pageBase + hash + '.html'];
                if (moduleName) {
                    modules.push(this.moduleBase + hash + '.js');
                }
                var that = this;
                seajs.use(modules, function (html, obj) {
                    that.loadingModule = false;
                    // 生成容器
                    var $el = $('<div class="page-container"></div>');
                    // 初始化管理平台配置的文案
                    $el.attr('id', 'page_' + hash);
                    $('#pageWrapper').append($el);
                    $('.page-container').hide();
                    document.body.scrollTop = 0;
                    //实例化模块对象参数
                    var module = that.getModule(hash, obj);
                    if (module) {
                        module.id = hash;
                        var data = that.openPageData[hash] || undefined;
                        that.openPageData = {};
                        if (typeof module.onInit === 'function') {
                            // 如果有onInit方法，由onInit生成界面
                            module.onInit($el, html, data, that);
                        } else {
                            // 没有onInit方法则由框架生成界面
                            $el.append(html);
                        }
                    }
                    $el.show();
                });
            }
        },

        /**
         * 替换history状态
         */
        replaceState: function (page) {
            if (history.replaceState) {
                history.replaceState({}, '', '#' + page);
            } else {
                var url = location.href;
                var newUrl = url.split('#')[0] + '#' + page;
                location.replace(newUrl);
            }
        },

        /**
         * 通过脚本方式打开一个页面并传递参数
         * @param page  路由表中配置的模块ID
         * @param data  传递给新模块的数据
         * @param silence   静默方式加载，使用静默方式加载将不产生页面栈，后退后直接退回前一页
         */
        openPage: function (page, data, silence) {
            if (data) {
                // 为了防止将参数传递给错误页面，所以根据页面记录参数，并且使用一次后参数清空
                this.openPageData[page] = data;
            }
            if (silence) {
                this.replaceState(page);
                this.loadModule(page);
            } else {
                location.hash = page;
            }
        },

        /**
         * 关闭页面
         * @param page 关闭的页面
         * @param data 返回给前页的数据
         */
        closePage: function (page, data) {
            if (data) {
                this.closePageData = data;
            }
            history.back();
        },

        /**
         * hash改变，进行页面跳转
         * @param e
         */
        onHashChange: function (e) {
            var hash = location.hash.replace('#', '');
            var isBack = this.isBackward();
            console.log('hash change: ' + (hash || this.defaultModule) + (isBack ? ' :backward' : ' :forward'));
            // 后退
            if (isBack) {
                // 找到跳转前页面，并销毁
                var oldUrls = e.oldURL.split('#');
                var oldHash = oldUrls[oldUrls.length - 1];
                this.destroyModule(oldHash);
            }

            this.loadModule(hash || this.defaultModule);
        },

        /**
         * 初始化函数，父类会调用
         */
        init: function () {
            // 初始化必要的数据
            this.openPageData = {};
            this.closePageData = undefined;
            this.loadingModule = false;

            console.log('load module: ' + this.defaultModule);
            this.loadModule(this.defaultModule);

            // 监听hashchange事件，在hashchange时进行页面切换
            var onHashChange = this.onHashChange.bind(this);
            setTimeout(function () {
                $(window).bind('hashchange', onHashChange);
            }, 0);
            // 记录当前历史记录长度，便于判断前进后退
            this.hashHistory = [window.location.hash];
            this.historyLength = window.history.length;

            // 初始化时重置页面hash
            this.replaceState('');
        }
    });

    module.exports = BaseIndex;
});