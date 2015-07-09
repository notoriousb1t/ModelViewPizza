/// <reference path="../../typings/knockout/knockout.d.ts" />

(function () {
    'use strict';
    // import configuration from config.js
    var config = window.config;
    var initial = config.initial;
    var presets = config.presets;
    var options = config.options;

    function ViewModel() {
        var self = this;
		
        // setup initial order
        this.order = {
            crust: ko.observable(initial.crust),
            size: ko.observable(initial.size),
            preset: ko.observable(initial.preset),
            sauce: ko.observable(initial.sauce),
            cheese: ko.observable(initial.cheese),
            toppings: ko.observableArray([]),
            isCustom: ko.pureComputed(function () {
                return self.order.preset() === initial.preset;
            })
        };
		
        // setup explicit change event for presets
        this.order.preset.subscribe(function (newValue) {
            self.changePreset(self, newValue);
        });
    }

    ViewModel.prototype = {
        changePreset: function (vm, newValue) {
            // remove all toppings
            this.order.toppings.removeAll();

            for (var presetName in presets) {
                // skip presets that don't match this
                if (presetName !== newValue) {
                    continue;
                }

                var preset = presets[presetName];
				
                // change sauce to preset
                this.order.sauce(preset.sauce);
				
                // add all preset toppings into
                var toppings = this.order.toppings;
                toppings.push.apply(toppings, preset.toppings);
                break;
            }
        },
        options: options,
        submit: function () {
            console.log(this);
        },
        reload: function () {
            window.location.reload();
        }
    };

    ko.applyBindings(new ViewModel());
} ());