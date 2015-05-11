
jest.dontMock('../src/ScatterPlot.jsx');

var React = require('react/addons'),
    ScatterPlot = require('../src/ScatterPlot.jsx'),
    TestUtils = React.addons.TestUtils;

describe('ScatterPlot', function () {
    it("renders an h1", function () {
        var scatterplot = TestUtils.renderIntoDocument(
            <ScatterPlot />
        );

        var h1 = TestUtils.findRenderedDOMComponentWithTag(
            scatterplot, 'h1'
        );

        expect(h1.getDOMNode().textContent).toEqual("This is a scatterplot");
    });
});
