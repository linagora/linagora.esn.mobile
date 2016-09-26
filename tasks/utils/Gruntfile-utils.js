'use strict';

var util = require('util');
var fs = require('fs-extra');
var path = require('path');

function _args(grunt) {
  var opts = ['test', 'chunk', 'ci', 'reporter'];
  var args = {};
  opts.forEach(function(optName) {
    var opt = grunt.option(optName);
    if (opt) {
      args[optName] = '' + opt;
    }
  });
  return args;
}

function _taskSuccessIfMatch(grunt, regex, info) {
  return function(chunk) {
    var done = grunt.task.current.async();
    var out = '' + chunk;
    var started = regex;
    if (started.test(out)) {
      grunt.log.write(info);
      done(true);
    }
  };
}

function GruntfileUtils(grunt, servers) {
  this.grunt = grunt;
  this.servers = servers;
  this.args = _args(grunt);
}

GruntfileUtils.prototype.command = function command() {
  var servers = this.servers;
  var commandObject = {};

  commandObject.redis = util.format('%s --port %s %s %s',
      servers.redis.cmd,
      (servers.redis.port ? servers.redis.port : '23457'),
      (servers.redis.pwd ? '--requirepass' + servers.redis.pwd : ''),
      (servers.redis.conf_file ? servers.redis.conf_file : ''));

  commandObject.mongo = function(repl) {
    var replset = repl ?
      util.format('--replSet \'%s\' --smallfiles --oplogSize 128', servers.mongodb.replicat_set_name) :
      '--nojournal';

    return util.format('%s --dbpath %s --port %s %s',
      servers.mongodb.cmd,
      servers.mongodb.dbpath,
      (servers.mongodb.port ? servers.mongodb.port : '23456'),
      replset);
  };

  return commandObject;
};

GruntfileUtils.prototype.shell = function shell() {
  var grunt = this.grunt;

  return {
    newShell: function(command, regex, info) {
      return {
        command: command,
        options: {
          async: false,
          stdout: _taskSuccessIfMatch(grunt, regex, info),
          stderr: grunt.log.error,
          canKill: true
        }
      };
    }
  };
};

GruntfileUtils.prototype.runGrunt = function runGrunt() {
  var grunt = this.grunt;
  var args = this.args;

  function _process(res) {
    if (res.fail) {
      grunt.config.set('esn.tests.success', false);
      grunt.log.writeln('failed');
    } else {
      grunt.config.set('esn.tests.success', true);
      grunt.log.writeln('succeeded');
    }
  }
  return {
    newProcess: function(task) {
      return {
        options: {
          log: true,
          stdout: grunt.log.write,
          stderr: grunt.log.error,
          args: args,
          process: _process,
          task: task
        },
        src: ['Gruntfile-tests.js']
      };
    }
  };
};

GruntfileUtils.prototype.setupEnvironment = function setupEnvironment() {
  var servers = this.servers;

  return function() {
    try {
      fs.mkdirsSync(servers.mongodb.dbpath);
      fs.mkdirsSync(servers.tmp);
    } catch (err) {
      throw err;
    }
  };
};

GruntfileUtils.prototype.cleanEnvironment = function cleanEnvironment() {
  var grunt = this.grunt;
  var servers = this.servers;

  return function() {
    function _removeAllFilesInDirectory(directory) {
      var files;
      try {
        files = fs.readdirSync(directory);
      } catch (e) {
        return;
      }
      if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var filePath = directory + '/' + files[i];
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          } else {
            _removeAllFilesInDirectory(filePath);
          }
        }
      }
      try {
        fs.rmdirSync(directory);
      } catch (e) {
        console.error(e);
      }
    }

    var testsFailed = !grunt.config.get('esn.tests.success');
    var applog = path.join(servers.tmp, 'application.log');

    if (testsFailed && fs.existsSync(applog)) {
      fs.copySync(applog, 'application.log');
    }
    _removeAllFilesInDirectory(servers.tmp);

    if (testsFailed) {
      grunt.log.writeln('Tests failure');
      grunt.fail.fatal('error', 3);
    }

    var done = this.async();
    done(true);
  };
};

module.exports = GruntfileUtils;
