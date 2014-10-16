var actionCommon = '/TM/ashx/TMCommon.ashx';
var actionURL = '/TM/ashx/TMTeachCheckHandler.ashx';
var actionURLDIC = '/TM/ashx/TMClassInfoHandler.ashx';
var wherestr = "";

$(function () {
    $.getJSON(actionURLDIC + '?' + createParam('deps'), function (d) {
        if (d.length > 0) {
            d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/DepartmentName/g, "text");
            d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
        }
        else
            d = '[{id:0,text:"== 请选择 =="}]';

        $('#txt_deps').combotree({
            editable: false,
            data: eval(d),
            value: 0,
            onChange: function (newValue, oldValue) {

                $.getJSON(actionURLDIC + '?' + createParam('teachers', newValue), function (dd) {

                    dd = JSON.stringify(dd);

                    $('#txt_ClassLeaderID').combobox({
                        valueField: 'KeyId',
                        textField: 'TrueName',
                        data: eval(dd),
                        editable:false,
                        onChange: function (nTV, oTV)
                        {
                            $("#txt_CourseSelect").combogrid("setText","");
                            $("#txt_CourseSelect").combogrid(
          {
              url: actionURL + "?action=GetJsonByTID&cid="+nTV,
              panelWidth: 700,
              idField: 'KeyId',
              textField: 'TeachCourseinfo',
              editable:false,
              columns: [[
              { field: 'TeachCourseinfo', title: '授课班级和课程', width: 200 },
              { field: 'CourseDetail', title: '授课安排', width: 200 },
              { field: 'CourseWeekStart', title: '开始周次', width: 40, align: 'center' },
              { field: 'CourseWeekEnd', title: '结束周次', width: 40, align: 'center' }

              ]],
              width: 400,
              fitColumns: true,
              onChange: function (nV, oV) {

                  var ruleArr = [];
                  ruleArr.push({ "field": "VTeachCourseID", "op": "eq", "data": nV });
                  if (ruleArr.length > 0) {
                      var filterObj = { groupOp: 'AND', rules: ruleArr };
                      wherestr = JSON.stringify(filterObj);
                      $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
                  }
              }
          });



                        }
                    });
                })
            }
        });

    });

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });   
    //高级查询
    $('#a_search').click(function () {
        search.go('list');
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
                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
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
                $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
            }

        }
    });
});
function createParam(action, keyid) {
    var o = {};
    var query = top.$('#uiform').serializeArray();
    query = convertArray(query);
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}
var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL + '?action=GetTCListAll',
            toolbar: '#toolbar',
            title: "教师教学日志汇总",
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
                 {
                     title: '授课日期', field: 'TeachDate', width: 80,
                     formatter: function (val) {
                         if (val == "" || val == null)
                         { return "" }
                         else
                         { return val.substr(0, 10); }
                     }
                 },
                { title: '教学周次', field: 'TeachWeeks', width: 60 },
		    { title: '授课信息', field: 'TeachInfor', width: 160 },
			{ title: '授课教师', field: 'TeacherName', width: 80 },
             { title: '虚班名称', field: 'VClassName', width: 160 },
		    { title: '课程名称', field: 'CourseName', width: 140 },
		    { title: '考勤汇总', field: 'CheckDetail', width: 200 },
            { title: '教学记录', field: 'TeachLog', width: 180 }

            ]],
            pagination: true,

            pageSize: PAGESIZE,
            pageList: [20, 40, 50]
        });
    },
    getSelectedRow: function () {
        return $('#list').datagrid('getSelected');
    },
    reload: function () {
        $('#list').datagrid('clearSelections').datagrid('reload', { filter: '' });
    }
};
