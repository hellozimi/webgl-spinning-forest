(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
/* globals THREE, requestAnimationFrame */

"use strict";

var gmath = require('./math'),
    Tree = require('./Tree'),
    instance;

instance = function() {
  this.init();
  this.setup();
};

instance.prototype = {
  init: function() {
    var width = window.innerWidth;
    this.width = width;
    var height = window.innerHeight;
    this.height = height;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);

    document.body.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x143415, 50, 450);
    this.renderer = renderer;
    this.scene = scene;

    var clock = new THREE.Clock();
    this.clock = clock;

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  },
  setup: function() {
    var scene = this.scene,
        width = this.width,
        height = this.height;

    var camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 10000);
    camera.position.y = 100;
    camera.position.z = 200;

    this.camera = camera;

    scene.add(camera);

    var light = new THREE.SpotLight(0xffffff);
    light.position.set(100, 800, 500);
    light.castShadow = true;
    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 400;
    light.shadowCameraFov = 36;
    light.shadowDarkness = 1.0;
    light.shadowCameraVisible = true;
    light.intensity = 1.0;

    scene.add(light);

    var mat = new THREE.MeshLambertMaterial({
      color: 0x39601a,
      shading: THREE.FlatShading
    });

    var w = 512,
        h = 512;
    var geometry = new THREE.PlaneGeometry(1024, 512, 100, 50);

    var formula = function(x) {
      return Math.pow(Math.sin(x * Math.PI), 2) / 2;
    };

    for (var y = 0; y < 51; y++) {
      for (var x = 0; x < 101; x++) {
        if (x*y >= geometry.vertices.length) {
          continue;
        }
        var py = y / 51;
        var expy = formula(py);
        var point = geometry.vertices[x*y];
        point.z = expy*10;
      }
    }
    geometry.computeFaceNormals();

    var mesh = new THREE.Mesh(geometry, mat);
    mesh.rotation.x = Math.PI * -0.5;
    mesh.receiveShadow = true;
    scene.add(mesh);

    this.trees = [];

    for (var i = 0; i < 20; i++) {
      var tree = new Tree(10, 50);
      tree.position.x = gmath.random(-256, 256);
      tree.position.z = gmath.random(25, -256);
      scene.add(tree);
      this.trees.push(tree);

      var helper = new THREE.BoundingBoxHelper(tree, 0xff0000);
      helper.update();
      // If you want a visible bounding box
      scene.add(helper);
    }

    var boxMat = new THREE.MeshBasicMaterial({ color: 0xff66cc });
    boxMat.side = THREE.DoubleSide;
    var boxGeometry = new THREE.BoxGeometry(1024, 512, 512);
    var box = new THREE.Mesh(boxGeometry, boxMat);
    scene.add(box);


    camera.lookAt(mesh.position);
    this.update(0);
  },
  update: function(time) {
    var clock = this.clock,
        dt = clock.getDelta();

    // Update

    for (var i = 0; i < this.trees.length; i++) {
      this.trees[i].update(dt);
    }


    this.draw(dt);
    window.requestAnimationFrame(this.update.bind(this));
  },
  draw: function(dt) {
    var renderer = this.renderer,
        scene = this.scene,
        camera = this.camera;
    // Draw others
    renderer.render(scene, camera);
  },

  onWindowResize: function(evt) {
    var camera = this.camera,
        renderer = this.renderer;
    var w = window.innerWidth,
        h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
  }
};

module.exports = instance;

},{"./Tree":1,"./math":3}],3:[function(require,module,exports){

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

},{}],4:[function(require,module,exports){
"use strict";

var Game = new (require('./game/game'))();

},{"./game/game":2}]},{},[4]);