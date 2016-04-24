'use strict';

    var config = window.config;
    var initial = config.initial;
    var presets = config.presets;
    var options = config.options;
    var steps = config.steps;

    var AppComponent = React.createClass({
        getInitialState() {
            return {
                options: options,
                presets: presets,
                step: initial.step,
                crust: initial.crust,
                size: initial.size,
                preset: initial.preset,
                sauce: initial.sauce,
                cheese: initial.cheese,
                toppingSelections: []
            };
        },
        render() {
            return (<div class="grid stage-center">
                <div class="width-1-2 hidden-sm">
                    <div id="cuttingBoard" class="pizza" >
                        <img alt="" role="presentation"  class="topping" />
                        <img alt="" role="presentation"  class="topping" />
                        <img alt="" role="presentation"  class="topping" />
                        <div alt="" role="presentation" >
                            <img alt="" role="presentation"  class="topping" />
                        </div>
                    </div>
                </div>
                <div class="width-1-2">
                    <div class="pane level-3">
                        <div >
                            <div class="form-group">
                                <h3>Pick a Size</h3>
                                <select   class="ddl" aria-label="Pick a size"></select>
                            </div>
                            <div class="form-group">
                                <h3>Pick a Pizza</h3>
                                <select   class="ddl" aria-label="Pick a pizza"></select>
                            </div>
                        </div>
                        <div >
                            <div class="form-group">
                                <h3>Select Crust</h3>
                                <select   class="ddl" aria-label="Select Crust"></select>
                            </div>
                            <div class="form-group">
                                <h3>Select Sauce</h3>
                                <select   class="ddl" aria-label="Select Sauce"></select>
                            </div>
                            <div class="form-group">
                                <h3>Select Cheese Intensity!</h3>
                                <select   class="ddl" aria-label="Select Cheese Intensity!"></select>
                            </div>
                        </div>
                        <div >
                            <h3>Customize Your Toppings!</h3>
                            <dl class="checkboxlist-inline">
                                <dd  class="checkbox">
                                    <label>
                                        <input type="checkbox"  />
                                        <span>/*value*/</span>
                                    </label>
                                </dd>
                            </dl>
                        </div>
                        <div class="text-center">
                            <h4>Your /*preset*/ is done!</h4>
                            <p>
                                Your /*size*/ /*crust*/ pizza has <span> /*$value*/, </span> /*sauce*/, and /*cheese*/.
                            </p>
                            <p>
                                <small>Once you are finished with that slice...</small>
                            </p>
                            <h5>be sure to checkout the source on
                                <a target="_blank" href="https://github.com/notoriousb1t/modelviewpizza/tree/master/projects/vuejs">GitHub!</a>
                            </h5>
                        </div>
                        <div class="form-group text-center">
                            <span >
                                <button class="btn">&laquo; Prev</button>
                            </span>
                            <button class="btn btn-inverse">
                                /*nextText*/ &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>);
        }
    });

    React.render(<AppComponent />, document.getElementById('view'))