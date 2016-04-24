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
        return React.createElement(
            "div",
            { "class": "grid stage-center" },
            React.createElement(
                "div",
                { "class": "width-1-2 hidden-sm" },
                React.createElement(
                    "div",
                    { id: "cuttingBoard", "class": "pizza" },
                    React.createElement("img", { alt: "", role: "presentation", "class": "topping" }),
                    React.createElement("img", { alt: "", role: "presentation", "class": "topping" }),
                    React.createElement("img", { alt: "", role: "presentation", "class": "topping" }),
                    React.createElement(
                        "div",
                        { alt: "", role: "presentation" },
                        React.createElement("img", { alt: "", role: "presentation", "class": "topping" })
                    )
                )
            ),
            React.createElement(
                "div",
                { "class": "width-1-2" },
                React.createElement(
                    "div",
                    { "class": "pane level-3" },
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { "class": "form-group" },
                            React.createElement(
                                "h3",
                                null,
                                "Pick a Size"
                            ),
                            React.createElement("select", { "class": "ddl", "aria-label": "Pick a size" })
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-group" },
                            React.createElement(
                                "h3",
                                null,
                                "Pick a Pizza"
                            ),
                            React.createElement("select", { "class": "ddl", "aria-label": "Pick a pizza" })
                        )
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { "class": "form-group" },
                            React.createElement(
                                "h3",
                                null,
                                "Select Crust"
                            ),
                            React.createElement("select", { "class": "ddl", "aria-label": "Select Crust" })
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-group" },
                            React.createElement(
                                "h3",
                                null,
                                "Select Sauce"
                            ),
                            React.createElement("select", { "class": "ddl", "aria-label": "Select Sauce" })
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-group" },
                            React.createElement(
                                "h3",
                                null,
                                "Select Cheese Intensity!"
                            ),
                            React.createElement("select", { "class": "ddl", "aria-label": "Select Cheese Intensity!" })
                        )
                    ),
                    React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "h3",
                            null,
                            "Customize Your Toppings!"
                        ),
                        React.createElement(
                            "dl",
                            { "class": "checkboxlist-inline" },
                            React.createElement(
                                "dd",
                                { "class": "checkbox" },
                                React.createElement(
                                    "label",
                                    null,
                                    React.createElement("input", { type: "checkbox" }),
                                    React.createElement(
                                        "span",
                                        null,
                                        "/*value*/"
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { "class": "text-center" },
                        React.createElement(
                            "h4",
                            null,
                            "Your /*preset*/ is done!"
                        ),
                        React.createElement(
                            "p",
                            null,
                            "Your /*size*/ /*crust*/ pizza has ",
                            React.createElement(
                                "span",
                                null,
                                " /*$value*/, "
                            ),
                            " /*sauce*/, and /*cheese*/."
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
                            "be sure to checkout the source on",
                            React.createElement(
                                "a",
                                { target: "_blank", href: "https://github.com/notoriousb1t/modelviewpizza/tree/master/projects/vuejs" },
                                "GitHub!"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group text-center" },
                        React.createElement(
                            "span",
                            null,
                            React.createElement(
                                "button",
                                { "class": "btn" },
                                "« Prev"
                            )
                        ),
                        React.createElement(
                            "button",
                            { "class": "btn btn-inverse" },
                            "/*nextText*/ »"
                        )
                    )
                )
            )
        );
    }
});

React.render(React.createElement(AppComponent, null), document.getElementById('view'));