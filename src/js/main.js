"use strict"

jQuery(document).ready(function ($) {

    // Google Analytics helper: auto-bounding output links, etc.
    var analyzer = new GoogleAnalyzer();
    analyzer.init();

    var tumblr = new Tumblr(),
        $poster = $('section.posts');

    tumblr.init($);

    tumblr.getData('text',function(data) {
        if('OK' == data.meta.msg) {
            $poster.append($('<h2>').text("Tumblr :"));
            for(var i in data.response.posts) {
                $poster.append($('<article>').html(data.response.posts[i].body));
            }
        }
    });

});
