<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true"  CodeBehind="InvestigateCourse.aspx.cs" Inherits="DB.BPM.Admin.Student.InvestigateCourse"%>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <!-- datagrid 列表 -->
    <table id="list" ></table>  

    <!-- 引入js文件 -->
    <script src="../TM/js/dic.js?d=<%=DateTime.Now.Ticks %>"></script>
    <script src="../TM/js/InvestigateOp.js?d=<%=DateTime.Now.Ticks %>"></script>
      <script src="js/investigatecourse.js?d=<%=DateTime.Now.Ticks %>"></script>
</asp:Content>