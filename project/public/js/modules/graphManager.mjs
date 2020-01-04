import { 
    DATA_DEFAULT_CODE,
    ALL_CODES,
    nameToIsoCode,
    MIN_DATA_YEAR_DEFAULT,
    MAX_DATA_YEAR_DEFAULT
} from './constants.mjs';

/**
 * Creates and manage graph charts (bar chart and pie chart)
 */
export class GraphManager {

    /** Data about all countries to visualize (for all datasets - GC, Stages, Mountain, ITT...)
     * Format: Map of key,value pairs
     * Key: const DATA_CODE
     * Value: Map<ISO identifier of country, CountryMapPolygon object> */
    data;

    /** Data manager */
    dataManager;

    // Numeric value which determine currently selected dataset on map
    selectedOption;

    /** Criterion which describes currently selected data */ 
    criterion;

    /** Bar chart instance and its attributes */ 
    barChart;

    /** Pie chart instance */ 
    pieChart;

    constructor(barChartElementId, pieChartElementId, data, dataManager, defaultCrit) {
        // Prepared data
        this.data = data;

        this.dataManager = dataManager;
        this.selectedOption = DATA_DEFAULT_CODE;
        this.criterion = defaultCrit;

        // Theme
        am4core.useTheme(am4themes_animated);


        /** BAR CHART
         * source: https://www.amcharts.com/demos/bars-with-moving-bullets/
         */
        this.barChart = am4core.create(barChartElementId, am4charts.XYChart);
        this.barChart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        this.barChart.paddingRight = 40;

        let categoryAxis = this.barChart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "country_name";
        categoryAxis.renderer.grid.template.strokeOpacity = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.dx = -40;
        categoryAxis.renderer.minWidth = 120;
        categoryAxis.renderer.tooltip.dx = -40;

        let valueAxis = this.barChart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.inside = true;
        valueAxis.renderer.labels.template.fillOpacity = 0.3;
        valueAxis.renderer.grid.template.strokeOpacity = 0;
        valueAxis.min = 0;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.baseGrid.strokeOpacity = 0;
        valueAxis.renderer.labels.template.dy = 20;

        let series = this.barChart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueX = "value";
        series.dataFields.categoryY = "country_name";
        series.tooltipText = "{valueX.value}";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.dy = - 30;
        series.columnsContainer.zIndex = 100;

        let columnTemplate = series.columns.template;
        columnTemplate.height = am4core.percent(50);
        columnTemplate.maxHeight = 50;
        columnTemplate.column.cornerRadius(60, 10, 60, 10);
        columnTemplate.strokeOpacity = 0;

        series.heatRules.push({ target: columnTemplate, property: "fill", dataField: "valueX", min: am4core.color("#e5dc36"), max: am4core.color("#5faa46") });
        series.mainContainer.mask = undefined;

        let cursor = new am4charts.XYCursor();
        this.barChart.cursor = cursor;
        cursor.lineX.disabled = true;
        cursor.lineY.disabled = true;
        cursor.behavior = "none";

        let bullet = columnTemplate.createChild(am4charts.CircleBullet);
        bullet.circle.radius = 30;
        bullet.valign = "middle";
        bullet.align = "left";
        bullet.isMeasured = true;
        bullet.interactionsEnabled = false;
        bullet.horizontalCenter = "right";
        bullet.interactionsEnabled = false;

        let hoverState = bullet.states.create("hover");
        let outlineCircle = bullet.createChild(am4core.Circle);
        outlineCircle.adapter.add("radius", function (radius, target) {
            let circleBullet = target.parent;
            return circleBullet.circle.pixelRadius + 10;
        })

        let image = bullet.createChild(am4core.Image);
        image.width = 60;
        image.height = 60;
        image.horizontalCenter = "middle";
        image.verticalCenter = "middle";
        image.propertyFields.href = "href";

        image.adapter.add("mask", function (mask, target) {
            let circleBullet = target.parent;
            return circleBullet.circle;
        })

        let previousBullet;
        this.barChart.cursor.events.on("cursorpositionchanged", function (event) {
            let dataItem = series.tooltipDataItem;

            if (dataItem.column) {
                let bullet = dataItem.column.children.getIndex(1);

                if (previousBullet && previousBullet != bullet) {
                    previousBullet.isHover = false;
                }

                if (previousBullet != bullet) {

                    let hs = bullet.states.getKey("hover");
                    hs.properties.dx = dataItem.column.pixelWidth;
                    bullet.isHover = true;

                    previousBullet = bullet;
                }
            }
        });

        // Column click event
        series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
        let _this = this;
        series.columns.template.events.on("hit", function(ev) {
            console.log(ev.target.dataItem.dataContext);
            
            let selectedCountryIso = nameToIsoCode(ev.target.dataItem.dataContext.country_name);
            if (_this.criterion.country_iso == selectedCountryIso) {
                _this.criterion.country_iso = undefined;     // Deselect country
            } else {
                _this.criterion.country_iso = selectedCountryIso;
            }
            
            _this.showData();
        });

        


        /** PIE CHART
         * source: https://www.amcharts.com/demos/animated-time-line-pie-chart/
         */
        this.pieChart = am4core.create(pieChartElementId, am4charts.PieChart);
        // Add label
        this.pieChart.innerRadius = 100;
        let label = this.pieChart.seriesContainer.createChild(am4core.Label);
        label.text = "1995 - 2018";
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 25;
        
        // Add and configure Series
        let pieSeries = this.pieChart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "size";
        pieSeries.dataFields.category = "sector";

        this.showData();
        this.createControlPanels();
    }


    /** 
     * Shows data in graphs according to current criterion value
    */
    showData() {

        // Get current data
        let d = this.dataManager.getGraphData(this.criterion);

        console.log(d);
        console.log(this.criterion);

        // If country was selected, update only pieChart
        if (this.criterion.country_iso != undefined) {
            this.pieChart.data = d[1];
        } else {
            this.barChart.data = d[0];
            this.pieChart.data = d[1];
        }
    }


    /**
     * Sets top panel buttons functionality
     */
    createControlPanels() {
        // Add onClick functions for toogle buttons
        for (let index = 0; index < ALL_CODES.length; index++) {
            const code = ALL_CODES[index];
            
            let _this = this;
            $("#option_" + code)
                .on("click", function() {
                    if (_this.selectedOption != code) {

                        // Set new criterion and show coresponding data
                        _this.criterion.dataCode = code;
                        _this.showData();
                    }
                    _this.selectedOption = code;
                });
        }

        // onChange functions for year sliders
        let minLbl = $('#yearMinSliderLabel')[0];
        let maxLbl = $('#yearMaxSliderLabel')[0];
        let minSlider = $('#yearMinSlider')[0];
        let maxSlider = $('#yearMaxSlider')[0];

        // Set default values of year sliders
        minSlider.value = MIN_DATA_YEAR_DEFAULT;
        maxSlider.value = MAX_DATA_YEAR_DEFAULT;

        minLbl.innerHTML = minSlider.value;
        maxLbl.innerHTML = maxSlider.value;
        let _this = this;

        $('#yearMinSlider').on("change", function () {

            let val = minSlider.value;
            if (val > _this.criterion.yearEnd) {
                maxLbl.innerHTML = val;
                maxSlider.value = val;
                _this.criterion.yearEnd = val;
            }

            // Change label, criterion and show new data
            minLbl.innerHTML = val;
            _this.criterion.yearBegin = val; 
            _this.criterion.country_iso = undefined;

            _this.showData();
        });
        $('#yearMaxSlider').on("change", function () {
            let val = maxSlider.value;
            if (val < _this.criterion.yearBegin) {
                minLbl.innerHTML = val;
                minSlider.value = val;
                _this.criterion.yearBegin = val;
            }
            
            // Change label, criterion and show new data
            maxLbl.innerHTML = val;
            _this.criterion.yearEnd = val; 
            _this.criterion.country_iso = undefined;

            _this.showData();
        });

        // Trigger "change" events on sliders for set up of initial value to filter criterion 
        $('#yearMinSlider').trigger("change");
        $('#yearMaxSlider').trigger("change");
    }
}