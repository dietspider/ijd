;(function(win, doc) {
  'use strict';

  if (!('map' in [] && 'filter' in [] && 'reduce' in [] && 'DOMParser' in win && 'compile' in RegExp.prototype)) { return; }

  var _links;
  var _root         = doc.documentElement;
  var _main         = doc.getElementsByTagName('main')[0];
  var _search       = doc.getElementById('searchform');
  var _honeypot     = doc.getElementById('honeypot');
  var _results      = doc.getElementById('results');
  var _rescont      = doc.getElementById('rescont');
  var _feedback     = doc.getElementById('feedback');

  init();

  function init() {
    var _xhr = new XMLHttpRequest();
    [].slice.call(doc.getElementsByTagName('input')).forEach(function(input){input.removeAttribute('disabled');});
    _xhr.open('GET', 'https://indredouglas.me/feed.xml', true);
    _xhr.onload = function() {
      var _doc = new DOMParser().parseFromString(this.responseText, 'text/xml')
      if (!_doc.getElementsByTagName('item')) { return; }
      _links = [].slice.call(_doc.getElementsByTagName('item'));
      _search.addEventListener('submit', handleSearchAttempt, false);
      _results.addEventListener('click',closeSearchResults,false);
    };
    _xhr.onerror = _xhr.ontimeout = _xhr.onabort = function() {
      console.warn('Error with request: ' + this.status);
    };
    _xhr.send(null);
  }

  function handleSearchAttempt (e) {
    var _query;
    if (typeof _links !== 'object' || !Array.isArray(_links) || !_links) { return init(); }
    typeof e !== 'undefined' && e.preventDefault();
    console.log(e);
    _query = e.target.querySelector('#search').value;
    if (typeof _query !== 'string' || !_query) { return; }

    displaySearchResults(_query, getSearchResults(_query, _links));
    return false;
  }

  function displaySearchResults(query, results) {
    _rescont.innerHTML = '';
    _feedback.innerHTML = '';
    _main.className = 'blurred';
    _results.className = 'open';
    _root.className = 'no-scroll';
    if (results.length < 1) {
      _feedback.textContent = 'Sorry, no matches found.';
      _feedback.style.backgroundColor = 'crimson';
    } else {
      _feedback.textContent = results.length === 1 ? results.length + ' result found': results.length + ' results found';
      _feedback.style.backgroundColor = '#669900';
      _rescont.insertAdjacentHTML('beforeend', generateMarkup(results));
    }
  }

  function getSearchResults (query, data) {
    return data.filter(function(item) {
      return !!occursAtLeastOnce(query.toLowerCase(), [item.textContent.toLowerCase()]);
    }).map(function(item) {
      var _title = item.querySelector('title').textContent;
      var _url = item.querySelector('link').textContent;
      var _content = item.querySelector('description').textContent;
      return {
        'title': _title,
        'url': _url,
        'content': _content,
        'pdate': new Date(item.querySelector('pubDate').textContent),
        'ldistance': bestOfThree(query.toLowerCase(), [_title.toLowerCase(), _url.toLowerCase(), _content.toLowerCase()])
      };
    }).sort(function(p, q) {
      if (p.ldistance < q.ldistance) { return -1; }
      if (p.ldistance > q.ldistance) { return 1; }
      return 0;
    });
  }

  function generateMarkup (results) {
    return results.map(function(result) {
      return '<div class="search-result"><a href="' + result.url +
             '" title="' + result.title +
             '"><h3>' + result.title +
             '</h3><p>' + result.content +
             '</p><p><time datetime="' + (result.pdate.toISOString()) +
             '">' + (result.pdate.toLocaleDateString()) + '</time></p></a></div>';
    }).reduce(function(acc, nxt) {
      return acc + nxt;
    });
  }

  function bestOfThree (query, candidates) {
    return candidates.map(function(candidate) {
      return getLevenshteinDistance(query, candidate);
    }).sort(function(p, q) {
      if (p < q) { return -1; }
      if (p > q) { return 1; }
      return 0;
    }).filter(function(item, idx) {
      return idx === 0;
    });
  }

  function occursAtLeastOnce (query, data) {
    return data.map(function(datum) {
      if (datum.length < query.length) { return false; }
      return datum.indexOf(query) !== -1;
    }).reduce(function(w, x) {
      return !!(w || x);
    });
  }

  function getLevenshteinDistance(string, to_match) {
    var distance, row1, row2, i, j;
    for (row2 = [i = 0]; string[i]; ++i) {
      for (row1 = [j = 0]; to_match[++j];) {
        distance = row2[j] = i ?
          Math.min(
            row2[--j],
            Math.min(
              row1[j] - (string[i - 1] === to_match[j]),
              row1[++j] = row2[j]
            )
          ) + 1 : j;
      }
    }
    return distance;
  }

  function sanitize(text) {
    return text.split('').map(function(char) {
      return char === '<' ? '&lt;' : char === '>' ? '&gt;' : char
    ;}).join('');
  }

  function closeSearchResults() {
    _rescont.innerHTML = '';
    _feedback.innerHTML = '';
    _main.className = '';
    _results.className = 'closed';
    _root.className = '';
  }

})(window, document);
