// ==UserScript==
// @name         de4js helper
// @namespace    https://baivong.github.io/de4js/
// @description  Enable Unreadable option in de4js
// @version      1.1.0
// @icon         https://i.imgur.com/CJ5MfxV.png
// @author       Zzbaivong
// @license      MIT
// @match        https://baivong.github.io/de4js/
// @include      http://127.0.0.1:4000/de4js/
// @include      http://localhost:4000/de4js/
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

        view.classList.add('waiting');
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://www.jsnice.org/beautify?pretty=0&rename=1&types=0&suggest=0',
            responseType: 'json',
            data: input.value,
            onload: function (response) {
                var source = response.response.js;

                if (source.indexOf('Error compiling input') === 0) {
                    source = input.value;
                } else {
                    source = response.response.js;
                }

                output.value = source;
                document.getElementById('highlight').onchange();
            },
            onerror: function (e) {
                console.error(e);
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