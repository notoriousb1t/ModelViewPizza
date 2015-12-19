##MVP Part 5: RactiveJS

>This top paragraph is where you introduce me and explain how this guest post came about. You will write it, but I can provide links that I want used.

Hey guys, I going to be talking to you about [RactiveJS](http://www.ractivejs.org). I use it at [work](http://squaredup.com) to create hipster dashboards that make clunky enterprise software better.

Ractive is pretty simple to get started with, I came to it from [Handlebars](http://handlebarsjs.com), and my first thought was "handlebars on steroids". 

###What is RactiveJS?
Most people have probably encountered Handlebars, or at least [Mustache](http://mustache.github.io) before. Ractive is Handlebars with two-way binding, events, animations, transitions, and a bunch more. It was created by [Rich Harris](https://twitter.com/Rich_Harris) from the Guardian in the US to help him with the work he does creating interactive and animated data visualisations on tight deadlines.

###Getting Started
[Ractive](http://www.ractivejs.org/) has a really awesome [tutorial](http://learn.ractivejs.org/) that will walk you through everything you could ever need to know - from handling events, to components, to animation, and two-way binding.

When learning Ractive, you will probably feel pretty comfortable. You get the Mustache syntax, plus two-way binding right off the bat, there are no new fancy attributes to learn, unline Vue (v-if) and Knockout (data-bind)... If one wants to bind to an input value, you just do so as might be expected:
```html
<input value='{{name}}' />
```

This re-use of previously used attributes, make Ractive really easy to pick up... If you know basic HTML, you're already a pro! Ractive tends to favour using things you already know over creating new ways of thinking and building markup.


###A Simple Example
Let's build a super simple TODO app:

####HTML
```html
{{#each todos}}
  > {{.}}
  <br />
{{/each}}
<hr />

<input placeholder="a thing to get done" <!-- Nothing interesting here -->
        value="{{todo}}" <!-- We saw this earlier -->
        on-blur="push('todos', todo)" /> <!-- Gah! What's this on-blur thing? What's push? -->
```

####JavaScript
```javascript
new Ractive({
  el:'body', //A selector for our target
  data:{
    todos:[
      'My first TODO item',
      'My second TODO item'
    ]
  },
  template:template //The template we defined above as a string
});
```
So we call the Ractive constructor, passing in an Object as the only parameter - [there are loads of possible properties](http://docs.ractivejs.org/latest/new-ractive).

- 'el' is our render target (note this will be 'blatted' by Ractive removing the previous contents).
- 'data' must be either an Object, or a function which returns an Object. This is available to the Ractive instance and it's children.
- 'template' can either be a string, or the id of a template ```<script/>``` element.

Check it out, we just made a TODO app!
http://output.jsbin.com/gofina/

###Components/Partials
There are a couple of ways to seperate logic and templates:
- Partials - Templates only (no JavaScript) which can be included using the {{> }} notation
- Components - Value added Templates, which can have various bits of JavaScript attached to them (like computed properties and initialization handlers)



###Shut Up, I just want Pizza!
####Getting set up.

So the first thing I did was create a 'home' Ractive instance, just like we have above.
In this case we pull in some config about the Pizzas:
```javascript
data: {
  config: window.config //Predefined Pizza info
}
```

Now we need a Pizza viewer, and a Pizza editor - A great use for Components:
```javascript
Ractive.components.Pizza = Ractive.extend({...});
Ractive.components.Setup = Ractive.extend({...});
```
Once we have defined components, they are useable in our master template:
```html
<Pizza toppings='{{toppings}}' cheese='{{cheese}}' size='{{size}}' ... />
```
I'm a big fan of [transducers](https://www.youtube.com/watch?v=6mTbuzafcII) - basically pure functions. We can make our components transducery by forcing them to rely on generic inputs.
The idea is that once the data is sent off to the Pizza component, it's not the Setup's component to chase it up!

Next, we need to figure out how to customize the Pizza:
```html
{{> "step" + step}}
<br />
<div class="form-group text-center">
  {{#if step}}
    <button class="btn" on-click='set("step", step-1)'>&laquo; Prev</button>
  {{/if}}
  {{#if step === 3}}
    <button class='btn btn-inverse' on-click='resetPizza'>Restart &raquo;</button>
  {{else}}
    <button class='btn btn-inverse' on-click='set("step", step+1)'>Next &raquo;</button>
  {{/if}}
</div>
```

Each step is named 'step0' ... 'step3'. They are all defined as partials and only loaded when necessary.
Step 0 looks like this:
```html
<h3>Pick a Size</h3>
<select value='{{size}}'>
  {{#each options.sizes}}
    <option value='{{.}}'>{{.}}</option>
  {{/each}}
</select>
<h3>Pick a Pizza</h3>
<select value='{{preset}}'>
  {{#each options.presets}}
    <option value='{{.}}'>{{.}}</option>
  {{/each}}
</select>
```

> Notice the dot syntax (short for 'this')

It gets interesting when selecting toppings, because we want to dynamically add and remove items from an array, but not to worry - Ractive has us covered!
```html
<h3>Customize Your Toppings!</h3>
{{#each options.toppings}}
  <input type='checkbox' id='{{.}}' value='{{.}}' name='{{toppings}}'/>
  <label for='{{.}}'>{{.}}</label>
  <br />
{{/each}}
```
So Ractive magically adds and removed the relevant topping from our Array/Object if we give a checkbox a name and value.
> Checkboxes usually are only given a 'checked' attribute (boolean)

There really isn't much JavaScript logic in this app:
```javascript
//Home component constructor
oninit: function () {
var self = this;
  self.on('resetPizza *.resetPizza', function(ev){ //Listen for resetPizza event from current or children components
    self.set(self.get('config.initial'));  //this.set takes (key, value) or an Object of {key:value}
    self.set('toppings', []); //Not contained in config.initial
  });
  self.fire('resetPizza'); //Avoid duplicating line above
}
```
We fire resetPizza at the end there just to set up defaults that get passed on to the Pizza and Setup Component.

```javascript
//Setup component contructor
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
```