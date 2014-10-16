var actionURL = '/TM/ashx/TMDetermineFillHandler.ashx';
var formurl   = '/TM/html/TMDetermineFill.html';

$(function () {

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_score').click(CRUD.score);
//高级查询
   $('#a_search').click(function () {
        search.go('list');
    });
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL + '?status='+DIC.Determine.Status.Enabled+'&json=' + JSON.stringify({  action: 'list_determines' }),
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
				{ title: '学期', field: 'Term_Title', width: 200, align: 'center' },
		    { title: '标题', field: 'Title', width: 450, align: 'center' },
            { title: '测评项目', field: 'DetermineCols', width: 250 },
		    { title: '参评教师', field: 'Teacher_Count', width: 80, align: 'center' }
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [20, 40, 50],
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


var CRUD = {
    score: function () {
        var row = grid.getSelectedRow();
        if (row) {
            if (row.DetermineCols == '') {
                msg.warning('本次测评没有项目需要赋分。');
            } else {
                var hDialog = top.jQuery.hDialog({
                    title: '测评项目赋分', width: 1140, height: 800, iconCls: 'icon-add',
                    content: '<link href="../css/determine.css" rel="stylesheet" /><div id="determine_page"><div id="determine_range"><table class="question" cellpadding="0" cellspacing="1"></table></div></div>',
                    submit: function () {
                        DetermineOp.save('determine_range', row.KeyId, 2, function (d) {
                            if (parseInt(d) > 0) {
                                msg.ok('保存成功。');

                                hDialog.dialog('close');
                            } else {
                                msg.warning('保存失败。');
                            }
                        });

                        return false;
                    }
                });

                DetermineOp.get('determine_range', row.KeyId, row.DetermineCols, function () {
                    DetermineOp.show('determine_range', row.KeyId, 2);
                });
            }
        } else {
            msg.warning('请选择要赋分的行。');
        }
    }
};

