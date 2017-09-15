Vue.component('info-window', {
    template: 
    `<div class="iw-container">
    <div class="iw-title">{{ title }}</div>
    <div class="iw-content">
    <img  :src="portrait" class="iw-img">
    {{ content }}
        <router-link :to="'../details/' +id">More...</router-link>
        </div>
    <div class="iw-bottom-gradient"></div>
    </div>`,
    props: ['title', 'content', 'portrait', 'id'],
    data: function () {
      return {

        }
    }
});