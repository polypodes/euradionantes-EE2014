"use strict"

jQuery(document).ready(function ($) {

    // Google Analytics helper: auto-bounding output links, etc.
    var analyzer = new GoogleAnalyzer();
    analyzer.init();

    var tumblr = new Tumblr();
    tumblr.init($);
    tumblr.getData(function(data) {
        if('OK' == data.meta.msg) {
            $('section.posts').append($('<h2>').text("Tumblr :"));
            for(var i in data.response.posts) {
                $('section.posts').append($('<article>').html(data.response.posts[i].body));
            }
        }
    });


});
