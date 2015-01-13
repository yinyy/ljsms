var InvestigateOp = {
    actionURL: '/TM/ashx/TMInvestigateHandler.ashx',
    get: function (irng, iid, fn) {//获取调查问卷
        $.post(actionURL + '?d=' + (new Date()), { json: JSON.stringify({ keyId: iid, action: 'preview_teacher' }) }, function (json) {
            function createTagId(iid, itmid, cid) {
                if (itmid == null) {
                    return iid;
                } else if (cid == null) {
                    return iid + '_' + itmid;
                } else {
                    return iid + '_' + itmid + '_' + cid;
                }
            };

            var range = top.$('#' + irng);
            var investigateId = json.KeyId;
            
            $(json.Items).each(function (index, item) {
                var itemId = item.KeyId;
                var question = $('<div class="question"></div>');
                question.attr('investigateId', investigateId);
                question.attr('itemId', itemId);
                question.attr('kind', item.Kind);
                range.append(question);

                var title = $('<div class="question_title"></div>');
                title.text((index + 1) + '、' + item.Title);
                question.append(title);

                var choiceRange = $('<div class="question_choice_range"></div>');
                question.append(choiceRange);

                if (item.Kind == DIC.Investigate.ItemKind.Single ||
                    item.Kind == DIC.Investigate.ItemKind.Multiple ||
                    item.Kind == DIC.Investigate.ItemKind.Blank) {
                    var choices = $('<ul class="question_choices"></ul>');
                    choiceRange.append(choices);

                    $(item.Choices).each(function (index2, choice) {
                        var choiceId = choice.KeyId;
                        var li = $('<li></li>');
                        choices.append(li);

                        var opt = $('<input id="' + createTagId(investigateId, itemId, choiceId) + '" type="' + (item.Kind == DIC.Investigate.ItemKind.Single ? 'radio' : (item.Kind == DIC.Investigate.ItemKind.Multiple ? 'checkbox' : 'text')) + '"/>');
                        if (item.Kind == DIC.Investigate.ItemKind.Single ||
                                item.Kind == DIC.Investigate.ItemKind.Multiple) {
                            opt.val(choice.KeyId);
                        } else {
                            opt.attr('cid', choice.KeyId);
                        }
                        opt.attr('name', createTagId(investigateId, itemId, null));
                        li.append(opt);

                        if (item.Kind == DIC.Investigate.ItemKind.Single ||
                            item.Kind == DIC.Investigate.ItemKind.Multiple) {
                            var label = $('<label></label>');
                            label.attr('for', opt.attr('id'));
                            label.text(choice.Title);
                            li.append(label);

                            if (choice.HasOther) {
                                var blank = $('<input type="text"/>');
                                blank.click(function () {
                                    $(this).parent().children(':first').attr('checked', 'checked');
                                });
                                li.append(blank);
                            }
                        }
                    });
                } else if (item.Kind == DIC.Investigate.ItemKind.Matrix.Blank ||
                    item.Kind == DIC.Investigate.ItemKind.Matrix.Single ||
                    item.Kind == DIC.Investigate.ItemKind.Matrix.Multiple ||
                    item.Kind == DIC.Investigate.ItemKind.Matrix.MultiLine) {

                    var table = $('<table class="question_matrix_table" cellpadding="0" cellspacing="1"></table>');
                    choiceRange.append(table);

                    var colnames = item.Columns.split(',');

                    var tr = $('<tr></tr>');
                    table.append(tr);

                    var td = $('<td>&nbsp;</td>')
                    tr.append(td);

                    for (var i = 0; i < colnames.length; i++) {
                        td = $('<td></td>');
                        td.text(colnames[i]);

                        tr.append(td);
                    }

                    $(item.Choices).each(function (index3, choice) {
                        var choiceId = choice.KeyId;

                        tr = $('<tr></tr>');
                        tr.attr('keyId', choiceId);
                        table.append(tr);

                        td = $('<td></td>');
                        td.text(choice.Title);
                        tr.append(td);

                        for (var i = 0; i < colnames.length; i++) {
                            td = $('<td></td>');
                            var opt;

                            if (item.Kind == DIC.Investigate.ItemKind.Matrix.MultiLine) {
                                opt = $('<textarea id="' + createTagId(investigateId, itemId, choiceId) + '_' + (i + 1) + '" style="width:90%" rows="10"></textarea>');
                            } else if (item.Kind == DIC.Investigate.ItemKind.Matrix.Single ||
                                item.Kind == DIC.Investigate.ItemKind.Matrix.Multiple ||
                                item.Kind == DIC.Investigate.ItemKind.Matrix.Blank) {

                                opt = $('<input id="' + createTagId(investigateId, itemId, choiceId) + '_' + (i + 1) + '" type="' +
                                    (item.Kind == DIC.Investigate.ItemKind.Matrix.Single ? 'radio' : (item.Kind == DIC.Investigate.ItemKind.Matrix.Multiple ? 'checkbox' : 'text')) +
                                    '"/>');
                                if (item.Kind == DIC.Investigate.ItemKind.Matrix.Single) {//单选按钮
                                    opt.attr('name', createTagId(investigateId, itemId, choiceId));
                                }
                                opt.val('');
                            }

                            opt.attr('colindex', i + 1);

                            td.append(opt);
                            tr.append(td);
                        }
                    });
                }
            });

            if (fn != null) {
                fn();
            }
        }, 'json');
    },
    save: function (iid, tcid, fn) {//保存某学生、某授课的问卷信息
        var rows = [];
        //investigate.KeyId = iid;
        //investigate.TeachCourseId = tcid;
        //investigate.Items = [];

        top.$('DIV.question').each(function (index1, item) {
            var itemId = $(item).attr('itemId');
            var kind = $(item).attr('kind');

            //var itemObj = {
            //    KeyId: itemId,
            //    Choices: []
            //};
            //investigate.Items[investigate.Items.length] = itemObj;

            if (kind == DIC.Investigate.ItemKind.Single ||
                kind == DIC.Investigate.ItemKind.Multiple) {//单选多选
                $(item).find('DIV.question_choice_range > ul > li > :checked').each(function (index2, choice) {
                    //var choiceObj = {
                    //    KeyId: $(choice).val()
                    //};
                    //itemObj.Choices[itemObj.Choices.length] = choiceObj;

                    //if ($(choice).next(':text') != null) {
                    //    choiceObj.Other = $(choice).next().next().val();
                    //}
                    var row = { InvestigateId: iid, TeachCourseId: tcid, InvestigateItemId: itemId, InvestigateItemChoiceId: $(choice).val(), Other: '' };
                    if ($(choice).next(':text').length > 0) {
                        row.Other = $(choice).next().next().val();
                    }

                    rows[rows.length] = row;
                });
            } else if (kind == DIC.Investigate.ItemKind.Blank) {
                $(item).find('DIV.question_choice_range > ul > li > :text').each(function (index2, choice) {
                    //var choiceObj = {
                    //    KeyId: $(choice).val()
                    //};
                    //itemObj.Choices[itemObj.Choices.length] = choiceObj;

                    //choiceObj.Other = $(choice).val();

                    var row = { InvestigateId: iid, TeachCourseId: tcid, InvestigateItemId: itemId, InvestigateItemChoiceId: $(choice).attr('cid'), Other: $(choice).val() };

                    rows[rows.length] = row;
                });
            } else if (kind == DIC.Investigate.ItemKind.Matrix.Single ||
                kind == DIC.Investigate.ItemKind.Matrix.Multiple ||
                kind == DIC.Investigate.ItemKind.Matrix.MultiLine ||
                kind == DIC.Investigate.ItemKind.Matrix.Blank) {

                $(item).find('DIV.question_choice_range > table.question_matrix_table > tbody > tr:not(:first)').each(function (index3, tr) {
                    var choiceId = $(tr).attr('keyId');

                    if (kind == DIC.Investigate.ItemKind.Matrix.Single || kind == DIC.Investigate.ItemKind.Matrix.Multiple) {//单选或者多选
                        $(tr).children(':not(:first)').children(':checked').each(function (index4, inp) {
                            //var choiceObj = {
                            //    KeyId: choiceId,
                            //    Column: $(inp).attr('colindex')
                            //};
                            //itemObj.Choices[itemObj.Choices.length] = choiceObj;
                            var row = { InvestigateId: iid, TeachCourseId: tcid, InvestigateItemId: itemId, InvestigateItemChoiceId: choiceId, Column: $(inp).attr('colindex'), Other: '' };

                            rows[rows.length] = row;
                        });
                    } else if (kind == DIC.Investigate.ItemKind.Matrix.MultiLine || kind == DIC.Investigate.ItemKind.Matrix.Blank) {
                        $(tr).children(':not(:first)').children(':text, textarea').each(function (index4, inp) {
                            //var choiceObj = {
                            //    KeyId: choiceId,
                            //    Column: $(inp).attr('colindex'),
                            //    Other: kind == DIC.Investigate.ItemKind.Matrix.Blank ? $(inp).val() : $(inp).text()
                            //};
                            //itemObj.Choices[itemObj.Choices.length] = choiceObj;

                            var row = {
                                InvestigateId: iid,
                                TeachCourseId: tcid,
                                InvestigateItemId: itemId,
                                InvestigateItemChoiceId: choiceId,
                                Column: $(inp).attr('colindex'),
                                Other: kind == DIC.Investigate.ItemKind.Matrix.Blank ? $(inp).val() : $(inp).text()
                            };

                            rows[rows.length] = row;
                        });
                    }
                });
            }
        });

        $.post(actionURL, { json: JSON.stringify({keyId: 0, action: 'save_teacher'}), data: JSON.stringify(rows) }, function (data) {
            if (fn != null) {
                fn(data);
            }
        }, 'text');
    },
    show: function (iid, tcid, sid) {//显示某学生、某授课信息、的问卷信息
        //所有的INPUT只读
        top.$('div.question input').attr('readonly', true).attr('disabled', 'disabled');
        top.$('div.question textarea').attr('readonly', 'readonly').attr('disabled', 'disabled');


        $.post(actionURL, { json: JSON.stringify({ keyId: 0, action: 'show_teacher' }), investigateId: iid, studentId: sid, teachCourseId: tcid }, function (data) {
            $(data).each(function (index, d) {
                var id = d.InvestigateId + '_' + d.ItemId + '_' + d.ChoiceId;
                if (d.Column > 0) {
                    id = id + '_' + d.Column;
                }

                var inp = top.$('#' + id);
                if ($(inp).attr('type') == 'radio' || $(inp).attr('type') == 'checkbox') {
                    $(inp).attr('checked', 'checked');
                } else if ($(inp).attr('type') == 'text') {
                    $(inp).val(d.Other);
                } else {
                    $(inp).text(d.Other);
                }
            });
        }, 'json');
    },
    get2: function (irng, investigateId, fn) {//获取第二种类型的问卷
        $.post(actionURL + '?d=' + (new Date()), { json: JSON.stringify({ keyId: 0, action: 'preview_course' }) }, function (json) {
            function createTagId(tcid, col){
                return 'tt' + tcid + '_' + col;
            };

            var range = top.$('#' + irng);
            var table = $(range).children(':first');

            $(json).each(function (index, item) {
                var tr = $('<tr></tr>');
                table.append(tr);
                tr.attr('tcid', item.TeachCourseId);

                var td = $('<td></td>');
                tr.append(td);
                td.text(item.CourseName);

                td = $('<td></td>')
                tr.append(td);
                var tt = $('<textarea id="'+ createTagId(item.TeachCourseId, 1)+'" style="width:90%" rows="10"></textarea>');
                td.append(tt);
                tt.attr('col', 1);
                    
                td = $('<td></td>')
                tr.append(td);
                tt = $('<textarea id="' + createTagId(item.TeachCourseId, 2) + '" style="width:90%" rows="10"></textarea>');
                tt.attr('col', 2);
                td.append(tt);
            });

            if (fn != null) {
                fn();
            }
        }, 'json');
    },
    save2: function (iid, fn) {//保存某学生问卷信息
        var rows = [];

        top.$('table.question tr:not(:first)').each(function (index1, item) {            
            var row = { InvestigateId: iid, TeachCourseId: $(item).attr('tcid') };
            $(item).children().children('textarea').each(function (index2, tt) {
                if ($(tt).attr('col') == 1) {
                    row['Col1'] = $(tt).val();
                } else if ($(tt).attr('col') == 2) {
                    row['Col2'] = $(tt).val();
                }
            });
            rows[rows.length] = row;
        });

        $.post(actionURL, { json: JSON.stringify({ keyId: 0, action: 'save_course' }), data: JSON.stringify(rows) }, function (data) {
            if (fn != null) {
                fn(data);
            }
        }, 'text');
    },
    show2: function (iid, sid) {//显示某学生的问卷信息
        //所有的INPUT只读
        top.$('table.question textarea').attr('readonly', 'readonly');

        $.post(actionURL, { json: JSON.stringify({ keyId: 0, action: 'show_course' }), investigateId: iid, studentId: sid }, function (data) {
            $(data).each(function (index, d) {
                var id = 'tt' + d.TeachCourseId + '_';

                top.$('#' + id + '1').html(d.Col1);
                top.$('#' + id + '2').html(d.Col2);
            });
        }, 'json');
    }
}