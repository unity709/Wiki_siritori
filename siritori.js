//"use strict";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./serviceWorker.js')
     .then(
     function (registration) {
         if (typeof registration.update == 'function') {
             registration.update();
         }
     })
     .catch(function (error) {
       console.log("Error Log: " + error);
     });
   }

   if(navigator.onLine){
    //オンライン
    }else{
    //オフライン
    const reload=confirm("インターネットに接続してください\n再読み込みしますか？");
    if(reload){
        location.reload(true);
    }else{
        window.addEventListener("online",(e)=>{
            location.reload(true)
        })
        alert("インターネットにつながないとしりとりはできません。");
    }
    }
    window.addEventListener("offline",(e)=>{
 //オフライン
 const reload=confirm("インターネットに接続してください\n再読み込みしますか？");
 if(reload){
     location.reload(true);
 }else{
     window.addEventListener("online",(e)=>{
         location.reload(true)
     })
     alert("インターネットにつながないとしりとりはできません。");
 }
    })
var msg = new SpeechSynthesisUtterance();
//msg.lang = 'ja-JP'; //言語
var words = [];
var Word_history = [];
var cpu_word = "";
var next_word = "り";
var Iswork = false;
//音声認識の準備
const obj = document.getElementById("chat-box");
SpeechRecognition = window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition ||
    window.SpeechRecognition
var speech;
if (SpeechRecognition !== undefined) {
    // ユーザのブラウザは音声合成に対応しています。
    speech = new SpeechRecognition();
    speech.lang = "ja-JP";
    speech.interimResults = true;
    $("#btn").click(function () {
        // 音声認識をスタート
        if (!Iswork) {
            Iswork = true;
            $("#btn").prop("disabled", true);
            $("#submit").prop("disabled", true);
            $("#btn_text").text("マイクで録音中");
            $("#btn").css('background-color', '#ff0000');
            speech.start();
        } else { return; }
    });
    speech.onnomatch = function () {
        console.log("認識できませんでした");
        say("認識できませんでした", $("#chat-box"))
        obj.scrollTop = obj.scrollHeight;
        $("#btn").prop("disabled", false);
        $("#btn_text").text("マイク");
        $("#submit").prop("disabled", false);
        $("#submit_text").text("送信");
        $("#btn").css('background-color', '#00bcd4');
        $("#submit").css('background-color', '#00bcd4');
        Iswork = false;
        $("#text").val("");
        $('#text').attr('readonly', false);
    };
    speech.onerror = function () {
        console.log("認識できませんでした");
        say("認識できませんでした", $("#chat-box"))
        obj.scrollTop = obj.scrollHeight;
        $("#btn").prop("disabled", false);
        $("#btn_text").text("マイク");
        $("#submit").prop("disabled", false);
        $("#submit_text").text("送信");
        $("#btn").css('background-color', '#00bcd4');
        $("#submit").css('background-color', '#00bcd4');
        Iswork = false;
        $("#text").val("");
        $('#text').attr('readonly', false);
    };
    //音声自動文字起こし機能
    speech.onresult = function (e) {
        if (!e.results[0].isFinal) {
            var speechtext = e.results[0][0].transcript
            console.log(speechtext)
            $('#text').attr('readonly', true);
            $("#text").val(speechtext);
            return;
        }

        $("#btn_text").text("処理中");
        $("#submit_text").text("処理中");
        $("#submit").css('background-color', '#999999');
        $("#btn").css('background-color', '#999999');
        console.log("リザルト")
        speech.stop();

        if (e.results[0].isFinal) {
            console.log("聞き取り成功！")
            var autotext = e.results[0][0].transcript
            console.log(e);
            console.log(autotext);//autotextが結果
            $("#text").val(autotext);
            //ここから返答処理
            $("#chat-box").html($("#chat-box").html() + "<div class=\"kaiwa\"><!–右からの吹き出し–><figure class=\"kaiwa-img-right\"><img src=\"./icons/human_icon.png\" alt=\"no-img2\"><figcaption class=\"kaiwa-img-description\">あなた</figcaption></figure><div class=\"kaiwa-text-left\"><p class=\"kaiwa-text\">「" + autotext + "」</p></div></div><!–右からの吹き出し 終了–>");
            obj.scrollTop = obj.scrollHeight;
            //処理が終わったら考え中の文字を削除し、結果を入れる
            if (next_word != str_chenge(autotext, 1)[0]) {
                say("「" + next_word + "」から言葉を始めてね！", $("#chat-box"));
                obj.scrollTop = obj.scrollHeight;
                $("#text").val("");
                $("#btn").prop("disabled", false);
                $("#submit").prop("disabled", false);
                $("#btn_text").text("マイク");
                $("#submit_text").text("送信");
                $("#btn").css('background-color', '#00bcd4');
                $("#submit").css('background-color', '#00bcd4');
                Iswork = false;
                $("#text").val("");
                $('#text').attr('readonly', false);
                return;
            } else if (Word_history.indexOf(autotext) != -1) {
                say("「" + autotext + "」は、もう使われた言葉だよ！", $("#chat-box"));
                obj.scrollTop = obj.scrollHeight;
                $("#text").val("");
                $("#btn").prop("disabled", false);
                $("#submit").prop("disabled", false);
                $("#btn_text").text("マイク");
                $("#submit_text").text("送信");
                $("#btn").css('background-color', '#00bcd4');
                $("#submit").css('background-color', '#00bcd4');
                Iswork = false;
                $("#text").val("");
                $('#text').attr('readonly', false);
                return;
            } else {
                Word_history.push(autotext);
                siritori(autotext).then(function (value) {
                    // 非同期処理成功
                    console.log(value);
                    $("#text").attr("placeholder", "「" + str_chenge(value, -1)[0] + "」から始まる言葉");
                    next_word = str_chenge(value, -1)[0]
                    say("「" + value + "」", $("#chat-box"));
                    Word_history.push(value);
                    obj.scrollTop = obj.scrollHeight;
                    msg.text = value; speechSynthesis.speak(msg);
                    console.log("処理終了")
                    $("#btn").prop("disabled", false);
                    $("#btn").css('background-color', '#00bcd4');
                    $("#submit").css('background-color', '#00bcd4');
                    $("#btn_text").text("マイク");
                    $("#submit").prop("disabled", false);
                    $("#submi_text").text("送信");
                    Iswork = false;
                    $("#text").val("");
                    $('#text').attr('readonly', false);
                }).catch(function (error) {
                    // 非同期処理失敗。呼ばれない
                    console.log(error);
                    say("エラー：" + error, $("#chat-box"))
                    obj.scrollTop = obj.scrollHeight;
                    $("#btn").prop("disabled", false);
                    $("#btn").css('background-color', '#00bcd4');
                    $("#submit").css('background-color', '#00bcd4');
                    $("#btn_text").text("マイク");
                    $("#submit").prop("disabled", false);
                    $("#submit_text").text("送信");
                    Iswork = false;
                    $("#text").val("");
                    $('#text').attr('readonly', false);
                });
            }
        }
    }
} else {
    alert("このブラウザは音声認識に対応していません")
    $("#btn").hide();
}
//speech.continuous = true;
//使用する変数を用意
var $ta = $("#text");

$(document).on("keypress", "#text", function(e) {
  if (e.keyCode == 13) { // Enterが押された
    if (e.shiftKey) { // Shiftキーも押された
      $.noop();
    } else if ($ta.val().replace(/\s/g, "").length > 0) {
      e.preventDefault();
      if($("#submit_text").text!="処理中"){
        submit()
      }
      
    }
  } else {
    $.noop();
  }
});
function submit () {
    $("#submit").css('background-color', '#999999');
    $("#btn").css('background-color', '#999999');
    var text = $("#text").val();
    if (text == "") {
        $("#btn").prop("disabled", false);
        $("#submit").prop("disabled", false);
        $("#btn_text").text("マイク");
        $("#submit_text").text("送信");
        $("#btn").css('background-color', '#00bcd4');
        $("#submit").css('background-color', '#00bcd4');
        return; //何もないなら関数を終了させる
    }
    $("#btn").prop("disabled", true);
    $("#btn_text").text("処理中");
    $("#submit").prop("disabled", true);
    $("#submit_text").text("処理中");
    console.log("リザルト")
    console.log(text);//textが結果
    //ここから返答処理
    $("#chat-box").html($("#chat-box").html() + "<div class=\"kaiwa\"><!–右からの吹き出し–><figure class=\"kaiwa-img-right\"><img src=\"./icons/human_icon.png\" alt=\"no-img2\"><figcaption class=\"kaiwa-img-description\">あなた</figcaption></figure><div class=\"kaiwa-text-left\"><p class=\"kaiwa-text\">「" + text + "」</p></div></div><!–右からの吹き出し 終了–>");
    obj.scrollTop = obj.scrollHeight;
    //処理が終わったら考え中の文字を削除し、結果を入れる
    if (next_word != str_chenge(text, 1)[0]) {
        say("「" + next_word + "」から言葉を始めてね！", $("#chat-box"));
        obj.scrollTop = obj.scrollHeight;
        $("#text").val("");
        $("#btn").prop("disabled", false);
        $("#submit").prop("disabled", false);
        $("#btn_text").text("マイク");
        $("#submit_text").text("送信");
        $("#btn").css('background-color', '#00bcd4');
        $("#submit").css('background-color', '#00bcd4');
        return;
    } else if (Word_history.indexOf(text) != -1) {
        say("「" + text + "」は、もう使われた言葉だよ！", $("#chat-box"));
        obj.scrollTop = obj.scrollHeight;
        $("#text").val("");
        $("#btn").prop("disabled", false);
        $("#submit").prop("disabled", false);
        $("#btn_text").text("マイク");
        $("#submit_text").text("送信");
        $("#btn").css('background-color', '#00bcd4');
        $("#submit").css('background-color', '#00bcd4');
        return;
    } else {
        Word_history.push(text);
        siritori(text).then(function (value) {
            // 非同期処理成功
            console.log(value);
            $("#text").attr("placeholder", "「" + str_chenge(value, -1)[0] + "」から始まる言葉");
            next_word = str_chenge(value, -1)[0]
            say("「" + value + "」", $("#chat-box"))
            Word_history.push(value);
            obj.scrollTop = obj.scrollHeight;
            msg.text = value;
            speechSynthesis.speak(msg);
            console.log("処理終了");
            $("#text").val("");
            $("#submit").prop("disabled", false);
            $("#btn").prop("disabled", false);
            $("#btn_text").text("マイク");
            $("#submit_text").text("送信");
            $("#btn").css('background-color', '#00bcd4');
            $("#submit").css('background-color', '#00bcd4');
        }).catch(function (error) {
            // 非同期処理失敗。呼ばれない
            console.log(error);
            say("エラーが起きました", $("#chat-box"))
            $("#text").val("");
            $("#btn").prop("disabled", false);
            $("#submit").prop("disabled", false);
            $("#btn_text").text("マイク");
            $("#submit_text").text("送信");
            $("#btn").css('background-color', '#00bcd4');
            $("#submit").css('background-color', '#00bcd4');
        });
    }
}
$("#submit").click(submit)
function siritori(user_msg) {
    return new Promise(function (resolve, reject) {
        words = [];
        var chenges = str_chenge(user_msg, -1)
        var taskA = new Promise(function (resolve, reject) {
            WikipediaAPI(chenges[0], resolve);
        });
        var taskB = new Promise(function (resolve, reject) {
            WikipediaAPI(chenges[1], resolve);
        });
        Promise.all([taskA, taskB]).then(function () {
            console.log(words);
            cpu_word = words[Math.floor(Math.random() * words.length)]        
            
            if(str_chenge(cpu_word,-1)[0]=="ん"){
                do{
                    words.splice(words.indexOf(cpu_word),words.indexOf(cpu_word))
                    cpu_word = words[Math.floor(Math.random() * words.length)]
                }while(str_chenge(cpu_word,-1)[0]=="ん")
                resolve(cpu_word);
                     
            }else{
                resolve(cpu_word);
            }

            
        })
    });
}
function WikipediaAPI(query, end) {
//もっと効率的な漢字の「ん」の判定方法ないかなー
    var NG_word =[""] /*["針", "線", "論", "缶", "天", "点", "覧", "案", "暗", "全", "員", "印", "院", "因", "引", "飲", "運", "温", "円", "縁", "園"
        , "延", "塩", "遠", "音", "恩", "韓", "艦", "金", "菌", "禁", "筋", "君", "勲", "訓", "県", "兼", "券", "件", "剣", "健", "圏"
        , "紺", "産", "酸", "山", "算", "新", "臣", "癌", "玩", "寸", "損", "村", "短", "痰", "担", "沈", "陳", "賃", "典", "品", "貧"
        , "分", "糞", "墳", "粉", "編", "辺", "本", "南", "認", "燃", "粘", "万", "満", "民", "眠", "面", "麺", "綿", "紋", "悶", "四"
        , "欄", "乱", "卵", "覧", "濫", "林", "倫", "麟", "錬", "連", "練", "恋", "湾", "椀", "腕", "館", "ん", "ン"];
    */
        //API呼び出し
    console.log(query);
    $.ajax({
        type: "GET",
        timeout: 10000,
        dataType: "jsonp",
        url: "https://ja.wikipedia.org/w/api.php?format=json&action=query&list=prefixsearch&pssearch=" + query + "&pslimit=200&psnamespace=0",
        async: false,
        success: function (json) {
            console.log(json)
            json.query.prefixsearch.forEach(function (value) {
                if (value.title != query) {
                    var word = value.title;
                    word = word.replace(/ *\([^)]*\) */g, "");
                    if (NG_word.indexOf(word.slice(-1)) == -1 && Word_history.indexOf(word) == -1) {
                        words.push(word);
                    }
                }
            });
            end();
        }
    });

}
/*  
    引数ran
    1 先頭切り出し
    -1 末尾切り出し

    自分で書いたのにわからなくなった
    おちゃめなんだからーーー
    うふふふふ
*/
function str_chenge(str, ran) {
    var range = ran
    if (range == 1) {
        range = [0, 1]
    } else {
        range = [-1, undefined]
    }
    const hiragana = ["あ", "い", "う", "え", "お",
        "か", "き", "く", "け", "こ",
        "さ", "し", "す", "せ", "そ",
        "た", "ち", "つ", "て", "と",
        "な", "に", "ぬ", "ね", "の",
        "は", "ひ", "ふ", "へ", "ほ",
        "ま", "み", "む", "め", "も",
        "や", "ゆ", "よ",
        "わ", "を", "ん",
        "ぁ", "ぃ", "ぅ", "ぇ", "ぉ",
        "っ",
        "ゃ", "ゅ", "ょ",
        "が", "ぎ", "ぐ", "げ", "ご",
        "ざ", "じ", "ず", "ぜ", "ぞ",
        "だ", "ぢ", "づ", "で", "ど",
        "ば", "び", "ぶ", "べ", "ぼ",
    ]
    const katakana = ["ア", "イ", "ウ", "エ", "オ",
        "カ", "キ", "ク", "ケ", "コ",
        "サ", "シ", "ス", "セ", "ソ",
        "タ", "チ", "ツ", "テ", "ト",
        "ナ", "ニ", "ヌ", "ネ", "ノ",
        "ハ", "ヒ", "フ", "ヘ", "ホ",
        "マ", "ミ", "ム", "メ", "モ",
        "ヤ", "ユ", "ヨ",
        "ワ", "ヲ", "ン",
        "ァ", "ィ", "ゥ", "ェ", "ォ",
        "ッ",
        "ャ", "ュ", "ョ",
        "ガ", "ギ", "グ", "ゲ", "ゴ",
        "ザ", "ジ", "ズ", "ゼ", "ゾ",
        "ダ", "ヂ", "ヅ", "デ", "ド",
        "バ", "ビ", "ブ", "ベ", "ボ",]
    var r = [];
    var func_str = str;

    //しりとり処理除外対象が二回連続でも対応
    
    //const del_str =func_str.slice(range[0], range[1]) != "ー" && func_str.slice(range[0], range[1]) != "-" && func_str.slice(range[0], range[1]) != "!" && func_str.slice(range[0], range[1]) != "?" && func_str.slice(range[0], range[1]) != "！" && func_str.slice(range[0], range[1]) != "？" && func_str.slice(range[0], range[1]) != "〜" && func_str.slice(range[0], range[1]) != "、"&&func_str.slice(range[0], range[1]) != "。"&&func_str.slice(range[0], range[1]) != "."
    
   
   
    
   
   if (hiragana.indexOf(func_str.slice(range[0], range[1])) != -1) {//ひらがな
        r.push(func_str.slice(range[0], range[1]));
        r.push(katakana[hiragana.indexOf(func_str.slice(range[0], range[1]))]);
        console.log(r)
    } else if (katakana.indexOf(str.slice(range[0], range[1])) != -1) {//カタカナ
        r.push(hiragana[katakana.indexOf(func_str.slice(range[0], range[1]))]);
        r.push(func_str.slice(range[0], range[1]));
        console.log(r)
    } else {//漢字
        $.ajax({
            type: 'POST',
            timeout: 10000,
            url: "https://labs.goo.ne.jp/api/hiragana",
            async: false,
            'headers': {
                'Content-Type': "application/json",
            },
            data: JSON.stringify({
                'app_id': '7e6a1cf050d53f86f5530bc2c222c6084e888fadacfb14b0c5617bcf091975d1',
                'sentence': func_str,
                'output_type': 'hiragana'
            }),
        }).done(function (data) {
            func_str = data.converted;
        const del_word=["ー","-","!","！","？","?",
        "～","〜","~","/","_","、","。",".","・","…",
        "'","\"","#",")","(","￥","@","「","」","’","”"]
            if(range[0]==-1){
                if(del_word.includes(func_str.slice(-1))){
                    do {
                       func_str= func_str.slice(0,func_str.length - 1)                    
                    }  while (del_word.includes(func_str.slice(-1)))        
                               func_str=func_str.slice(-1)
                } else {
                    func_str = func_str.slice(range[0], range[1]);
                }
            }
            
            r.push(func_str.slice(range[0], range[1]));// ひらがなを rに追加
            r.push(katakana[hiragana.indexOf(func_str.slice(range[0], range[1]))]);//カタカナをr に追加
            console.log(r)
        });
    }
    switch (r[0]) {//小文字変換　ひらがな　もっといい方法あるかな？
        case "ぁ":
            r[0] = "あ";
            break;
        case "ぃ":
            r[0] = "い";
            break;
        case "ぅ":
            r[0] = "う";
            break;
        case "ぇ":
            r[0] = "え";
            break;
        case "ぉ":
            r[0] = "お";
            break;
        case "っ":
            r[0] = "つ";
            break;
        case "ゃ":
            r[0] = "や";
            break;
        case "ゅ":
            r[0] = "ゆ";
            break;
        case "ょ":
            r[0] = "よ";
            break;
        case "ゎ":
            r[0] = "わ";
            break;
        case "を":
            r[0] = "お";
        default:
            break;
    }
    switch (r[1]) {//小文字変換　カタカナ
        case "ァ":
            r[1] = "ア";
            break;
        case "ィ":
            r[1] = "イ";
            break;
        case "ゥ":
            r[1] = "ウ";
            break;
        case "ェ":
            r[1] = "エ";
            break;
        case "ォ":
            r[1] = "オ";
            break;
        case "ヵ":
            r[1] = "カ";
            break;
        case "ヶ":
            r[1] = "ケ";
            break;
        case "ッ":
            r[1] = "ツ";
            break;
        case "ャ":
            r[1] = "ヤ";
            break;
        case "ュ":
            r[1] = "ユ";
            break;
        case "ョ":
            r[1] = "ヨ";
            break;
        case "ヮ":
            r[1] = "ワ";
            break;
        case "ヲ":
            r[1] = "オ";
        default:
            break;
    }
    console.log(r);
    return r;
}
function say(text, element) {// せいする関数
    element.html(element.html() + "<div class=\"kaiwa\"><!–左からの吹き出し–><figure class=\"kaiwa-img-left\"><img src=\"./icons/Wikipedia-logo-v2-ja.png\" alt=\"no-img2\"><figcaption class=\"kaiwa-img-description\">しりとり AI</figcaption></figure><div class=\"kaiwa-text-right\"><p class=\"kaiwa-text\">" + text + "</p></div></div><!–左からの吹き出し 終了–>")
}
/*
結構がんばったこのソースコードを誰かほめてくれぇぇぇぇぇぇぇぇぇぇぇぇぇぇぇぇぇ！！！！！！！！
*/
