var actionURL = '/TM/ashx/TMChuFaHandler.ashx';
var formurl = '/TM/html/TMChuFaDetails.html';
var sumurl = '/TM/html/TMChuFaSumShow.html';
var classURL = '/TM/ashx/TMClassInfoHandler.ashx';
var studentURL = '/TM/ashx/TMStudentsHandler.ashx';
var ruleURL = '/TM/ashx/TMBreakRulesHandler.ashx';
var actionCommon = '/TM/ashx/TMCommon.ashx';
var currentterm = null;
var ctstart = "";
var uid = 0;
var termid = 0;
$(function () {
    $.getJSON(actionCommon + "?nm=GetUid", function (d) {
        uid = eval(d).uid;
    });
    //获取本学期起始日期,用于计算教学周
    $.getJSON(actionCommon + "?nm=GetTerm", function (d) {
        if (d != null) {
            currentterm = eval(d);
            ctstart = new Date(currentterm.TermStart.substr(0, 10));
            termid = d.KeyId;
        }
    });
    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    
    $('#a_datesum').click(sum.datesum);
    $('#a_studentsum').click(sum.studentsum);
    $('#a_weeksum').click(sum.weeksum);

    //高级查询
    $('#a_search').click(function () {
        search.go('list');
    });
});
var sum = {
    datesum: function () {
        bindsum("datesumgetByClassLeaderID", "日期");
    },
    studentsum: function () {
        bindsum("studentsumgetByClassLeaderID", "学生");
    },
    weeksum: function () {
        bindsum("weeksumgetByClassLeaderID", "周次");
    }
};
var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL + '?action=getByClassLeaderID',
            toolbar: '#toolbar',
            title: "数据列表",
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
                { title: '教学周', field: 'Weeks', width: 50, align: 'center' },
            {
                title: '违纪日期', field: 'WeiJiDate', width: 60, align: 'center',
                formatter: function (val) {
                    if (val == "" || val == null)
                    { return "" }
                    else
                    { return val.substr(5, 5); }
                }
            },
            { title: '违纪班级', field: 'ClassName', width: 120, align: 'center' },
            { title: '处罚主体', field: 'ChuFaZhuTi', width: 60, align: 'center' },
		    { title: '违纪种类', field: 'RuleTypeName', width: 60, align: 'center' },
		    { title: '违纪情况', field: 'WeiJiQingkuang', width: 120 },
            { title: '处罚依据', field: 'RuleName', width: 120 },
            { title: '扣分', field: 'ChuFaScore', width: 40, align: 'center' },
		    { title: '违纪学生', field: 'StudentName', width: 60, align: 'center' },
		    { title: '违纪宿舍', field: 'WeiJiRoomName', width: 80, align: 'center' },
		    { title: '处罚说明', field: 'ChuFaShuoMing', width: 120 },
		    //{ title: '处罚人', field: 'ChuFaRenName', width: 60 },
		    { title: '违纪地点', field: 'WeiJiAddress', width: 120 },
		    { title: '审批意见', field: 'ShenHeYiJian', width: 80, align: 'center' },
		    {
		        title: '审批日期', field: 'ShenHeDate', width: 80,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(5, 5); }
		        }
		    },
		    //{ title: '审批人', field: 'ShenHeRenName', width: 60 },

		    { title: '备注信息', field: 'Remark', width: 120 }
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

function bindsum(durl, mbt) {

    var hDialog = top.jQuery.hDialog({
        onLoad: function () {
            pgrid = top.$('#sumlist').datagrid({
                url: actionURL + '?action=' + durl,
                width: 550,
                pagination: true,
                pageSize: PAGESIZE,
                pageList: [200],
                //idField: 'KeyId',//主键
                height: 550,
                columns: [[
                     {
                         field: 'WeiJi', title: mbt, width: 120, align: 'center'

                     },
                    {
                        field: 'Score', title: '扣分合计', width: 150, align: 'center'
                    }
                ]]

            });
            //弹出布局结束
        },
        title: '班级罚分单汇总数据',
        width: 600,
        height: 600,
        href: sumurl,
        iconCls: 'icon-add'
    });

};
function createParam(action, keyid) {
    var o = {};
    var query = top.$('#uiform').serializeArray();
    query = convertArray(query);
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}
function createSubParam(action, keyid) {
    var o = {};
    var query = top.$('#uiform').serializeArray();
    query = convertArray(query);
    query.ShenHeYiJian = "未审批";
    query.ShenHeRen = 161;
    query.TermID = termid;
    query.ChuFaRen = uid;
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}

