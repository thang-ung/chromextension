/*
 MeiZhong - A Chinese-entry-pad
 Copyright (C) 2019 
 https://chrome.google.com/extensions/detail/...


 */

'use strict';
//import {zhoChat} from "./js/zhoChat.js";
//import {Zhad} from "./stenopad.js";

let dl ={};

async function enableTab() {
    //console.log([window.parent, window.location.href]);
    let success =await dedupmei.send({"type":"register","op":0});
    if(!success)/* 
        dedupmei.detach() */;
    else if(!dl.stenp){

        dl ={stenp: new Zhad(),
             chatbox: new zhoChat() };

        dl.port =chrome.runtime.connect();
        if(dl.port){
            dl.port.onDisconnect.addListener(()=>{
                disableTab().remove();
                });
        }
        else console.log('portfail');

        dl.stenp.onOpen();
        dl.stenp.onNavigate();

        window.addEventListener('beforeunload', ()=>{
            dedupmei.send({"type":"register"});
            });

        let cfgObserve = {
            attributeFilter: ['class'], attributeOldValue: true
        };
        let observer = new MutationObserver((muti)=>{
            let muta;
            for(let muta of muti){
                let state =muta.target.classList.contains('hidden') ? 1:0;
                let hid =muta.oldValue.split(" ").filter(x=>x=='hidden').join('')  ? 1:0;
                if(hid ^ state){
                    dedupmei.send({"type":"state", "state": hid});
                    muta.target.classList.toggle("paused");
                }
            }
        });
        //observer.observe(document.getElementById('zhong'), cfgObserve);
        observer.observe(Zhad.shadow.getElementById("zhong"), cfgObserve);
    }
}

function disableTab() {

    dl.stenp.destroy();
    delete dl.stenp;
    delete dl.chatbox;
    if(dl.port) dl.port.disconnect();
    delete dl.port;

    return document.getElementById('extension-zhopad');
}

function onactive(isactive){
    if(window.parent !== globalThis);
    else if(isactive)
        enableTab();
    else if(dl.stenp){
        dedupmei.send({"type":"register"});
        disableTab();
    }
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for(var key in changes) {
        switch(key){
        case 'context':
            if(dl.stenp instanceof Zhad) dl.stenp.syncOptions(changes[key]);
            break;
        case 'active':
            onactive(changes[key].newValue);
            break;
        default:
            break;
        }
    }//end loop

  });
chrome.storage.sync.get(['active'], (values)=>{
    onactive(chrome.runtime.lastError || values.active ? true:false);
})
