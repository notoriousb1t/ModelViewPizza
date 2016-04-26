'use strict';

var config = window.config;
var initial = config.initial;
var presets = config.presets;
var options = config.options;
var steps = config.steps;

var Select = React.createClass({
    render() {
        var options = this.props.options.map(p => React.createElement(
            "option",
            { value: p },
            p
        ));
        return React.createElement(
            "select",
            { className: "ddl", value: this.props.value, onChange: this.props.onChange },
            options
        );
    }
});

var CheckBoxList = React.createClass({
    render() {
        return React.createElement(
            "dl",
            { className: "checkboxlist-inline" },
            this.props.options.map(option => React.createElement(
                "dd",
                { className: "checkbox" },
                React.createElement(
                    "label",
                    null,
                    React.createElement("input", { type: "checkbox", "data-name": option, checked: this.props.value.indexOf(option) !== -1, onClick: this.props.onChange }),
                    React.createElement(
                        "span",
                        null,
                        option
                    )
                )
            ))
        );
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
        var newStep = this.state.step + 1;
        if (newStep >= config.stepNames.length) {
            window.location.reload();
        }
        this.setState({ step: newStep });
    },
    onCheeseChange(e) {
        this.setState({ cheese: e.target.value });
    },
    onCrustChange(e) {
        this.setState({ crust: e.target.value });
    },
    onPresetChange(e) {
        var presetName = e.target.value;
        var sauce = undefined;
        var toppings = undefined;
        for (var preset in presets) {
            if (preset !== presetName) {
                // skip presets that don't match this
                continue;
            }

            // get preset from presets
            var preset = presets[preset];

            // change sauce and toppings to preset
            sauce = preset.sauce;
            toppings = preset.toppings.slice(0);
            break;
        }

        this.setState({
            preset: presetName,
            toppingSelections: toppings || [],
            sauce: sauce || this.state.sauce
        });
    },
    onSauceChange(e) {
        this.setState({ sauce: e.target.value });
    },
    onSizeChange(e) {
        this.setState({ size: e.target.value });
    },
    onToppingChange(e) {
        var topping = e.target.dataset.name;
        var newToppings = this.state.toppingSelections.slice(0);
        var toppingIndex = newToppings.indexOf(topping);

        if (toppingIndex === -1) {
            newToppings.push(e.target.dataset.name);
        } else {
            newToppings.splice(toppingIndex, 1);
        }

        this.setState({ toppingSelections: newToppings });
    },
    render() {
        return React.createElement(
            "div",
            { className: "grid stage-center" },
            React.createElement(
                "div",
                { className: "width-1-2 hidden-sm" },
                React.createElement(
                    "div",
                    { id: "cuttingBoard", className: this.state.size === 'Medium' ? 'pizza pizzaMedium' : 'pizza pizzaLarge' },
                    React.createElement("img", { alt: "", role: "presentation", src: "/assets/images/pizza/" + this.state.crust + ".png", className: "topping" }),
                    React.createElement("img", { alt: "", role: "presentation", src: "/assets/images/pizza/" + this.state.sauce + ".png", className: "topping" }),
                    React.createElement("img", { alt: "", role: "presentation", src: "/assets/images/pizza/" + this.state.cheese + ".png", className: "topping" }),
                    React.createElement(
                        "div",
                        { alt: "", role: "presentation" },
                        this.state.toppingSelections.map(topping => React.createElement("img", { src: '/assets/images/pizza/' + topping + '.png', alt: "", role: "presentation", className: "topping" }))
                    )
                )
            ),
            React.createElement(
                "div",
                { className: "width-1-2" },
                React.createElement(
                    "div",
                    { className: "pane level-3" },
                    (() => {
                        switch (this.state.step) {
                            case steps.start:
                                return React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "div",
                                        { className: "form-group" },
                                        React.createElement(
                                            "h3",
                                            null,
                                            "Pick a Size"
                                        ),
                                        React.createElement(Select, { options: this.state.options.sizes, value: this.state.size, onChange: this.onSizeChange })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "form-group" },
                                        React.createElement(
                                            "h3",
                                            null,
                                            "Pick a Pizza"
                                        ),
                                        React.createElement(Select, { options: this.state.options.presets, value: this.state.preset, onChange: this.onPresetChange })
                                    )
                                );
                            case steps.sauce:
                                return React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "div",
                                        { className: "form-group" },
                                        React.createElement(
                                            "h3",
                                            null,
                                            "Select Crust"
                                        ),
                                        React.createElement(Select, { options: this.state.options.crusts, value: this.state.crust, onChange: this.onCrustChange })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "form-group" },
                                        React.createElement(
                                            "h3",
                                            null,
                                            "Select Sauce"
                                        ),
                                        React.createElement(Select, { options: this.state.options.sauces, value: this.state.sauce, onChange: this.onSauceChange })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "form-group" },
                                        React.createElement(
                                            "h3",
                                            null,
                                            "Select Cheese Intensity!"
                                        ),
                                        React.createElement(Select, { options: this.state.options.cheeses, value: this.state.cheese, onChange: this.onCheeseChange })
                                    )
                                );
                            case steps.toppings:
                                return React.createElement(CheckBoxList, { options: options.toppings, value: this.state.toppingSelections, onChange: this.onToppingChange });
                            case steps.done:
                                return React.createElement(
                                    "div",
                                    { className: "text-center" },
                                    React.createElement(
                                        "h4",
                                        null,
                                        "Your ",
                                        this.state.preset,
                                        " is done!"
                                    ),
                                    React.createElement(
                                        "p",
                                        null,
                                        "Your ",
                                        this.state.size,
                                        " ",
                                        this.state.crust,
                                        " pizza has ",
                                        this.state.toppingSelections.map(topping => React.createElement(
                                            "span",
                                            null,
                                            " ",
                                            topping,
                                            ","
                                        )),
                                        " ",
                                        this.state.sauce,
                                        ", and ",
                                        this.state.cheese,
                                        "."
                                    ),
                                    React.createElement(
                                        "p",
                                        null,
                                        React.createElement(
                                            "small",
                                            null,
                                            "Once you are finished with that slice..."
                                        )
                                    ),
                                    React.createElement(
                                        "h5",
                                        null,
                                        "be sure to checkout the source on ",
                                        React.createElement(
                                            "a",
                                            { target: "_blank", href: "https://github.com/notoriousb1t/modelviewpizza/tree/master/projects/vuejs" },
                                            "GitHub!"
                                        )
                                    )
                                );
                            default:
                                return "";
                        }
                    })(),
                    React.createElement(
                        "div",
                        { className: "form-group text-center" },
                        this.state.step !== steps.start ? React.createElement(
                            "button",
                            { className: "btn", onClick: this.onPrev },
                            "« Prev"
                        ) : '',
                        React.createElement(
                            "button",
                            { className: "btn btn-inverse", onClick: this.onNext },
                            config.stepNames.length - 1 == this.state.step ? "Restart" : "Next",
                            " »"
                        )
                    )
                )
            )
        );
    }
});

React.render(React.createElement(AppComponent, null), document.getElementById('view'));