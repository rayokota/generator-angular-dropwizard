'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    _ = require('lodash'),
    _s = require('underscore.string'),
    pluralize = require('pluralize'),
    asciify = require('asciify');

var AngularDropwizardGenerator = module.exports = function AngularDropwizardGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AngularDropwizardGenerator, yeoman.generators.Base);

AngularDropwizardGenerator.prototype.askFor = function askFor() {

  var cb = this.async();

  console.log('\n' +
    '+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+-+\n' +
    '|a|n|g|u|l|a|r| |d|r|o|p|w|i|z|a|r|d| |g|e|n|e|r|a|t|o|r|\n' +
    '+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+-+\n' +
    '\n');

  var prompts = [{
    type: 'input',
    name: 'baseName',
    message: 'What is the base name of your application?',
    default: 'myapp'
  },
  {
    type: 'input',
    name: 'packageName',
    message: 'What is your default package name?',
    default: 'com.mycompany.myapp'
  }];

  this.prompt(prompts, function (props) {
    this.baseName = props.baseName;
    this.packageName = props.packageName;

    cb();
  }.bind(this));
};

AngularDropwizardGenerator.prototype.app = function app() {

  this.entities = [];
  this.resources = [];
  this.generatorConfig = {
    "baseName": this.baseName,
    "packageName": this.packageName,
    "entities": this.entities,
    "resources": this.resources
  };
  this.generatorConfigStr = JSON.stringify(this.generatorConfig, null, '\t');

  this.template('_generator.json', 'generator.json');
  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('bowerrc', '.bowerrc');
  this.template('Gruntfile.js', 'Gruntfile.js');
  this.copy('gitignore', '.gitignore');

  var packageFolder = this.packageName.replace(/\./g, '/');
  this.copy('findbugs-exclude.xml', 'findbugs-exclude.xml');
  this.template('_pom.xml', 'pom.xml');

  var apiDir = this.baseName + '-api/';
  this.mkdir(apiDir);
  this.template('api/_pom.xml', apiDir + 'pom.xml');

  var clientDir = this.baseName + '-client/';
  var clientJavaDir = clientDir + 'src/main/java/' + packageFolder + '/client/';
  this.mkdir(clientJavaDir);
  this.template('client/_pom.xml', clientDir + 'pom.xml');
  this.template('client/src/main/java/package/client/_AppClient.java', clientJavaDir + _s.capitalize(this.baseName) + 'Client.java');

  var applicationDir = this.baseName + '-application/';
  var applicationJavaDir = applicationDir + 'src/main/java/' + packageFolder + '/';
  var applicationConfigDir = applicationJavaDir + 'config/';
  var applicationDaosDir = applicationJavaDir + 'daos/';
  var applicationModelsDir = applicationJavaDir + 'models/';
  var applicationResourcesDir = applicationJavaDir + 'resources/';
  this.mkdir(applicationJavaDir);
  this.mkdir(applicationConfigDir);
  this.mkdir(applicationDaosDir);
  this.mkdir(applicationModelsDir);
  this.mkdir(applicationResourcesDir);
  this.template('application/_pom.xml', applicationDir + 'pom.xml');
  this.template('application/_app.yml', applicationDir + this.baseName + '.yml');
  this.copy('application/spring_loaded/springloaded-1.1.3.jar', applicationDir + 'spring_loaded/springloaded-1.1.3.jar');
  this.copy('application/spring_loaded/springloaded-1.1.4.jar', applicationDir + 'spring_loaded/springloaded-1.1.4.jar');
  this.template('application/src/main/java/package/_AppApplication.java', applicationJavaDir + _s.capitalize(this.baseName) + 'Application.java');
  this.template('application/src/main/java/package/config/_AppConfiguration.java', applicationConfigDir + _s.capitalize(this.baseName) + 'Configuration.java');

  var resourceDir = applicationDir + 'src/main/resources/';
  var assetsDir = resourceDir + 'assets/';
  var assetsAppDir = assetsDir + 'app/';
  var assetsAppCssDir = assetsAppDir + 'css/';
  var assetsAppJsDir = assetsAppDir + 'js/';
  var assetsAppViewDir = assetsAppDir + 'views/';
  var assetsTestDir = assetsDir + 'test/';
  var assetsTestConfigDir = assetsTestDir + 'config/';
  var assetsTestE2EDir = assetsTestDir + 'e2e/';
  var assetsTestUnitDir = assetsTestDir + 'unit/';
  this.mkdir(resourceDir);
  this.mkdir(assetsDir);
  this.mkdir(assetsAppDir);
  this.mkdir(assetsAppCssDir);
  this.mkdir(assetsAppJsDir);
  this.mkdir(assetsAppViewDir);
  this.mkdir(assetsTestDir);
  this.mkdir(assetsTestE2EDir);
  this.mkdir(assetsTestUnitDir);
  this.template('application/src/main/resources/assets/app/_index.html', assetsAppDir + 'index.html');
  this.copy('application/src/main/resources/assets/app/css/app.css', assetsAppCssDir + 'app.css');
  this.template('application/src/main/resources/assets/app/js/_app.js', assetsAppJsDir + 'app.js');
  this.template('application/src/main/resources/assets/app/js/home/_home-controller.js', assetsAppJsDir + 'home/home-controller.js');
  this.template('application/src/main/resources/assets/app/views/home/_home.html', assetsAppViewDir + 'home/home.html');

  var cb = this.async();

  asciify(this.baseName, function (err, res) {
    this.banner = res;
    this.template('application/src/main/resources/_banner.txt', resourceDir + 'banner.txt');

    cb();
  }.bind(this));
};

AngularDropwizardGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
