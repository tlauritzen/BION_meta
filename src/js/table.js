var width = 960,
height = 500;

/*
var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(32," + (height / 2) + ")");
*/
var table = d3.select("body").append("table");

/*
d3.json('../../data/data.json', function(collection) {
  d3.select("svg")
    .selectAll("circle")
      .data(collection.row_totals)
    .enter().append("circle")
    .attr("cy", 90)
    .attr("cx", function(d) {
        return d;
    })
    .attr("r", function(d) {
    return Math.sqrt(d);
    })
    });
*/

d3.json('../../data/data.json', function(collection) {
    
    var thead = table.append("thead");
    var headerRow = thead.append("tr");
    headerRow.append("th");
    headerRow.selectAll("th").data(collection.col_titles).enter().append("th").classed("rotate45", true).text(function(d) { return d;});
    var tbody = table.append("tbody");
    var row = tbody.selectAll("#dataRow").data(collection.row_titles).enter().
	append("tr").append("td").
	attr("class", "dataRow").text(function(d) {return d;});
    
    var config = collection.config;
    var background = d3.rgb("#" + config["background-color"]);
    
    var minColor = d3.rgb('#' + config["ramp-min-color"].toLowerCase());
    var minColorStr = minColor.toString();
    var maxColor = d3.rgb(config["ramp-max-color"].toLowerCase());
    var maxColorStr = maxColor.toString();
    
    function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16);}
    function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16);}
    function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16);}
    function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h;}
    
    var minR = hexToR(minColorStr);
    var maxR = hexToR(maxColorStr);
    var minG = hexToG(minColorStr);
    var maxG = hexToG(maxColorStr);
    var minB = hexToB(minColorStr);
    var maxB = hexToB(maxColorStr);  
  
    var getColor = function(value, max) {
	var relValue = value/max;
	var r = (minR + relValue*(maxR-minR)) >> 0;
	var g = (minG + relValue*(maxG-minG)) >> 0;
	var b = (minB + relValue*(maxB-minB)) >> 0;
	console.log(value + ' ' + max + ' ' + 'rgb(' + r + ', ' + g + ', ' + b + ')');
	return d3.rgb('rgb(' + r + ', ' + g + ', ' + b + ')').toString();
    }
  
    var rowMax = null;
    var lastRowIndex = -1;
    var getRowMax = function(rowIndex) {
	
	if(lastRowIndex < rowIndex) {
	    var row = collection.values[rowIndex];
	    var max = row[0];
	    row.forEach(function(x) {
		if(x > max) max = x;
	    });
	    rowMax = max;
	    lastRowIndex = rowIndex;
	    //      alert(rowMax);
	}
	return rowMax;
	
    }
  
    d3.selectAll("tbody tr")
	.data(collection.values)
	.selectAll("td")
	.attr("width", "600px")
	.classed("rotate45", true)
	.data(function(d, i) { return d; }).enter().append("td")
	.style("font-size", config["text-size"])
	.style("color", "#" + config["text-color"])
	.style("background", function(d, i, j) {return getColor(d, getRowMax(j));})
	.text(function(d) {return d;}); // d is collection.values[i]
    
});


/*
"config": {
  "cell-margin-left": "0.07em",
  "cell-height": "0.5em",
  "ramp-min-color": "CCCCCC",
  "text-size": "1em",
  "text-color": "333333",
  "cell-margin-bottom": "0.05em",
  "ramp-max-color": "SeaGreen",
  "cell-margin-right": "0.07em",
  "cell-margin-top": "0.05em",
  "cell-width": "1em",
  "background-color": "CCCCCC"
}
*/


/*
var circle = svg.selectAll("circle").data(input.row_totals);
var enter = circle.enter().append("circle");
enter.attr("cy", 90);

enter.attr("cx", function(d) {
  return d;
});

enter.attr("r", function(d) {
  return Math.sqrt(d);
});
*/