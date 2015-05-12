
var fakeData = d3.range(100).map(function () {
    return [d3.random.normal(), d3.random.normal()];
});

React.render(
    <ScatterPlot width="500" height="500" data={fakeData} />,
    document.querySelectorAll('.container')[0]
);
