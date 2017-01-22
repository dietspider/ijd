function submitSearch(f){
  "use strict";
  function getResults(idno){
    var rescont=document.getElementById('rescont'),
        apicall=new XMLHttpRequest();
    apicall.onload=function(){
      var posts=(JSON.parse(apicall.responseText)).posts,
          j=posts.length;
      while(j--){
        var post_id=''+posts[j].id;
        if (post_id===idno){
          var postEl=document.createElement("div"),
              pdate=(new Date(posts[j].published_at)).toLocaleDateString(),
              firstEl=rescont.firstChild;
          postEl.innerHTML=
              '<a href="'
                +posts[j].url+
              '"><h3>'
                +posts[j].title+
              '</h3><p>'
                +posts[j].meta_description+
              '</p><p><time>'
                +pdate+
              '</time></p></a>';
          postEl.className="search-result";
          rescont.insertBefore(postEl,firstEl);
        }
      }
      var m=document.querySelectorAll(".search-result"),
          k=m.length===1?" result found":" results found";
      feedback.textContent=m.length+k;
      feedback.style.backgroundColor="#669900";
    }
    
    apicall.onerror=function(){
      feedback.textContent="Sorry, there was a technical error. Please try again later.";
      feedback.style.backgroundColor="crimson";
    }
    apicall.open("GET",ghost.url.api("posts"),true);
    apicall.send();
  }
  var feedback=document.getElementById("feedback"),
      searchform=document.forms["searchform"],
      xhr=new XMLHttpRequest();
  xhr.onload=function(){
    console.log("Successful search xhr");
    var data=JSON.parse(xhr.responseText),
        d=data.length;
    if(d<=0){
      feedback.textContent="Sorry, no matches found.";
      feedback.style.backgroundColor="crimson";
    }
    while(d--){
        getResults(data[d].ref);
    }
  }
  xhr.onerror=function(){
    feedback.textContent="Sorry, there was a technical error. Please try again later.";
    feedback.style.backgroundColor="crimson";
  }
  xhr.open(searchform.method,searchform.action,true);
  xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhr.send(f);
}

(function(){
  "use strict";
  var x=document.getElementById("honeypot"),
      y=document.getElementById("search"),
      z=document.getElementById("go"),
      a=document.forms["searchform"],
      b=document.getElementById("results"),
      c=document.getElementById("rescont"),
      d=document.getElementById("feedback"),
      main=document.getElementsByTagName("main")[0],
      rootEl=(document.documentElement||document.getElementsByTagName("html")[0]);
  x.removeAttribute("disabled");
  y.removeAttribute("disabled");
  z.removeAttribute("disabled");
  b.addEventListener("click",function(){
    this.className="closed";
    main.className="";
    c.innerHTML="";
    d.innerHTML="";
    rootEl.className="";
  });
  a.addEventListener("submit",function(e){
    e.preventDefault();
    c.innerHTML="";
    d.innerHTML="";
    main.className="blurred";
    b.className="open";
    rootEl.className="no-scroll";
    var f=(function(){
      var honeyPot=document.getElementById("honeypot").value,
          rawQuery=document.getElementById("search").value,
          strQuery="query="+rawQuery+"&hpt="+honeyPot;
      if(!honeyPot&&rawQuery&&typeof rawQuery==="string"&&strQuery){
        return strQuery;
      }
      else{
        feedback.innerHTML='<span class="error">Sorry, there was a problem with your query.</span>';
        return false;
      }
    })();
    submitSearch(f);
  });
}());
