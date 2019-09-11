//import {elevate} from "./utils.js"
/*
requirejs.config({
    //			enforceDefine: true,
                paths:{
                    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min'
                    ,jqueryui: 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min'
                }
            });
module.exports = {
    //...
    externals: {
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min'
    }
    };
*/
//var XMLParser = require('react-xml-parser');
//var XMLParser = require('xmldom-qsa').DOMParser;
const peekcount =27, peekmax =33;
const xmroot =chrome.runtime.getURL("/");

export class Zhong{
    static __selectorCached ={};
    constructor(){
        console.log([xmroot]);
        this._hots ={};
        this.className ={};

        Zhong.setGlyphs();
        Zhong.rxBellish(this);
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

    static setGlyphs(refresh =false){
        if(refresh);
        else if(Zhong.radicals && Zhong.radicals.length) return;
        let xmparse =new DOMParser();

        fetch(xmroot +'xml/jungpk-x.xml')
            .then(response => response.text())
            .then(response => xmparse.parseFromString(response,"text/xml"))
            .then((dxml) => {
                    Zhong.strokes =dxml.documentElement;
/*					let xpand =zhong.strokes.querySelectorAll('w:not([uend])');
                    xpand.forEach((stro,i)=>{
                        let	a =parseInt(stro.getAttribute('zi'));
                        if(!isNaN(a))
                            stro.setAttribute('zi', unescape('%u'+a.toString(16)));
                    });
*/
                    let xpand =Zhong.strokes.querySelectorAll('w[uend]');
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

                    Array.from(dxml.querySelectorAll('entry'))
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
                tiles[hn].push(src[0].radical +((src[0].alt || '0') ==='0' ? '':'~') +(src[0].r-1));
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

                if(isNaN(a))
                    tiles[hn].push(($src.zi || $src.getAttribute('zi')) +simpl);
                else if(z-a){
                        let lbl =[];
                        for(; a <= z; a++)
                            lbl.push(unescape('%u'+a.toString(16)) +simpl);
                        $src.cached =lbl;
                        tiles[hn].push(...lbl);
                        w += (lbl.length -1);
                }
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

    static rxBellish(wo){
        wo = wo || this;
        Promise.all([
            fetch(xmroot +'xml/fonal.json').then(datx =>datx.json()),
            fetch(xmroot +'xml/ligan.json').then(datx =>datx.json())
        ])
        .then(([data, dataj])=>{
            Zhong.fonal =data;
            for(let k in dataj){
                if(dataj[k] >-9999)
                    dataj[k] = wo._hots[k] || dataj[k];
            }
            wo._hots =Object.assign(wo._hots, dataj);
        })
        .catch(err=>console.log(err));
    }//end rxBellish

    async rx(refresh =false){
        if(refresh);
        else if(Object.keys(this._hots).length) return;

        await fetch(xmroot +'xml/_hots.json')
        .then(response=>response.json())
        .then(json=>{
            this._hots=json;
            this.hots2prio();
            })
        .catch(err=>{
            this._hots={};
        });

        if(Object.keys(this._hots).length ===0){
            let rhead =new Headers({"Content-Type":"text/plain;charset=UTF-8"});
            let whilst =Promise.all([
                fetch(xmroot +'xml/omnibus-001.shu', rhead).then(datx =>datx.text()),
                fetch(xmroot +'xml/omnibus-002.shu', rhead).then(datx =>datx.text()),
                fetch(xmroot +'xml/omnibus-003.shu', rhead).then(datx =>datx.text()),
                fetch(xmroot +'xml/omnibus.shu', rhead).then(datx =>{
                    return datx.text()
                }),
                fetch(xmroot +'xml/皓镧传.shu', rhead).then(datx =>datx.text()),
                fetch(xmroot +'xml/魏璎珞.jung', rhead).then(datx =>datx.text()),
                fetch(xmroot +'xml/将夜.jung', rhead).then(datx =>datx.text())
                ]
            ).then((dats)=>{
                let $serials ='';
                for(let dat of dats)
                    this.munchPrioti(null, dat, 0);
    //                $serials += dat;
    //            this.munchPrioti(null, $serials, 0);
            })
            .catch(err=>{
                console.log(['did not rx...', err]);
            });
            await whilst;
        }
        await this.shelves();

        console.log('Zhong ready.')
        return this.prio;
    }//end rx

    munchPrioti(evt, $feed, demux){
        if(typeof demux ==='undefined')	demux =this.firstly;

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

    async shelves(threshold =3){
        if(!Zhong.strokes || !this.prio){
            return this.qu || [];
        }

        let m =230, qu =[];
        for(let j of Object.keys(this.prio).sort((l,r)=>r-l)){
            qu =qu.concat(this.prio[j]);
            if(j <threshold || --m ===0) break;
        }//end loop
        this.qu ={};
        qu.forEach((g,i)=>{
            let nod =Zhong.glyphRootNodeEx(g);
            if(nod){
                let k =document.evaluate('count(./preceding-sibling::*)+1', nod.parentNode, null, XPathResult.ANY_TYPE, null).numberValue -1;

                this.qu[k] =(this.qu[k] || [peekcount]);
                this.qu[k].push(g);
            }
            else console.log(g);
        });

        for(let rad in this.qu){
            this.qu[rad][0] =Math.min(this.qu[rad][0], this.qu[rad].length-1);
        };
        return this.qu;
    }//end shelves

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
            let k =document.evaluate('count(./preceding-sibling::*)+1', nod, null, XPathResult.ANY_TYPE, null).numberValue -1;
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


    async rank(glyphs, $radical, threshold =3){
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
                    this.prio[k-1] =this.prio[k-1].filter(c => c !== glyph);

                }//end switch

                try{
                    let radic =$radical || Zhong.glyphRootNodeEx(glyph).parentNode;

                    let rn;
                    if(!radic || radic.length ===0
                      || (rn =radic.r ? radic.r : document.evaluate('count(./preceding-sibling::*)+1', radic[0], null, XPathResult.ANY_TYPE, null).numberValue) ===0);
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
                    console.log('.'+glyph+'.');
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
