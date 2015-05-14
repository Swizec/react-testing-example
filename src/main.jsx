
var App = React.createClass({
    getInitialState: function () {
        return {
            random: d3.random.normal(5, 1)
        };
    },

    updateRandom: function (random) {
        this.setState({random: random});
    },

    render: function () {
        var data = d3.range(1000).map(function () {
            return {x: this.state.random(), y: this.state.random()};
        }.bind(this));

        return (
            <div>
                <ScatterPlot width="500" height="500" data={data} />
                <RandomPicker newRandomFunction={this.updateRandom} />
            </div>
        );
    }
});

React.render(
    <App />,
    document.querySelectorAll('.container')[0]
);
