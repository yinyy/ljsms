$.ajaxjson = function (url, dataMap, fnSuccess) {
    $.ajax({
        type: "POST",
        url: url,
        data: dataMap,
        dataType: "json",
        beforeSend: function () { top.$.showLoading() },
        complete: function () { top.$.hideLoading(); },
        success: fnSuccess
    });
}
$.ajaxtext = function (url, dataMap, fnSuccess) {
    $.ajax({
        type: "POST",
        url: url,
        data: dataMap,
        beforeSend: function () { $.showLoading() },
        complete: function () { $.hideLoading(); },
        success: fnSuccess
    });
}


function autoResize(options) {
    var defaults = {
        width: 6,
        height: 119
    }
    options = $.extend(defaults, options);

    // 第一次调用
    var wsize = getWidthAndHeigh();
    if ($.isFunction(options.callback)) {
        options.callback(wsize);
    }

   

    // 窗口大小改变的时候
    window.onresize = function () {
        var size = getWidthAndHeigh(true);
        //alert(size.height);
        $(options.dataGrid).jqGrid('setGridHeight', size.height).jqGrid('setGridWidth', wsize.width);
    };

    // 获取iframe大小
    function getWidthAndHeigh(resize) {
        var windowHeight = 0;
        var widowWidth = 0;
        if (typeof (window.innerHeight) == 'number') {
            windowHeight = window.innerHeight;
            widowWidth = window.innerWidth;
        }
        else {
            if (document.documentElement && document.documentElement.clientHeight) {
                windowHeight = document.documentElement.clientHeight;
                widowWidth = document.documentElement.clientWidth;
            }
            else {
                if (document.body && document.body.clientHeight) {
                    windowHeight = document.body.clientHeight;
                    widowWidth = document.body.clientWidth;
                }
            }
        }

        
        widowWidth -= options.width;
        windowHeight -= options.height;

        
        return { width: widowWidth, height: windowHeight };
    }
}


function _StringFormatInline() {
    var txt = this;
    for (var i = 0; i < arguments.length; i++) {
        var exp = new RegExp('\\{' + (i) + '\\}', 'gm');
        txt = txt.replace(exp, arguments[i]);
    }
    return txt;
}

function _StringFormatStatic() {
    for (var i = 1; i < arguments.length; i++) {
        var exp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        arguments[0] = arguments[0].replace(exp, arguments[i]);
    }
    return arguments[0];
}

if (!String.prototype.format) {
    String.prototype.format = _StringFormatInline;
}

if (!String.format) {
    String.format = _StringFormatStatic;
}

