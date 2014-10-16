<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TMChuFaSum.aspx.cs" Inherits="DB.BPM.Admin.TM.TMChuFaSum" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <!-- 工具栏按钮 -->
    <div id="toolbar"><%= base.BuildToolbar()%>&nbsp;&nbsp; 【日期范围】：<input type="text" id="dtOpstart"/> 至 <input type="text" id="dtOpend"/></div>

    <!-- datagrid 列表 -->
    <table id="list" ></table>  

    <!-- 引入多功能查询js -->
    <script src="../../scripts/Business/Search.js"></script>

    <!-- 引入js文件 -->
      <script src="js/TMChuFaSum.js"></script>
</asp:Content>
