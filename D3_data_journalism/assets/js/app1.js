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

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);



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
  var xLinearScale = d3.scaleLinear()
  .domain([8, d3.max(stateData, d => d.poverty)])
  .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .domain([4, d3.max(stateData, d => d.healthcare)])
  .range([height, 0]);

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
