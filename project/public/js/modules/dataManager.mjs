import { 
  DATA_GC_CODE, 
  DATA_STAGES_CODE, 
  DATA_MOUNTAIN_CODE, 
  DATA_HILLY_CODE, 
  DATA_FLAT_CODE, 
  DATA_ITT_CODE, 
  DATA_MTT_CODE,
  ALL_CODES,
  MAX_VAL_STR
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
     * 
     * @param dataCode 
     * @param countryISO - optional parameter 
     */
    getSummaryData(dataCode, countryISO) {

        // Create map with keys of every rider
        let data = new Map();
        let l = this.data_stages;
        for (let index = 0; index < l.length; index++) {
            const row = l[index];
            
            if (data.get(row.winner_name) == undefined) {
                data.set(row.winner_name, new DataItemCyclist(
                    row.winner_name, 
                    row.country_iso, 
                    row.country_name, 
                    0
                ));
            }
        }

        // Count top N winners
        if (countryISO) {
            switch (dataCode) {
                case DATA_GC_CODE:
                    for (let index = 0; index < this.data_gc.length; index++) {
                        const element = this.data_gc[index];
                        
                        // Ak element splna podmienky tak ho zapocita 
                        //TODO
                    }           
                    break;
            
                default:
                    break;
            }            
        } else {
            switch (dataCode) {
                case DATA_GC_CODE:
                    for (let index = 0; index < this.data_gc.length; index++) {
                        const row = this.data_gc[index];
                        data.set(row.winner_name, data.get(row.winner_name) + 1);
                    } 
                    break;
            
                default:
                    break;
            }
        }

        // Sort map 
        data[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => (a[1]).value - (b[1]).value);
        }

        let r = [];
        for (let [key, value] of data) {     
            console.log(key + ' ' + value);
        }
    }
}