import { 
  DATA_GC_CODE, 
  DATA_STAGES_CODE, 
  DATA_MOUNTAIN_CODE, 
  DATA_HILLY_CODE, 
  DATA_FLAT_CODE, 
  DATA_ITT_CODE, 
  DATA_MTT_CODE,
  ALL_CODES,
  MAX_VAL_STR,
  SIDE_PANEL_MAX_ITEMS
} from './constants.mjs';

import { CountryMapPolygon } from './models.mjs';
import { DataItemGcWinner } from './models.mjs';
import { DataItemStageWinner } from './models.mjs';
import { DataItemCyclist } from './models.mjs';


/**
 * Manages loaded data
 */
export class DataManager {

    // Loaded raw datasets
    data_gc;
    data_stages;

    constructor() {
        this.data_gc = [];
        this.data_stages = [];
    }

    /** Function to load data from local .csv files 
    * @param data         - variable to store loaded and preprocessed data 
    * @param callback     - callback function to call after successful data loading
    */
    loadData(callback) {
        let _this = this;

        d3.csv("./public/data/tdf_gc.csv")
        .row(function(d) { return new DataItemGcWinner(
            +d.year,
            +d.total_distance,
            d.gc_winner,
            d.country_iso,
            d.country_name,
            d.winner_avg_speed
        );
    }).get(function(error, rows) { 
        //saving reference to data (by extending empty array)
        _this.data_gc.push(...rows);

        // Second csv file
        d3.csv("./public/data/tdf_stages.csv")
            .row(function(d) { return new DataItemStageWinner(
                +d.Stage,
                +d.Year,
                +d.Distance,
                d.Mark,
                d.Winner,
                d.country_iso
            ); 
        }).get(function(error, rows2) { 
            //saving reference to data
            _this.data_stages.push(...rows2);
            
            let data = _this.initializeData(_this.data_gc, _this.data_stages);
            
            // Call callback function with finally initialized data 
            callback(data);
        });
    });
    }


    /**
     * Initializes attributes which are representing numerical data for visualisation
     * @param dataset1 gc
     * @param dataset2 stages
     */
    initializeData(dataset1, dataset2) {

        // Create map structures of all countries for GC and for Stages datasets
        let data = new Map([
            [DATA_GC_CODE, new Map()], 
            [DATA_STAGES_CODE, new Map()], 
            [DATA_MOUNTAIN_CODE, new Map()], 
            [DATA_HILLY_CODE, new Map()], 
            [DATA_FLAT_CODE, new Map()],
            [DATA_ITT_CODE, new Map()],
            [DATA_MTT_CODE, new Map()]
        ]);

        // Initializes all items (Maps)
        let l = am4geodata_worldLow.features;
        for (let index = 0; index < l.length; index++) {
            const element = l[index].properties;
            
            for (let j = 0; j < ALL_CODES.length; j++) {
                const code = ALL_CODES[j];
                
                if ((data.get(code)).get(element.id) == undefined) {
                    (data.get(code)).set(element.id, new CountryMapPolygon(element.id, element.name, 0, null, null));
                }
            }
        }
        
        /** Count winners from each country and find max value for each dataset */
        // GC
        let maxValue = 0;
        for (let index = 0; index < dataset1.length; index++) {
            const element = dataset1[index];
            
            const mapItem = (data.get(DATA_GC_CODE)).get(element.country_iso);
            if (mapItem != undefined) {
                mapItem.value += 1;
                if (mapItem.value > maxValue) {
                    maxValue = mapItem.value;
                }   
            }
        }
        (data.get(DATA_GC_CODE)).set(MAX_VAL_STR, maxValue);

        // Stages
        maxValue = 0;
        for (let index = 0; index < dataset2.length; index++) {
            const element = dataset2[index];
            
            const mapItem = (data.get(DATA_STAGES_CODE)).get(element.country_iso);
            if (mapItem != undefined) {
                mapItem.value += 1;
                if (mapItem.value > maxValue) {
                    maxValue = mapItem.value;
                }   
            }
        }
        (data.get(DATA_STAGES_CODE)).set(MAX_VAL_STR, maxValue);

        // Mountains
        maxValue = 0;
        for (let index = 0; index < dataset2.length; index++) {
            const element = dataset2[index];
            
            if (element.type == "M") {
                const mapItem = (data.get(DATA_MOUNTAIN_CODE)).get(element.country_iso);
                if (mapItem != undefined) {
                    mapItem.value += 1;
                    if (mapItem.value > maxValue) {
                        maxValue = mapItem.value;
                    }   
                }
            }
        }
        (data.get(DATA_MOUNTAIN_CODE)).set(MAX_VAL_STR, maxValue);

        // Hilly
        maxValue = 0;
        for (let index = 0; index < dataset2.length; index++) {
            const element = dataset2[index];
            
            if (element.type == "H") {
                const mapItem = (data.get(DATA_HILLY_CODE)).get(element.country_iso);
                if (mapItem != undefined) {
                    mapItem.value += 1;
                    if (mapItem.value > maxValue) {
                        maxValue = mapItem.value;
                    }   
                }
            }
        }
        (data.get(DATA_HILLY_CODE)).set(MAX_VAL_STR, maxValue);

        // Flat
        maxValue = 0;
        for (let index = 0; index < dataset2.length; index++) {
            const element = dataset2[index];
            
            if (element.type == "F") {
                const mapItem = (data.get(DATA_FLAT_CODE)).get(element.country_iso);
                if (mapItem != undefined) {
                    mapItem.value += 1;
                    if (mapItem.value > maxValue) {
                        maxValue = mapItem.value;
                    }   
                }
            }
        }
        (data.get(DATA_FLAT_CODE)).set(MAX_VAL_STR, maxValue);

        // ITT
        maxValue = 0;
        for (let index = 0; index < dataset2.length; index++) {
            const element = dataset2[index];
            
            if (element.type == "ITT") {
                const mapItem = (data.get(DATA_ITT_CODE)).get(element.country_iso);
                if (mapItem != undefined) {
                    mapItem.value += 1;
                    if (mapItem.value > maxValue) {
                        maxValue = mapItem.value;
                    }   
                }
            }
        }
        (data.get(DATA_ITT_CODE)).set(MAX_VAL_STR, maxValue);

        // MTT
        maxValue = 0;
        for (let index = 0; index < dataset2.length; index++) {
            const element = dataset2[index];
            
            if (element.type == "MTT") {
                const mapItem = (data.get(DATA_MTT_CODE)).get(element.country_iso);
                if (mapItem != undefined) {
                    mapItem.value += 1;
                    if (mapItem.value > maxValue) {
                        maxValue = mapItem.value;
                    }   
                }
            }
        }
        (data.get(DATA_MTT_CODE)).set(MAX_VAL_STR, maxValue);

        return data;
    }


    /**
     * Returns sorted summary data about countries or riders of specified country
     * @param criterion - filtering criterion of type: DataFilterCriterion
     * @returns - result map (k: country, v: winners count || k: rider_name, v: victories count)
     */
    getSummaryData(criterion) {

        // Which data will be used for creating the summary
        let dataset = criterion.dataCode == DATA_GC_CODE ? this.data_gc : this.data_stages;

        let res = new Map();

        // Decision, whether we will count each country victories or victories of specific country
        if (criterion.country_iso == undefined) {
            // Victories of all countries

            // Create map of all countries with counts
            for (let index = 0; index < dataset.length; index++) {
                const row = dataset[index];

                if (criterion.validate(row)) {
                    if (res.get(row.country_iso) == undefined) {
                        res.set(row.country_iso, 1);
                    } else {
                        res.set(row.country_iso, res.get(row.country_iso) + 1);
                    }
                }
            }

        } else {
            // Winners of specific country

            // Create map of all riders from specified country
            for (let index = 0; index < dataset.length; index++) {
                const row = dataset[index];
                
                if (criterion.validate(row)) {
                    if (res.get(row.winner_name) == undefined) {
                        res.set(row.winner_name, 1);
                    } else {
                        res.set(row.winner_name, res.get(row.winner_name) + 1);
                    }   
                }
            }
        } 

        // Sort items 
        let a = [];
        for(var x of res) 
            a.push(x);

        a.sort(function(x, y) {
            return y[1] - x[1];
        });  
        
        // Keep only top 10
        res = new Map(a.slice(0, SIDE_PANEL_MAX_ITEMS));

        return res;
    }
}