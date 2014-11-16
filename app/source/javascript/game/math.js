
"use strict";

var math;

math = {
  degreesToRadians: function(degrees) {
    return degrees / 180 * Math.PI;
  },
  random: function(min, max) {
    return (Math.random() * (max - min + 1) | 0) + min;
  }
};

module.exports = math;
