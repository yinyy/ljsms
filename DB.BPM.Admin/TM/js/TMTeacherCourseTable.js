var actionCommon = '/TM/ashx/TMCommon.ashx';
var actionURL = '/TM/ashx/TMTeachCourseHandler.ashx';
var uid=0;
$(function () {
    $.getJSON(actionCommon + "?nm=GetUid", function (d) {
        uid = eval(d).uid;
        autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });
    });

    

    $('#a_search').click(function () {
        search.go('list');
    });
    $('#ToExcel').click(function () {
        $('body').data('where', wherestr);
        var ee = new ExportExcel('list', "V_TM_TeachCourseInfo");
        ee.go();
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
            url: actionURL + "?action=GetByTeacherID&tid="+uid,
            toolbar: '#toolbar',          
            iconCls: 'icon icon-list',
            width: winSize.width,
            height: winSize.height,
            nowrap: false, //折行
            rownumbers: true, //行号
            striped: true, //隔行变色
           singleSelect: true, //单选
            frozenColumns: [[]],
            columns: [[
			{ title: '授课虚班', field: 'VClassDescription', width: 180 }, 
		    { title: '课程名称', field: 'CourseName', width: 180 },
		    { title: '开课周', field: 'CourseWeekStart', width: 60 },
		    { title: '结课周', field: 'CourseWeekEnd', width: 60 },
		    { title: '星期', field: 'CourseDay', width: 60 },
            { title: '节次', field: 'CourseTime', width: 60 },
            { title: '授课地点', field: 'Title', width: 120 }
           
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