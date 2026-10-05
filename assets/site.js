(function(){
var menu=document.querySelector('.menu'),nav=document.getElementById('nav');
function setNav(open){nav.classList.toggle('open',open);document.body.classList.toggle('navopen',open);menu.setAttribute('aria-expanded',open?'true':'false');menu.textContent=open?'Close':'Menu';if(open){nav.scrollTop=0;var cur=nav.querySelector('.view:not([hidden]) .on')||nav.querySelector('.on');if(cur&&cur.scrollIntoView){cur.scrollIntoView({block:'center'});}}}
if(menu&&nav){menu.addEventListener('click',function(){setNav(!nav.classList.contains('open'));});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){setNav(false);menu.focus();}});}
var buttons=document.querySelectorAll('.views button'),views=document.querySelectorAll('.view');
function setView(v){buttons.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.view===v?'true':'false');});views.forEach(function(d){d.hidden=d.dataset.view!==v;});try{localStorage.setItem('dv-view',v);}catch(e){}}
buttons.forEach(function(b){b.addEventListener('click',function(){setView(b.dataset.view);});});
try{var saved=localStorage.getItem('dv-view');if(saved==='topics'){setView('topics');}}catch(e){}
var on=document.querySelector('.view:not([hidden]) .on')||document.querySelector('.nav .on');if(on&&nav&&window.innerWidth>860){nav.scrollTop=on.offsetTop-nav.clientHeight/2;}
var data=document.getElementById('index');if(!data){return;}
var idx=JSON.parse(data.textContent),input=document.getElementById('q'),list=document.getElementById('results'),status=document.getElementById('status');
function fold(s){return s.normalize('NFKD').replace(/[̀-ͯ]/g,'').toLowerCase();}
idx.forEach(function(p){p.ft=fold(p.t);p.fx=fold(p.x);});
function run(){
 var q=fold(input.value.trim());list.innerHTML='';
 if(!q){status.textContent='Type a word or a phrase.';return;}
 var words=q.split(/\s+/).filter(Boolean),hits=[];
 idx.forEach(function(p){
  var all=words.every(function(w){return p.ft.indexOf(w)>=0||p.fx.indexOf(w)>=0;});if(!all)return;
  var s=0;if(p.ft.indexOf(q)>=0)s+=100;var n=p.fx.split(q).length-1;s+=Math.min(n,40)*2;words.forEach(function(w){if(p.ft.indexOf(w)>=0)s+=20;});
  var at=p.fx.indexOf(q);if(at<0)at=p.fx.indexOf(words[0]);var snip='';if(at>=0){var a=Math.max(0,at-90),b=Math.min(p.x.length,at+q.length+120);snip=(a>0?'… ':'')+p.x.slice(a,b)+(b<p.x.length?' …':'');}
  hits.push({s:s,t:p.t,u:p.u,g:p.g,snip:snip,n:n});
 });
 hits.sort(function(a,b){return b.s-a.s||a.t.length-b.t.length;});
 status.textContent=hits.length?(hits.length+' page'+(hits.length===1?'':'s')):'Nothing found. Try fewer or shorter words.';
 hits.slice(0,60).forEach(function(h){var li=document.createElement('li'),a=document.createElement('a');a.href=h.u;a.textContent=h.t;li.appendChild(a);var sm=document.createElement('small');sm.textContent=h.g+(h.n?', '+h.n+' match'+(h.n===1?'':'es'):'');li.appendChild(sm);if(h.snip){var sp=document.createElement('span');sp.className='snip';sp.textContent=h.snip;li.appendChild(sp);}list.appendChild(li);});
}
var params=new URLSearchParams(location.search);if(params.get('q')){input.value=params.get('q');}
input.addEventListener('input',function(){var u=new URL(location.href);u.searchParams.set('q',input.value);history.replaceState(null,'',u);run();});
run();
})();
