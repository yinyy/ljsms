﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TMTeacherCourseTable.aspx.cs" Inherits="DB.BPM.Admin.TM.TMTeacherCourseTable" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
      <!-- 工具栏按钮 -->
    <div id="toolbar"><a href="#" id="ToExcel" class="easyui-linkbutton" plain="true"  icon="icon-page_excel">导出EXCEL>>></a></div>

    <!-- datagrid 列表 -->
    <table id="list" ></table>  

    <!-- 引入多功能查询js -->
    <script src="../../scripts/Business/Search.js"></script>
    <script src="../scripts/Business/Export.js"></script>

    <!-- 引入js文件 -->
      <script src="js/TMTeacherCourseTable.js"></script>
</asp:Content>
