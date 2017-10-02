---
---
/**
 * @name  {{ site.name }}
 * @description  {{ site.description }}
 * @author  {{ site.author }} <{{ site.author_email }}> ({{ site.url }})
 * @version  {{ site.version }}
 * @copyright  {{ site.author }} 2017
 * @license  {{ site.license }}
 */

(function () {

    // https://davidwalsh.name/javascript-debounce-function
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    var input = document.getElementById('input'),
        output = document.getElementById('output'),
        view = document.getElementById('view'),

        encode = document.getElementsByName('encode'),

        beautify = document.getElementById('beautify'),
        highlight = document.getElementById('highlight'),
        auto = document.getElementById('auto'),

        copyjs = document.getElementById('copyjs'),
        redecode = document.getElementById('redecode'),
        clear = document.getElementById('clear'),

        clipboard = new Clipboard('#copyjs'),
        copytimeout,

        startEffect = function () {
            if (output.value === '') view.textContent = 'Please wait...';
            view.classList.add('waiting');
        },
        stopEffect = function () {
            view.classList.remove('waiting');
        },

        textreset = function () {
            if (copyjs.textContent === 'Copy') return;
            copyjs.textContent = 'Copy';
            copyjs.removeAttribute('style');
        },
        timereset = function () {
            copytimeout = setTimeout(function () {
                textreset();
            }, 3000);
        },

        workerFormat,
        workerDecode,

        format = debounce(function () {
            var source = output.value.trim();

            if (source === '') return;
            if (!beautify.checked && !highlight.checked) {
                view.textContent = source;
                return;
            }

            if (!workerFormat) {
                workerFormat = new Worker('{{ "/assets/js/worker/format.js?v=" | append: site.github.build_revision | relative_url }}');
                workerFormat.addEventListener('message', function (e) {
                    view[(highlight.checked ? 'innerHTML' : 'textContent')] = e.data;
                    stopEffect();
                });
            }

            startEffect();
            workerFormat.postMessage({
                source: source,
                beautify: beautify.checked,
                highlight: highlight.checked
            });
        }, 250),

        detect = function (source) {
            var type = '';
            if (/^[\s\n]*var\s_\d{4}\;[\s\n]*var\s_\d{4}\s?=/.test(source)) {
                type = '_numberencode';
            } else if (source.indexOf("/｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/ ['_'];") !== -1) {
                type = 'aaencode';
            } else if (source.indexOf('$={___:++$,$$$$:(![]+"")[$]') !== -1) {
                type = 'jjencode';
            } else if (source.replace(/[\[\]\(\)\!\+]/gm, '').trim() === '') {
                type = 'jsfuck';
            } else if (source.indexOf(' ') === -1 && (source.indexOf('%2') !== -1 || source.replace(/[^%]+/g, '').length > 3)) {
                type = 'urlencode';
            } else if (source.indexOf('eval(') !== -1) {
                type = 'evalencode';
            } else if (/^[\s\n]*var\s_0x\w+\s?=\s?\["/.test(source)) {
                type = 'arrayencode';
            }

            document.querySelector('.magic-radio:checked').checked = false;
            document.querySelector('.magic-radio[value="' + type + '"]').checked = true;

            return type;
        },

        decode = debounce(function () {
            var source = input.value.trim(),
                packer = bvDecode.encode.value;

            if (source === '') return;
            if (auto.checked) packer = detect(source);

            if (packer === 'nicify') return;
            if (packer === '') {
                output.value = source;
                format();
                return;
            }

            if (!workerDecode) {
                workerDecode = new Worker('{{ "/assets/js/worker/decode.js?v=" | append: site.github.build_revision | relative_url }}');
                workerDecode.addEventListener('message', function (e) {
                    output.value = e.data;
                    if (!beautify.checked && !highlight.checked) stopEffect();

                    if (auto.checked && input.value !== output.value) {
                        redecode.onclick();
                    } else {
                        format();
                    }
                });
            }

            startEffect();
            output.value = '';
            workerDecode.postMessage({
                source: source,
                packer: packer
            });
        }, 250);

    input.oninput = debounce(function () {
        decode();
    });
    for (var i = 0; i < encode.length; i++) {
        encode[i].onchange = decode;
    }

    beautify.onchange = format;
    highlight.onchange = format;

    auto.onchange = function () {
        for (var i = 0; i < encode.length; i++) {
            if (encode[i].value === 'nicify') continue;
            encode[i].disabled = auto.checked;
        }
        decode();
    };

    copyjs.onmouseout = function () {
        textreset();
        clearTimeout(copytimeout);
    };
    clipboard.on('success', function (e) {
        e.trigger.textContent = 'Copied';
        e.trigger.style.color = '#b5e853';
        e.clearSelection();
        timereset();
    });
    clipboard.on('error', function (e) {
        e.trigger.textContent = 'Selected';
        e.trigger.style.color = '#ff2323';
        timereset();
    });

    redecode.onclick = function () {
        input.value = output.value;
        decode();
    }

    clear.onclick = function () {
        view.textContent = 'Please choose a right encoding type!';
        stopEffect();
        setTimeout(function() {
            auto.onchange();
        }, 0);

        if (workerDecode) {
            workerDecode.terminate();
            workerDecode = undefined;
        }
        if (workerFormat) {
            workerFormat.terminate();
            workerFormat = undefined;
        }
    }

})();