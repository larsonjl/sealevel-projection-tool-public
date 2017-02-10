function drawTitle() {
    "use strict"
    var titleText = 'Title Test'

    d3.select("svg").append("text")
        .attr("x", (WIDTH / 2))
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("text-decoration", "none")
        .text(titleText);
}

function saveImageListener() {
    "use strict";
    var drawDeseason, smootherWidth, imgName;

    drawDeseason = checkDeseason();
    smootherWidth = Number(document.getElementById('smooth-width').value);
    imgName = 'CU_SL-' + jsonFilename.substr(5, jsonFilename.length - 10);
    if (drawDeseason === 1) { imgName = imgName + "_deseasoned"; }
    if (smootherWidth > 0) { imgName = imgName + "_smooth" + String(smootherWidth) + "days"; }
    imgName = imgName + ".png";
    saveSvgAsPng(document.getElementById(svg_id), imgName, {scale: 2, backgroundColor: "#FFFFFF"});
}

function plotFillProjection(projTimeSeries){
  var fillStyles  = {'gs':'fillgsmb', 'gd':'fillgdyn', 'th':'fillodyn', 'ad':'filladyn', 'as':'fillasmb', 'gl':'fillglac'}
  var fillNames  = {'gs':'Greenland SMB', 'gd':'Greenland Dyn.', 'th':'Ocean Dynamics', 'ad':'Antarctic Dyn.', 'as':'Antarctic SMB', 'gl':'Mountain Glaciers'}

   // Define plotting area
   plot_num = 1;
   svg_id = "svg-timeseries-" + plot_num;

   // clear previous plot
   d3.selectAll("svg > *").remove();

   svg = d3.select("#data-timeseries")
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("id", svg_id)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 750 400")
      .classed("svg-content-responsive", true);

   xScale = d3.scale.linear()
       .range([MARGINS.left, WIDTH - MARGINS.right - 200])
       .domain([2007, 2100]);

   yScale = d3.scale.linear()
       .range([HEIGHT + MARGINS.bottom, MARGINS.top + MARGINS.bottom])
       .domain([0, 1]);

   xAxis = d3.svg.axis()
         .scale(xScale)
         .orient("bottom")
         .innerTickSize(- HEIGHT + MARGINS.top)
         .outerTickSize(0)
         .tickPadding(4)
         .tickFormat(d3.format("d"));

   yAxis = d3.svg.axis()
         .scale(yScale)
         .orient("left")
         .innerTickSize(-WIDTH + MARGINS.right + MARGINS.left + 200)
         .outerTickSize(0)
         .tickPadding(8);

    svg_id = "svg-timeseries-" + plot_num;
    vis = d3.select('#' + svg_id);
     // Draw plotting area
     vis.append('svg:g').attr('class', 'x axis')
         .attr('transform', 'translate(0,' + (HEIGHT + MARGINS.bottom) + ')')
         .call(xAxis);

     svg.append("text")
         .attr("class", "x label").attr("text-anchor", "end")
         .attr('font-size', 16)
         .attr("x", 330).attr("y", 400).text("Year");

     vis.append('svg:g').attr('class', 'y axis')
         .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
         .call(yAxis);

     svg.append("text")
         .attr("class", "y label")
         .attr("text-anchor", "end")
         .attr("y", (MARGINS.left / 2 - 15))
         .attr("x", (-HEIGHT / 2 + MARGINS.bottom))
         .attr('font-size', 16)
         .attr("transform", "rotate(-90)")
         .text("Height (m)");

    // Initialize legend
    var legend = vis.append("g")
      .attr("class", "legend")
      .attr("x", 600)
      .attr("y", 100)
      .attr("height", 100)
      .attr("width", 100);

  legend.append("rect")
       .attr("x", 600)
       .attr("y", 120)
       .attr("width", 15)
       .attr("height", 2)
       .attr("style", 'black');

   legend.append("text")
      .attr("x", 625)
      .attr("y", 120 + 5)
      .text("Projection Total");

    // Construct x dimension for plot
    var timeYear = new Array(94)
    var area

    for (var i=0; i<timeYear.length; ++i){
      timeYear[i] = 2007 + i
    };

    var indx = d3.range(timeYear.length );

    var runningSum = new Array(94).fill(0);

    var legendMover = 0;

    for (variables in projTimeSeries){

          area = d3.svg.area()
                        .interpolate("basis")
                        .x0( function(d) { return xScale(timeYear[d])})
                        .x1( function(d) { return xScale(timeYear[d])})
                        .y0( function(d) { return yScale(runningSum[d])})
                        .y1( function(d) { return yScale((runningSum[d] + projTimeSeries[variables][d]))});

          vis.append('svg:path')
             .datum(indx)
             .attr('class', fillStyles[variables[0]+variables[1]])
             .attr('d', area)

          // Add legend element
          legend.append("rect")
               .attr("x", 600)
               .attr("y", 150 + legendMover)
               .attr("width", 15)
               .attr("height", 15)
               .attr("class", fillStyles[variables[0]+variables[1]]);

           legend.append("text")
              .attr("x", 625)
              .attr("y", 163 + legendMover)
              .text(fillNames[variables[0]+variables[1]]);
          legendMover += 40
          // Update running sum

          for (var i=0; i<runningSum.length; ++i){
            runningSum[i] += projTimeSeries[variables][i]
          };
          plot_num+=1
    }

    var line = d3.svg.line()
        .x(function(d) { return xScale(timeYear[d])})
        .y(function(d) { return yScale(runningSum[d])})

    vis.append("path")
      .datum(indx)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2.5)
      .attr("d", line);


}
