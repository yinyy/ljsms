var actionURL = '/TM/ashx/TMWarningIndexHandler.ashx';
var actionDIC = '/sys/ashx/DicHandler.ashx';
var formurl   = '/TM/html/TMWarningIndex.html';

$(function () {

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
//高级查询
   $('#a_search').click(function () {
        search.go('list');
    });
});

var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL,
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
		    { title: '预警项目', field: 'WarningName', width: 120 },
		    {title:'预警下限',field:'WarningIndexLow',width:120},
		    {title:'预警上限',field:'WarningIndexHigh',width:120},
		    { title: '处理规定', field: 'WarningProcess', width: 120 },           
		    {title:'分值',field:'WarningScore',width:120},
		    {title:'指标启用与否',field:'WarningEnabled',width:120},
		    {title:'备注信息',field:'Remark',width:180},
		    {title:'指标统计期间',field:'WarningPeriod',width:120}               
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [20, 40, 50],
            rowStyler: function (index, row) {                
                return row.WarningColorStyle;
                }
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
            title: '添加', width: 350, height: 420, href: formurl, iconCls: 'icon-add',
            onLoad: function () {
                top.$('#txt_WarningItemID').combobox({
                    url: actionDIC + '?categoryId=12',
                    valueField: 'KeyId',
                    textField:'Title',
                    editable: false,                  
                    value: 75

                });                
            },
            submit: function () {
                if (top.$('#uiform').form('validate')) {
                    var d1 = top.$("#txt_WarningIndexLow").val();
                    var d2 = top.$("#txt_WarningIndexHigh").val();
                 
                    if (d1 >= d2)
                    {
                        alert("预警下限不能等于或高于预警上限，请检查！");
                        return;
                    }
                    var query = createParam('add', '0');
                    jQuery.ajaxjson(actionURL, query, function (d) {
                        if (parseInt(d) > 0) {
                            msg.ok('添加成功！');
                            hDialog.dialog('close');
                            grid.reload();
                        } else {
                            MessageOrRedirect(d);
                        }
                    });
                }
                else {
                    alert("请检查输入的预警上下限是否正确！");
                }
                return false;
            }
        });
       
      
    },
    edit: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 350, height: 420, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    top.$('#txt_WarningItemID').combobox({
                        url: actionDIC + '?categoryId=12',
                        valueField: 'KeyId',
                        textField: 'Title',
                        editable: false,
                        value: row.WarningItemID

                    });                  
			
                    top.$('#txt_WarningIndexLow').numberbox('setValue', row.WarningIndexLow);
                    top.$('#txt_WarningIndexHigh').numberbox('setValue', row.WarningIndexHigh);
			top.$('#txt_WarningProcess').val(row.WarningProcess);
			top.$('#txt_WarningScore').val(row.WarningScore);
			top.$('#txt_WarningEnabled').combobox('setValue',row.WarningEnabled);
			top.$('#txt_Remark').val(row.Remark);
			top.$('#txt_WarningPeriod').combobox('setValue', row.WarningPeriod);
			top.$('#ttxt_WarningColorStyle').combobox('setValue', WarningColorStyle);
			            },
                submit: function () {
                  
                        var d1 = top.$("#txt_WarningIndexLow").val();
                        var d2 = top.$("#txt_WarningIndexHigh").val();
                       
                        if (d1 >= d2)
                        {
                            alert("预警下限不能等于或高于预警上限，请检查！");
                            return;
                        }

                        if (top.$('#uiform').form('validate')) {
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

