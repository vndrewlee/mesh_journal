// set up svg
const margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Original data
var dataset = {
    nodes: [
      {name: "wake up"},
      {name: "eat a snack"},
      {name: "go back to sleep"},
    ],
    edges: [
      {source: 0, target: 1},
      {source: 1, target: 2}
    ]
};

//Initialize a simple force layout, using the nodes and edges in dataset
var force = d3.forceSimulation(dataset.nodes)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(dataset.edges).distance(200))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2));

var colors = d3.scaleOrdinal(d3.schemeDark2);

//Create edges as lines
var edges = svg.selectAll("line")
    .data(dataset.edges)
    .enter()
    .append("line")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);

var nodes = svg.selectAll(".node")
    .data(dataset.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag() //Define what to do on drag events
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

//Create nodes as circles

nodes.append("circle")
  .attr("r", 10)
  .style("fill", function (d, i) {
      return colors(i);
  })

// add text
nodes.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name });

//Every time the simulation "ticks", this will be called
  force.on("tick", function() {
    edges.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

//Define drag event functions
function dragStarted(d) {
    if (!d3.event.active) force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragging(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragEnded(d) {
    if (!d3.event.active) force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

// TODO: bostock is using the word nodes differently from me, need to fix this
function restart() {
  // Apply the general update pattern to the nodes.
  node = node.data(nodes, function(d) { return d.id;});
  node.exit().remove();
  node = node.enter().append("circle").attr("fill", function(d) { return color(d.id); }).attr("r", 8).merge(node);

  // Apply the general update pattern to the links.
  link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
  link.exit().remove();
  link = link.enter().append("line").merge(link);

  // Update and restart the simulation.
  simulation.nodes(nodes);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}