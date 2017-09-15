Vue.component('info-window', {
    template: 
    `<div class="iw-container">
    <div class="iw-title">{{ title }}</div>
    <div class="iw-content">
        {{ content }}
        <router-link :to="'../details/' +id">More...</router-link>
        <img  :src="portrait" height="115" width="83">
        </div>
    <div class="iw-bottom-gradient"></div>
    </div>`,
    props: ['title', 'content', 'portrait', 'id'],
    data: function () {
      return {

        }
    }
});