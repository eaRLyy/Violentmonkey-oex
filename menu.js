var P=$('popup'),C=$('commands'),_=bg._,
		pT=P.querySelector('.top'),pB=P.querySelector('.bot'),
		cT=C.querySelector('.top'),cB=C.querySelector('.bot'),
		tab=bg.opera.extension.tabs.getFocused(),ia=null;
function loadItem(d,c){
	if(c) {
		d.firstChild.innerText=d.symbol;
		d.classList.remove('disabled');
	} else {
		d.firstChild.innerText='';
		d.classList.add('disabled');
	}
}
function addItem(h,c,b){
	var d=document.createElement('div');
	d.innerHTML='<span></span>'+h;
	if('title' in c) {
		d.title=typeof c.title=='string'?c.title:h;
		delete c.title;
	}
	d.className='ellipsis';
	c.holder.insertBefore(d,b);
	if('symbol' in c) d.firstChild.innerText=c.symbol;
	else if('data' in c) c.symbol='✓';
	for(h in c) d[h]=c[h];
	if('data' in c) loadItem(d,c.data);
	return d;
}
function menuCommand(e){e=e.target;tab.postMessage({topic:'Command',data:e.cmd});}
function menuScript(s) {
	var n,d;
	n=s.meta.name?s.meta.name.replace(/&/g,'&amp;').replace(/</g,'&lt;'):'<em>'+_('labelNoName')+'</em>';
	d=addItem(n,{holder:pB,data:s.enabled,title:s.meta.name,onclick:function(e){
		bg.enableScript(s.id,!s.enabled,function(){loadItem(d,s.enabled);});
	}});
}
function initMenu(){
	addItem(_('menuManageScripts'),{holder:pT,symbol:'➤',onclick:function(){
		bg.opera.extension.tabs.create({url:'/options.html'}).focus();
	}});
  if(/^https?:\/\//i.test(tab.url))
		addItem(_('menuFindScripts'),{holder:pT,symbol:'➤',onclick:function(){
			var q='site:userscripts.org+inurl:show+'+tab.url.replace(/^.*?:\/\/([^\/]*?)\.\w+\/.*$/,function(v,g){
				return g.replace(/\.(com|..)$/,'').replace(/\./g,'+');
			}),url=bg.settings.search.replace('*',q);
			bg.opera.extension.tabs.create({url:url}).focus();
		}});
	ia=addItem(_('menuScriptEnabled'),{holder:pT,data:bg.settings.isApplied,onclick:function(e){
		loadItem(this,bg.setOption('isApplied',!bg.settings.isApplied));bg.updateIcon();
	}});
	bg.button.popup.height=P.offsetHeight;
}
function adjustSize(){
	bg.button.popup.height=P.offsetHeight;
	setTimeout(function(){
		pB.style.pixelHeight=innerHeight-pB.offsetTop;
	},0);
}
function load(e,data){
	if(data&&data[0]&&data[0].length) {
		addItem(_('menuBack'),{holder:cT,symbol:'◄',title:true,onclick:function(){
			C.classList.add('hide');P.classList.remove('hide');
			bg.button.popup.height=P.offsetHeight;
		}});
		cT.appendChild(document.createElement('hr'));
		data[0].forEach(function(i){addItem(i[0],{holder:cB,symbol:'➤',title:true,onclick:menuCommand,cmd:i[0]});});
		addItem(_('menuCommands'),{holder:pT,symbol:'➤',title:true,onclick:function(){
			P.classList.add('hide');C.classList.remove('hide');
			bg.button.popup.height=C.offsetHeight;
			setTimeout(function(){cB.style.pixelHeight=innerHeight-cB.offsetTop;},0);
		}},ia);
	}
	if(data&&data[1]&&data[1].length) {
		pT.appendChild(document.createElement('hr'));
		data[1].forEach(function(i){menuScript(bg.metas[i]);});
	}
	adjustSize();
}
initMenu();bg.maps['GotPopup']=load;
try{tab.postMessage({topic:'GetPopup'});}catch(e){}
