//Define SVG width and hiegh and margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2])
    // .domain([8, d3.max(stateData, d => d[chosenXAxis])])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(stateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
      d3.max(stateData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisBottom(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function x_renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function y_renderCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  var xlabel;
  var ylabel;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty";
  }
  else if (chosenXAxis === "age") {
    xlabel = "Age (Median)";
  } 
  else {
    xlabel = "Income (Median)";
  }

  if (chosenYAxis === "healthcare") {
      ylabel = "Healthcare:";
    }
    else if (chosenXAxis === "smokes") {
      ylabel = "Smokes";
    } 
    else {
      ylabel = "Obesity";
    }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}: ${d.chosenXAxis} <br>${ylabel}: ${d.chosenYAxis}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
  // onmouseout event
  .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}
   

// Retrieve data from the CSV file and execute everything below
d3.csv(`assets/data/data.csv`).then(function(stateData, err) {
    if (err) throw err;

    var states_abbr = stateData.map(row => row.abbr);
    console.log(states_abbr);

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  // Step 2: Create scale functions
  // ==============================
  // var xLinearScale = d3.scaleLinear()
  // .domain([8, d3.max(stateData, d => d.poverty)])
  // .range([0, width]);

   // xLinearScale function above csv import
   var xLinearScale = xScale(stateData, chosenXAxis);

  // var yLinearScale = d3.scaleLinear()
  // .domain([4, d3.max(stateData, d => d.healthcare)])
  // .range([height, 0]);

    // yLinearScale function above csv import
    var yLinearScale = yScale(stateData, chosenYAxis);

    // // Create initial axis functions
    // var bottomAxis = d3.axisBottom(xLinearScale);
    // var leftAxis = d3.axisLeft(yLinearScale);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================  
  // append x axis
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis); 

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(stateData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 15)
  .attr("fill", "lightblue")
  .attr("opacity", ".9");

  //Adding text labels 
  // var texts = chartGroup.selectAll("text")  
  // .data(stateData)
  // .enter()
  // .append("text")
  // .attr("x", d => xLinearScale(d.poverty))
  // .attr("y", d => yLinearScale(d.healthcare))
  // .attr("text-anchor",  "middle")
  // .attr('alignment-baseline', 'central')
  // .attr('fill', 'white')
  // .style('font-size',"0.8em")
  // .text((d,i) => i);

  chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr('alignment-baseline', 'central')
        .style('font-size',"0.8em")
        .attr('fill', 'white')
        .selectAll("tspan")
        .data(stateData)
        .enter()
        .append("tspan")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare - 0.2))
        .text(d => d.abbr);



  
    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });  

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");
  
}).catch(function(error) {
  console.log(error);
});
