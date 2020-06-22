module.exports = function AbstractBizUnitCommon() {
  var superClazzFunc = require("./AbstractBizCommon");
  AbstractBizUnitCommon.prototype = new superClazzFunc();

  function* executeBizUnitCommon(event, context, bizRequireObjects) {
    var base = AbstractBizUnitCommon.prototype.AbstractBaseCommon;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizUnitCommon# executeBizUnitCommon : start");
      }

      var reCallCount = event.reCallCount || 0;
      reCallCount += 1;
      event.reCallCount = reCallCount;

      AbstractBizUnitCommon.prototype.RequireObjects = bizRequireObjects;

      return yield AbstractBizUnitCommon.prototype.executeBizCommon(
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
        console.log("AbstractBizUnitCommon# executeBizUnitCommon : end");
      }
    }
  }
  AbstractBizUnitCommon.prototype.executeBizUnitCommon = executeBizUnitCommon;

  AbstractBizUnitCommon.prototype.AbstractBaseCommon.beforeMainExecute = function (
    args
  ) {
    var base = AbstractBizUnitCommon.prototype.AbstractBaseCommon;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizUnitCommon# beforeMainExecute : start");
      }
      // tasksの先頭には event が格納されてくる。
      // 後続のtaskで参照しやすくするには、最初のタスクで
      // eventを返却しておくと良い
      var event = args;
      return event;
    } catch (err) {
      if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
        base.printStackTrace(err);
      }
      throw err;
    } finally {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizUnitCommon# beforeMainExecute : end");
      }
    }
  }.bind(AbstractBizUnitCommon.prototype.AbstractBaseCommon);

  return {
    executeBizUnitCommon,
    AbstractBizUnitCommon,
    AbstractBizCommon: AbstractBizUnitCommon.prototype,
    AbstractBaseCommon: AbstractBizUnitCommon.prototype.AbstractBaseCommon,
  };
};
