"use strict"

var video = {
        provider: false,
        videoId: false,
        iframeClass: 'youtubeIframe',
        iframeId:    'youtubePlayer',
        vars: { // see https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            'enablejsapi':  1,
            'controls':     2,
            'autoplay':     0,
            'rel' :         0,
            'loop':         1,
            'showinfo':     0,
            'egm':          0,
            'showsearch':   0,
            'theme':        'dark', // or 'light'
            'color':        'red',  // or 'white'
            'origin':       document.location.origin,
            'width':        false,
            'height':       false,
        }
    },
    api = false;

jQuery('document').ready(function() {

    video.provider = new Youtube();
    var tumblr = new Tumblr();
    tumblr.init($);

    var $feeds = $('.cold-rss-articles'),
    $poster    = $('.cold-tmblr-list'),
    $body      = $('.cold-tmblr-body');

    tumblr.getPosts(function(data) {
        if('OK' == data.meta.msg) {
            for(var i in data.response.posts) {
                // Let’s build that article list
                $poster.append($('<li data-index="'+i+'" class="cold-tmblr-summary">').html(
                    '<a href="#" class="cold-tmblr-link">' + data.response.posts[i].title + '</a> '
                    + data.response.posts[i].summary
                    + '</li>'
                    )
                );
                // Let’s build those article’s bodys
                $body.append(
                    '<article class="cold-tmblr-article hidden" data-body="'+ i +'">'
                    + '<h1>' + data.response.posts[i].title + '</h1>'
                    + data.response.posts[i].body
                    + '</article>'
                );
            }
            //
            // Article swapping logic
            //
            var $allArticles = $('.cold-tmblr-article');
            var $allSums = $('.cold-tmblr-list li');
            var $allSumsLinks = $('.cold-tmblr-list a');
            var isMobile;

            // Show the first item at init
            $allArticles.eq('0').removeClass('hidden');
            $allSums.eq('0').addClass('active');

            // Sum list interactivity
            $allSums.click(function() {
                $allSums.removeClass('active');
                $(this).addClass('active');
                if(isMobile === true) {
                    $('.cold-tmblr-list').hide();
                    $('.cold-tmblr-body').show();
                }
                $allArticles
                    .addClass('hidden')
                    .eq($(this).index())
                    .removeClass('hidden');
            });

            // Same for the links
            $allSumsLinks.click(function(e) {
                e.preventDefault();
                $('.cold-tmblr-list li').click();
            });

            // Back and forth for mobile devices
            $('#cold-tmblr-15 .cold-tmblr-body').append('<a href="#" class="btn btn-primary back cold-tmblr-back">‹ Tous les articles</a>');
            $('.cold-tmblr-back').click(function(e) {
                e.preventDefault();
                isMobile = true;
                $('.cold-tmblr-body').hide();
                $('.cold-tmblr-list').show();
            });
        }
    });


    //--- May, 9th videos  ----------------------------------------------

    var iframeId = video.iframeId+'9';
    $('#live-media-video-9 .video-container').empty().append($('<div>', {
        id: iframeId,
    }));
    video.vars.list = 'PL9xW6UUQnWBKvquSnA5z4AxfWrfyOZynQ';
    video.vars.listType = 'playlist';
    video.vars.autoplay = 0;
    video.provider.init(false, iframeId, video.vars, false); // videoId is optional in case of a list

    //--- May, 15th videos  ----------------------------------------------

    /*
    var iframeId = video.iframeId+'15';
    $('#live-media-video-15 .video-container').empty().append($('<div>', {
        id: iframeId,
    }));
    var video15 = clone(video);
    video15.vars.list = 'PL9xW6UUQnWBKvquSnA5z4AxfWrfyOZynQ';
    video15.vars.listType = 'playlist';
    video15.vars.autoplay = 0;
    video15.provider.init(false, iframeId, video.vars, false); // videoId is optional in case of a list
    videos.push(video15);
    */

    // a playlist by default, or a Tumblr video if exists
    /*
    tumblr.getVideos(function(data) {
    var found = false;
    video.vars.autoplay = 0;
    var iframeId = video.iframeId+'15';

        if(data && 'OK' == data.meta.msg) {
            if(0 < data.response.posts.length) {
                found = false; // force playlist
                $('#live-media-video-15 .video-container').empty().append($('<div>', {
                    id: iframeId,
                }));
                video.videoId = data.response.posts[0].youtube.videoId;
                video.provider.init(video.videoId, iframeId, video.vars, false);
            }
        }
        if(!found) {
                    }
    });
    */

    //--- Feeds ----------------------------------------------
    var rss = new RssParser();
    rss.init($);
    rss.parse(function(data) {
        if(0 < data.value.items.length) {
            $feeds.empty();
            var months = Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");
            for(var i in data.value.items) {
                var item = data.value.items[i];
                var date = new Date(item.pubDate);
                var $date = $('<time>').text(date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear());
                var $article = $('<article />', {
                    class: 'cold-rss-item',
                });
                var $title = $('<h1 />');
                var $link = $('<a />', {
                    href: item.link,
                    target: '_blank',
                    title: 'Nouvelle fenêtre',
                }).text(item.title);
                item.description = item.description.replace(/(<([^>]+)>)/ig,"");
                var $body = $('<div>', {
                    class: 'cold-rss-body',
                }).html(item.description);
                $title.append($link);
                $article.append([$title, $date, $body]);
                $feeds.append($article);
            }
        }
    });

    //--- Tabs clicking ----------------------------------------------
    // Tab click event handles stopping any video/audio players
    $('a[data-toggle=tab]').on('click', function(e){
        e.preventDefault();
        video.provider.player.pauseVideo();
        $.scPlayer.stopAll();
    });

    $('#main-nav a').on('click', function(e) {
        e.preventDefault();

        setTimeout(function() {
            $('.cold').appendTo('#main-content > .tab-pane.active');
        }, 1000);
    });

    /**
     * move the .cold to the active tab
     */
    $('.cold').appendTo('#main-content > .tab-pane.active');
});

// YT Iframe API code downloads success event handler target
// see https://developers.google.com/youtube/iframe_api_reference
var onYouTubeIframeAPIReady = function() {
    api = true;
    video.provider.player = video.provider.setPlayer();
}

// http://stackoverflow.com/a/728694/490589
var clone = function(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
