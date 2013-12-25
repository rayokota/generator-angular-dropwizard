'use strict';
var util = require('util');
var yeoman = require('yeoman-generator'),
    fs = require('fs'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    URI = require('URIjs'),
    URITemplate = require('URIjs/src/URITemplate');

var ResourceGenerator = module.exports = function ResourceGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the resource subgenerator with the argument ' + this.name + '.');

  fs.readFile('generator.json', 'utf8', function (err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    this.generatorConfig = JSON.parse(data);
  }.bind(this));
};

util.inherits(ResourceGenerator, yeoman.generators.NamedBase);

ResourceGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log('\nPlease specify a method for the resource:');

  var prompts = [{
    type: 'input',
    name: 'methodName',
    message: 'What is the name of the method?',
    default: 'mymethod'
  },
  {
    type: 'list',
    name: 'methodType',
    message: 'What is the type of the method?',
    choices: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    default: 'GET'
  },
  {
    type: 'input',
    name: 'methodPath',
    message: 'What is the URI path template of the method?',
  },
  {
    when: function (props) { return (/POST/).test(props.methodType); },
    type: 'input',
    name: 'formParams',
    message: 'Enter a list of form parameters, separated by commas'
  },
  {
    type: 'confirm',
    name: 'again',
    message: 'Would you like to enter another method or reenter a previous method?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.methods = this.methods || [];
    this.methods = _.reject(this.methods, function (method) { return method.methodName === props.methodName; });
    this.methods.push({ 
      methodName: props.methodName, 
      methodType: props.methodType, 
      methodPath: props.methodPath,
      formParams: props.formParams ? props.formParams.split(',') : []
    });

    if (props.again) {
      this.askFor();
    } else {
      cb();
    }
  }.bind(this));
};

ResourceGenerator.prototype.files = function files() {

  this.baseName = this.generatorConfig.baseName;
  this.packageName = this.generatorConfig.packageName;
  this.entities = this.generatorConfig.entities;
  this.resources = this.generatorConfig.resources;
  this.resources = _.reject(this.resources, function (resource) { return resource.name === this.name; }.bind(this));
  this.resources.push({ name: this.name, methods: this.methods});
  this.uriTemplateParts = function (uri) {
    var template = new URITemplate(uri).parse();
    return _.map( 
      _.filter(template.parts, function (part) { return part.variables; }), 
      function (part) { return part.variables[0].name; });
  };
  this.generatorConfig.resources = this.resources;
  this.generatorConfigStr = JSON.stringify(this.generatorConfig, null, '\t');

  var packageFolder = this.packageName.replace(/\./g, '/');
  this.template('_generator.json', 'generator.json');

  var serviceDir = this.baseName + '-service/';
  var serviceJavaDir = serviceDir + 'src/main/java/' + packageFolder + '/';
  var serviceResourcesDir = serviceJavaDir + 'resources/';
  this.template('../../app/templates/service/src/main/java/package/_AppService.java', serviceJavaDir + _s.capitalize(this.baseName) + 'Service.java');

  this.template('service/src/main/java/package/resources/_AppResource.java', serviceResourcesDir + _s.capitalize(this.name) + 'Resource.java');
};
