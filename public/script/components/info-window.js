Vue.component('info-window', {
    template: 
    `<div class="iw-container">
    <div class="iw-title">{{ title }}</div>
    <router-link to="/map/hiding">Hiding</router-link>
    <div class="iw-content">
      <div class="iw-subTitle">History</div>
      <img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">
      <p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. 
      For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto.
       Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become 
       "the first example of free enterprise" in Portugal.</p>
      <div class="iw-subTitle">Contacts</div>
      <p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>
      <br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>
    </div>
    <div class="iw-bottom-gradient"></div>
    </div>`,
    props: ['title', 'content', 'portrait'],
    data: function () {
      return {

        }
    }
});