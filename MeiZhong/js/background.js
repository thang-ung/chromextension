/*
 MeiZhong - A Chinese visual Pop-up entry pad
 Copyright (C) 2019 thang van ung


 ---

 This program is free software; you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation; either version 2 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

 ---

 Please do not change or remove any of the copyrights or links to web pages
 when modifying any of the files.
 */

'use strict';

import {Zhong} from "../js/czhong.js";


let isActivated = false;
chrome.storage.sync.set({"active": isActivated});

chrome.browserAction.getBadgeText({}, (result)=>{ //extensions mgr retains badge text between on/off
    if(result){
        togglesSuspend({id:-1});
    }
});


const __configDefault ={
     "showSimplify": true
    ,"busyPage": true
    ,"localStorageMemory": false
    ,"ontoStorage": "." //default saves per glyph
    ,"permitRemote": false
    };

let ctex;

let __options = window.__options = {
    context: Object.assign(__configDefault, JSON.parse(localStorage['context'] || '{}')),
};

function resume(tabId){
    if(!ctex){
         ctex =new Zhong();
         ctex.clients ={};
    }

    chrome.runtime.onConnect.addListener(inf=>inf); //required listen

    chrome.browserAction.setBadgeBackgroundColor({'color': [0, 128, 200, 255]});
    chrome.browserAction.setBadgeText({'text': 'On'});
    chrome.storage.sync.set({"active": isActivated =true});
}

function suspend() {
    chrome.storage.sync.set({"active": isActivated =false});

    ctex = void 0;

    chrome.browserAction.setBadgeBackgroundColor({'color': [0, 0, 0, 0]});
    chrome.browserAction.setBadgeText({'text': ''});

    chrome.contextMenus.removeAll();
    isActivated = false;
}

function togglesSuspend(currentTab){
    if(isActivated){
        suspend();
    }
    else{
        resume(currentTab.id);
    }
}

function iscount(o, zeroalt=0) {
    return Object.values(o).filter(x=>x).length || zeroalt;
}

chrome.browserAction.onClicked.addListener(togglesSuspend);

// chrome.tabs.onActivated.addListener(inf => ...(inf.tabId));
// chrome.tabs.onUpdated.addListener((TID, inf)=>{
//     if(inf.status === 'complete')  ...(TID);
// });
function tally(c){
    if(__options.context.localStorageMemory){
        c = typeof(c) ==="string" ? c.split('') : c;
        let co ={};
        for(let g of c){
            co[g] =ctex._hots[g];
        }
        chrome.storage.local.set(co);
    }
}


window.onchange =(evt, dat)=>{   //update from option page
    if(dat)
        tally(dat.toString());
    else{
        localStorage['context'] =JSON.stringify(__options.context);
        chrome.storage.sync.set({'context':__options.context});
    }
};

chrome.runtime.onMessage.addListener(function(request, sender, response){
    switch(request.type){
    case "register":
        if(request.op ===void 0){
            if(ctex){
                delete ctex.clients[sender.tab.id];
                chrome.browserAction.setBadgeText({'text': iscount(ctex.clients, 'On').toString()});
            }
            response();
        }
        else if(ctex && isNaN(ctex.clients[sender.tab.id])){
            ctex.clients[sender.tab.id] =request.op;
            chrome.browserAction.setBadgeText({'text': iscount(ctex.clients, 'On').toString()});
            response(1);
        }
        else
            response(0);
        break;

    case "state":
        ctex.clients[sender.tab.id] =request.state;
        chrome.browserAction.setBadgeText({'text': iscount(ctex.clients, 'On').toString()});
        response();
        break;


    case 'search': {
        let e = search(request.text);
        response(e);
        break;
    }
    case "page": {
        let tiles =Zhong.pageOn(request.src, request.limitcount, request.isRadical);
        response(tiles);
        break;
    }
    case "glyphRootNode": {
        let child =Zhong.glyphRootNodeEx(request.glyf)
            , radical =child.parentNode.getAttribute('radical')
            , strokes =child.getAttribute("n");
        try{
            let exclus=["1","s"]
                ,realrad =Zhong.radicals.reduce((incur, curr)=>{
                    if(incur.length ===0)
                        return curr.filter(x=>exclus.indexOf(x.alt) ===-1 && x.radical.indexOf(radical) >=0);
                    else
                        return incur;
                }, []);
            response(Object.assign({strokes:strokes}, realrad[0]));
        }
        catch(err){
            console.log(err);
        }
        break;
    }
    case "radicals":
        response(Zhong.radicals);
        break;
    case "strokes":
        response(Zhong.strokes.outerHTML);
        break;
    case "querySelectorAll":{
        response(Zhong.querySelectorAll(request.selector));
        break;
    }
    case "qu":
        if(request.qu)
            ctex.qu =request.qu;
        else
            response(ctex.qu);
        break;
    case "hots":
        response(ctex.hots);
        break;
    case "hottops":
        response(ctex.hottops(request.k));
        break;
    case "shelves":
        ctex.shelves();
        response();
        break;
    case "rank":
        response();
        ctex.rank(request.glyph, request.radical);
        break;
    case "shelfup":
        response(ctex.shelfup(request.radical));
        break;
    case "onshelf":
        response(ctex.onshelf(request.indices));
        break;
    case "shelfLengths":
        response(ctex.shelfLengths(request.indices));
        break;
    case "rx":
        ctex.rx(request.force);
        response(void 0)
        break;

    // case 'open':
    //     break;
    // case 'copy':
    //     break;
    // case 'add':
    //     break;

    default:
    // ignore
    }
});
