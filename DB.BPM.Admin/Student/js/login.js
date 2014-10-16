
var themes = [{ "id": "default", "text": "默认皮肤", "selected": true }, { "id": "Metro-Blue", "text": "流行灰" }]
var savecookdays = [{ "id": 1, "text": "不保存", "selected": true }, { "id": 7, "text": "保存7天" }, { "id": 30, "text": "保存30天" }, { "id": 365, "text": "永久保存" }]

$(function () {

    var h = 355;
  
    if (!showValidateCode) {
        h = 275;
        
    }

     
    $.hDialog({
        title:'用户登录',boxPadding:'2px',
        width: 400,closable:false,
        height: h, iconCls: 'icon-user',
        modal:false,draggable:false,
        href: '/common/html/loginForm.html',
        buttons:[{
            text: '登录',
            iconCls: 'icon-user',
            handler: login
        }],align:'center',
        onLoad: function () {
            if (!showValidateCode) {
                $('#vCodebox').hide();
                $('#vCodebox').next().hide();
                $('#txt_validatecode').val('1055818239');
                $('.login_top').height(120)
            }

            $('#txt_save').combobox({
                data: savecookdays, width: 120, valueField: 'id', textField: 'text', editable: false, panelHeight: 'auto'
            });
            $('#imgValidateCode').click(function () {
                $(this).attr('src', "validateCode.hxl?t=4&n=" + Math.random());
            });

            $('#txtUserName').val('1205063366');
            $('#txtPassword').val('370503199603150023');
        }
    });
    
    //响应键盘的回车事件
    $(this).keydown(function (event) {
        if (event.keyCode == 13) {
            event.returnValue = false;
            event.cancel = true;
            return login();
        }
    });

    
});



function login() {
    
    $('#loginForm').form('submit', {
        url: 'ashx/LoginHandler.ashx',//'ashx/loginhandler.ashx',
        onSubmit: function () {
            var isValid = $('#loginForm').form('validate');
            if(isValid) {
                $.hLoading.show({ msg: '正在登录中...' });
            }
            return isValid;
        },
        success: function (data) {
            $.hLoading.hide();
            var d = eval('(' + data + ')');
            if (d.success) {
                $.post('/ashx/LoginHandler.ashx', {
                    username: '学生',
                    password: '1928374655',
                    validateCode: top.$('#txt_validatecode').val()
                }, function (dd) {
                    if (dd.success) {
                        location.href = "/";
                    } else {
                        //更新验证码
                        $('#imgValidateCode').click();
                        alert(dd.message);
                    }
                }, 'json');
            } else {
                //更新验证码
                $('#imgValidateCode').click();
                alert(d.message);
            }
        }
    });
}

function aboutMe(){
    $.hDialog({
        title: '帮助',
        width: 400,
        height: 300,
        showBtns: false,
        content: '用户手册建设中.....'
    });
}

function getsize() {
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

    return { width: widowWidth, height: windowHeight };
}