module.exports = function AbstractBaseCommon() {
  var Promise;
  var aa;
  var Aws;

  var LOG_LEVEL_TRACE = 1;
  var LOG_LEVEL_DEBUG = 2;
  var LOG_LEVEL_INFO = 3;
  var LOG_LEVEL_WARN = 4;
  var LOG_LEVEL_ERROR = 5;

  var LOG_LEVEL_CURRENT = LOG_LEVEL_INFO;
  if (process && process.env && process.env.LogLevel) {
    LOG_LEVEL_CURRENT = process.env.LogLevel;
  }

  function BizError(err, message) {
    this.name = "WarnInterruption";
    this.message = message || "SequenceTasks Interruption";
    this.stack = err.stack;
  }
  BizError.prototype = Object.create(Error.prototype);
  BizError.prototype.constructor = BizError;

  AbstractBaseCommon.prototype.getLogLevelCurrent = function () {
    return LOG_LEVEL_CURRENT;
  }.bind(AbstractBaseCommon.prototype);

  AbstractBaseCommon.prototype.getLogLevelTrace = function () {
    return LOG_LEVEL_TRACE;
  }.bind(AbstractBaseCommon.prototype);
  AbstractBaseCommon.prototype.getLogLevelDebug = function () {
    return LOG_LEVEL_DEBUG;
  }.bind(AbstractBaseCommon.prototype);
  AbstractBaseCommon.prototype.getLogLevelInfo = function () {
    return LOG_LEVEL_INFO;
  }.bind(AbstractBaseCommon.prototype);
  AbstractBaseCommon.prototype.getLogLevelWarn = function () {
    return LOG_LEVEL_WARN;
  }.bind(AbstractBaseCommon.prototype);
  AbstractBaseCommon.prototype.getLogLevelError = function () {
    return LOG_LEVEL_ERROR;
  }.bind(AbstractBaseCommon.prototype);

  AbstractBaseCommon.prototype.printStackTrace = function (err) {
    if (this.getLogLevelError() >= this.getLogLevelCurrent()) {
      if (err instanceof BizError) {
      } else if (err && err.name && err.name == "WarnInterruption") {
      } else if (err && err.errorType && err.errorType == "WarnInterruption") {
      } else {
        if (err.stack) {
          console.log(err.stack);
        } else {
          console.log(err.message, err);
        }
      }
    }
  }.bind(AbstractBaseCommon.prototype);

  AbstractBaseCommon.prototype.judgeBizError = function (err) {
    var rtnFlag = false;
    if (err instanceof BizError) {
      rtnFlag = true;
    } else if (err && err.name && err.name == "WarnInterruption") {
      rtnFlag = true;
    } else if (err && err.errorType && err.errorType == "WarnInterruption") {
      rtnFlag = true;
    }
    return rtnFlag;
  }.bind(AbstractBaseCommon.prototype);

  AbstractBaseCommon.prototype.getBizError = function (err, message) {
    return new BizError(err, message);
  }.bind(AbstractBaseCommon.prototype);

  AbstractBaseCommon.prototype.executeBaseCommon = function* (event, context) {
    var currentThisClazz = this;
    try {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# executeBaseCommon : start");
      }

      if (currentThisClazz.RequireObjects.PromiseObject) {
        Promise = currentThisClazz.RequireObjects.PromiseObject;
      }
      if (currentThisClazz.RequireObjects.aa) {
        aa = currentThisClazz.RequireObjects.aa;
      }
      if (currentThisClazz.RequireObjects.Aws) {
        Aws = currentThisClazz.RequireObjects.Aws;
      }
      var promiseRefs = {
        event,
        context,
      };
      currentThisClazz.promiseRefs = promiseRefs;

      var bizLastVal;

      return yield Promise.resolve()
        .then(function () {
          var tasks = currentThisClazz.getTasks(event, context);

          if (
            currentThisClazz.getLogLevelDebug >=
            currentThisClazz.getLogLevelCurrent()
          ) {
            console.log(
              "AbstractBaseCommon# Get Tasks After Task Count:" + tasks.length
            );
          }
          return currentThisClazz.sequenceTasks(currentThisClazz, tasks, event);
        })
        .then(function (results) {
          bizLastVal = currentThisClazz.afterAllTasksExecute(
            event,
            context,
            results
          );
          return bizLastVal;
        })
        .catch(function (err) {
          try {
            currentThisClazz.catchErrorAllTasksExecute(event, context, err);
          } catch (err) {
            throw err;
          }
        })
        .then(function () {
          currentThisClazz.finallyAllTasksExecute(event, context);
          return bizLastVal;
        });
    } catch (err) {
      if (
        currentThisClazz.getLogLevelError() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        currentThisClazz.printStackTrace(err);
      }
      throw err;
    } finally {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# executeBaseCommon : end");
      }
    }
  };

  AbstractBaseCommon.prototype.sequenceTasks = function (
    currentThisClazz,
    tasks,
    event
  ) {
    try {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# sequenceTasks : start");
      }

      return new Promise(function (resolve, reject) {
        function* controler() {
          function recordValue(results, value) {
            results.push(value);
            return results;
          }
          var results = [];
          var pushValue = recordValue.bind(null, results);

          var errFlag = new Boolean(false);

          var promise = Promise.resolve(event);

          for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];

            promise = promise
              .then(task)
              .then(pushValue)
              .catch(function (err) {
                if (err) {
                  if (errFlag == false) {
                    if (err instanceof BizError) {
                      console.log(err.message);
                    } else if (
                      err &&
                      err.name &&
                      err.name == "WarnInterruption"
                    ) {
                      console.log(err.message);
                    } else if (
                      err &&
                      err.errorType &&
                      err.errorType == "WarnInterruption"
                    ) {
                      console.log(err.message);
                    }

                    errFlag = new Boolean(true);

                    return Promise.reject(err);
                  } else {
                    // return Promise.reject();
                    throw err;
                  }
                } else {
                  // ありえない
                  // return Promise.reject();
                  throw new Error();
                }
              });
          }
          yield results;
          return yield promise;
        }

        currentThisClazz.RequireObjects.aa(
          controler(currentThisClazz, tasks, event)
        )
          .then(function (results) {
            resolve(results);
          })
          .catch(function (err) {
            reject(err);
          });
      });
    } catch (err) {
      if (
        currentThisClazz.getLogLevelError() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        currentThisClazz.printStackTrace(err);
      }
      throw err;
    } finally {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# sequenceTasks : end");
      }
    }
  };

  AbstractBaseCommon.prototype.getFirstIndexObject = function (args) {
    var rtnObject = null;
    if (args && args.length > 0) {
      rtnObject = args[0];
    }
    return rtnObject;
  };

  AbstractBaseCommon.prototype.getLastIndexObject = function (args) {
    var rtnObject = null;
    if (args && args.length > 0) {
      var lastIndexNum = args.length - 1;
      rtnObject = args[lastIndexNum];
    }
    return rtnObject;
  };

  AbstractBaseCommon.prototype.getTasks = function (event, context) {
    var currentThisClazz = this;
    try {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# getTasks : start");
      }
      return [];
    } catch (err) {
      if (
        currentThisClazz.getLogLevelError() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        currentThisClazz.printStackTrace(err);
      }
      throw err;
    } finally {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# getTasks : end");
      }
    }
  };

  AbstractBaseCommon.prototype.afterAllTasksExecute = function (
    event,
    context,
    results
  ) {
    var currentThisClazz = this;
    try {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# afterAllTasksExecute : start");
      }
      return "AbstractBaseCommon# afterAllTasksExecute:Finish";
    } catch (err) {
      if (
        currentThisClazz.getLogLevelError() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        currentThisClazz.printStackTrace(err);
      }
      throw err;
    } finally {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# afterAllTasksExecute : end");
      }
    }
  };

  AbstractBaseCommon.prototype.finallyAllTasksExecute = function (
    event,
    context
  ) {
    var currentThisClazz = this;
    try {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# finallyAllTasksExecute : start");
      }
    } catch (err) {
      if (
        currentThisClazz.getLogLevelError() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        currentThisClazz.printStackTrace(err);
      }
      throw err;
    } finally {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# finallyAllTasksExecute : end");
      }
    }
  };

  AbstractBaseCommon.prototype.catchErrorAllTasksExecute = function (
    event,
    context,
    err
  ) {
    var currentThisClazz = this;
    try {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# catchErrorAllTasksExecute : start");
      }

      if (
        currentThisClazz.getLogLevelError() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        if (err) {
          console.log(JSON.stringify(err));

          if (err instanceof BizError) {
            console.log(err.message);
          } else if (err && err.name && err.name == "WarnInterruption") {
            console.log(err.message);
          } else if (
            err &&
            err.errorType &&
            err.errorType == "WarnInterruption"
          ) {
            console.log(err.message);
          } else {
            currentThisClazz.printStackTrace(err);

            var bizAutoRetryCount = 0;
            if (event && event.bizAutoRetryCount) {
              bizAutoRetryCount = event.bizAutoRetryCount;
            }

            var autoFunctionRetryMax = 0;
            if (process && process.env && process.env.autoFunctionRetry) {
              autoFunctionRetryMax = process.env.autoFunctionRetry;
            }

            if (bizAutoRetryCount < autoFunctionRetryMax) {
              if (
                currentThisClazz.getLogLevelWarn >=
                currentThisClazz.getLogLevelCurrent()
              ) {
                console.log(
                  "AbstractBaseCommon# autoRetryExecute bizAutoRetryCount:" +
                    bizAutoRetryCount +
                    " autoFunctionRetryMax:" +
                    autoFunctionRetryMax
                );
              }

              bizAutoRetryCount = bizAutoRetryCount + 1;
              event.bizAutoRetryCount = bizAutoRetryCount;

              currentThisClazz.autoRetryExecute(event, context, err);
            } else {
              throw err;
            }
          }
        }
      }
    } catch (err) {
      if (
        currentThisClazz.getLogLevelError() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        currentThisClazz.printStackTrace(err);
      }
      throw err;
    } finally {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# catchErrorAllTasksExecute : end");
      }
    }
  }.bind(AbstractBaseCommon.prototype);

  AbstractBaseCommon.prototype.autoRetryExecute = function (
    event,
    context,
    err
  ) {
    var currentThisClazz = this;
    try {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# autoRetryExecute : start");
      }

      var autoFunctionRetryWait = 500;
      if (process && process.env && process.env.AutoFunctionRetryWait) {
        autoFunctionRetryWait = process.env.AutoFunctionRetryWait;
      }

      var autoFunctionRetryMax = 0;
      if (process && process.env && process.env.AutoFunctionRetry) {
        autoFunctionRetryMax = process.env.AutoFunctionRetry;
      }

      var funcName = process.env.AWS_LAMBDA_FUNCTION_NAME;

      var params = {
        FunctionName: funcName,
        InvokeArgs: JSON.stringify(event),
      };

      function sleep(msec, val) {
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, msec, val);
        });
      }

      function lambdaExecute(params) {
        var Lambda = new Aws.Lambda({
          maxRetries: 5,
          httpOptions: {
            connectTimeout: 5000,
            timeout: 5000,
          },
        });

        return new Promise(function (resolve, reject) {
          Lambda.invokeAsync(params, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      }

      var irregularErr;
      function* main() {
        yield sleep(autoFunctionRetryWait, "Retry Sleep");
        yield lambdaExecute(params);
        return "Retry Execute";
      }

      aa(main())
        .then(function (val) {
          return val;
        })
        .catch(function (err) {
          if (
            currentThisClazz.getLogLevelError >=
            currentThisClazz.getLogLevelCurrent()
          ) {
            currentThisClazz.printStackTrace(err);
          }
          // リトライ中にエラーが出てもスローしない
        });
    } catch (err) {
      if (
        currentThisClazz.getLogLevelError() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        currentThisClazz.printStackTrace(err);
      }
      throw err;
    } finally {
      if (
        currentThisClazz.getLogLevelTrace() >=
        currentThisClazz.getLogLevelCurrent()
      ) {
        console.log("AbstractBaseCommon# autoRetryExecute : end");
      }
    }
  }.bind(AbstractBaseCommon.prototype);
};
