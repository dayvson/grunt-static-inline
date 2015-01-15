(function(){
    var util = {
        // Method extracted from RavenJS:
        // https://github.com/getsentry/raven-js/blob/master/dist/raven.js
        escapeRegExp: function (text) {
            // This regexp should be presented inline.
            return text.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, '\\$&');
        }
    };
})();