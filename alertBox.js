/*
* date: 2019-07-23
* desc:
*/
/**
 * [AlertBox 弹框]
 * @param {[type]} type  弹框类型 doubleBtn/onceCancel/onceConfirm/mini
 * @param {[type]} alertType  弹框固定fixed /''滚动样式类型
 * @param {[type]} alertCls  弹框class 可继承修改样式
 * @param {[type]} title 弹框标题
 * @param {[type]} msg 弹框内容
 * @param {[type]} cancelText 取消按钮文本
 * @param {[type]} confirmText 确认按钮文本
 * @param {[type]} cancel 取消按钮回调事件
 * @param {[type]} confirm 确认按钮回调事件
 * @param {[type]} callback 弹框回调事件
 * @return {[Function]}    [AlertBox({type:'doubleBtn',title:'温馨提示',...})]
 */

!(function (wap) {
    var _uuid = 0;

    //
    function AlertBox(opts) {
        if (!(this instanceof AlertBox)) {
            return new AlertBox(opts).init();
        }

        this.opts = opts || {};
        this.uuid = _uuid;
        this.type = this.opts.type || "doubleBtn";
        this.alertType = this.opts.alertType || "";
        this.alertCls = this.opts.alertCls || "";
        this.title = this.opts.title || "";
        this.msg = this.opts.msg || "";
        this.cancelText = this.opts.cancelText || "取消";
        this.confirmText = this.opts.confirmText || "确定";
        this.cancel = this.opts.cancel || "";
        this.confirm = this.opts.confirm || "";
        this.callback = this.opts.callback || "";
        this.delay = this.opts.delay || 2000;
    }

    AlertBox.prototype = {
        constructor: AlertBox,
        getEl: function (supEl, el) {
            return supEl.querySelector(el);
        },
        init: function () {
            var self = this;
            _uuid++;
            self.setStyle();
            self.addAlertBox();
            self.type === "mini" ? self.minEvent() : self.alertEvent();

            return self;
        },
        addAlertBox: function () {
            var self = this,
                pos = self.getPos();
            self.alertType === "fixed" ? self.getFixedMask() : self.getMask();
            self.alertType === "fixed" ? self.getEl(document, "#alertMask_" + self.uuid).insertAdjacentHTML('beforeend', self.getHtml()) : self.getEl(document, "body").insertAdjacentHTML('beforeend', self.getHtml());
            self.alertBox = self.getEl(document, "#alertBox_" + self.uuid);
            if (self.alertType === "fixed") {
                self.alertBox.style.cssText = "width:" + parseInt(pos.width - (2 * 25)) + "px;left:25px;top:50%;-webkit-transform:translate3d(0,-50%,0);";
            } else {
                self.alertBox.style.cssText = "width:" + parseInt(pos.width - (2 * 25)) + "px;left:25px;top:" + parseInt(pos.sTop + window.innerHeight / 2 - self.alertBox.offsetHeight / 2) + "px;";
            }

            self.callback && typeof self.callback == "function" && self.type != "mini" && self.callback();
        },
        setStyle: function () {
            var self = this,
                style = document.createElement("style"),
                cssStr = ".alert-box{position:absolute;left:0;top:0;border-radius:0.2rem;background:#FFF;-webkit-box-sizing:border-box;z-index:100;font-size:0.6rem;}" +
                    ".alert-msg{padding:0.4rem 0.6rem 0.6rem;text-align:center;line-height:1.8;word-break:break-all;}" +
                    ".alert-title{padding:0.6rem 0.6rem 0;text-align:center;}" +
                    ".alert-btn{display:-webkit-flex !important;display:-webkit-box;border-top:1px solid #DCDCDC;}" +
                    ".alert-btn a{display:block;-webkit-flex:1 !important;-webkit-box-flex:1;height:1.68rem;line-height:1.68rem;text-align:center;}" +
                    ".alert-btn a.alert-confirm{border-left:1px solid #DCDCDC;color:#EDA200;}" +
                    ".alert-btn a.alert-confirm.single{border-left:none;}" +
                    ".alert-mini-box{border-radius:0.2rem;background:rgba(0,0,0,.7);color:#fff;}";
            style.type = "text/css";
            style.innerText = cssStr;
            self.getEl(document, "head").appendChild(style);
        },
        getPos: function () {
            var wn = document.documentElement.offsetWidth || document.body.offsetWidth,
                h = document.documentElement.offsetHeight || document.body.offsetHeight,
                s = document.documentElement.scrollTop || document.body.scrollTop;
            if (window.innerHeight > h) {
                h = window.innerHeight;
            }
            return {
                width: wn,
                height: h,
                sTop: s
            };
        },
        getHtml: function () {
            var self = this,
                html = '';
            if (self.type !== "mini") {
                html += '<div class=\"alert-box ' + self.alertCls + '\" id="alertBox_' + self.uuid + '">' +
                    '<div class="alert-title">' + self.title + '</div>' +
                    '<div class="alert-msg">' + self.msg + '</div>' +
                    '<div class="alert-btn">';
                switch (self.type) {
                    case "doubleBtn" :
                        html += '<a href="javascript:;" class="alert-cancel mr10">' + self.cancelText + '</a>' +
                            '<a href="javascript:;" class="alert-confirm">' + self.confirmText + '</a>';
                        break;
                    case "onceCancel" :
                        html += '<a href="javascript:;" class="alert-cancel">' + self.cancelText + '</a>';
                        break;
                    case "onceConfirm" :
                        html += '<a href="javascript:;" class="alert-confirm single">' + self.confirmText + '</a>';
                        break;
                }
                html += '</div></div>';
            } else {
                html += '<div class=\"alert-box alert-mini-box ' + self.alertCls + '\"  id="alertBox_' + self.uuid + '"><div class="alert-msg">' + self.msg + '</div></div>';
            }
            return html;
        },
        getMask: function () {
            var self = this,
                pos = self.getPos(),
                mask = document.createElement("div");
            mask.id = "alertMask_" + self.uuid;
            self.getEl(document, "body").appendChild(mask);
            mask.style.cssText = "position:absolute;left:0;top:0;width:" + pos.width + "px;height:" + pos.height + "px;background:rgba(0,0,0,0.3);z-index:99";
            self.type == "mini" && (mask.style.backgroundColor = "rgba(255, 255, 255, 0)");
        },
        getFixedMask: function () {
            var self = this,
                mask = document.createElement("div");
            mask.id = "alertMask_" + self.uuid;
            self.getEl(document, "body").appendChild(mask);
            mask.style.cssText = "position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,.3);z-index:99;";
        },
        minEvent: function () {
            var self = this;
            setTimeout(function () {
                if (navigator.userAgent.match(/iPhone/i) && typeof Zepto != "undefined") {
                    $(self.alertBox).fadeOut(500, function () {
                        self.getEl(document, "body").removeChild(self.alertBox);
                        self.callback && typeof self.callback == "function" && self.callback();
                    });
                } else {
                    self.remove(self.alertBox);
                    self.callback && typeof self.callback == "function" && self.callback();
                }
                self.remove(self.getEl(document, "#alertMask_" + self.uuid));

            }, self.delay);
        },
        alertEvent: function () {
            var self = this;
            if (self.alertBox) {
                var cancelBtn = self.getEl(self.alertBox, ".alert-cancel"),
                    confirmBtn = self.getEl(self.alertBox, ".alert-confirm");
                cancelBtn && self.reset(cancelBtn, self.cancel);
                confirmBtn && self.reset(confirmBtn, self.confirm);
            }
        },
        reset: function (el, type) {
            var self = this;
            el.onclick = function () {
                var result = type && typeof type == "function" && type(this);
                // 不隐藏
                if (result === false) return;

                self.alertType !== "fixed" && self.remove(self.alertBox);
                self.remove(self.getEl(document, "#alertMask_" + self.uuid));
            };
        },
        remove: function (el) {
            try {
                this.getEl(document, "body").removeChild(el);
            } catch (e) {

            }

        },
        destroy: function () {
            //this.remove(this.alertBox);
            this.alertBox && this.alertBox.parentNode.removeChild(this.alertBox);
            this.remove(this.getEl(document, "#alertMask_" + this.uuid));
        }
    };

    //
    wap.AlertBox = function (opts) {
        return AlertBox(opts);
    };
})(window._wap = window._wap || {});
