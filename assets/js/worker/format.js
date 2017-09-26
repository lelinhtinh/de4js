---
---
self.addEventListener('message', function (e) {
    var source = e.data.source;

    if (e.data.beautify) {
        self.importScripts('{{ "/assets/js/lib/js-beautify/beautify.js?v=" | append: site.github.build_revision | relative_url }}');
        source = self.js_beautify(source, {
            unescape_strings: true,
            jslint_happy: true
        });
    }

    if (e.data.highlight) {
        self.importScripts('{{ "/assets/js/lib/highlight-js/highlight.pack.js?v=" | append: site.github.build_revision | relative_url }}');
        source = self.hljs.highlight('javascript', source).value;
    }

    self.postMessage(source);
});