/**
 * This Lambda function will take images in an Amazon S3 bucket and send them to Amazon Rekognition
 * as the event occurs in S3.  It will then take the text found by Amazon Rekognition and send it to
 * wit.ai for analysis.
 * 
 * This really is not a full blown app but more a way to learn on how you can incorporate image and text
 * analysis into larger projects.
 */


//Amazon resources
let AWS = require("aws-sdk");
let s3 = new AWS.S3({ apiVersion: "2006-03-01" });
let rekognition = new AWS.Rekognition();
let docClient = new AWS.DynamoDB.DocumentClient();

//This environment variable is the name of the table you created
const TABLE_NAME = process.env.TABLE_NAME;

//Wit AI
const { Wit } = require('node-wit');
const client = new Wit({
  accessToken: process.env.WIT_AI_TOKEN
});


let lambdaCallback, bucket, key;

exports.handler = function (event, context, callback) {
  lambdaCallback = callback
  bucket = event.Records[0].s3.bucket.name;
  key = event.Records[0].s3.object.key;
  rekognizeLabels(bucket, key)
    .then(function (data) {
      labelData = data["Labels"];
      return rekognizeFace(bucket, key)
    }).then(function (faceData) {
      faceDetails = faceData["FaceDetails"];
      return rekognizeText(bucket, key)
    }).then(function (textData) {
      textDetails = textData["TextDetections"];
      /**
       * create string with textDetails with just a space between them
       * then send to wit and get data back.
       * 
       * This is also where if you want to incorporate other Rekognition output
       * for the wit.ai input.  I just did text to keep it simple for this tutorial.
       */
      let witSentence = '';

      textDetails.forEach(i => {
        witSentence += i.DetectedText + ' ';
      });

      //check to see if there was any text
      if (witSentence.length > 0) {
        client.message(witSentence, {})
          .then(witData => {
            return addToRekognitionTable(labelData, faceDetails, textDetails, witData);
          })
          .catch(console.error);
      } else {
        let witData = {};
        return addToRekognitionTable(labelData, faceDetails, textDetails, witData);
      }


    }).then(function (data) {
      console.log("Data added to " + TABLE_NAME + " Table");
      lambdaCallback(null, data)
    }).catch(function (err) {
      lambdaCallback(err, null);
    });
};

//Add to the DynamoDB table
function addToRekognitionTable(labelData, faceDetails, textDetails, witData) {

  let params = {
    TableName: TABLE_NAME,
    Item: {
      timestamp: new Date().getTime(),
      filename: key.split(".")[0],
      faceDetails: faceDetails,
      labels: labelData,
      texts: textDetails,
      witData: witData
    }
  };

  return docClient.put(params).promise()
};

//Who is that person?
function rekognizeFace(bucket, key) {
  let params = {
    Attributes: ["ALL"],
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    }
  };

  return rekognition.detectFaces(params).promise()
};

//What is that?  You might want to change the MaxLabels and MinConfidence to suit your needs.
function rekognizeLabels(bucket, key) {
  let params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    },
    MaxLabels: 3,
    MinConfidence: 80
  };

  return rekognition.detectLabels(params).promise()
};

//Does that say something, in text form, not in some sort of artistic sense?
function rekognizeText(bucket, key) {
  let params = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    },
  };

  return rekognition.detectText(params).promise()
};