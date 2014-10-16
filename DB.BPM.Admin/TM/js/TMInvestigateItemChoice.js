var actionURL = '/TM/ashx/TMInvestigateItemChoiceHandler.ashx';
var formurl   = '/TM/html/TMInvestigateItemChoice.html';
var investigateItemId;
var investigateId;

$(function () {
    $(document.location.search.substring(1).split('&')).each(function (index, str) {
        if (str.indexOf('InvestigateItemId=') != -1) {
            investigateItemId = str.substring(18);
        } else if (str.indexOf('InvestigateId=') != -1) {
            investigateId = str.substring(14);
        }
    });

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
    $('#a_back').click(NAV.back);

//高级查询
    $('#a_search').click(function () {
        search.go('list');
    });
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL+'?'+createParam('choicesByItem',investigateItemId),
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
				{ title: '选项内容', field: 'Title', width: 450 },
		    { title: '分值', field: 'Score', width: 80, align: 'center' },
		    {
		        title: '是否显示文本框', field: 'HasOther', width: 150, formatter: function (value, row, index) {
		            if (value == 1) {
		                return '是';
		            } else {
		                return '否'
		            }
		        }, align: 'center'
		    },
            { title: '排序', field: 'SortNumber', width: 80 }
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [20, 40, 50],
            sortName: 'SortNumber',
            sortOrder: 'asc'
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

    o.investigateItemId = investigateItemId;

    return "json=" + JSON.stringify(o);
}


var CRUD = {
    add: function () {
        var hDialog = top.jQuery.hDialog({
            title: '添加', width: 600, height: 360, href:formurl, iconCls: 'icon-add', submit: function () {
                if (top.$('#uiform').validate().form()) {
                    var query = createParam('add', '0');
                    jQuery.ajaxjson(actionURL, query, function (d) {
                        if (parseInt(d) > 0) {
                            msg.ok('添加成功！');
                            //允许一直添加
                            //hDialog.dialog('close');
                            grid.reload();
                        } else {
                            MessageOrRedirect(d);
                        }
                    });
                }
                return false;
            },
            onLoad: function () {
                top.$('#txt_HasOtherCheck').click(function () {
                    top.$('#txt_HasOther').val($(this).attr('checked')=='checked'?1:0);
                });
                top.$('#txt_Score').numberbox({
                    min: 0,
                    precision: 2
                });
                top.$('#txt_InvestigateItemId').val(investigateItemId);
                top.$('#txt_SortNumber').numberspinner({
                    min: 0,
                    editable: false
                });
            }
        });
       
        top.$('#uiform').validate();
    },
    edit: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 600, height: 360, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    top.$('#txt_HasOtherCheck').click(function () {
                        top.$('#txt_HasOther').val($(this).attr('checked') == 'checked' ? 1 : 0);
                    });
                    top.$('#txt_Score').numberbox({
                        min: 0,
                        precision: 2
                    });

                    top.$('#txt_Title').val(row.Title);
                    top.$('#txt_Score').numberbox('setValue', row.Score);
                    top.$('#txt_HasOther').val(row.HasOther);
                    if (row.HasOther == 1) {
                        top.$('#txt_HasOtherCheck').attr('checked', 'checked');
                    }
                    top.$('#txt_InvestigateItemId').val(row.InvestigateItemId);
                    top.$('#txt_SortNumber').numberspinner({
                        min: 0,
                        editable: false
                    });
                    top.$('#txt_SortNumber').numberspinner('setValue', row.SortNumber);
                },
                submit: function () {
                    if (top.$('#uiform').validate().form()) {
                        var query = createParam('edit', row.KeyId);;
                        jQuery.ajaxjson(actionURL, query, function (d) {
                            if (parseInt(d) > 0) {
                                msg.ok('修改成功！');
                                hDialog.dialog('close');
                                grid.reload();
                            } else {
                                MessageOrRedirect(d);
                            }
                        });
                    }
                    return false;
                }
            });
           
        } else {
            msg.warning('请选择要修改的行。');
        }
    },
    del: function () {
        var row = grid.getSelectedRow();
        if (row) {
            if (confirm('确认要执行删除操作吗？')) {
                var rid = row.KeyId;
                jQuery.ajaxjson(actionURL, createParam('delete', rid), function (d) {
                    if (parseInt(d) > 0) {
                        msg.ok('删除成功！');
                        grid.reload();
                    } else {
                        MessageOrRedirect(d);
                    }
                });
            }
        } else {
            msg.warning('请选择要删除的行。');
        }
    }
};

var NAV = {
    back: function () {
        document.location.href = './TMInvestigateItem.aspx?navid='+DIC.Investigate.NavId.Item+'&InvestigateId=' + investigateId;//TODO:这里需要根据情况改变1136的值
    }
};