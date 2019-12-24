import { DATA_DEFAULT_CODE, ALL_CODES } from './modules/constants.mjs';
import { DataManager } from './modules/dataManager.mjs';
import { MapManager } from './modules/mapManager.mjs';
import { DATA_GC_CODE, DATA_STAGES_CODE, DATA_MOUNTAIN_CODE } from './modules/constants.mjs';
import { DataFilterCriterion } from './modules/models.mjs';

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
    mapManager = new MapManager("chartPanel", data);
    $("#chartPanel").removeClass("col").addClass("col-9");

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
        
        $("#option_" + code)
            .on("click", function() {
                if (selectedOption != code) {
                    mapManager.showData(code);
                }
                selectedOption = code;
            });
    }
}

/**
 * 
 * @param elementId
 */
function createSidePanel() {

    // TODO
    // Dorobit funkcionalitu tak, aby sa summary data zobrazovali v side paneli !!!

    let crit = new DataFilterCriterion(
        DATA_MOUNTAIN_CODE, 
        "CO", 
        undefined, 
        undefined
    );
    let data = dataManager.getSummaryData(crit);
    
    console.log(data);

    let table = $("#sidePanelContent");
    
    data.forEach(function(value, key, map) {
        console.log(`map.get('${key}') = ${value}`);
        table.append(`<tr><td>${key}</td><td>${value}</td></tr>`);
    });
}



