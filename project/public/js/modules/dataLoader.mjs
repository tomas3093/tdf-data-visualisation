
/** Function to load data from local .csv files 
* @param data_gc      - variable to store data about general classification
* @param data_stages  - variable to store data about stages
* @param callback     - callback function to call after successful data loading
*/
export function loadData(data_gc, data_stages, callback) {

    d3.csv("./public/data/tdf_gc.csv")
    .row(function(d) { return {
      year : +d.year,
      total_distance : +d.total_distance,
      winner_name : d.gc_winner,
      country_iso: d.country_iso,
      country_name: d.country_name,
      avg_speed: d.winner_avg_speed
    }; 
  }).get(function(error, rows) { 
      //saving reference to data (by extending empty array)
      data_gc.push(...rows);

      // Second csv file
      d3.csv("./public/data/tdf_stages.csv")
        .row(function(d) { return {
            stage : +d.Stage,
            year : +d.Year,
            distance : +d.Distance,
            type: d.Mark,
            winner_name: d.Winner,
            country_iso: d.country_iso
        }; 
    }).get(function(error, rows2) { 
        //saving reference to data
        data_stages.push(...rows2);

        callback();
    });
  });

}