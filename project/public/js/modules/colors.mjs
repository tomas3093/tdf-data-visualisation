
/**
 * Returns color for entered value
 * @param value Value we want the color representation for
 * @param minRange Minimum value of the scale interval
 * @param maxRange Maximum value of the scale interval
 * @returns am4core.color object
 */
export function mapColorScale(value, minRange, maxRange) {

     // Linear color scale
     let colorScale = d3.scaleQuantize()
     .domain([minRange, maxRange])
     .range(["#CCD7F8", "#AAAAF2", "#A088EB", "#AC66E3", "#C844DB",
             "#D122B2", "#C70069", "#B10042", "#9B0021", "#830006", "#6B0000"]);

    // Create color and calculate opacity
    let color;
    if (value > 0) {
        color = am4core.color(colorScale(value));
    } else {
        color = am4core.color("rgb(0, 0, 0)");
        color.alpha = 0.3;
    }     

    return color;
}