var margin = {top: 20, right: 20, bottom: 70, left: 40},
width = 600 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom,

// Parse the date / time
//***a better comment would be "for parsing the date and time"...
//parseDate = d3.time.format("%Y-%m").parse,

x = d3.scale.ordinal().rangeRoundBands([0, width], .05),

y = d3.scale.linear().range([height, 0]),

xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.ticks(10);
//.tickFormat(d3.time.format("%Y-%m")),

yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.ticks(10),

svg = d3.select("body").append("svg")
//***EDIT***
//the data method returns the enter collection and your not ready for it yet...
//.data(root)
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform","translate(" + margin.left + "," + margin.top + ")");

//d3.json

//d3.csv("bar-data.csv", function(error, data) {
//d3.selectAll('g').data(function(data){
d3.json("../data/oilseedsVsProd.json", function(error, data) {
data.forEach(function (d) {

    //NOW is parsing the date and time
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

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Value ($)");

svg.selectAll("bar")
    .data(data)
.enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d.x); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.y); })
    .attr("height", function(d) { return height - y(d.y); });

//You forgot to comment this out...
});
