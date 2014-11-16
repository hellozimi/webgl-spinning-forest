/* global THREE */

"use strict";

var tree,
    helpers;

tree = function(width, height) {
  width = width || 20;
  height = height || 100;
  //var wrap = new THREE.Object3D();

  THREE.Object3D.call(this);

  this.castShadow = true;
  this.receiveShadow = true;

  var part = height/10;

  var topSection = helpers.generateCylinder(width, part*5);
  topSection.position.y = part*10 - (part*2.5);
  topSection.rotation.y = Math.random() * Math.PI;
  topSection.castShadow = true;
  topSection.receiveShadow = true;
  this.add(topSection);

  var bottomSection = helpers.generateCylinder(width, part*5);
  bottomSection.position.y = part*2+part*2.5;
  bottomSection.rotation.y = Math.random() * Math.PI;
  bottomSection.castShadow = true;
  bottomSection.receiveShadow = true;
  this.add(bottomSection);

  var stem = helpers.generateStem(width, part*2);
  stem.position.y = part;
  stem.castShadow = true;
  stem.receiveShadow = true;
  this.add(stem);

  this.topSection = topSection;
  this.bottomSection = bottomSection;

  this.topSpeed = Math.random() * Math.PI;
  this.bottomSpeed = -Math.random() * Math.PI;
};

tree.prototype = Object.create( THREE.Object3D.prototype );

tree.prototype.update = function(dt) {
  this.topSection.rotation.y += this.topSpeed * dt;
  this.bottomSection.rotation.y += this.bottomSpeed * dt;
};

helpers = {
  generateCylinder: function(width, height) {
    var mat = new THREE.MeshLambertMaterial({ color: 0x146f45, shading: THREE.FlatShading });
    var geometry = new THREE.CylinderGeometry(0, width, height, 7, 1, 0);
    geometry.computeFaceNormals();
    return new THREE.Mesh(geometry, mat);
  },
  generateStem: function(width, height) {
    var mat = new THREE.MeshLambertMaterial({ color: 0x4d3c15, shading: THREE.FlatShading });
    var geometry = new THREE.CylinderGeometry(width/3, width/3, height, 8, 1, 0);
    geometry.computeFaceNormals();
    return new THREE.Mesh(geometry, mat);
  }
};




module.exports = tree;
