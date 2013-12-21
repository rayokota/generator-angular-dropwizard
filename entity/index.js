'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var _ = require('lodash');

var EntityGenerator = module.exports = function EntityGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the entity subgenerator with the argument ' + this.name + '.');
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
    choices: ['String', 'byte', 'short', 'int', 'long', 'float', 'double', 'boolean', 'Date'],
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
  this.copy('somefile.js', 'somefile.js');
};
