module.exports = (grunt) ->

  grunt.loadNpmTasks 'grunt-contrib-uglify'

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON 'wookmark.jquery.json'
    meta:
      banner: '/*!\n' +
        'jQuery <%= pkg.name %> plugin\n' +
        '@name jquery.<%= pkg.name %>.js\n' +
        '@author Christoph Ono (chri@sto.ph or @gbks)\n' +
        '@author Sebastian Helzle (sebastian@helzle.net or @sebobo)\n' +
        '@version <%= pkg.version %>\n' +
        '@date <%= grunt.template.today("mm/dd/yyyy") %>\n' +
        '@category jQuery plugin\n' +
        '@copyright (c) 2009-2014 Christoph Ono (www.wookmark.com)\n' +
        '@license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.\n' +
      '*/\n'
    uglify:
      dist:
        options:
          banner: '<%= meta.banner %>'
        files:
          'jquery.<%= pkg.name %>.min.js': ['jquery.<%= pkg.name %>.js']

  # Default task which watches, sass and coffee.
  #grunt.registerTask 'default', ['watch']
  # Release task to run tests then minify js and css
  grunt.registerTask 'release', ['uglify']
