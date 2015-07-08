/// <reference path="../typings/angular/angular1.d.ts" />
(function() {
	'use strict';
	var config = window.config;
	var initial = config.initial;
	var presets = config.presets;
	var options = config.options;
	
	var app = angular.module('app', []);
	
	app.controller('OrderController', ['$scope', function($scope) {
		$scope.options = options;		
		$scope.steps = config.steps;
		$scope.stepNames = config.stepNames;
		$scope.order = {
			step: initial.step,
			crust: initial.crust,
			size: initial.size,
			preset: initial.preset,
			sauce: initial.sauce,
			cheese: initial.cheese,
			toppings: [],
			isCustom: function() {
				return $scope.order.preset() === initial.preset;
			}
		};
		$scope.changePreset = function(vm, newValue) {
			// remove all toppings
			$scope.order.toppings.removeAll();
			
			for (var presetName in presets) {
				// skip presets that don't match this
				if (presetName !== newValue) {
					continue;
				}
				
				var preset = presets[presetName];
				
				// change sauce to preset
				this.order.sauce(preset.sauce);
				
				// add all preset toppings into
				var toppings = $scope.order.toppings;
				toppings.push.apply(toppings, preset.toppings);
				break;
			}
		};
		$scope.next = function() {
			var newStep = $scope.order.step + 1
			if (newStep >= $scope.stepNames.length) {
				newStep = 0;
			}
			$scope.order.step = newStep;
		};
		$scope.nextText = function() {
			var isLastStep = $scope.stepNames.length - 1 == $scope.order.step;
			return isLastStep ? 'Restart!' : 'Next';
		}
		$scope.submit = function() {
			console.log($scope);
		};
		$scope.reload = function() {
			window.location.reload();
		};
	}]);
}());