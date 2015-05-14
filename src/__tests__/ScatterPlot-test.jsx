
//jest.dontMock('../src/ScatterPlot.jsx');

var React = require('react/addons'),
    ScatterPlot = require('../ScatterPlot.jsx'),
    TestUtils = React.addons.TestUtils,
    expect = require('expect');

var d3 = require('d3');

describe('ScatterPlot', function () {
    var normal = d3.random.normal(1, 1),
        mockData = d3.range(5).map(function () {
        return {x: normal(), y: normal()};
    });

    it("renders an h1", function () {
        var scatterplot = TestUtils.renderIntoDocument(
            <ScatterPlot />
        );

        var h1 = TestUtils.findRenderedDOMComponentWithTag(
            scatterplot, 'h1'
        );

        expect(h1.getDOMNode().textContent).toEqual("This is a scatterplot");
    });

    it("renders an svg with appropriate dimensions", function () {
        var scatterplot = TestUtils.renderIntoDocument(
            <ScatterPlot width="500" height="500" />
        );

        var svg = TestUtils.findRenderedDOMComponentWithTag(
            scatterplot, 'svg'
        );

        expect(svg.getDOMNode().getAttribute("width")).toEqual('500');
        expect(svg.getDOMNode().getAttribute("height")).toEqual('500');
    });

    it("renders a circle for each datapoint", function () {
        var scatterplot = TestUtils.renderIntoDocument(
            <ScatterPlot data={mockData} />
        );

        var circles = TestUtils.scryRenderedDOMComponentsWithTag(
            scatterplot, 'circle'
        );

        expect(circles.length).toEqual(5);
    });

    it("keeps circles in bounds", function () {
        var scatterplot = TestUtils.renderIntoDocument(
            <ScatterPlot data={mockData} width="500" height="500" />
        );

        var circles = TestUtils.scryRenderedDOMComponentsWithTag(
            scatterplot, 'circle'
        );

        circles.forEach(function (circle) {
            var cx = circle.getDOMNode().getAttribute("cx"),
                cy = circle.getDOMNode().getAttribute("cy");

            expect(Number(cx)).toBeMoreThan(0)
                              .toBeLessThan(500);
            expect(Number(cy)).toBeMoreThan(0)
                              .toBeLessThan(500);
        });
    });
});
