/// <reference path="../../assets/scripts/config.js"/>
/// <reference path="../../typings/angular/angular1.d.ts" />
(function () {
    'use strict';
    // import shared settings from config on window
    var config = window.config;
    var initial = config.initial;
    var presets = config.presets;
    var options = config.options;

    // define the angular module 'app'
    var app = angular.module('app', []);

    app.controller('OrderController', ['$scope', function ($scope) {
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
        $scope.hasTopping = function (topping) {
            ///<summary>returns true if topping is selected</summary>
            return $scope.toppings.indexOf(topping) !== -1;
        };
        $scope.nextText = function () {
            ///<summary>returns text to display in the next button</summary>
            var isLastStep = $scope.stepNames.length - 1 == $scope.step;
            if (isLastStep) {
                return 'Restart';
            }
            return 'Next';
        };
		
        // events
        $scope.toggleTopping = function (topping) {
            ///<summary>adds/removes toppings from the selected toppings</summary>
            // find topping index
            var indexOfTopping = $scope.toppings.indexOf(topping);
            if (indexOfTopping === -1) {
                // add topping if it does not exist
                $scope.toppings.push(topping);
                return;
            }
			
            // remove topping if it exists
            $scope.toppings.splice(indexOfTopping, 1);
        };
        $scope.prev = function () {
            ///<summary>moves to the previous step</summary>
            var newStep = $scope.step - 1;
            if (newStep < 0) {
                newStep = 0;
            }
            $scope.step = newStep;
        };
        $scope.next = function () {
            ///<summary>moves to the next step or reloads if on last step</summary>            
            var newStep = $scope.step + 1
            if (newStep >= $scope.stepNames.length) {
                window.location.reload();
            }
            $scope.step = newStep;
        };
        
        $scope.$watch('preset', function (newValue, oldValue) {
            ///<summary>changes the pizza settings when a preset is selected</summary>            
            if (newValue === oldValue) {
                // skip updates when the preset hasn't changed
                return;
            }
			
            // remove all toppings
            $scope.toppings = [];

            for (var presetName in presets) {
                if (presetName !== newValue) {
                    // skip presets that don't match this
                    continue;
                }

                // get preset from presets
                var preset = presets[presetName];
				
                // change sauce and toppings to preset
                $scope.sauce = preset.sauce;
                $scope.toppings = preset.toppings.slice(0);
                break;
            }
        });
    }]);
} ());