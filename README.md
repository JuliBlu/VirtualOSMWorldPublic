# VirtualOSMWorld
Overview:

The Virtual World Simulator is an innovative web-based application developed using A-Frame and Three.js, designed to render real-world environments within a virtual reality (VR) setting. This application allows users to upload OpenStreetMap (OSM) files, which are then parsed and displayed in a 3D virtual world, providing an immersive simulation of actual geographical locations.

## OSM File Integration:

Users can upload OSM files directly into the application.
The application parses these files to extract geographical data, including roads, buildings, landmarks, and other features.
A-Frame and Three.js Visualization:

Leveraging the power of A-Frame and Three.js, the application creates a rich, interactive 3D environment.
The virtual world accurately represents the real-world structures and layouts as provided by the OSM data.
Realistic Environment Simulation:

The application translates the parsed OSM data into detailed 3D models.
Users can navigate through the virtual world using VR headsets or standard web browsers, offering both immersive and accessible experiences.
Interactive and Customizable Experience:

Users can interact with the environment, exploring different areas and viewing detailed information about specific landmarks and structures.
The application supports various customization options, allowing users to modify the visual appearance and additional elements within the virtual world.
Seamless User Experience:

The intuitive user interface ensures a smooth process from OSM file upload to 3D visualization.
Real-time rendering and optimization techniques ensure a fluid and responsive experience.
Technical Specifications:

A-Frame: Utilized for building the VR scenes and managing 3D objects within the browser, providing an easy-to-use framework for creating immersive environments.
Three.js: Used to handle the low-level rendering, allowing for high-performance graphics and complex 3D model manipulation.
OSM Parser: A custom module that reads and interprets OSM file data, converting it into a format suitable for 3D rendering.

## Use Cases:

Urban Planning and Development: City planners and developers can visualize potential projects in a virtual environment before actual implementation.
Education and Training: Educators can use the application to teach geography, urban planning, and architecture through interactive simulations.
Tourism and Exploration: Users can explore famous landmarks and cities virtually, providing a unique way to experience different parts of the world.


## Images
![alt text](https://github.com/Rezarak/VirtualOSMWorld/blob/master/Thesis/Thesis%20Bilder/Tokio.PNG)

<div style="display: flex; justify-content: space-around;">
  <img src="https://github.com/JuliBlu/VirtualOSMWorld/blob/master/Thesis/Thesis%20Bilder/StuttgartHBF.PNG" alt="Preview" width="200"/>
  <img src="https://github.com/JuliBlu/VirtualOSMWorldPublic/blob/main/Thesis/Thesis%20Bilder/Manhatten.PNG" alt="Preview" width="200"/>
  <img src="https://github.com/JuliBlu/VirtualOSMWorldPublic/blob/main/Thesis/Thesis%20Bilder/ExKarte.PNG" alt="Preview" width="200"/>
  <img src="https://github.com/JuliBlu/VirtualOSMWorld/blob/master/Thesis/Thesis%20Bilder/Umgebung.PNG" alt="Preview" width="200"/>
</div>

# Installation
Installazion needs a http server. 
Installation via npm:
Fist install nodejs: https://nodejs.org/en/

In the console type: 
`npm install -g http-server`

### OSMParser
Use the osmparser.jar file to create a JSON file from osm data:
In the console type: 
`javac -jar osmparser.jar filename.osm`

This will create a new `map.json` file to the same directory the `osmparser.jar` file is in.
Drag this file to the same directory as the `index.html` file.

### OSMServer
Start the http server in the same directory as the index.html file:
In the console type: `http-server .`

Open the web page via localhost:8080
