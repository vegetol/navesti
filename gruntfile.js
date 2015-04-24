module.exports = function(grunt) {

  grunt.initConfig({
    less: {
      portfolio: {
        files: {
          'css/style.css': 'css/style.less'
        }
      }
    },
    watch: {
      sass_portfolio: {
        files: 'css/**/*.less',
        tasks: ['less:portfolio'],
        options: {
          atBegin: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['less']);

};
