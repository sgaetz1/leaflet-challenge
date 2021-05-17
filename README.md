# leaflet-challenge
This is the repository for my leaflet homework. This project uses data from the United States Geological Survey and the Leaflet library in JavaScript to visualize earthquakes around the globe.

The map shows earthquake data from the past 30 days. Each circle on the map represents an earthquake and the size of the circle reflects the magnitude of the earthquake. The color of the circle indicates the depth of the earthquake, which is explained by the legend. If the user clicks on the circle, the place and the actual magnitude are displayed. The map's appearance can be changed from street map to dark map, topographic, or satellite map. The earthquake markers and tectonic plate lines can also be turned on and off. The JavaScript can be changed to load data from the past hour, past day, or past week.

To view the map, do the following:

1. Clone the repository to your computer.
1. In Visual Studio Code, navigate to the root directory of the repository.
1. Add your Mapbox API key to the `config.py` file.
1. Right click on `index.html` and select open with live server.
1. To see a visualization of data from the past hour, past day, or past week, comment out line 27 in `locic.js` and un-comment out the appropriate line above that to view the desired data.



