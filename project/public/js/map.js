import { 
    DATA_DEFAULT_CODE,
    ALL_CODES
} from './modules/constants.mjs';

import { DataManager } from './modules/dataManager.mjs';
import { MapManager } from './modules/mapManager.mjs';

// Map manager
var mapManager;

// Data manager
var dataManager;

// Bool value which determine currently selected dataset on map
var selectedOption = DATA_DEFAULT_CODE;

// Initialize visualisation
init();


/**
 * Load data from csv files and launch visualisation
 */
function init() {
    dataManager = new DataManager();
    dataManager.loadData(visualization);
}


/**
 * Create each part of visualisation
 */
function visualization(data) {

    console.log("Visualisation started");

    // ... Data is loaded here in variable 'data'
    
    // Initialize amchart map
    mapManager = new MapManager("chartdiv", data);

    createTopPanel();
  
    createSidePanel();
  
}

/**
 * Initialize and render top panel of visualisation and control functionalities
 */
function createTopPanel() {
    
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

/**
 * 
 */
function createSidePanel() {
    
}



