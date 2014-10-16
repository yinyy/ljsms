<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="InvestigateTeacher.aspx.cs" Inherits="DB.BPM.Admin.Student.InvestigateTeacher"%>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <!-- datagrid 列表 -->
    <table id="list" ></table>  

    <!-- 引入js文件 -->
    <script src="../TM/js/dic.js?d=<%=DateTime.Now.Ticks %>"></script>
    <script src="../TM/js/InvestigateOp.js?d=<%=DateTime.Now.Ticks %>"></script>
    <script src="js/investigateteacher.js?d=<%=DateTime.Now.Ticks %>"></script>
    
</asp:Content>



