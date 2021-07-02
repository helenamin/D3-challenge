//Define SVG width and hiegh and margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 60,
  right: 40,
  bottom: 140,
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
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.95,
      d3.max(stateData, d => d[chosenXAxis]) * 1.05])
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
      d3.max(stateData, d => d[chosenYAxis]) * 1.05])
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
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]} <br>${ylabel}: ${d[chosenYAxis]}`);
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

   // xLinearScale function above csv import
   var xLinearScale = xScale(stateData, chosenXAxis);

    // yLinearScale function above csv import
    var yLinearScale = yScale(stateData, chosenYAxis);



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
        .attr("y", d => yLinearScale(d.healthcare - 0.3))
        .text(d => d.abbr);

  // Step 6: Create Axis Labels
  // ==============================

  // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") // value to grab for event listener
  .classed("active", true)
  .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income") // value to grab for event listener
  .classed("active", true)
  .text("Household Income (Median)");



  // Create group for three y-axis labels
  var ylabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${0 - margin.left + 40}, ${ 0- (height /2) })`);

  var healthcareLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", (height / 2)-140)
  .attr("x", 0-margin.left*3)
  .attr("dy", "1em")
  .attr("value", "healthcare") // value to grab for event listener
  .classed("active", true)
  .text("Lacks Healthcare (%)");

  var smokesLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0-margin.left*3)
  .attr("y", (height / 2)-150)
  .attr("value", "smokes") // value to grab for event listener
  .classed("active", true)
  .text("Smokes (%)");

  var obesityLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0-margin.left*3)
  .attr("y", (height / 2)-175)
  .attr("value", "obesity") // value to grab for event listener
  .classed("active", true)
  .text("Obesity (%)");


  // Step 7: tooltip
  // ==============================

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
// x axis labels event listener
xlabelsGroup.selectAll("text")
  .on("click", function() { 

  // x axis labels event listener
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {    

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(stateData, chosenXAxis);
          
          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);
          
          // updates circles with new x values
          circlesGroup = x_renderCircles(circlesGroup, xLinearScale, chosenXAxis);
          
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
          
          // changes classes to change bold text
          if (chosenXAxis === "poverty") {
              povertyLabel
                .classed("active", true)
                .classed("inactive", false);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenXAxis === "age") {
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                .classed("active", true)
                .classed("inactive", false);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);                  
            } 
            else {
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", true)
                .classed("inactive", false);      
            }
      }
  });

// y axis labels event listener
ylabelsGroup.selectAll("text")
.on("click", function() { 
  // y axis labels event listener    
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {            

          // replaces chosenXAxis with value
          chosenYAxis = value;

          // console.log(chosenYAxis)

          // functions here found above csv import
          // updates y scale for new data
          yLinearScale = yScale(stateData, chosenYAxis);
          
          // updates y axis with transition
          yAxis = renderAxes(yLinearScale, yAxis);
          
          // updates circles with new y values
          circlesGroup = y_renderCircles(circlesGroup, yLinearScale, chosenYAxis);
          
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
          
          // changes classes to change bold text
          if (chosenYAxis === "healthcare") {
              healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              obesityLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
                .classed("active", true)
                .classed("inactive", false);
              obesityLabel
                .classed("active", false)
                .classed("inactive", true);                  
            } 
            else {
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
              smokesLabel
                .classed("active", false)
                .classed("inactive", true);
              obesityLabel
                .classed("active", true)
                .classed("inactive", false);      
            }            
      }
  });
  
    // // Step 7: Initialize tool tip
    // // ==============================
    // var toolTip = d3.tip()
    //   .attr("class", "d3-tip")
    //   .offset([80, -60])
    //   .html(function(d) {
    //     return (`${d.state}<br>poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
    //   });

    // // Step 7: Create tooltip in the chart
    // // ==============================
    // chartGroup.call(toolTip);

    // // Step 8: Create event listeners to display and hide the tooltip
    // // ==============================
    // circlesGroup.on("mouseover", function(data) {
    //   toolTip.show(data, this);
    // })
    //   // onmouseout event
    //   .on("mouseout", function(data, index) {
    //     toolTip.hide(data);
    //   });  

    // // Create axes labels
    // chartGroup.append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 0 - margin.left + 40)
    //   .attr("x", 0 - (height / 2))
    //   .attr("dy", "1em")
    //   .attr("class", "axisText")
    //   .text("Lack Healthcare (%)");

    // chartGroup.append("text")
    //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    //   .attr("class", "axisText")
    //   .text("Poverty (%)");
  
}).catch(function(error) {
  console.log(error);
});
