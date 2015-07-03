module.exports = function (grunt) {
	grunt.initConfig({
		less: {
			prod: {
				files: {
					"assets/styles/site.min.css": "assets-src/less/site.less"					
				},
				options: {
					compress: true
			    },
			},
			main: {
				files: {
					"assets/styles/main.min.css": "assets-src/less/main.less"					
				},
				options: {
					compress: true
			    }
			}
		}
	});

	grunt.task.loadNpmTasks("grunt-contrib-less");
	
	grunt.task.registerTask("default", ["less:prod", 'less:main']);
};