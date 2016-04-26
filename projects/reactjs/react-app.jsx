'use strict';

    var config = window.config;
    var initial = config.initial;
    var presets = config.presets;
    var options = config.options;
    var steps = config.steps;

    var Select = React.createClass({
        render() {
            var options = this.props.options.map(p => <option value={p}>{p}</option>);
            return (<select className="ddl" value={this.props.value} onChange={this.props.onChange}>
                {options}
            </select>);
        }
    });

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
        onPrev() {
           var newStep = this.state.step - 1;
            if (newStep < 0) {
                newStep = 0;
            }
            this.setState({ step: newStep });
        },
        onNext() {
            var newStep = this.state.step + 1
            if (newStep >= config.stepNames.length) {
                window.location.reload();
            }
            this.setState({ step: newStep });
        },
        onSizeChange(e) {
            this.setState({ size: e.target.value });
        },
        onPresetChange(e) {
            this.setState({ preset: e.target.value });
        },
        onCrustChange(e) {
            this.setState({ crust: e.target.value });
        },
        onSauceChange(e) {
            this.setState({ sauce: e.target.value });
        },
        onCheeseChange(e) {
            this.setState({ cheese: e.target.value });
        },
        render() {
            return (<div className="grid stage-center">
                <div className="width-1-2 hidden-sm">
                    <div id="cuttingBoard" className="pizza" >
                        <img alt="" role="presentation"  className="topping" />
                        <img alt="" role="presentation"  className="topping" />
                        <img alt="" role="presentation"  className="topping" />
                        <div alt="" role="presentation" >
                            <img alt="" role="presentation"  className="topping" />
                        </div>
                    </div>
                </div>
                <div className="width-1-2">
                    <div className="pane level-3">
                        {(() => {
                            switch (this.state.step) {
                                case steps.start:
                                    return (<div >
                                        <div className="form-group">
                                            <h3>Pick a Size</h3>
                                            <Select options={this.state.options.sizes} value={this.state.size} onChange={this.onSizeChange} />
                                        </div>
                                        <div className="form-group">
                                            <h3>Pick a Pizza</h3>
                                            <Select options={this.state.options.presets} value={this.state.preset} onChange={this.onPresetChange} />
                                        </div>
                                    </div>)
                                case steps.sauce:
                                    return (<div >
                                        <div className="form-group">
                                            <h3>Select Crust</h3>
                                            <Select options={this.state.options.crusts} value={this.state.crust} onChange={this.onCrustChange} />
                                        </div>
                                        <div className="form-group">
                                            <h3>Select Sauce</h3>
                                            <Select options={this.state.options.sauces} value={this.state.sauce} onChange={this.onSauceChange} />
                                        </div>
                                        <div className="form-group">
                                            <h3>Select Cheese Intensity!</h3>
                                            <Select options={this.state.options.cheeses} value={this.state.cheese} onChange={this.onCheeseChange} />
                                        </div>
                                    </div>);
                                case steps.toppings:
                                    return (<div >
                                        <h3>Customize Your Toppings!</h3>
                                        <dl className="checkboxlist-inline">
                                            <dd className="checkbox">
                                                <label>
                                                    <input type="checkbox"  />
                                                    <span>/*value*/</span>
                                                </label>
                                            </dd>
                                        </dl>
                                    </div>);
                                case steps.done:
                                    return (<div className="text-center">
                                        <h4>Your {this.state.preset} is done!</h4>
                                        <p>
                                            Your {this.state.size} {this.state.crust} pizza has <span> /*$value*/, </span> {this.state.sauce}, and {this.state.cheese}.
                                        </p>
                                        <p>
                                            <small>Once you are finished with that slice...</small>
                                        </p>
                                        <h5>be sure to checkout the source on
                                            <a target="_blank" href="https://github.com/notoriousb1t/modelviewpizza/tree/master/projects/vuejs">GitHub!</a>
                                        </h5>
                                    </div>);
                                default:
                                    return "";    
                            }
                        })()}
                        <div className="form-group text-center">
                            {(this.state.step !== steps.start
                                ? <button className="btn" onClick={this.onPrev}>
                                    &laquo; Prev
                                </button> : '')}
                            <button className="btn btn-inverse" onClick={this.onNext}>
                                {config.stepNames.length - 1 == this.state.step ? "Restart" : "Next"} &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>);
        }
    });

    React.render(<AppComponent />, document.getElementById('view'))