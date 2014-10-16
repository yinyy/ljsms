
var actionURL = '/TM/ashx/TMTeachInspectHandler.ashx';

$(function () {
   
    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });
        $('#a_search').click(function () {
        search.go('list');
    });
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL,
            toolbar: '#toolbar',
            title: "督导日志分析列表",
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
			{ title: '周次', field: 'InspectWeeks', width: 40 },
		    { title: '督导员', field: 'InspectorName', width: 60 },
		    { title: '授课教师', field: 'TrueName', width: 60 },
		    {
		        title: '督导日期', field: 'InspectDate', width: 80,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(0, 10); }
		        }
		    },
             { title: '星期', field: 'InspectDay', width: 60 },
		    { title: '节次', field: 'InspectTime', width: 40 },
		    { title: '授课地点', field: 'Title', width: 80 },
             { title: '授课虚班', field: 'VClassDescription', width: 120 },
              { title: '课程名称', field: 'CourseName', width: 160 },
		    {
		        title: '迟到', field: 'InspectCD', width: 60,
		        formatter: function (val) {
		            if (val == 0)
		            { return "" }
		            else
		            {
		                return val;
		            }
		        }
		    },
		    {
		        title: '早退', field: 'InspectZT', width: 60,
		        formatter: function (val) {
		            if (val == 0)
		            { return "" }
		            else
		            {
		                return val;
		            }
		        }
		    },
		    {
		        title: '旷课', field: 'InspectKK', width: 60,
		        formatter: function (val) {
		            if (val == 0)
		            { return "" }
		            else
		            {
		                return val;
		            }
		        }
		    },
             {
                 title: '调课信息', field: 'InspectChange', width: 60,
                 formatter: function (val) {
                     if (val == 0)
                     { return "" }
                     else
                     {
                         return val;
                     }
                 }
             },
		    { title: '督导记录', field: 'InspectLog', width: 140 },
		    { title: '督导评价', field: 'InspectAppraise', width: 120 },



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
