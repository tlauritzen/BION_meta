function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}


d3.json('../../data/data.json', function(collection) {

    var emInPixels = window.getComputedStyle(document.body, null).fontSize.replace('px', '');

    var config = collection.config;

    var cellMarginLeft = config["cell-margin-left"].replace('em', '') * emInPixels;
    var cellMarginBottom = config["cell-margin-bottom"].replace('em', '') * emInPixels;
    var cellMarginRight = config["cell-margin-right"].replace('em', '') * emInPixels;
    var cellMarginTop = config["cell-margin-top"].replace('em', '') * emInPixels;

    var cellWidth = config["cell-width"].replace('em', '') * emInPixels;
    var cellHeight = config["cell-height"].replace('em', '') * emInPixels;
    
    var textSizeInEm = config["text-size"].replace('em', '');
    var textSizeInPx = textSizeInEm * emInPixels;

    var m = collection.values[0].length;
    var n = collection.values.length;

    var margin = {top: 2 * emInPixels, right: 0, bottom: .5 * emInPixels, left: 2 * emInPixels},
      width = (cellWidth + cellMarginLeft + cellMarginRight) * m,
      height = (cellHeight + cellMarginTop + cellMarginBottom) * n,
      rowCaptionWidth = 50 * emInPixels * textSizeInEm,
      colCaptionHeight = 6 * emInPixels * textSizeInEm;

    console.log(cellWidth);

    d3.selectAll("#title")
	.style("padding-left", margin.left + "px")
	.html("<h1>" + collection.title + "</h1>");

    d3.selectAll("#comment")
	.style("padding-left", margin.left + "px")
	.style("font-weight", "800")
	.html("<span>" + collection.comments + "</span>");

    var svgContainer = d3.select("#svg").append("svg")
	.attr("width", (width + margin.left + margin.right + rowCaptionWidth) + "px")
	.attr("height", (height + margin.top + margin.bottom + colCaptionHeight) + "px")
	.style("margin-left", margin.left + "px")
	.append("g")


    svgContainer.attr("transform", "translate(" + margin.left + "px," + margin.top + "px)");


    var cellX = d3.scale.linear()
	.domain([0, m])
	.range([0, width]);

    var cellY = d3.scale.linear()
	.domain([0, n+1])
	.range([0, height]);


    var background = d3.rgb("#" + config["background-color"]);

    var minColor = d3.rgb('#' + config["ramp-min-color"].toLowerCase());
    var minColorStr = minColor.toString();
    var maxColor = d3.rgb(config["ramp-max-color"].toLowerCase());
    var maxColorStr = maxColor.toString();
        
    var minR = hexToR(minColorStr);
    var maxR = hexToR(maxColorStr);
    var minG = hexToG(minColorStr);
    var maxG = hexToG(maxColorStr);
    var minB = hexToB(minColorStr);
    var maxB = hexToB(maxColorStr);  
  
    var val_interval = collection.max_val - collection.min_val;
    var getColor = function(value) {
	var relValue = value/val_interval;
	var r = (minR + relValue*(maxR-minR)) >> 0;
	var g = (minG + relValue*(maxG-minG)) >> 0;
	var b = (minB + relValue*(maxB-minB)) >> 0;
	return d3.rgb('rgb(' + r + ', ' + g + ', ' + b + ')').toString();
    }

    var rows = svgContainer.selectAll('.row')
	.data(collection.values)
        .enter()
        .append('g')
        .attr("transform", function(d,i) {
 	    return "translate(0, " + (cellY(i) + colCaptionHeight) + ")";
	})
	.classed('row', true);

    var cells = rows
	.selectAll("rect")
	.data(function(d, i) { return d; })
	.enter()
	.append("rect");

    var cellAttributes = cells
	.attr("x", function(d, i, j) {return cellX(i); })
	.attr("width", cellWidth + "px")
	.attr("height", cellHeight + "px")    
	.style("fill", function(d, i, j) {
            return getColor(d);
	});


    rows = svgContainer.selectAll('.row')
	.data(collection.row_titles);

    var rowDy = cellHeight/2 + textSizeInPx/2;

    var row_captions = rows
	.append("text")
	.text(function(d, i) {return d;})
	.attr("x", width)
        .attr('dx', textSizeInPx + "px")
        .attr('dy', rowDy + "px")
	.attr('width', rowCaptionWidth + "px")
	.attr('height', cellY(1) + "px")
	.style("font-size", textSizeInEm + "em")
	.style("color", "#" + config["text-color"]);


    var cols = svgContainer.selectAll('.col_caption')
	.data(collection.col_titles)
        .enter()
	.append("g")
	.attr("width", colCaptionHeight + "px")
	.attr("height", cellY(1) + "px")
        .attr("transform", function(d, i) {
 	    return "translate(" + (cellX(i)) + ", " + colCaptionHeight + ")rotate(-90)";
	})
	.style('fill', 'white')
	.classed('col_caption', true);

    var colDy = cellWidth/2 + textSizeInPx/2;
    console.log(colDy);
    var col_captions = cols
	.append("text")
	.text(function(d, i) {return d;})
        .attr("text-anchor", "start")
        .attr("dx", textSizeInPx + "px")
        .attr("dy", colDy + "px")
	.style("font-size", textSizeInEm + "em")
	.style("color", "#" + config["text-color"])
	.style("fill", "black");

});


  