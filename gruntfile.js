module.exports = function (grunt) {
    grunt.initConfig({
        less: {
            default: {
                files: {
                    'assets/styles/main.min.css': 'assets-src/less/main.less'
                },
                options: {
                    compress: true
                }
            }
        }
    });

    grunt.task.loadNpmTasks('grunt-contrib-less');
    grunt.task.registerTask('default', ['less']);
};