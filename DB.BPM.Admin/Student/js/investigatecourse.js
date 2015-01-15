var actionURL = '/TM/ashx/TMInvestigateHandler.ashx';


$(function () {
    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL + '?kind=' + DIC.Investigate.Kind.Course + '&status=' +
                DIC.Investigate.Status.Enabled + '&json=' +
                JSON.stringify({ action: 'investigate_course_list' }),//第二个参数表示问卷的当前状态
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
                { title: '问卷', field: 'Title', width: 400, align: 'center' },
                {
                    title: '状态', field: 'Status', width: 150, align: 'center', formatter: function (value, row, index) {
                        if (value > 0) {
                            return '<a href="javascript:void(0);" onclick="showInvestigate(' + row.InvestigateId + ', ' + row.StudentId + ');">查看</a>';
                        } else {
                            return '<a href="javascript:void(0);" onclick="fillInvestigate(' + row.InvestigateId + ');">填写问卷</a>';
                        }
                    }
                },
				{
				    title: '结束时间', field: 'Ended', width: 150, align: 'center', formatter: function (value, row, index) {
				        return value.substring(0, 10);
				    }
				}
            ]],
            pagination: false,
            pageSize: 999999,
            sortName: 'Created',
            sortOrder: 'desc'
        });
    },
    getSelectedRow: function () {
        return $('#list').datagrid('getSelected');
    },
    reload: function () {
        $('#list').datagrid('clearSelections').datagrid('reload', { filter: '' });
    }
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

function fillInvestigate(investigateId) {
    var hDialog = top.jQuery.hDialog({
        title: '填写问卷', max: true,
        content: '<link href="../css/investigate2.css" rel="stylesheet" /><div id="investigate_page"><div id="investigate_range"><table class="question" cellpadding="0" cellspacing="1"><tr><td>&nbsp;</td><td>存在的问题</td><td>反馈意见及建议</td></tr></table></div></div>',
        iconCls: 'icon-add',
        submit: function () {
            if (confirm('填写完成，提交后无法修改。确认提交吗？')) {
                InvestigateOp.save2(investigateId, function (d) {
                    if (parseInt(d) > 0) {
                        msg.ok('添加成功！');
                        grid.reload();
                    } else {
                        MessageOrRedirect(d);
                    }
                });

                hDialog.dialog('close');
            }
            return false;
        }
    });

    //加载问卷
    InvestigateOp.get2('investigate_range', investigateId);
}

function showInvestigate(investigateId, studentId) {
    var hDialog = top.jQuery.hDialog({
        title: '查看问卷', max: true,
        content: '<link href="../css/investigate2.css" rel="stylesheet" /><div id="investigate_page"><div id="investigate_range"><table class="question" cellpadding="0" cellspacing="1"><tr><td>&nbsp;</td><td>存在的问题</td><td>反馈意见及建议</td></tr></table></div></div>',
        iconCls: 'icon-add',
        submit: function () {
            hDialog.dialog('close');
            return false;
        }
    });

    //加载问卷
    InvestigateOp.get2('investigate_range', investigateId, function () {
        //加载问卷答案
        InvestigateOp.show2(investigateId, studentId);
    });
}