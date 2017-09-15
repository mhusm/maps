Vue.component('details-page', {
    template: `<div class="details-page">
        <h1> {{title}} </h1>
        <div> <img class="portrait" :src="portrait"> {{ content }} </div>
        <img v-for="item in images" :src="item" >
        
        </img>
    </div>
    `,
    props: [ 'id'],
    data: function () {
        return {
            title: "",
            content : "",
            images: [],
            portrait: ""
        };
    },
    mounted: function () {
        contentfulClient.getEntry(this.id, {include:10}
        )
        .then(entry => {
            console.log(entry);
            this.title = entry.fields.title;
            this.content = entry.fields.longText;
            this.images = [];
            if (entry.fields.images) {
                entry.fields.images.forEach(element => {
                    contentfulClient.getAsset(element.sys.id)
                    .then(img => {
                        console.log(img.fields.file);
                        this.images.push(img.fields.file.url);
                    })
                });
            }
            if (entry.fields.portrait) {
                contentfulClient.getAsset(entry.fields.portrait.sys.id)
                .then(img => {
                    this.portrait = img.fields.file.url;
                });
            }
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
  
