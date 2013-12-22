'use strict';
var util = require('util'),
    yeoman = require('yeoman-generator'),
    fs = require('fs'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    pluralize = require('pluralize');

var EntityGenerator = module.exports = function EntityGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the entity subgenerator with the argument ' + this.name + '.');

  fs.readFile('generator.json', 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    this.generatorConfig = JSON.parse(data);
  }.bind(this));
};

util.inherits(EntityGenerator, yeoman.generators.NamedBase);

EntityGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log('\nPlease specify an attribute:');

  var prompts = [{
    type: 'input',
    name: 'attrName',
    message: 'What is the name of the attribute?',
    default: 'myattr'
  },
  {
    type: 'list',
    name: 'attrType',
    message: 'What is the type of the attribute?',
    //choices: ['String', 'int', 'long', 'boolean', 'DateTime'],
    choices: ['String', 'byte', 'short', 'int', 'long', 'float', 'double', 'boolean', 'DateTime'],
    default: 'String'
  },
  {
    type: 'confirm',
    name: 'again',
    message: 'Would you like to enter another attribute?',
    default: 'false'
  }];

  this.prompt(prompts, function (props) {
    this.attrs = this.attrs || [];
    this.attrs.push({ attrName: props.attrName, attrType: props.attrType });

    if (props.again) {
      this.askFor();
    } else {
      cb();
    }
  }.bind(this));
};

EntityGenerator.prototype.files = function files() {
  _.each(this.attrs,  function(num) { console.log('' + num.attrName + ' ' + num.attrType + '\n'); });

  this.pluralName = pluralize(this.name);
  this.baseName = this.generatorConfig.baseName;
  this.packageName = this.generatorConfig.packageName;
  this.entities = this.generatorConfig.entities;
  this.entities.push({ name: this.name, attrs: this.attrs});
  var packageFolder = this.packageName.replace(/\./g, '/');
  this.template('_generator.json', 'generator.json');

  var serviceDir = this.baseName + '-service/';
  var serviceJavaDir = serviceDir + 'src/main/java/' + packageFolder + '/';
  var serviceModelDir = serviceJavaDir + 'model/';
  var serviceResourcesDir = serviceJavaDir + 'resources/';
  var serviceStoreDir = serviceJavaDir + 'store/';
  this.template('service/src/main/java/package/model/_Entity.java', serviceModelDir + _s.capitalize(this.name) + '.java');
  this.template('service/src/main/java/package/resources/_EntityResource.java', serviceResourcesDir + _s.capitalize(this.name) + 'Resource.java');
  this.template('service/src/main/java/package/store/_EntityDAO.java', serviceStoreDir + _s.capitalize(this.name) + 'DAO.java');

  var resourceDir = serviceDir + 'src/main/resources/';
  var assetsDir = resourceDir + 'assets/';
  var assetsAppDir = assetsDir + 'app/';
  var assetsAppJsDir = assetsAppDir + 'js/';
  var assetsEntityJsDir = assetsAppJsDir + this.name + '/';
  var assetsAppViewDir = assetsAppDir + 'views/';
  var assetsEntityViewDir = assetsAppViewDir + this.name + '/';
  this.mkdir(assetsEntityJsDir);
  this.mkdir(assetsEntityViewDir);
  this.template('service/src/main/resources/assets/app/js/entity/_entity-controller.js', assetsEntityJsDir + this.name + '-controller.js');
  this.template('service/src/main/resources/assets/app/js/entity/_entity-router.js', assetsEntityJsDir + this.name + '-router.js');
  this.template('service/src/main/resources/assets/app/js/entity/_entity-service.js', assetsEntityJsDir + this.name + '-service.js');
  this.template('service/src/main/resources/assets/app/views/entity/_entities.html', assetsEntityViewDir + this.pluralName + '.html');
};
