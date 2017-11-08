
$(function () {
   /** uEditor */
    var ue = UE.getEditor('editor', {
        initialFrameWidth: 800,
        initialFrameHeight: 270
    });
    UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
    UE.Editor.prototype.getActionUrl = function (action) {
        if (action == '/upload/uploadEditor') {
            return getBasePath() + '/upload/uploadEditor';
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
    };
  initData(id);
 /** 点击提交按钮 */
    $(".btn-tj").on("click", function () {
   		if (UE.getEditor('editor').getContentTxt() == "" && (UE.getEditor('editor').getContent().indexOf("img") == -1)) {    //正文
            $window.find("#jumpBox3").show().find(".pText").html("请填写正文");
            return;
        }
      
        if ($("#thelist").find("div").length == "0") {
            submit();
        } 
    });
});

/** 进入页面适配数据 */
function initData(id) {
    $.ajax({
        url: getBasePath() + "evaluate/selectEvaluate",
        type: "post",
        dataType: "json",
        data: {
            "id": id
        }
    }).done(function (data) {
        if (data.status == "0") {
           
            UE.getEditor('editor').addListener("ready", function () {
                // editor准备好之后才可以使用
                UE.getEditor('editor').execCommand('insertHtml', data.data.content); //正文
            });
        } else {
            $window.find("#jumpBox3").show().find(".pText").html("获取数据失败");
        }
    })
}

/** 提交或者保存参数 */
function submit() {
    var url = null;
    var params = {
        "title": $("#title").val().trim(),//标题
        "phaseId": $("#selectbox1 .selectbox_selected").data("id"),//学段Id
        "phase": $("#selectbox1 .selectbox_selected").html(),//学段name
        "subjectId": $("#selectbox2 .selectbox_selected").data("id"),//学科Id
        "subject": $("#selectbox2 .selectbox_selected").html(),//学科name
        "introduce": $("#introduce").val().trim(),//评比简介
        "contributeStartDate": $("#dates_start1").val(),//投稿时间-开始
        "contributeEndDate": $("#dates_end1").val(),//投稿时间-结束
        "scoreStartDate": $("#dates_start2").val(),//用户评分时间-开始
        "scoreEndDate": $("#dates_end2").val(),//用户评分时间-结束
        "cover": saveUrl,//上传封面文件的input的id (待定)
        "content": UE.getEditor('editor').getContent()//评比正文

    };
    if (id == null) {    //上传
        url = getBasePath() + "evaluate/saveEvaluate";
    } else {
        url = getBasePath() + "evaluate/updateEvaluate";
        params["id"] = id;
    }
    $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        data: params
    }).done(function (data) {
        if (data.status == "0") {
            $window.find("#jumpBox3").show().find(".pText").html("保存成功");
            window.location.href = "onlineAppraise.html?itemId="+ itemId;
        } else {
            $window.find("#jumpBox3").show().find(".pText").html("保存失败");
        }
    })
}    