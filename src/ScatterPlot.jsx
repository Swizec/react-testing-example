
if (typeof require !== 'undefined') {
    var React = require('react/addons');
}

var ScatterPlot = React.createClass({
    render: function () {
        return (
            <h1>This is a scatterplot</h1>
        );
    }
});

if (typeof module !== 'undefined') {
    module.exports = ScatterPlot;
}
