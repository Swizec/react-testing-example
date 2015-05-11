
if (typeof require !== 'undefined') {
    var React = require('react/addons');
}

var ScatterPlot = React.createClass({
    getDefaultProps: function () {
        return {
            data: [],
            width: 500,
            height: 500
        }
    },

    render: function () {
        return (
            <div>
                <h1>This is a scatterplot</h1>
                <svg width={this.props.width} height={this.props.height}>
                    {this.props.data.map(function (pos) {
                        return (
                            <circle />
                        );
                     })};
                </svg>
            </div>
        );
    }
});

if (typeof module !== 'undefined') {
    module.exports = ScatterPlot;
}
