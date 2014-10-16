<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="Desktop.aspx.cs" Inherits="DB.BPM.Admin.TM.Desktop" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
     <!-- datagrid 列表 -->
    <table id="list" ></table>  
        <!-- 引入js文件 -->
      <script src="js/Desktop.js"></script>
</asp:Content>
