/*
 MeiZhong - A Chinese-entry-pad
 Copyright (C) 2019 
 https://chrome.google.com/extensions/detail/...


 */

'use strict';
//import {zhoChat} from "./js/zhoChat.js";
//import {Zhad} from "./stenopad.js";

let config;

let chatbox =new zhoChat();
let stenp;

function enableTab() {
    if(!stenp){
        stenp =new Zhad();

        stenp.onOpen();
        stenp.onNavigate();
    }
    //document.addEventListener('wheel', onMouseMove,{passive:false});
    //document.addEventListener('mousedown', onMouse)
}

function disableTab() {
    //document.removeEventListener('wheel', onMouseMove);
    stenp.destroy();
    stenp =null;

    let _containment = document.getElementById('meiZhong-window');
    if (_containment) {
        _containment.parentNode.removeChild(_containment);
    }
}

let miniHelp = `
    <details open style="font-weight: bold;">
    <summary>MeiZhong Chinese-glyphs
    </summary>
    </details>
    <br>
    <details><summary>Keyboard shortcuts:</summary></details>`;

// event listener
chrome.runtime.onMessage.addListener(
    function (request) {
        switch (request.type) {
            case 'enable':
                enableTab();
                config = request.config;
                break;
            case 'disable':
                disableTab();
                break;
            case 'showPopup':
                if (!request.isHelp || window === window.top) {
                    showPopup(request.text);
                }
                break;
            case 'showHelp':
                //showPopup(miniHelp);
                break;
            default:
        }
    }
);
