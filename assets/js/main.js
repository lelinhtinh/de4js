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

/* globals ClipboardJS */

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
        };
    }

    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineBadge.classList.remove('show');
        } else {
            offlineBadge.classList.add('show');
        }
    }

    var input = document.getElementById('input'),
        view = document.getElementById('view'),
        temp = '',

        encode = document.getElementsByName('encode'),
        packer = document.bvDecode.encode.value,

        checkAll = function (check) {
            for (var i = 0; i < encode.length; i++) {
                if (encode[i].value === 'nicify') continue;
                encode[i].disabled = check;
            }
        },

        clear = document.getElementById('clear'),

        autoBtn = document.getElementById('auto'),
        isAuto = false,

        preview = document.getElementById('preview'),

        clipboard = new ClipboardJS('#copyjs', {
            target: function () {
                return view;
            }
        }),

        offlineBadge = document.getElementById('offline'),

        startEffect = function () {
            view.textContent = '';
            view.classList.add('waiting');
            clear.disabled = true;
            autoBtn.disabled = true;
            checkAll(true);
        },
        stopEffect = function () {
            isAuto = false;
            view.classList.remove('waiting');
            clear.disabled = false;
            autoBtn.disabled = false;
            setTimeout(function () {
                checkAll(false);
                if (packer === '') temp = '';
            }, 0);
        },

        resetCopy = function (trigger) {
            if (!trigger.classList.contains('copied')) return;
            trigger.classList.remove('copied');
        },
        timeReset = function (trigger) {
            setTimeout(function () {
                resetCopy(trigger);
            }, 800);
        },

        externalStyle = '*{margin:0;padding:0}html{line-height:1em;background:#1d1f21;color:#c5c8c6}pre{white-space:pre-wrap;word-wrap:break-word;word-break:break-all}{% include highlight-js/styles/hljs-theme.css %}html,body,.hljs{background:#030303}',
        externalUrl,
        externalPreview = function (source) {
            if (externalUrl) URL.revokeObjectURL(externalUrl);

            source = '<html><head><meta charset="utf-8"><link rel="shortcut icon" type="image/png" href="{{ site.url }}{{ site.baseurl }}{{ "/favicon.png" }}"><title>{{ site.name }} | Preview</title><style>' + externalStyle + '</style></head><body><pre class="hljs">' + source + '</pre></body></html>';

            externalUrl = new Blob([source], {
                type: 'text/html'
            });
            externalUrl = URL.createObjectURL(externalUrl);

            preview.classList.add('show');
            preview.href = externalUrl;
        },

        workerFormat,
        workerDecode,

        format = debounce(function () {
            if (temp === '') return;

            if (!workerFormat) {
                workerFormat = new Worker('{{ "/assets/js/worker/format.js" | relative_url }}');
                workerFormat.addEventListener('message', function (e) {
                    view.innerHTML = e.data;
                    externalPreview(e.data);

                    stopEffect();
                });
            }

            startEffect();
            workerFormat.postMessage({
                source: temp
            });
        }, 250),

        detect = function (source) {
            var type = '';

            if (/^[\s\n]*var\s_\d{4};[\s\n]*var\s_\d{4}\s?=/.test(source)) {
                type = '_numberencode';
            } else if (source.indexOf("/｀ｍ´）ﾉ ~┻━┻   //*´∇｀*/ ['_'];") !== -1) { // eslint-disable-line quotes
                type = 'aaencode';
            } else if (source.indexOf('$={___:++$,$$$$:(![]+"")[$]') !== -1) {
                type = 'jjencode';
            } else if (source.replace(/[[\]()!+]/gm, '').trim() === '') {
                type = 'jsfuck';
            } else if (source.indexOf(' ') === -1 && (source.indexOf('%2') !== -1 || source.replace(/[^%]+/g, '').length > 3)) {
                type = 'urlencode';
            } else if (/^[\s\n]*var\s_0x\w+\s?=\s?\["/.test(source)) {
                type = 'arrayencode';
            } else if (source.indexOf('eval(') !== -1) {
                if (/\b(window|document|console)\.\b/i.test(source)) return type;
                type = 'evalencode';
            }

            document.querySelector('.magic-radio:checked').checked = false;
            document.querySelector('.magic-radio[value="' + type + '"]').checked = true;

            return type;
        },

        decode = debounce(function () {
            if (temp === '') temp = input.value.trim();
            if (temp === '') return;

            packer = isAuto ? detect(temp) : document.bvDecode.encode.value;

            if (packer === 'nicify') return;
            if (packer === '') {
                format();
                return;
            }

            if (!workerDecode) {
                workerDecode = new Worker('{{ "/assets/js/worker/decode.js" | relative_url }}');
                workerDecode.addEventListener('message', function (e) {
                    if (e.data !== temp) {
                        temp = e.data;

                        if (isAuto) {
                            decode();
                            return;
                        }
                    }

                    format();
                });
            }

            startEffect();
            workerDecode.postMessage({
                source: temp,
                packer: packer
            });
        }, 250);

    input.oninput = function () {
        temp = input.value.trim();
        decode();
    }

    for (var i = 0; i < encode.length; i++) {
        encode[i].onchange = function () {
            decode();
        };
    }

    autoBtn.onclick = function () {
        isAuto = true;
        decode();
    };

    clipboard.on('success', function (e) {
        e.trigger.classList.add('copied');
        e.clearSelection();
        timeReset(e.trigger);
    });
    clipboard.on('error', function (e) {
        e.trigger.classList.add('selected');
        timeReset(e.trigger);
    });

    clear.onclick = function () {
        view.textContent = '';

        stopEffect();
        setTimeout(function () {
            input.value = '';
            temp = '';
        }, 0);

        if (workerDecode) {
            workerDecode.terminate();
            workerDecode = undefined;
        }
        if (workerFormat) {
            workerFormat.terminate();
            workerFormat = undefined;
        }

        preview.classList.remove('show');
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

})();
