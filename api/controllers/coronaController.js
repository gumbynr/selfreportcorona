'use strict';
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CASES_COLLECTION = "cases";

var db; 
var express = require('express');
//landing page for selections made by email
var path = __dirname  + '/api/views/';

mongodb.MongoClient.connect('mongodb://heroku_h2hgx19t:mtem5s55c2ek42eqqfsecd07si@ds041367.mlab.com:41367/heroku_h2hgx19t', function (err, database) {	

  if (err) {
   console.log(err);
   process.exit(1);
  }

  //Save database object from the callback for reuse.
  db = database.db('heroku_h2hgx19t');
  console.log("Database connection ready");
});


exports.home = function(req, res) {

	db.collection(CASES_COLLECTION).find({"likelihood": {$gt:0}}).count(function(err, count) {
		  if (err) {
			  res.status(404).json({response:err});
		  }
		  else {
			db.collection(CASES_COLLECTION).aggregate([{"$match":{"likelihood":{"$gt":0}}},{$group : {_id:"$zipcode", count : {$sum : 1}}}]).toArray(function(err,zipDoc) {
		  		if (err) {
			  		res.status(404).json({response:err});
		  		} else {
					res.render(path + "home.html",{count:count,zipDoc:zipDoc});
								}
				});
		       }
	  });

};

exports.update_cases = function(req, res) {
	const percent = Number(req.body.likelihood);
	req.body.likelihood = percent;
	req.body.created_at = new Date();

	db.collection(CASES_COLLECTION).insertOne(req.body, function(err, doc) {
		  if (err) {
			  res.status(404).json({response:err});
		  }
		  else {
			db.collection(CASES_COLLECTION).find({"likelihood": {$gt:0}}).count(function(err, count) {
		  		if (err) {
			  		res.status(404).json({response:err});
		  		}
		  		else {
					db.collection(CASES_COLLECTION).find({"zipcode": req.body.zipcode,"likelihood": {$gt:0}}).count(function(err, zipcount) {
		  				if (err) {
			  				res.status(404).json({response:err});
		  				}
		  				else {
							res.render(path + "statistics.html",{count:count,zipcode:req.body.zipcode,zipcount:zipcount});
		       				}
	  				});
		       		}
	  		});
		       }
	  });
};

exports.google_map = function(req, res) {

	db.collection(CASES_COLLECTION).find({"likelihood":{"$gt":0}}).toArray(function(err,zipDoc) {
  		if (err) {
	  		res.status(404).json({response:err});
  		} else {
			res.render(path + "google_map.html",{zipDoc:zipDoc});
		}
	});
}

function getLatLngByZipcode(zipcode,callback) 
 {
    var NodeGeocoder = require('node-geocoder');
	var options = {
  		provider: 'google',
		httpAdapter: 'https', // Default
  		apiKey: '', // for Mapquest, OpenCage, Google Premier
  		formatter: null         // 'gpx', 'string', ...
	};
	 
      var geocoder = NodeGeocoder(options);
	  geocoder.geocode('29 champs elysée paris', function(err, res) {
	  	console.log(err);
  		  console.log(res);
      });


 }

