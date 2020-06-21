// ==UserScript==
// @name         Bilibili translator (ja)
// @namespace    https://taiho.moe
// @version      0.1
// @description  Translate Bilibili UI texts
// @author       swordfeng
// @match        https://*.bilibili.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const lang = 'ja';

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

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/swordfeng/bilibili-translator/master/dict.json',
        responseType: 'json',
        onload: xhr => {
            onLoadDict(xhr.response);
        }
    });
})();
