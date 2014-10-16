var actionCommon = '/TM/ashx/TMCommon.ashx';
var actionURL = '/TM/ashx/TMTeachCheckHandler.ashx';
var actionURLD = '/TM/ashx/TMTeachCheckDetailsHandler.ashx';
var actionURLS = '/TM/ashx/TMVClassStudentsHandler.ashx';
var actionURLSL = '/TM/ashx/TMStudentLeaveHandler.ashx';
  
var formurl   = '/TM/html/TMTeachCheck.html';
var currentterm = null;
var ctstart = "";
var uid = 0;
var termid = 0;
var js = '1';
$(function () {
    $.getJSON(actionCommon + "?nm=GetUid", function (d) {
        uid = eval(d).uid;
    });
    //获取本学期起始日期,用于计算教学周
    $.getJSON(actionCommon + "?nm=GetTerm", function (d) {
        if (d != null) {
            currentterm = eval(d);
            ctstart = new Date(currentterm.TermStart.substr(0, 10));
            termid = d.KeyId;
        } 
    });
   
    $("#txt_CourseSelect").combogrid(
           {
               url: actionURL + "?action=GetJsonByTeacherID",
               panelWidth: 700,
               idField: 'KeyId',
               textField: 'TeachCourseinfo',
               columns: [[
               { field: 'TeachCourseinfo', title: '授课班级和课程', width: 200 },
               { field: 'CourseDetail', title: '授课安排', width: 200 },
               { field: 'CourseWeekStart', title: '开始周次', width: 40, align: 'center' },
               { field: 'CourseWeekEnd', title: '结束周次', width: 40, align: 'center' }

               ]],
               width: 400,
               fitColumns: true,
               onChange: function (nV, oV) {
                   
                   var ruleArr = [];
                   ruleArr.push({ "field": "VTeachCourseID", "op": "eq", "data": nV});
                   if (ruleArr.length > 0) {
                       var filterObj = { groupOp: 'AND', rules: ruleArr };
                       wherestr = JSON.stringify(filterObj);
                       $('#list').datagrid('load', { filter: JSON.stringify(filterObj) });
                   }
               }
           });
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
            url: actionURL + "?action=GetTCListByTeacherID",
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
                 {
                     title: '授课日期', field: 'TeachDate', width: 80,
                     formatter: function (val) {
                         if (val == "" || val == null)
                         { return "" }
                         else
                         { return val.substr(0, 10); }
                     }
                 },
                { title: '教学周次', field: 'TeachWeeks', width: 60 },
		    { title: '授课信息', field: 'TeachInfor', width: 160 },
            { title: '课程教师', field: 'TeacherName', width: 80 },
			{ title: '授[代]课教师', field: 'DKTeacherName', width: 80},
             { title: '虚班名称', field: 'VClassName', width: 100 },
		    { title: '课程名称', field: 'CourseName', width: 100 },		   
		    { title: '考勤汇总', field: 'CheckDetail', width: 200 },
            {title:'教学记录',field:'TeachLog',width:240}
		             
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
function createSubParam(action, keyid) {
    var o = {};
    var query = top.$('#uiform').serializeArray();
    query = convertArray(query);
    var details = pgrid.datagrid('getRows');
    query.details = details;
    query.Teacher = uid;//实际授课教师
    //query.Teacher=uname;//获取课程老师姓名
    //query.RealTeacherID=代课教师ID
    query.TermID = termid;
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}
var binddata = {
    bindclear: function () {
       
        top.$("#txt_CourseID").combogrid("setValue","");


    },
    bindadd: function () {
        
        //设置日期为当前日期
        var curr_time = new Date();
        var currentweeks = parseInt(Math.abs(curr_time - ctstart) / 1000 / 60 / 60 / 24 / 7) + 1;
        top.$("#txt_TeachWeeks").combobox("setValue",currentweeks);
        var strDate = curr_time.getFullYear() + "-";
        strDate += curr_time.getMonth() + 1 + "-";
        strDate += curr_time.getDate();
        top.$("#txt_TeachDate").datebox("setValue", strDate);
        var week;
        if (curr_time.getDay() == 0) week = "星期日";
        if (curr_time.getDay() == 1) week = "星期一";
        if (curr_time.getDay() == 2) week = "星期二";
        if (curr_time.getDay() == 3) week = "星期三";
        if (curr_time.getDay() == 4) week = "星期四";
        if (curr_time.getDay() == 5) week = "星期五";
        if (curr_time.getDay() == 6) week = "星期六";
        
        top.$("#txt_TeachDay").combobox("setValue",week);
        var strtime;
        strtime = curr_time.getHours() + '.' + curr_time.getMinutes();
        //var classtime='';
        //if (strtime >= '7.35' && strtime <= '9.35') classtime = '1-2';
        //if (strtime > '9.45' && strtime <= '11.4') classtime = '3-4';
        //if (strtime >= '14' && strtime <= '15.55') classtime = '5-6';
        //if (strtime >= '16' && strtime <= '17.55') classtime = '7-8';
        //if (strtime > '19' && strtime <= '20.5') classtime = '9-10';
        top.$("#txt_TeachTime").combobox({
            onChange: function (nv, ov) {
                if (nv.length > 1) {
                    js = 2;
                }
                else
                {
                    js = 1;
                }
            }

        });
        var classdate = top.$("#txt_TeachDate").datebox('getValue');
        $.ajaxSetup({cache:false});
        $.getJSON(actionURL + "?action=bindadd&cw=" +  encodeURIComponent(week) + "&ct=" + classtime+"&ws="+currentweeks, function (da) {
            if (da == null)
            {
                alert("根据系统时间和教学计划查找，日期[" + classdate + "]，第" + currentweeks + "教学周[" + week + "][" + classtime + "]节您没有课，如果是补充教学日志，请设置正确的日期和节次后（星期系统自动计算），点击对话框右上方的【查找授课】按钮！");
                return; 
            }
            top.$("#txt_TrueName").val(da.TrueName);
            //通过下拉组合框，显示授课信息
           
           top.$("#txt_CourseID").combogrid(
            {
                url: actionURL + "?action=GetJsonByTeacherID",
                panelWidth: 700,
                idField: 'KeyId',
                textField: 'TeachCourseinfo',
                columns: [[
				{ field: 'TeachCourseinfo', title: '授课班级和课程', width: 200 },
				{ field: 'CourseDetail', title: '授课安排', width: 200 },
				{ field: 'CourseWeekStart', title: '开始周次', width: 40, align: 'center' },
				{ field: 'CourseWeekEnd', title: '结束周次', width: 40, align: 'center' }
				
                ]],
                width: 400,
                fitColumns: true,
                onLoadSuccess: function () {
                    top.$("#txt_CourseID").combogrid('setValue', da.KeyId);
                }
            });

          
           top.$("#txt_TeachRoomID").combotree({
               url: '/sys/ashx/DicHandler.ashx?action=getdictree&categoryId=20',
               width: 120,
               valueField: 'id',
               textField: 'text',
               panelWidth: 180,
               lines: true,
               onLoadSuccess: function () {
                   top.$("#txt_TeachRoomID").combotree("setValue", da.CourseRoomID);
               }
                

           });
            
           Details.init(da.VClassID, actionURLS + "?action=vslist&vcid=" + da.VClassID + "&tcdate=" + strDate);
           $.ajaxSetup({ cache: true });
        });
       
    },
    bindsearch: function () {
        var week = top.$("#txt_TeachDay").combobox("getText");
        var classtime = top.$("#txt_TeachTime").combobox("getText");       
        var classdate = top.$("#txt_TeachDate").datebox('getValue');
        var currentweeks = top.$("#txt_TeachWeeks").combobox("getValue");
        var courseteacherid = top.$("#txt_TrueTeacher").combobox("getValue");
        var courseteachername = top.$("#txt_TrueTeacher").combobox("getText");
        $.ajax({ cache: false });
        $.getJSON(actionURL + "?action=bindadd&cw=" + encodeURIComponent(week) + "&ct=" + classtime + "&ws=" + currentweeks + "&tt=" + courseteacherid + "&random=" + Math.random(), function (ds) {
           
            if (ds == null) {
                alert("根据系统时间和教学计划查找，[" + courseteachername+"]老师["+classdate + "]，第"+currentweeks+"教学周[" + week + "][" + classtime + "]节没有课，请设置正确的日期和节次后（星期系统自动计算），重新点击【查找授课】按钮！");
                binddata.bindclear();
                return;
            }
            
            top.$("#txt_CourseID").combogrid(
             {
                 url: actionURL + "?action=GetJsonByTeacherID",
                 panelWidth: 700,
                 idField: 'KeyId',
                 textField: 'TeachCourseinfo',
                 columns: [[
                 { field: 'TeachCourseinfo', title: '授课班级和课程', width: 200 },
                 { field: 'CourseDetail', title: '授课安排', width: 200 },
                 { field: 'CourseWeekStart', title: '开始周次', width: 40, align: 'center' },
                 { field: 'CourseWeekEnd', title: '结束周次', width: 40, align: 'center' }
                 ]],
                 width:400,
                 fitColumns: true,
                 onLoadSuccess: function () {
                     top.$("#txt_CourseID").combogrid("setValue", ds.KeyId);
                 }
             });

          
            top.$("#txt_TeachRoomID").combotree({
                url: '/sys/ashx/DicHandler.ashx?action=getdictree&categoryId=20',
                width: 120,
                valueField: 'id',
                textField: 'text',
                panelWidth: 180,
                lines: true,
                onLoadSuccess: function () {
                    top.$("#txt_TeachRoomID").combotree("setValue", ds.CourseRoomID);
                }


            })
           
            Details.init(ds.VClassID, actionURLS + "?action=vslist&vcid=" + ds.VClassID + "&tcdate=" + classdate);
            $.ajax({ cache: true });
        });



    },
    bindedit: function (ctid,tcourse,troom) {
        //设置课程教师ctid
        //top.$("txt_TrueTeacher")
        //通过下拉组合框，显示授课信息

        top.$("#txt_CourseID").combogrid(
         {
             url: actionURL + "?action=GetJsonByTeacherID",
             panelWidth: 700,
             idField: 'KeyId',
             textField: 'TeachCourseinfo',
             editable:false,
             columns: [[
             { field: 'TeachCourseinfo', title: '授课班级和课程', width: 200 },
             { field: 'CourseDetail', title: '授课安排', width: 200 },
             { field: 'CourseWeekStart', title: '开始周次', width: 40, align: 'center' },
             { field: 'CourseWeekEnd', title: '结束周次', width: 40, align: 'center' }

             ]],
             width: 400,
             fitColumns: true,
             onLoadSuccess: function () {
                 top.$("#txt_CourseID").combogrid('setValue', tcourse);
             }
         });
              
        top.$("#txt_TeachRoomID").combotree({
            url: '/sys/ashx/DicHandler.ashx?action=getdictree&categoryId=20',
            width: 120,
            valueField: 'id',
            textField: 'text',
            panelWidth: 180,
            lines: true,
            onLoadSuccess: function () {
                top.$("#txt_TeachRoomID").combotree("setValue", troom);
            }
        });




}
};

var CRUD = {
    add: function () {
        var hDialog = top.jQuery.hDialog({
            onLoad: function () {
                top.$("#txt_TeachDate").datebox({
                    formatter: function (date) { return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(); },
                    parser: function (date) { return new Date(Date.parse(date.replace(/-/g, "/"))); },
                    onSelect: function (date) {                       
                        var week1;
                        if (date.getDay() == 0) week1 = "星期日";
                        if (date.getDay() == 1) week1 = "星期一";
                        if (date.getDay() == 2) week1 = "星期二";
                        if (date.getDay() == 3) week1 = "星期三";
                        if (date.getDay() == 4) week1 = "星期四";
                        if (date.getDay() == 5) week1 = "星期五";
                        if (date.getDay() == 6) week1 = "星期六";
                        top.$("#txt_TeachDay").combobox("setValue", week1);
                        var currentweeks = parseInt(Math.abs(date - ctstart) / 1000 / 60 / 60 / 24 / 7) + 1;
                        top.$("#txt_TeachWeeks").combobox("setValue", currentweeks);
                    }

                });
                //获取所有教师名单，然后定位到登陆教师名字
                
                top.$("#txt_TrueTeacher").combobox(
                    {
                        url: actionCommon + "?nm=GetTeachers",
                        valueField:'KeyId',
                        textField:'TrueName',
                        onLoadSuccess:function(){
                            top.$("#txt_TrueTeacher").combobox("setValue",uid);
                        }

                    }
                    );
                top.$("#txt_TeachTime").combobox({
                    onChange: function (nv, ov) {
                        if (nv.length > 1) { js = '2' }
                        else
                        { js='1'}
                    }
                })
                top.$("#btn_searchclass").click(binddata.bindsearch);
                //binddata.bindadd();
               
            }, 
            title: '添加教学日志记录', width: 840, height: 620, href: formurl, iconCls: 'icon-add', submit: function () {
                 Details.accept();
                if (top.$('#uiform').validate().form()) {
                    var query = createSubParam('add', '0');
                    jQuery.ajaxjson(actionURL, query, function (d) {
                        var query = createSubParam('add', '0');
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
            ////if (row.Teacher != uid)
            ////{
            ////    alert("本次授课是[" + row.DKTeacherName + "]老师代课，您无权修改删除！请联系代课教师本人修改删除！");
            ////    return false;
            ////}
            var hDialog = top.jQuery.hDialog({

                title: '编辑', width: 840, height: 620, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    if (row.TeachTime.length > 1) { js = '2' }
                    else
                    { js = '1' }
                    binddata.bindedit(row.Teacher, row.VTeachCourseID, row.TeachRoomID);
                   
                    Details.init(row.KeyId, actionURLD + "?action=checklist&tcid=" + row.KeyId);
                    //初始化课程教师下拉框，设置初值

			top.$('#txt_TeachDay').combobox("setValue",row.TeachDay);
			top.$('#txt_TeachDate').datebox("setValue", row.TeachDate);
			top.$("#txt_TeachTime").combobox({
			    onChange: function (nv, ov) {
			        if (nv.length > 1) { js = '2' }
			        else
			        { js = '1' }
			    }
			})
			top.$('#txt_TeachTime').combobox("setValue", row.TeachTime);
			
			
			top.$('#txt_TeachLog').val(row.TeachLog);
			top.$('#txt_TeachWeeks').combobox("setValue",row.TeachWeeks);
			top.$("#txt_TrueTeacher").combobox(
                    {
                        url: actionCommon + "?nm=GetTeachers",
                        valueField: 'KeyId',
                        textField: 'TrueName',
                        onLoadSuccess: function () {
                            top.$("#txt_TrueTeacher").combobox("setValue", row.Teacher);
                        }

                    }
                    );
			            },
                submit: function () {
                    pgrid.datagrid('acceptChanges'); // 应用所有修改
                    lastEditRowIndex = -1;

                    var query = createSubParam('edit', row.KeyId);



                    if (top.$('#uiform').validate().form()) {
                        var query = createSubParam('edit', row.KeyId);;
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
            if (row.Teacher != uid) {
                alert("本次授课是[" + row.DKTeacherName + "]老师代课，您无权修改删除！请联系代课教师本人修改删除！");
                return false;
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
    }
};
var editIndex = undefined, pgrid;
var Details = {
    init: function (tcid,durl) {
       

       
        editIndex = undefined;
        
        pgrid = top.$('#details').datagrid({
            url: durl,
            //toolbar: '#tools',
            width: 800, singleSelect: true,
            pagination: true,
           
            idField:'Expr4',
            pageSize: PAGESIZE,
            pageList: [200],
            height: 400,
           // title: '上课学生考勤名单',
            columns: [[
                 {
                     field: 'ClassName', title: '班级', width: 170

                 },
                {
                    field: 'StudentNumber', title: '学号', width:105
                },
                 {
                     field: 'Name', title: '姓名', width: 80,align:'center'
                 },
             
               {
                   field: 'CheckCD', title: '迟到', width: 40, align: 'center',
                   editor: { type: 'checkbox', options: { on: '1', off: '0' } },
                   formatter: function (val) {
                      
                       if (val == '1') {
                           return "x";
                       }
                       else
                       {
                           return "";
                       }
                       
                   }
               },
                {
                    field: 'CheckZT', title: '早退', width: 40, align: 'center',
                    editor: { type: 'checkbox', options: { on: '1', off: '0' } },
                    formatter: function (val) {
                        if (val == '1') {
                            return "x";
                        }
                        else {
                            return "";
                        }
                    }
                },
                 {//根据节次是1节还是2节，设置on的值
                     field: 'CheckKK', title: '旷课', width: 40, align: 'center',
                     editor: { type: 'checkbox', options: { on: js, off: '0' } },
                     formatter: function (val) {
                         if (val >= '1') {
                             return "x";
                         }
                         else {
                             return "";
                         }
                     }

                 },
                  {
                      field: 'CheckBJ', title: '请假情况', width: 150, align: 'center', type: 'text',
                      editor: { type: 'text' },
                      formatter: function (val) {
                          if (val == '0') {
                              return "";
                          }
                          else {
                              return val;
                          }
                      }
                      
                  },
                  
            {
                field: 'CheckBX', title: '课堂消极表现', width: 120, editor: { type: 'combobox', options: { data: [{ value: '经常犯困，打瞌睡', text: '经常犯困，打瞌睡', 'selected': 'true' }, { value: '上课摆弄手机', text: '上课摆弄手机' }, { value: '交头接耳聊天', text: '交头接耳聊天' }, { value: '不听从课堂教学指令', text: '不听从课堂教学指令' }, { value: '顶撞并不服从管理', text: '顶撞并不服从管理' }, { value: '上网聊天玩游戏', text: '上网聊天玩游戏' }, { value: '其他上课消极表现', text: '其他上课消极表现' }] } },
                formatter: function (val) {
                    if (val == '0') {
                        return "";
                    }
                    else {
                        return val;
                    }
                }

            }
            ]],
            onClickRow: Details.onClickRow,
           

            //
        });
       
        //top.$('#a_add1').click(function () {

        //    Details.append();
        //});

        //top.$('#a_delete1').click(function () {
        //    var index = pgrid.datagrid('getSelectedIndex');
        //    if (index == -1) {
        //        alert('请选择要删除的记录。');
        //        return false;
        //    }
        //    Details.remove();
        //});
    },


    endEditing: function () {
        if (editIndex == undefined) { return true }
        //var ed = pgrid.datagrid('getEditor', { index: editIndex, field: 'CourseRoomID' });
        //var CourseRoom = top.$(ed.target).combotree('getText');
        // pgrid.datagrid('getRows')[editIndex]['CourseRoom'] = CourseRoom;

        //if(pgrid.datagrid('validateRow',editIndex)) {
        //    pgrid.datagrid('endEdit', editIndex);//当前行编辑事件取消
        //    editIndex = undefined; return true;//重置编辑行索引对象，返回真，允许编辑
        //}else{return false;}//否则，为假，返回假，不允许编辑


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
            pgrid.datagrid('appendRow', { CourseDay: '', CourseTime: '' });
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