# VirtualOSMWorld
Creating virtual Worlds from OpenStreetMap data.

![alt text](https://github.com/Rezarak/VirtualOSMWorld/blob/master/Thesis/Thesis%20Bilder/Tokio.PNG)

<div style="display: flex; justify-content: space-around;">
  <img src="https://github.com/Rezarak/VirtualOSMWorld/blob/master/Thesis/Thesis%20Bilder/Tokio.PNG" alt="Preview" width="200"/>
  <img src="https://github.com/JuliBlu/VirtualOSMWorldPublic/blob/main/Thesis/Thesis%20Bilder/Manhatten.PNG" alt="Preview" width="200"/>
  <img src="https://github.com/JuliBlu/VirtualOSMWorldPublic/blob/main/Thesis/Thesis%20Bilder/ExKarte.PNG" alt="Preview" width="200"/>
</div>

Installazion needs a http server. 
Installation via npm:
Fist install nodejs: https://nodejs.org/en/

In the console type: 
`npm install -g http-server`

Use the osmparser.jar file to create a JSON file from osm data:
In the console type: 
`javac -jar osmparser.jar filename.osm`

This will create a new `map.json` file to the same directory the `osmparser.jar` file is in.
Drag this file to the same directory as the `index.html` file.

Start the http server in the same directory as the index.html file:
In the console type: `http-server .`

Open the web page via localhost:8080
