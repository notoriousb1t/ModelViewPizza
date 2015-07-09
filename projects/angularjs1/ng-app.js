/// <reference path="../../typings/angular/angular1.d.ts" />
(function() {
	'use strict';
	var config = window.config;
	var initial = config.initial;
	var presets = config.presets;
	var options = config.options;
	
	var app = angular.module('app', []);
	
	app.controller('OrderController', ['$scope', function($scope) {
		// options
		$scope.options = options;		
		$scope.steps = config.steps;
		$scope.stepNames = config.stepNames;
		
		// setup initial model values
		$scope.step = initial.step;
		$scope.crust = initial.crust;
		$scope.size = initial.size;
		$scope.preset = initial.preset;
		$scope.sauce = initial.sauce;
		$scope.cheese = initial.cheese;
		$scope.toppings = [];
		
		// computed values
		$scope.isCustom = function() {
			return $scope.preset === initial.preset;
		};
		$scope.hasTopping = function(topping) {
			return $scope.toppings.indexOf(topping) !== -1;
		}
		$scope.nextText = function() {
			var isLastStep = $scope.stepNames.length - 1 == $scope.step;
			return isLastStep ? 'Restart' : 'Next';
		}
		
		// events
		$scope.toggleTopping = function(topping) {
			// get index of topping
			var indexOfTopping = $scope.toppings.indexOf(topping);
			if (indexOfTopping === -1) {
				// add topping if not exist
				$scope.toppings.push(topping);
				return;
			}
			
			// remove topping
			$scope.toppings.splice(indexOfTopping, 1);
		};
		$scope.prev = function()  {
			var newStep = $scope.step - 1;
			if (newStep < 0) {
				newStep = 0;
			}
			$scope.step = newStep;
		};
		$scope.next = function() {
			var newStep = $scope.step + 1
			if (newStep >= $scope.stepNames.length) {
				window.location.reload();
			}
			$scope.step = newStep;
		};
		$scope.submit = function() {
			console.log($scope);
		};
		// watch the preset
		$scope.$watch('preset', function (newValue, oldValue) {
			if (newValue === oldValue) {
				// skip updates when the preset hasn't changed
				return;
			}
			
			// remove all toppings
			$scope.toppings = [];
			
			for (var presetName in presets) {
				// skip presets that don't match this
				if (presetName !== newValue) {
					continue;
				}
				
				var preset = presets[presetName];
				
				// change sauce to preset
				$scope.sauce = preset.sauce;
				
				// add all preset toppings into
				$scope.toppings = preset.toppings.slice(0);
				break;
			}
    	});
	}]);
}());