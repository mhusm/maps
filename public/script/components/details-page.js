Vue.component('details-page', {
    template: `<div class="details-page">
        <h1> {{title}} </h1>
        <div> {{ content }} </div>
        <img v-for="item in images" :src="item" >
        
        </img>
    </div>
    `,
    props: [ 'id'],
    data: function () {
        return {
            title: "",
            content : "",
            images: []
        };
    },
    mounted: function () {
        contentfulClient.getEntry(this.id
        )
        .then(entry => {
            console.log(entry);
            this.title = entry.fields.title;
            this.content = entry.fields.longText;
            this.images = [];
            entry.fields.images.forEach(element => {
                console.log(element.sys.id)
                contentfulClient.getAsset(element.sys.id)
                .then(img => {
                    console.log(img.fields.file);
                    this.images.push(img.fields.file.url);
                })
            });
        })
        .catch(error =>{
            console.error(error);
        
        });
      
    },
    watch: {
        // whenever style changes, this function will run
        mapstyle: function (newStyle) {
            this.setStyle();
         }
    },
    methods: {

    }
})
  
