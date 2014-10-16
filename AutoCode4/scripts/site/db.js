/* File Created: 二月 24, 2012 */

$(function () {
    DB.InitDbTree();
    $(window).resize(DB.reSetGridHeight);
    $('#btnTemplate').click(Template.show);
    Template.initDropDownList();
    $('#btnBuildCode').click(BuildCode).attr("disabled", true);

})
var DIV_PATHINFO = '<DIV class="sqlpath"><div style="float:left;"  id="pathinfo"></div>  </DIV>'
var GRID = '<div id="scrollDiv" style="padding:2px; overflow:auto;"><table id="grid"></table></div>';

var DB = {
    InitDbTree: function () {
        $('#dbtree').tree({
            url: 'ashx/dbhandler.ashx',
            onBeforeLoad: function (node, param) {
                if (node && node.attributes) {
                    $.extend(param, { "nodetype": node.attributes.NodeType });
                    //alert(param.nodetype + '==' + param.id);
                }
            },
            onClick: function (node) {
                var attr = node.attributes;
                addTab(GRID, '', node);

                if ($('#tabs').tabs('exists', '查询分析器')) {
                    $('#dbinfo').html('当前数据库为：' + node.dbname);
                }
            },
            onLoadError: function () {
                $.messager.alert('系统提示', '连接已断开，请重新连接。', 'error', function () {
                    location.href = '/login.html';
                });
            }
        });
    },
    InitTable: function (dbname) {
        $('#grid').datagrid({
            title: sql_server + " / " + dbname,
            url: 'ashx/dbhandler.ashx?nodetype=0&id=' + dbname + '&isgrid=1',
            idField: "text",
            pagination: true,
            rownumbers: true,
            pageNumber: 1,
            pageSize: 20,
            pageList: [10, 20, 30, 50],
            columns: [[
                { field: 'text', title: '表名', width: 200 },
                { field: 'Owner', title: '架构', width: 100 },
                { field: 'CreateDate', title: '创建日期', width: 160 }
            ]]

        });

        DB.reSetGridHeight();
    },
    InitColumns: function (tablename, dbname) {
        $('#grid').datagrid({
            title: sql_server + " / " + dbname + " / " + tablename,
            url: 'ashx/dbhandler.ashx?nodetype=1&id=' + dbname + '&isgrid=1&tablename=' + tablename,
            idField: "text",
            pagination: true,
            rownumbers: true,
            pageNumber: 1,
            pageSize: 50,
            pageList: [50, 30, 100],
            columns: [[
                { field: 'Key', title: 'key', width: 30, formatter: function (v, d, i) { if (v) return "<b>√</b>" }, align: 'center' },
                { field: 'Identity', title: '标识', width: 30, formatter: function (v, d, i) { if (v) return "<b>√</b>" }, align: 'center' },
                { field: 'text', title: '列名', width: 160 },
                { field: 'DataType', title: '数据类型', width: 140, formatter: function (v, d, i) { return v + ' (' + d.Size + ')' } },
                { field: 'Default', title: '默认值', width: 140 },
                { field: 'Nulls', title: 'Nulls', width: 40, formatter: function (v, d, i) { if (v) return "<b>√</b>" }, align: 'center' }
                
            ]],
            onLoadSuccess: function (data) {
                //初始化字段参数
                var cn = "";
                field = '{"search":true,"field":"{0}","cn":"{1}","showhead":true}';
                var rows = data.rows;
                $.each(rows, function (i, n) {
                    var _field = String.format(field, n.text, n.text);
                    cn += _field + ',';
                });

                cn = cn.substr(0, cn.length - 1);
                $('#txtcnfield').val('[' + cn + ']');
            }
        });

        DB.reSetGridHeight();

        
    },
    reSetGridHeight: function () {
        $('#grid').datagrid('resize', { height: $(window).height() - 110 });
    }

}

var Template = {
    url: 'ashx/templatehandler.ashx',
    initDropDownList: function () {
        $('#ddlTemplate').combobox({
            url: Template.url + '?action=templatelist',
            valueField: 'text',
            textField: 'text',
            width: 140,
            editabled: false
        });
    },
    initTemplateList: function () {
        $.ajaxjson(Template.url, 'action=templatelist', function (d) {
            $('#template_list').empty();
            $.each(d, function (i, n) {
                $('#template_list').append('<li><div>' + n.text + '</div></li>');
            });

            $('#template_list li').hover(function () {
                $(this).addClass('hover');
            }, function () {
                $(this).removeClass();
            }).dblclick(function () {
                var t_name = $(this).text();
                //alert(t_name);
                Template.file.Show(t_name);
            })
        });
    },
    show: function () {
        $('#d').dialog({
            width: 800, height: 600,
            title: '代码模板',
            content: '<ul id="template_list"></ul>',
            modal: true,
            toolbar: [{
                text: '新建',
                iconCls: 'icon-add',
                handler: function () {
                    Template.addNew();
                }
            }]
        });

        Template.initTemplateList();
    },
    addNew: function () {
        $('#w').hWindow({
            width: 300, height: 200,
            title: '新建模板',
            html: '<p>模板名称：<input type="text" id="txtTemplateName" class="txt" /></p>',
            submit: function () {
                var t = $('#txtTemplateName').val();
                if (t == '') {
                    alert('请输入模板名称。');
                    $('#txtTemplateName').focus();
                    return false;
                } else {
                    $.ajaxjson(Template.url, 'action=newTemplate&templatename=' + escape(t), function (msg) {
                        Template.initTemplateList();
                        $('#w').window('close');
                        Template.initDropDownList();
                    });
                }
            }
        });
    },
    file: {
        intilist: function (templateName) {
            $.ajaxjson(Template.url, 'action=filelist&templateName=' + escape(templateName), function (d) {
                $('#template_file_list').empty();
                $.each(d, function (i, n) {
                    $('#template_file_list').append('<li><a href="javascript:;" rel="' + templateName + '">' + n + '</a></li>');
                });
                $('#template_file_list a').click(function () {
                    Template.file.edit(templateName, $(this).text());
                })
            })
        },
        Show: function (templateName) {
            $('#t').dialog({
                width: 500, height: 400,
                title: '代码模板文件列表',
                content: '<div style="padding:10px;"><ul id="template_file_list" class="file"></ul></div>',
                modal: true,
                toolbar: [{
                    text: '新建',
                    iconCls: 'icon-add',
                    handler: function () {
                        Template.file.edit(templateName);
                    }
                }]
            });
            Template.file.intilist(templateName);
        },
        edit: function (templateName, filename) {
            $('#tt').hWindow({
                html: '<form id="codeform"><p>文件名称：<input type="text" id="filename" name="filename" /></p><p>模板内容：<br><textarea id="txttemplate_content" name="content" style="width:800px;" ></textarea></p></form>',
                title: '编辑模板', max: true,
                submit: function () {
                    editor.toTextArea();
                    var query = $('#codeform').serialize() + '&action=editfile&templateName=' + escape(templateName);
                    $.ajaxjson(Template.url, query, function (d) {
                        alert('恭喜，提交成功。');
                        $('#tt').window('close');
                        Template.file.intilist(templateName);
                    })
                }
            });
            var editor = Template.file.initCodeEditor();
            if (filename) {
                $('#filename').val(filename);
                $.get(Template.url, 'action=file&templateName=' + escape(templateName) + '&filename=' + filename + '&n=' + new Date().getTime(), function (msg) {
                    editor.setValue(msg);
                    //$('#txttemplate_content').val(msg);
                });
            }

        },
        initCodeEditor: function () {
            var editor = CodeMirror.fromTextArea(top.document.getElementById("txttemplate_content"), {
                mode: "application/xml",
                lineNumbers: true,
                //theme: 'eclipse',
                indentWithTabs:true,
                tabSize:8,
                onKeyEvent: function (i, e) {
                    // Hook into F11
                    if ((e.keyCode == 122 || e.keyCode == 27) && e.type == 'keydown') {
                        e.stop();
                        return toggleFullscreenEditing(editor);
                    }
                },
                onCursorActivity: function () {
                    editor.setLineClass(hlLine, null);
                    hlLine = editor.setLineClass(editor.getCursor().line, "activeline");
                }

            });
            var hlLine = editor.setLineClass(0, "activeline");

            return editor;
        }
    }
}


function BuildCode() {

    //1:获取所有模板文件
    //2:遍历模板文件
    var h = '<div fit=true id="layout_coll" border=false style="height:350px;padding:2px;width:500px">';
    h += '  <div border=false region=north style="height:40px;padding:0px 10px; background-color:#EFEFEF;" >';
    h += '      <span style="float:right;margin-top:2px;"><button id="btnStart" class="sexybutton sexyorange"><span><span><span class="play">开始生成</span></span></span></button></span>';
    h += '      <div class="progress full progress-green" id="progressbar" value="1"><span style="width: 0%; display: block;"><b style="display: inline;">0%</b></span></div>';
    h += '  </div>';
    h += '  <div border=false region=center style="background:#FEF8CC;color:#C80000;padding:5px;" ><ul id="build_detail_info" ></ul></div>';
    h += '  <div border=false region=south style="height:30px; overflow:hidden; line-height:30px; background:#F1EDED; padding-left:10px;">';
    h += '      <b>状态：</b><span id="fn"></span>';
    h += '  </div>';
    h += '</div>';

    var tempateName = $('#ddlTemplate').combobox('getValue');

    $.getJSON(Template.url, 'action=filelist&templateName=' + escape(tempateName), function (d) {

        $('#d').dialog({
            content: h,
            width: 530,
            height: 400,
            title: '生成代码',
            modal: true,
            toolbar:null
        });

        $('#layout_coll').layout();
        $('#btnStart').click(function () {
            $(this).attr('disabled', 'disabled');
            $('#fn').text(' 数据正在初始化，请稍候...');
            $('#build_detail_info').empty().append('<li>数据正在初始化...</li>')
            BuildStart(d);
            
        });
    })
}


function BuildStart(rows) {
    if (rows) {
        var len = rows.length;
        //top.progress('#progressbar', 5, len);

        //第2步:组织数据
        var fn_arr = [];
        CreateRequest(fn_arr, rows);

        $('#build_detail_info').append('<li>数据初始化已完成。  共生成 ' + (len) + ' 个文件.</li>');

        $(document).queue('ajax_article', fn_arr);
        var _takeOne = function () {
            $('#build_detail_info').append('<li>正在生成第 1 个模板文件.</li>');
            $(document).dequeue('ajax_article');
        };

        $('#fn').text(' 正在生成中，请稍候...');
        _takeOne();
    }
    else {
        alert("请先选中要生成的数据表。");
        $('#btnStart').attr('disabled', false);
    }
}


function CreateRequest(arrfn, files) {
    var dt = $('body').data('dt');
    var tempateName = $('#ddlTemplate').combobox('getValue');
    var opts = '&templateName=' + escape(tempateName) 
            + '&opts={"floder":"' + $('#txtfloder').val()
            +'","namespaces":"' + $("#txtnamespace").val()
            + '","dbname":"' + dt.dbname + '","tablename":"' + dt.tablename
            + '","modelname":"' + $("#txtmodelname").val()
            + '","ashxpath":"' + $("#txtashxpath").val()
            + '","dalname":"' + $('#txtdalname').val()
            + '","modelsuffix":"' + $('#txtmodelsuffix').val()
            + '","dalsuffix":"' + $('#txtdalsuffix').val()
            + '","rules":' + $('#txtcnfield').val()
            + ',"tableDesc":"' + $('#txtDescription').val()
            + '","bllname":"' + $('#txtBllname').val()
            + '","bllsuffix":"' + $('#txtbllsuffix').val()
            + '","htmlname":"' + $('#txtHtmlName').val()
            + '","jsname":"' + $('#txtJsName').val()
            + '","aspxname":"' + $('#txtAspxName').val()
            + '","ws":"' + $('#txtWebNamespace').val()
            + '"}';


    var len = files.length;
    $.each(files, function (i, n) {
        arrfn.push(
                function () {
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: Template.url,
                        data: 'action=build&filename=' + n + opts + '&t=' + new Date().getMilliseconds(),
                        success: function (data) {
                            progress('#progressbar', i + 1, len);
                            if (data.Success) {
                                $('#build_detail_info').append('<li style="color:blue"><b>' + n + ' 生成成功。</b></li>');
                                setTimeout(function () {
                                    $(document).dequeue('ajax_article');
                                }, 100);
                                var t = n.replace('.vm', '');
                                if (!$('#tabs').tabs('exists', t)) {
                                    $('#tabs').tabs('add', {
                                        title: t,
                                        content: '<div id="' + t + '" style="text-align:center;"><textarea rows=50 cols=10 style="width:98%; height:600px;"></textarea></div>', //
                                        closable: true
                                        
                                    });
                                }

                                $('#' + t + ' textarea').val(data.message).autoResize({ limit: 5000 }).change();

                            } else {
                                $('#build_detail_info').append('<li style="color:#000"><b>' + data.message + '</b></li>');
                                $(document).dequeue('ajax_article');
                            }


                            if ($(document).queue('ajax_article').length == 0) {
                                $('#fn').text('恭喜，全部生成成功。');
                                $('#btnStart').removeAttr('disabled');
                            }
                            else
                                $('#build_detail_info').append('<li>正在创建第 ' + (i + 2) + ' 个模板文件.</li>');

                        }
                    });
                }
           );
    });
}


function progress(el, val, max) {
    var duration = 1;
    var span = $(el).find("span");
    var b = $(el).find("b");
    var w = Math.round((val / max) * 100);
    $(b).fadeOut('fast');
    $(span).animate({
        width: w + '%'
    }, duration, function () {
        $(el).attr("value", val);
        $(b).text(w + '%').fadeIn('fast');
    });
}

function addTab(html, icon, node) {
    var tabs = $('#tabs').tabs('tabs');

    if (tabs.length > 1) {
        var _tabs = [];
        $.each(tabs, function (i, n) {
            var t = n.panel('options').title;
            _tabs.push(t);
        });

        $.each(_tabs, function (i, n) {
            if (n != '资源管理器' && n != "查询分析器") {
                if ($('#tabs').tabs('exists', n))
                    $('#tabs').tabs('close', n);
            }
        });

    }


    var curtab = $('#tabs').tabs("getTab", '资源管理器');

    $('#tabs').tabs('update', {
        tab: curtab, 
        options: {
            title: '资源管理器',
            content: html,
            iconCls: icon
        }
    });

    switch (node.attributes.NodeType) {
        case 0:
            DB.InitTable(node.id);
            $('#btnBuildCode').attr("disabled", true);
            $('.codeoptions input').attr("disabled", true);
            $('#w').data("dbname", node.id);

            break;
        case 1:
            var _dbname = node.attributes.dbname
            var _tablename = node.id;
            var codeName = FirstToUpper(_tablename);
            DB.InitColumns(_tablename, _dbname);

            $('body').data('dt', { dbname: _dbname, tablename: _tablename });
            //$('#w').data("dbname", id[1]);
            $('#btnBuildCode').attr("disabled", false);
            $('.codeoptions input').attr("disabled", false);
            //$("#txtnamespace").val(FirstToUpper(_dbname)+""); //命名空间
            $("#txtmodelname").val(codeName + "Model"); //实体
            $("#txtashxpath").val("ashx/" + codeName + "Handler.ashx");
            $('#txtdalname').val(codeName + "Dal"); //DAL
            $('#txtBllname').val(codeName + 'Bll'); //默认BLL 类名
            $('#txtHtmlName').val(codeName + '.html');
            $('#txtJsName').val(codeName + '.js');
            $('#txtAspxName').val(codeName + '.aspx');
            
            if ($('#tabs').tabs('exists', '查询分析器')) {
                $('#txtsql').val("select top 100 * from " + id[2]);
            }


            break;
        default:
            initDatabase();
            break;
    }
}


function FirstToUpper(v) {
    var arr = v.split('_');
    var _temp = '';
    for (var i = 0; i < arr.length; i++) {
        _temp += arr[i].charAt(0).toUpperCase() + arr[i].substr(1);
    }
    return _temp;
}

function toggleFullscreenEditing(editor) {
    var editorDiv = top.$('.CodeMirror-scroll');
    if (!editorDiv.hasClass('fullscreen')) {
        toggleFullscreenEditing.beforeFullscreen = { height: editorDiv.height(), width: editorDiv.width() }
        editorDiv.addClass('fullscreen');
        editorDiv.height('100%');
        editorDiv.width('100%');
        editor.refresh();
    }
    else {
        editorDiv.removeClass('fullscreen');
        editorDiv.height(toggleFullscreenEditing.beforeFullscreen.height);
        editorDiv.width(toggleFullscreenEditing.beforeFullscreen.width);
        editor.refresh();
    }
}



function setzhcnfield() {
    $('#w').hWindow({
        title: '数据库字段中文标识',
        html: '<table id="zhcn" border=1 width=98% class="gridgray"><tr><th><input checked type="checkbox" id="chksearch" style="vertical-align:middle"><label for="chksearch" style="vertical-align:middle">搜索</th><th>数据库字段</th><th>中文标识｜列表标题｜字段注释</th><th><input type="checkbox" id="chklist" style="vertical-align:middle" checked><label for="chklist" style="vertical-align:middle">列表</label></th></tr></table>',
        submit: function () {
            var cn = "";
            $('#zhcn tr:gt(0)').each(function (i, n) {
                field = '{"search":{0},"field":"{1}","cn":"{2}","showhead":{3}}';
                var searchfield = false;
                if ($(n).find(":checkbox").eq(0).is(":checked"))
                    searchfield = true;

                var ishead = false;
                if ($(n).find(":checkbox").eq(1).is(":checked"))
                    ishead = true;

                var tds = $(n).find('td');

                field = String.format(field, searchfield, tds.eq(1).html(), tds.eq(2).find('input').val(), ishead);
                cn += field + ',';
            });

            cn = cn.substr(0, cn.length - 1);
            $('#txtcnfield').val('[' + cn + ']');
            $('#w').window('close');
            return false;
        }
    });

    var data = $('#grid').datagrid('getData');
    var trs = '';
    if ($('#txtcnfield').val() != '') {
        $.each(data.rows, function (i, n) {
            trs += '<tr>';
            trs += '<td><input checked class="search" type="checkbox"></td><td>' + n.text + '</td><td><input class="txt" type="text" value='
        + findValue(n.text)
        + '></td><td><input class="list" checked type="checkbox" ></td></tr>';
        });
    } else {
        $.each(data.rows, function (i, n) {
            trs += '<tr>';
            trs += '<td><input checked class="search" type="checkbox"></td><td>' + n.text + '</td><td><input class="txt" type="text" value='
        + n.text
        + '></td><td><input class="list" checked type="checkbox" ></td></tr>';
        });
    }


    $('#zhcn').append(trs);

    $('#chksearch').click(function () {
        $('.search').attr("checked", $(this).is(":checked"));
    })
    $('#chklist').click(function () {
        $('.list').attr("checked", $(this).is(":checked"));
    })

    $('#zhcn :text').hotkey('keydown', { combi: 'tab' }, function (evt) {
        var index = $('#zhcn :text').index(this) + 1;
        $('#zhcn :text').eq(index).select();
        evt.stopPropagation();
        evt.preventDefault();
    }).hotkey('keydown', { combi: 'Shift+tab' }, function (e) {
        var index = $('#zhcn :text').index(this);
        if (index > 0) {
            $('#zhcn :text').eq(index - 1).select();
        }

        e.stopPropagation();
        e.preventDefault();
    });
}

function findValue(field) {
    if ($('#txtcnfield').val() != '') {
        var v = eval($('#txtcnfield').val());

        for (var i = 0; i < v.length; i++) {

            if (v[i]["field"] == field)
                return v[i]["cn"];
        }
    } else
        return field;
}