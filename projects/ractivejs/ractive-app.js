//Define components
Ractive.components.Setup = Ractive.extend({
    isolated: true,
    template: '#setup',
    data: function () { //Best practive in components is for data to be a funciton
        return { //Return defaults, these will be over-written by parameters passed to component
            step: 0
        };
    },
    oninit: function () {
        var self = this;
        var presets = self.get('presets');

        self.observe('preset', function (newPreset, oldPreset) {
            if(presets[newPreset]) //Could be 'Build Your Own'
                self.set(presets[newPreset]);
        }, {
            init: false
        });
    }
});

Ractive.components.Pizza = Ractive.extend({
    isolated: true,
    template: '#pizza'
});

//Define root Ractive Instance
var ractive = new Ractive({
    el: 'body', //When we have set up the components, we can over-write the body element and it's contents
    template: '#home',
    data: {
        config: window.config //Global Config
    },
    oninit: function () {
        var self = this;
        self.on('resetPizza *.resetPizza', function(ev){
            self.set(self.get('config.initial')); 
            self.set('toppings', []); //Not contained in config.initial
        });
        self.fire('resetPizza'); //Avoid duplicating line above
    }
});