# Testing React components with Karma runner

![Running tests](https://draftin.com:443/images/29524?token=Pe5rMPbDhD_GwYzzq3Urg91Uj2aFI1vN8EqR_wsS5Xplty3vCrGe2MqDgS98S7iwxbIFGQBPzdRy_hWvVysQHo8) 

Testing backends is easy. You take your language of choice, pair it with your favourite framework, write some tests and hit run. The console spits out a bunch of *"Yay it works"* messages, Travis runs your tests on every push, life is grand.

Sure, test driven development is weird at first, but a predictable environment, many test runners, test tooling baked into frameworks, and good continuous integration support make life easy.

Five years ago I was just getting into TDD and loving every minute of it. Tests were the solution to every problem I've ever had.

Then Backbone got big. 

We switched to front-end MVC and our well-testable backends became glorified database servers. They still had a bunch of logic, but all they really did, was give you a smart interface to the database and make sure you can't cause data conflicts.

Testing front-end code is ... hard.

It's easy if all you want is to check that your models are behaving well. Or that calling a function will change the right value. All you need to get easy unit testing is:

  * to write isolated modules
  * use Jasmine or Mocha or whatever to run functions
  * use a test runner

That's it. Your code is unit tested.

Karma runner gives you all of the things we got for free on the backend. It runs in the terminal and has a nice output, it's supported by most continuous integration services, it watches your code for changes and re-runs tests, it even runs your tests in multiple browsers.

What more could you wish for? Well, to *actually* test your front-end.

## Front-end testing needs more than unit tests

Unit testing is great. It's the best way I know to see if an algorithm does the right thing every time, or to check your input validation logic, or data transformations. Unit testing is perfect for many fundamentals.

But front-end code isn't so much about manipulating data. It's about user events and rendering the right views at the right time. It's about users.

In the many years that I've been writing client-side apps with JavaScript, I have yet to find a decent way to test user interaction and view rendering.

Here's what we want:

  * a way to test user events
  * test the response to those events
  * make sure the right things render at the right time
  * run tests in many browsers
  * re-run tests on file changes
  * work with continuous integration systems

## Testing with React

The easiest way to get all those that I've found is using React. In part because of how it forces you to architect your app, in part because it comes with fantastic test tools.

If you've never used React before, you should check out my book [React+d3.js](http://swizec.com/reactd3js). It's geared towards visualisations, but I've been told it's perfect for learning React.

With React you build everything out of components. You can think of them as widgets or as chunks of HTML with some logic added. The important part is that React components follow a lot of principles of good functional programming, except they're objects.

For instance, given the same set of parameters, a component will always render the same output. No matter how many times it's rendered, no matter who renders it, no matter where you place the output. Always the same.

As a result, you don't have to perform complex scaffolding to test a React component. All it cares about comes from its properties - no tracking of global variables and config objects required.

Another benefit is that Rect components don't rely on internal state either. At least not much. This means you don't have to initialize the component in just the right state before testing an interaction.

When it comes to testing user interactions, React has you covered with user events bound straight to function callbacks. This makes it easy to set up spies and make sure that a click event calls the right function.

And because React components render themselves, you don't even have to set up a function spy. You just trigger a click event check the HTML for changes.

The reason this approach works is that a component should always care only about itself. A click *here* doesn't change things *there*. You will never have to deal with a nest of event handlers, just well defined function calls.

Oh and because React is magic, you don't have to worry about making the DOM available? React uses the so called shadow DOM to render components into a JavaScript variable. And that's all you need to test them.

It's pretty sweet.

### React's TestUtils

React comes with some TestUtils already built in. It's also got a recommended test runner called Jest, but I don't like it. I'll explain why in a bit.

First, the TestUtils. 

You get them by doing something like `require('react/addons').addons.TestUtils` and they are your entry point into the second half of the great things we mentioned above.

The React TestUtils allow you to render a React component without inserting it into a page. You get its chunk of DOM into a variable.

To render a component, you'd do something like this:

<pre lang="javascript">
  var component = TestUtils.renderIntoDocument(
     <MyComponent />
  );
</pre>

Then you can use TestUtils to check whether it's got all the HTML elements you want by doing something like this:

<pre lang="javascript">
   var h1 = TestUtils.findRenderedDOMComponentWithTag(
      component, 'h1'
   );
</pre>

`findRenderedDOMComponentWithTag` will do what the function name tells you - go through the children, find the component you're looking for, and return it. The returned value will behave like a React component.

You can then use `getDOMNode()` to access the raw DOM element and test its values. To check that an `h1` tag in the component says *"A title"*, you'd write this:

<pre lang="javascript">
   expect(h1.getDOMNode().textContent)
      .toEqual("A title");
</pre>

When put together, the whole test would look like this:

<pre lang="javascript">
    it("renders an h1", function () {
        var component = TestUtils.renderIntoDocument(
            <MyComponent />
        );

        var h1 = TestUtils.findRenderedDOMComponentWithTag(
           component, 'h1'
        );

        expect(h1.getDOMNode().textContent)
            .toEqual("A title");
    });
</pre>

What's cool about this, is that TestUtils lets you trigger user events as well. For a click event you'd write something like this:

<pre lang="javascript">
    var node = component
       .findRenderedDOMComponentWithTag('button')
       .getDOMNode();

    TestUtils.Simulate.click(node);
</pre>

This simulates a click and triggers any listeners. Those listeners should be component methods that change either the output, the state, or both. Sometimes they call a function provided by a parent component.

Both are trivial to test. You access the component's state with `component.state`, its output with the usual DOM functions.

### Why not Jest

React's documentation recommends using Jest as a test runner and testing framework.

Jest is built on Jasmine, which is fine, and it automagically mocks everything but the component you are testing. Which is fantastic in theory, but I find it annoying.

My issue with this automagic mocking is that anything you haven't implemented yet, or that comes from a different part of the codebase, is just `undefined`. While fine in many cases, it can lead to quietly failing bugs.

For instance, I've had trouble testing a click event that for the life of me wouldn't call its listener. Then I realized the function got mocked away by Jest.

But Jest's worst offence by far, is that it doesn't have a watch mode. You can run it once, get test results, and that's it.

I like having my tests run in the background while I work, because I forget to run them otherwise.

Oh and to the best of my knowledge, Jest doesn't support running your tests in multiple browsers, which is a shame. Maybe something they will add in the future? Maybe it isn't necessary? It feels necessary ...

## An example

Well, that's the theory. Let's see how all this plays out in a short example.

We're going to visualise various random functions with a simple scatterplot component made with React and d3.js. All the code is on Github, [here](https://github.com/Swizec/react-testing-example).

<iframe src="http://swizec.github.io/react-testing-example/" width="500" height="500"> </iframe>

If that iframe doesn't load, you can check it out [here](http://swizec.github.io/react-testing-example/).

To make the tests, we'll use Karma as a test runner, Mocha as a testing framework, and Webpack as a module loader.

### The setup

Our source files go in a `<root>/src` directory, and our tests in a `<root>/src/__tests__` directory. This is the default that Jest understands and I agree it's a good way to organise our files.

The idea is that we can potentially put several directories within `src` - one for each major component - each with their own test files. Bundling source code and test files like this makes it easier to reuse components in different projects.

With the dir structure in place, you can install dependencies like this:

<pre>
  $ npm install --save-dev react d3 webpack babel-loader karma karma-cli karma-mocha karma-webpack expect
</pre>

If anything fails to install, try re-running that part of the installation. Npm sometimes fails in mysterious ways that go away on a second re-run.

Your `package.json` file should look like this when you're done:

<pre lang="json">
// package.json
{
  "name": "react-testing-example",
  "description": "A sample project to investigate testing options with ReactJS",
  "scripts": {
    "test": "karma start"
  },
// ...
  "homepage": "https://github.com/Swizec/react-testing-example",
  "devDependencies": {
    "babel-core": "^5.2.17",
    "babel-loader": "^5.0.0",
    "d3": "^3.5.5",
    "expect": "^1.6.0",
    "jsx-loader": "^0.13.2",
    "karma": "^0.12.31",
    "karma-chrome-launcher": "^0.1.10",
    "karma-cli": "0.0.4",
    "karma-mocha": "^0.1.10",
    "karma-sourcemap-loader": "^0.3.4",
    "karma-webpack": "^1.5.1",
    "mocha": "^2.2.4",
    "react": "^0.13.3",
    "react-hot-loader": "^1.2.7",
    "react-tools": "^0.13.3",
    "webpack": "^1.9.4",
    "webpack-dev-server": "^1.8.2"
  }
}
</pre>

After the next step, you'll be able to run tests with either `npm test` or `karma start`.

![Test run](https://draftin.com:443/images/29494?token=g6ISU0ldHZR5b_k7Tfwh-xZ7xuUNr8It_-y8kXaflja-eW-ejtji6JdymC0iUeASf7861i_b878qw1T59VZsz_A) 

### The config

There's not much to the configuration. We have to make sure Webpack knows how to find our code, and that Karma knows how to run the tests.

We put two lines of JavaScript in a `tests.webpack.js` file to configure Webpack:

<pre lang="javascript">
// tests.webpack.js
var context = require.context('./src', true, /-test\.jsx?$/);
context.keys().forEach(context);
</pre>

This tells Webpack to consider anything with a `-test` suffix as part of the test suite.

Configuring Karma takes a bit more work:

<pre lang="javascript">
// karma.conf.js
var webpack = require('webpack');

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: true,
        frameworks: ['mocha'],
        files: [
            'tests.webpack.js'
        ],
        preprocessors: {
            'tests.webpack.js': ['webpack']
        },
        reporters: ['dots'],
        webpack: {
            module: {
                loaders: [
                    {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'}
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
</pre>

Most of these come straight from a default Karma config. We used `browsers` to say that tests should run in Chrome, `frameworks` to specify which testing framework we're using, and `singleRun` to enable single run mode.

Those three are obvious.

The Webpack stuff is more interesting.

Because Webpack handles our code's dependency tree, we don't have to specify all our files in the `files` array. We just set it to `tests.webpack.js`, which then requires all necessary files.

And we use the `webpack` setting to tell Webpack what to do. In a normal environment this part goes in a `webpack.config.js` file.

We tell it to use the `babel-loader` for all our JavaScripts. Now we have the fancy new features from ES2015 *and* React's JSX. 

The `webpackServer` config tells Webpack not to print debug info. It would only spoil our test output anyway.

### A component and a test

Now that we've got a running test suite, the rest is simple. We have to make a component that accepts an array of random coordinates and creates an `<svg>` element with a bunch of points.

Let's start with a vanilla tests file in `src/__tests__/`:

<pre lang="javascript">
// ScatterPlot-test.jsx
var React = require('react/addons'),
    TestUtils = React.addons.TestUtils,
    expect = require('expect'),
    ScatterPlot = require('../ScatterPlot.jsx');

var d3 = require('d3');

describe('ScatterPlot', function () {
    var normal = d3.random.normal(1, 1),
        mockData = d3.range(5).map(function () {
        return {x: normal(), y: normal()};
    });

});
</pre>

First we required React, its TestUtils, d3.js, the expect library, and the code we're testing. Then we made a new test suite with `describe` and created some random data.

For our first test, let's make sure `ScatterPlot` renders a title. Our test goes inside the `describe` block:

<pre lang="javascript">
// ScatterPlot-test.jsx
    it("renders an h1", function () {
        var scatterplot = TestUtils.renderIntoDocument(
            <ScatterPlot />
        );

        var h1 = TestUtils.findRenderedDOMComponentWithTag(
            scatterplot, 'h1'
        );

        expect(h1.getDOMNode().textContent).toEqual("This is a random scatterplot");
    });
</pre>

As we've seen earlier, `renderIntoDocument` renders our component, `findRenderedDOMComponentWithTag` finds the specific part we're testing, and `getDOMNode` gives us raw DOM access. Most tests will follow the same pattern.

  1. Render
  2. Find specific node
  3. Check result

If we ensure our users see exactly what they're supposed to, that's the same as a working application. Internal state is irrelevant, users don't care.

This test will fail. To make it pass, we have to write the component that renders a title tag:

<pre lang="javascript">
var React = require('react/addons');
var d3 = require('d3');

var ScatterPlot = React.createClass({
    render: function () {
        return (
            <div>
                <h1>This is a random scatterplot</h1>
            </div>
        );
    }
});

module.exports = ScatterPlot;
</pre>

That's it. The `ScatterPlot` component renders a `<div>` with an `<h1>` tag. Yes it's longer than just HTML, but bear with me.

### Draw the rest of the owl

I'd show you everything else step-by-step, but that would take too long and this post is already pushing it. If you're reading this far, I love you. We're at about a 2400 words mark. 

You can see the whole test suite I used for the example on Github, [here](https://github.com/Swizec/react-testing-example/tree/master/src/__tests__).

But here's a test that ensures all datapoints show up on the chart:

<pre lang="javascript">
// ScatterPlot-test.jsx
it("renders a circle for each datapoint", function () {
        var scatterplot = TestUtils.renderIntoDocument(
            <ScatterPlot data={mockData} />
        );

        var circles = TestUtils.scryRenderedDOMComponentsWithTag(
            scatterplot, 'circle'
        );

        expect(circles.length).toEqual(5);
    });
</pre>

Same as before. Render, find nodes, check result.

The more interesting part was drawing the nodes. We add some d3.js stuff to the ScatterPlot component, like this:

<pre lang="javascript">
// ScatterPlot.jsx
componentWillMount: function () {
        this.yScale = d3.scale.linear();
        this.xScale = d3.scale.linear();

        this.update_d3(this.props);
    },

    componentWillReceiveProps: function (newProps) {
        this.update_d3(newProps);
    },

    update_d3: function (props) {
        this.yScale
            .domain([d3.min(props.data, function (d) { return d.y; }),
                     d3.max(props.data, function (d) { return d.y; })])
            .range([props.point_r, Number(props.height-props.point_r)]);

        this.xScale
            .domain([d3.min(props.data, function (d) { return d.x; }),
                     d3.max(props.data, function (d) { return d.x; })])
            .range([props.point_r, Number(props.width-props.point_r)]);
    },
</pre>

We use `componentWillMount` to set up empty d3 scales for the X and Y domains, and `componentWillReceiveProps` to make sure they're updated when something changes. Then `update_d3` makes sure to set the `domain` and the `range` for both scales.

We'll use the two scales to translate between random values in our dataset and positions on the picture. Most random generators return numbers in the [0,1] range, which is too small to see.

Then we add the points to our component's render method:

<pre lang="javascript">
// ScatterPlot.jsx
render: function () {
        return (
            <div>
                <h1>This is a random scatterplot</h1>
                <svg width={this.props.width} height={this.props.height}>
                    {this.props.data.map(function (pos, i) {
                        var key = "circle-"+i;
                        return (
                            <circle key={key}
                                    cx={this.xScale(pos.x)}
                                    cy={this.yScale(pos.y)}
                                    r={this.props.point_r} />
                        );
                     }.bind(this))};
                </svg>
            </div>
        );
    }
</pre>

As you can see it's just going through the `this.props.data` array and adding a `<circle>` element for each datapoint. Simple.

If you want to know more about combining React and d3.js to data visualization components, I suggest taking a look at my React+d3.js book, [here](http://swizec.com/reactd3js).

## Fin

That's all I had to say about writing testable front-end components with React and testing them with Karma and Mocha. To see more code exercising those functions, check out the example codebase on Github, [here](https://github.com/Swizec/react-testing-example).

We've learned that:

  1. React forces you to modularize and encapsulate
  2. This makes code easy to test
  3. Unit tests aren't enough for frontends
  4. Karma is a great test runner
  5. Jest has potential
  6. Hot-loading is great

Well, the last part didn't fit in this blogpost. But Webpack *does* let you update code in the browser without losing state. It's awesome.
