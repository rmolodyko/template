/**
 * Created by egorov on 23.04.2015.
 */

/**
 * Created by Maxim Omelchenko on 02.02.2015 at 16:24.
 */



/**
 * Asynchronous material search
 * @param search Search query
 */
var sjsSearch = {

    search: function (params, beforeHandler, afterHandler, searchFrom) {

        // Page number
        var page = 1;
        // Variable to store timeout value
        var searchTimeout;
        // Stores current input
        var searchField = this;
        // Stores previous search string
        var prevKeywords;
        // Limits search symbols
        var symbolsNumber = searchFrom === undefined ? 2 : searchFrom;

        // If enter key was pressed ignore it
        searchField.keydown(function(obj, p, e){
            if (e.which == 13) {
                e.preventDefault();
            }
        });

        // Key up handler
        searchField.keyup(function (obj) {

            // Get search string
            var keywords = obj.val();

            // If we have not send any search request and search string differs from previous and there is enough letters
            if (
                prevKeywords !== keywords &&
                (keywords.length == 0 || keywords.length >= symbolsNumber)
            ) {

                // Reset timeout on key press
                if (searchTimeout != undefined) clearTimeout(searchTimeout);

                // Set delayed function
                searchTimeout = window.setTimeout(function () {

                    //Disable input
                    searchField.a('disabled', 'disabled');

                    var url = searchField.a('controller');
                    if (url[url.length - 1] !== '/') {
                        url += '/';
                    }
                    if (params) {
                        for (var i = 0; i < params.length; i++) {
                            url += params[i] + '/';
                        }
                    }
                    url += keywords + '/' + page;

                    if (beforeHandler) {
                        beforeHandler();
                    }

                    // Perform async request to server for rendering table
                    s.ajax(url, function (response) {

                        searchField.DOMElement.removeAttribute('disabled');
                        searchField.DOMElement.focus();

                        // Store current search string as previous
                        prevKeywords = keywords;

                        // Call external handler
                        if (afterHandler) {
                            afterHandler(response);
                        }
                    });
                }, 1000);
            }
        });
    }
};

SamsonJS.extend(sjsSearch);