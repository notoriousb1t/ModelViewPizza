/// <reference path="../../assets/scripts/config.js"/>
/// <reference path="../../typings/kendo-ui/kendo-ui.d.ts" />
(function (config) {
    'use strict';
    // import shared settings from config
    var initial = config.initial;
    var presets = config.presets;
    var options = config.options;
    var steps = config.steps;
    
    function ViewModel() {
        ///<summary>The ViewModel for this pizza app page</summary>

        // setup model
        var vm = this;
        vm.step = initial.step;
        vm.crust = initial.crust;
        vm.size = initial.size;
        vm.preset = initial.preset;
        vm.sauce = initial.sauce;
        vm.cheese = initial.cheese;
        
        // setup topping checklist model
        vm.toppingSelections = options.toppings.map(function (topping) {
            ///<summary>returns an { value: toppingName, selected } for each topping name</summary>
            return {
                value: topping,
                selected: false
            };
        });
        
        // extend as observable
        vm = kendo.observable(vm);
        
        // setup property watching
        vm.bind('change', function (e) {
            if (e.field === 'preset') {
                // trigger preset changed when preset is modified
                var newValue = vm.get('preset');
                vm.presetChanged(newValue);
            }
            if (e.field === 'toppingSelections') {
                this.invalidateToppings();
            }
        });
        
        // return constructed viewmodel
        return vm;
    }
    
    ViewModel.prototype = {
        cheeseImage: function () {
            ///<summary>returns the image for cheese</summary>
            return '/assets/images/pizza/' + this.get('cheese') + '.png';
        },
        crustImage: function () {
            ///<summary>returns the image for crust</summary>
            return '/assets/images/pizza/' + this.get('crust') + '.png';
        },
        invalidateToppings: function () {
            ///<summary>manually fire change event for toppings</summary>
            this.trigger('change', { field: 'toppings' });
        },
        isSizeLarge: function () {
            /// <summary>return true if the current size is Large</summary>
            return this.get('size') === 'Large';
        },
        isSizeMedium: function () {
            ///<summary>return true if the current size is Medium</summary>
            return this.get('size') === 'Medium';
        },
        isStepStart: function () {
            ///<summary>return true if the current step is 'start'</summary>
            return this.get('step') === steps.start;
        },
        isStepSauce: function () {
            ///<summary>return true if the current step is 'sauce'</summary>            
            return this.get('step') === steps.sauce;
        },
        isStepToppings: function () {
            ///<summary>return true if the current step is 'toppings'</summary>            
            return this.get('step') === steps.toppings;
        },
        isStepDone: function () {
            ///<summary>return true if the current step is 'done'</summary>            
            return this.get('step') === steps.done;
        },
        next: function () {
            ///<summary>moves to the next step or reloads if on last step</summary>    
            // increment step by one        
            var newStep = this.get('step') + 1;
            if (newStep <= steps.done) {
                // set last step if still in range of steps
                this.set('step', newStep);
                return;
            }

            // if last step, reload page
            window.location.reload();
        },
        nextText: function () {
            ///<summary>returns text to display in the next button</summary>
            return this.get('step') === steps.done ? 'Restart' : 'Next';
        },
        options: options,
        presetChanged: function (newValue) {
            ///<summary>changes the pizza settings when a preset is selected</summary>
            
            var preset;
            for (var presetName in presets) {
                if (presets.hasOwnProperty(presetName)) {
                    if (presetName !== newValue) {
                        // skip presets that don't match this
                        continue;
                    }
                    
                    // get preset from presets
                    preset = presets[presetName];
                }
            }
            
            if (preset) {
                // change sauce and toppings to preset
                this.set('sauce', preset.sauce);
                this.toppingSelections.forEach(function (topping) {
                    topping.set('selected', preset.toppings.indexOf(topping.value) !== -1);
                });
            }
            else {
                // reset sauce and toppings
                this.set('sauce', initial.sauce);
                this.toppingSelections.forEach(function (topping) {
                    topping.set('selected', false);
                });
            }
            
            // manually fire change event for toppings
            this.invalidateToppings();
        },
        presets: presets,
        prev: function () {
            ///<summary>moves to the previous step</summary>
            // decrement step by one
            var newStep = this.get('step') - 1;
            if (newStep < 0) {
                // clamp lower bounds at 0
                newStep = 0;
            }
            this.set('step', newStep);
        },
        sauceImage: function () {
            ///<summary>returns the image for sauce</summary>
            return '/assets/images/pizza/' + this.get('sauce') + '.png';
        },
        toppings: function () {
            ///<summary>returns a list of toppings that are selected</summary>
            return this.toppingSelections
                .filter(function (topping) { return topping.selected; })
                .map(function (topping) { return topping.value; });
        }
    };

    // setup viewmodel and apply bindings to dom
    kendo.bind($('#content'), new ViewModel());
}(window.config));