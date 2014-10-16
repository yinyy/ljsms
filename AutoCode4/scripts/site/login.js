/* File Created: 二月 23, 2012 */
$(function () {
    ShowLoginWindow();
});

var h = '<table id="loginForm" cellpadding=5 style="width:100%">';
h += '<tr><td style="width:140px;">服务器类型：</td><td><select disabled=true style="width:200px;"><option>数据库引擎</option></select></td></tr>';
h += '<tr><td>服务器名称：</td><td><input name="servername" value="(local)" type="text" id="txtservername" /></td></tr>';
h += '<tr><td>身份验证：</td><td><select id="authtype" name="authtype" ><option value="sql">SQL Server 身份验证</option><option value="windows">Windows 身份验证</option></select></td></tr>';
h += '<tr><td>用户名：</td><td><input type="text" name="username" id="txtusername" value="sa" /></td></tr>';
h += '<tr><td>密码：</td><td><input type="password" value="123456" name="password" id="txtpassword" /></td></tr>';
h += '<tr><td>&nbsp;</td><td></td></tr></table>';

function ShowLoginWindow() {
    $('#w').hWindow({
        html: '<div class="login_top">' + h + '</div>',
        width: 494,
        height: 386,
        title: '连接到 <B>SQL Server</B> 服务器',
        submit: function () {
            var query = $('#loginForm select,input').serialize() + "&action=login";
            if ($('#authtype').val() == "windows") {
                query = 'servername=' + $('#txtservername').val()
                + '&authtype=windows&username=' + $('#w').data('authname')
                + '&password=&action=login';
            }
            $.ajaxjson('ashx/loginhandler.ashx', query, function (msg) {
                if (msg.Success)
                    location.href = "default.aspx";
                else
                    alert(msg.message);
            });
        }
    });
}