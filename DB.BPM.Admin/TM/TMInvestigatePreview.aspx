<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TMInvestigatePreview.aspx.cs" Inherits="DB.BPM.Admin.TM.TMInvestigatePreview" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>问卷预览窗口</title>
    <link href="../css/investigate.css" rel="stylesheet" />
    <style type="text/css">
        body, table, tr, td, div, span, ul, ol, li {
            padding: 0px;
            margin: 0px;
        }

        body {
            background-color: #efefef;
        }
    </style>
    <script src="../TM/js/dic.js?d=<%=DateTime.Now.Ticks %>"></script>
    <script src="../scripts/jquery-1.8.3.min.js"></script>
    <script src="../scripts/json2.js"></script>
    <script src="js/InvestigateOp.js?d=<%=DateTime.Now.Ticks %>"></script>
    <script src="js/TMInvestigatePreview.js?d=<%=DateTime.Now.Ticks %>"></script>   
</head>
<body>
    <div id="investigate_page">
        <div id="investigate_title">
            <p style="text-align:center;margin:40px auto;font-size: 36px; font-weight:bolder;"><%=ConfigurationManager.AppSettings["investigate_line1"] %></p>
            <p style="font-weight:bolder;"><%=ConfigurationManager.AppSettings["investigate_line2"] %></p>
            <p style="text-indent:32px;line-height:24px;"><%=ConfigurationManager.AppSettings["investigate_line3"] %></p>
        </div>
        <div id="investigate_range"></div>
    </div>
</body>
</html>
