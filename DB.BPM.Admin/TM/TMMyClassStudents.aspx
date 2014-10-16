<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TMMyClassStudents.aspx.cs" Inherits="DB.BPM.Admin.TM.TMMyClassStudents" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <!-- 也可以在页面中直接加入按钮
    <div class="toolbar">
        <a id="a_add" href="#" plain="true" class="easyui-linkbutton" icon="icon-add1" title="添加">添加</a>
        <a id="a_edit" href="#" plain="true" class="easyui-linkbutton" icon="icon-edit1" title="修改">修改</a>
        <a id="a_delete" href="#" plain="true" class="easyui-linkbutton" icon="icon-delete16" title="删除">删除</a>
        <a id="a_search" href="#" plain="true" class="easyui-linkbutton" icon="icon-search" title="搜索">搜索</a>
        <a id="a_reload" href="#" plain="true" class="easyui-linkbutton" icon="icon-reload" title="刷新">刷新</a>
    </div>
    -->



<!-- 工具栏按钮 -->
    
     <div id="toolbar"><%= base.BuildToolbar()%><input type="text" id="txt_Profession" name="Profession" class="easyui-combotree"   />【班级】：<input type="text" id="txt_ClassID" name="ClassID"  class="easyui-combobox" />【学号】：<input type="text" id="txt_StudentNumber" style="width:80px" name="StudentNumber"  class="txt03"  /><a href="#" id="btn_NumberSearch" class="easyui-linkbutton" plain="true"  icon="icon-search">查找学号</a>【姓名】：<input type="text" id="txt_Name"  style="width:60px" name="Name"   class="txt03"  /><a href="#" id="btn_NameSearch" class="easyui-linkbutton" plain="true"  icon="icon-search">查找姓名</a>
  </div>
    <!-- datagrid 列表 -->
    <table id="list" ></table>  

    <!-- 引入多功能查询js -->
    <script src="../../scripts/Business/Search.js"></script>
     <script src="../scripts/Business/Export.js"></script>
    <!-- 引入js文件 -->
      <script src="js/TMMyClassStudents.js"></script>

</asp:Content>
