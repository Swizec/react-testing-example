
if (typeof require !== 'undefined') {
    var React = require('react/addons');
    var d3 = require('d3');
}

var ScatterPlot = React.createClass({
    getDefaultProps: function () {
        return {
            data: [],
            width: 500,
            height: 500
        }
    },

    componentWillMount: function () {
        this.yScale = d3.scale.linear();
        this.xScale = d3.scale.linear();

        this.update_d3(this.props);
    },

    componentWillReceiveProps: function (oldProps, newProps) {
        this.update_d3(newProps);
    },

    update_d3: function (props) {
        this.yScale
            .domain([d3.min(props.data, function (d) { return d[1]; }),
                     d3.max(props.data, function (d) { return d[1]; })])
            .range([0, Number(props.height)]);

        this.xScale
            .domain([d3.min(props.data, function (d) { return d[0]; }),
                     d3.max(props.data, function (d) { return d[0]; })])
            .range([0, Number(props.width)]);
    },

    render: function () {
        return (
            <div>
                <h1>This is a scatterplot</h1>
                <svg width={this.props.width} height={this.props.height}>
                    {this.props.data.map(function (pos, i) {
                        var key = "circle-"+i;
                        return (
                            <circle key={key} />
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
