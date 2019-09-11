//import { Zhong } from "./czhong";

//$(
//import {elevate} from "./utils";
//import {parakeys} from "./parakeys";
//import {zhoChat} from "./zhoChat";
const peekcount =27, peekmax =33;

let timeGhoul =0, tmleave =0
    ,tmThumb =0;

//export
class Zhad{
    static options={
            tileLimit :83
            ,parakeys: parakeys
            ,glyb: null //new zhong()
            ,uponGlyph:()=>0
            ,donce:()=>0
        };
    static $bench =$('<div id="zhong" class="hidden nil-darkreader"/>');
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

    constructor(){
        let io =this;
        if(!Zhad.options.glyb) Zhad.options.glyb = new zhoChat();

        if( $(this).closest("ui-widget").length ==0 ){
            Zhad.$bench.addClass("ui-widget ui-stenozo");	//makes rerunable easier
            let root =$("div#extension-zhopad");
            if(root.length)
                root =root[0];
            else{
                document.body.parentNode.appendChild(root =$("<div id='extension-zhopad'>")[0]);
            }
            root.appendChild(Zhad.$bench[0]);
            Zhad.$bench[0].style.transform="translate(0,0)";

            //this.onOpen();
            //this.onNavigate();
            Zhad.$bench.append(this.mkParakeys(Zhad.options.parakeys, {"ghoul":null}));

            $(Zhad.options.parakeys.invertShiftScro).click((evt)=>{
                    Zhad.invertShiftScroll =$(event.target).is(':checked');
                    });

            let $thumbview =$('<div id="qu" class="bucket zhongwen-void climid">')
            Zhad.$bench.prepend($thumbview);

            $thumbview.on('mousedown',()=>{
                        let $jump =$(document.elementsFromPoint(event.x,event.y)).filter('.qu, .jump').first().filter(':not(.qu)');
                        try{
                            console.log(event);
                            if( $(event.target).is('.qu') );
                            else if(event.buttons ==4 || !$jump.length){
                                Zhad.$bench.find('#qu').empty();
                            }
                            else{
                                let evme =$.Event('mousedown', Zhad.moxy);
                                $jump.trigger(evme);
                            }
                        }
                        finally{
                            event.returnValue =false;
                            event.stopImmediatePropagation();
                            event.preventDefault();
                        }
                    })
                    .on('contextmenu',()=>{
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                    })
                    .on('mousemove',function bktmove(){
                        let xy = Zhad.moxy ={x:event.x,y:event.y}
                            ,root =$(this).data('root');
                        let $jump =$(document.elementsFromPoint(xy.x,xy.y)).filter('.qu, .jump').first();
                        let $jmp =$jump;
                        try{
                            if($jump.length ==0)	return;

                            else if($jump.hasClass('qu')){
                                $(this).removeClass('limbo',50);
                                $jump =$(root).filter(':not([data-jump])');
                            }
                            else if($jump.get().indexOf(root) <0)
                                $jump =$jump.parent();
                            else	return;
                        }
                        finally{
                            // if($jmp.hasClass('jump'))
                            //     $(this).addClass('limbo',100);
                        }

                        if($jump.length){
                            let evme =$.Event('mouseenter', xy);
                            evme.data ={bits:256};
                            $jump.trigger(evme, {flags:256});
                        }
                    });
            // $thumbview[0].addEventListener("wheel",function thumwhee(evt){
            //     if((event.wheelDeltaY || event.wheelDelta) <0){
            //         ellipsor.stopPropagation(evt);
            //         setTimeout(()=>this.classList.add('maskout','ghoul','limbo'), 300);
            //     }
            // }
            // ,{passive:false});

            Zhad.$bench.draggable({opaciti: 0.35
                ,cancel:'div.jump'})
                .on('mousemove',()=>{
                    Zhad.moxy ={x:event.x,y:event.y};
                    if(!$thumbview[0].matches(".maskout")
                     && Math.max(Math.abs(event.movementX),Math.abs(event.movementY)) >60){
                        $thumbview.empty();
                        console.log([event.movementX,event.movementY]);
                     }

                    })
                .on('dragover', this.dragOver)
                .on('drop', this.drop);
        }
        else{
            this.destroy();
            return false;
        }

        //Zhad.invertShiftScroll =Zhad.options.parakeys.invertShiftScro.is(':checked');
        var cfgObserve = {

            attributeFilter: ['data-jump']
        };

        var observer = new MutationObserver((muti)=>{
            let muta;
            if((muta =muti[muti.length-1]).attributeName =='data-jump'){
                Zhad.options.uponGlyph(muta.target.getAttribute('data-jump'));
            }
        });
        observer.observe(Zhad.$bench[0], cfgObserve);
    }//end constructor

    destroy(){
        this.onDetach();
        Zhad.$bench.empty();
        Zhad.$bench[0].remove();
        Zhad.$bench =$('<div id="zhong" class="hidden nil-darkreader"/>');
        //Zhad.paged.length =Zhad.options.parakeys=0;
        Zhad.dsrc =Zhad.options.glyb =null;
    }
    onDetach(){
        $(document).off("mousedown contextmenu");
    }

    onOpen(){
        var buttons =0
            ,wo =this;
        $(document).on('mousedown', async function midown(evt){
                let bench =Zhad.$bench[0];

                if((buttons =evt.buttons&7) >=3 && !evt.shiftKey){
                    let event =evt.originalEvent;
                    if(bench.matches(":empty"))
                        bench.classList.remove("hidden");
                    else if(bench.classList.toggle('hidden'))
                        return evt.shiftKey || false;	//shift key will enable autoscroll

                    let coords ={"left":event.x -(Math.floor(bench.offsetWidth /2)) +'px'
                                ,"top":event.y -40 +'px'};
                    if(coords.left.charAt(0) ==='-') coords.left =0;

                    bench.style.css(coords);
                    if(bench.matches(":empty") || !bench.querySelector('.ellipser')){
                        //await wo.context.shelves();
                        //this.setState({show:0});
                        wo.show(0, elevate(await Zhad.options.glyb.radicals));
                        Zhad.options.donce();
                    }
                    else
                        return false;
                    event.preventDefault();
                    event.stopPropagation();

                }//end middle click

                setTimeout(()=>buttons=0,10);
                return true;
            })
            .on('contextmenu',function ctxmenu(evt){
                if((buttons || evt.originalEvent.buttons) &1){
                    return ellipsor.stopPropagation(evt.originalEvent);
                }
            });
    }//end onOpen

    onNavigate(){
        var tmr =0;
        $('html')[0].addEventListener('wheel', async ()=>{
            const bigwheel =-430;
            var delta =1 //(Zhad.options.parakeys.trackpad.filter(':checked').val() ||1)
                            *event.wheelDeltaY || event.wheelDelta;
            var $bench =Zhad.$bench;
            if($bench.is('.hidden')) return;
            //event.target is off on android tablet
            var onrad =parseInt($bench.find('span.radical').first().data('strokes') || 0)
                , inzho =Zhad.wheeling || document.elementsFromPoint(event.x, event.y).filter((v)=> v ===$bench[0]).length;
            try{
                if(delta < 0 && Zhad.spanStrokes ==0 && onrad)
                    return false;
                else if(delta < bigwheel && Math.max(delta, Zhad.wheeling) > bigwheel){	//huge unwind... goes to base
                    console.log(Zhad.wheeling +'>'+ delta);
                    Zhad.paged.length =0;
                    inzho =1;
                }
                else if(Zhad.wheeling || Math.abs(delta) <90){
                    return false;
                }
                else console.log(delta);
            }
            finally{
                if(inzho){	//wheel inside bench will not scroll container, e.g., body
                    event.returnValue =false;
                    event.stopImmediatePropagation();
                    event.preventDefault();
                }

                setTimeout(()=>this.mkThumbs(), 0);	//clear fave dialog
            }//end try

            Zhad.wheeling =delta;
            let banDescend =$bench.is('.flat')
                ,whilst =new Promise(async (resolve) =>{
                    if(banDescend)
                        clearTimeout(tmr);
                    else
                        $bench.addClass('flat');

                    try{
                        if(delta >0){
                            let $ele =inzho ? $(document.elementFromPoint(event.x, event.y)).children('.jump:not([tip])').addBack('.jump').first() :[];

                            if(!banDescend && $ele.length && event.shiftKey !=Zhad.invertShiftScroll
                                && $bench.has('.radical').length ){
                                onrad =0;
                                if($ele.is('[data-derived="2"]') || $ele.parent('div[data-jump]').length){
                                    $ele.mousedown();
                                }
                                else
                                    $bench.find('div[data-jump] > .jump').first().mousedown();
                            }
                            else if(!$bench.is('[data-scroll="stop"]') ){
                                if( $bench.children().length ){
                                    Zhad.paged.push({"dsrc" :Zhad.dsrc,
                                            "nstrokes": Zhad.spanStrokes});
                                }
                                this.show(parseInt($bench.find('span[data-strokes]').last().data('strokes')));
                            }
                        }else if(event.shiftKey	//load base state
                            || Zhad.paged.length ==0
                            || (event.buttons & 2) ==2){
                            Zhad.paged.length =0;
                            this.show(0, elevate(await Zhad.options.glyb.radicals));
                            onrad =true;
                        }else{
                            let prior =Zhad.paged.pop();
                            onrad =this.show(prior.nstrokes, prior.dsrc).onrad;
                        }
                    }
                    finally{
                        setTimeout(resolve, $(Zhad.options.parakeys.fastscro).is(':checked') ? 0: 100);
                    }//end try

                });//end promise
            await whilst;
            setTimeout(()=>Zhad.wheeling =0, 500);
            if(onrad)
                tmr =setTimeout(()=>$bench.removeClass('flat',200), 500);
            else
                $bench.removeClass('flat');

            return false;
        }, {passive:false});
    }//end onNavigate

    async whereAt(glyph){
        let c
            , bench =Zhad.$bench[0]
            , tile =bench.querySelector('[data-jump="up"]');

        try{
            if(window.getComputedStyle(bench).display ==='none'
            || (c =glyph.replace(/^[ \t\r\n,-]*/u, '').charAt(0)).length ==0);

            else if( tile !==null && tile.textContent.indexOf(c) >=0 ){
                console.log('knack');
            }
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
                        , await Zhad.options.glyb.querySelectorAll("[radical='"+node.radical.charAt(0)+"'] > *")
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
        let event =evt.originalEvent;
        event.dataTransfer.dropEffect ='copy';
        event.preventDefault();
        event.stopPropagation();
    }
    drop =(evt)=>{
        let event =evt.originalEvent || evt;
        this.whereAt(event.dataTransfer.getData("text/plain"));
        event.preventDefault();
        event.stopPropagation();
    }

    mkParakeys(template, props){
        let parsky =[], io =this;

        if(!document.querySelectorAll('#parakeys').length){
            for( var glif in template ){
                if( parakeys.hasOwnProperty(glif)){
                    let parakey =parakeys[glif];
                    if( typeof(parakey) =='function'){
                        try{
                            var $p =parakey(props[glif]);
                        }
                        catch(e){
                            $p =$("<div class='jump'/>").text(glif)
                                    .data("mousedown", parakeys[glif])[0];
                        }
                        finally{
                            let props={},
                                attr =Array.from($p.attributes).filter(x=>x.name.indexOf('data-title')>=0);
                            if(attr.length){
                                props[attr[0].name] =attr[0].value;
                                $p.removeAttribute(attr[0].name);
                            }
                            parsky.push( $("<div class='parakey'/>").append($p).attr(props) );
                        }
                    }
    
                    else if( parakey.tagName && ['input','img'].indexOf(parakey.tagName.toLowerCase()) >=0 ){
                        let props={},
                            attr =Array.from(parakey.attributes).filter(x=>x.name.indexOf('data-title')>=0);
                        if(attr.length){
                            props[attr[0].name] =attr[0].value;
                            parakey.removeAttribute(attr[0].name);
                        }
                        parsky.push( $("<div class='parakey'/>").append(parakey)
                            .attr(props) );
                    }
                    else{
                        parsky.push($('<div class="parakey"/>')
                                    .append($('<div class="jump">').text(glif)
                                                .data({"value":parakey})));
                    }
                }
            }//end loop
            let $parakeys =$('<span id="parakeys" class="once">').append(parsky);
    
            let btnClose =$('<div class="parakey" id="btnclose" data-title="Close">')
                     .on("click", ()=>Zhad.$bench[0].classList.add('hidden'))
                     .append($('<img alt="●"/>')
                            .attr("src", chrome.runtime.getURL("/images/x.png")));
    
            return [$parakeys, btnClose];
        }
        return null;
    }//end mkParakeys

    async show(nstrokes, src, glyat){
        var $canvas =this.$canvas = (this.$canvas || $('<span>').addClass('ellipser nauto thumbed hidden')).removeClass('detach').empty();
        if(!$canvas.parent().length){
            Zhad.$bench.append($canvas);
        }
        try{
            let [isRadical, palette, isstopped, strokes, birds] =await this.mk(nstrokes, src, glyat);
            $canvas.append(palette);

            //cheat list
            await this.mkCheatah(isRadical, birds);

            if(birds.length ==0 || Zhad.$bench.find('[data-jump]').first().parents('.ellipser').length)
                $canvas.addClass('detach');

            clearTimeout(this.tmr ||0);
            Zhad.spanStrokes =parseInt(palette[0][0].getAttribute('data-strokes')) -1;
            Zhad.$bench.attr({'israd': isRadical ? 1:null
                })
            .attr('data-scroll', isstopped ? 'stop':'more')
            .attr('data-strokes', 
                        (isRadical ? '': '（'+ Zhad.current +'）\t')+
                        (Zhad.spanStrokes+1)
                        +'..\t'+
                        palette[palette.length-1][0].getAttribute('data-strokes')
                        +(isstopped ? "":'●●'));

            this.tmr =setTimeout(()=>Zhad.$bench.removeClass("hover", 500), 2000);
            if(isRadical){
                let $hotc =Zhad.$bench.find('#hotc')
                    , excludes =Array.from($hotc[0].querySelectorAll("[name]"))
                        .map(x=>x.getAttribute("name"));
                let zedz =await this.whimpets(null, excludes);
                for(let lef of zedz){
                    let $tef =$('<div>').addClass('jump').text(lef.zi)
                            .attr({'tip':1,'void':0,"data-derived":2, name:lef.name});
                    $hotc.append($tef);
                }
            }
            this.wireJump(Zhad.$bench, isRadical);

            let $strokes =$canvas.find('span[data-strokes] > div:first-child');
            $strokes.attr('data-strokes', function(){return $(this).parent().attr('data-strokes')});
            return {wo:Zhad.$bench.addClass("hover"), onrad: isRadical};
        }
        catch(err){
            console.log(err);
            return {};
        }
    }//end show

    async mk(nstrokes, src, glyat){
        Zhad.dsrc= src =src || Zhad.dsrc;
        src =src.filter(x => parseInt(x.n || $(x).attr('n') ||1000) > nstrokes);
        if(!src) throw("empty source src.");

        if(!src.length){
            src =Zhad.dsrc.slice();	//new copy
        }
        let isRadical =(src instanceof Array && src.length && src[0].radical) || false;

        //nstrokes =(nstrokes || parseInt(Zhad.$bench.find('span[data-strokes]').first().data('strokes')) || 1);

        let zis =await Zhad.options.glyb.pageOn(src, Zhad.options.tileLimit, isRadical);

        let [tiles, ender, strokes, birds] =await this.mkTiles(isRadical, zis, glyat);

        return [isRadical, tiles, ender, strokes, birds];
    }//end mk


    async mkTiles(isRadical, tiles, glyat){
        const rgxp =/^(.*?)(~)*([0-9]+)*$/ug;
        let wo =this
            , canvi =[], y
            , birds =[]
            , hots =await Zhad.options.glyb.hots;
        let entertile =function(event){
            clearTimeout(tmThumb);
            let $bench =Zhad.$bench
                , tile =$(this).find('.jump').addBack('.jump')[0];

                $bench.find('[data-jump]').removeAttr('data-jump');
                tile.parentNode.setAttribute('data-jump','up');

                $bench[0].setAttribute('data-jump', $(event.target).text());
                if(isRadical){
                    let io =this;
                    tmThumb =setTimeout(()=>tmThumb =wo.mkThumbs($(io).find('.jump[name]')[0], event), 100);
                }
            };
        for(var k in tiles){
            if(!tiles[k]) continue;
            else if( tiles[k] ==='stop') break;
            let children =[];

            for(let haizi of tiles[k]){
                rgxp.lastIndex =0;
                let [tx, lit, derived, name] =rgxp.exec(haizi);

                let	$dv =$('<div/>').addClass('jump').text(lit);
                let $tile =$("<div/>").attr({"name": name || k
                        , derived: derived
                        , strokes: (children.length ? null:k)})
                    .attr(lit===glyat ? {"data-jump":"up"}:{})
                    .on('mouseenter', entertile)
                    .append($dv);

                if((y =hots[lit.charAt(0)]) /*&& (y>0 || isRadical)*/){
                    birds.push( $tile );
                }
                else
                    children.push($tile);
            }

            let $dva =$("<span>")
                .attr({"data-strokes":k
                    ,class: isRadical ? 'radical':'steno'})
                .append(children);
            canvi.push($dva);
        }
        let boolStop =tiles[k]==="stop";
        return [canvi, boolStop ? "stop":null, parseInt(k), birds];
    }//end mkTiles

    async whimpets($root, excludes=[], nlimit = 3){
        $root = $root || Zhad.$bench.filter('[israd="1"]').find('.ellipser');
        let $leaf =$root.find('div[name]:not(.jump):not(.blu):not([data-derived="1"])');
        let qu =[]
            ,que =await Zhad.options.glyb.qu;
        for(let laf of $leaf){
            //if($(laf).text().length > 1) continue;
            let k =laf.getAttribute('name');
            if(excludes.indexOf(k) >=0) continue;

            let lef =(!(que instanceof Promise) && que && que[k]) || await Zhad.options.glyb.shelfup(laf.textContent.charAt(0));
            if(lef) qu.push(...lef.slice(1,nlimit).map(x=>{return {"zi":x,"name":k}}) );
        }
        return qu;
    }

    async mkThumbs(glyph, evt, above = false){
        let $bucket =Zhad.$bench.find('div#qu');
        if(!glyph){
            $bucket.empty();
            return 0;
        }

        const qumousemov =function(evt){
                evt =evt.originalEvent || evt;
                if(Zhad.thumbvue.left <= evt.x && evt.x <= Zhad.thumbvue.right
                && Zhad.thumbvue.top <= evt.y && evt.y <= Zhad.thumbvue.bottom ){
                    Zhad.$bench.off("mousemove", qumousemov);
                    Zhad.$bench.find('div#qu').removeClass("nomie");
                    //console.log( $._data( Zhad.$bench[0], "events" ) );
                }

                // if(document.elementFromPoint(evt.x, evt.y).matches("#qu")){
                //     Zhad.$bench.off("mousemove", qumousemov);
                //     Zhad.$bench.find('div#qu').removeClass("nomie");
                // }
            };
        let eles =document.elementsFromPoint(Zhad.moxy.x,Zhad.moxy.y).slice(0,3);

        evt =(event||evt);
        glyph =$(glyph).parents('.thumbed').find('[data-jump]').find('.jump')[0];

        if(!glyph || glyph.matches(".qu"))
            return 0;
        else if(glyph && $bucket.is(":not(:empty)") && $bucket.data('root') ===glyph)
            $bucket[0].classList.remove('maskout','ghoul','limbo');
        else if( eles[0].matches('.qu') ){
            console.log(glyph.textContent);
        }
        else if(eles.find(e=>[e, ...e.children].indexOf(glyph) >=0) && $bucket.addClass('maskout limsbo ghoul nomie',0)
                .data('root', glyph)){
            clearTimeout(Zhad.thumbvue);
            Zhad.$bench.off("mousemove", qumousemov);

            let qu = await Zhad.options.glyb.shelfup(glyph.textContent.charAt(0));
            if(!qu) return 0;

            let wo =this
                ,ch =glyph.textContent.charAt(0)
                ,lu=[];
            qu.slice(1, Math.min(peekmax, Math.max(qu[0], peekcount)))//.reverse()
                .sort((l,r)=>l===ch ? -1:0)
                .forEach((g,i)=>lu.push($('<div class="qu">').text(g).addClass(()=>g==ch ? 'rid':null)));

            $bucket.empty().append(lu);

            $bucket.children('.qu')
                .on('mousedown', function clickqu(){
                    if( $(this).parents('#qu').is('.limbo') ){
                        $(document.elementsFromPoint(event.x, event.y).slice(3,3)).trigger($.Event('mousedown',event));
                    }
                    else if((event.buttons&7) >=3)
                        $bucket.empty();
                    else
                        wo.post()(event);
                    return ellipsor.stopPropagation(event);
                    })
                .on('mouseenter',function quent(){
                    clearInterval(tmleave);
                    Zhad.$bench.attr('data-jump', this.textContent);
                    })
                .on('mouseleave',function bktleave(){
                    tmleave =setInterval(()=>{
                        let cell=Array.from(document.elementsFromPoint(Zhad.moxy.x, Zhad.moxy.y));
                        if(cell.filter(x=>x===$bucket.data('root')).length ===0)
                           $(this).parent().addClass('maskout');
                        }, 500);
                })
                .on('contextmenu',()=>{
                    return ellipsor.stopPropagation(event);
                });
            if(this.positionThumbs(glyph))
                Zhad.tmThumbme =setTimeout(()=>Zhad.$bench.on("mousemove", qumousemov), 100);
        }//end if
        return 0;
    }//end mkThumbs

    positionThumbs(glyph, above =0){
        let $this =Zhad.$bench.find('div#qu')[0]
            , lu =$this.querySelectorAll('.qu')
            , bench =$this.parentNode;
        if(lu.length ===0 || !glyph || glyph.matches(".qu")) return false;

        let thumhi =lu[0].offsetHeight;
        let coord =window.getComputedStyle(glyph)
            , xy =glyph.offsets(bench)
            , h =glyph.offsetHeight
            , x =xy.left +(glyph.offsetWidth/2)  -Math.floor($this.offsetWidth /3)
            , y =//(window.scrollY+window.visualViewport.height)
                bench.offsetHeight
                 -(h+xy.top+thumhi) +(above ? (h*.8):0);

        $this.style.css({left: x+'px', bottom: y+'px'});

        setTimeout(()=>{
            let topties =Array.from(lu).filter(tile=>Math.floor(tile.offsetTop) <thumhi);

            if(lu[topties.length]){
                try{
                    lu[topties.length-1].classList.add('top-ends')

                    let tall =parseFloat($this.offsetHeight)
                        , ny =y +thumhi-tall;
                    $this.style.bottom= ny+'px';
                }
                catch{
                    //console.log([h,x,y])
                }
            }

            setTimeout(()=>$this.classList.remove('maskout','limbo','ghoul'), 10);
            Zhad.thumbvue =$this.getClientRects()[0] || {};
            //console.log(Zhad.thumbvue);

        },10);

        return true;
    }//end positionThumbs


    async mkCheatah(isRadical, birds){
        let $ligan =$('<span/>').addClass('ligan flexbug rfloat');
        let reds =0, uniqueNames =[]
            ,$priots = this.$priots
                =(this.$priots || $(Zhad.$bench[0].querySelector('#hotc') || '<span id="hotc" class="zhongwen-void thumbed"/>')).empty().append($ligan);

        if(birds.length ===0){
            $priots.addClass("isempty");
            return;
        }
        else{
            $priots.removeClass("isempty");
        }

        //cheat list
        Zhad.$bench.find('div#qu').empty();
        let hots =await Zhad.options.glyb.hots;

        for(let $hoti of birds.sort(($x,$y) => hots[$y[0].textContent.charAt(0)]
                                            -hots[$x[0].textContent.charAt(0)])){

            let glyph =$hoti[0].textContent.charAt(0)
                ,encount =hots[glyph]
                ,name =$hoti.attr("name");
            if(!isRadical);
            else if(encount <0 || uniqueNames.indexOf(name)===-1)
                uniqueNames.push(name);
            else
                continue;

            if($priots[0].textContent.replace(/[\[\(].*?[\]\)]/ug,'').includes(glyph)) continue;

            let io =this
                ,$jump =$hoti.find('.jump');
            $($hoti).on('mouseenter', function(evn, dat){
                    clearTimeout(tmThumb);
                    Zhad.$bench.find('[data-jump]').removeAttr('data-jump');
                    $($hoti).attr('data-jump','up');
                    Zhad.$bench.attr('data-jump', this.textContent);

                    if(isRadical){
                        let evt =event;
                        if(dat) evt.data =dat;
                        let glyph =this.matches("[name]") ? this :this.querySelector('.jump[name]');

                        tmThumb =setTimeout(()=>tmThumb =io.mkThumbs(glyph, evt), 100);
                    }
                });

            if(encount <0){
                if(isRadical){
                    $ligan.append($hoti);	//just move node
                    $hoti.addClass('ligan').find('.jump').text(glyph)
                        .attr({name:name, 'data-derived':1});	//truncate the ligans
                }
                else
                    $priots.append( $hoti.addClass("rid") );

                continue;
            }
            else
                $priots.append( $hoti );

            if(encount ===1) continue;
            else if(++reds <=4)
                $hoti.addClass('reds');
            else if(encount >2);
            else if(reds > 14){
                $hoti.addClass('verti');
            }
            $hoti.addClass('blu');

            if(encount >1)	$hoti.attr('tip', encount);
        }//end loop
        let ligi =new RegExp('['+$ligan[0].textContent+']');
        $priots.find('div:not(.ligan):not(.jump)')
            .filter((i,e)=>ligi.test(e.textContent)).addClass('hidden');

        if(!$priots.parent().length) Zhad.$bench.find('#qu').after($priots);

        switch(true){
        case $ligan.children().length ==0:
            break;

        case $ligan.children().length <10:
            $ligan.addClass('pint'); //.css('height', '3em');
        default:
            setTimeout(()=>flexbug.resizeFlexColumn(Zhad.$bench.find('.ligan.flexbug.rfloat'), 3),20);
        }//end switch
    }//end mkCheatah

    wireJump($canvas, isRadical){
        let io =this
            ,$parakeys =Zhad.$bench.find('#parakeys.once .parakey');

        $(Array.from($canvas[0].querySelectorAll('.jump'))
            .filter(x=>!x.parentNode.matches('.parakey'))
            .map(v=>v.matches('[data-derived="2"]') ? v : v.parentNode))
            .add($parakeys)
            .on('mousedown', async function(){
                event.preventDefault();
                event.stopPropagation();
                if(this.classList.contains('parakey')){
                    let $this =$(this).find('.jump');
                    io.post()(event, $this.data('value') || $this.data('mousedown'));
                }

                else if(event.which ==1 || !isRadical){
                    io.post()(event);
                }
                else{
                    Zhad.paged.push({"dsrc" :Zhad.dsrc,
                            "nstrokes": Zhad.spanStrokes});

                    let $target =$(this)
                        , strokes =await Zhad.options.glyb.querySelectorAll('entry[radical]');
                    var rglyph =new RegExp('[' +$target.text().replace(/^([^ ]+)(.*?([^ ,\.\t:\[\(\)\]]).*|.*)$/gu,'$3$1')+ ']', 'gu'),
                        idx =parseInt($target.find('[data-derived]').addBack('[data-derived]').attr('name') || -1);

                    let zod = strokes.filter((x,n)=> rglyph.test(x.radical) || n ==idx )[0];
                    Zhad.current =zod.radical +' '+zod.n+"+";
                    io.show( 0,await Zhad.options.glyb.querySelectorAll("[radical='"+zod.radical+"'] > *") );
                }
            })
        .on('contextmenu', function(evt){
                    return ellipsor.stopPropagation(evt.originalEvent);
                });
        Zhad.$bench.find('#parakeys').removeClass('once');
    }//end wireJump

    post($target,r){
        let sr =window.getSelection()
        return async (event, spoon)=>{
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
                    txVal =await spoon(Zhad.options.glyb, sr);
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
                else{
                    txVal =event.target.textContent.charAt(0) || "";
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
                    && $(focusNode).parents().filter((i,x)=>x===Zhad.$bench[0]).length===0) ){
                    let rtxt =document.createRange()
                        ,etxt =document.createTextNode(txVal)
                        ,spot =$("<mark fore/>")
                            .attr({"data-content": txVal
                                ,"undo":++Zhad.undo})[0];
                    let range =Zhad.tx && Zhad.tx instanceof Range ? Zhad.tx : sr.getRangeAt(0);

                    sr.deleteFromDocument();
                    range.insertNode(etxt);
                    range.insertNode(spot);

                    rtxt.selectNodeContents(etxt);
                    sr.empty();
                    sr.addRange(rtxt);
                    rtxt.setStart(etxt, txVal.length);

                    //console.log($(etxt).position());
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
                        ,spot =$("<mark fore/>")
                            .attr({"data-content": txVal
                                ,"undo":++Zhad.undo})[0];

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
                return ellipsor.stopPropagation(event);
            };
    }//end post

    async hottops(k =200){
        return await Zhad.options.glyb.hottops(k);
    }//end hottops

    async repull(){
        await Zhad.options.glyb.rx(true);
        Zhad.options.glyb.shelves();
    }//end repull

    async hotlines(k =200, limitLength=60){
        let regux =new RegExp('(.{1,' +limitLength+ '})','sug');
        let hott =await Zhad.options.glyb.hottops(k);
        return hott.join('').match(regux).join('\n');
    }//end hotlines
}//end stenozho widget


window.addEventListener("beforeunload", ()=>{
    let $uiw =$('.ui-stenozo')
    // $uiw.each((i, ui)=>{
    //     let stez =$(ui).data('uiStenozho');
    //     //if(stez.options.glyb) stez.options.glyb.clear();
    //     stez.destroy();
    // });
});

