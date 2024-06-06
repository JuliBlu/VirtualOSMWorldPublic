
/*
 * Copyright 2019 Julian Blumenröther
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This function creates Building objects and attaches them to the scene.
 * @param {a-entity} component - The component to attach the created elements to.
 * @param {List} streets - The buildings read from the JSON-File.
 * @param {boolean} wireframe - True, if the material should be wireframe, false otherwise.
 */
function createBuildings(component, buildings, wireframe) {
  let singleGeometry = new THREE.Geometry();
  let singleLineGeometry = new THREE.Geometry();
  let singleInnerGeometry = new THREE.Geometry();

  for (var n = 0; n < buildings.length; n++) {

    let floorPoints = buildings[n].floorPoints;
    let roofPoints = buildings[n].roofPoints;
    let innerFloorPoints = buildings[n].innerFloorPoints;
    let innerRoofPoints = buildings[n].innerRoofPoints;
    let floorxyzpoints = [];
    let roofxyzpoints = [];
    let innerroofxyzpoints = [];
    let innerfloorxyzpoints = [];


    /*
    Umwandeln der Punkte in Three.Vector3 Objekte zur korrekten Formatierung
    */
    for (var i = 0; i < roofPoints.length; i++) {
      floorxyzpoints.push(new THREE.Vector3(floorPoints[i][0], floorPoints[i][1], floorPoints[i][2]));

      roofxyzpoints.push(new THREE.Vector3(roofPoints[i][0], roofPoints[i][1], roofPoints[i][2]));
    }

    for (var z = 0; z < innerFloorPoints.length; z++) {
      let innerxyz = [];
      let innerxyz2 = [];
      for (var u = 0; u < innerFloorPoints[z].length; u++) {
        xyz = [innerFloorPoints[z][u][0], innerFloorPoints[z][u][1], innerFloorPoints[z][u][2]];
        innerxyz.push(new THREE.Vector3(xyz[0], xyz[1], xyz[2]));
        xyz2 = [innerRoofPoints[z][u][0], innerRoofPoints[z][u][1], innerRoofPoints[z][u][2]];
        innerxyz2.push(new THREE.Vector3(xyz2[0], xyz2[1], xyz2[2]));
      }
      innerfloorxyzpoints.push(innerxyz);
      innerroofxyzpoints.push(innerxyz2);
    }

    if (floorxyzpoints.length > 2) {

      for (var i = 0; i < roofxyzpoints.length - 1; i++) {
        singleLineGeometry.vertices.push(roofxyzpoints[i]);
        singleLineGeometry.vertices.push(roofxyzpoints[i + 1]);
        singleLineGeometry.vertices.push(roofxyzpoints[i]);
        singleLineGeometry.vertices.push(floorxyzpoints[i]);
        singleLineGeometry.vertices.push(floorxyzpoints[i]);
        singleLineGeometry.vertices.push(floorxyzpoints[i + 1]);
      }

      /*
            //Trying make holes (Important: Parser hole distance for shapes little higher than hight.)
            if (innerroofxyzpoints > 0) {
              //innerroofxyzpoints.reverse();
              let innerroofshape = new THREE.Shape(innerroofxyzpoints[0])
              roofshape.holes.push(innerroofshape);
            }
            //end

            //Trying to make holes (Important: Parser hole distance for shapes little higher than hight.)
            if (innerroofxyzpoints > 0) {
              for (var i = 0; i < innerroofxyzpoints[0].length; i++) {
                roofmesh.geometry.vertices.push(innerroofxyzpoints[0][i]);
              }
            }
            //end
      */


      let floorshape = new THREE.Shape(floorxyzpoints);
      let roofshape = new THREE.Shape(roofxyzpoints);


      let floorshapeGeom = new THREE.ShapeGeometry(floorshape);
      let roofshapeGeom = new THREE.ShapeGeometry(roofshape);


      let floormesh = new THREE.Mesh(floorshapeGeom);
      let roofmesh = new THREE.Mesh(roofshapeGeom);


      floormesh.geometry.vertices = floorxyzpoints;
      floormesh.updateMatrix();
      singleGeometry.merge(floormesh.geometry, floormesh.matrix);

      roofmesh.geometry.vertices = roofxyzpoints;
      roofmesh.updateMatrix();
      singleGeometry.merge(roofmesh.geometry, roofmesh.matrix);

      for (var i = 0; i < innerroofxyzpoints.length; i++) {
        if (innerroofxyzpoints[i].length > 2) {

          let innerroofshape = new THREE.Shape(innerroofxyzpoints[i]);
          let innerroofshapegeom = new THREE.ShapeGeometry(innerroofshape);
          let innerroofmesh = new THREE.Mesh(innerroofshapegeom);
          innerroofmesh.geometry.vertices = innerroofxyzpoints[i];
          innerroofmesh.updateMatrix();
          singleInnerGeometry.merge(innerroofmesh.geometry, innerroofmesh.matrix);

          let innerfloorshape = new THREE.Shape(innerfloorxyzpoints[i]);
          let innerfloorshapegeom = new THREE.ShapeGeometry(innerfloorshape);
          let innerfloormesh = new THREE.Mesh(innerfloorshapegeom);
          innerfloormesh.geometry.vertices = innerfloorxyzpoints[i];
          innerfloormesh.updateMatrix();
          singleInnerGeometry.merge(innerfloormesh.geometry, innerfloormesh.matrix);

        }
      }

      for (var i = 0; i < floorxyzpoints.length - 1; i++) {
        sideshapepoints = [];
        sideshapepoints.push(floorxyzpoints[i]);
        sideshapepoints.push(roofxyzpoints[i]);

        sideshapepoints.push(roofxyzpoints[i + 1]);
        sideshapepoints.push(floorxyzpoints[i + 1]);
        try {
          let sideshape = new THREE.Shape(sideshapepoints);
          let sideshapeGeom = new THREE.ShapeGeometry(sideshape);
          let sidemesh = new THREE.Mesh(sideshapeGeom);

          sidemesh.geometry.vertices = sideshapepoints;
          sidemesh.updateMatrix();
          singleGeometry.merge(sidemesh.geometry, sidemesh.matrix);
        } catch (err) {
          console.log("Side Shape Error");
        }
      }

    }
  }
  if (wireframe == false) {
    var linematerial = new THREE.LineBasicMaterial({
      color: "#000000",
    });
    var line = new THREE.LineSegments(singleLineGeometry, linematerial);
    component.object3D.add(line);
  }

  var innermaterial = new THREE.MeshBasicMaterial({
    color: "#1B1E23",
    side: THREE.DoubleSide,
    wireframe: wireframe
  });
  var innersinglemesh = new THREE.Mesh(singleInnerGeometry, innermaterial);
  component.object3D.add(innersinglemesh);

  var material = new THREE.MeshBasicMaterial({
    color: "#DDDDDD",
    side: THREE.DoubleSide,
    wireframe: wireframe
  });
  var singlemesh = new THREE.Mesh(singleGeometry, material);
  component.object3D.add(singlemesh);
}

/**
 * This function creates Street objects and attaches them to the scene.
 * @param {a-entity} component - The component to attach the created elements to.
 * @param {List} streets - The streets read from the JSON-File.
 * @param {boolean} wireframe - True, if the material should be wireframe, false otherwise.
 */
function createShapedStreets(component, streets, wireframe) {
  var singleGeometry = new THREE.Geometry();
  var chosencolor = streets[0].color;
  var singlematerial = new THREE.MeshBasicMaterial({
    color: chosencolor,
    side: THREE.DoubleSide,
    wireframe: wireframe
  });

  for (var index = 0; index < streets.length; index++) {
    let streetpoints = streets[index].streetpoints;
    let circlepoints = streets[index].circlepoints;
    let color = streets[index].color;
    let width = streets[index].width;

    /*
    Die Straßen sind in der JSON Datei nach Farben sortiert um alle Geometris mit derselben Farbe zu mergen.
    Dieser Abschnitt sorgt für das hinzufügen der vorher genutzten Geometry zur Scene und zurücksetzen der singleGeometry,
    damit alle Straßen der nächsten Farbe zusammen gemerged werden können.
    */
    if (color != chosencolor) {
      var singlemesh = new THREE.Mesh(singleGeometry, singlematerial);
      component.object3D.add(singlemesh);
      singleGeometry = new THREE.Geometry();
      singlematerial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        wireframe: wireframe
      });
      chosencolor = color;
    }

    for (var j = 0; j < streetpoints.length; j++) {
      let streetxyzpoints = [];

      for (var i = 0; i < streetpoints[j].length; i++) {
        streetxyzpoints.push(new THREE.Vector3(streetpoints[j][i][0], streetpoints[j][i][1], streetpoints[j][i][2]));
      }
      try {
        let shape = new THREE.Shape(streetxyzpoints);
        let shapeGeom = new THREE.ShapeGeometry(shape);
        let mesh = new THREE.Mesh(shapeGeom);
        mesh.geometry.vertices = streetxyzpoints;
        mesh.updateMatrix();
        singleGeometry.merge(mesh.geometry, mesh.matrix);
      } catch (err) {
        console.log("Error while constructing streetshape!");
      }
    }

    for (var n = 0; n < circlepoints.length; n++) {
      try {
        var circlegeometry = new THREE.CircleGeometry(width, 32);
        var circlemesh = new THREE.Mesh(circlegeometry);
        circlemesh.position.set(circlepoints[n][0], circlepoints[n][1], circlepoints[n][2]);
        circlemesh.lookAt(new THREE.Vector3(0, 0, 0));
        circlemesh.updateMatrix();
        singleGeometry.merge(circlemesh.geometry, circlemesh.matrix);
      } catch (err) {
        console.log("Error while constructing street circle!");
      }
    }
  }
  var singlemesh = new THREE.Mesh(singleGeometry, singlematerial);
  component.object3D.add(singlemesh);
}

/**
 * This function creates Railway lines and attaches them to the scene.
 * @param {a-entity} component - The component to attach the created elements to.
 * @param {List} railways - The railways read from the JSON-File.
 * @param {boolean} wireframe - True, if the material should be wireframe, false otherwise.
 */
function createRailways(component, railways) {
  var material = new THREE.LineBasicMaterial({
    color: 0x1bffff,
  });

  var singleGeometry = new THREE.Geometry();

  for (var j = 0; j < railways.length; j++) {
    points = railways[j]

    for (var i = 0; i < points.length - 1; i++) {
      singleGeometry.vertices.push(
        new THREE.Vector3(points[i][0], points[i][1], points[i][2])
      );
      singleGeometry.vertices.push(
        new THREE.Vector3(points[i + 1][0], points[i + 1][1], points[i + 1][2])
      );

    }
  }

  var line = new THREE.LineSegments(singleGeometry, material);
  component.object3D.add(line);
}

/**
 * This function creates NaturalArea shapes and attaches them to the scene.
 * @param {a-entity} component - The component to attach the created elements to.
 * @param {List} naturalareas - The naturalareas read from the JSON-File.
 * @param {boolean} wireframe - True, if the material should be wireframe, false otherwise.
 */
function createNaturalAreas(component, naturalareas, wireframe) {
  var singleGeometry = new THREE.Geometry();
  var chosencolor = naturalareas[0].color;
  var singlematerial = new THREE.MeshStandardMaterial({
    color: chosencolor,
    side: THREE.DoubleSide,
    wireframe: wireframe
  });

  for (var n = 0; n < naturalareas.length; n++) {
    points = naturalareas[n].naturalareapoints;
    color = naturalareas[n].color;

    if (color != chosencolor) {
      var singlemesh = new THREE.Mesh(singleGeometry, singlematerial);
      component.object3D.add(singlemesh);
      singleGeometry = new THREE.Geometry();
      singlematerial = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        wireframe: wireframe
      });
      chosencolor = color;
    }

    let naturalareaxyzpoints = [];

    for (var i = 0; i < points.length; i++) {
      naturalareaxyzpoints.push(new THREE.Vector3(points[i][0], points[i][1], points[i][2]));
    }

    if (naturalareaxyzpoints.length > 2) {
      try {
        let shape = new THREE.Shape(naturalareaxyzpoints);
        let shapeGeom = new THREE.ShapeGeometry(shape);
        let mesh = new THREE.Mesh(shapeGeom);
        mesh.geometry.vertices = naturalareaxyzpoints;
        mesh.updateMatrix();
        singleGeometry.merge(mesh.geometry, mesh.matrix);
      } catch (err) {
        console.log("Error while constructing naturalarea shape!");
      }
    }
  }

  var singlemesh = new THREE.Mesh(singleGeometry, singlematerial);
  component.object3D.add(singlemesh);
}

/**
 * This function creates Tree objects and attaches them to the scene.
 * @param {a-entity} component - The component to attach the created elements to.
 * @param {List} trees - The trees read from the JSON-File.
 * @param {boolean} wireframe - True, if the material should be wireframe, false otherwise.
 */
function createTrees(component, trees, wireframe) {
  let singleTrunkGeometry = new THREE.Geometry();
  let singleLeavesGeometry = new THREE.Geometry();
  let singleNeedleLeavesGeometry = new THREE.Geometry();

  for (var i = 0; i < trees.length; i++) {
    trunkxyz = trees[i].trunkPoints;
    leavesxyz = trees[i].leavesPoints;
    type = trees[i].leaf_type;

    try {
      let trunkgeometry = new THREE.BoxGeometry(0.001, 0.001, 0.002);
      let trunkmesh = new THREE.Mesh(trunkgeometry);
      trunkmesh.position.set(trunkxyz[0], trunkxyz[1], trunkxyz[2]);
      trunkmesh.lookAt(new THREE.Vector3(0, 0, 0));
      trunkmesh.updateMatrix();
      singleTrunkGeometry.merge(trunkmesh.geometry, trunkmesh.matrix);

      if (type == "broadleaved") {
        let leavesgeometry = new THREE.SphereGeometry(0.002, 0.002, 0.002);
        leavesgeometry.segmentsWidth = 32;
        leavesgeometry.segmentsHeight = 18;
        let leavesmesh = new THREE.Mesh(leavesgeometry);
        leavesmesh.position.set(leavesxyz[0], leavesxyz[1], leavesxyz[2]);
        leavesmesh.updateMatrix();
        singleLeavesGeometry.merge(leavesmesh.geometry, leavesmesh.matrix);
      } else {
        let leavesgeometry = new THREE.BoxGeometry(0.002, 0.002, 0.003);
        let leavesmesh = new THREE.Mesh(leavesgeometry);
        leavesmesh.position.set(leavesxyz[0], leavesxyz[1], leavesxyz[2]);
        leavesmesh.lookAt(new THREE.Vector3(0, 0, 0));
        leavesmesh.updateMatrix();
        singleNeedleLeavesGeometry.merge(leavesmesh.geometry, leavesmesh.matrix);
      }
    } catch (err) {
      console.log("Error while constructing tree!");
    }
  }

  var trunkmaterial = new THREE.MeshPhongMaterial({
    color: "#8b4513",
    wireframe: wireframe
  });

  var singletrunkmesh = new THREE.Mesh(singleTrunkGeometry, trunkmaterial);
  component.object3D.add(singletrunkmesh);

  var leavesmaterial = new THREE.MeshPhongMaterial({
    color: "#014421",
    wireframe: wireframe
  });

  var singleleavesmesh = new THREE.Mesh(singleLeavesGeometry, leavesmaterial);
  component.object3D.add(singleleavesmesh);

  var singleneedleleavesmesh = new THREE.Mesh(singleNeedleLeavesGeometry, leavesmaterial);
  component.object3D.add(singleneedleleavesmesh);

}


/**
 * This function creates visible Objects for each Element.
 * Also sets the correct camera to the position of the scene.
 * @param {list} sphere - The sphere of the scene.
 * @param {a-entity} component - The component to attach the created elements to.
 * @param {List} trees - The trees read from the JSON-File.
 * @param {List} buildings - The buildings read from the JSON-File.
 * @param {List} naturalareas - The naturalareas read from the JSON-File.
 * @param {List} streets - The streets read from the JSON-File.
 * @param {List} railways - The railways read from the JSON-File.
 * @param {Object} camera - The camera read from the JSON-File.
 * @param {Object} settings - The settings read from the JSON-File.
 */
function createObjects(sphere, component, trees, buildings, naturalareas, streets, railways, camera, settings) {
  let wireframe = settings.wireframe;
  let camstate = settings.cameracontrol;
  let cameraspeed = settings.cameraspeed;
  let cameradistance = settings.cameradistance;
  let flycamera = document.getElementById('cam');
  let flycamerarig = document.getElementById('camrig');
  let orbitcamera = document.getElementById('orbitcam');
  let sphericalcamera = document.getElementById('spherecam');
  let sphericalcamerarig = document.getElementById('spherecamrig');


  //TODO: spherical cam driftet ab
  if (camstate == 'fly') {
    //For Regular Fly Controls
    flycamera.setAttribute('position', {
      x: camera.camerapoint[0],
      y: camera.camerapoint[1],
      z: camera.camerapoint[2]
    });
    flycamera.setAttribute('movement-controls','speed', cameraspeed);
    sphericalcamera.setAttribute('camera', 'active', false);

    //  sphericalcamerarig.parentNode.removeChild(sphericalcamerarig);
    //  sphericalcamera.parentNode.removeChild(sphericalcamera);
    flycamera.setAttribute('camera', 'active', true);
  } else if (camstate == 'spherical') {
    // For Spherical Controls Component
    flycamera.setAttribute('camera', 'active', false);
  //  sphericalcamerarig.setAttribute('spherical-controls', 'speed', cameraspeed);
  //  sphericalcamerarig.setAttribute('spherical-controls', 'radius', 2000+cameradistance);
    sphericalcamerarig.setAttribute('spherical-controls', {
      lat: camera.cameralat,
      lng: -camera.cameralon,
      radius: 2000+cameradistance
    });

    sphericalcamerarig.setAttribute('animation', {
      to: cameraspeed
    });

    sphericalcamera.setAttribute('camera', 'active', true);

  } else {
    console.log("Different value than (fly/spherical) in the JSON-File");
  }


  if (buildings != null && typeof buildings != "undefined" && buildings.length > 0) {
    createBuildings(component, buildings, wireframe);
  }
  if (trees != null && typeof trees != "undefined" && trees.length > 0) {
    createTrees(component, trees, wireframe);
  }

  if (naturalareas != null && typeof naturalareas != "undefined" && naturalareas.length > 0) {
    createNaturalAreas(component, naturalareas, wireframe);
  }

  if (streets != null && typeof streets != "undefined" && streets.length > 0) {
    createShapedStreets(component, streets, wireframe);
  }

  if (railways != null && typeof railways != "undefined" && railways.length > 0) {
    createRailways(component, railways);
  }


}




AFRAME.registerComponent('city', {
  /**
   * Code within this function will be called when everything in <a-scene> is ready and loaded.
   *
   */
  init: function() {

    let map = document.createElement("a-entity");

    //Shows FPS
    (function() {
      var script = document.createElement('script');
      script.onload = function() {
        var stats = new Stats();
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
          stats.update();
          requestAnimationFrame(loop)
        });
      };
      script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
      document.head.appendChild(script);
    })()

    var sceneEl = document.querySelector('a-scene');
    var sphere = sceneEl.querySelector('#sphere');
    var spherescale = sphere.getAttribute('scale');


    fetch("map.json")
      .then(response => response.json())
      .then(json =>
        createObjects(sphere, map, json.trees, json.buildings, json.naturalareas, json.streets, json.railways, json.camera, json.settings)
      );


    sceneEl.appendChild(map);

  }
});
