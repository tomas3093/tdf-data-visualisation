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
 * Decides whether DataItemGcWinner fullfills selected criteria
 */
export class GcWinnerFilter {
    
    /**
     * 
     * @param item DataItemGcWinner object
     */
    static compareYear(item, year) {
        return item1.year == year;
    }
}


/**
 * Decides whether DataItemStageWinner fullfills selected criteria
 */
export class StageWinnerFilter {
    
    static compareYear(item, year1, year2) {
        return item.year >= year1 && item.year <= year2;
    }

    static compareType(item, types) {
        for (let index = 0; index < types.length; index++) {
            const type = types[index];
            
            if (item.type == type) {
                return true;
            }
        }
        return false;
    }

    static compareCountry(item, countryIsoCodes) {
        for (let index = 0; index < countryIsoCodes.length; index++) {
            const iso = countryIsoCodes[index];
            
            if (item.country_iso == iso) {
                return true;
            }
        }
        return false;
    }
}