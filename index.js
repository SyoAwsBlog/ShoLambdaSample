/*
実戦的なLambdaサンプル　その１

written by syo
http://awsblog.physalisgp02.com
*/

// Aws SDK は handler外で読み込む
var Aws = require("aws-sdk");

exports.handler = function (event, context, callback) {
  // eventの中身にもよるが、CloudWatchに出力しておくと、デバック・運用がしやすい
  console.log("Received event:", JSON.stringify(event, null, 2));

  var aa = require("aa");

  // 業務処理で例外があった時に判定できるように非同期関数外に宣言
  var irregularErr;

  // 非同期実行関数の宣言
  function* main() {
    try {
      // 業務用の処理を書いたモジュールを読み込む
      var executeBizModule = require("./SampleBizModule");
      var executeBizObject = new executeBizModule();

      // ライブラリー群は、handler外で読み込みした物も含めて参照を渡す
      var bizRequireObjects = {
        Aws,
        aa,
        PromiseObject: aa.Promise,
      };

      // 業務処理の終了を待つように yieldをつけて実行
      return yield executeBizObject.execute(event, context, bizRequireObjects);
    } catch (catchErr) {
      irregularErr = catchErr;
    }
  }

  // 業務処理の実行
  aa(main()).then(function (val) {
    // 業務処理を抜けてきた
    console.log("Biz Process Finish!");

    if (irregularErr) {
      // 何かしらの例外があったのでエラーの返却
      console.log("Biz Process Error!");
      callback(irregularErr);
    } else {
      // 例外がなかったので正常終了
      console.log("Biz Process Success!");
      callback(null, val);
    }
  });
};
