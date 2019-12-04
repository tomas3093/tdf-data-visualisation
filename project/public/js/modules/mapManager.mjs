/**
 * ---------------------------------------
 * This application is using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

import { CountryMapPolygon } from './models.mjs';
import { mapColorScale } from './colors.mjs';
import { 
    MAX_VAL_STR,
    DATA_GC_CODE, 
    DATA_STAGES_CODE, 
    DATA_MOUNTAIN_CODE, 
    DATA_HILLY_CODE, 
    DATA_FLAT_CODE, 
    DATA_ITT_CODE, 
    DATA_MTT_CODE,
    DATA_DEFAULT_CODE
} from './constants.mjs';
import { ALL_CODES } from './constants.mjs';

/**
 * Creates and manage map chart
 */
 export class MapManager {

    /** Data about all countries to visualize (for all datasets - GC, Stages, Mountain, ITT...)
     * Format: Map of key,value pairs
     * Key: const DATA_CODE
     * Value: Map<ISO identifier of country, CountryMapPolygon object> */
    data;

    /** Map instance */ 
    chart;

    /** Map polygon series */
    polygonSeries;

    /** Map polygon template */
    polygonTemplate;

    /** Last selected map region */
    lastSelected;

    /**
     * Constructor
     * @param chartElementId 
     * @param dataset1 data_gc - Dataset of general classification
     * @param dataset2 data_stages - Dataset of stage winners
     */
    constructor(chartElementId, dataset1, dataset2) {

        // Theme
        am4core.useTheme(am4themes_animated);

        this.chart = am4core.create(chartElementId, am4maps.MapChart);
        this.polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());
        this.polygonTemplate = this.polygonSeries.mapPolygons.template;

        /* Set map definition */
        this.chart.geodata = am4geodata_worldLow;

        /* Set projection */
        this.chart.projection = new am4maps.projections.Miller();

        /* Make map load polygon (like country names) data from GeoJSON */
        this.polygonSeries.useGeodata = true;

        // Prepare data for visualisation
        this.initializeData(dataset1, dataset2);
        
        // Initialize map polygons
        this.configurePolygons();

        // Hide Antarctica
        this.polygonSeries.exclude = ["AQ"];

        // Draw data into map chart
        this.showData(DATA_GC_CODE);
    }


    /**
     * Sets and initialize map polygons, adds active, click and hover functionality
     */
    configurePolygons() {

        this.polygonTemplate.applyOnClones = true;
        this.polygonTemplate.togglable = true;
        this.polygonTemplate.tooltipText = "{name}: {value}";    // Text to display onHover over region

        this.polygonTemplate.propertyFields.fill = "fill";

        this.polygonTemplate.nonScalingStroke = true;
        this.polygonTemplate.strokeOpacity = 1;
        //this.polygonTemplate.fill = this.chart.colors.getIndex(0); // Default color of polygons

        /* Create selected and hover states and set alternative fill color */
        var ss = this.polygonTemplate.states.create("active");
        ss.properties.fill = this.chart.colors.getIndex(2);

        var hs = this.polygonTemplate.states.create("hover");
        hs.properties.fill = this.chart.colors.getIndex(4);

        // Create onClick function for every country in the map
        let _this = this;
        this.polygonTemplate.events.on("hit", function(ev) {

            console.log(ev.target.dataItem.dataContext.name);

            if (_this.lastSelected) {
                // This line serves multiple purposes:
                // 1. Clicking a country twice actually de-activates, the line below
                //    de-activates it in advance, so the toggle then re-activates, making it
                //    appear as if it was never de-activated to begin with.
                // 2. Previously activated countries should be de-activated.
                _this.lastSelected.isActive = false;
            }

            ev.target.series.chart.zoomToMapObject(ev.target);
            if (_this.lastSelected !== ev.target) {
                _this.lastSelected = ev.target;
            }
        })
    }

    /**
     * Initializes attributes which are representing numerical data for visualisation
     * @param dataset1 gc
     * @param dataset2 stages
     */
    initializeData(dataset1, dataset2) {

        // Create map structures of all countries for GC and for Stages datasets
        this.data = new Map([
            [DATA_GC_CODE, new Map()], 
            [DATA_STAGES_CODE, new Map()], 
            [DATA_MOUNTAIN_CODE, new Map()], 
            [DATA_HILLY_CODE, new Map()], 
            [DATA_FLAT_CODE, new Map()],
            [DATA_ITT_CODE, new Map()],
            [DATA_MTT_CODE, new Map()]
        ]);

        // TODO Vsetko co je pod tymto, Vytvorit jednotlive polozky v Mape this.data

        let l = this.chart.geodata.features;
        for (let index = 0; index < l.length; index++) {
            const element = l[index].properties;
            
            for (let j = 0; j < ALL_CODES.length; j++) {
                const code = ALL_CODES[j];
                
                if ((this.data.get(code)).get(element.id) == undefined) {
                    (this.data.get(code)).set(element.id, new CountryMapPolygon(element.id, element.name, 0, null, null));
                }
            }

            /*
            let value = this.data[DATA_GC_CODE].get(element.id);
            if (value == undefined) {
                let obj = new CountryMapPolygon(element.id, element.name, 0, null, null);
                this.data[DATA_GC_CODE].set(element.id, obj);
            } */
        }

        /*
        this.data[DATA_STAGES_CODE] = new Map();
        l = this.chart.geodata.features;
        for (let index = 0; index < l.length; index++) {
            const element = l[index].properties;
            
            let value = this.data[DATA_STAGES_CODE].get(element.id);
            if (value == undefined) {
                let obj = new CountryMapPolygon(element.id, element.name, 0, null, null);
                this.data[DATA_STAGES_CODE].set(element.id, obj);
            } 
        }*/
        
        // Count winners from each country and find max value for each dataset
        let maxValue = 0;
        for (let index = 0; index < dataset1.length; index++) {
            const element = dataset1[index];
            
            const mapItem = (this.data.get(DATA_GC_CODE)).get(element.country_iso);
            if (mapItem != undefined) {
                mapItem.value += 1;
                if (mapItem.value > maxValue) {
                    maxValue = mapItem.value;
                }
            }
        }
        (this.data.get(DATA_GC_CODE)).set(MAX_VAL_STR, maxValue);

        maxValue = 0;
        for (let index = 0; index < dataset2.length; index++) {
            const element = dataset2[index];
            
            const mapItem = (this.data.get(DATA_STAGES_CODE)).get(element.country_iso);
            if (mapItem != undefined) {
                mapItem.value += 1;
                if (mapItem.value > maxValue) {
                    maxValue = mapItem.value;
                }
            }
        }
        (this.data.get(DATA_STAGES_CODE)).set(MAX_VAL_STR, maxValue);
    }

    /**
     * Binds values to  map polygons and shows the visualisation
     * @param whichData constant which determines which dataset could be visualised
     */
    showData(whichData) {

        // Determine which data will be used
        let dataset;
        switch (whichData) {
            case DATA_GC_CODE:
                dataset = this.data.get(DATA_GC_CODE);
                break;

            case DATA_STAGES_CODE:
                dataset = this.data.get(DATA_STAGES_CODE);
                break;
        
            default:
                dataset = this.data.get(DATA_DEFAULT_CODE);
                break;
        }

        // Calculate opacity and bind values to polygons
        this.polygonSeries.data = [];
        let _this = this;
        let d = [];
        let maxValue = dataset.get(MAX_VAL_STR);
        dataset.forEach(function(v, k, map) {    // key, value, map
            
            // Skip maxValue item
            if (k != MAX_VAL_STR) {
                // Bind data to polygon
                d[d.length] = {
                    "id": v.id,
                    "name": v.name,
                    "value": v.value,
                    "fill": mapColorScale(v.value, 0, maxValue)   // Custom color scale function
                }
            }
        });
        this.polygonSeries.data = d;

        /* HEATMAP
        this.polygonSeries.heatRules.push({
            "property": "fill",
            "target": this.polygonSeries.mapPolygons.template,
            "min": am4core.color("#CCD7F8"),
            "max": am4core.color("#6B0000")
        });
        var heatLegend = chart.createChild(am4maps.HeatLegend);
        heatLegend.series = this.polygonSeries;
        heatLegend.width = am4core.percent(100);
        heatLegend.valign = "bottom";
        */

        // Create UI controls
        this.createUI();
    }

    /**
     * Creates UI controls in map chart visualisation
     */
    createUI() {

        // Small map
        this.chart.smallMap = new am4maps.SmallMap();
        // Re-position to top right
        this.chart.smallMap.align = "left";
        this.chart.smallMap.valign = "bottom";
        this.chart.smallMap.series.push(this.polygonSeries);

        // Zoom control
        this.chart.zoomControl = new am4maps.ZoomControl();

        // Home button
        var homeButton = new am4core.Button();
        let _this = this;
        homeButton.events.on("hit", function(){
            _this.chart.goHome();
        });

        homeButton.icon = new am4core.Sprite();
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
        homeButton.marginBottom = 10;
        homeButton.parent = this.chart.zoomControl;
        homeButton.insertBefore(this.chart.zoomControl.plusButton);
    }
 }
 
