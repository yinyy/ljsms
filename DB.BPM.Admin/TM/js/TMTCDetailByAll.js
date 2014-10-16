var actionCommon = '/TM/ashx/TMCommon.ashx';
var actionURL = '/TM/ashx/TMTeachCheckHandler.ashx';
var actionURLClass = '/TM/ashx/TMClassInfoHandler.ashx';
var actionURLS = '/TM/ashx/TMStudentsHandler.ashx';
var wherestr = "";
var uid = 0; 
$(function () {
    $.getJSON(actionCommon + "?nm=GetUid", function (d) {
        uid = eval(d).uid;
    });
    autoResize({ dataGrid: '#listall', gridType: 'datagrid', callback: gridall.bind, height: 0 });
    $('#dtOpstart,#dtOpend').datebox({ width: 100 });
    $('#a_search').click(function () {
        search.go('listall');
    });
    $('#ToExcel').click(function () {
        $('body').data('where', wherestr);
        var ee = new ExportExcel('listall', "V_TM_TeachCheckStudentDetailInfo");
        ee.go();
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
                                $('#listall').datagrid('load', { filter: JSON.stringify(filterObj) });
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
                $('#listall').datagrid('load', { filter: JSON.stringify(filterObj) });
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
                $('#listall').datagrid('load', { filter: JSON.stringify(filterObj) });
            }
        }

    });
    $("#txt_timeselect").combobox({
        onChange: function (nv, ov) {
            var curr_time = new Date();
            var strDate = curr_time.getFullYear() + "-";
            strDate += curr_time.getMonth() + 1 + "-";
            strDate += curr_time.getDate();
            var ruleArr = [];
            ruleArr.push({ "field": "TeachDate", "op": "eq", "data": strDate });
            ruleArr.push({ "field": "TeachTime", "op": "eq", "data": nv });
            if (ruleArr.length > 0) {
                var filterObj = { groupOp: 'AND', rules: ruleArr };
                wherestr = JSON.stringify(filterObj);
                $('#listall').datagrid('load', { filter: JSON.stringify(filterObj) });
            }

        }
    });
    $("#txt_dayselect").combobox({
        onChange: function (nv, ov) {
            var curr_time = new Date();
            var strDate = curr_time.getFullYear() + "-";
            strDate += curr_time.getMonth() + 1 + "-";
            strDate += curr_time.getDate();
            var ruleArr = [];          
            ruleArr.push({ "field": "TeachWeeks", "op": "eq", "data": nv });
            if (ruleArr.length > 0) {
                var filterObj = { groupOp: 'AND', rules: ruleArr };
                wherestr = JSON.stringify(filterObj);
                $('#listall').datagrid('load', { filter: JSON.stringify(filterObj) });
            }

        }
    });
    $("#btn_A1").click(function () {
       
        var d1 =$("#dtOpstart").datebox('getValue');
        var d2 =$("#dtOpend").datebox('getValue');
       // alert(d1+"----"+d2);
        if (d1 > d2) {
            alert("授课日期查询起止顺序有错误！请检查！");
            return;
        }
        else {
            var ruleArr = [];
            if (dtOpstart != '')
                ruleArr.push({ "field": "TeachDate", "op": "ge", "data": d1 });
            if (dtOpend != '')
                ruleArr.push({ "field": "TeachDate", "op": "le", "data": d2 });

            if (ruleArr.length > 0) {
                var filterObj = { groupOp: 'AND', rules: ruleArr };
                wherestr = JSON.stringify(filterObj);
                $('#listall').datagrid('load', { filter: JSON.stringify(filterObj) });
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

var gridall = {
    bind: function (size) {
        $('#listall').datagrid({
            url: actionURL + "?"+ createParam("GetTCStudentInfo"),

           // toolbar: '#toolbar',
            //title: "学生缺勤明细情况表",
            iconCls: 'icon icon-list',
            width: size.width,
            height: size.height-60,
            nowrap: false, //折行
            rownumbers: true, //行号
            striped: true, //隔行变色
            pagination: true,
           pageSize: PAGESIZE,
           pageList: [40, 60, 100],
            idField: 'KeyId',//主键
            singleSelect: true, //单选
          //  frozenColumns: [[]],
            columns: [[
           { title: '课程', field: 'CourseName', width: 140 },

            { title: '任课教师', field: 'TrueName', width: 60 },

            { title: '教学周', field: 'TeachWeeks', width: 40 },
            {
                title: '日期', field: 'TeachDate', width: 100,
                formatter: function (val) {
                    if (val == "" || val == null)
                    { return "" }
                    else
                    { return val.substr(0, 10); }
                }
            },
            { title: '星期', field: 'TeachDay', width: 60 },
            { title: '节次', field: 'TeachTime', width: 40 },
               { title: '班级名称', field: 'ClassName', width: 140 },
		    { title: '学号', field: 'StudentNumber', width: 100 },
		    { title: '姓名', field: 'Name', width: 60 },
		    { title: '性别', field: 'Gender', width: 40 },
            {
                title: '迟到', field: 'CheckCD', width: 40,
                formatter: function (val) {
                    if (val == '1') {
                        return "x";
                    }
                    else {
                        return "";
                    }
                }
            },
            {
                title: '早退', field: 'CheckZT', width: 40,
                formatter: function (val) {
                    if (val == '1') {
                        return "x";
                    }
                    else {
                        return "";
                    }
                }
            },
		    {
		        title: '旷课', field: 'CheckKK', width: 40,
		        formatter: function (val) {
		            if (val >= '1') {
		                return "x";
		            }
		            else {
		                return "";
		            }
		        }
		    },
            {
                title: '请假', field: 'CheckBJ', width: 120,
        formatter: function (val) {
            if (val == '' || val=='0') {
                return "";
            }
            else {
                return val;
            }
        }
    },
//{ title: '消极表现', field: 'CheckBX', width: 120,
//    formatter: function (val) {
//        if (val == '' || val=='0') {
//            return "";
//        }
//        else {
//            return val;
//        }
//    } },
            //{ title: '本人电话', field: 'Phone', width: 140 },
            // { title: '所在宿舍', field: 'Hostel', width: 140 },
            //  { title: '父亲', field: 'Father', width: 80 },
            //  { title: '母亲', field: 'Mother', width: 80 },
            // { title: '联系方式', field: 'HomePhone', width: 120 },
            //{ title: '班主任', field: 'Expr1', width: 120 },
            ]]
        });
    },
    getSelectedRow: function () {
        return $('#listall').datagrid('getSelected');
    },
    reload: function () {
        $('#listall').datagrid('clearSelections').datagrid('reload', { filter: '' });
    }
};