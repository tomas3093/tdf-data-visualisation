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


/*----------------------
INITIALIZE VISUALIZATION
----------------------*/
function init() {
    
    // Initialize amchart map
    amchartMapInitialize();

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
function amchartMapInitialize() {

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
    for (let index = 0; index < data_stages.length; index++) {
        const element = data_stages[index];
        
        const mapItem = countriesCount.get(element.country_iso);
        if (mapItem != undefined) {
            mapItem.value += 1;
            if (mapItem.value > maxValue) {
                maxValue = mapItem.value;
            }
        }
    }
    
    // Linear color scale
    let colorScale = d3.scaleQuantize()
                        .domain([0, maxValue])
                        .range(["#CCD7F8", "#AAAAF2", "#A088EB", "#AC66E3", "#C844DB",
                                "#D122B2", "#C70069", "#B10042", "#9B0021", "#830006", "#6B0000"]);

    // Calculate opacity and bind values to polygons
    polygonSeries.data = [];
    countriesCount.forEach(function(v, k, map) {    // key, value, map
            
        // Create color and calculate opacity
        let color;
        if (v.value > 0) {
            color = am4core.color(colorScale(v.value))
        } else {
            color = am4core.color("rgb(0, 0, 0)");
            color.alpha = 0.3;
        }               
        
        // Bind data to polygon
        polygonSeries.data[polygonSeries.data.length] = {
            "id": v.id,
            "name": v.name,
            "value": v.value,
            "fill": color
        }
    })
    

    /*polygonSeries.data = [{
        "id": "FR",
        "name": "France",
        "value": 36,
        "fill": am4core.color(`rgba(255, 0, 0, ${36/36})`)
    }, {
        "id": "BE",
        "name": "Belgium",
        "value": 18,
        "fill": am4core.color(`rgba(255, 0, 0, ${18/36})`)
    }, {
        "id": "ES",
        "name": "Spain",
        "value": 12,
        "fill": am4core.color(`rgba(255, 0, 0, ${12/36})`)
    }, {
        "id": "IT",
        "name": "Italy",
        "value": 10,
        "fill": am4core.color(`rgba(255, 0, 0, ${10/36})`)
    }, {
        "id": "US",
        "name": "United states",
        "value": 10,
        "fill": am4core.color(`rgba(255, 0, 0, ${10/36})`)
    }, {
        "id": "GB",
        "name": "Great Britain",
        "value": 6,
        "fill": am4core.color(`rgba(255, 0, 0, ${6/36})`)
    }, {
        "id": "LU",
        "name": "Luxembourg",
        "value": 5,
        "fill": am4core.color(`rgba(255, 0, 0, ${5/36})`)
    }, {
        "id": "CH",
        "name": "Switzerland",
        "value": 2,
        "fill": am4core.color(`rgba(255, 0, 0, ${2/36})`)
    }, {
        "id": "NL",
        "name": "Netherlands",
        "value": 2,
        "fill": am4core.color(`rgba(255, 0, 0, ${2/36})`)
    }, {
        "id": "AU",
        "name": "Australia",
        "value": 1,
        "fill": am4core.color(`rgba(255, 0, 0, ${1/36})`)
    }, {
        "id": "CO",
        "name": "Colombia",
        "value": 1,
        "fill": am4core.color(`rgba(255, 0, 0, ${1/36})`)
    }, {
        "id": "DE",
        "name": "Germany",
        "value": 1,
        "fill": am4core.color(`rgba(255, 0, 0, ${1/36})`)
    }, {
        "id": "DK",
        "name": "Denmark",
        "value": 1,
        "fill": am4core.color(`rgba(255, 0, 0, ${1/36})`)
    }, {
        "id": "IE",
        "name": "Ireland",
        "value": 1,
        "fill": am4core.color(`rgba(255, 0, 0, ${1/36})`)
    }];*/
    polygonTemplate.propertyFields.fill = "fill";

    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeOpacity = 1;
    polygonTemplate.fill = chart.colors.getIndex(0);
    var lastSelected;
    polygonTemplate.events.on("hit", function(ev) {
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
    // Re-position to top right (it defaults to bottom left)
    chart.smallMap.align = "right";
    chart.smallMap.valign = "top";
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



