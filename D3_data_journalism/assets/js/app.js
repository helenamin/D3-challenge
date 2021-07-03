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
function renderXAxes(newXScale, xAxis) {
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
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles text while the transition to new coordination
function renderCircleTexts(circleTexts, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circleTexts.transition()
  .duration(1000)
  .attr("x", d => newXScale(d[chosenXAxis]))
  .attr("y", d => newYScale(d[chosenYAxis]));


  return circleTexts;
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
    else if (chosenYAxis === "smokes") {
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
d3.csv(`D3_data_journalism/assets/data/data.csv`).then(function(stateData, err) {
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
  var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
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

  // var texts = chartGroup.append("text")
  //       .attr("text-anchor", "middle")
  //       .attr('alignment-baseline', 'central')
  //       .style('font-size',"0.8em")
  //       .attr('fill', 'white')
  //       .selectAll("tspan")
  //       .data(stateData)
  //       .enter()
  //       .append("tspan")
  //       .attr("x", d => xLinearScale(d.poverty))
  //       .attr("y", d => yLinearScale(d.healthcare - 0.3))
  //       .text(d => d.abbr);

  var circleTexts = chartGroup.selectAll()
  .data(stateData)
  .enter()
  .append("text")
  .text(d => d.abbr)
  .attr("x", d => xLinearScale(d.poverty)) 
  .attr("y", d => yLinearScale(d.healthcare)) 
  .attr("text-anchor", "middle")
  .attr('alignment-baseline', 'central')
  .style('font-size',"0.8em")
  .attr('fill', 'white');

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
  .attr("y", 45)
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 70)
  .attr("value", "income") // value to grab for event listener
  .classed("inactive", true)
  .text("Household Income (Median)");



  // Create group for three y-axis labels
  var ylabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${0 - margin.left}, ${ 0- (height /2) })`);

  var healthcareLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", (height / 2)-100)
  .attr("x", 0-margin.left*3)
  .attr("dy", "1em")
  .attr("value", "healthcare") // value to grab for event listener
  .classed("active", true)
  .text("Lacks Healthcare (%)");

  var smokesLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0-margin.left*3)
  .attr("y", (height / 2)-110)
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .text("Smokes (%)");

  var obesityLabel = ylabelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", 0-margin.left*3)
  .attr("y", (height / 2)-135)
  .attr("value", "obesity") // value to grab for event listener
  .classed("inactive", true)
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
      
      // console.log(value);

      if (value !== chosenXAxis) {    

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // console.log(chosenXAxis)

          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(stateData, chosenXAxis);
          
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
          
          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
          

          
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
            else if (chosenXAxis === "income") {
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

          // updates circles texts with new x values
          circleTexts = renderCircleTexts(circleTexts, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)
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
          yAxis = renderYAxes(yLinearScale, yAxis);
          
          // updates circles with new y values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

        
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
            else if (chosenYAxis === "obesity") {
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
            
          // updates circles texts with new y values
          circleTexts = renderCircleTexts(circleTexts, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis)
      }
  });
  
}).catch(function(error) {
  console.log(error);
});
