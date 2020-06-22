module.exports = function SampleBizModule() {
  var superClazzFunc = new require("./AbstractBizUnitCommon.js");
  SampleBizModule.prototype = new superClazzFunc();

  function* execute(event, context, bizRequireObjects) {
    var base = SampleBizModule.prototype.AbstractBaseCommon;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("SampleBizModule# execute : start");
      }

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

  SampleBizModule.prototype.AbstractBaseCommon.businessMainExecute = function (
    args
  ) {
    var base = SampleBizModule.prototype.AbstractBaseCommon;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("SampleBizModule# businessMainExecute : start");
      }
      var event = base.getFirstIndexObject(args);
      console.log(JSON.stringify(event));

      var now = base.getCurrentDate();
      console.log(base.getTimeStringJst9(now));

      // var bizError = base.getBizError(new Error("Test Error", "Test!!"));
      // throw bizError;

      // throw new Error("test Error!!!");

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
