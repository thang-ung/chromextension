//export 
class zhoChat{
    constructor(){
    }

    async send(msg){
        let whilst =new Promise(
            (resolve) =>{
                try{
                    chrome.runtime.sendMessage(msg,
                    (response)=>{
                        if(msg.type==="strokes"){
                            let xmparse =new DOMParser();
                            msg.response= xmparse.parseFromString(response,"text/xml").documentElement;

                        }
                        else
                            msg.response = response;
                        resolve();
                    });
                }
                catch(err){
                    resolve();
                    console.log([msg, err]);
                }
            });
        await whilst;
        return msg.response;
    }

    get radicals(){
        return this.send({type:"radicals"});
    }

    get strokes(){
        return this.send({type:"strokes"});
    }

    get qu(){
        return this.send({type:"qu"});
    }

    get hots(){
        return this.send({type:"hots"});
    }

    setQu(json){
        return this.send({type:"qu", qu: json});
    }

    querySelectorAll(selector){
        return this.send({type:"querySelectorAll",selector:selector});
    }

    pageOn(src,limitcount,isRadical){
        return this.send({type:"page", src: src, limitcount: limitcount, isRadical: isRadical});
    }

    rx(force){
        return this.send({type:"rx", force:force});
    }
    rank(glyph, $radical){
        return this.send({type:"rank", glyph: glyph, radical: $radical});
    }
    shelfup(radical){
        return this.send({type:"shelfup", radical: radical});
    }


    shelves(){
        this.send({type:"shelves"});
        return;
    }
    glyphRootNode(c){
        return this.send({type:"glyphRootNode", glyf:c});
    }


    hottops(n){
        return this.send({type:"hottops", k:n});
    }

    async hotlines(n, width){
        let regux =new RegExp('(.{1,' +width+ '})','sug')
            , tops =await this.hottops(n);

        return tops.join('').match(regux).join('\n');
    }

}