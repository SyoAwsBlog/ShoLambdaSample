/*
処理固有に必要な処理などを、この層に実装する。

テストや挙動確認を含めたコードをコメントアウト込みで、
サンプルとして記述する。

written by syo
http://awsblog.physalisgp02.com
*/
module.exports = function SampleBizModule() {
  // 疑似的な継承関係として親モジュールを読み込む
  var superClazzFunc = new require("./AbstractBizUnitCommon.js");
  // prototypeにセットする事で継承関係のように挙動させる
  SampleBizModule.prototype = new superClazzFunc();

  // 処理の実行
  function* execute(event, context, bizRequireObjects) {
    var base = SampleBizModule.prototype.AbstractBaseCommon;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("SampleBizModule# execute : start");
      }

      // 親の業務処理を実行
      return yield SampleBizModule.prototype.executeBizUnitCommon(
        event,
        context,
        bizRequireObjects
      );
    } catch (err) {
      if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
        base.printStackTrace(err);
      }
      throw err;
    } finally {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("SampleBizModule# execute : end");
      }
    }
  }

  /*
  業務メイン処理（オーバーライドのサンプル）

  @override
  @param args 各処理の結果を格納した配列
  */
  SampleBizModule.prototype.AbstractBaseCommon.businessMainExecute = function (
    args
  ) {
    var base = SampleBizModule.prototype.AbstractBaseCommon;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("SampleBizModule# businessMainExecute : start");
      }

      // 基底処理を実行する事で、Lambda実行引数のeventを取り出せる
      var event = base.getFirstIndexObject(args);
      console.log(JSON.stringify(event));

      // 時間系など、どこでも使えそうな関数をAbstractBizCommonに実装し呼び出す例
      var now = base.getCurrentDate();
      console.log(base.getTimeStringJst9(now));

      // 入力チェックなどで例外で処理を止めたいけど、Lambdaのエラーとしたない場合の例外実装
      // var bizError = base.getBizError(new Error("Test Error", "Test!!"));
      // throw bizError;

      // Lambdaもエラーとなる例外
      // throw new Error("test Error!!!");

      // Promiseを戻す関数として実装可能
      return new Promise(function (resolve, reject) {
        resolve("businessMainExecute Finish");
      });
    } catch (err) {
      if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
        base.printStackTrace(err);
      }
      throw err;
    } finally {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("SampleBizModule# businessMainExecute : end");
      }
    }
  }.bind(SampleBizModule.prototype.AbstractBaseCommon);

  return {
    execute,
  };
};
