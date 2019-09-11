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

import {Zhong} from "./js/czhong.js";

let isEnabled = localStorage['enabled'] === '1';

let isActivated = false;

let tabIDs = {};

let ctex;

let __options = window.__options = {
    context: JSON.parse(localStorage['context'] || '{}'),
};

function activateExtension(tabId, showHelp) {

    isEnabled = true;
    // values in localStorage are always strings
    localStorage['enabled'] = '1';
    console.log("new context");
    if (!ctex) {
         ctex =new Zhong();
    }

    chrome.tabs.sendMessage(tabId, {
        'type': 'enable',
        'config': __options
    });

    if (showHelp) {
        chrome.tabs.sendMessage(tabId, {
            'type': 'showHelp'
        });
    }

    chrome.browserAction.setBadgeBackgroundColor({
        'color': [255, 0, 0, 255]
    });

    chrome.browserAction.setBadgeText({
        'text': 'On'
    });

    chrome.contextMenus.create(
        {
            title: 'Show help in new tab',
            onclick: function () {
                let url = chrome.runtime.getURL('/help.html');
                let tabID = tabIDs['help'];
                if (tabID) {
                    chrome.tabs.get(tabID, function (tab) {
                        if (tab && (tab.url.substr(-9) === 'help.html')) {
                            chrome.tabs.reload(tabID);
                            chrome.tabs.update(tabID, {
                                active: true
                            });
                        } else {
                            chrome.tabs.create({
                                url: url
                            }, function (tab) {
                                tabIDs['help'] = tab.id;
                                chrome.tabs.reload(tab.id);
                            });
                        }
                    });
                } else {
                    chrome.tabs.create(
                        { url: url },
                        function (tab) {
                            tabIDs['help'] = tab.id;
                            chrome.tabs.reload(tab.id);
                        }
                    );
                }
            }
        }
    );

    isActivated = true;
}

function deactivateExtension() {

    isEnabled = false;
    // values in localStorage are always strings
    localStorage['enabled'] = '0';

    ctex = undefined;

    chrome.browserAction.setBadgeBackgroundColor({
        'color': [0, 0, 0, 0]
    });

    chrome.browserAction.setBadgeText({
        'text': ''
    });

    // Send a disable message to all tabs in all windows.
    chrome.windows.getAll(
        { 'populate': true },
        function (windows) {
            for (let i = 0; i < windows.length; ++i) {
                let tabs = windows[i].tabs;
                for (let j = 0; j < tabs.length; ++j) {
                    chrome.tabs.sendMessage(tabs[j].id, {
                        'type': 'disable'
                    });
                }
            }
        }
    );

    chrome.contextMenus.removeAll();
    isActivated = false;
}

function activateExtensionToggle(currentTab) {
    if (isActivated) {
        deactivateExtension();
    } else {
        activateExtension(currentTab.id, true);
    }
}

function enableTab(tabId) {
    if (isEnabled) {

        if (!isActivated) {
            activateExtension(tabId, false);
        }

        chrome.tabs.sendMessage(tabId, {
            'type': 'enable',
            'config': __options
        });
    }
}

function search(text) {
    return text;
}

chrome.browserAction.onClicked.addListener(activateExtensionToggle);

chrome.tabs.onActivated.addListener(activeInfo => enableTab(activeInfo.tabId));
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
        enableTab(tabId);
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, response) {

    let tabID;

    switch (request.type) {

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
        case "rx":
            ctex.rx(resquest.force);
            response(undefined)
            break;

        case 'open':
            break;

        case 'copy':
            break;

        case 'add':
            break;

        default:
        // ignore
    }
});
