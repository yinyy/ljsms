<%@ Page Language="C#" AutoEventWireup="true" ValidateRequest="false" CodeBehind="default.aspx.cs" Inherits="AutoCode4._default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>疯狂秀才权限框架专用代码生成器</title>
    <link href="scripts/easyui/themes/gray/easyui.css" rel="stylesheet" type="text/css" />
    <link href="css/sexybuttons.css" rel="stylesheet" type="text/css" />
    <link href="css/common.css" rel="stylesheet" type="text/css" />
    <link href="css/icon.css" rel="stylesheet" type="text/css" />
    <link href="/Scripts/codemirror/lib/codemirror.css" rel="stylesheet" type="text/css" />
    <link href="css/propress_bar.css" rel="stylesheet" type="text/css" />
    <script src="scripts/jquery-1.7.1.min.js" type="text/javascript"></script>
    <script src="scripts/jquery.hotkeys.js" type="text/javascript"></script>
    <script src="scripts/jQuery.Ajax.js" type="text/javascript"></script>
    <script src="scripts/showloading/jquery.showLoading.js" type="text/javascript"></script>
    <link href="scripts/showloading/showLoading.css" rel="stylesheet" type="text/css" />
    <script src="scripts/easyui/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="scripts/easyui/easyui-window-extend.1.2.js" type="text/javascript"></script>
    <script type="text/javascript">
        var sql_server = '<%=base.ServerName %>';
        var sql_username = '<%= base.UserName %>';

        $(function () {
            $('#curname').text(sql_server + "/" + sql_username);
        })
    </script>
    <style type="text/css">.CodeMirror {border: 1px solid black;}</style>
</head>

<body class="easyui-layout" style="overflow-y: hidden; "  fit="true"   scroll="no">
<noscript>
<div style=" position:absolute; z-index:100000; height:2046px;top:0px;left:0px; width:100%; background:white; text-align:center;">
	<img src="images/noscript.gif" alt='抱歉，请开启脚本支持！' />
</div></noscript>

	<div region="north" split="true" border="false" style="overflow: hidden; height: 35px;
		background: url(images/layout-browser-hd-bg.gif) #7f99be repeat-x center 50%;
		line-height: 30px;color: #fff; font-family: 微软雅黑,Verdana,宋体 ">
		<span style="float:right; padding-right:20px;" class="head">Server： <b id="curname"></b> <a href="#" id="loginOut">安全退出</a></span>
		<span style="padding-left:10px; font-size: 16px;font-weight:bold;">疯狂秀才专用代码生成器 </span>
	</div>
	<div region="south" split="true" style="height: 40px; font-weight:bold;  line-height:30px; text-align:center; font-family:Verdana; background: #EFEFEF; ">
		<div class="footer">By 疯狂秀才 QQ:1055818239</div>
	</div>
	<div region="west" split="true" title="数据库目录" style="width:260px;" id="west">
		<ul id="dbtree"></ul>
	</div>
    <div region="east" split="true" title="代码生成参数" style="width:320px;" id="Div1">
		<div style="background:#FFFFE1;padding:5px;padding-bottom:8px;font-size:14px;border-top:1px solid #808080;border-left:1px solid #808080; border-right:1px solid #fff; border-bottom:1px solid #fff; height:20px; line-height:20px; text-align:center;">
            <button id="btnBuildCode" class="sexybutton sexyorange"><span><span><span class="build">代码生成</span></span></span></button>
            <button id="btnTemplate" class="sexybutton sexyyellow"><span><span><span class="build">模板管理</span></span></span></button>
        </div>
        <table class="codeoptions" border="0" cellspacing="1" cellpadding="2" width="100%" >
			<tr>
				<td style="width:100px;">代码模板</td><td><input id="ddlTemplate" type=text /></td>
			</tr>
            
            <tr>
				<td style="width:100px;">表描述</td><td><input id="txtDescription" type=text /></td>
			</tr>
            
            <tr>
				<td style="width:100px;">Web命名空间</td><td><input id="txtWebNamespace" value="Xiucai.BPM.Admin" type=text /></td>
			</tr>

            <tr>
				<td style="width:100px;">c#命名空间</td><td><input id="txtnamespace" value="Xiucai" type=text /></td>
			</tr>
            <tr>
				<td style="width:100px;">文件夹名称：</td><td><input id="txtfloder" type=text /></td>
			</tr>
            
            <tr>
				<td style="width:100px;">html文件名</td><td><input id="txtHtmlName" type=text /><td>
			</tr>
            <tr>
				<td style="width:100px;">js文件名</td><td><input  id="txtJsName" type=text /><td>
			</tr>
             <tr>
				<td style="width:100px;">Aspx 文件名</td><td><input id="txtAspxName" type=text /></td>
			</tr>
             <tr>
				<td style="width:100px;">Ashx 文件名</td><td><input id="txtashxpath" type=text /></td>
			</tr>

            

            <tr>
				<td style="width:100px;">Model类名称</td><td><input id="txtmodelname" type=text /></td>
			</tr>
             <tr>
				<td style="width:100px;">Model空间后缀</td><td><input id="txtmodelsuffix" value="Model" type=text /></td>
			</tr>
            <tr>
				<td style="width:100px;">Dal类名称</td><td><input id="txtdalname"  type=text /></td>
			</tr>
            <tr>
				<td style="width:100px;">Dal空间后缀</td><td><input id="txtdalsuffix" value="Dal" type=text /></td>
			</tr>
            
            <tr>
				<td style="width:100px;">Bll类名称</td><td><input id="txtBllname"  type=text /></td>
			</tr>
            <tr>
				<td style="width:100px;">Bll空间后缀</td><td><input id="txtbllsuffix" value="Bll" type=text /></td>
			</tr>
           
            <tr>
				<td style="width:100px;">中文字段</td><td><input style="width:160px"  id="txtcnfield" type=text /><input id="btnsetcnfield" onclick="setzhcnfield()" type=button value="..." /><td>
			</tr>
           
		</table>
	</div>
	<div id="mainPanle" region="center" style="background: #eee; overflow-y:hidden">
		<div id="tabs" class="easyui-tabs"  fit="true" border="false" >
			<div title="资源管理器" selected ='true' style="overflow:hidden;" id="home">
				
			

			</div>
		</div>
	</div>

	<div id="mm" class="easyui-menu" style="width:150px;">
		<div id="mm-refresh">刷新</div>
		<div class="menu-sep"></div>
		<div id="mm-tabclose">关闭</div>
		<div id="mm-tabcloseall">全部关闭</div>
		<div id="mm-tabcloseother">除此之外全部关闭</div>
		<div class="menu-sep"></div>
		<div id="mm-tabcloseright">当前页右侧全部关闭</div>
		<div id="mm-tabcloseleft">当前页左侧全部关闭</div>
		<div class="menu-sep"></div>
		<div id="mm-exit">退出</div>
	</div>
    <div id="w"></div>
    <div id="d"></div>
    <div id="t"></div>
    <div id="tt"></div>

        <script src="/Scripts/codemirror/lib/codemirror.js" type="text/javascript"></script>
    <script src="/Scripts/codemirror/mode/xml/xml.js" type="text/javascript"></script>
    <script src="/Scripts/codemirror/mode/javascript/javascript.js" type="text/javascript"></script>
    <script src="/Scripts/codemirror/mode/css/css.js" type="text/javascript"></script>
    <script src="/Scripts/codemirror/mode/htmlmixed/htmlmixed.js" type="text/javascript"></script>
    <script src="/Scripts/codemirror/mode/velocity/velocity.js" type="text/javascript"></script>

    <script src="scripts/TextAreaautoresize/autoresize.min.js" type="text/javascript"></script>
    <script src="scripts/site/db.js?n=2" type="text/javascript"></script>
</body>
</html>
