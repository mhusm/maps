Vue.component('google-map', {
    template: `<div><button v-on:click="toggleOverlay">Toggle overlay</button>
    <button v-on:click="toggleMarker">Toggle marker</button>
    <button v-on:click="togglePolyline">Toggle polyline</button>
    <button v-on:click="togglePolygon">Toggle polygon</button>
    <button v-on:click="toggleKML">Toggle KML</button>
    <div class="google-map" :id="mapName"></div></div>`,
    props: ['name', 'mapstyle'],
    data: function () {
      return {
        mapName: this.name + "-map",
        map: null,
        overlay: null,
        markers: [],
        polyline: null,
        polygon: null,
        kml: null
        }
    },
    mounted: function () {
        // load the map
        const element = document.getElementById(this.mapName)
        const options = {
          zoom: 14,
          center: new google.maps.LatLng(51.501527,-0.1921837)
        }
        this.map = new google.maps.Map(element, options);  
        // set the chosen map style. Styles are in the file map.js
        this.setStyle();
        
        //load the overlay
        var imageBounds = {
            north: 51.51335453974668,
            south: 51.49231033811266,
            east: -0.15851916406245437,
            west: -0.22377228588868547
        };
  
        this.overlay = new google.maps.GroundOverlay(
              'resources/map.png',
              imageBounds);

        contentfulClient.getEntries({
            content_type: 'bikespot'
        })
        .then(entries => {
            console.log(entries);
            entries.items.forEach((item, index) => {
                console.log(item);

                //create marker
                let icon = item.fields.icon? item.fields.icon.fields.file : "";
                console.log(icon);
                let marker =  new google.maps.Marker({
                    position: {lat: item.fields.lat, lng: item.fields.lng},
                    icon: icon
                    
                });
    
                // create infowindow
                this.configureInfoWindow(`<div id="info-window${index}"><info-window title="${item.fields.title}" 
                 content="${item.fields.summary}" portrait="${item.fields.portrait.fields.file.url}" id="${item.sys.id}" >
                 </info-window></div>`, marker, index);
                this.markers.push(marker);
            })
        });
        
        // create a polyline
        const plcoords = [
            {lat: 51.513, lng: -0.223},
            {lat: 51.51, lng: -0.21},
            {lat: 51.50, lng: -0.20},
            {lat: 51.49, lng: -0.168}
          ];
        this.polyline = new google.maps.Polyline({
            path: plcoords,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        // create a polygon
        const pgcoords = [
            {lat: 51.513, lng: -0.223},
            {lat: 51.51, lng: -0.21},
            {lat: 51.50, lng: -0.20}
            ];
        this.polygon = new google.maps.Polygon({
            path: pgcoords,
            geodesic: true,
            strokeColor: '#42cef4',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        contentfulClient.getAsset("6I6fDnGC7S8mGSeG2GEWio")
        .then(entry => {
            //show a kml file
            console.log(entry);
            this.kml = new google.maps.KmlLayer({
                url: "https:" +entry.fields.file.url
            });
        })
  
        

        
    },
    watch: {
        // whenever style changes, this function will run
        mapstyle: function (newStyle) {
            this.setStyle();
         }
    },
    methods: {
        setStyle: function(newStyle) {
            this.map.setOptions({styles: mapstyles[this.mapstyle]});
        },
        toggleOverlay: function(){
            if (this.overlay.map) {
                this.overlay.setMap(null);
            } else {
                this.overlay.setMap(this.map);
            }           
        },
        toggleMarker: function(){
            if (this.markers.length > 0 && this.markers[0].map) {
                this.markers.forEach(marker => {
                    marker.setMap(null);
                });
            } else {
                this.markers.forEach(marker => {
                    marker.setMap(this.map);
                });
            }           
        },
        togglePolyline: function(){
            if (this.polyline.map) {
                this.polyline.setMap(null);
            } else {
                this.polyline.setMap(this.map);
            }           
        },
        togglePolygon: function(){
            if (this.polygon.map) {
                this.polygon.setMap(null);
            } else {
                this.polygon.setMap(this.map);
            }           
        },
        toggleKML: function(){
            if (this.kml.map) {
                this.kml.setMap(null);
            } else {
                this.kml.setMap(this.map);
            }           
        },
        configureInfoWindow: function(contentString, marker, index) {
            let infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            
            
            marker.addListener('click', event => { infowindow.open(this.map, marker)});

            // * 
            // Taken from https://codepen.io/Marnoto/pen/xboPmG and adapted
            // START INFOWINDOW CUSTOMIZE.
            // The google.maps.event.addListener() event expects
            // the creation of the infowindow HTML structure 'domready'
            // and before the opening of the infowindow, defined styles are applied.
            // *
            google.maps.event.addListener(infowindow, 'domready', function() {
                // enable Vue inside the the infowindow
                app2 = new Vue({
                    router
                }).$mount("#info-window"+index);
        

                // Reference to the DIV that wraps the bottom of infowindow
               // var iwOuter = document.querySelector('.gm-style-iw');
                const iwOuter = document.querySelector("#info-window"+index).closest('.gm-style-iw');
               //     console.log(iwOuter);
                //  console.log(document.querySelector("#info-window"+index));
                    
                /* Since this div is in a position prior to .gm-div style-iw.
                * We use jQuery and create a iwBackground variable,
                * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
                */
                const iwBackground = iwOuter.previousElementSibling;
            
                // Removes background shadow DIV
                iwBackground.children[1].style.display = "none";
            
                // Removes white background DIV
                iwBackground.children[3].style.display = "none";
                
                // Moves the infowindow 115px to the right.
                iwOuter.parentNode.parentNode.style.left=  '115px';
            

                // Google Maps overwrites these values later
                // Hence this ugly hack to set them with a bit of a delat
                setTimeout(() => {
                // Moves the shadow of the arrow 76px to the left margin.
                    let oldStyle = iwBackground.children[0].getAttribute("style");
                    let newStyle = oldStyle +" left: 76px !important;";
                    iwBackground.children[0].setAttribute("style", newStyle);
                    
                    // Moves the arrow 76px to the left margin.
                    oldStyle = iwBackground.children[2].getAttribute("style");
                    newStyle = oldStyle +" left: 77px !important;";
                    iwBackground.children[2].setAttribute("style", newStyle);
                }, 100);
      
                // Changes the desired tail shadow color.
                const children = iwBackground.children[2].children;
                let grandChildren = [];
                for (let i = 0; i < children.length; i++) {
                    grandChildren = grandChildren.concat(Array.from(children[i].children));
                }
                for (let i = 0; i < grandChildren.length; i++) {
                    grandChildren[i].style["box-shadow"] = 'rgba(72, 181, 233, 0.6) 0px 1px 6px';
                    grandChildren[i].style["z-index"] = "1";
                }
    
                
                // Reference to the div that groups the close button elements.
                var iwCloseBtn = iwOuter.nextElementSibling;
            
                // Apply the desired effect to the close button
                iwCloseBtn.style.opacity = "1";
                iwCloseBtn.style.right = "38px";
                iwCloseBtn.style.top = "3px";
                iwCloseBtn.style.border = "7px solid #48b5e9";
                iwCloseBtn.style["border-radius"] = "13px";
                iwCloseBtn.style["box-shadow"] = "0 0 5px #3990B9";
    
                // Move the interactive image of the close button onto the button
                oldStyle = iwCloseBtn.nextElementSibling.getAttribute("style");
                newStyle = oldStyle.replace("right: 0px", "right: 38px");
                iwCloseBtn.nextElementSibling.setAttribute("style", newStyle);
                
            
                // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
                if (iwOuter.querySelector('.iw-content').innerHeight < 140){
                    iwOuter.querySelector('.iw-bottom-gradient').style.display = "none";
                }
            });
            
                // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
    //          iwCloseBtn.addEventListener("mouseout" , function(){
        //            iwCloseBtn.style.opacity = '1';
        //      });
        
        }

    }
})
  
