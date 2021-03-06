var actionURL = '/TM/ashx/TMInvestigateHandler.ashx';
var formurl   = '/TM/html/TMInvestigate.html';

$(function () {

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });

    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
    $('#a_paper').click(CRUD.paper);
    $('#a_preview').click(CRUD.preview);
    $('#a_copy').click(CRUD.copy);
    $('#a_inport').click(CRUD.inport);
    $('#a_export').click(CRUD.export0);

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
                { title: '创建者', field: 'Creator_Title', width: 100, align: 'center' },
				{
				    title: '创建时间', field: 'Created', width: 90, formatter: function (value, row, index) {
				        return value.substring(0, 10);
				    }, align: 'center'
				},
		    {
		        title: '开始时间', field: 'Started', width: 90, formatter: function (value, row, index) {
		            return value.substring(0, 10);
		        }, align: 'center'
		    },
		    {
		        title: '结束时间', field: 'Ended', width: 90, formatter: function (value, row, index) {
		            return value.substring(0, 10);
		        }, align: 'center'
		    },
		    { title: '标题', field: 'Title', width: 350, align: 'center' },
            {
                title: '类型', field: 'Kind_Title', width: 120, align: 'center', styler: function (value, row, index) {
                    if (row.Kind == DIC.Investigate.Kind.Teacher) {
                        return 'color: #0000ff';
                    } else {
                        return 'color: #ff00ff';
                    }
                }},
            {
                title: '状态', field: 'Status_Title', width: 80, align: 'center', styler: function (value, row, index) {
                    if (row.Status == DIC.Investigate.Status.Ended) {
                        return 'color: #000000';
                    } else if(row.Status==DIC.Investigate.Status.Disabled){
                        return 'color: #ff0000';
                    }
                }},
            {
                title: '题目数量', field: 'ItemCount', width: 90, align: 'center', formatter: function (value, row, index) {
                    if (row.Kind == DIC.Investigate.Kind.Teacher) {
                        return value;
                    } else {
                        return '-';
                    }
                }},
            { title: '答题数量', field: 'AnswerCount', width: 90, align: 'center' },
            {
                title: '查看', field: 'KeyId', width: 100, align: 'center', formatter: function (value, row, index) {
                    return '<a href="javascript:void(0);" onclick="analyse(' + row.KeyId + ', ' + row.Kind + ')">查看</a>';
                }}
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
    add: function () {
        var hDialog = top.jQuery.hDialog({
            title: '添加', width: 450, height: 255, href: formurl, iconCls: 'icon-add',
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
                var now = new Date();
                var str = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

                top.$('#txt_Started, #txt_Ended').datebox({
                    required: true,
                }).datebox('setValue', str);

                top.$('#txt_Status').combobox({
                    url: '/sys/ashx/DicHandler.ashx?categoryId=' + DIC.Investigate.Status.Category,//TODO:问卷状态id
                    valueField: 'KeyId',
                    textField: 'Title',
                    editable: false
                }).combobox('setValue', DIC.Investigate.Status.Enabled);//TODO:启用id;

                top.$('#txt_KindTitle').combobox({
                    url: '/sys/ashx/DicHandler.ashx?categoryId=' + DIC.Investigate.Kind.Category,//TODO:问卷状态id
                    valueField: 'KeyId',
                    textField: 'Title',
                    editable: false,
                    onSelect: function (r) {
                        top.$('#txt_Kind').val(r.KeyId);
                    }
                }).combobox('setValue', DIC.Investigate.Kind.Teacher);

                top.$('#txt_Kind').val(DIC.Investigate.Kind.Teacher);
            }
        });

        top.$('#uiform').validate();
    },
    edit: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var now = new Date().getTime();
            var started = Date.parse(row.Started.substring(0, 10));
            var hDialog = top.jQuery.hDialog({
                title: '编辑', width: 450, height: 255, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    top.$('#txt_TermId').val(row.TermId);
                    top.$('#txt_CreatorId').val(row.CreatorId);

                    top.$('#txt_Title').val(row.Title);
                    top.$('#txt_Status').combobox({
                        url: '/sys/ashx/DicHandler.ashx?categoryId=' + DIC.Investigate.Status.Category,//TODO:问卷状态id
                        valueField: 'KeyId',
                        textField: 'Title',
                        editable: false
                    }).combobox('setValue', row.Status);

                    top.$('#txt_Kind').val(row.Kind);
                    top.$('#txt_KindTitle').val(row.Kind_Title);
                    top.$('#txt_KindTitle').attr('readonly', 'readonly');

                    top.$('#txt_Started, #txt_Ended').datebox({
                        required: true,
                        disabled: (now >= started)
                    });
                    top.$('#txt_Started').datebox('setValue', row.Started.substring(0, 10));
                    top.$('#txt_Ended').datebox('setValue', row.Ended.substring(0, 10));

                    top.$('#uiform').validate();
                },
                submit: function () {
                    if (top.$('#uiform').validate().form()) {
                        //结束时间要晚于开始时间
                        var started = top.$('#txt_Started').datebox('getValue');
                        var ended = top.$('#txt_Ended').datebox('getValue');

                        if (started > ended) {
                            alert('调查开始时间不能晚于调查结束时间。');
                            return;
                        } else {
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
            //判断能否编辑
            var now = new Date().getTime();
            var started = Date.parse(row.Started.substring(0, 10));

            if (now >= started) {
                alert('调查已经开始，不能执行删除操作。');
                return;
            }

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
    paper: function () {
        var row = grid.getSelectedRow();
        if (row) {
            if (row.Kind == DIC.Investigate.Kind.Teacher) {
                var now = new Date().getTime();
                var started = Date.parse(row.Started.substring(0, 10));

                if (now >= started) {
                    alert('调查已经开始，不能执行组卷操作。');
                    return;
                }

                document.location.href = './TMInvestigateItem.aspx?navid=' + DIC.Investigate.NavId.Item + '&InvestigateId=' + row.KeyId;//TODO:这里需要根据情况改变1135的值
            } else {
                msg.warning('教学情况问卷不需组卷。');
            }
        } else {
            msg.warning('请选择要组卷的行。');
        }
    },
    preview: function () {
        var row = grid.getSelectedRow();
        if (row) {
            if (row.Kind == DIC.Investigate.Kind.Teacher) {
                //弹出窗口方式
                //var p = { investigateId: row.KeyId };
                //window.showModalDialog('/TM/TMInvestigatePreview.aspx', p, 'dialogWidth=950px;dialogHeight=800px;');
                //普通方式
                window.open('/TM/TMInvestigatePreview.aspx?investigateId=' + row.KeyId, '_blank', '');
            } else {
                msg.warning('教学情况问卷无法预览。')
            }
        } else {
            msg.warning('请选择要预览的行。');
        }
    },
    copy: function () {
        var row = grid.getSelectedRow();
        if (row) {
            var hDialog = top.jQuery.hDialog({
                title: '复制', width: 450, height: 255, href: formurl, iconCls: 'icon-copy',
                submit: function () {
                    if (top.$('#uiform').validate().form()) {
                        var query = createParam('copy', row.KeyId);
                        jQuery.ajaxjson(actionURL, query, function (d) {
                            if (parseInt(d) > 0) {
                                msg.ok('复制成功！');
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
                    var now = new Date();
                    var str = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

                    top.$('#txt_Title').val(row.Title + ' 副本');
                    top.$('#txt_Started').datebox({
                        required: true,
                    });
                    top.$('#txt_Started').datebox('setValue', str);
                    top.$('#txt_Ended').datebox({
                        required: true
                    });
                    top.$('#txt_Ended').datebox('setValue', str);
                    top.$('#txt_Status').combobox({
                        url: '/sys/ashx/DicHandler.ashx?categoryId=' + DIC.Investigate.Status.Category,
                        valueField: 'KeyId',
                        textField: 'Title',
                        editable: false
                    });
                    top.$('#txt_Status').combobox('setValue', DIC.Investigate.Status.Enabled);

                    top.$('#txt_Kind').val(row.Kind);
                    top.$('#txt_KindTitle').val(row.Kind_Title);
                    top.$('#txt_KindTitle').attr('readonly', 'readonly');
                }
            });

            top.$('#uiform').validate();
        } else {
            msg.warning('请选择要复制的行。');
        }
    },
    inport: function () {
        var row = grid.getSelectedRow();
        if (row) {
            //判断能否编辑
            var now = new Date().getTime();
            var started = Date.parse(row.Started.substring(0, 10));

            if (now >= started) {
                alert('调查已经开始，不能执行导入操作。');
                return;
            }

            if (row.Kind != DIC.Investigate.Kind.Teacher) {
                alert('只允许导入教师调查问卷。');
                return;
            }

            if (row.ItemCount == 0 || (row.ItemCount > 0 && confirm('导入操作将删除目前已有的题目。是否继续？'))) {
                //弹出窗口上传文件
                var hDialog = top.jQuery.hDialog({
                    title: '上传', width: 450, height: 117, iconCls: 'icon-disk_upload',
                    content: '<form id="uiform"><table class="grid"><tr><td><input type="file" id="fileToUpload" style="width: 400px;"/></td></tr></table></form>',
                    submit: function () {
                        if (top.$('#fileToUpload')[0].files[0] == null) {
                            alert('请选择上传文件。');
                            return;
                        }

                        var fd = new FormData();
                        fd.append('fileToUpload', top.$('#fileToUpload')[0].files[0]);
                        var xhr = new XMLHttpRequest();
                        xhr.addEventListener('load', CRUD.upload_completed, false);
                        xhr.addEventListener('error', CRUD.uploadFailed, false);
                        xhr.addEventListener('abort', CRUD.uploadCanceled, false);
                        xhr.upload.addEventListener('progress', CRUD.uploadProgress, false);
                        xhr.open('POST', actionURL + '?' + createParam('inport', row.KeyId));
                        xhr.send(fd);

                        hDialog.dialog('close');
                    }
                });
            }
        } else {
            msg.warning('请选择行。');
        }
    },

    export0: function(){
        var row = grid.getSelectedRow();
        if (row) {
            if (row.Kind != DIC.Investigate.Kind.Teacher) {
                alert('只允许导出教师调查问卷。');
                return;
            }

            $.post(actionURL, createParam('export', row.KeyId), function (data) {
                if (data.indexOf('error_')!=-1) {
                    msg.warning(data.substring(6));
                } else if (data.indexOf('success_')!=-1) {
                    window.open('../'+data.substring(10));
                } else {
                    alert(data);
                }
            }, 'text');
        } else {
            msg.warning('请选择行。');
        }
    },

    uploadProgress: function (evt) {
        //if (evt.lengthComputable) {
        //    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        //    alert(percentComplete.toString() + '%');
        //}
        //else {
        //    alert('unable to compute');
        //}
    },

    upload_completed: function (evt) {
        var ans = evt.target.responseText;
        if (ans == 'success') {
            msg.ok('导入成功！');
            grid.reload();
        } else {
            msg.warning('导入失败！');
        }
    },

    upload_failed: function () {
        msg.warning('操作失败！');
    },

    upload_canceled: function () {
        msg.warning('操作取消！');
    }
};

function analyse(iid, kind) {
    if ((kind == DIC.Investigate.Kind.Teacher)) {
        var hDialog = top.jQuery.hDialog({
            title: '查看', width: 520, height: 480,
            content: '<table id="list2" ></table>  ',
            iconCls: 'icon-copy',
            buttons: [{
                text: '下载',
                handler: function () {
                    msg.warning('正在下载数据，请耐心等待......');

                    $.get(actionURL, createParam('analyseteacher', iid), function (data) {
                        if (data.indexOf('error_') != -1) {
                            alert(data.substring(6));
                        } else if (data.indexOf('success_') != -1) {
                            window.open('../' + data.substring(10));
                        } else {
                            alert(data);
                        }
                    }, 'text');
                },
                iconCls: 'icon-download'
            }, {
                text: '关闭',
                handler: function () {
                    hDialog.dialog('close');
                },
                iconCls: 'icon-cancel'
            }]
        });

        top.$('#list2').datagrid({
            url: actionURL + '?' + createParam('analyseteacher2', iid),
            iconCls: 'icon icon-list',
            width: 500,
            height: 400,
            nowrap: false, //折行
            rownumbers: true, //行号
            striped: true, //隔行变色
            idField: 'KeyId',//主键
            singleSelect: true, //单选
            frozenColumns: [[]],
            columns: [[
                { title: '姓名', field: 'TrueName', width: 150, align: 'center' },
                { title: '课程', field: 'CourseName', width: 200, align: 'center' },
                { title: '分数', field: 'Score', width: 90, align: 'right' },
            ]],
            sortName: 'TrueName',
            sortOrder: 'asc'
        });
    } else {
        var hDialog = top.jQuery.hDialog({
            title: '查看', max:true,
            content: '<table id="list2" ></table>  ',
            iconCls: 'icon-copy',
            buttons: [{
                text: '下载',
                handler: function () {
                    msg.warning('正在下载数据，请耐心等待......');

                    $.get(actionURL, createParam('analysecourse', iid), function (data) {
                        if (data.indexOf('error_') != -1) {
                            alert(data.substring(6));
                        } else if (data.indexOf('success_') != -1) {
                            window.open('../' + data.substring(10));
                        } else {
                            alert(data);
                        }
                    }, 'text');
                },
                iconCls: 'icon-download'
            }, {
                text: '关闭',
                handler: function () {
                    hDialog.dialog('close');
                },
                iconCls: 'icon-cancel'
            }]
        });

        top.$('#list2').datagrid({
            url: actionURL + '?' + createParam('analysecourse2', iid),
            iconCls: 'icon icon-list',
            max:true,
            nowrap: false, //折行
            rownumbers: true, //行号
            striped: true, //隔行变色
            idField: 'KeyId',//主键
            singleSelect: true, //单选
            frozenColumns: [[]],
            columns: [[
                { title: '姓名', field: 'TrueName', width: 150, align: 'center' },
                { title: '课程', field: 'CourseName', width: 200, align: 'center' },
                { title: '班级', field: 'ClassName', width: 150, align: 'center' },
                { title: '存在的问题', field: 'Col1', align: 'center'},
                { title: '反馈意见及建议', field: 'Col2', align: 'center'}
            ]],
            sortName: 'TrueName',
            sortOrder: 'asc'
        });
    }
}