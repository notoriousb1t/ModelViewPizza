/// <reference path="../../typings/vue/vue.d.ts" />
(function () {
    'use strict';
    // import shared settings from config on window
    var config = window.config;
    var initial = config.initial;
    var presets = config.presets;
    var options = config.options;
    var steps = config.steps;

    window.vm = new Vue({
        computed: {
            isStepStart: function () {
                ///<summary>return true if the current step is 'start'</summary>
                return this.step === steps.start;
            },
            isStepSauce: function () {
                ///<summary>return true if the current step is 'sauce'</summary>
                return this.step === steps.sauce;
            },
            isStepToppings: function () {
                ///<summary>return true if the current step is 'toppings'</summary>
                return this.step === steps.toppings;
            },
            isStepDone: function () {
                ///<summary>return true if the current step is 'done'</summary>
                return this.step === steps.done;
            },
            nextText: function () {
                ///<summary>returns text to display in the next button</summary>
                return this.step === steps.done ? 'Restart' : 'Next';
            },
            toppings: function () {
                return this.toppingSelections
                    .filter(function (topping) { return topping.selected; })
                    .map(function (topping) { return topping.value; });
            }
        },
        el: '#view',
        data: {
            options: options,
            presets: presets,
            step: initial.step,
            crust: initial.crust,
            size: initial.size,
            preset: initial.preset,
            sauce: initial.sauce,
            cheese: initial.cheese,
            toppingSelections: options.toppings.map(function (topping) {
                return {
                    value: topping,
                    selected: false
                };
            })
        },
        methods: {
            next: function () {
                ///<summary>moves to the next step or reloads if on last step</summary>            
                var newStep = this.step + 1
                if (newStep > steps.done) {
                    window.location.reload();
                    return;
                }
                this.step = newStep;
            },
            prev: function () {
                ///<summary>moves to the previous step</summary>
                var newStep = this.step - 1;
                if (newStep < 0) {
                    newStep = 0;
                }
                this.step = newStep;
            }
        },
        watch: {
            'preset': function (newValue, oldValue) {
                ///<summary>changes the pizza settings when a preset is selected</summary>
			
                // find first matching presets
                var preset;
                for (var presetName in presets) {
                    if (presetName !== newValue) {
                        // skip presets that don't match this
                        continue;
                    }

                    // get preset from presets
                    preset = presets[presetName];
                }

                if (preset) {
                    // change sauce and toppings to preset
                    this.sauce = preset.sauce;
                    this.toppingSelections.forEach(function (topping) {
                        topping.selected = preset.toppings.indexOf(topping.value) !== -1;
                    })
                }
                else {
                    // reset sauce and toppings
                    this.sauce = initial.sauce;
                    this.toppingSelections.forEach(function (topping) {
                        topping.selected = false;
                    });
                }
            }
        }
    });
} ());