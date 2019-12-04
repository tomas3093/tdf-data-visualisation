import { loadData } from './modules/dataLoader.mjs';
import { MapManager } from './modules/mapManager.mjs';
import { 
    DATA_GC_CODE, 
    DATA_STAGES_CODE, 
    DATA_MOUNTAIN_CODE, 
    DATA_HILLY_CODE, 
    DATA_FLAT_CODE, 
    DATA_ITT_CODE, 
    DATA_MTT_CODE,
    DATA_DEFAULT_CODE,
    ALL_CODES
} from './modules/constants.mjs';

// Map manager
var mapManager;

// Complete loaded datasets
var gc_dataset = [];
var stages_dataset = [];

// Bool value which determine currently selected dataset on map
var selectedOption = DATA_DEFAULT_CODE;

/* Load data from csv files and launch visualisation */
loadData(gc_dataset, stages_dataset, function() {
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
    mapManager = new MapManager("chartdiv", gc_dataset, stages_dataset);

    // Add onClick functions for toogle buttons
    for (let index = 0; index < ALL_CODES.length; index++) {
        const code = ALL_CODES[index];
        
        document.getElementById("option_" + code)
        .addEventListener("click", function() {
            if (selectedOption != code) {
                mapManager.showData(code);
            }
            selectedOption = code;
        });
    }
}


/*----------------------
BEGINNING OF VISUALIZATION
----------------------*/
function visualization() {

    console.log("Visualisation started");

    drawTextInfo();
  
    drawSidePanel();
  
}

/**
 * 
 */
function drawTextInfo() {
    
}

/**
 * 
 */
function drawSidePanel() {
    
}



