//import {ellipsor} from "./ellipser";

const __editables =['[contenteditable="true"]', 'input','textarea','#text'];
//export
const parakeys ={
    "sp":" ", "¶":"\n"
    //,"’ ƒ":new RegExp("‘$1’"), "” ƒ":new RegExp("“$1”")
    ,"’ ƒ":/‘$1’/, "” ƒ":/“$1”/
    ,"ghoul": (wo)=>{ let title ='Toggle\nunvisited';
        return $('<img src={ghost} alt="●" class="simpel" />')
                .on("click", (evt)=>{
                        if(wo && wo.toggle)
                            wo.toggle("hidden");
                        else{
                            let root =$(evt.target).parents('#parakeys')[0].parentNode,
                                booltrad =root.matches(".traditional");
                            let elip =root.querySelector('.ellipser');
                            if(!booltrad && ['simpel','hidden'].filter(c=>elip.classList.contains(c)).join('') ==='simpel'){
                                elip.classList.remove('simpel');
                                evt.target.parentNode.parentNode.classList.remove("simpel");
                            }
                            else if(!elip.classList.toggle('hidden') && !booltrad){
                                elip.classList.add('simpel');
                                evt.target.parentNode.parentNode.classList.add("simpel");
                            }
                        }
                    })
                .attr({"src" :chrome.runtime.getURL("/images/ghoul.png"),
                    "data-title-left" :title})
                .css({"max-width" :"1.28em"})[0];

        }

    ,"draghand": $('<img alt="●" class="dumb" data-title="drag\nhandle"/>')
                .attr("src", chrome.runtime.getURL("/images/mikih.png"))[0]
    ,"focus": (content)=>{ let title ='Output target\nLockdown';
            let fn= ()=>{
                    if(event.target.classList.toggle("active")){
                        let sr =window.getSelection(),
                            target =sr.focusNode,
                            focus =target;
                        if(__editables.indexOf(target.nodeName) >=1) target =target.parentNode;
                        target.classList.toggle("meiolocker");
                        //let cmpu =window.getComputedStyle(target);
                        let cmpu =target.getBoundingClientRect();
                        if(parseInt(cmpu.left) <= 0) target.classList.add("aftr");

                        let booltest =focus.matches && !focus.matches(__editables.join(','));
                        return {"type":'focus'
                            ,"focus": booltest
                                ? focus.querySelector(__editables.join(',')) : focus
                            ,"tagged": target
                            ,"range": sr.getRangeAt(0)
                            ,"wo": event.target};
                    }
                    else{
                        let ele =document.querySelector(".meiolocker");
                        if(ele) ele.classList.remove("meiolocker");
                        return {type:'focus'};
                    }
                };
        return $("<div id='meiolocker' class='jump'/>").text("●")
        .data({"mousedown" :fn})
        .attr({"data-title-left" :title})[0];
    }

    ,"灭 ƒ": ()=>{ let title ='List top\ncommon\nglyphs';
        let fn =(wo, dest)=>{
            if(wo && wo instanceof zhoChat){
                let lnwidth =20;
                if(dest instanceof Selection && dest.baseNode){
                    let $dest =$(dest.baseNode.nodeName==="#text" ? dest.baseNode.parentNode : dest.baseNode);
                    let fosz =parseInt($dest.css('font-size'))
                        ,w =$dest.parent().width();
                        lnwidth =parseInt(1.4*w/fosz) || lnwidth;
                    console.log(lnwidth);
                    return wo.hotlines(300,lnwidth);
                }
                else return wo;
            }
        }
        return $("<div class='jump'/>").text("灭 ƒ")
            .data({"mousedown" :fn})
            .attr({"data-title-left" :title})[0];
    }

    ,"∞ƒ": (context)=>{ let title ='Recalibrate';
            return $('<img  alt="●">')
                    .attr({"data-title-left" :title,
                        "src" :chrome.runtime.getURL("/images/compass-je.png")})
                    .css({"max-width":"1.28em"})
                    .on('click', (evt, wo)=>{
                        if(context && context instanceof zhoChat)
                            return context.rx(true);
                    })[0];
        }
    ,"拇ƒ": ()=>{ let title ='Thumbs\ndata';
        let fn=async (wo)=>{
            if(wo && wo instanceof zhoChat){
                let $postee =window.getSelection()
                    , srtxt=$postee.toString();
                let inputln =srtxt.replace(/[\r\n ]+$/g, "");

                if(inputln.length >0){
                    try{
                        wo.setQu(JSON.parse(inputln));
                        $postee.deleteFromDocument();
                    }
                    catch(e){
                        wo.rank(inputln);
                        console.log(e);
                    }
                    return '';
                }
                else
                    return JSON.stringify(await wo.qu);
            }
        };

        return $('<div class="jump"/>').text("拇ƒ")
            .data({"mousedown" :fn})
            .attr({"data-title-left" :title})[0];
        }

    // ,"histscro": $('<input type="checkbox" data-title="Enable\nscroll history"/>')
    //         .prop('checked',1)[0]
    // ,"trackpad": $('<input type="checkbox" value="-1" data-title="Navigate by\ntrackpad gesture\ndirection"/>')[0]
    // ,"invertShiftScro": $('<input type="checkbox" data-title-left="invert shift+scroll\ndrilldown"/>')
    //         .prop('checked',1)[0]
    // ,"fastscro": $('<input type="checkbox" data-title-left="Enable scroll\nno delays"/>')[0]

    // ,"ellip": ellipsor.autocheck
};
