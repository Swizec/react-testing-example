
var normal = d3.random.normal(1, 1);
var fakeData = d3.range(1000).map(function () {
    return [normal(), normal()];
});

React.render(
    <ScatterPlot width="500" height="500" data={fakeData} />,
    document.querySelectorAll('.container')[0]
);
