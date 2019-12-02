/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

import { loadData } from './modules/dataLoader.mjs';
import { CountryMapPolygon } from './modules/models.mjs';
import { mapColorScale } from './modules/colors.mjs';

// Data files
var data_gc = [];
var data_stages = [];

/* Load data from csv files and launch visualisation */
loadData(data_gc, data_stages, function() {
    //load map and initialise the views
    init();

    // data visualization
    visualization();
});


// Switch between GC and stages winners
var selectedGc = true;
var button = document.getElementById("btn");
button.addEventListener("click", function() {
    if (selectedGc) {
        amchartMapInitialize(data_stages);
        button.innerHTML = "Stage";
    } else {
        amchartMapInitialize(data_gc);
        button.innerHTML = "GC";
    }

    selectedGc = !selectedGc;
})


/*----------------------
INITIALIZE VISUALIZATION
----------------------*/
function init() {
    
    // Initialize amchart map
    amchartMapInitialize(data_gc);

}


/*----------------------
BEGINNING OF VISUALIZATION
----------------------*/
function visualization() {

    console.log("Visualisation started");

    //drawTextInfo();
  
    //drawBarChart();
  
    //drawHeatMap();
  
  }
// TODO VYTVORIT FUNKCIU REDRAW DATA na prepinanie medzi gc a stage

/* Initialize amchart map */
function amchartMapInitialize(dataset) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    /* Create map instance */
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    /* Set map definition */
    chart.geodata = am4geodata_worldLow;

    /* Set projection */
    chart.projection = new am4maps.projections.Miller();

    /* Create map polygon series */
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    /* Make map load polygon (like country names) data from GeoJSON */
    polygonSeries.useGeodata = true;

    /* Configure series */
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.applyOnClones = true;
    polygonTemplate.togglable = true;
    polygonTemplate.tooltipText = "{name}: {value}";    // Text to display onHover over region


    /* Bind additional data */
    // Create map structure of all countries
    let countriesCount = new Map();
    let l = chart.geodata.features;
    for (let index = 0; index < l.length; index++) {
        const element = l[index].properties;
        
        let value = countriesCount.get(element.id);
        if (value == undefined) {
            let obj = new CountryMapPolygon(element.id, element.name, 0, null, null);
            countriesCount.set(element.id, obj);
        } 
    }

    // Count winners from each country and find max value
    let maxValue = 0;
    for (let index = 0; index < dataset.length; index++) {
        const element = dataset[index];
        
        const mapItem = countriesCount.get(element.country_iso);
        if (mapItem != undefined) {
            mapItem.value += 1;
            if (mapItem.value > maxValue) {
                maxValue = mapItem.value;
            }
        }
    }

    // Calculate opacity and bind values to polygons
    polygonSeries.data = [];
    countriesCount.forEach(function(v, k, map) {    // key, value, map
                       
        // Bind data to polygon
        polygonSeries.data[polygonSeries.data.length] = {
            "id": v.id,
            "name": v.name,
            "value": v.value,
            "fill": mapColorScale(v.value, 0, maxValue)   // Custom color scale function
        }
    });

    /* HEATMAP
    polygonSeries.heatRules.push({
        "property": "fill",
        "target": polygonSeries.mapPolygons.template,
        "min": am4core.color("#CCD7F8"),
        "max": am4core.color("#6B0000")
    });
    var heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.width = am4core.percent(100);
    heatLegend.valign = "bottom";
    */

    polygonTemplate.propertyFields.fill = "fill";

    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeOpacity = 1;
    polygonTemplate.fill = chart.colors.getIndex(0);
    var lastSelected;
    polygonTemplate.events.on("hit", function(ev) {

        console.log(ev.target.dataItem.dataContext.name);

        if (lastSelected) {
            // This line serves multiple purposes:
            // 1. Clicking a country twice actually de-activates, the line below
            //    de-activates it in advance, so the toggle then re-activates, making it
            //    appear as if it was never de-activated to begin with.
            // 2. Previously activated countries should be de-activated.
            lastSelected.isActive = false;
        }
        ev.target.series.chart.zoomToMapObject(ev.target);
        if (lastSelected !== ev.target) {
            lastSelected = ev.target;
        }
    })


    /* Create selected and hover states and set alternative fill color */
    var ss = polygonTemplate.states.create("active");
    ss.properties.fill = chart.colors.getIndex(2);

    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(4);

    // Hide Antarctica
    polygonSeries.exclude = ["AQ"];

    // Small map
    chart.smallMap = new am4maps.SmallMap();
    // Re-position to top right
    chart.smallMap.align = "left";
    chart.smallMap.valign = "bottom";
    chart.smallMap.series.push(polygonSeries);

    // Zoom control
    chart.zoomControl = new am4maps.ZoomControl();

    var homeButton = new am4core.Button();
    homeButton.events.on("hit", function(){
        chart.goHome();
    });

    homeButton.icon = new am4core.Sprite();
    homeButton.padding(7, 5, 7, 5);
    homeButton.width = 30;
    homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
    homeButton.marginBottom = 10;
    homeButton.parent = chart.zoomControl;
    homeButton.insertBefore(chart.zoomControl.plusButton);
}



