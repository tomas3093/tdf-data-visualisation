# Tour de France statistics
## Interactive data visualisation

## How to run it
* Install node.js and npm
* In root directory run command "npm install" to install all project dependencies
* After that run command "npm run start" to start the application
* Open "localhost:3000" in your favourite browser (but it was tested only on Firefox, so I'm sorry for any inconvenience in other browsers)
* Enjoy ;)


## Data description

### tdf_gc.csv - each winner of TdF general classification
* year				... year when the race was held
* total_distance	... total distance in kilometers of the whole race (all stages combined)
* gc_winner			... name of the race winner (also includes riders, which were later disqualified from various reasons)
* country 			... 3 character code of winner's country
* country_iso		... 2 character ISO code of winner's country
* country_name		... full name of winner's country
* winner_avg_speed	... average speed of the winner in kph
	
### tdf_stages.csv - data about each stage in TdF history
* Stage				... stage order 
* Year				... year when the race was held
* Distance			... distance of the stage in kilometers
* Type				... type of the stage (mountain, flat, timme trial etc...)
* Mark				... stage classification mark (see below)
* Winner			... name of the stage winner
* Winner_Country	... 3 character code of winner's country
* country_iso		... 2 character ISO code of winner's country

---
## Stages classification marks
* M - mountain / high mountain
* H - hilly / medium mountain / intermediate
* F - flat / plain
* FC - flat cobblestone stage
* ITT - individual time trial
* TTT - team time trial
* MTT - Mountain time trial

Uncategorized
Half stage
Transition stage

---
Unknown nation -> TTT (Teams don't have nationality)
---