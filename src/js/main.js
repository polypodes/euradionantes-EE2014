"use strict"

var video = {
    provider: false,
    videoId: false,
    players: [],
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
    },
    api:                false,

}

jQuery('document').ready(function() {

    var $feeds = $('.cold-rss-articles'),
        $poster = $('.cold-tmblr-list'),
        $body = $('.cold-tmblr-body');


    video.provider = new Youtube();
    var tumblr = new Tumblr();
    tumblr.init($);

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

            // Show the first item at init
            $allArticles.eq('0').removeClass('hidden');
            $allSums.eq('0').addClass('active');

            // Sum list interactivity
            $allSums.click(function() {
                $allSums.removeClass('active');
                $(this).addClass('active');
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

    // a playlist by default, or a Tumblr video if exists
    tumblr.getVideos(function(data) {
        var found = false;
        video.vars.autoplay = 0;
        var iframeId = video.iframeId+'15';

        if(data && 'OK' == data.meta.msg) {
            if(0 < data.response.posts.length) {
                found = true;
                $('#live-media-video-15 .video-container').empty().append($('<div>', {
                    id: iframeId,
                }));
                video.videoId = data.response.posts[0].youtube.videoId;
                video.provider.init(video.videoId, iframeId, video.vars, false);
            }
        }
        if(!found) {
            $('#live-media-video-15 .video-container').empty().append($('<div>', {
                id: iframeId,
            }));
            video.vars.list = 'PL9xW6UUQnWBKvquSnA5z4AxfWrfyOZynQ';
            video.vars.listType = 'playlist';
            video.provider.init(false, iframeId, video.vars, false); // videoId is optional in case of a list
        }
    });

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
        if(0 < video.players.length) {
            for(var i in video.players) {
                video.players[i].pauseVideo();
            }
        }
        $.scPlayer.stopAll()
    });

    $('#main-nav a').on('click', function(e) {
        e.preventDefault();
    });

});

// YT Iframe API code downloads success event handler target
// see https://developers.google.com/youtube/iframe_api_reference
var onYouTubeIframeAPIReady = function() {
    video.players.push(video.provider.setPlayer());
    video.api = true;
}
