import { loadData } from './modules/dataLoader.mjs';
import { MapManager } from './modules/mapManager.mjs';
import { DATA_GC_CODE, DATA_STAGES_CODE } from './modules/constants.mjs';

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
        //mapManager = new MapManager("chartdiv", data_stages);
        mapManager.showData(DATA_STAGES_CODE);
        button.innerHTML = "Stage";
    } else {
        //mapManager = new MapManager("chartdiv", data_gc);
        mapManager.showData(DATA_GC_CODE);
        button.innerHTML = "GC";
    }

    selectedGc = !selectedGc;
})


/*----------------------
INITIALIZE VISUALIZATION
----------------------*/
function init() {
    
    // Initialize amchart map
    mapManager = new MapManager("chartdiv", data_gc, data_stages);

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



