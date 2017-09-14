Vue.component('info-window', {
    template: 
    `<div class="iw-container">
    <div class="iw-title">{{ title }}</div>
    <router-link to="/map/hiding">Hiding</router-link>
    <div class="iw-content">
        {{ content }}
    </div>
    <img  :src=portrait height="115" width="83">
    <div class="iw-bottom-gradient"></div>
    </div>`,
    props: ['title', 'content', 'portrait'],
    data: function () {
      return {

        }
    }
});