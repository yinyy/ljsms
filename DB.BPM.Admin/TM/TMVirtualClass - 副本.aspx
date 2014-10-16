<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TMVirtualClass.aspx.cs" Inherits="TM.Web.TM.TMVirtualClass" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/></asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server"><div id="layout" class="easyui-layout"><div region="west" style="width:300px;border-right:0px;" border="true">
        <div class="easyui-panel" title="虚拟授课班级" border="false" iconCls="icon-book_red" >   
    <div  class="toolbar" style="background:#efefef;border-bottom:1px solid #ccc" >
         <a id="a_addV" href="#" plain="true" class="easyui-linkbutton" icon="icon-add1" title="添加">添加</a>
        <a id="a_editV" href="#" plain="true" class="easyui-linkbutton" icon="icon-edit1" title="修改">修改</a>
        <a id="a_deleteV" href="#" plain="true" class="easyui-linkbutton" icon="icon-delete16" title="删除">删除</a> 
    </div>
<div style="padding:5px;">
    <!-- datagrid 列表 -->
       <table id="list" ></table> 
    <ul id="vcs"></ul>

    </div>
            </div>
            <div id="noCategoryInfo" style="font-family:微软雅黑; font-size: 18px; color:#BCBCBC; padding: 40px 5px;display:none;">
                　　暂无虚拟授课班级，请点击添加。
            </div>
        </div>
        <div region="center" border="false" style="overflow: hidden;">
            <div id="toolbar"><%=base.BuildToolbar() %></div>
            <table id="studentlist"></table>
        </div>
    </div>
   

    <!-- 引入js文件 -->
      <script src="js/TMVirtualClass.js"></script>
     
</asp:Content>



