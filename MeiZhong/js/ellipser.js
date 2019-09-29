//export
class ellipsor{
    constructor(){}

    static get autocheck(){
        return elemental.create("input",{"type":"checkbox", "id":"eclipsor","data-title":"Enable auto\nCollapse"});
    }

    static stopPropagation(event){
        event.returnValue =false;
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}//end ellipsor
