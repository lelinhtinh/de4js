// ==UserScript==
// @name         de4js helper
// @namespace    https://baivong.github.io/de4js/
// @description  Enable Unreadable option in de4js
// @version      0.4.1
// @icon         https://i.imgur.com/CJ5MfxV.png
// @author       Zzbaivong
// @license      MIT
// @match        https://baivong.github.io/de4js/
// @noframes
// @connect      jsnice.org
// @supportURL   https://github.com/baivong/de4js/issues
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    var nicify = document.getElementById('nicify'),
        input = document.getElementById('input'),
        view = document.getElementById('view'),
        redecode = document.getElementById('redecode');

    function jsnice() {
        if (input.value.trim() === '') return;

        view.textContent = 'Please waiting...';
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://www.jsnice.org/beautify?pretty=0&rename=1&types=0&suggest=0',
            responseType: 'json',
            data: input.value,
            onload: function (response) {
                output.value = response.response.js;
                document.getElementById('highlight').onchange();
            },
            onerror: function (e) {
                console.error(e);
                view.textContent = 'Internal error. Please try again later.';
            }
        });
    }

    nicify.disabled = false;
    nicify.onchange = jsnice;

    input.addEventListener('input', function () {
        if (nicify.checked) jsnice();
    });

    redecode.addEventListener('click', function () {
        if (nicify.checked) jsnice();
    });

})();
