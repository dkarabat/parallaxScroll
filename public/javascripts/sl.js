 $(function() {
      $('#slides').slidesjs({
        alert('Hello')
        width: 940,
        height: 528,
        navigation: false
      });

      /*
        To have multiple slideshows on the same page
        they just need to have separate IDs
      */
      $('#slides2').slidesjs({
        width: 940,
        height: 528,
        navigation: false,
        start: 3,
        play: {
          auto: true
        }
      });

      $('#slides3').slidesjs({
        width: 940,
        height: 528,
        navigation: false
      });
    });
