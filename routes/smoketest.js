var express = require('express');
var router = express.Router();

import InputService from '../services/inputService'

module.exports = (client) => {

  router.get('/', function(req, res, next) {
    res.send('hello there sailor');
  });

  router.post('/userdata',function(req,res,next){

    console.log('value of req.body ', req.body);

    var inputcall = new InputService()

    var newUserData = inputcall.userdata({
      dataArray: req.body.data
    });

    res.json({
      status: 'OK',
      response: newUserData
    })

  });

  router.get('/createindependentvariabletable', function(req,res,next){
    // var query = client.query("SELECT * FROM beatles WHERE name = $1", ['john']);
    client.query('CREATE TABLE independentvariables(year integer, age integer, gender integer, rent integer, income integer, lat integer, long integer, bin integer);')

    res.json({
      status: 'OK',
      response: 'check postgres to see stuff happening'
    })
  })

  router.get('/createdependentvariabletable', function(req,res,next){

    client.query('CREATE TABLE dependentvariables(year integer, crime integer, lat integer, long integer, bin integer);')

    res.json({
      status: 'OK',
      response: 'check postgres to see stuff happening'
    })
  })


  router.get('/postgrestest',function(req,res,next){

    console.log('inside postgrestest');

    client.query('CREATE TABLE postgrestest(name text, height integer);')

    client.query({
        name: 'insert beatle',
        text: "INSERT INTO postgrestest(name, height) values($1, $2)",
        values: ['George', 70]
    });

    res.json({
      status: 'OK',
      response: 'check postgres to see stuff happening'
    })

  });

  return router
}
