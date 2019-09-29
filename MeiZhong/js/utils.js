class elementary{

static create(tag, attributes ={}){
    var ele =document.createElement(tag);
    if(Array.isArray(attributes))
        ele.attr(...attributes);
    else if(Object.keys(attributes).length)
        ele.attr(attributes);

    return ele;
}

}//end class

//export
function axorray(L,R){

    let xor =L.slice(0)
        ,acum ={};
    xor.push(...R)
    xor.forEach(v=>{
        if(acum[v])
            acum[v]++;
        else
            acum[v]=1;
    });
    xor =[];
    for(let k in acum){
        if(acum[k]===1) xor.push(k);
    }

    return xor;
}

//export
async function elevate(io){
    io =await io;
    if(!io) return io;
    var	va=[];
    for(var i=0,k=io.length; i<k; i++){
        va =va.concat(io[i]);
    }
    return va;
}


if(!Array.prototype.any){ //use Array.prototype.find(...)
    Object.defineProperty(Array.prototype, "any", {
        enumerable: false,
        value: function(fn){
            let vout;
            for(let v of this){
                if(vout =fn(v)) return vout; //return can remap
            }
            return false;
        }
    });
}

if(!CSSStyleDeclaration.prototype.css){
    Object.defineProperty(CSSStyleDeclaration.prototype,"css"
        ,{ enumerable: false,
         value: function(props){
                if(typeof(props) ==='string'){
                    return this.getPropertyValue(props);
                }
                else
                    for(let prop in props){
                        if(props[prop] && props[prop].length)
                            this.setProperty(prop, props[prop]);
                        else
                            this.removeProperty(prop);
                    }//end loop
             }
        });
}

if(!Node.prototype.offsets){
    Object.defineProperty(Node.prototype,"offsets"
        ,{ enumerable: false,
         value: function(rootNode =document.body, inode={}){
                 let nodes=[], xy ={top:0, left:0};
                if(inode.x && inode.y){
                    nodes =document.elementsFromPoint(inode.x,inode.y);
                    //remove non-offsetParent...
                }
                else{
                    inode =this;
                    while(nodes.push(inode))
                        if( inode ===rootNode
                         || !(inode =inode.offsetParent)) break;
                }

                for(let node of nodes){
                    if(node ===rootNode) break;
                    xy.top += node.offsetTop;
                    xy.left += node.offsetLeft;
                }

                return xy;
             }
        });
}

if(!Node.prototype.attr){
    Object.defineProperty(Node.prototype,"attr"
        ,{ enumerable: false,
        // attributies := [key:string, value:string|object:Object], ...n[key:string, value:string|object:Object]
         value: function(...attributes){
                let undef, keyed =null;
                let attrs =attributes.reduce((packed, val, idx)=>{
                    if( keyed ){
                        packed[keyed] =val;
                        keyed =null;
                    }
                    else if( typeof(val) ==="string" )
                        keyed =val;
                    else if( typeof(val) ==="object" )
                        Object.assign(packed, val);
                    return packed;
                }, {});

                for(let name in attrs){
                    if(name ==="children"){
                        let children =document.createDocumentFragment();
                        try{
                            let ary =Array.isArray(attrs[name]) ? attrs[name] :[attrs[name]];
                            for(let e of ary){
                                children.appendChild(e);
                            }
                        }
                        finally{
                            this.appendChild(children);
                        }
                    }

                    else if(name ==="textChild")
                        this.textChild =attrs[name];
                    else if(attrs[name] instanceof RegExp || typeof(attrs[name]) ==='function')
                        this.fn(name, attrs[name]);
                    else if(attrs[name] && attrs[name].toString().length !==0)
                        this.setAttribute(name, attrs[name]);
                    else
                        this.removeAttribute(name);
                }
                return this;
             }
        });
}

//alternative to $.data
if(!Node.prototype.fn){
    Object.defineProperty(Node.prototype,"fn"
        ,{ enumerable: false,
         value: function(name, fn){
                if(fn){
                    let nfn ={};
                    nfn[name] =fn;
                    this._fn = Object.assign(this._fn || {}, nfn);
                }
                else if(fn ===void 0)
                    return (this._fn || {})[name] || this.getAttribute(name);
                else if(name){
                    delete (this._fn =(this._fn || {}))[name];
                }
                else{   //all
                    delete this._fn;
                }
                return this;
             }
        });
}

//var eventrefs ={};  //likely bad idea

if(!Element.prototype.oneve){
    Object.defineProperty(Element.prototype,"oneve"
        ,{ enumerable: false,
         value: function(eventName, fn){
                this.addEventListener(eventName, fn);
                if(fn.name){
                    this.fn(fn.name,fn); //save
                }
                return this;
             }
        });
}

if(!Element.prototype.offeve){
    Object.defineProperty(Element.prototype,"offeve"
        ,{ enumerable: false,
         value: function(eventName, fn){
                let recall =this.fn(fn.name ||fn)
                if(recall){
                    this.removeEventListener(eventName, recall);
                    this.fn(fn.name || fn, null);
                }
                else
                    console.log(['err -not found',"offeve", fn.name || fn]);

                return this;
             }
        });
}

if(!Element.prototype.textChild){
    Object.defineProperty(Element.prototype,"textChild"
        ,{ enumerable: false,
         //get: function(){return this.textContent;},
         set: function(text){
             if(typeof(text) == "string"){
                this.innerHTML ="";
                this.append(document.createTextNode(text));
            }
        }
    });
}


if(!HTMLElement.prototype.replace){
    Object.defineProperty(Node.prototype,"replace"
        ,{ enumerable: false,
         value: function(...elements){
             elements.forEach(
                    ele=>{
                        this.insertAdjacentElement("beforebegin", ele);
                    });
            this.remove();
        }
    });
}

if(!NodeList.prototype.lastVisible){
    Object.defineProperty(NodeList.prototype,"lastVisible"
        ,{ enumerable: false,
         get(){
            for(let n =this.length-1; n>=0; n--){
                let style =window.getComputedStyle(this.item(n));
                if(style.display !=='none') return this.item(n);
            }
            return;
            }
        });
}

if(!String.prototype.firstchar){
    Object.defineProperty(String.prototype,"firstchar"
        ,{ enumerable: false,
         get: function(){
             if(this.length)
                 return this.match(/^./u)[0];
             else
                return "";
        }
    });
}
if(!String.prototype.utfAt){
    Object.defineProperty(String.prototype,"utfAt"
        ,{ enumerable: false,
         value: function(n){
            if(this.length > n)
                try{
                    return this.match(new RegExp('^.{'+n+'}(.)', 'u'))[1];
                }catch{}

            return "";
        }
    });
}


//export
function ints(o){
    let ret ={}
    for(let k in o){
        if(typeof(o[k])==="number" || parseInt(o[k]))
            ret[k] =o[k];
    }
    return ret;
}

//export ints;
