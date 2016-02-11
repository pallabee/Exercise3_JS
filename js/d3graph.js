
function plotD3Graph(canvasId,path)
{
var margin = {top: 20, right: 20, bottom: 350, left: 40},
width = 1000 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom,

x = d3.scale.ordinal().rangeRoundBands([0, width], .5),

y = d3.scale.linear().range([height, 0]),

xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.ticks(10);

yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(10),

// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     return "<strong>Yield:</strong> <span style='color:red'>" + d.y + "</span>";
//   });

svg = d3.select(canvasId).append("svg")



.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform","translate(" + margin.left + "," + margin.top + ")");


d3.json(path, function(error, data) {
data.forEach(function (d) {

    d.x =d.x;

    d.y = +d.y;
});

x.domain(data.map(function(d) { return d.x; }));
y.domain([0, d3.max(data, function(d) { return d.y; })]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
.selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)" );

    // svg.call(tip);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 3)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Production (Tons)");

svg.selectAll("bar")
    .data(data)
.enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d.x); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.y); })
    .attr("height", function(d) { return height - y(d.y); });

});
}
