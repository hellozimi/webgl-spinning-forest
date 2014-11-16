var path = require('path'),

    config;

config = function(grunt) {
  require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

  var cfg = {
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        globalstrict: true,
        trailing: true,
        globals: {
          window: true,
          document: true,
          arguments: true,
          Math: true,
          console: true,
          module: true,
          curly: true,
          require: true
        }
      },
      src: ['app/source/javascript/**/*.js']
    },
    browserify: {
      dev: {
        src: 'app/source/javascript/main.js',
        dest: 'app/public/javascript/main.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: 'app'
        }
      }
    },
    sass: {
      dev: {
        options: {
          sourceMap: true,
          outputStyle: 'compressed'
        },
        files: {
          'app/public/css/screen.css': 'app/source/sass/screen.scss'
        }
      }
    },
    shell: {
      bower: {
        command: path.resolve(__dirname + '/node_modules/.bin/bower install'),
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      },
      server: {
        command: [
          'cd app',
          'python -m SimpleHTTPServer'
        ].join('&&'),
        options: {
          stdout: true,
          stderr: true,
          failOnError: true,
          runInBackground: true
        }
      },
      buildDir: {
        command: 'mkdir build',
        options: {
          stdout: true,
          stderr: true,
          failOnError: false
        }
      }
    },
    watch: {
      js: {
        files: ['app/source/javascript/**/*.js'],
        tasks: ['js_dev'],
        options: {
          livereload: true,
          spawn: true
        }
      },
      css: {
        files: ['app/source/sass/**/*.scss'],
        tasks: ['css_dev'],
        options: {
          spawn: false
        }
      }
    },

    wiredep: {
      target: {
        src: ['app/{,*/}*.html']
      }
    },

    // Dist
    clean: {
      dist: {
        src: 'build/'
      }
    },
    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'build'
      }
    },
    usemin: {
      html: ['build/{,*/}*.html']
    },
    copy: {
      dist: {
        src: 'app/index.html',
        dest: 'build/index.html'
      }
    }
  };

  grunt.initConfig(cfg);

  grunt.registerTask('dev', ['shell:bower', 'css_dev', 'js_dev', 'wiredep']);
  grunt.registerTask('serve', ['dev', 'connect:server', 'watch']);
  grunt.registerTask('css_dev', ['sass:dev']);
  grunt.registerTask('js_dev', ['jshint', 'browserify:dev']);

  grunt.registerTask('build', [
    'css_dev',
    'js_dev',
    'shell:buildDir',
    'clean:dist',
    'copy:dist',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'usemin'
    ]);

  // Dist
  // * Clean dir
  // * Minify css to new dir
  // * Concat all included js
  // * copy everything from /app root
};

module.exports = config;
