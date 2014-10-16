var actionURL = '/TM/ashx/TMStudentsHandler.ashx';
var actionURLClass = '/TM/ashx/TMClassInfoHandler.ashx';
var actionURLS = '/TM/ashx/TMStudentsHandler.ashx';
var wherestr = "";
$(function () {
     
    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });
    $('#ToExcel').click(function () {
        $('body').data('where', wherestr);
        var ee = new ExportExcel('list', "V_TM_StudentInfoDetail");
        ee.go();
    });
    $('#a_search').click(function () {
        search.go('list');
    });
    $.getJSON(actionURLClass + "?" + createParam("proffession"), function (d) {
        d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");
        d = '[{id:0,text:"== 请选择专业 =="},' + d.substr(1);
        $('#txt_Profession').combotree({
            width: '230',
            editable: false,
            data: eval(d),
            value:0,
            onChange: function (newValue, oldValue) {

                $.getJSON(actionURLS + '?' + createParam('classes', newValue), function (dd) {
                    if (dd.length <= 0) {
                        alert("本专业暂无班级!");

                    }
                    dd = JSON.stringify(dd);

                    $('#txt_ClassID').combobox({
                        valueField: 'KeyId',
                        textField: 'ClassName',
                        data: eval(dd),
                        editable: false,
                        requried: true,
                        onChange: function (nV, oV) {
                            var ruleArr = [];
                            ruleArr.push({ "field": "ClassID", "op": "eq", "data": nV });
                         
                            if (ruleArr.length > 0) {
                                var filterObj = { groupOp: 'AND', rules: ruleArr };
                                wherestr = JSON.stringify(filterObj);
                                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
                            }
                                                    }


                    });
                })
            }
        });

    });
    $("#btn_NumberSearch").click(function(){
        var num = $("#txt_StudentNumber").val();
        if (num == "") {
            alert("请输入学号！");
            return;
        }
        else
        {
            var ruleArr = [];
            ruleArr.push({ "field": "StudentNumber", "op": "cn", "data": num });
            if (ruleArr.length > 0) {
                var filterObj = { groupOp: 'AND', rules: ruleArr };
                wherestr = JSON.stringify(filterObj);
                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
            };
        }
    
    });
    $("#btn_NameSearch").click(function () {
        var num = $("#txt_Name").val();
        if (num == "") {
            alert("请输入姓名！");
            return;
        }
        else {

            var ruleArr = [];
            ruleArr.push({ "field": "Name", "op": "cn", "data": num });
            if (ruleArr.length > 0) {
                var filterObj = { groupOp: 'AND', rules: ruleArr };
                wherestr = JSON.stringify(filterObj);
                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
            }
        }

    });
});

function createParam(action, keyid) {
    var o = {};
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
           url: actionURL + "?action=GetStudentInfo&id=search&cid=0",
            
            toolbar: '#toolbar',
            title: "班级学生列表",
            iconCls: 'icon icon-list',
            width: winSize.width,
            height: winSize.height,
            nowrap: false, //折行
            rownumbers: true, //行号
            striped: true, //隔行变色
            idField: 'KeyId',//主键
            singleSelect: true, //单选
            frozenColumns: [[]],
            columns: [[
				//{ title: '学生ID', field: 'KeyId', width: 120 },
               //  { title: '所在学院', field: 'Expr2', width: 120 },
		    { title: '所学专业', field: 'Title', width: 140 },
		    { title: '班级名称', field: 'ClassName', width: 140 },
		    { title: '学号', field: 'StudentNumber', width: 120 },
		    { title: '姓名', field: 'Name', width: 60 },
		    { title: '性别', field: 'Gender', width: 40 },
		    { title: '民族', field: 'NationName', width: 60 },
		    { title: '政治面貌', field: 'PolityName', width: 60 },
		    { title: '身份证号', field: 'Card', width: 160 },
		    { title: '通讯地址', field: 'Address', width: 160 },
		    { title: '家庭电话', field: 'HomePhone', width: 120 },
		    { title: '父亲', field: 'Father', width: 60 },
		    { title: '母亲', field: 'Mother', width: 60 },
		    { title: '入学分数', field: 'AdmissionScore', width: 60 },
		    { title: '住宿地点', field: 'Hostel', width: 120 },
		    { title: '干部信息', field: 'LeaderInfo', width: 60 },
		    { title: '身体状况', field: 'PhysicalStatus', width: 80 },
		    { title: '生源地', field: 'ComeFrom', width: 120 },
		    { title: '联系电话', field: 'Phone', width: 120 },
		    { title: 'QQ', field: 'QQ', width: 100 },
		    { title: 'Email', field: 'Email', width: 100 },
		  
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [40, 60, 100]
        });
    },
    getSelectedRow: function () {
        return $('#list').datagrid('getSelected');
    },
    reload: function () {
        $('#list').datagrid('clearSelections').datagrid('reload', { filter: '' });
    }
};