module.exports = function(grunt) {
  var port = grunt.option('port') || 8000;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';\n\n',
      },
      dist: {
        src: 'js/app/*.js',
        dest: 'js/app.js'
      },
    },

    connect: {
      server: {
        options: {
          port: port,
          base: '.',
          livereload: true
        }
      }
    },

    watch: {
      options: {
          livereload: true
      },
      js: {
        files: 'js/app/*.js',
        tasks: 'concat'
      },
      css: {
        files: 'css/styles.css'
      },
      html: {
          files: [ 'index.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('serve', ['concat', 'connect', 'watch']);
  grunt.registerTask('server', ['concat', 'connect', 'watch']);
};