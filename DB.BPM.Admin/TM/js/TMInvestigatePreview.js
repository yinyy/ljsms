var actionURL = '/TM/ashx/TMInvestigateHandler.ashx';
var investigateId;

$(function () {
    //普通方式
    $(document.location.search.substring(1).split('&')).each(function (index, p) {
        if (p.indexOf('investigateId=') != -1) {
            investigateId = p.substring(14);
        }
    });
    //弹出窗口方式
    //investigateId = window.dialogArguments.investigateId;

    InvestigateOp.get('investigate_range', investigateId);
    
    ////ajax调用问卷信息
    //$.post(actionURL + '?d=' + (new Date()), { json: JSON.stringify({ keyId: investigateId, action: 'preview' }) }, function (json) {
    //    function createTagId(iid, itmid, cid) {
    //        if (itmid == null) {
    //            return iid;
    //        } else if (cid == null) {
    //            return iid + '_' + itmid;
    //        } else {
    //            return iid + '_' + itmid + '_' + cid;
    //        }
    //    };

    //    var range = $('#investigate_range');
    //    var investigateId = json.KeyId;

    //    $(json.Items).each(function (index, item) {
    //        var itemId = item.KeyId;
    //        var question = $('<div class="question"></div>');
    //        question.attr('investigateId', investigateId);
    //        question.attr('itemId', itemId);
    //        question.attr('kind', item.Kind);
    //        range.append(question);

    //        var title = $('<div class="question_title"></div>');
    //        title.text((index + 1) + '、' + item.Title);
    //        question.append(title);

    //        var choiceRange = $('<div class="question_choice_range"></div>');
    //        question.append(choiceRange);

    //        if (item.Kind == DIC.Investigate.ItemKind.Single ||
    //            item.Kind == DIC.Investigate.ItemKind.Multiple ||
    //            item.Kind == DIC.Investigate.ItemKind.Blank) {
    //            var choices = $('<ul class="question_choices"></ul>');
    //            choiceRange.append(choices);

    //            $(item.Choices).each(function (index2, choice) {
    //                var choiceId = choice.KeyId;
    //                var li = $('<li></li>');
    //                choices.append(li);

    //                var opt = $('<input id="' + createTagId(investigateId, itemId, choiceId) + '" type="' + (item.Kind == DIC.Investigate.ItemKind.Single ? 'radio' : (item.Kind == DIC.Investigate.ItemKind.Multiple ? 'checkbox' : 'text')) + '"/>');
    //                opt.val(choice.KeyId);
    //                opt.attr('name', createTagId(investigateId, itemId, null));
    //                li.append(opt);

    //                if (item.Kind == DIC.Investigate.ItemKind.Single ||
    //                    item.Kind == DIC.Investigate.ItemKind.Multiple) {
    //                    var label = $('<label></label>');
    //                    label.attr('for', opt.attr('id'));
    //                    label.text(choice.Title);
    //                    li.append(label);

    //                    if (choice.HasOther) {
    //                        var blank = $('<input type="text"/>');
    //                        blank.click(function () {
    //                            $(this).parent().children(':first').attr('checked', 'checked');
    //                        });
    //                        li.append(blank);
    //                    }
    //                }
    //            });
    //        } else if (item.Kind == DIC.Investigate.ItemKind.Matrix.Blank ||
    //            item.Kind == DIC.Investigate.ItemKind.Matrix.Single ||
    //            item.Kind == DIC.Investigate.ItemKind.Matrix.Multiple ||
    //            item.Kind == DIC.Investigate.ItemKind.Matrix.MultiLine) {

    //            var table = $('<table class="question_matrix_table" cellpadding="0" cellspacing="1"></table>');
    //            choiceRange.append(table);

    //            var colnames = item.Columns.split(',');

    //            var tr = $('<tr></tr>');
    //            table.append(tr);

    //            var td = $('<td>&nbsp;</td>')
    //            tr.append(td);

    //            for (var i = 0; i < colnames.length; i++) {
    //                td = $('<td></td>');
    //                td.text(colnames[i]);

    //                tr.append(td);
    //            }

    //            $(item.Choices).each(function (index3, choice) {
    //                var choiceId = choice.KeyId;

    //                tr = $('<tr></tr>');
    //                tr.attr('keyId', choiceId);
    //                table.append(tr);

    //                td = $('<td></td>');
    //                td.text(choice.Title);
    //                tr.append(td);

    //                for (var i = 0; i < colnames.length; i++) {
    //                    td = $('<td></td>');
    //                    var opt;

    //                    if (item.Kind == DIC.Investigate.ItemKind.Matrix.MultiLine) {
    //                        opt = $('<textarea id="' + createTagId(investigateId, itemId, choiceId) + '_' + (i + 1) + '" style="width:90%" rows="10"></textarea>');
    //                    } else if (item.Kind == DIC.Investigate.ItemKind.Matrix.Single ||
    //                        item.Kind == DIC.Investigate.ItemKind.Matrix.Multiple ||
    //                        item.Kind == DIC.Investigate.ItemKind.Matrix.Blank) {

    //                        opt = $('<input id="' + createTagId(investigateId, itemId, choiceId) + '_' + (i + 1) + '" type="' +
    //                            (item.Kind == DIC.Investigate.ItemKind.Matrix.Single ? 'radio' : (item.Kind == DIC.Investigate.ItemKind.Matrix.Multiple ? 'checkbox' : 'text')) +
    //                            '"/>');
    //                        if (item.Kind == DIC.Investigate.ItemKind.Matrix.Single) {//单选按钮
    //                            opt.attr('name', createTagId(investigateId, itemId, choiceId));
    //                        }
    //                        opt.val('');
    //                    }

    //                    opt.attr('colindex', i + 1);

    //                    td.append(opt);
    //                    tr.append(td);
    //                }
    //            });
    //        }
    //    });
    //}, 'json');
});