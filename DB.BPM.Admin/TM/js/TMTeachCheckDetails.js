var actionURL = '/TM/ashx/TMTeachCheckDetailsHandler.ashx';
var formurl   = '/TM/html/TMTeachCheckDetails.html';

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
				{title:'序号',field:'KeyId',width:120},
		    {title:'学生ID',field:'StudentID',width:120},
		    {title:'授课日志ID',field:'TeachCheckID',width:120},
		    {title:'授课信息',field:'CourseInfo',width:120},
		    {title:'迟到',field:'CheckCD',width:120},
		    {title:'早退',field:'CheckZT',width:120},
		    {title:'旷课',field:'CheckKK',width:120},
		    {title:'病假',field:'CheckBJ',width:120},
		    {title:'事假',field:'CheckSJ',width:120},
		    {title:'课堂表现',field:'CheckBX',width:120},
		    {title:'考勤时间',field:'CheckTime',width:120},
		    {title:'学期ID',field:'TermID',width:120},
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
            title: '添加', width: 350, height: 300, href:formurl, iconCls: 'icon-add', submit: function () {
                if (top.$('#uiform').validate().form()) {
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
			top.$('#txt_StudentID').val(row.StudentID);
			top.$('#txt_TeachCheckID').val(row.TeachCheckID);
			top.$('#txt_CourseInfo').val(row.CourseInfo);
			top.$('#txt_CheckCD').val(row.CheckCD);
			top.$('#txt_CheckZT').val(row.CheckZT);
			top.$('#txt_CheckKK').val(row.CheckKK);
			top.$('#txt_CheckBJ').val(row.CheckBJ);
			top.$('#txt_CheckSJ').val(row.CheckSJ);
			top.$('#txt_CheckBX').val(row.CheckBX);
			top.$('#txt_CheckTime').val(row.CheckTime);
			top.$('#txt_TermID').val(row.TermID);
			top.$('#txt_Remark').val(row.Remark);
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

