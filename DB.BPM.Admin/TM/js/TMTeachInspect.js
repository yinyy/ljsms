var actionCommon = '/TM/ashx/TMCommon.ashx';
var actionURL = '/TM/ashx/TMTeachInspectHandler.ashx';
var actionURLTC = '/TM/ashx/TMTeachCheckHandler.ashx';
var formurl   = '/TM/html/TMTeachInspect.html';
var currentterm = null;
var ctstart = "";
var termid = 0;
$(function () {
    //获取本学期起始日期,用于计算教学周
    $.getJSON(actionCommon + "?nm=GetTerm", function (d) {
        if (d != null) {
            currentterm = eval(d);
            ctstart = new Date(currentterm.TermStart.substr(0, 10));
            termid = currentterm.KeyId;
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
            url: actionURL + "?action=GetlistByInspectorID",
            toolbar: '#toolbar',
            title: "督导日志列表",
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
			{ title: '周次', field: 'InspectWeeks', width: 40 },
		    {title:'督导员',field:'InspectorName',width:60},
		    {title:'授课教师',field:'TrueName',width:60},		   
		    {
		        title: '督导日期', field: 'InspectDate', width: 80,
		        formatter: function (val) {
		            if (val == "" || val == null)
		            { return "" }
		            else
		            { return val.substr(0, 10); }
		        }
		    },
             {title:'星期',field:'InspectDay',width:60},    
		    {title:'节次',field:'InspectTime',width:40},
		    { title: '授课地点', field: 'Title', width: 80 },
             { title: '授课虚班', field: 'VClassDescription', width: 140 },
              { title: '课程名称', field: 'CourseName', width: 160 },		   
		    {
		        title: '迟到', field: 'InspectCD', width: 60,
		        formatter: function (val) {
		            if (val == 0)
		            { return "" }
		            else
		            {
		                return val;
		            }
		        }
		    },
		    {
		        title: '早退', field: 'InspectZT', width: 60,
		        formatter: function (val) {
		            if (val == 0)
		            { return "" }
		            else
		            {
		                return val;
		            }
		        }
		    },
		    {
		        title: '旷课', field: 'InspectKK', width: 60,
		        formatter: function (val) {
		            if (val == 0)
		            { return "" }
		            else
		            {
		                return val;
		            }
		        }
		    },
             {
                 title: '调课信息', field: 'InspectChange', width: 60,
                 formatter: function (val) {
                     if (val == 0)
                     { return "" }
                     else
                     {
                         return val;
                     }
                 }
             },
		    { title: '督导记录', field: 'InspectLog', width: 120 },
		    { title: '督导评价', field: 'InspectAppraise', width: 120 },
		   
		 
		              
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
    query.TeacherID = tchid;
    query.TeachCourseDetailID = tcdid;
    query.InspectorID = ispid;
    query.TermID = termid;
    o.jsonEntity = JSON.stringify(query);
    o.action = action;
    o.keyid = keyid;
    return "json=" + JSON.stringify(o);
}
var tchid = 0;
var tcdid = 0;
var ispid = 0;
var binddata = {
    bindclear: function () {
        tchid = 0;
        tcdid = 0;
        ispid = 0;
        top.$("#txt_TrueName").val("");
       

        top.$("#txt_TeachCourseDetailID").val("");
      
        top.$("#txt_Vclass").val("");
      

    },
    bindadd: function () {
        //设定教学地点
        top.$("#txt_InspectRoomID").combotree({
            url: '/sys/ashx/DicHandler.ashx?action=getdictree&categoryId=20',
            width: 120,
            valueField: 'id',
            textField: 'text',
            panelWidth: 180,
            lines: true


        });
        //设置日期为当前日期
        var curr_time = new Date();
        var currentweeks = parseInt(Math.abs(curr_time - ctstart) / 1000 / 60 / 60 / 24 / 7) + 1;
        top.$("#txt_InspectWeeks").combobox("setValue", currentweeks);
        var strDate = curr_time.getFullYear() + "-";
        strDate += curr_time.getMonth() + 1 + "-";
        strDate += curr_time.getDate();
        top.$("#txt_InspectDate").datebox("setValue", strDate);
        var week;
        if (curr_time.getDay() == 0) week = "星期日";
        if (curr_time.getDay() == 1) week = "星期一";
        if (curr_time.getDay() == 2) week = "星期二";
        if (curr_time.getDay() == 3) week = "星期三";
        if (curr_time.getDay() == 4) week = "星期四";
        if (curr_time.getDay() == 5) week = "星期五";
        if (curr_time.getDay() == 6) week = "星期六";

        top.$("#txt_InspectDay").combobox("setValue", week);
        var strtime;
        strtime = curr_time.getHours() + '.' + curr_time.getMinutes();
        var classtime = '';
        if (strtime >= '7.35' && strtime <= '9.35') classtime = '1-2';
        if (strtime > '9.45' && strtime <= '11.4') classtime = '3-4';
        if (strtime >= '14' && strtime <= '15.55') classtime = '5-6';
        if (strtime >= '16' && strtime <= '17.55') classtime = '7-8';
        if (strtime > '19' && strtime <= '20.5') classtime = '9-10';
        top.$("#txt_InspectTime").combobox("setValue", classtime);
       
    },
    

    bindsearch: function () {
       
        var week = top.$("#txt_InspectDay").combobox("getValue");//星期
        var classdate = top.$("#txt_InspectDate").datebox('getValue');
       
        var weeks = top.$("#txt_InspectWeeks").combobox("getValue");//周次
       
        var roomid=top.$("#txt_InspectRoomID").combotree("getValue");
        var roomtitle=top.$("#txt_InspectRoomID").combotree("getText");
        var classtime=top.$("#txt_InspectTime").combobox("getValue");

        $.ajaxSetup({ cache: false });
       
        $.getJSON(actionURL + "?action=bindadd&cw=" + encodeURIComponent(week) + "&ct=" + classtime+"&rid="+roomid+"&weeks="+weeks, function (da) {
            if (da == null) {
                alert("根据系统时间和教学计划查找，本学期第"+weeks+"教学周，[" + classdate + "][" + week + "][" + classtime + "]节，在教室["+roomtitle+"]没有安排授课，请重新设置教室、日期、节次后（星期系统自动计算），再次点击对话框右上方的【查找教师授课信息>>】按钮！");
                return;
            }

            top.$("#txt_TrueName").val(da.TrueName);
            tchid = da.TeacherID;
            //通过下拉组合框，显示授课信息

            top.$("#txt_TeachCourseDetailID").val(da.CourseName);
            tcdid = da.TeachCourseDetailID;
            //显示班级信息
            top.$("#txt_Vclass").val(da.VClassDescription);
            ispid = da.InspectorID;
            $.ajaxSetup({ cache: true });
        });

    
    },
    bindedit: function () {
       
        top.$("#txt_InspectRoomID").combotree({
            url: '/sys/ashx/DicHandler.ashx?action=getdictree&categoryId=20',
            width: 120,
            valueField: 'id',
            textField: 'text',
            panelWidth: 180,
            lines: true
        });




    }
};

var CRUD = {

    add: function () {
        var hDialog = top.jQuery.hDialog({
            title: '添加', width: 700, height: 500, href: formurl, iconCls: 'icon-add',
            onLoad: function () {
                binddata.bindclear();
                top.$("#txt_InspectDate").datebox({
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
                        top.$("#txt_InspectDay").combobox("setValue", week1);
                        var currentweeks = parseInt(Math.abs(date - ctstart) / 1000 / 60 / 60 / 24 / 7) + 1;
                        top.$("#txt_InspectWeeks").combobox("setValue", currentweeks);
                    }

                });
                top.$("#A1").click(binddata.bindsearch);
                binddata.bindadd();
            },
            submit: function () {
                if (tcdid == 0)
                {
                    alert("您还没有根据地点和日期、节次信息查找到教师授课信息，系统无法为您提交保存！请检查。");
                    return;
                }
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
                title: '编辑', width: 700, height: 500, href: formurl, iconCls: 'icon-save',
                onLoad: function () {
                    binddata.bindedit();
                    ispid = row.InspectorID;
                    top.$('#txt_TrueName').val(row.TrueName);
                    tchid = row.TeacherID;
                    tcdid = row.TeachCourseDetailID;
			top.$('#txt_TeachCourseDetailID').val(row.CourseName);
			top.$('#txt_InspectDate').datebox("setValue",row.InspectDate.substr(0,10));
			top.$('#txt_InspectTime').combobox("setValue", row.InspectTime);
			top.$('#txt_InspectRoomID').combotree("setValue", row.InspectRoomID);
			
			top.$('#txt_InspectChange').val(row.InspectChange);
			top.$('#txt_InspectLog').val(row.InspectLog);
			top.$('#txt_InspectAppraise').val(row.InspectAppraise);
			top.$('#txt_InspectCD').combobox("setValue", row.InspectCD);
			top.$('#txt_InspectZT').combobox("setValue", row.InspectZT);
			top.$('#txt_InspectKK').combobox("setValue", row.InspectKK);
			top.$('#txt_Remark').val(row.Remark);
			top.$('#txt_InspectWeeks').combobox("setValue", row.InspectWeeks);
			top.$('#txt_InspectDay').combobox("setValue", row.InspectDay);
			top.$("#txt_Vclass").val(row.VClassDescription);
			            },
                submit: function () {
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

