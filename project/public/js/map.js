import { DataManager } from './modules/dataManager.mjs';
import { MapManager } from './modules/mapManager.mjs';
import { DataFilterCriterion } from './modules/models.mjs';

// Data manager
var dataManager = new DataManager();

// Map manager
var mapManager;

// Initialize visualisation with data
dataManager.loadData(init);


/**
 * Create each part of visualisation
 */
function init(data) {

    // ... Data is loaded here in variable 'data'

    console.log("Visualisation started");

    // Initialize amchart map
    mapManager = new MapManager("chartPanel", data, dataManager, new DataFilterCriterion());
    
    /** TOP PANEL */
    mapManager.createTopPanel();


    /** SIDE PANEL */
    mapManager.updateSidePanel();
}
