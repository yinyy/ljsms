var actionURL = '/TM/ashx/TMInvestigateItemHandler.ashx';
var formurl   = '/TM/html/TMInvestigateItem.html';
var investigateId;

$(function () {
    $(document.location.search.substring(1).split('&')).each(function (index, str) {
        if (str.indexOf('InvestigateId=') != -1) {
            investigateId = str.substring(14);
        }
    });

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
    $('#a_choice').click(NAV.choice);
    $('#a_back').click(NAV.back)

    //高级查询
    $('#a_search').click(function () {
        search.go('list');
    });
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL + '?' + createParam('itemsByInvestigate', investigateId),
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
				{ title: '题目内容', field: 'Title', width: 550 },
		    { title: '类型', field: 'Kind_Title', width: 100, align: 'center' },
		    { title: '列集合', field: 'Columns', width: 200 },
            { title: '选项数量', field: 'ChoiceCount', width: 100, align: 'center' },
		    { title: '排序', field: 'SortNumber', width: 80, align: 'center' }
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

    return "json=" + JSON.stringify(o);
}


var CRUD = {
    add: function () {
        var hDialog = top.jQuery.hDialog({
            title: '添加', width: 700, height: 390, href: formurl, iconCls: 'icon-add',
            submit: function () {
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
                top.$('#txt_SortNumber').numberspinner({
                    min: 0,
                    editable: true
                });
                
                top.$('#txt_Kind').combobox({   
                    url: '/sys/ashx/DicHandler.ashx?categoryId='+DIC.Investigate.ItemKind.Category,//TODO:这里的问卷类型是21，根据需要，在其它系统中更改
                    valueField:'KeyId',   
                    textField: 'Title',
                    editable: false
                });
                top.$('#txt_InvestigateId').val(investigateId);
            }
        });
       
        top.$('#uiform').validate();
    },
    edit: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 700, height: 390, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    top.$('#txt_SortNumber').numberspinner({
                        min: 0,
                        editable: true
                    });
                    top.$('#txt_SortNumber').numberspinner('setValue', row.SortNumber);

                    //TODO:这里的问卷类型是21，根据需要，在其它系统中更改
                    top.$('#txt_Kind').combobox({
                        url: '/sys/ashx/DicHandler.ashx?categoryId='+DIC.Investigate.ItemKind.Category,//TODO:这里的问卷类型是21，根据需要，在其它系统中更改
                        valueField: 'KeyId',
                        textField: 'Title',
                        editable: false
                    });
                    top.$('#txt_Kind').combobox('setValue', row.Kind);
                    top.$('#txt_Title').val(row.Title);
                    top.$('#txt_Columns').val(row.Columns);
                    top.$('#txt_InvestigateId').val(row.InvestigateId);
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
}

var NAV = {
    choice: function () {
        var row = grid.getSelectedRow();
        if (row) {
            document.location.href = './TMInvestigateItemChoice.aspx?navid='+DIC.Investigate.NavId.Choice+'&InvestigateId=' + investigateId+'&InvestigateItemId='+row.KeyId;//TODO:这里需要根据情况改变1136的值
        } else {
            msg.warning('请选择要编辑选项的行。');
        }
    },
    back: function () {
        document.location.href = './TMInvestigate.aspx?navid='+DIC.Investigate.NavId.Investigate;//TODO:这里需要根据情况改变1136的值
    }
};

