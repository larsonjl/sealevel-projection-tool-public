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

   // Define plotting area
   plot_num = 1;
   svg_id = "svg-timeseries-" + plot_num;
   svg = d3.select("#data-timeseries")
      .append("div")
      .classed("svg-container", true)
      .append("svg")
      .attr("id", svg_id)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 800 400")
      .classed("svg-content-responsive", true);


   xScale = d3.scale.linear()
       .range([MARGINS.left, WIDTH - MARGINS.right])
       .domain([2006, 2100]);

   yScale = d3.scale.linear()
       .range([HEIGHT + MARGINS.bottom, MARGINS.top + MARGINS.bottom])
       .domain([0, 5]);

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
         .innerTickSize(-WIDTH + MARGINS.right + MARGINS.left)
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
         .attr("x", 455).attr("y", 392).text("Year");

     vis.append('svg:g').attr('class', 'y axis')
         .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
         .call(yAxis);


     svg.append("text")
         .attr("class", "y label")
         .attr("text-anchor", "end")
         .attr("y", (MARGINS.left / 2 - 5))
         .attr("x", (-HEIGHT / 2 + MARGINS.bottom))
         .attr("transform", "rotate(-90)")
         .text("Height (cm)");

    // Construct x dimension for plot
    var timeYear = new Array(94)
    var area

    for (var i=0; i<timeYear.length; ++i){
      timeYear[i] = 2006 + i
    };

    var indx = d3.range(timeYear.length );

    var runningSum = new Array(94).fill(0);

    for (variables in projTimeSeries){

          area = d3.svg.area()
                        .interpolate("basis")
                        .x0( function(d) { return xScale(timeYear[d])} )
                        .x1( function(d) { return xScale(timeYear[d])} )
                        .y0( function(d) { return yScale(scaleBy * runningSum[d])} )
                        .y1( function(d) { return yScale(scaleBy * (runningSum[d] + projTimeSeries[variables][d]))});

          vis.append('svg:path')
             .datum(indx)
             .attr('class', fillStyles[variables[0]+variables[1]])
             .attr('d', area)

          // Update running sum

          for (var i=0; i<runningSum.length; ++i){
            runningSum[i] += projTimeSeries[variables][i]
          };
          plot_num+=1
    }
    drawTitle();
}
