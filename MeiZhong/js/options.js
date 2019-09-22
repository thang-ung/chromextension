/*
 MeiZhong - A Chinese-glyph selecotor pad
 Copyright (C) 2019-2019 Christian Schiller
 https://chrome.google.com/extensions/detail/...
 */

'use strict';

let _config =chrome.extension.getBackgroundPage().__options.context;

function render() {
	for(let ky of Object.keys(_config)){
		let optn =document.querySelector("#"+ky);
		switch(optn.type || optn.tagName){
		case "checkbox":
			optn.checked =_config[ky];
			break;
		default:
			optn.value =_config[ky];
		}
		optn.onchange=function(evt){
			switch(optn.type){
			case "checkbox":
				_config[this.id] =this.checked;
				break;
			default:
				_config[this.id] =this.value;
				break;
			}
			chrome.extension.getBackgroundPage().dispatchEvent(new Event("change"));
		}
	}
}

render();
