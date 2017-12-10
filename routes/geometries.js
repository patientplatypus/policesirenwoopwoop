var express = require('express');
var router = express.Router();
var csv = require("fast-csv");

var fs = require('fs');
var geojson = fs.readFileSync(__dirname + '/../data/AUSTINGJ.geojson', 'utf8');


var survey = fs.createReadStream(__dirname + '/../data/Survey.csv');
var crime = fs.createReadStream(__dirname + '/../data/Crime.csv');

// var geopoints = fs.readFileSync(__dirname + '/../data/AUSTINGJ.geojson', 'utf8');

module.exports = ({ client }) => {

  router.get('/test', function(req, res, next) {
    res.send('inside test in geometries')
  });

  // const point1 = {type: "Point", coordinates: [102.0, 0.5]};

  router.get('/createsurveycrimetables', function(req,res,next){
    
  })

  router.get('/surveyparsing', function(req,res,next){

    csv
     .fromStream(crime, {headers : [ , , "Y.Lat", "X.Long", "ID"]})
     .on("data", function(data){
         console.log(data);
     })
     .on("end", function(){
         console.log("done");
     });

     res.send('inside surveyparsing')
  })

  router.get('/crimeparsing', function(req,res,next){

    csv
     .fromStream(crime, {headers : [ , , "Y.Lat", "X.Long", "ID"]})
     .on("data", function(data){
         console.log(data);
     })
     .on("end", function(){
         console.log("done");
     });

    res.send('inside crimeparsing')
  })

  return router
}
