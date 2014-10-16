var actionCommon = '/TM/ashx/TMCommon.ashx';
var actionURL = '/TM/ashx/TMTeachCheckHandler.ashx';
var actionURLClass = '/TM/ashx/TMClassInfoHandler.ashx';
var actionURLS = '/TM/ashx/TMStudentsHandler.ashx';
var wherestr = "";
var uid = 0; 
var term = null;
$(function () {
    $.getJSON(actionCommon + "?nm=GetUid", function (d) {
        uid = eval(d).uid;
    });

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_search').click(function () {
        search.go('list');
    });
    $('#ToExcel').click(function () {
        $('body').data('where', wherestr);
        var ee = new ExportExcel('list', "V_TM_TeachCheckSumByStudent");
        ee.go();
    });
    $('#A2').click(function () {

        $('#list').datagrid('load', { sort: "CheckKK desc" });
    });
    $.getJSON(actionURLClass + "?" + createParam("proffession"), function (d) {
        d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");
        d = '[{id:0,text:"== 请选择专业 =="},' + d.substr(1);
        $('#txt_Profession').combotree({
            width: '230',
            editable: false,
            data: eval(d),
            value: 0,
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
    $("#btn_NumberSearch").click(function () {
        var num = $("#txt_StudentNumber").val();
        if (num == "") {
            alert("请输入学号！");
            return;
        }
        else {

            var ruleArr = [];
            ruleArr.push({ "field": "StudentNumber", "op": "cn", "data": num });
           
            if (ruleArr.length > 0) {
                var filterObj = { groupOp: 'AND', rules: ruleArr };
                wherestr = JSON.stringify(filterObj);
                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
            }
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
            url: actionURL + "?action=GetStudentSum",

            toolbar: '#toolbar',
            title: "二级学院学生缺勤情况汇总表（本学期）",
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
               { title: '班级名称', field: 'ClassName', width: 140 },
		    { title: '学号', field: 'StudentNumber', width: 100 },
		    { title: '姓名', field: 'Name', width: 60 },
		    { title: '性别', field: 'Gender', width: 40 },
            {
                title: '迟到', field: 'CheckCD', width: 40,
                formatter: function (val) {
                    if (val == 0) {
                        return "";
                    }
                    else {
                        return val;
                    }
                }
            },
            {
                title: '早退', field: 'CheckZT', width: 40,
                formatter: function (val) {
                    if (val == 0) {
                        return "";
                    }
                    else {
                        return val;
                    }
                }
            },
		    {
		        title: '旷课', field: 'CheckKK', width: 40,
		        formatter: function (val) {
		            if (val == 0) {
		                return "";
		            }
		            else {
		                return val;
		            }
		        }
		    },
            {
                title: '请假', field: 'qjcs', width: 40,
                formatter: function (val) {
                    if (val == '0') {
                        return "";
                    }
                    else {
                        return val;
                    }
                }
            },
            {
                title: '消极表现', field: 'bxcs', width: 60,
                formatter: function (val) {
                    if (val == '0') {
                        return "";
                    }
                    else {
                        return val;
                    } 
                }
            },
            { title: '预警处理建议', field: 'WarningProcess', width: 120 },
            { title: '本人电话', field: 'Phone', width: 100 },
             { title: '所在宿舍', field: 'Hostel', width: 80 },
             { title: '父亲', field: 'Father', width: 60 },
             { title: '母亲', field: 'Mother', width: 60 },
           { title: '家庭电话', field: 'HomePhone', width: 120 },
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [20, 40, 100],
            rowStyler: function (index, row) {               
                return row.WarningStyle;
                }
        });
    },
    getSelectedRow: function () {
        return $('#list').datagrid('getSelected');
    },
    reload: function () {
        $('#list').datagrid('clearSelections').datagrid('reload', { filter: '' });
    }
};