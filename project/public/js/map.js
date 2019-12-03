import { loadData } from './modules/dataLoader.mjs';
import { MapManager } from './modules/mapManager.mjs';

// Map manager
var mapManager;

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
        mapManager.loadDataToMap(data_stages);
        button.innerHTML = "Stage";
    } else {
        mapManager.loadDataToMap(data_gc);
        button.innerHTML = "GC";
    }

    selectedGc = !selectedGc;
})


/*----------------------
INITIALIZE VISUALIZATION
----------------------*/
function init() {
    
    // Initialize amchart map
    mapManager = new MapManager("chartdiv", data_gc);

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



