;(function (win, doc) {
  var _menu_btn = doc.getElementById('menu_btn');
  var _menu_el = doc.getElementById('menu_el');
  var _main = doc.getElementsByTagName('main')[0];
  var _head = (doc.head || doc.getElementsByTagName('head')[0]);
  var inertCSS = [].slice.call(doc.querySelectorAll('[rel="preload"][as="style"]'));
      
  win.addEventListener('load', function () {
    if (!!doc.getElementById('gcomments') && 'gapi' in win) {
      win.gapi.comments.render('gcomments', {
        href: win.location,
        width: (doc.querySelector('article>div').getBoundingClientRect().width),
        first_party_property: 'BLOGGER',
        view_type:'FILTERED_POSTMOD'
      });
    }
    if ('serviceWorker' in win.navigator) {
      win.navigator.serviceWorker.register('https://indredouglas.me/sw.js', {
        scope: '/'
      }).then(function (registration) {
        win.console.info('SW registered [' + registration.scope + ']');
      }).catch(function (err) {
        win.console.warn('SW failed to register [' + err + ']');
      });
    } 
  });
  
  _menu_btn.addEventListener('click', function () {
    _main.className = 'blurred';
    _menu_el.className = 'open';
    (doc.documentElement || doc.getElementsByTagName('html')[0]).className = 'no-scroll';
  });
  
  _menu_el.addEventListener('click',function(){
    _main.className = '';
    _menu_el.className = 'closed';
    (doc.documentElement || doc.getElementsByTagName('html')[0]).className = '';
  });
  
  if (!!inertCSS) {
    inertCSS.forEach(function (link) {
      var _css = doc.createElement('link');
      _css.rel = 'stylesheet';
      _css.href = link.getAttribute('href');
      _head.appendChild(_css);
    });
  }
})(window, document);
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)}(window,document,'script','https://www.google-analytics.com/analytics.js','ga'));ga('create','UA-70873652-2','auto');ga('send','pageview');
