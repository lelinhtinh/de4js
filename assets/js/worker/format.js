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

self.addEventListener('message', function (e) {
    var source = e.data.source;

    try {
        self._window = self.window;
        self.window = {};

        self.importScripts('{{ "/assets/js/lib/js-beautify/beautify.min.js" | relative_url }}');

        source = self.window.js_beautify(source, {
            unescape_strings: true,
            jslint_happy: true
        });

        self.window = self._window;
    } catch (err) {
        console.log(err);
    }

    try {
        self.importScripts('{{ "/assets/js/lib/highlight-js/highlight.min.js" | relative_url }}');

        source = self.hljs.highlight('javascript', source).value;
    } catch (err) {
        console.log(err);
    }

    self.postMessage(source);
});
