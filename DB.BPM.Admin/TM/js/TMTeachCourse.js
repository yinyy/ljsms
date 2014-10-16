var actionURL = '/TM/ashx/TMTeachCourseHandler.ashx';
var formurl   = '/TM/html/TMTeachCourse.html';

$(function () {

    autoResize({ dataGrid: '#list', gridType: 'datagrid', callback: grid.bind, height: 0 });
   
    Details.init();
    $('#a_add').click(CRUD.add);
    $('#a_edit').click(CRUD.edit);
    $('#a_delete').click(CRUD.del);
//高级查询
   $('#a_search').click(function () {
        search.go('list');
    });
}); 
var binddata = {
    getRooms: function () {
        $.getJSON(' /sys/ashx/DicHandler.ashx?action=getdictree&categoryId=20', function (d) {
           
                //d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

               
                $('body').data('rooms', d);
               
        });
       

    },
    bindinit: function () {
        top.$('#txt_TermID').combobox({ multiple: false, valueField: 'KeyId', textField: 'TermDescription', editable: false });

        $.getJSON('/TM/ashx/TMTermHandler.ashx', createParam('list'), function (d) {

            d = JSON.stringify(d);

            top.$('#txt_TermID').combobox({
                data: eval(d),

                onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                    if (data) {
                        top.$('#txt_TermID').combobox("setValue", data[0].KeyId);
                    }
                }

            });


        });
        top.$('#txt_Deparment').combotree({
            url: '/sys/ashx/userhandler.ashx?action=deps',
            valuefield: 'KeyId',
            textfield: 'DepartmentName',
            onChange: function (newValue, oldValue) {
                top.$('#txt_TeacherID').combobox({
                    url: '/sys/ashx/userhandler.ashx?action=getUsersByDep&depid=' + newValue,
                    valueField: "KeyId",
                    textField: 'TrueName',
                    onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                        if (data) {
                            top.$('#txt_TeacherID').combobox("setValue", data[0].KeyId);
                        }
                    }
                });
            }
        });
        $.getJSON('/sys/ashx/DicHandler.ashx?categoryId=7', function (d) {
            if (d.length > 0) {

                d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                d = '[{id:0,text:"== 请选择专业 =="},' + d.substr(1);
            } 
            else
                d = '[{id:0,text:"== 请选择专业 =="}]';
            top.$('#txt_Proffession').combotree({
                editable: false,
                data: eval(d),
                value: 0,
                onChange: function (newValue, oldValue) {
                    top.$('#txt_CourseID').combobox({
                        url: '/tm/ashx/tmcoursehandler.ashx?action=GetcourseslistbyProfid&profid=' + newValue,
                        valueField: "KeyId",
                        textField: 'CourseName',
                        onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                            if (data) {
                                top.$('#txt_CourseID').combobox("setValue", data[0].KeyId);
                            }
                        }
                    });
                }




            });
           
        });
      
        $.getJSON('/TM/ashx/TMVirtualClassHandler.ashx', createParam('vclasslist'), function (d) {
            d = JSON.stringify(d);
            
            top.$('#txt_VClassID').combobox({
                editable: false,
                data: eval(d),
                valueField: 'id',
                textField: 'text'
            });

        });
        
    },
    bindedit: function (tid, vid, cid,tn,cn) {
        top.$('#txt_TermID').combobox({ multiple: false, valueField: 'KeyId', textField: 'TermDescription', editable: false });

        $.getJSON('/TM/ashx/TMTermHandler.ashx', createParam('list'), function (d) {

            d = JSON.stringify(d);

            top.$('#txt_TermID').combobox({
                data: eval(d),

                onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                    if (data) {
                        top.$('#txt_TermID').combobox("setValue", data[0].KeyId);
                    }
                }

            });


        });
        top.$('#txt_Deparment').combotree({
            url: '/sys/ashx/userhandler.ashx?action=deps',
            valuefield: 'KeyId',
            textfield: 'DepartmentName',
            onChange: function (newValue, oldValue) {
                top.$('#txt_TeacherID').combobox({
                    url: '/sys/ashx/userhandler.ashx?action=getUsersByDep&depid=' + newValue,
                    valueField: "KeyId",
                    textField: 'TrueName',
                    onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                        if (data) {
                            top.$('#txt_TeacherID').combobox("setValue", data[0].KeyId);
                        }
                    }
                });
            }
        });
        $.getJSON('/sys/ashx/DicHandler.ashx?categoryId=7', function (d) {
            if (d.length > 0) {

                d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                d = '[{id:0,text:"== 请选择专业 =="},' + d.substr(1);
            }
            else
                d = '[{id:0,text:"== 请选择专业 =="}]';
            top.$('#txt_Proffession').combotree({
                editable: false,
                data: eval(d),
                value: 0,
                onChange: function (newValue, oldValue) {
                    top.$('#txt_CourseID').combobox({
                        url: '/tm/ashx/tmcoursehandler.ashx?action=getCourseByProfid&profid=' + newValue,
                        valueField: "KeyId",
                        textField: 'CourseName',
                        onLoadSuccess: function (data) { //加载完成后,设置选中第一项
                            if (data) {
                                top.$('#txt_CourseID').combobox("setValue", data[0].KeyId);
                            }
                        }
                    });
                }




            });

        });

        $.getJSON('/TM/ashx/TMVirtualClassHandler.ashx', createParam('vclasslist'), function (d) {
            d = JSON.stringify(d);

            top.$('#txt_VClassID').combobox({
                editable: false,
                data: eval(d),
                valueField: 'id',
                textField: 'text',
                value:vid
            });

        });
      
        top.$('#txt_CourseID').combobox({ data: [{ value:cid, text:cn, 'selected': 'true' }] });
        top.$('#txt_TeacherID').combobox({ data: [{ value: tid, text: tn, 'selected': 'true' }] });
    }


}
var grid = {
    bind: function (winSize) {
        $('#list').datagrid({
            url: actionURL,
            toolbar: '#toolbar',
            //title: "数据列表",
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
			{ title: '授课虚班', field: 'VClassName', width: 180 },
		    { title: '任课教师', field: 'TeacherName', width: 60 },
		    
		    { title: '课程名称', field: 'CourseName', width: 180 },
		    {title:'开课周次',field:'CourseWeekStart',width:60},
		    {title:'结课周次',field:'CourseWeekEnd',width:60},
		     { title: '授课节次', field: 'CourseDetail', width: 480 },
		        
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
    //var details = pgrid.datagrid('getRows');
   // query.details = details;
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}

function createSubParam(action, keyid) {
    var o = {};
    var query = top.$('#uiform').serializeArray();
    query = convertArray(query);
   var details = pgrid.datagrid('getRows');
     query.details = details;
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}

var CRUD = {
    add: function () {
        var hDialog = top.jQuery.hDialog({
            onLoad: function () {
               // binddata.getRooms();
                binddata.bindinit();
                Details.init();
            },
            title: '添加', width: 500, height: 500, href: formurl, iconCls: 'icon-add', submit: function () {
                Details.accept();
                if (top.$('#uiform').validate().form()) {
                    var query = createSubParam('add', '0');
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
                title: '编辑', width: 500, height: 500, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    binddata.bindedit(row.TeacherID, row.VClassID, row.CourseID,row.TeacherName,row.CourseName);
                    Details.init();                 
			
			top.$('#txt_CourseWeekStart').val(row.CourseWeekStart);
			top.$('#txt_CourseWeekEnd').val(row.CourseWeekEnd);			
			top.$('#details').datagrid({ url: actionURL + "?action=mx&keyid=" + row.KeyId });
			
                    

                },
                
                submit: function () {
                    if (top.$('#uiform').validate().form()) {
                        pgrid.datagrid('acceptChanges'); // 应用所有修改
                        lastEditRowIndex = -1;

                        var query = createSubParam('edit', row.KeyId);

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
var editIndex = undefined, pgrid;
var Details = {
    init: function () {
        editIndex = undefined;
        pgrid = top.$('#details').datagrid({
            toolbar: '#tools',
            width: 480, singleSelect: true,
            height: 220,
            title: '课程表明细',
            columns: [[
                {
                    field: 'CourseDay', title: '星期', width: 80, editor: {
                        type: 'combobox',
                        options: { data: [{ value: '星期一', text: '星期一', 'selected': 'true' }, { value: '星期二', text: '星期二' }, { value: '星期三', text: '星期三' }, { value: '星期四', text: '星期四' }, { value: '星期五', text: '星期五' }, { value: '星期六', text: '星期六' }, { value: '星期日', text: '星期日' }] }

                    }
                },
                 {
                     field: 'CourseTime', title: '节次', width: 80, editor: {
                         type: 'combobox',
                         options: { data: [{ value: '1', text: '1', 'selected': 'true' }, { value: '2', text: '2', 'selected': 'true' }, { value: '3', text: '3', 'selected': 'true' }, { value: '4', text: '4', 'selected': 'true' }, { value: '5', text: '5', 'selected': 'true' }, { value: '6', text: '6', 'selected': 'true' }, { value: '7', text: '7', 'selected': 'true' }, { value: '8', text: '8', 'selected': 'true' }, { value: '1-2', text: '1-2', 'selected': 'true' }, { value: '2-3', text: '2-3', 'selected': 'true' }, { value: '3-4', text: '3-4' }, { value: '5-6', text: '5-6' }, { value: '6-7', text: '6-7', 'selected': 'true' }, { value: '7-8', text: '7-8' }, { value: '9-10', text: '9-10' }, { value: '晚自习', text: '晚自习' }] }
                     }},
               
                {
                    field: 'CourseRoomID', title: '上课地点', width: 180,
                    formatter: function (val, row, index) {
                        if (row.CourseRoom) {
                            return row.CourseRoom;
                        } else {
                            return '';
                        }
                    },
                    editor: {
                        type: 'combotree',
                        options: {

                            url: '/sys/ashx/DicHandler.ashx?action=getdictree&categoryId=20',
                            //data:$('body').data('rooms'),
                            width: 120,
                            valueField: 'id',
                            textField: 'text',
                            panelWidth: 180,
                            lines: true
                        }
                    }
                },
            {field:'Remark',title:'备注信息',width:120,editor:'text'}
               
            ]],
            onClickRow: Details.onClickRow
        });


        top.$('#a_add1').click(function () {
           
            Details.append();
        });

        top.$('#a_delete1').click(function () {
            var index = pgrid.datagrid('getSelectedIndex');
            if (index == -1) {
                alert('请选择要删除的记录。');
                return false;
            }
           Details.remove();
        });
    },


    endEditing: function () {
        if (editIndex == undefined) { return true }
        var ed = pgrid.datagrid('getEditor', { index: editIndex, field: 'CourseRoomID' });
        var CourseRoom = top.$(ed.target).combotree('getText');
        pgrid.datagrid('getRows')[editIndex]['CourseRoom'] = CourseRoom;
        pgrid.datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    },
    onClickRow: function (index) {
        if (editIndex != index) {
            if (Details.endEditing()) {
                pgrid.datagrid('selectRow', index)
                        .datagrid('beginEdit', index);
                editIndex = index;
            } else {
                pgrid.datagrid('selectRow', editIndex);
            }
        }
    },
    append: function () {
        if (Details.endEditing()) {
            pgrid.datagrid('appendRow', { CourseDay: '', CourseTime:''});
            editIndex = pgrid.datagrid('getRows').length - 1;
            pgrid.datagrid('selectRow', editIndex)
                    .datagrid('beginEdit', editIndex);
        }
    },
    remove: function () {
        if (editIndex == undefined) { return }
        pgrid.datagrid('cancelEdit', editIndex)
                 .datagrid('deleteRow', editIndex);
        editIndex = undefined;
    },
    accept: function () {
        if (Details.endEditing()) {
            pgrid.datagrid('acceptChanges');
        }
    }

}
