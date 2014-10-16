var actionURL = '/TM/ashx/TMTermHandler.ashx';
var formurl   = '/TM/html/TMTerm.html';

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
				{title:'学期ID',field:'KeyId',width:80},
		    {title:'学期描述',field:'TermDescription',width:160},
		    {
		        title: '开始日期', field: 'TermStart', width: 160,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(0, 10); }
		        }
		    },
		    {
		        title: '结束日期', field: 'TermEnd', width: 160,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(0, 10); }
		        }
		    },
		    {title:'学期状态',field:'Status',width:120},
		    {title:'备注信息',field:'Remark',width:120}               
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
            onLoad: function ()
            {
                top.$("#txt_TermStart").datebox({
                    formatter: function (date) { return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); },
                    parser: function (date) { return new Date(Date.parse(date.replace(/-/g, "/"))); }
                });

            },
            title: '添加', width: 350, height: 300, href:formurl, iconCls: 'icon-add', submit: function () {
                if (top.$('#uiform').form('validate')) {
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
                return false;
            }
        });
       
        top.$('#uiform').validate();
    },
    edit: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 350, height: 300, href: formurl, iconCls: 'icon-save',
                onLoad:function() {
                   top.$('#txt_KeyId').val(row.KeyId);
                   top.$('#txt_TermDescription').val(row.TermDescription);
                    //设置日期框格式
                   top.$("#txt_TermStart").datebox({
                       formatter: function (date) { return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); },
                       parser: function (date) { return new Date(Date.parse(date.replace(/-/g, "/"))); }
                   });
                   top.$('#txt_TermStart').datebox('setValue', row.TermStart.substr(0, 10));
                   top.$('#txt_TermEnd').datebox('setValue', row.TermEnd.substr(0, 10));
			top.$('#txt_Status').val(row.Status);
			top.$('#txt_Remark').val(row.Remark);
			
			            },
                submit: function () {
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

