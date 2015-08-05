/// <reference path="../../assets/scripts/config.js"/>
/// <reference path="../../typings/knockout/knockout.d.ts" />
(function () {
    'use strict';
    // import shared settings from config on window
    var config = window.config;
    var initial = config.initial;
    var presets = config.presets;
    var options = config.options;
    var steps = config.steps;

    function ViewModel() {
        // setup initial model values
        this.step = ko.observable(initial.step);
        this.crust = ko.observable(initial.crust);
        this.size = ko.observable(initial.size);
        this.preset = ko.observable(initial.preset);
        this.sauce = ko.observable(initial.sauce);
        this.cheese = ko.observable(initial.cheese);
        this.toppings = ko.observableArray([]);
		
        // computed values
        this.nextText = ko.pureComputed(this.nextText, this);
        this.isStepStart = ko.pureComputed(this.isStepStart, this);
        this.isStepSauce = ko.pureComputed(this.isStepSauce, this);
        this.isStepToppings = ko.pureComputed(this.isStepToppings, this);
        this.isStepDone = ko.pureComputed(this.isStepDone, this);
        
        // subscribe to preset update event
        this.preset.subscribe(this.onPresetChanged, this);
    }
    
   ViewModel.prototype = {
        options: options,
        presets: presets,
        prev: function (vm) {
            ///<summary>moves to the previous step</summary>
            var newStep = vm.step() - 1;
            if (newStep < 0) {
                newStep = 0;
            }
            vm.step(newStep);
        },
        next: function (vm) {
            ///<summary>moves to the next step or reloads if on last step</summary>            
            var newStep = vm.step() + 1;
            if (newStep > steps.done) {
                window.location.reload();
                return;
            }
            vm.step(newStep);
        },
        nextText: function () {
            ///<summary>returns text to display in the next button</summary>
            return this.step() === steps.done ? 'Restart' : 'Next';
        },
        isStepStart: function() {
            ///<summary>return true if the current step is 'start'</summary>
            return this.step() === steps.start;
        },
        isStepSauce: function() {
            ///<summary>return true if the current step is 'sauce'</summary>            
            return this.step() === steps.sauce;
        },
        isStepToppings: function() {
            ///<summary>return true if the current step is 'toppings'</summary>            
            return this.step() === steps.toppings;
        },
        isStepDone: function() {
            ///<summary>return true if the current step is 'done'</summary>            
            return this.step() === steps.done;
        },
        onPresetChanged: function (newValue) {
            ///<summary>changes the pizza settings when a preset is selected</summary>
            
            // remove all toppings
            this.toppings.removeAll();
            
            for (var presetName in presets) {
                if (presetName !== newValue) {
                    // skip presets that don't match this
                    continue;
                }
                
                // get preset from presets
                var preset = presets[presetName];
                
                // change sauce and toppings to preset
                this.sauce(preset.sauce);
                this.toppings.push.apply(this.toppings, preset.toppings);
                break;
            }
        }
    };
    
    // apply bindings to dom
    ko.applyBindings(new ViewModel());
} ());