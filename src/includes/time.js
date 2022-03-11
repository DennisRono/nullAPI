const express = require('express');
var moment = require('moment-timezone');
var timezones = ['Africa/Nairobi'];
let currentTime = "";
timezones.forEach(function(timezone){
    var now = moment().utc();
    currentTime = now.tz(timezone).toString();
});

module.exports = currentTime;