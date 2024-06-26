import {} from "../minified/utils.min.js";    //nees string.prototype.firstchar


const peekcount =27, peekmax =33;
const xmremote ="http://justjillizm.com/";
const xmroot =chrome.runtime.getURL("/");

export class Zhong{
    static __selectorCached ={};
    static fonal;
    static ligans =Zhong.embellish();
    static rootseq ={};
    static strokes =Zhong.setGlyphs();

    constructor(){
        this._hots ={};
        this.className ={};

        this.rx();
        this.qu =[];
    }//end constructor

    static textOf(ta){
        if(!ta)
            return ta;
        else if(typeof(ta)==='string' || ta instanceof String)
            return ta;
        else if(ta instanceof Node ===false)
            return ta.toString();

        else if( ta.matches('textarea,input,select') )
            return ta.value;
        else
            return ta.textContent;
    }//end textOf

    static textZhong(ta){
        return Zhong.textOf(ta).replace(/[\u0000-\u4DFF\uFEFF\uff0c]/gu,''); //UTF-BOM EFBBBF
    }

    static async setGlyphs(refresh =false){
        if(refresh);
        else if(Zhong.radicals && Zhong.radicals.length) return;
        let xmparse =new DOMParser();

        let _strokes=
        await
        fetch(xmroot +'xml/jungpk-x.xml')
            .then(response => response.text())
            .then(response => xmparse.parseFromString(response,"text/xml"))
            .then((dxml) => {
                    let __strokes =dxml.documentElement;

                    let xpand =__strokes.querySelectorAll('w[uend]');
                    xpand.forEach((stro,i)=>{
                        let	a =parseInt(stro.getAttribute('zi'))
                            ,z =parseInt(stro.getAttribute('uend'))
                            ,simpl =stro.getAttribute('alt')
                            ,n =stro.getAttribute('n')
                            ,lbl =[];

                        for(; a <= z; a++)
                            lbl.push( document.createElement('w')
                                .attr({'n': n
                                    ,'zi': unescape('%u'+a.toString(16))
                                    ,'alt':simpl}) );
                        console.log(lbl.length);
                        stro.replace(lbl);
                    });
                    return __strokes;
                }
            )
            .catch((err)=>{
                console.log(err);
            });

        fetch(xmroot +'xml/jungrads.xml')
            .then(response => response.text())
            .then(response =>xmparse.parseFromString(response,"application/xml"))
            .then((dxml) => {
                    Zhong.radicals =[];

                    dxml.querySelectorAll('entry')
                    .forEach(valu=>{
                        let	idn =parseInt(valu.getAttribute('n'));
                        let ent ={radical:	valu.getAttribute('rad'),
                                r:		parseInt(valu.getAttribute('r')),
                                n:		idn,
                                alt:	valu.getAttribute('alt')};

                        Zhong.radicals[idn-1] =(Zhong.radicals[idn-1] || []).concat([ent]);
                    });
                }
            );
        return _strokes;
    }//end setGlyphs

    static glyphRootNodeEx(glyf){
        return Zhong.strokes.querySelector('w[zi="'+glyf+'"]');
    }//end glyphRootNodeEx

    static pageOn(src, limitcount =100, isRadical =false){
        var hn =0, tiles =[];
        for(var i=0, w=0, prv=0	//stroke count
          ; src.length && ((hn =parseInt(src[0].getAttribute ? src[0].getAttribute('n') :src[0].n) || 0) ===prv
             || w <= limitcount)
          ; i++, w++){

            try{
            let	$src =src[0];
            //hn =parseInt(isRadical ? src[0].n : $src.getAttribute('n')) || 0;
            if(hn > prv){
                tiles[hn] =[];
                prv = hn;
            }
            if(isRadical){	//radicals
                if((src[0].alt || '0') ==='0')
                    tiles[hn].push(src[0].radical +(src[0].r-1));
                else
                    tiles[hn].unshift(src[0].radical +'~' +(src[0].r-1));
            }
            else if($src.cached){
                tiles[hn].push(...$src.cached);
                let jz =src.indexOf($src.parentNode.querySelectors('[n="'+hn+'"]').pop());
                if(jz >0){
                    src.splice(0, jz);
                    i += jz;
                }
            }
            else if($src.zi || $src.getAttribute('zi')){
                var	a =parseInt($src.zi || $src.getAttribute('zi')),
                    z =parseInt(($src.getAttribute ? $src.getAttribute('uend') : $src.uend) || a),
                    simpl =($src.getAttribute ? $src.getAttribute('alt') :$src.alt) ? '~':'';

                if(isNaN(a)){
                    if(simpl)
                        tiles[hn].unshift(($src.zi || $src.getAttribute('zi')) +simpl);
                    else tiles[hn].push(($src.zi || $src.getAttribute('zi')) +simpl);
                }
                else if(z-a){
                        let lbl =[];
                        for(; a <= z; a++)
                            lbl.push(unescape('%u'+a.toString(16)) +simpl);
                        $src.cached =lbl;
                        tiles[hn].push(...lbl);
                        w += (lbl.length -1);
                }
                else if(simpl)
                    tiles[hn].unshift(unescape('%u'+a.toString(16)) +simpl);
                else tiles[hn].push(unescape('%u'+a.toString(16)) +simpl);
            }
            src.shift();
            }
            catch(err){
                console.log(err);
            }
        }//loop strokes
        if(src.length ===0) tiles.push("stop");

        return tiles;
    }//end pageOn

    static querySelectorAll(selector){
        if(typeof(selector) !== "string") return selector;
        else if(!Zhong.__selectorCached[selector]){
            let dup=Array.from(Zhong.strokes.querySelectorAll(selector));
            if(dup){
                Zhong.__selectorCached[selector] =dup
                    .map(v=>{
                        let wo={};
                        for(let prop of v.attributes)
                            wo[prop.name] =prop.value;
                        return wo;
                    });
            }
        }
        return Zhong.__selectorCached[selector];
    }

    static async rxPinyin(){
        fetch(xmroot +'xml/fonal.json'
            ,(data)=>{
                if(data.ok)
                    Zhong.fonal=data.json();
                else
                    throw new Error(data.statusText);
            })
            .catch(err=>{
                console.log(err);
            });
        return Zhong.fonal;
    }

    static async embellish(){
        let hots =[];
        await Promise.all([
            fetch(xmroot +'xml/fonal.json').then(datx =>datx.json()),
            fetch(xmroot +'xml/ligan.json').then(datx =>datx.json())
        ])
        .then(([data, dataj])=>{
            Zhong.fonal =data;
            hots =dataj;
        })
        .catch(err=>console.log(err));
        return hots;
    }

    static tally(c){
        //window.dispatchEvent;
        window.onchange(new Event("change", {data:c}), c);
    }

    async rxBellish(){
        let dataj =await Zhong.ligans;
        for(let k in dataj){
            if(dataj[k] >-9999)
                dataj[k] = this._hots[k] || dataj[k];
        }
        this._hots =Object.assign(this._hots, dataj);
    }//end rxBellish

    async rx(refresh =false){
        if(refresh);
        else if(Object.keys(this._hots).length) return;
        Zhong.strokes =await Zhong.strokes;

        if(refresh)
            this._hots ={};
        else{
            await fetch(xmroot +'xml/_hots.json')
            .then(response=>response.json())
            .then(json=>{
                this._hots=json;
                this.hots2prio();
                })
            .catch(err=>{
                console.log("cannot read _hots.json.");
                this._hots={};
            });
        }

        if(Object.keys(this._hots).length ===0){
            let rhead =new Headers({"Content-Type":"text/plain;charset=UTF-8"});
            let xmpath =window.__options.context.permitRemote ? xmremote : xmroot;

            let whilst =Promise.all([
                fetch(xmpath +'xml/omnibus-001.shu', rhead).then(datx =>datx.text()).catch(err=>""),
                fetch(xmpath +'xml/omnibus-002.shu', rhead).then(datx =>datx.text()).catch(err=>""),
                fetch(xmpath +'xml/omnibus-003.shu', rhead).then(datx =>datx.text()).catch(err=>""),
                fetch(xmpath +'xml/omnibus-004.shu', rhead).then(datx =>datx.text()).catch(err=>""),
                fetch(xmpath +'xml/omnibus.shu', rhead).then(datx =>{
                    return datx.text()
                }),
                fetch(xmpath +'xml/皓镧传.shu', rhead).then(datx =>datx.text()),
                fetch(xmpath +'xml/魏璎珞.jung', rhead).then(datx =>datx.text()),
                fetch(xmpath +'xml/将夜.jung', rhead).then(datx =>datx.text())
                ]
            ).then((dats)=>{
                let $serials ='';
                for(let dat of dats)
                    this.piroritise(null, dat, 0);
    //                $serials += dat;
    //            this.munchPrioti(null, $serials, 0);
            })
            .catch(err=>{
                console.log(['did not rx...', err]);
            });
            await whilst;
        }
        this.rxBellish();
        this.fromStorage();
        await this.shelves();

        console.log('Zhong ready.')
        return this.prio;
    }//end rx

    munchPrioti(evt, $feed, demux){
        if(demux ===void 0)	demux =this.firstly;

        var dat =Zhong.textOf($feed).split(/[\r\n\t ,\.?;\(\)“”%$#@&!*`-。‘’“”]+/gu),	//《》
            nset =demux ? {} : this._hots;

        dat =dat.join('').split('');

        for(var i=dat.length-1, rgxIgnore =/[　!！0-9a-z:;，,\.\-\+~{\(\[（）\]\)}'"《》]/i; i >=0; i--){
            var glyph =dat[i];
            if(rgxIgnore.test(glyph) || (demux && this._hots[glyph])) continue;

            if(!nset[glyph] || nset[glyph] > -999){
                var k = nset[glyph] = (nset[glyph] || 0) +1;
                if(k<1) nset[glyph] =1;	//increment ligan from zero, not negative.
            }

        }//end loop
        if(demux)
            Object.assign( this._hots, nset );
        else
            this._hots =nset;

        this.hots2prio();
    }//end munchPrioti

    piroritise(evt, feed, demux){
        if(demux ===void 0)	demux =this.firstly;

        let dat =Zhong.textZhong(feed),
            nset =demux ? {} : this._hots;

        for(let len =dat.length; len > 0; len =dat.length){
            try{
                var c =dat.firstchar;    //UTF-16 are length 2
                if(c.length ===0) throw 'zeroed';
                dat =dat.replace(new RegExp(c,'gu'), '');
                nset[c] =(nset[c] || 0) +(len -dat.length)/c.length;
            }
            catch(err){
                console.log(err);
            }
        }
        if(demux)
            Object.assign( this._hots, nset );
        else
            this._hots =nset;

        this.hots2prio();
    }
    
    hots2prio(){
        this.prio =[];
        for( var glif in this._hots )
            if( this._hots.hasOwnProperty(glif)){
                var r =this._hots[glif];
                this.prio[r] =(this.prio[r] || []);
                this.prio[r].push(glif);
            }
        //end loop
    }

    iGlyph(g){
        let nod =Zhong.glyphRootNodeEx(g);
        if(nod /*&& nod.parentNode*/){
            let k =document.evaluate('count(./preceding-sibling::*)+1', nod.parentNode, null, XPathResult.ANY_TYPE, null).numberValue -1;
            return k;
        }
        return -1;
    }

    async fromStorage(){
        if(window.__options.context.localStorageMemory){
            let whilst =new Promise((resolve)=>{
                chrome.storage.local.get(null, (gets)=>{
                    //console.log(gets);
                    this._hots =Object.assign(this._hots, gets);
                    resolve();
                });
            });
            await whilst;

        }
        else{
            chrome.storage.local.clear();
            console.log('storage.local cleared');
        }
    }

    async shelves(threshold =3){
        if(!Zhong.strokes || this.qu.length){
            console.log({pantry:this.qu, xs:Zhong.strokes});
            return this.qu || [];
        }

        let m =230, qu =[];
        for(let j of Object.keys(this.prio).sort((l,r)=>r-l)){
            qu =qu.concat(this.prio[j]);
            if(j <threshold || --m ===0) break;
        }//end loop
        this.qu =[];
        qu.forEach((g,i)=>{
            let nod =Zhong.glyphRootNodeEx(g), k, radic;
            if(!nod){
                console.log(g);
                return;
            }
            else if( !(k =Zhong.rootseq[radic =nod.parentNode.getAttribute("radical")]) ){
                k =document.evaluate('count(./preceding-sibling::*)+1', nod.parentNode, null, XPathResult.ANY_TYPE, null).numberValue -1;
                Zhong.rootseq[radic] =k;
            }
            this.qu[k] =(this.qu[k] || [peekcount]);
            this.qu[k].push(g);
        });

        for(let rad in this.qu){
            this.qu[rad][0] =Math.min(this.qu[rad][0], this.qu[rad].length-1);
        };
        console.log('stockings');
        return this.qu;
    }//end shelves

    shelfLengths(kary){
        let lens ={};
        kary.forEach(k=>{
            if(this.qu[k]) lens[k] =this.qu[k].length;
        });
        return lens;
    }

    onshelf(kary){
        let shelves ={};
        kary.forEach(k=>{
            if(this.qu[k]) shelves[k] = this.qu[k];
        });
        return shelves;
    }


    shelfup(radical, threshold =3){
        let nod =Zhong.strokes.querySelector('[radical="'+radical+'"]');
        if(!nod){
            try{
                let realrad =Zhong.radicals.reduce((incur, curr)=>{
                        if(incur.length ===0)
                            return curr.filter(x=>x.radical.indexOf(radical) >=0);
                        else
                            return incur;
                    }, []);
                nod =Zhong.strokes.querySelector('entry:nth-child('+realrad[0].r+')');
            }
            catch{
                throw [radical, "not found"];
            }
        }
        if(nod){
            let k =Zhong.rootseq[nod.getAttribute('radical')] || document.evaluate('count(./preceding-sibling::*)+1', nod, null, XPathResult.ANY_TYPE, null).numberValue -1;
            if(!this.qu[k] || this.qu[k].length <=1){
                let qu =[], r;
                Array.from(nod.children)
                    .forEach(w=>{
                        let zi =w.getAttribute("zi");
                        if((r =this._hots[zi]) >= threshold || r < -9999){
                            qu.push({zi: zi, r:r});
                        }
                    });
                this.qu[k] =qu.sort((l,r)=>r.r -l.r).map(x=>x.zi);
                this.qu[k].unshift(Math.min(qu.length, peekmax));
            }
            return this.qu[k];
        }
        else
            return;
    }//end shelfup


    async rank(glyphs, radical, threshold =3){
        (glyphs.match(/([^\n\r ,\.\-;])/g) || []).forEach((glyph,i)=>{
            if(!this._hots[glyph] || this._hots[glyph] > -999){
                let k = this._hots[glyph] = (this._hots[glyph] || 0) +1;

                this.prio[k] =(this.prio[k] || []);
                this.prio[k].push(glyph);

                switch(k-1){
                case 0:
                    break;
                default:
                    // remove lesser priorize
                    if(this.prio[k-1]){
                        this.prio[k-1] =this.prio[k-1].filter(c => c !== glyph);
                    }

                }//end switch

                let rn;
                try{
                    let radic =radical || Zhong.glyphRootNodeEx(glyph).parentNode;

                    if(!radic
                      || (rn =radic.r ? radic.r : document.evaluate('count(./preceding-sibling::*)+1', radic, null, XPathResult.ANY_TYPE, null).numberValue) ===0);
                    else if((this.qu[rn-1] =(this.qu[rn-1] || [0])) && k < threshold)
                        this.qu[rn-1].push(glyph);
                    else{
                        let i=this.qu[rn-1].indexOf(glyph);
                        switch(Math.min(i, this.qu[rn-1][0])){
                        case this.qu[rn-1][0]:
                            this.qu[rn-1].splice(i, 1);
                        case -1:
                            break;
                        default:
                            return;
                        }
                        this.qu[rn-1].splice(Math.min(12, this.qu[rn-1].length-1, this.qu[rn-1][0]++) || 1,0,glyph);
                    }
                }
                catch(er){
                    console.log([glyph,er]);
                }
                finally{
                    if(this.qu[rn-1][0] <peekcount)
                        this.qu[rn-1][0] =this.qu[rn-1].length -1;
                    Zhong.tally(glyph);
                }
            }//if
        });
    }//end rank

    async imposeThumbs(jdata){
        console.log('imposer');
        for(let glyf in this.qu){
            jdata[glyf] = jdata[glyf] || this.qu[glyf];
        }
        this.qu =jdata;
    }//end imposeThumb

    hottops(k=200){
        return Object.keys(this._hots).sort((x,y) => this._hots[y] - this._hots[x]).slice(0,k);
    }//end hottops

    hotlines(k=200, limitLength=60){
        let regux =new RegExp('(.{1,' +limitLength+ '})','sug');
        return this.hottops(k).join('').match(regux).join('\n');
    }//end hotlines

    hotmeter(ln){
        var glyphs =ln.match(/[^ 　!！0-9a-z:;，,\.\-\+~{\(\[（）\]\)}]/ig),
            hits =[];
        for(let g of glyphs){
            if(this._hots[g]) hits.push(this._hots[g]);
        }
        return hits.sort((L,R)=> (L<0 ? R-L:L-R) )[0];	//give ligans precedence
    }//end hotmeter

    get radicals(){
        return Zhong.radicals;
    }
    get strokes(){
        return Zhong.strokes;
    }
    get hots(){
        return this._hots;
    }
    get pinheads(){
        return this.qu;
    }
}//end Zhong
