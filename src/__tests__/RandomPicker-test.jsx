
var React = require('react/addons'),
    RandomPicker = require('../RandomPicker.jsx'),
    TestUtils = React.addons.TestUtils,
    expect = require('expect');

describe("RandomPicker", function () {
    it("loads without error", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker />
        );

        expect(picker).toExist();
    });

    it("shows two inputs for normal distribution", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker initialDistribution="normal" />
        );

        var input = TestUtils.scryRenderedDOMComponentsWithTag(
            picker, "input"
        );

        expect(input.length).toEqual(2);
    });

    it("shows two inputs for logNormal distribution", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker initialDistribution="logNormal" />
        );

        var input = TestUtils.scryRenderedDOMComponentsWithTag(
            picker, "input"
        );

        expect(input.length).toEqual(2);
    });

    it("shows one input for bates distribution", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker initialDistribution="bates" />
        );

        var input = TestUtils.scryRenderedDOMComponentsWithTag(
            picker, "input"
        );

        expect(input.length).toEqual(1);
    });

    it("shows one input for irwinHall distribution", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker initialDistribution="irwinHall" />
        );

        var input = TestUtils.scryRenderedDOMComponentsWithTag(
            picker, "input"
        );

        expect(input.length).toEqual(1);
    });

    it("shows a distributions dropdown", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker />
        );

        var select = TestUtils.findRenderedDOMComponentWithTag(
            picker, "select"
        ),
            options = TestUtils.scryRenderedDOMComponentsWithTag(
                select, "option"
            );

        expect(select).toExist();
        expect(options.length).toEqual(4);
    });

    it("changes distribution", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker initialDistribution="normal" />
        );

        var select = TestUtils.findRenderedDOMComponentWithTag(
            picker, "select"
        );

        TestUtils.Simulate.change(select.getDOMNode(), {target: {value: "bates"}});

        expect(picker.state.distribution).toEqual("bates");
    });

    it("saves input values", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker />
        ),
            mean = TestUtils.findRenderedDOMComponentWithClass(
                picker, "mean"
            ),
            deviation = TestUtils.findRenderedDOMComponentWithClass(
                picker, "deviation"
            );

        TestUtils.Simulate.change(mean.getDOMNode(),
                                  {target: {value: 3, name: "mean"}});
        TestUtils.Simulate.change(deviation.getDOMNode(),
                                  {target: {value: 1, name: "deviation"}});

        expect(picker.state.mean).toEqual(3);
        expect(picker.state.deviation).toEqual(1);
    });

    it("ensures inputs are always Number", function () {
        var picker = TestUtils.renderIntoDocument(
            <RandomPicker />
        );

        ["mean", "deviation"].forEach(function (key) {
            var input = TestUtils.findRenderedDOMComponentWithClass(
                picker, key
            );

            TestUtils.Simulate.change(input.getDOMNode(),
                                      {target: {value: "", name: key}});

            expect(picker.state[key]).toEqual(0);
        });
    });
});
