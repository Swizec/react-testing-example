
var React = require('react/addons');
var d3 = require('d3');

var RandomPicker = React.createClass({
    mixins: [React.addons.PureRenderMixin],

    getInitialState: function () {
        return {
            distribution: this.props.initialDistribution || "normal",
            count: .05,
            mean: 5,
            deviation: 1
        }
    },

    inputs: {
        normal: [{key: "mean", label: "Mean"}, {key: "deviation", label: "Deviation"}],
        logNormal: [{key: "mean", label: "Mean"}, {key: "deviation", label: "Deviation"}],
        bates: [{key: "count", label: "Count"}],
        irwinHall: [{key: "count", label: "Count"}]
    },

    pickDistribution: function (event) {
        this.setState({distribution: event.target.value});
    },

    inputChange: function (event) {
        var name = event.target.name,
            d = {};
        d[name] = Number(event.target.value);

        this.setState(d);
    },

    componentDidUpdate: function () {
        if (this.props.newRandomFunction) {
            var distribution = this.state.distribution,
                args = this.inputs[distribution].map(function (input) {
                    return this.state[input.key] || 0;
                }.bind(this));

            var random = d3.random[this.state.distribution].apply(this, args);

            this.props.newRandomFunction(random);
        }
    },

    render: function () {
        return (
            <form className="form-inline">
                <h4>Pick a random distribution</h4>
                <div className="form-group">
                    <label>Distribution</label>
                    <select className="form-control"
                            onChange={this.pickDistribution}
                            value={this.state.distribution}>
                        {Object.keys(this.inputs).map(function (distribution) {
                            return (
                                <option value={distribution} key={distribution}>
                                    {distribution}
                                </option>
                            );
                        })}
                    </select>
                </div>
                {this.inputs[this.state.distribution].map(function (input) {
                    return (
                        <div className="form-group" key={input.key}>
                            <label>{input.label}</label>
                            <input type="number"
                                   className={input.key + " form-control"}
                                   value={this.state[input.key]}
                                   name={input.key}
                                   onChange={this.inputChange} />
                        </div>
                    );
                 }.bind(this))}
            </form>
        );
    }
});

module.exports = RandomPicker;
