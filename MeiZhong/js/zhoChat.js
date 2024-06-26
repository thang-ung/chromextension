//export 
class zhoChat extends dedupmei{
    constructor(){
        super();
    }

    get radicals(){
        return zhoChat.send({type:"radicals"});
    }

    get strokes(){
        return zhoChat.send({type:"strokes"});
    }

    get qu(){
        return zhoChat.send({type:"qu"});
    }

    get hots(){
        return zhoChat.send({type:"hots"});
    }

    setQu(json){
        return zhoChat.send({type:"qu", qu: json});
    }

    querySelectorAll(selector){
        return zhoChat.send({type:"querySelectorAll",selector:selector});
    }

    pageOn(src,limitcount,isRadical){
        return zhoChat.send({type:"page", src: src, limitcount: limitcount, isRadical: isRadical});
    }

    rx(force){
        return zhoChat.send({type:"rx", "force":force});
    }
    rank(glyph, $radical){
        return zhoChat.send({type:"rank", glyph: glyph, "radical": $radical && $radical.length ? $radical[0] : $radical});
    }
    shelfup(radical){
        return zhoChat.send({type:"shelfup", radical: radical});
    }
    onshelf(indices){
        return zhoChat.send({type:"onshelf","indices":indices});
    }


    shelves(){
        zhoChat.send({type:"shelves"});
        return;
    }
    shelfLengths(indices){
        return zhoChat.send({type:"shelfLengths","indices":indices});
    }
    glyphRootNode(c){
        return zhoChat.send({type:"glyphRootNode", glyf:c});
    }


    hottops(n){
        return zhoChat.send({type:"hottops", k:n});
    }

    async hotlines(n, width){
        let regux =new RegExp('(.{1,' +width+ '})','sug')
            , tops =await this.hottops(n);

        return tops.join('').match(regux).join('\n');
    }

}