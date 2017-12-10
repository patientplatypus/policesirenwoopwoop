var express = require('express');
var router = express.Router();
var csv = require("fast-csv");
var gju = require('geojson-utils');
var axios = require('axios');
const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');

var fs = require('fs');
var geojson = JSON.parse(fs.readFileSync(__dirname + '/../data/AUSTINGJ.geojson', 'utf8'));
// var geojsonLOOKUP = new GeoJsonGeometriesLookup(geojson);


console.log('value of jsonparsed geojson obj: ', geojson);
console.log('value of jsonparsed geometry obj: ', geojson['features'][0]['geometry']['coordinates']);

var geojsonfeatures = geojson['features'];
var geojsonfeatureslength = geojsonfeatures.length;
console.log('geojsonfeatureslength: ', geojsonfeatureslength);


var survey = fs.createReadStream(__dirname + '/../data/Survey.csv');
var crime = fs.createReadStream(__dirname + '/../data/Crime.csv');
// var crime2016 = fs.createReadStream(__dirname + '/../data/crime2016.csv')

// var geopoints = fs.readFileSync(__dirname + '/../data/AUSTINGJ.geojson', 'utf8');

module.exports = ( client ) => {

  router.get('/crime2016', function(req,res,next){
    // res.send('parsing completed')
    // AIzaSyBY3yuWwBPjarpMICaqdrAM8ZIaT_PSxIM

    // https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY

    var counter = 0;

    var url = 'https://data.austintexas.gov/resource/qxhx-pr9e.json'
    axios.get(url)
    .then(function (response) {
      console.log('value of response; ', response);
      response.data.forEach(singleresponse => {
        var address = singleresponse['go_location']
        if (address != undefined){
          var address = address.trim()
          console.log('value of address: ', address);
          var mapsurl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+',+Austin,+TX&key=AIzaSyBY3yuWwBPjarpMICaqdrAM8ZIaT_PSxIM'
          axios.get(mapsurl)
            .then(function (mapsresponse){
              counter +=1
              try{
                console.log('value of google maps response lat: ', mapsresponse.data.results[0]['geometry']['location']['lat']);
                console.log('value of google maps response lng: ', mapsresponse.data.results[0]['geometry']['location']['lng']);
                console.log('value of counter: ', counter);
              }
              catch(e){
                console.log('inside google maps catch: ', e);
              }
              // var latittude = mapsresponse.data.results[0]['geometry']['location']['lat']
              // var longitude =
              // mapsresponse.data.results[0]['geometry']['location']['lng']
              // console.log('value of latitude and longitude: ', [latitude, longitude]);
            })
            .catch(function(mapserror){
              console.log('inside mapserror');
              console.log(mapserror);
            })
        }
      })


    })
    .catch(function (error) {
      console.log('inside error');
      console.log(error);
    });
  })

  router.get('/test', function(req, res, next) {
    res.send('inside test in geometries')
  });

  // const point1 = {type: "Point", coordinates: [102.0, 0.5]};


  // { 'Y.Lat': '3156570', 'X.Long': '10037195', ID: '237960' }


  router.get('/createsurveycrimetables', function(req,res,next){
    client.query('CREATE TABLE surveydata(YLat decimal, XLong decimal, BLOCK bigint, ID integer);')
    client.query('CREATE TABLE crimedata(YLat decimal, XLong decimal, BLOCK bigint, ID integer);')
    res.send("ok tables made~!")
  })

  router.get('/surveyparsing', function(req,res,next){
    var counter = 0;
    csv
     .fromStream(survey, {headers : [ , , "Y.Lat", "X.Long", "ID"]})
     .on("data", (data)=>{
         console.log(data);
         var YLAT = parseFloat(data['Y.Lat'])
         var XLONG = parseFloat(data['X.Long'])
         var ID = data['ID']
         var BLOCK;

         console.log('value of YLAT', YLAT);

        //  http://data.fcc.gov/api/block/find?latitude=[latitude]&longitude=[longitude]&showall=[true/false]



        client.query("SELECT * FROM surveydata WHERE id = $1", [data['ID']],(err, result)=>{
          if (err){
            console.log('query error in select * from');
          }else{
            // console.log('value of dataID: ', data['ID']);
            // console.log('value of result: ', result);
            // console.log('value of result.command: ', result.command);

            console.log('value of result.rows[0]: ', result.rows.length);
            if (result.rows.length===0){
              var url = 'http://data.fcc.gov/api/block/find?latitude='+YLAT+'&longitude='+XLONG+'&showall=true&format=json'

              axios.get(url)
                .then(function (response) {
                  // console.log(response.data["BLOCK"]["FIPS"]);
                  // console.log(response.data);
                  console.log(response.data['Block']['FIPS']);
                  // console.log(response.data["BLOCK"]);
                  BLOCK = response.data['Block']['FIPS'];
                  counter+=1;
                  console.log('value of counter: ', counter);
                  client.query({
                      name: 'insert survey',
                      text: "INSERT INTO surveydata(YLat, XLong, BLOCK, ID) values($1, $2, $3, $4)",
                      values: [YLAT, XLONG, BLOCK, ID]
                  });
                })
                .catch(function (error) {
                  console.log('inside error catch');
                  console.log('value of YLAT/XLONG: ', [YLAT, XLONG]);
                  console.log(error);
                });
            }
          }
        } );


        // var url = 'http://data.fcc.gov/api/block/find?latitude='+YLAT+'&longitude='+XLONG+'&showall=true&format=json'
        //
        // axios.get(url)
        //   .then(function (response) {
        //     // console.log(response.data["BLOCK"]["FIPS"]);
        //     // console.log(response.data);
        //     console.log(response.data['Block']['FIPS']);
        //     // console.log(response.data["BLOCK"]);
        //     BLOCK = response.data['Block']['FIPS'];
        //     counter+=1;
        //     console.log('value of counter: ', counter);
        //     client.query({
        //         name: 'insert survey',
        //         text: "INSERT INTO surveydata(YLat, XLong, BLOCK, ID) values($1, $2, $3, $4)",
        //         values: [YLAT, XLONG, BLOCK, ID]
        //     });
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });

          //  geojsonfeatures.forEach(feature => {
          //    var multipolygon = feature['geometry']['coordinates']
          //    multipolygon.forEach(polygon => {
          //      // console.log('value of polygon: ', polygon);
          //      // console.log('test number ', counter);
          //     //  console.log('value of lat/long', [YLAT, XLONG]);
          //     //  console.log('value of coordinates; ', [YLAT, XLONG]);
          //     // //  console.log('value of polygon: ', polygon);
          //
          //     var pointtotest = {type: "Point", coordinates: [YLAT, XLONG]};
          //     var polygontotest = {
          //          type: 'Feature',
          //          geometry: {
          //            type: 'Polygon',
          //            coordinates: polygon
          //        }
          //      }
          //     //  console.log('value of pointtotest: ', pointtotest);
          //     //  console.log('value of polygontotest: ', polygontotest);
          //     //  console.log('value of polygon: ', polygon);
          //      const glookup = new GeoJsonGeometriesLookup(polygontotest);
          //      var containersGot = glookup.getContainers(pointtotest);
          //      var containersHas = glookup.hasContainers(pointtotest);
          //
          //      console.log('value of containersHas: ', containersHas);
          //      console.log('value of counter: ', counter);
          //      if(containersHas===true){
          //        var containersGot = glookup.getContainers(pointtotest);
          //        console.log('value of containersGot: ', containersGot);
          //      }
          //     //  console.log('value of lookup getcontainers: ', containersGot);
          //     //  console.log('value of lookup hascontainers: ', containersHas);
          //      counter+=1;
          //  })
          // })
          //
          //
     })
     .on("end", function(){
         console.log("done");
        //  res.send('all done')
     });

     res.send('inside surveyparsing')
  })

  router.get('/crimeparsing', function(req,res,next){

    csv
     .fromStream(crime, {headers : ["Y.Lat","X.Long", , , "ID"]})
     .on("data", function(data){
        // console.log(data);
        // data for X.LONG needs to be negative~!
        var YLAT = 1*data["Y.Lat"]
        var XLONG = -1*data["X.Long"]
        var ID = data["ID"]

        // const pointObj = {type: "Point", coordinates:[ parseFloat(data["Y.Lat"]),  parseFloat(data["X.Long"])]};
        // console.log('value of pointObj: ', pointObj);
        // let containerObj = geojsonLOOKUP.getContainers(pointObj)
        //
        // console.log('value of containerObj: ', containerObj);
        var counter = 0;
        geojsonfeatures.forEach(feature => {
          var multipolygon = feature['geometry']['coordinates']
          multipolygon.forEach(polygon => {
            // console.log('value of polygon: ', polygon);
            // console.log('test number ', counter);
            console.log('value of coordinates; ', [YLAT, XLONG]);
            console.log('value of polygon: ', polygon)
            counter+=1;
            var gjuVALUE = gju.pointInPolygon({"type":"Point","coordinates": [YLAT, XLONG]},
                 {"type":"Polygon", "coordinates": polygon})
            if (gjuVALUE===true){
              console.log('value of gjuVALUE, ', gjuVALUE);
            }
          })
        })

        client.query({
            name: 'insert crime',
            text: "INSERT INTO crimedata(YLat, XLong, ID) values($1, $2, $3)",
            values: [YLAT, XLONG, ID]
        });
     })
     .on("end", function(){
         console.log("done");
     });

    res.send('inside crimeparsing')
  })

  return router
}
