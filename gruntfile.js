module.exports = function (grunt) {
	grunt.initConfig({
		less: {
			dev: {
				files: {
					"assets/styles/site.css": "assets-src/less/site.less"
				},
				options: {
					compress: false
			    },
			},
			prod: {
				files: {
					"assets/styles/site.min.css": "assets-src/less/site.less"					
				},
				options: {
					compress: true
			    },
			}
		}
	});

	grunt.task.loadNpmTasks("grunt-contrib-less");

	grunt.task.registerTask("dev", ["less:dev"]);
	grunt.task.registerTask("default", ["less:prod"]);
};