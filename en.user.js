// ==UserScript==
// @name         Bilibili translator (en)
// @namespace    https://taiho.moe
// @version      0.1
// @description  Translate Bilibili UI texts
// @author       swordfeng
// @match        https://*.bilibili.com/*
// @resource     dict https://raw.githubusercontent.com/swordfeng/bilibili-translator/master/dict.json
// @grant        GM_getResourceText
// ==/UserScript==

const lang = 'en';

function translateNode(node, dict) {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue.trim();
        if (dict[text] && dict[text][lang] && text !== dict[text][lang]) {
            node.nodeValue = node.nodeValue.replace(text, dict[text][lang]);
        }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let subNode of node.childNodes) {
            translateNode(subNode, dict);
        }
    }
}

function onLoadDict(dict) {
    translateNode(document.body, dict);
    new MutationObserver((mutlist, observer) => {
        for (let mut of mutlist) {
            if (mut.type === 'childList') {
                for (let node of mut.addedNodes) {
                    translateNode(node, dict);
                }
            } else if (mut.type === 'characterData') {
                translateNode(mut.target, dict);
            }
        }
    }).observe(document.body, {childList: true, characterData: true, subtree: true});
}

(function() {
    'use strict';

    const dict = JSON.parse(GM_getResourceText('dict'));
    onLoadDict(dict);
})();

