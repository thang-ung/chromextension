
//import {elevate} from "./utils";
//import {parakeys} from "./parakeys";
//import {zhoChat} from "./zhoChat";
const peekcount =27, peekmax =33;

let timeGhoul =0
    ,tmr =0;

//export
class Zhad{
    static options ={
            tileLimit :83
            ,parakeys: parakeys
            ,glyb: null //new zhong()
            ,uponGlyph:()=>0
            ,donce:()=>0
        };
    static bench =elementary.create('div', {id:"zhong", class:"hidden"});
    static $rxpull =0;
    static wheeling =0;
    static moxy ={x:0,y:0};
    static invertShiftScroll =true;
    static paged =[];
    static dsrc =null;
    static current ='';
    static spanStrokes =0;
    static tx =null;
    static txLocked =false;
    static Thumbvue ={};
    static tmThumbme =0
    static undo =0;
    static tmleave =0;
    static pageID =Math.random();

    constructor(props){
        let io =this;
        if(!Zhad.options.glyb) Zhad.options.glyb = new zhoChat();
        this.onwheel =Zhad.onwheel.bind(this);
        let root =document.querySelector("div#extension-zhopad");

        if( !root ){
            Zhad.bench.classList.add("ui-widget","ui-stenozo");	//makes rerunable easier
            if(!root){
                document.body.parentNode.appendChild(root =elementary.create("div", {"id":'extension-zhopad',"class":"nil-darkreader"}));
            }

            let bundle =document.createDocumentFragment();
            bundle.appendChild(elementary.create('link',{class:"darkreader",rel:"stylesheet", type:"text/css", href:chrome.runtime.getURL("css/shared.css")}));
            bundle.appendChild(elementary.create('link',{class:"darkreader",rel:"stylesheet", type:"text/css", href:chrome.runtime.getURL("css/zhosteno.css")}));
            bundle.appendChild(Zhad.bench);
            if(props.shadowIsolate){
                Zhad.root = root.attachShadow({mode: 'open'});
                Zhad.root.appendChild(bundle);
            }
            else{
                Zhad.root =document;
                root.appendChild(bundle);
            }
            if(props.zoom) Zhad.bench.classList.add('zoom');

            Zhad.bench.style.transform="translate(0,0)";


            Zhad.bench.attr("children", this.mkParakeys(Zhad.options.parakeys, {"ghoul":null,"∞ƒ":Zhad.options.glyb}));

            let thumbview =elementary.create('div', {"id":"qu", "class":"zhongwen-void climid"});
            Zhad.bench.prepend(thumbview);

            thumbview.oneve('mousemove',function bktmove(evt){
                        let xy = Zhad.moxy ={x:evt.x,y:evt.y}
                            ,root =this.fn('root');
                        let jump =Array.from(Zhad.root.elementsFromPoint(xy.x,xy.y))
                            .filter(e => e.matches('.qu, .jump')).filter((v,i)=>i==0);

                        try{
                            if(jump.length ==0)	return;

                            else if(jump[0].classList.contains('qu')){
                                this.classList.remove('limbo');
                                jump =[root].filter(x=> !x.matches('[data-jump]'));
                            }
                            else if(jump.indexOf(root) <0)
                                jump =[jump[0].parentNode];
                            else	return;
                        }
                        finally{}

                        if(jump.length){
                            let evme =new MouseEvent('mouseover', xy);
                            jump[0].dispatchEvent(evme);
                        }
                    });

            $(Zhad.bench).draggable({opaciti: 0.35,cancel:'div.jump'});
            Zhad.bench
                .oneve('mousemove',(evt)=>{
                    Zhad.moxy ={"x":evt.x,"y":evt.y};
                    let boff =!thumbview.classList.contains('locked') && thumbview.matches(".maskout, :empty");
                    let ele;
                    if(!boff && Math.max(Math.abs(evt.movementX),Math.abs(evt.movementY)) >60){
                        thumbview.innerHTML ="";
                    }
                    else if(boff && (ele=[Zhad.root.elementFromPoint(evt.x,evt.y)])
                                .filter(e=>e.parentElement && e.parentNode.matches("[name]")).length){
                        ele[0].parentNode.dispatchEvent(new MouseEvent('mouseenter', evt));
                    }

                    })
                .oneve('dragover', this.dragOver)
                .oneve('drop', this.drop);
        }
        else{
            this.destroy();
            return false;
        }

        var cfgObserve = {

            attributeFilter: ['data-jump']
        };

        var observer = new MutationObserver((muti)=>{
            let muta;
            if((muta =muti[muti.length-1]).attributeName =='data-jump'){
                Zhad.options.uponGlyph(muta.target.getAttribute('data-jump'));
            }
        });
        observer.observe(Zhad.bench, cfgObserve);

    }//end constructor

    syncOptions(context){
        if(!Zhad.root.getElementById("hotc"));
        else if(context.newValue.busyPage)
            Zhad.root.getElementById("hotc").classList.add('busy');
        else
            Zhad.root.getElementById("hotc").classList.remove('busy');

        if(context.newValue.showSimplify)
            Zhad.bench.classList.remove('traditional');
        else{
            Zhad.bench.classList.add('traditional');
            Array.from(Zhad.bench.querySelectorAll(".simpel")).forEach(e=>e.classList.remove('simpel'));
        }

        if(context.newValue.zoom)
            Zhad.bench.classList.add('zoom');
        else
            Zhad.bench.classList.remove('zoom');
    }

    destroy(){
        this.onDetach();
        delete this.priots;
        Zhad.bench.innerHTML ="";
        Zhad.bench.remove();
        Zhad.bench =elementary.create('div', {id:"zhong", class:"hidden"});

        Zhad.dsrc =Zhad.options.glyb =null;
        Zhad.paged.length =0;

        document.getElementById("extension-zhopad").remove();
    }
    onDetach(){
        document.body.parentNode.offeve("mousedown", "midown")
            .offeve("contextmenu", "ctxmenu");
        this.onNavigate(true);
    }

    onOpen(){
        var buttons =0
            ,wo =this;
        document.body.parentNode
            .oneve('mousedown', async function midown(evt){
                let bench =Zhad.bench;

                if((buttons =evt.buttons&7) >=3 && !evt.shiftKey){
                    if(bench.matches(":empty"))
                        bench.classList.remove("hidden");
                    else if(bench.classList.toggle('hidden')){
                        return evt.shiftKey || false;	//shift key will enable autoscroll
                    }

                    try{
                        let coords ={"left":evt.x -(Math.floor(bench.offsetWidth /2)) +'px'
                                    ,"top":evt.y -40 +'px'
                                    ,"position":""};
                        if(coords.left.charAt(0) ==='-') coords.left =0;

                        bench.style.css(coords);
                        if(bench.matches(":empty") || !bench.querySelector('.ellipser')){
                            wo.show(0, elevate(Zhad.options.glyb.radicals));
                            Zhad.options.donce();
                        }
                        else
                            return false;
                    }
                    finally{
                        ellipsor.stopPropagation(evt);
                    }
                }//end middle click

                setTimeout(()=>buttons=0,10);
                return true;
            })
            .oneve('contextmenu',function ctxmenu(evt){
                if((buttons || evt.buttons) &1){
                    return ellipsor.stopPropagation(evt);
                }
            });
    }//end onOpen

    static onwheel(evt){
        const bigwheel =-430;
        var delta =evt.wheelDeltaY || evt.wheelDelta;
        var bench =Zhad.bench;
        if(bench.matches('.hidden')) return;
        //event.target is off on android tablet
        let rspan =bench.querySelector('span.radical:first-of-type')
            , onrad =rspan ? parseInt(rspan.getAttribute('data-strokes') || 0) : 0
            , inzho =Zhad.wheeling || Zhad.root.elementsFromPoint(evt.x, evt.y).filter((v)=> v ===bench).length;
        try{
            if(delta < 0 && Zhad.spanStrokes ==0 && onrad)
                return false;
            else if(delta < bigwheel && Math.max(delta, Zhad.wheeling) > bigwheel){	//huge unwind... goes to base
                Zhad.paged.length =0;
                inzho =1;
            }
            else if(Zhad.wheeling || Math.abs(delta) <90){
                return false;
            }
        }
        finally{
            if(inzho){	//wheel inside bench will not scroll container, e.g., body
                ellipsor.stopPropagation(evt);
            }

            setTimeout(()=>this.mkThumbs(), 0);	//clear fave dialog
        }//end try

        Zhad.wheeling =delta;
        bench.classList.add("wheels");
        let banDescend =bench.matches('.flat');
        if(banDescend)
            clearTimeout(tmr);
        else
            bench.classList.add('flat');

        try{
            if(delta >0){
                let ele =inzho ? [Zhad.root.elementFromPoint(evt.x, evt.y)]
                        .any(e=>e.matches('.peeker,.flanker,[data-derived="2"]') ? e: 
                                e.matches('.jump') ? e.parentNode: void 0) :void 0
                    ,jump;

                if(!banDescend && ele && evt.shiftKey !=Zhad.invertShiftScroll
                    && bench.querySelector('.radical') ){
                    onrad =0;
                    if(ele.matches('.peeker,.flanker,[data-derived="2"]') || ele.querySelector(':scope > .jump')){
                        ele.dispatchEvent(new MouseEvent('mousedown', {button:2}));
                    }
                    else if(jump =bench.querySelector('div[data-jump]'))
                        jump.dispatchEvent(new MouseEvent('mousedown', {button:2}));
                }
                else if(!bench.matches('[data-scroll="stop"]') ){
                    if( bench.children.length ){
                        Zhad.paged.push({"dsrc" :Zhad.dsrc,
                                "nstrokes": Zhad.spanStrokes});
                    }
                    let _band =bench.querySelector('span[data-strokes]:last-of-type');
                    this.show(parseInt(_band ? _band.getAttribute('data-strokes'): 0));
                }
            }else if(evt.shiftKey	//load base state
                || Zhad.paged.length ==0
                || (evt.buttons & 2) ==2){
                Zhad.paged.length =0;
                this.show(0, elevate(Zhad.options.glyb.radicals));
                onrad =true;
            }else{
                let prior =Zhad.paged.pop();
                onrad =this.show(prior.nstrokes, prior.dsrc).onrad;
            }
        }
        finally{
        }//end try

        setTimeout(()=>{
                Zhad.wheeling =0;
                bench.classList.remove("wheels");
            }, 300);
        if(onrad)
            tmr =setTimeout(()=>bench.classList.remove('flat'), 300);
        else
            bench.classList.remove('flat');

        return false;
    }

    onNavigate(off=false){
        if(off)
            document.body.parentNode.removeEventListener('wheel', this.onwheel)
        else
            document.body.parentNode.addEventListener('wheel', this.onwheel, {passive:false});
    }//end onNavigate

    async whereAt(glyph){
        let c
            , bench =Zhad.bench
            , tile =bench.querySelector('[data-jump="up"]');

        try{
            if(window.getComputedStyle(bench).display ==='none'
            || (c =glyph.replace(/^[ \t\r\n,-]*/u, '').firstchar).length ==0);

            else if( tile !==null && tile.textContent.indexOf(c) >=0 );//is hilit
            //is in current range
            else if( bench.textContent.indexOf(c) >=0 ){
                Array.from(bench.querySelectorAll('.jump'))
                    .filter((v)=>v.textContent.indexOf(c) !==-1)
                    .forEach(v=> v.parentNode.setAttribute('data-jump','up'));
            }
            else{
                let node =await Zhad.options.glyb.glyphRootNode(c);
                if(node){
                    Zhad.current = node.radical +' '+node.n+"+";
                    let k =node.r -1;
                    this.show( node.strokes-1
                        , await Zhad.options.glyb.querySelectorAll("[radical='"+node.radical.firstchar+"'] > *")
                        , c );
                    Zhad.paged.length =0;	//don't stack up history
                }
                else{
                    window.alert(c +": not found.");
                }
            }

        }
        catch(err){
            console.log(tile);
        }
    }//end whereAt

    dragOver(evt){
        evt.dataTransfer.dropEffect ='copy';
        evt.preventDefault();
        evt.stopPropagation();
    }
    drop =(evt)=>{
        this.whereAt(evt.dataTransfer.getData("text/plain"));
        evt.preventDefault();
        evt.stopPropagation();
    }

    mkParakeys(template, props){
        let parsky =document.createDocumentFragment(), io =this;

        if(!Zhad.root.querySelectorAll('#parakeys').length){
            for( var glif in template ){
                if( parakeys.hasOwnProperty(glif)){
                    let parakey =parakeys[glif];
                    if( typeof(parakey) =='function'){
                        try{
                            var p =parakey(props[glif]);
                        }
                        catch(e){
                            p =elementary.craate("div", {"class":'jump',"textChild": glif
                                    ,"mousedown": parakeys[glif]});
                        }
                        finally{
                            let props={},
                                attr =Array.from(p.attributes).filter(x=>x.name.indexOf('data-title')>=0);
                            if(attr.length){
                                props[attr[0].name] =attr[0].value;
                                p.removeAttribute(attr[0].name);
                            }
                            parsky.appendChild( elementary.create("div",["class",'parakey', props]).appendChild(p).parentNode );
                        }
                    }
    
                    else if( parakey.tagName && ['input','img'].indexOf(parakey.tagName.toLowerCase()) >=0 ){
                        let props={"children":parakey},
                            attr =Array.from(parakey.attributes).filter(x=>x.name.indexOf('data-title')>=0);
                        if(attr.length){
                            props[attr[0].name] =attr[0].value;
                            parakey.removeAttribute(attr[0].name);
                        }
                        parsky.appendChild( elementary.create("div", [props
                                ,"class", 'parakey'+(parakey.classList.contains('dumb') ? ' dumb':'')]) );
                    }
                    else{
                        parsky.appendChild(elementary.create('div', {"class":"parakey"})
                                    .appendChild(elementary.create('div'
                                        , {"class":"jump","textChild":glif, "value":parakey})
                                    ).parentNode);
                    }
                }
            }//end loop
            let _parakeys =elementary.create('span',{id:"parakeys", class:"once", style:"display:none;"})
            _parakeys.appendChild(parsky);

            let btnClose =elementary.create('div', 
                    {class:"parakey",id:"btnclose","data-title":"Close"
                    ,"children":elementary.create('img',{"alt":"●","src": chrome.runtime.getURL("/images/x.png")})})
                    .oneve("click", ()=>Zhad.bench.classList.add('hidden'));
    
            return [_parakeys, btnClose];
        }
        return null;
    }//end mkParakeys

    async show(nstrokes, src, glyat){
        src =await src;
        var canvas =this.canvas
            = (this.canvas || elementary.create('span',{"class":"ellipser nauto thumbed hidden"}));

        if(canvas.parentNode){
                canvas.innerHTML ="";
                canvas.classList.remove('detach');
        }
        else{
            Zhad.bench.appendChild(canvas);
        }
        try{
            let rid =Zhad.pageID =Math.random(), jump;

            let [isRadical, palette, isstopped, strokes, birds, names] =await this.mk(nstrokes, src, glyat);
            canvas.attr("children", palette);

            //cheat list
            this.mkCheatah(rid, isRadical, birds);

            if(birds.length ==0 || ((jump=Zhad.bench.querySelector('[data-jump]')) && jump.closest('.ellipser')))
                canvas.classList.add('detach');

            clearTimeout(this.tmr ||0);
            Zhad.spanStrokes =parseInt(palette[0].getAttribute('data-strokes')) -1;
            Zhad.bench.attr({'israd': isRadical ? 1:null})
            .attr('data-scroll', isstopped ? 'stop':'more')
            .attr('data-strokes',
                        (isRadical ? '': '（'+ Zhad.current +'）\t')+
                        (Zhad.spanStrokes+1)
                        +'..\t'+
                        palette[palette.length-1].getAttribute('data-strokes')
                        +(isstopped ? "":'●●'));

            this.tmr =setTimeout(()=>Zhad.bench.classList.remove("hover"), 2000);
            if(isRadical){
                let hotc =Zhad.bench.querySelector('#hotc')
                    , excludes =Array.from(hotc.querySelectorAll("[name]"))
                        .map(x=>x.getAttribute("name"));
                this.peekers(rid, hotc);
                this.flanks(rid, names, hotc);

                let lefs =await this.whimpets(rid, null, excludes);
                hotc.attr("children", lefs.map(lef=>elementary.create("div", {"class":'jump',"textChild":lef.zi
                        ,'tip':1,'void':0,"data-derived":2, "name":lef.name, "da":lef.zi})));
            }
            this.wireJump(Zhad.bench, isRadical);

            let leads =canvas.querySelectorAll('span[data-strokes] > div:first-child, div[data-derived]:not(.jump) ~ div:not([data-derived])');
            Array.from(leads).forEach(e=>{
                    let sib =this.previousSibling;
                    if(!sib || sib.matches('[data-derived]'))
                        e.setAttribute('data-strokes', e.parentNode.getAttribute('data-strokes'));
                });
            return {wo:Zhad.bench.classList.add("hover"), onrad: isRadical};
        }
        catch(err){
            console.log(err);
            return {};
        }
    }//end show

    async mk(nstrokes, src, glyat){
        Zhad.dsrc= src =src || Zhad.dsrc;
        src =src.filter(x => parseInt((x.getAttribute ? x.getAttribute('n') :x.n) ||1000) > nstrokes);
        if(!src) throw("empty source src.");

        if(!src.length){
            src =Zhad.dsrc.slice();	//new copy
        }
        let isRadical =(src instanceof Array && src.length && src[0].radical) || false;

        let zis =await Zhad.options.glyb.pageOn(src, Zhad.options.tileLimit, isRadical);

        let [tiles, ender, strokes, birds] =await this.mkTiles(isRadical, zis, glyat);
        let names =birds.map(e=>e.getAttribute('name'));

        return [isRadical, tiles, ender, strokes, birds, names];
    }//end mk

    async flanks(rid, names, container){
        let flanked ={}
            ,lengths =await Zhad.options.glyb.shelfLengths(names);

        for(let i of Object.keys(lengths)){
            if(lengths[i] >= 2 && 4 >= lengths[i])
                container.querySelectorAll('[name="'+i+'"]:not(.jump):not(.ligan)')
                    .forEach(x=>{
                        if(lengths[i] ===2 || !x.classList.contains('ligan')){
                            flanked[i] =x.textContent;
                            x.classList.add('flanked');
                        }
                    });
            else{
                delete lengths[i];
                names.splice(names.indexOf(i), 1);
            }
        }
        let tiles =[]
            ,flankies =await Zhad.options.glyb.onshelf(Object.keys(flanked));
        for(let name of names){ //names is ordered by most visits
            if(flankies[name] ===void 0) continue;

            for(let c of flankies[name].slice(1,4)){
                let tile =elementary.create('div', {"class":"flanker", "void":"0"
                    ,"textChild":c, "name": name, "da":c});

                if(flanked[name].indexOf(c) >=0) tile.classList.add('rid');
                tiles.push(tile);
            }
        }
        if(rid===Zhad.pageID) container.attr("children", tiles);
        this.wireJump(null,true,tiles);
    }


    async mkTiles(isRadical, tiles, glyat){
        const rgxp =/^(.*?)(~)*([0-9]+)*$/ug;
        let wo =this, y
            , canvi =[]
            , birds =[]
            , hots =await Zhad.options.glyb.hots;
        let entertile =function(evt){
            let bench =Zhad.bench
                , tile =this.querySelector('.jump');

                Array.from(bench.querySelectorAll('[data-jump]')).forEach(e=>e.removeAttribute('data-jump'));
                tile.parentNode.setAttribute('data-jump','up');

                bench.setAttribute('data-jump', evt.target.textContent);
                if(isRadical && !Zhad.wheeling){
                    wo.mkThumbs(evt.target, evt);
                }
            };
        for(var k in tiles){
            if(!tiles[k]) continue;
            else if( tiles[k] ==='stop') break;
            let children =[];

            for(let haizi of tiles[k]){
                rgxp.lastIndex =0;
                let [tx, lit, derived, name] =rgxp.exec(haizi);

                let	dv =elementary.create('div',
                        {"class":"jump", "textChild":lit
                        ,"data-derived":(derived ? "1":null)});
                let tile =elementary.create("div",
                        {"name": name || k
                        ,"data-derived":(derived ? "1":null)
                        ,"data-jump":lit===glyat ? "up":null
                        ,"children": dv})
                    .oneve('mouseenter', entertile);

                if((y =hots[lit.firstchar]) /*&& (y>0 || isRadical)*/){
                    birds.push( tile.attr("visits", y) );
                }
                else
                    children.push(tile);
            }

            let dva =elementary.create("span",
                    {"data-strokes":k
                    ,class: isRadical ? 'radical':'steno'
                    ,"children": children
                    });
            canvi.push(dva);
        }
        let boolStop =tiles[k]==="stop";
        return [canvi, boolStop ? "stop":null, parseInt(k)
            , birds.sort((l,r) => parseInt(r.getAttribute("visits")) -parseInt(l.getAttribute("visits")))];
    }//end mkTiles

    async whimpets(rid, root, excludes=[], nlimit = 3){
        root = root || Zhad.bench.querySelector('[israd="1"]:scope .ellipser');
        let leaf =root.querySelectorAll('div[name]:not(.jump):not(.blu):not([data-derived="1"])');
        let qu =[]
            ,que =await Zhad.options.glyb.qu;
        for(let laf of Array.from(leaf)){

            let k =laf.getAttribute('name');
            if(excludes.indexOf(k) >=0) continue;

            let lef =(!(que instanceof Promise) && que && que[k]) || await Zhad.options.glyb.shelfup(laf.textContent.firstchar);
            if(lef) qu.push(...lef.slice(1,nlimit).map(x=>{return {"zi":x,"name":k}}) );
        }
        return rid ===Zhad.pageID ? qu : [];
    }

    async peekers(rid, container){
        let glyb =Zhad.options.glyb
            ,hots =glyb.hottops(100)
            ,present =Array.from(Zhad.bench.querySelectorAll('[name]'))
                .map(v=>parseInt(v.getAttribute("name")))
            ,peeked =[];
        for(let c of (await hots)){
            let r =(await glyb.glyphRootNode(c)).r;
            if(present.indexOf(r-1) ===-1){
                let tile =elementary.create('div', {"class":"peeker", "void":"0","textChild":c, "name": r-1, "da":c});

                if(peeked.push(tile) >=10) break;;
            }
        }
        if(rid ===Zhad.pageID){
            container.attr("children", peeked);
            this.wireJump(null,true,peeked);
        }
    }

    async mkThumbs(glyph, evt, above = "auto"){
        let bucket =Zhad.bench.querySelector('div#qu');
        if(!glyph){
            bucket.innerHTML ="";
            return 0;
        }
        await new Promise(resolve=>setTimeout(resolve, 75));

        if(bucket.classList.contains('locked')){
            // console.warn('locked out');
            return 0;
        }
        //bucket.classList.add('locked');

        const qumousemov =function(evt){
                if(!Zhad.thumbvue);
                else if(Zhad.thumbvue.left <= evt.x && evt.x <= Zhad.thumbvue.right
                && Zhad.thumbvue.top <= evt.y && evt.y <= Zhad.thumbvue.bottom ){
                    Zhad.bench.offeve("mousemove", qumousemov);
                    Zhad.bench.querySelector('div#qu').classList.remove("nomie");
                }
            };
        let eles =Zhad.root.elementsFromPoint(Zhad.moxy.x,Zhad.moxy.y).slice(0,3).filter(e=>e.tagName !=='SPAN');

        try{
            if(!glyph || glyph.matches(".qu") || eles.length===0)
                return 0;
            else if(glyph && bucket.matches(":not(:empty)") && bucket.fn('root') ===glyph)
                bucket.classList.remove('maskout','limbo');
            else if( eles[0].matches('.qu') ){
                console.log(glyph.textContent);
            }
            else if(eles.find(e=>[e, ...e.children].indexOf(glyph) >=0) && bucket.fn('root', glyph)){
                bucket.innerHTML ="";
                bucket.classList.remove("sideleft","narrow",);
                bucket.classList.add('nomie','maskout','limbo','locked');
                clearTimeout(Zhad.tmThumbme);
                Zhad.bench.offeve("mousemove", qumousemov);
                glyph.classList.remove('paused');

                let qu = await Zhad.options.glyb.shelfup(glyph.textContent.firstchar)
                    ,ch =glyph.textContent.firstchar;
                if(!qu || qu.length <=1 || (qu[0]===1 && qu[1]===ch) ) return 0;

                let wo =this
                    ,lu=document.createDocumentFragment();
                qu.slice(1, Math.min(peekmax, Math.max(qu[0], peekcount)))
                    .sort((l,r)=>l===ch ? -1:0)
                    .forEach((g,i)=>lu.appendChild(elementary.create('div'
                        , {"class":"qu"+(g==ch ? ' rid':''), "textChild": g, "da":g})));

                if(lu.children.length <=15) bucket.classList.add("narrow");
                        
                const  penleave =function(evt){
                        clearInterval(Zhad.tmleave);
                        Zhad.tmleave =setInterval(()=>{
                            let cell=Zhad.root.elementsFromPoint(Zhad.moxy.x, Zhad.moxy.y).slice(0,2);
                            if(cell[0] !==glyph && cell[0].parentNode !==glyph){
                                clearInterval(Zhad.tmleave);
                                Zhad.moxy ={x:0,y:0};
                                if(cell[1] ===glyph || cell[1].parentNode ===glyph)
                                    glyph.classList.add('paused');
                                bucket.innerHTML ="";
                            }
                            }, isNaN(evt) ? 500: evt);
                    };
                penleave(600);

                lu.childNodes.forEach(qu=>{qu
                    .oneve('mousedown', function clickqu(evt){
                        if( this.parentNode.classList.contains('limbo') ){
                            docZhad.root.ument.elementsFromPoint(evt.x, evt.y).slice(3,3)[0]
                                .dispatchEvent(new MouseEvent('mousedown',evt));
                        }
                        else if((evt.buttons&7) >=3)
                            bucket.innerHTML ="";
                        else
                            wo.post()(evt);
                        return ellipsor.stopPropagation(evt);
                        })
                    .oneve('mouseenter',function quent(){
                        clearInterval(Zhad.tmleave);
                        Zhad.bench.setAttribute('data-jump', this.textContent);

                        })
                    .oneve('mouseleave', penleave)
                    .oneve('contextmenu',(evt)=>{
                        return ellipsor.stopPropagation(evt);
                    });
                });

                bucket.innerHTML ="";
                bucket.appendChild(lu);
                if(this.positionThumbs(glyph))
                    Zhad.tmThumbme =setTimeout(()=>Zhad.bench.oneve("mousemove", qumousemov), 0);

            }//end if
        }
        finally{
            bucket.classList.remove('locked');
        }
        return 0;
    }//end mkThumbs

    positionThumbs(glyph, above =0){
        let _this =Zhad.bench.querySelector('div#qu')
            , lu =_this.querySelectorAll('.qu')
            , bench =_this.parentNode;
        if(lu.length ===0 || !glyph || glyph.matches(".qu")) return false;

        let thumhi =lu[0].offsetHeight;
        let xy =glyph.offsets(bench)
            , h =glyph.offsetHeight
            , x =bench.offsetWidth -(xy.left +(glyph.offsetWidth/2))
            , y =//(window.scrollY+window.visualViewport.height)
                bench.offsetHeight
                 -(h+xy.top+thumhi) +(above ? (h*.8):0);

        if(xy.left > (bench.offsetWidth*1/6))
            _this.style.css({"bottom": y+'px', "left":"", "right": x+'px'});
        else{
            _this.classList.add("sideleft");
            _this.style.css({"bottom": y+'px', "left":(xy.left)+'px'});
        }

        setTimeout(()=>{
            let topties =Array.from(lu).filter(tile=>Math.floor(tile.offsetTop) <thumhi);

            if(lu[topties.length]){
                try{
                    lu[topties.length-1].classList.add('top-ends')

                    let tall =parseFloat(_this.offsetHeight)
                        , ny =y +thumhi-tall;
                    _this.style.bottom= ny+'px';
                }
                catch{}
            }

            _this.classList.remove('maskout','limbo');
            Zhad.thumbvue =_this.getClientRects()[0] || {};

        },10);

        return true;
    }//end positionThumbs


    mkCheatah(rid, isRadical, birds){
        let ligan =elementary.create('span',{class:'ligan flexbug rfloat'});
        let reds =0, uniqueNames =[]
            ,priots = this.priots || Zhad.bench.querySelector('#hotc')
                 || elementary.create("span", {id:"hotc",class:"zhongwen-void thumbed busy"});
                
        priots.innerHTML ="";
        priots.appendChild(ligan);

        if(birds.length ===0){
            priots.classList.add("isempty");
            return;
        }
        else{
            priots.classList.remove("isempty");
        }

        //cheat list
        Zhad.bench.querySelector('div#qu').innerHTML ="";
        let freqs =[];

        for(let hoti of birds){

            let glyph =hoti.textContent.firstchar
                ,encount =parseInt(hoti.getAttribute('visits'))
                ,name =hoti.getAttribute("name");
            if(!isRadical);
            else if(encount <0 || uniqueNames.indexOf(name)===-1)
                uniqueNames.push(name);
            else
                continue;

            if(priots.textContent.replace(/[\[\(].*?[\]\)]/ug,'').includes(glyph)) continue;

            if(encount <0){
                if(isRadical){
                    hoti.attr({"name":name, 'data-derived':1}).classList.add('ligan');
                    ligan.appendChild(hoti);	//just move node
                    hoti.querySelector('.jump').textChild =glyph;	//truncate the ligans
                }
                else if(freqs.push( hoti ))
                    hoti.classList.add("rid");

                continue;
            }
            else if(!isRadical){
                hoti.setAttribute('da', hoti.textContent);
            }
            freqs.push( hoti );

            if(encount ===1) continue;
            else if(++reds <=4)
                hoti.classList.add('reds');
            else if(encount >2);
            else if(reds > 14){
                hoti.classList.add('verti');
            }
            hoti.classList.add('blu');

            if(encount >1)	hoti.attr('tip', encount);
        }//end loop
        priots.attr("children", freqs);

        let ligi =new RegExp('['+ligan.textContent+']');
        Array.from(priots.querySelectorAll('div:not(.ligan):not(.jump)'))
            .filter(e=>ligi.test(e.textContent))
            .forEach(e=>e.classList.add('hidden'));

        if(!priots.parentNode){
            Zhad.bench.querySelector('#qu').insertAdjacentElement('afterend', priots);
            chrome.storage.sync.get(['context'], (context)=>{
                if(chrome.runtime.lastError);
                else if(!context.context.busyPage)
                    priots.classList.remove('busy');
                });
        }

        switch(true){
        case ligan.children.length ==0:
            break;

        case ligan.children.length <10:
            ligan.classList.add('pint'); //.css('height', '3em');
        default:
            setTimeout(()=>flexbug.resizeFlexColumn(Zhad.bench.querySelector('.ligan.flexbug.rfloat'), 3),20);
        }//end switch
    }//end mkCheatah

    wireJump(canvas, isRadical, aryl){
        let io =this
            ,parakeys =Zhad.bench.querySelectorAll('#parakeys.once .parakey:not(.dumb)');
        let tiles = aryl ? aryl
            : Array.from(canvas.querySelectorAll('.jump'))
                .filter(x=>x.parentNode && !x.parentNode.matches('.parakey'))
                .map(v=>v.matches('.peeker, [data-derived="2"]') ? v : v.parentNode);
        tiles.push(...parakeys);
        tiles.forEach(e=>e
            .oneve('mousedown', async function(evt){
                evt.preventDefault();
                evt.stopPropagation();
                if(this.classList.contains('parakey')){
                    let _this =this.querySelector('.jump, img');
                    io.post()(evt, _this.fn('value') || _this.fn('mousedown'));
                }

                else if(evt.which ==1 || !isRadical){
                    io.post()(evt);
                }
                else{
                    Zhad.paged.push({"dsrc" :Zhad.dsrc,
                            "nstrokes": Zhad.spanStrokes});

                    let strokes =await Zhad.options.glyb.querySelectorAll('entry[radical]');
                    var rglyph =new RegExp('[' +this.textContent.replace(/^([^ ]+)(.*?([^ ,\.\t:\[\(\)\]]).*|.*)$/gu,'$3$1')+ ']', 'gu'),
                        idx =parseInt(this.getAttribute('name') || -1);

                    let zod = strokes.filter((x,n)=> rglyph.test(x.radical) || n ==idx ).reverse()[0];
                    Zhad.current =zod.radical +' '+zod.n+"+";
                    io.show( 0,await Zhad.options.glyb.querySelectorAll("[radical='"+zod.radical+"'] > *") );
                }
            })
            .oneve('contextmenu', function(evt){
                    return ellipsor.stopPropagation(evt);
                }));
        if(parakeys.length){
            parakeys[0].parentNode.classList.remove('once');
            parakeys[0].parentNode.style.display ='';
        }
    }//end wireJump

    post(target,r){
        let sr =window.getSelection()
        return async (evt, spoon)=>{
                let focusNode =sr.focusNode;
                if(!focusNode && !Zhad.tx){
                    return;
                }
                else if(Zhad.tx);
                else if(focusNode.matches && !focusNode.matches(__editables.join(','))){
                    focusNode =focusNode.querySelector(__editables.join(',')) || focusNode;
                }
                let txVal =""
                    ,txLocked =Zhad.txLocked && Zhad.tx
                    ,boolTx =!txLocked && ["text","textarea"].indexOf(document.activeElement.type) >=0;

                if(spoon instanceof RegExp){
                    txVal =sr.toString().replace(/^(.+)$/su, spoon.source)
                    if( txVal.length ===0 ) return;
                }
                else if(typeof(spoon) =='function'){
                    txVal =await spoon(evt, Zhad.options.glyb, sr);
                    if(typeof(txVal) === "string");
                    else if(txVal.type){
                        switch(txVal.type){
                        case 'focus':
                            Zhad.txLocked =(Zhad.tx =(!txVal.focus || __editables.indexOf(txVal.focus.nodeName)===3) ? txVal.range : txVal.focus)
                                 ? true: false;
                            return;
                        default:
                            break;
                        }
                    }
                }
                else if(typeof(spoon)==="string"){
                    txVal =spoon;
                }
                else if(evt.target.nodeName ==="IMG")
                    return; //fall to click
                else{
                    txVal =evt.target.textContent.firstchar;
                    Zhad.options.glyb.rank(txVal);
                }

                if( txVal.length ===0 );
                else if(focusNode.setRangeText || (boolTx && document.activeElement.setRangeText)){
                    let tx =focusNode.setRangeText ? focusNode : document.activeElement;
                    Zhad.tx =tx;
                    tx.setRangeText(txVal);
                    tx.selectionStart += txVal.length;
                    //tx.focus();
                    tx.dispatchEvent(new Event('input'));
                }

                else if( (Zhad.tx && Zhad.tx instanceof Range)
                 || (!txLocked && focusNode
                    && !focusNode.parentNode.closest('#zhong')) ){
                    let rtxt =document.createRange()
                        ,etxt =document.createTextNode(txVal)
                        ,spot =elementary.create("mark", {"fore":1
                                ,"data-content": txVal
                                ,"undo":++Zhad.undo});
                    let range =Zhad.tx && Zhad.tx instanceof Range ? Zhad.tx : sr.getRangeAt(0);

                    sr.deleteFromDocument();
                    range.insertNode(etxt);
                    range.insertNode(spot);

                    rtxt.selectNodeContents(etxt);
                    sr.empty();
                    sr.addRange(rtxt);
                    rtxt.setStart(etxt, txVal.length);

                    Zhad.tx =etxt;

                    setTimeout(()=>{
                        spot.remove();
                        }, 200 * (Zhad.txLocked ? 25 :1));
                }
                else if(!Zhad.tx);

                else if(Zhad.tx.nodeName === "#text"){
                    let rtxt =document.createRange()
                        ,ltxt =document.createRange()
                        ,etxt =document.createTextNode(txVal)
                        ,spot =elementary.create("mark", {"fore":1
                                ,"data-content": txVal
                                ,"undo":++Zhad.undo});

                    ltxt.selectNodeContents(Zhad.tx);
                    ltxt.setStart(Zhad.tx, Zhad.tx.data.length);

                    sr.empty();
                    sr.addRange(ltxt);
                    sr.getRangeAt(0).insertNode(etxt);
                    sr.getRangeAt(0).insertNode(spot);
                    rtxt.selectNodeContents(etxt);
                    sr.empty();
                    sr.addRange(rtxt);
                    rtxt.setStart(etxt, txVal.length);
                    Zhad.tx =etxt;

                    setTimeout(()=>{
                        spot.remove();
                        }, 200 * (Zhad.txLocked ? 25 :1));
                }
                else{
                    let tx =Zhad.tx;
                    if(!Zhad.txLocked) Zhad.tx =null;
                    //tx.blur();
                    tx.setRangeText(txVal);
                    tx.selectionStart += txVal.length;
                    tx.focus();
                    tx.dispatchEvent(new Event('input'));
                }
                return ellipsor.stopPropagation(evt);
            };
    }//end post
}//end stenozho widget


