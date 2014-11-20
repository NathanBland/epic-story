var express = require("express");
var ensureLogin = require('connect-ensure-login');
var ensureAuthenticated = ensureLogin.ensureAuthenticated;

exports.setup = function() {
    var router = express.Router();
    
    router.get('/', function(req, res,next){
       res.render('index', {
           title: "Epic Story"
       }) 
    });
}