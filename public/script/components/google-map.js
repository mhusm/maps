Vue.component('google-map', {
    template: '<div class="google-map" :id="mapName"></div>',
    props: ['name'],
    data: function () {
      return {
        mapName: this.name + "-map",
      }
    },
    mounted: function () {
        const element = document.getElementById(this.mapName)
        const options = {
          zoom: 14,
          center: new google.maps.LatLng(51.501527,-0.1921837)
        }
        console.log(element);
    
        const map = new google.maps.Map(element, options);    }
  })
  