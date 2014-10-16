var actionCommon = '/TM/ashx/TMCommon.ashx';
var actionURL = '/TM/ashx/TMTeachCheckHandler.ashx';
var actionURLDIC = '/TM/ashx/TMClassInfoHandler.ashx';
var wherestr = "";

$(function () {
      autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL + '?action=GetTCListToday',
            toolbar: '#toolbar',
            // title: "今天教师授课考勤信息公开",
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
                
		    
			{ title: '授课教师', field: 'TeacherName', width: 80 },
             { title: '虚班名称', field: 'VClassName', width: 160 },
		    { title: '课程名称', field: 'CourseName', width: 140 },
		    { title: '考勤汇总', field: 'CheckDetail', width: 300 },
            { title: '授课信息', field: 'TeachInfor', width: 260 }
           

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