;(function (win, doc) {
  var _form = doc.getElementById('contactform');
  var _feedback = doc.getElementById('contactmsg');
  var _inputs = [].slice.call(_form.querySelectorAll('input[name], textarea[name]'));
  var i = _inputs.length;

  while (i--) {
    _inputs[i].removeAttribute('disabled');
    _inputs[i].addEventListener('blur', validateField, false);
  }

  _form.addEventListener('submit', function (e) {
    var _xhr;
    if (typeof e === 'undefined' ) { return false; }
    e.preventDefault();
    _xhr = new XMLHttpRequest();
    _xhr.open(e.target.method, e.target.action, true);
    _xhr.setRequestHeader('Content-Type', e.target.getAttribute('enctype'));
    _xhr.onload = function () {
      _feedback.innerHTML = '<span class="success">Thanks, I\'ll be in touch at my earliest convenience!</span>';
    };
    _xhr.onerror = function () {
      _feedback.innerHTML = '<span class="error">Sorry, there was a problem sending your message. Please try again later.</span>';
    };
    _xhr.send(_inputs.map(function (input) {
      return (input.getAttribute('name') + '=' + win.encodeURIComponent(input.value));
    }).join('&').slice(0,-1));
    return false;
  });
  
  function validateField (e) {
    if (typeof e === 'undefined') { return; }
    if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
      if (!e.target.value || e.target.value === '' || e.target.value.length < 1) {
        e.target.className = 'field-invalid';
      } else {
        e.target.className = 'field-valid';
      }
    }
  }
})(window, document);
