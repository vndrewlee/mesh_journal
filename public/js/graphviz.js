// set up svg
const margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    },
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerWidth / 4 - margin.top - margin.bottom;

let svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let nodes = [{
        name: "wake up",
        fx: 0,
        fy: 0
    },
    {
        name: "poop"
    }
];

let my_nodes = ["wake up", "poop"];

let links = [];

my_nodes.forEach(function (n, i) {
    if (i < my_nodes.length - 1) {
        links.push({
            source: my_nodes[i],
            target: my_nodes[i + 1]
        })
    }
});

// set up empty 
let simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-10))
    .force("link", d3.forceLink().id(function (d) {
        return d.name;
    }))
    // .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .alphaTarget(1);

// add nodes and links
simulation.nodes(nodes);
simulation.force("link").links(links);

simulation.on("tick", function () {
    link.attr("x1", function (d) {
            return d.source.x;
        })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

    node.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
});

let colors = d3.scaleOrdinal(d3.schemeDark2);

//Create edges as lines
let link = svg.selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .style("stroke", "#ccc")
    .style("stroke-width", 1);

// add empty groups for each node
let node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag() //Define what to do on drag events
        .on("start", dragStarted)
        .on("drag", dragging)
        .on("end", dragEnded));

//Create add circle to node group
node.append("circle")
    .attr("r", 5)
    .style("fill", function (d, i) {
        return colors(i);
    });

// add text to node group
node.append("text")
    .attr("dx", 12)
    .attr("dy", ".1em")
    .text(function (d) {
        return d.name
    });

//Define drag event functions
function dragStarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragging(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragEnded(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function restart() {

    // Apply the general update pattern to the links.
    // link = link.data(links, function (d) {
    //     return d.source.id + "-" + d.target.id;
    // });
    link = link.data(links);

    link.exit().remove();

    link = link
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1)
        .merge(link);

    // Apply the general update pattern to the nodes.
    // node = node.data(nodes, function (d) {
    //     return d.id;
    // });
    node = node.data(nodes);

    node.exit().remove();

    node = node.enter().append("g")
        .attr("class", "node")
        .call(d3.drag() //Define what to do on drag events
            .on("start", dragStarted)
            .on("drag", dragging)
            .on("end", dragEnded))
        .merge(node);

    node.append("circle")
        .attr("r", 5)
        .style("fill", function (d, i) {
            return colors(i);
        });

    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".1em")
        .text(function (d) {
            return d.name
        });

    // Update and restart the simulation.
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}

var findNode = function (id) {
    for (var i in simulation.nodes()) {
        if (simulation.nodes()[i]["name"] == id) return simulation.nodes()[i]
    };
    return null;
}

var pushLink = function (link) {
    //console.log(link)
    if (findNode(link.source) != null && findNode(link.target) != null) {
        force.links().push({
            "source": findNode(link.source),
            "target": findNode(link.target)
        })
    }
}