<%@ Page Title="" Language="C#" MasterPageFile="~/Site1.Master" AutoEventWireup="true" CodeBehind="TMTCDetailByAll.aspx.cs" Inherits="DB.BPM.Admin.TM.TMTCDetailByAll" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
     <!-- 工具栏按钮 -->
    <div id="toolbar" >
         <div style="float: left;padding-top:2px;">
            <div style="float: left;width:100%;">
        【专业】：<input type="text" id="txt_Profession" name="Profession" class="easyui-combotree"   />【班级】：<input type="text" id="txt_ClassID" name="ClassID"  class="easyui-combobox" />【学号】：<input type="text" id="txt_StudentNumber" style="width:80px" name="StudentNumber"  class="txt03"  /><a href="#" id="btn_NumberSearch" class="easyui-linkbutton" plain="true"  icon="icon-search">查找学号</a>【姓名】：<input type="text" id="txt_Name"  style="width:60px" name="Name"   class="txt03"  /><a href="#" id="btn_NameSearch" class="easyui-linkbutton" plain="true"  icon="icon-search">查找姓名</a><a href="#" id="ToExcel" class="easyui-linkbutton" plain="true"  icon="icon-page_excel">导出EXCEL>>></a>
                 </div>
            <div style="float: left; margin-top:3px;">
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
【授课日期】：从<input type="text" id="dtOpstart"/> 至 <input type="text" id="dtOpend"/><a href="#" id="btn_A1" class="easyui-linkbutton" plain="true"  icon="icon-search">日期查找</a>
    </div>
 </div>
        </div>
    <!-- datagrid 列表 -->
   
    <table id="listall" ></table>  
  
    <!-- 引入多功能查询js -->
    <script src="../../scripts/Business/Search.js"></script>
    <script src="../scripts/Business/Export.js"></script>

    <!-- 引入js文件 -->
      <script src="js/TMTCDetailByAll.js"></script>
</asp:Content>
