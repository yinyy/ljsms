var actionURL = '/TM/ashx/TMStudentLeaveHandler.ashx';
var actionURLdics = '/TM/ashx/TMStudentsHandler.ashx';
var actionURLlb = '/sys/ashx/DicHandler.ashx';
var formurl   = '/TM/html/TMStudentLeave.html';

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
				
                 { title: '所在班级', field: 'ClassName', width: 160 },
                  { title: '班主任', field: 'TrueName', width: 60 },
		    { title: '学号', field: 'StudentNumber', width: 100 },
             { title: '姓名', field: 'Name', width: 60 },
		    {
		        title: '申请日期', field: 'ApplyDate', width: 90,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(0, 10); }
		        }
		    },
		    {
		        title: '开始日期', field: 'LeaveStart', width: 90,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(0, 10); }
		        }
		    },
		    {
		        title: '结束日期', field: 'LeaveEnd', width: 90,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(0, 10); }
		        }
		    },
		    {title:'请假类别',field:'Expr1',width:90},
		    { title: '请假理由', field: 'LeaveReason', width: 120 },
             { title: '联系方式', field: 'Mobile', width: 120 },
              { title: '家庭电话', field: 'HomePhone', width: 120 },
		    {title:'班主任审批',field:'ClassApprove',width:120},
		    {title:'政教处审批',field:'LeaderApprove',width:120},
		    {title:'离校情况',field:'LeaveSchool',width:120},
		    {title:'备用联系方式',field:'LeavePhone',width:120},
		    {
		        title: '返校日期', field: 'LeaveBack', width: 120,
		        formatter: function (val) {
		            if (val == ""||val==null)
		            { return "" }
		            else
		            { return val.substr(0, 10); }
		        }
		    }      
            ]],
            pagination: true,
            pageSize: PAGESIZE,
            pageList: [20, 40, 50],
            rowStyler: function (index, row) {
                if (row.LeaderApprove ==null) {
                    return 'background-color:pink;color:blue;font-weight:bold;';
                }
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

function formatterdate(val, row) {
    var date = new Date(val);
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
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
            onLoad:function(){
                //初始化下拉列表二级学院和所学专业
                //top.$('#txt_College').combobox({ multiple: false, valueField: 'KeyId', textField: 'Title', editable: false });
               
                $.getJSON(actionURLlb + "?categoryId=10", function (dleaveclass) {
                    top.$('#txt_LeaveClass').combobox({
                        multiple: false,
                        valueField: 'KeyId',
                        textField: 'Title',
                        editable: false,
                        data:dleaveclass

                    }
                        );


                });
                          

                //$.getJSON(actionURLdics + '?' + createParam('colleges'), function (d) {
                    //top.$('#txt_College').combobox({ data: d });
                //});

                $.getJSON(actionURLdics + '?' + createParam('proffession'), function (d) {
                    if (d.length > 0) {

                        d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                        d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
                    }
                    else
                        d = '[{id:0,text:"== 请选择 =="}]';

                    top.$('#txt_Profession').combotree({
                        width:'230',
                        valueField: 'id',
                        dataField:'text',
                        editable: false,
                        data: eval(d),
                        value: 0,
                        onChange: function (newValue, oldValue) {

                            $.getJSON(actionURLdics + '?' + createParam('classes', newValue), function (dd) {
                                if (dd.length <=0) {
                                    alert("本专业暂无班级，请到班级管理中添加班级。");

                                }
                                dd = JSON.stringify(dd);
                               
                                top.$('#txt_ClassID').combobox({
                                    valueField: 'KeyId',
                                    textField: 'ClassName',
                                    data: eval(dd),
                                    editable: false,
                                    requried: true,
                                   
                                    onChange: function (newValue1, oldValue1) {

                                        $.getJSON(actionURLdics +'?'+createParam('getbycid',newValue1), function (ddd) {
                                            if (ddd.length <= 0) {
                                                alert("本班级暂无学生");

                                            }
                                           
                                            ddd = JSON.stringify(ddd);
                                           
                                            top.$('#txt_StudentID').combobox({
                                                valueField: 'KeyId',
                                                textField: 'Name',
                                                data:eval(ddd),
                                                editable: false,
                                                requried: true


                                            });
                                        })
                                    }


                                });
                            })
                        } 
                    });

                });
                //初始化结束
            
            
            },
            //onload结束


            title: '添加',
            width: 450,
            height:500,
            href: formurl,
            iconCls: 'icon-add',
           
            submit: function () {

                var d1 = top.$("#txt_LeaveStart").datebox('getValue');
                var d2 = top.$("#txt_LeaveEnd").datebox('getValue');

                if (d1 > d2) {
                    alert("请假结束日期不能早于开始日期！请检查！");
                    return;
                }
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
                title: '编辑', width: 450, height: 500, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    //top.$('#txt_College').combobox({ multiple: false, valueField: 'KeyId', textField: 'Title', editable: false });

                    $.getJSON(actionURLlb + "?categoryId=10", function (dleaveclass) {
                       
                        top.$('#txt_LeaveClass').combobox({
                            multiple: false,
                            valueField: 'KeyId',
                            textField: 'Title',
                            editable: false,
                            data: dleaveclass,
                            value:row.LeaveClassID

                        }
                            );


                    });
                    $.getJSON(actionURLdics + "?action=getstudentbyid&cid=" + row.StudentID, function (sinfo) {
                        
                      
                       
                        //获取学院列表和设置所在学院
                        //$.getJSON(actionURLdics + '?' + createParam('colleges'), function (d) {
                        //    top.$('#txt_College').combobox({ data: d,value:sinfo.College });
                        //});
                        //获取专业列表和设置所在专业
                        $.getJSON(actionURLdics + '?' + createParam('proffession'), function (d) {
                            if (d.length > 0) {

                                d = JSON.stringify(d).replace(/KeyId/g, "id").replace(/Title/g, "text");

                                d = '[{id:0,text:"== 请选择 =="},' + d.substr(1);
                            }
                            else
                                d = '[{id:0,text:"== 请选择 =="}]';
                            
                            top.$('#txt_Profession').combotree({
                                width:'230',
                                valueField: 'id',
                                dataField:'text',
                                editable: false,
                                data: eval(d),
                                value: sinfo.Profession,
                                onChange: function (newValue, oldValue) {

                                    $.getJSON(actionURLdics + '?' + createParam('classes', newValue), function (dd) {
                                        if (dd.length <=0) {
                                            alert("本专业暂无班级，请到班级管理中添加班级。");

                                        }
                                        dd = JSON.stringify(dd);
                               
                                        top.$('#txt_ClassID').combobox({
                                            valueField: 'KeyId',
                                            textField: 'ClassName',
                                            data: eval(dd),
                                            editable: false,
                                            requried: true,
                                   
                                            onChange: function (newValue1, oldValue1) {

                                                $.getJSON(actionURLdics +'?'+createParam('getbycid',newValue1), function (ddd) {
                                                    if (ddd.length <= 0) {
                                                        alert("本班级暂无学生");

                                                    }
                                           
                                                    ddd = JSON.stringify(ddd);
                                           
                                                    top.$('#txt_StudentID').combobox({
                                                        valueField: 'KeyId',
                                                        textField: 'Name',
                                                        data:eval(ddd),
                                                        editable: false,
                                                        requried: true


                                                    });
                                                })
                                            }


                                        });
                                    })
                                } 
                            });

                        });


                        //获取所属专业班级列表和设置所在班级
                        $.getJSON(actionURLdics + '?' + createParam('classes',sinfo.Profession), function (dd) {
                            if (dd.length <=0) {
                                alert("本专业暂无班级，请到班级管理中添加班级。");

                            }
                            dd = JSON.stringify(dd);
                               
                            top.$('#txt_ClassID').combobox({
                                valueField: 'KeyId',
                                textField: 'ClassName',
                                data: eval(dd),
                                editable: false,
                                requried: true,
                                value:sinfo.ClassID,   
                                onChange: function (newValue1, oldValue1) {

                                    $.getJSON(actionURLdics +'?'+createParam('getbycid',newValue1), function (ddd) {
                                        if (ddd.length <= 0) {
                                            alert("本班级暂无学生");

                                        }
                                           
                                        ddd = JSON.stringify(ddd);
                                           
                                        top.$('#txt_StudentID').combobox({
                                            valueField: 'KeyId',
                                            textField: 'Name',
                                            data:eval(ddd),
                                            editable: false,
                                            requried: true


                                        });
                                    })
                                }


                            });
                        });
                        //获取本班学生名单和设置学生姓名
                        $.getJSON(actionURLdics +'?'+createParam('getbycid',sinfo.ClassID), function (ddd) {
                            if (ddd.length <= 0) {
                                alert("本班级暂无学生");

                            }
                                           
                            ddd = JSON.stringify(ddd);
                                           
                            top.$('#txt_StudentID').combobox({
                                valueField: 'KeyId',
                                textField: 'Name',
                                data:eval(ddd),
                                editable: false,
                                requried: true,
                                value:sinfo.KeyId

                            });
                        });
                        //获取列表后赋初值

                       // top.$('#txt_Profession').combotree('setValue', sinfo.Profession);
                       // top.$('#txt_ClassID').combobox('setValue',sinfo.ClassID);
                    }),
                        //初始化结束
			top.$('#txt_ApplyDate').datebox('setValue', row.ApplyDate.substr(0, 10));
			top.$('#txt_LeaveStart').datebox('setValue', row.LeaveStart.substr(0,10));
			top.$('#txt_LeaveEnd').datebox('setValue', row.LeaveEnd.substr(0, 10));
		
			top.$('#txt_LeaveReason').val(row.LeaveReason);
			top.$('#txt_ClassApprove').combobox('setValue', row.ClassApprove);
			top.$('#txt_LeaderApprove').combobox('setValue', row.LeaderApprove);
			top.$('#txt_LeaveSchool').val(row.LeaveSchool);
			top.$('#txt_LeavePhone').val(row.LeavePhone);
			top.$('#txt_LeaveBack').val(row.LeaveBack);			
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

////

var Commondb = {

    //EasyUI用DataGrid用日期格式化
    TimeFormatter: function (value, rec, index) {
        if (value == undefined) {
            return "";
        }
        /*json格式时间转js时间格式*/
        value = value.substr(1, value.length - 2);
        var obj = eval('(' + "{Date: new " + value + "}" + ')');
        var dateValue = obj["Date"];
        if (dateValue.getFullYear() < 1900) {
            return "";
        }
        var val = dateValue.format("yyyy-mm-dd HH:MM");
        return val.substr(11, 5);
    },
    DateTimeFormatter: function (value, rec, index) {
        if (value == undefined) {
            return "";
        }
        /*json格式时间转js时间格式*/
        value = value.substr(1, value.length - 2);
        var obj = eval('(' + "{Date: new " + value + "}" + ')');
        var dateValue = obj["Date"];
        if (dateValue.getFullYear() < 1900) {
            return "";
        }

        return dateValue.format("yyyy-mm-dd HH:MM");
    },

    //EasyUI用DataGrid用日期格式化
    DateFormatter: function (value, rec, index) {
        if (value == undefined) {
            return "";
        }
        /*json格式时间转js时间格式*/
        value = value.substr(1, value.length - 2);
        var obj = eval('(' + '{Date: new ' + value + '}' + ')');
        var dateValue = obj["Date"];
        if (dateValue.getFullYear() < 1900) {
            return "";
        }

        return dateValue.format("yyyy-mm-dd");
    }
};