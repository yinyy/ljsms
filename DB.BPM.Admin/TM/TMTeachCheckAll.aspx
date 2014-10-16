<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TMTeachCheckAll.aspx.cs" Inherits="DB.BPM.Admin.TM.TMTeachCheckAll" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div id="toolbar"><%= base.BuildToolbar()%>
        【部门】:<input type="text" id="txt_deps" name="deps" class="easyui-combotree"/>【教师】:<input type="text" id="txt_ClassLeaderID" name="ClassLeaderID" class="easyui-combobox"/>【授课】:<select id="txt_CourseSelect" class="easyui-combogrid" ></select>
        【今天】：<select id="txt_timeselect" name="TimeSelect"   class="easyui-combobox">
              <option value="1-2">1-2</option>    
    <option value="3-4">3-4</option>
    <option value="5-6">5-6</option> 
    <option value="7-8">7-8</option>
    <option value="9-10">9-10</option>

                 </select>
        【周次】：<select id="txt_dayselect" name="DaySelect"  class="easyui-combobox">
              <option value="1">第1周</option>
    <option value="2">第2周</option> 
    <option value="3">第3周</option>
    <option value="4">第4周</option> 
    <option value="5">第5周</option>
    <option value="6">第6周</option> 
    <option value="7">第7周</option>
    <option value="8">第8周</option>
    <option value="9">第9周</option>
    <option value="10">第10周</option> 
    <option value="11">第11周</option>
    <option value="12">第12周</option> 
    <option value="13">第13周</option>
    <option value="14">第14周</option> 
    <option value="15">第15周</option>
    <option value="16">第16周</option>
    <option value="17">第17周</option>    
    <option value="18">第18周</option>
    <option value="19">第19周</option> 
    <option value="20">第20周</option>
    <option value="21">第21周</option>
             </select>

    </div>

    <!-- datagrid 列表 -->
    <table id="list" ></table>  

    <!-- 引入多功能查询js -->
    <script src="../../scripts/Business/Search.js"></script>

    <!-- 引入js文件 -->
      <script src="js/TMTeachCheckAll.js"></script>
</asp:Content>
