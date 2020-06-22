module.exports = function AbstractBizCommon() {
  var Promise;

  var superClazzFunc = require("./AbstractBaseCommon.js");
  AbstractBizCommon.prototype = new superClazzFunc();

  function* executeBizCommon(event, context, bizRequireObjects) {
    var base = AbstractBizCommon.prototype;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# executeBizCommon : start");
      }

      if (bizRequireObjects.PromiseObject) {
        Promise = bizRequireObjects.PromiseObject;
      }

      AbstractBizCommon.prototype.RequireObjects = bizRequireObjects;

      return yield AbstractBizCommon.prototype.executeBaseCommon(
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
        console.log("AbstractBizCommon# executeBizCommon : end");
      }
    }
  }
  AbstractBizCommon.prototype.executeBizCommon = executeBizCommon;

  AbstractBizCommon.prototype.getCurrentDate = function (offset) {
    var base = AbstractBizCommon.prototype;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# getCurrentDate : start");
      }

      Date.prototype.setTimezone = function (tz) {
        var utc = new Date(
          this.getTime() + this.getTimezoneOffset() * 60 * 1000
        );
        return new Date(utc.getTime() + (tz / 100) * 60 * 60 * 1000);
      };

      var now = new Date();
      if (typeof offset == "undefined") {
        now = now.setTimezone(900);
      } else {
        now = now.setTimezone(offset);
      }

      return now;
    } catch (err) {
      if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
        base.printStackTrace(err);
      }
      throw err;
    } finally {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# getCurrentDate : end");
      }
    }
  };

  AbstractBizCommon.prototype.getTimeStringJst9 = function (now) {
    var base = AbstractBizCommon.prototype;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# getTimeStringJst9 : start");
      }

      var year = now.getYear();
      var month = ("0" + (now.getMonth() + 1)).slice(-2);
      var day = ("0" + now.getDate()).slice(-2);
      var hour = ("0" + now.getHours()).slice(-2);
      var min = ("0" + now.getMinutes()).slice(-2);
      var sec = ("0" + now.getSeconds()).slice(-2);
      var mirisec = ("00" + now.getMilliseconds()).slice(-3);
      if (year < 2000) {
        year += 1900;
      }
      var dateStr =
        year +
        "-" +
        month +
        "-" +
        day +
        "T" +
        hour +
        ":" +
        min +
        ":" +
        sec +
        "." +
        mirisec +
        "+0900";

      return dateStr;

      return now;
    } catch (err) {
      if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
        base.printStackTrace(err);
      }
      throw err;
    } finally {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# getTimeStringJst9 : end");
      }
    }
  };

  AbstractBizCommon.prototype.beforeMainExecute = function (args) {
    var base = AbstractBizCommon.prototype;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# beforeMainExecute :start");
      }

      return new Promise(function (resolve, reject) {
        resolve("beforeMainExecute Finish");
      });
    } catch (err) {
      if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
        base.printStackTrace(err);
      }
      throw err;
    } finally {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# beforeMainExecute :end");
      }
    }
  };

  AbstractBizCommon.prototype.businessMainExecute = function (args) {
    var base = AbstractBizCommon.prototype;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# businessMainExecute :start");
      }

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
        console.log("AbstractBizCommon# businessMainExecute :end");
      }
    }
  };

  AbstractBizCommon.prototype.afterMainExecute = function (args) {
    var base = AbstractBizCommon.prototype;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# afterMainExecute :start");
      }

      return new Promise(function (resolve, reject) {
        resolve("afterMainExecute Finish");
      });
    } catch (err) {
      if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
        base.printStackTrace(err);
      }
      throw err;
    } finally {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# afterMainExecute :end");
      }
    }
  };

  AbstractBizCommon.prototype.getTasks = function (event, context) {
    var base = AbstractBizCommon.prototype;
    try {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# getTasks :start");
      }

      return [
        this.beforeMainExecute,
        this.businessMainExecute,
        this.afterMainExecute,
      ];
    } catch (err) {
      if (base.getLogLevelError() >= base.getLogLevelCurrent()) {
        base.printStackTrace(err);
      }
      throw err;
    } finally {
      if (base.getLogLevelTrace() >= base.getLogLevelCurrent()) {
        console.log("AbstractBizCommon# getTasks :end");
      }
    }
  };

  return {
    executeBizCommon,
    AbstractBaseCommon: AbstractBizCommon.prototype,
  };
};
