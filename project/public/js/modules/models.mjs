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