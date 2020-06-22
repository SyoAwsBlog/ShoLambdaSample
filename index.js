var Aws = require("aws-sdk");

exports.handler = function (event, context, callback) {
  console.log("Received event:", JSON.stringify(event, null, 2));

  var aa = require("aa");

  var irregularErr;

  function* main() {
    try {
      var executeBizModule = require("./SampleBizModule");
      var executeBizObject = new executeBizModule();

      var bizRequireObjects = {
        Aws,
        aa,
        PromiseObject: aa.Promise,
      };

      return yield executeBizObject.execute(event, context, bizRequireObjects);
    } catch (catchErr) {
      irregularErr = catchErr;
    }
  }

  aa(main()).then(function (val) {
    console.log("Biz Process Finish!");

    if (irregularErr) {
      console.log("Biz Process Error!");
      callback(irregularErr);
    } else {
      console.log("Biz Process Success!");
      callback(null, val);
    }
  });
};
