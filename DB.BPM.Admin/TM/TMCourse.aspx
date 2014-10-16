<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TMCourse.aspx.cs" Inherits="TM.WEB.TM.TMCourse" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div id="toolbar"><%= base.BuildToolbar()%><input type="text" id="txt_Proffession"  name="Proffession" style="width:180px" class="easyui-combotree" /> </div>

    <!-- datagrid 列表 -->
    <table id="list" ></table>  

    <!-- 引入多功能查询js -->
    <script src="../../scripts/Business/Search.js"></script>

    <!-- 引入js文件 -->
      <script src="js/TMCourse.js"></script>
</asp:Content>



