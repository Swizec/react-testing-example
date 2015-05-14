
if (typeof require !== 'undefined') {
    var React = require('react/addons');
    var d3 = require('d3');
}

var ScatterPlot = React.createClass({
    getDefaultProps: function () {
        return {
            data: [],
            width: 500,
            height: 500,
            point_r: 3
        }
    },

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
});

if (typeof module !== 'undefined') {
    module.exports = ScatterPlot;
}
