"use strict"
jQuery('document').ready(function() {
    // Google Analytics helper: auto-bounding output links, etc.
    var analyzer = new GoogleAnalyzer();
    analyzer.init();

    var tumblr = new Tumblr(),
    $poster = $('#cold-tmblr');

    tumblr.init($);

    tumblr.getPosts(function(data) {
        if('OK' == data.meta.msg) {
            for(var i in data.response.posts) {
                $poster.append($('<article>').html(
                    '<h1>' + data.response.posts[i].title + '</h1>' +
                    data.response.posts[i].summary
                    )
                );
            }
        }
    });

    tumblr.getVideos(function(data) {
        if('OK' == data.meta.msg) {
            if(0 < data.response.posts.length) {
                var options = "?autoplay=0&rel=0";
                $('#live-media-video .video-container').empty().append($('<iframe>', {
                    src: "".concat(data.response.posts[0].youtube.embed, options),
                    allowfullscreen: 'true',
                }));
            }
        }
    });

});

