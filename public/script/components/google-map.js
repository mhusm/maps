Vue.component('google-map', {
    template: `<div><button v-on:click="toggleOverlay">Toggle overlay</button>
    <button v-on:click="toggleMarker">Toggle marker</button>
    <div class="google-map" :id="mapName"></div></div>`,
    props: ['name', 'mapstyle'],
    data: function () {
      return {
        mapName: this.name + "-map",
        map: null,
        overlay: null
      }
    },
    mounted: function () {
        const element = document.getElementById(this.mapName)
        const options = {
          zoom: 14,
          center: new google.maps.LatLng(51.501527,-0.1921837)
        }
    
        this.map = new google.maps.Map(element, options);  
        this.setStyle();
        
        var imageBounds = {
            north: 51.51335453974668,
            south: 51.49231033811266,
            east: -0.15851916406245437,
            west: -0.22377228588868547
          };
  
        this.overlay = new google.maps.GroundOverlay(
              'resources/map.png',
              imageBounds);

        this.marker = new google.maps.Marker({
            position: this.map.getCenter(),
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                strokeColor: "blue"
            },
        });

        const contentString = `<div><h1>Wow</h1>
        <div>Such content!</div></div>
        `;
        this.infowindow = new google.maps.InfoWindow({
            content: contentString
          });
        

        this.marker.addListener('click', event => { this.infowindow.open(this.map, this.marker)});
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
        }

    }
})
  