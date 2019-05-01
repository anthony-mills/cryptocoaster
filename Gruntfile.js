module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
        all: {
            files: [          
                {
                    //nonull: true,
                    expand: true,
                    cwd: '<%= pkg.srcPath %>/',
                    src: '**/*',
                    dest: '<%= pkg.wwwPath %>/'
                }
            ]
        }
    },
    lineremover: {
      all: {
            files: [
                {
                    expand: true,
                    cwd: '<%= pkg.wwwPath %>',
                    src: ['**/*.html'],
                    dest: '<%= pkg.wwwPath %>/'
                }
            ]
      }
    },
    jshint: {
      files: ['Gruntfile.js', '<%= pkg.srcPath %>/js/src/*.js', '<%= pkg.srcPath %>/js/*.min.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    processhtml: {
      all: { 
        options: {
            process: true,
            strip: true
        },                                                      
        files: [{                                                      
          '<%= pkg.wwwPath %>/index.html' : ['<%= pkg.wwwPath %>/index.html']
        }]
      }
    },        
    uglify: {
      all: {
        options: {
          globals: {
            sourceMap: true,
            compress: true,
            mangle: true
          }
        },
        files: [{
            expand: true,
            cwd: '<%= pkg.wwwPath %>/js',
            src: '**/*.js',
            dest: '<%= pkg.wwwPath %>/js'
        }]
      }  
    },    
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  // GRUNT PLUGINS
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('default', [
                                  'copy:all',
                                  'jshint',
                                  'uglify:all',
                                  'processhtml:all'
                                ]
                    );

};
