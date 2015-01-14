<%@ Page Language="C#"  %>


<link href="../../css/investigate.css?d=1" rel="stylesheet" />
<div id="investigate_page">
    <div id="investigate_title">
        <p style="text-align:center;margin:40px auto;font-size: 36px; font-weight:bolder;"><%=ConfigurationManager.AppSettings["investigate_line1"] %></p>
        <p style="font-weight:bolder;"><%=ConfigurationManager.AppSettings["investigate_line2"] %></p>
        <p style="text-indent:32px;line-height:24px;"><%=ConfigurationManager.AppSettings["investigate_line3"] %></p>

    </div>
    <div id="investigate_range">

    </div>
</div>