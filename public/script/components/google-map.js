Vue.component('google-map', {
    template: '<div class="google-map" :id="mapName"></div>',
    props: ['name', 'mapstyle'],
    data: function () {
      return {
        mapName: this.name + "-map",
        map: null
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
        }
    }
})
  