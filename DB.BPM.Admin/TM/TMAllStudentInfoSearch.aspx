<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TMAllStudentInfoSearch.aspx.cs" Inherits="DB.BPM.Admin.TM.TMAllStudentInfoSearch" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <!-- 工具栏按钮 -->
    <div id="toolbar">专业查询：<input type="text" id="txt_Profession" name="Profession" class="easyui-combotree"   />||班级查询：<input type="text" id="txt_ClassID" name="ClassID"  class="easyui-combobox" />||学号：<input type="text" id="txt_StudentNumber" style="width:60px"  name="StudentNumber"  class="txt03"  /><a href="#" id="btn_NumberSearch" class="easyui-linkbutton" plain="true"  icon="icon-search">查找学号</a>||姓名：<input type="text" id="txt_Name" name="Name" style="width:60px"  class="txt03"  /><a href="#" id="btn_NameSearch" class="easyui-linkbutton" plain="true"  icon="icon-search">查找姓名</a><a href="#" id="ToExcel" class="easyui-linkbutton" plain="true"  icon="icon-page_excel">导出EXCEL>>></a></div>

    <!-- datagrid 列表 -->
    <table id="list" ></table>  

    <!-- 引入多功能查询js -->
    <script src="../../scripts/Business/Search.js"></script>
       <script src="../scripts/Business/Export.js"></script>
    <!-- 引入js文件 -->
      <script src="js/TMAllStudentInfoSearch.js"></script>
</asp:Content>
