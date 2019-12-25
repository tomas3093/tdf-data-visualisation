import { 
    DATA_GC_CODE, 
    DATA_STAGES_CODE, 
    DATA_DEFAULT_CODE, 
    dataCodeToMark 
} from "./constants.mjs";

/**
 * Represents polygon which is rendered on the map chart
 */
export class CountryMapPolygon {

    constructor(id, name, value, color, alpha) {
        this.id = id;                   // ISO 2-character code representation
        this.name = name;               // Full country name
        this.value = value;             // Numeric value of country's attribute

        // am4core.color("rgb(255, 0, 0)"); - Color of the polygon, represented by am4core.color object
        this.fillColor = color;
        this.alpha = alpha;             // Number between 0 and 1 - transparency
    }
}


/**
 * Represents record of GC winner and all of it's attributes
 */
export class DataItemGcWinner {

    constructor(year, total_distance, winner_name, country_iso, country_name, avg_speed) {
        this.year = year;
        this.total_distance = total_distance;
        this.winner_name = winner_name;
        this.country_iso = country_iso;
        this.country_name = country_name;
        this.avg_speed = avg_speed;
    }
}


/**
 * Represents record of TDF Stage winner and all of it's attributes
 */
export class DataItemStageWinner {

    constructor(stage, year, distance, type, winner_name, country_iso) {
        this.stage = stage;
        this.year = year;
        this.distance = distance;
        this.type = type;
        this.winner_name = winner_name;
        this.country_iso = country_iso;
    }
}


/**
 * Represents cyclist and all of it's attributes
 */
export class DataItemCyclist {

    constructor(name, country_iso, country_name, wins) {
        this.name = name;
        this.country_iso = country_iso;
        this.country_name = country_name;
        this.value = wins;                  // Number of wins
    }
}


/**
 * Filter criterions for subsetting the summary data. In case you don't want to specify some criterion, set it as 'undefined'
 */
export class DataFilterCriterion {
    
    dataCode;
    country_iso;
    yearBegin;
    yearEnd;

    constructor(dataCode, country_iso, yearBegin, yearEnd) {
        this.dataCode = dataCode == undefined ? DATA_DEFAULT_CODE : dataCode;
        this.country_iso = country_iso;
        this.yearBegin = yearBegin;
        this.yearEnd = yearEnd;
    }

    validate(obj) {
        if (this.dataCode != DATA_GC_CODE && this.dataCode != DATA_STAGES_CODE && obj.type != undefined && obj.type != dataCodeToMark(this.dataCode)) {
            return false;
        }
        if (this.country_iso != undefined && obj.country_iso != this.country_iso) {
            return false;
        }
        if (obj.year != undefined && this.yearBegin != undefined && obj.year < this.yearBegin) {
            return false;
        }
        if (obj.year != undefined && this.yearEnd != undefined && obj.year > this.yearEnd) {
            return false;
        }

        return true;
    }
}