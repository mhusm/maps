Vue.component('google-map', {
    template: `<div><button v-on:click="toggleOverlay">Toggle overlay</button>
    <button v-on:click="toggleMarker">Toggle marker</button>
    <div class="google-map" :id="mapName"></div></div>`,
    props: ['name', 'mapstyle'],
    data: function () {
      return {
        mapName: this.name + "-map",
        map: null,
        overlay: null,
        markers: []
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
                let marker =  new google.maps.Marker({
                    position: {lat: item.fields.lat, lng: item.fields.lng},
                });
                marker.setMap(this.map)
    
                // create infowindow
         //       this.configureInfoWindow(`<div id="iw-container">${item.fields.summary}<div class="iw-bottom-gradient"></div></div>`, marker);
                this.configureInfoWindow(`<div id="info-window${index}"><info-window title="${item.fields.title}" content="${item.fields.summary}" portrait="${item.fields.portrait.fields.file.url}"></info-window></div>`, marker, index);
                
            })
        });
        

        // set a marker
        this.marker = new google.maps.Marker({
            position: this.map.getCenter(),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                strokeColor: "blue"
            },
        });

        const contentString ='<div id="iw-container">' +
        '<div class="iw-title">Porcelain Factory of Vista Alegre</div>' +
        '<router-link to="/map/hiding">Hiding</router-link>'+
        '<div class="iw-content">' +
          '<div class="iw-subTitle">History</div>' +
          '<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
          '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
          '<div class="iw-subTitle">Contacts</div>' +
          '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
          '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
        '</div>' +
        '<div class="iw-bottom-gradient"></div>' +
        '</div>';

        this.configureInfoWindow(`<div id="info-window${10}"><info-window title="Test"></info-window></div>`, this.marker, 10);
        
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
            if (this.marker.map) {
                this.marker.setMap(null);
            } else {
                this.marker.setMap(this.map);
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
  
