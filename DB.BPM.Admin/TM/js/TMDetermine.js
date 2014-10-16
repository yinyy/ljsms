var actionURL = '/TM/ashx/TMDetermineHandler.ashx';
var formurl = '/TM/html/TMDetermine.html';
var teacherurl = 'TM/html/TMDetermineTeachers.html';

$(function () {

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
    $('#a_determineteachers').click(CRUD_teachers.show);
    $('#a_score').click(CRUD.score);
    $('#a_export').click(CRUD.export);

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
				{ title: '学期', field: 'Term_Title', width: 200, align: 'center' },
		    { title: '标题', field: 'Title', width: 400, align: 'center' },
		    { title: '基础项目', field: 'BasicCols', width: 250 },
		    { title: '测评项目', field: 'DetermineCols', width: 250 },
            { title: '参评教师', field: 'Teacher_Count', width: 80, align: 'center' },
            {
                title: '已打分评委', field: 'Experts', width: 300, align: 'center', formatter: function (value, row, index) {
                    if (value == null) {
                        return '';
                    }

                    if (value.indexOf(',') == 0) {
                        return value.substring(1);
                    } else {
                        return value;
                    }
                }},
            { title: '状态', field: 'Status_Title', width: 80, align: 'center' }
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

var grid_teachers = {
    gt: null,
    editingRowIndex: null,
    bind: function () {
        grid_teachers.gt = top.$('#list2').datagrid({
            url: actionURL + '?json=' + JSON.stringify({ keyId: grid.getSelectedRow().KeyId, action: 'list_teachers' }),
            toolbar: [{
                iconCls: 'icon-add',
                handler: grid_teachers.append,
                text: '添加',
            }, '-', {
                iconCls: 'icon-delete',
                handler: grid_teachers.del,
                text: '删除'
            }],
            title: "数据列表",
            iconCls: 'icon icon-list',
            width: 810,
            height: 522,
            nowrap: false, //折行
            rownumbers: true, //行号
            striped: true, //隔行变色
            idField: 'KeyId',//主键
            singleSelect: true, //单选
            frozenColumns: [[]],
            columns: [[
				{
				    title: '姓名', field: 'TeacherId', width: 200, align: 'center', editor: {
				        type: 'combobox',
				        options: {
				            editable: false,
				            url: actionURL + '?json=' + JSON.stringify({ keyId: 0, action: 'all_teachers' }),
				            textField: 'Name',
				            valueField: 'KeyId'
				        }
				    },
				    formatter: function (value, row, index) {
				        if (row.Teacher_Title) {
				            return row.Teacher_Title;
				        } else {
				            return '';
				        }
				    }
				},
		    { title: '授课地点', field: 'Address', width: 200, align: 'center', editor: 'text' },
		    { title: '课题', field: 'Course', width: 250, align: 'center', editor: 'text' },
            {
                title: '授课时间', field: 'Time', width: 120, align: 'center', editor: {
                    type: 'datebox', options: { editable: false }
                },
                formatter: function (value, row, index) {
                    return value.substring(0, 10);
                }
            }
            ]],
            pagination: false,
            pageSize: 999999,
            sortName: 'SortNumber',
            sortOrder: 'asc',
            onDblClickRow: grid_teachers.onDblClickRow,
            onClickRow: grid_teachers.onClickRow
        });
    },
    getSelectedRow: function () {
        return grid_teachers.gt.datagrid('getSelected');
    },
    reload: function () {
        grid_teachers.gt.datagrid('clearSelections').datagrid('reload', { filter: '' });
    },
    append: function () {
        grid_teachers.gt.datagrid('appendRow', {
            Teacher_Title: '',
            Address: '',
            Course: '',
            Time: ''
        });
        //top.$('#list2').datagrid('beginEdit', top.$('#list2').datagrid('getRows').length - 1);
    },
    del: function(){
        var row = grid_teachers.getSelectedRow();
        if (row) {
            var index = grid_teachers.gt.datagrid('getRowIndex', row);
            if (grid_teachers.editingRowIndex == index) {
                //取消编辑
                grid_teachers.gt.datagrid('cancelEdit', grid_teachers.editingRowIndex);
                grid_teachers.editingRowIndex = null;
            }

            //删除
            grid_teachers.gt.datagrid('deleteRow', index);            
        } else {
            alert('请选择删除的行。');
        }
    },
    accept: function(){
        if (grid_teachers.editingRowIndex != null) {
            var ed = grid_teachers.gt.datagrid('getEditor', { index: grid_teachers.editingRowIndex, field: 'TeacherId' });
            grid_teachers.gt.datagrid('getRows')[grid_teachers.editingRowIndex]['Teacher_Title'] = top.$(ed.target).combobox('getText');

            grid_teachers.gt.datagrid('endEdit', grid_teachers.editingRowIndex);

            grid_teachers.editingRowIndex = null;
        }
    },
    select: function(index){
        grid_teachers.gt.datagrid('selectRow', index);
    },
    onDblClickRow: function (index, data) {
        if (grid_teachers.editingRowIndex == index) {
            return;
        }

        grid_teachers.accept();

        grid_teachers.editingRowIndex = index;
        grid_teachers.gt.datagrid('beginEdit', grid_teachers.editingRowIndex);
    },
    onClickRow: function (index, data) {
        if (grid_teachers.editingRowIndex == index) {
            return;
        }

        grid_teachers.accept();
    }
}

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
            title: '添加', width: 450, height: 300, href: formurl, iconCls: 'icon-add',
            submit: function () {
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
            },
            onLoad: function () {
                top.$('#txt_Status').combobox({
                    url: '/sys/ashx/DicHandler.ashx?categoryId=' + DIC.Determine.Status.Category,
                    valueField: 'KeyId',
                    textField: 'Title',
                    editable: false
                }).combobox('setValue', DIC.Determine.Status.Disabled);
            }
        });
       
        top.$('#uiform').validate();
    },
    edit: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 450, height: 300, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    top.$('#txt_Title').val(row.Title);

                    top.$('#txt_BasicCols').val(row.BasicCols);
                    top.$('#txt_DetermineCols').val(row.DetermineCols);

                    top.$('#txt_Status').combobox({
                        url: '/sys/ashx/DicHandler.ashx?categoryId=' + DIC.Determine.Status.Category,
                        valueField: 'KeyId',
                        textField: 'Title',
                        editable: false
                    }).combobox('setValue', row.Status);
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
    },
    score: function () {
        var row = grid.getSelectedRow();
        if (row) {
            if (row.BasicCols == '') {
                msg.warning('本次测评没有基础项目需要赋分。');
            } else {
                var hDialog = top.jQuery.hDialog({
                    title: '基础项目赋分', width: 1140, height: 800, iconCls: 'icon-add',
                    content: '<link href="../css/determine.css" rel="stylesheet" /><div id="determine_page"><div id="determine_range"><table class="question" cellpadding="0" cellspacing="1"></table></div></div>',
                    submit: function () {
                        DetermineOp.save('determine_range', row.KeyId, 1, function (d) {
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

                DetermineOp.get('determine_range', row.KeyId, row.BasicCols, function () {
                    DetermineOp.show('determine_range', row.KeyId, 1);
                });
            }
        } else {
            msg.warning('请选择要赋分的行。');
        }
    },
    export: function(){
        var row = grid.getSelectedRow();
        if (row) {
            window.open('/TM/ashx/TMDetermineExport.aspx?determineId=' + row.KeyId);
        } else {
            msg.warning('请选择要导出的行。');
        }
    }
};

var CRUD_teachers = {
    show: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '参评教师', width: 830, height: 600, href: teacherurl, iconCls: 'icon-add',
                onLoad: function () {
                    autoResize({ dataGrid: '#list2', gridType: 'datagrid', callback: grid_teachers.bind, height: 0 });
                },
                submit: function () {
                    //检查对话框的数据有效性
                    var teacher_rows = grid_teachers.gt.datagrid('getRows');
                    for (var i = 0 ; i < teacher_rows.length; i++) {
                        if (teacher_rows[i].TeacherId == null || teacher_rows[i].TeacherId == '' ||
                            teacher_rows[i].Address == null || teacher_rows[i].Address == '' ||
                            teacher_rows[i].Course == null || teacher_rows[i].Course == '' ||
                            teacher_rows[i].Time == null || teacher_rows[i].Time == '') {
                            alert('参评教师信息填写不完整。');

                            grid_teachers.selectRow(i);

                            return false;
                        }
                    }

                    var data = [];
                    for (var i = 0; i < teacher_rows.length; i++) {
                        var o = {
                            DetermineId: row.KeyId,
                            TeacherId: teacher_rows[i].TeacherId,
                            Time: teacher_rows[i].Time,
                            Address: teacher_rows[i].Address,
                            Course: teacher_rows[i].Course,
                            SortNumber: i
                        };
                        data[data.length] = o;
                    }

                    jQuery.ajaxjson(actionURL, 'json=' + JSON.stringify({ action: 'save_teachers', keyId: row.KeyId }) + '&data=' + JSON.stringify(data), function (d) {
                        if (parseInt(d) > 0) {
                            msg.ok('修改成功！');
                            hDialog.dialog('close');
                            grid.reload();
                        } else {
                            MessageOrRedirect(d);
                        }
                    });

                    return false;
                }
            });
        } else {
            msg.warning('请选择要添加测评教师的行。');
        }
    }
}