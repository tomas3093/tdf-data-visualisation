//variable containing reference to data
var data;

//D3.js canvases
var textArea;
var barChartArea;
var heatMap;

//D3.js svg elements
var selectedAreaText;

//variables for selection
var selectedRegion;
var lastSelectedRegion;

/*Loading data from CSV file and editing the properties to province codes. Unary operator plus is used to save the data as numbers (originally imported as string)*/
d3.csv("./public/data.csv")
    .row(function(d) { return {
      date : d.Date,
      Argentina : +d.Argentina,
      Buenos_Aires : +d["Buenos Aires"],
      La_Pampa : +d["La Pampa"],
      Mendoza : +d.Mendoza,
      Santa_Fe : +d["Santa Fe"],
      CĂłrdoba : +d.CĂłrdoba
    }; 
  }).get(function(error, rows) { 
      //saving reference to data
      data = rows;

      //load map and initialise the views
      init();

      // data visualization
      visualization();
  });

/*----------------------
INITIALIZE VISUALIZATION
----------------------*/
function init() {

  let width = screen.width;
  let height = screen.height;

  //retrieve a SVG file via d3.request, 
  //the xhr.responseXML property is a document instance
  function responseCallback (xhr) {
    d3.select("#map_div").append(function () {
            return xhr.responseXML.querySelector('svg');
        }).attr("id", "map")
        .attr("width", width/4)
        .attr("height", height-100)
        .attr("x", 0)
        .attr("y", 0);
    };

  //You can select the root <svg> and append it directly
  d3.request("public/ar.svg")
    .mimeType("image/svg+xml")
    .response(responseCallback)
    .get(function(n){
        let map = d3.select("body").select("#map");
        map.selectAll("path")
                .style("fill", "#000000")
                .style("stroke", "#3e4147")
                .on("click", function(){
                  mapClick(this);});
    });

  //d3 canvases for svg elements
  textArea = d3.select("#text_div").append("svg")
                                    .attr("width",d3.select("#text_div").node().clientWidth)
                                    .attr("height",d3.select("#text_div").node().clientHeight);

  barChartArea = d3.select("#barchart_div").append("svg")
                                    .attr("width",d3.select("#barchart_div").node().clientWidth)
                                    .attr("height",d3.select("#barchart_div").node().clientHeight);

  heatMap = d3.select("#heatmap_div").append("svg")
                                    .attr("width",d3.select("#heatmap_div").node().clientWidth)
                                    .attr("height",d3.select("#heatmap_div").node().clientHeight);

  //init selections
  selectedRegion = 'Argentina';

  // Remembering last selected region for animation
  lastSelectedRegion = 'none';
}


/*----------------------
BEGINNING OF VISUALIZATION
----------------------*/
function visualization() {

  drawTextInfo();

  drawBarChart();

  drawHeatMap();

}

/*----------------------
TASKS:
1) Create a bar chart of the number of ill people over the time in Argentina 
2) Create a heat map for all regions in the dataset
3) Connect SVG map with the bar chart
4) Animate bar chart transitions
----------------------*/

/*----------------------
TEXT INFORMATION
----------------------*/
function drawTextInfo(){
  //Draw headline
  textArea.append("text")
         .attrs({dx: 20, dy: "1em", class: "headline"})
         .text("Graph of flu trends in Argentina");

  //Draw source
  textArea.append("text")
         .attrs({dx: 20, dy: "3.5em", class: "subline"})
         .text("Data source: Google Flu Trends")
         .on("click", function() { window.open("http://www.google.org/flutrends"); });;

  //Draw selection information
  selectedAreaText = textArea.append("text")
         .attrs({dx: 20, dy: "4.8em", class: "subline"})
         .text("Selected Region: " + selectedRegion);
}


/*----------------------
BAR CHART
----------------------*/
function drawBarChart(){

  let thisCanvasWidth = barChartArea.node().clientWidth;
  let thisCanvasHeight = barChartArea.node().clientHeight;

  let maxHeight = 0;
  for (let i = 0; i < data.length; i++) {
    for (var key in data[0]) {
      if (key != 'date' && key != 'CĂłrdoba' && data[i][key] > maxHeight) {
        maxHeight = data[i][key];
      }
    }
  }

  let barWidth = thisCanvasWidth / data.length;

  for (let i = 0; i < data.length; i++) {
    
    // Animation if nothing was selected previously
    if (lastSelectedRegion == 'none') {
      barChartArea.append('rect').attrs({ 
        x: i * barWidth, 
        y: thisCanvasHeight, 
        width: barWidth + 1, 
        height: 0, 
        fill: 'red' 
      })
      .transition()
      .duration(750)
      .attrs({ 
        x: i * barWidth, 
        y: thisCanvasHeight - (data[i][selectedRegion]/maxHeight) * thisCanvasHeight, 
        width: barWidth + 1, 
        height: (data[i][selectedRegion]/maxHeight) * thisCanvasHeight, 
        fill: 'red' 
      });

    } else {
      barChartArea.append('rect').attrs({ 
        x: i * barWidth, 
        y: thisCanvasHeight - (data[i][lastSelectedRegion]/maxHeight) * thisCanvasHeight, 
        width: barWidth + 1, 
        height: (data[i][lastSelectedRegion]/maxHeight) * thisCanvasHeight, 
        fill: 'red' 
      })
      .transition()
      .duration(750)
      .attrs({ 
        x: i * barWidth, 
        y: thisCanvasHeight - (data[i][selectedRegion]/maxHeight) * thisCanvasHeight, 
        width: barWidth + 1, 
        height: (data[i][selectedRegion]/maxHeight) * thisCanvasHeight, 
        fill: 'red' 
      });
    }

      
  }
  
  let thisYear = '2000';
  for (let i = 0; i < data.length; i++) {
    if(data[i].date.substring(0,4) != thisYear){
      barChartArea.append("text")
         .attrs({dx: i*barWidth, dy: thisCanvasHeight-5, "font-size": "15px"})
         .text(data[i].date.substring(0,4))
      thisYear = data[i].date.substring(0,4);
    }
  } 

  lastSelectedRegion = selectedRegion;

  //Square animation example
  // barChartArea.append('rect')
  //          .attrs({ x: thisCanvasWidth/3, y: thisCanvasHeight/3, width: 80, height: 80, fill: 'red' })
  //          .transition()
  //          .duration(5000)
  //          .attrs({ x: 2*thisCanvasWidth/3, y: 2*thisCanvasHeight/3, width: 40, height: 40, fill: 'blue' });

}

/*----------------------
HEAT MAP
----------------------*/
function drawHeatMap(){

  let thisCanvasWidth = heatMap.node().clientWidth;
  let thisCanvasHeight = heatMap.node().clientHeight;

  var maxHeight = 0;
  for (var i = 0; i < data.length; i++) {
    for (var key in data[i]) {
      if (key != 'date') {
        if (data[i][key] > maxHeight) maxHeight = data[i][key];  
      }
    }
  }
  //console.log(maxHeight); // 559


  let barWidth = thisCanvasWidth / data.length;

  for (var i = 0; i < data.length; i++) {

    // Zistenie kolko je oblasti
    let areas = 0;
    for (var key in data[0]) {
      if (key != 'date' && key != 'CĂłrdoba') {
        areas++;
      }
    }

    let yPos = 0;
    for (var key in data[i]) {
      if (key != 'date' && key != 'CĂłrdoba') {
        var c = d3.color("green");
        c.opacity = (data[i][key]/maxHeight);
        heatMap.append('rect')
                              .attrs({ x: i * barWidth, 
                              y: thisCanvasHeight - (thisCanvasHeight / areas) * (areas - yPos), 
                              width: barWidth, 
                              height: thisCanvasHeight / areas, 
                              fill: c });


        // Vykreslenie labelov jednotlivych oblasti
        if (i == data.length - 1) {
          heatMap.append('text') .attrs({
            x: 10,
            y: thisCanvasHeight + 25 - (thisCanvasHeight / areas) * (areas - yPos),
            'font-size': '20px',
            fill: 'white'
          })
          .text(key);
        }

        yPos++;
      }
    }
  }
}

/*----------------------
INTERACTION
----------------------*/
function mapClick(region){
    console.log(region.id);

    for (var key in data[0]) {
      if (key == region.id) {
        selectedRegion = region.id;

        // Set lastSelectedRegion to none, for restart of the barchart animation
        if (lastSelectedRegion == selectedRegion) {
          lastSelectedRegion = 'none';
        }

        //Draw selection information
        selectedAreaText.remove();
        selectedAreaText = textArea.append("text")
          .attrs({dx: 20, dy: "4.8em", class: "subline"})
          .text("Selected Region: " + selectedRegion);

        // Redraw barChart
        barChartArea.remove();
        barChartArea = d3.select("#barchart_div").append("svg")
                                    .attr("width",d3.select("#barchart_div").node().clientWidth)
                                    .attr("height",d3.select("#barchart_div").node().clientHeight);

        drawBarChart();

        break;
      }
    }
}






