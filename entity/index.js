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
    choices: ['String', 'Integer', 'Long', 'Float', 'Double', 'Boolean', 'Date', 'Enum'],
    default: 'String'
  },
  {
    when: function (props) { return (/String/).test(props.attrType); },
    type: 'input',
    name: 'minLength',
    message: 'Enter the minimum length for the String attribute, or hit enter:',
    validate: function (input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  },
  {
    when: function (props) { return (/String/).test(props.attrType); },
    type: 'input',
    name: 'maxLength',
    message: 'Enter the maximum length for the String attribute, or hit enter:',
    validate: function (input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  },
  {
    when: function (props) { return (/Integer|Long|Float|Double/).test(props.attrType); },
    type: 'input',
    name: 'min',
    message: 'Enter the minimum value for the numeric attribute, or hit enter:',
    validate: function (input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  },
  {
    when: function (props) { return (/Integer|Long|Float|Double/).test(props.attrType); },
    type: 'input',
    name: 'max',
    message: 'Enter the maximum value for the numeric attribute, or hit enter:',
    validate: function (input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  },
  {
    when: function (props) { return (/Date/).test(props.attrType); },
    type: 'list',
    name: 'dateConstraint',
    message: 'Constrain the date as follows:',
    choices: ['None', 'Past dates only', 'Future dates only'],
    filter: function (input) {
      if (/Past/.test(input)) return 'Past';
      if (/Future/.test(input)) return 'Future';
      return '';
    },
    default: 'None'
  },
  {
    when: function (props) { return (/Enum/).test(props.attrType); },
    type: 'input',
    name: 'enumValues',
    message: 'Enter an enumeration of values, separated by commas'
  },
  {
    type: 'confirm',
    name: 'required',
    message: 'Is the attribute required to have a value?',
    default: true
  },
  {
    type: 'confirm',
    name: 'again',
    message: 'Would you like to enter another attribute or reenter a previous attribute?',
    default: true
  }];

  this.prompt(prompts, function (props) {
    this.attrs = this.attrs || [];
    var attrType = props.attrType;
    this.attrs = _.reject(this.attrs, function (attr) { return attr.attrName === props.attrName; });
    this.attrs.push({ 
      attrName: props.attrName, 
      attrType: attrType, 
      minLength: props.minLength,
      maxLength: props.maxLength,
      min: props.min,
      max: props.max,
      dateConstraint: props.dateConstraint,
      enumValues: props.enumValues ? props.enumValues.split(',') : [],
      required: props.required 
    });

    if (props.again) {
      this.askFor();
    } else {
      cb();
    }
  }.bind(this));
};

EntityGenerator.prototype.files = function files() {

  this.baseName = this.generatorConfig.baseName;
  this.packageName = this.generatorConfig.packageName;
  this.entities = this.generatorConfig.entities;
  this.entities = _.reject(this.entities, function (entity) { return entity.name === this.name; }.bind(this));
  this.entities.push({ name: this.name, attrs: this.attrs});
  this.resources = this.generatorConfig.resources;
  this.pluralize = pluralize;
  this.generatorConfig.entities = this.entities;
  this.generatorConfigStr = JSON.stringify(this.generatorConfig, null, '\t');

  var packageFolder = this.packageName.replace(/\./g, '/');
  this.template('_generator.json', 'generator.json');

  var applicationDir = this.baseName + '-application/';
  var applicationJavaDir = applicationDir + 'src/main/java/' + packageFolder + '/';
  var applicationDaosDir = applicationJavaDir + 'daos/';
  var applicationModelsDir = applicationJavaDir + 'models/';
  var applicationResourcesDir = applicationJavaDir + 'resources/';
  var resourceDir = applicationDir + 'src/main/resources/';
  var assetsDir = resourceDir + 'assets/';
  var assetsAppDir = assetsDir + 'app/';
  this.template('../../app/templates/application/src/main/java/package/_AppApplication.java', applicationJavaDir + _s.capitalize(this.baseName) + 'Application.java');
  this.template('../../app/templates/application/src/main/resources/assets/app/_index.html', assetsAppDir + 'index.html');

  this.template('application/src/main/java/package/daos/_EntityDAO.java', applicationDaosDir + _s.capitalize(this.name) + 'DAO.java');
  this.template('application/src/main/java/package/models/_Entity.java', applicationModelsDir + _s.capitalize(this.name) + '.java');
  this.template('application/src/main/java/package/resources/_EntityResource.java', applicationResourcesDir + _s.capitalize(this.name) + 'Resource.java');
  _.each(this.attrs, function (attr) {
    if (attr.attrType === 'Enum') {
      this.attr = attr;
      this.template('application/src/main/java/package/models/_AttrEnum.java', applicationModelsDir + _s.capitalize(attr.attrName) + 'Enum.java');
    }
  }.bind(this));

  var resourceDir = applicationDir + 'src/main/resources/';
  var assetsDir = resourceDir + 'assets/';
  var assetsAppDir = assetsDir + 'app/';
  var assetsAppJsDir = assetsAppDir + 'js/';
  var assetsEntityJsDir = assetsAppJsDir + this.name + '/';
  var assetsAppViewDir = assetsAppDir + 'views/';
  var assetsEntityViewDir = assetsAppViewDir + this.name + '/';
  this.mkdir(assetsEntityJsDir);
  this.mkdir(assetsEntityViewDir);
  this.template('application/src/main/resources/assets/app/js/entity/_entity-controller.js', assetsEntityJsDir + this.name + '-controller.js');
  this.template('application/src/main/resources/assets/app/js/entity/_entity-router.js', assetsEntityJsDir + this.name + '-router.js');
  this.template('application/src/main/resources/assets/app/js/entity/_entity-application.js', assetsEntityJsDir + this.name + '-application.js');
  this.template('application/src/main/resources/assets/app/views/entity/_entities.html', assetsEntityViewDir + pluralize(this.name) + '.html');
};
