class flexbug{
        static async resizeFlexColumn(flexCol){
            let anchor =flexCol.childNodes.lastVisible,
                style =window.getComputedStyle(flexCol),
                pads =parseInt(style.getPropertyValue('padding-left') ||'0')
                         +parseInt(style.getPropertyValue('padding-right') ||'0');
            if(anchor){
                let ileft =anchor.offsetLeft ,
                    iri =flexCol.offsetLeft;

                if(style.getPropertyValue('direction') =='rtl')
                    flexCol.style.css({'width': (pads +anchor.offsetWidth + Math.abs(iri -ileft))+'px'});
                else
                    flexCol.style.css({'width': (pads +flexCol.offsetWidth +Math.abs(iri -ileft))+'px'});
            }
        }//end resizeFlexColumn

}//end flexbug