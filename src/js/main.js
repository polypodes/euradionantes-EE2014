"use strict"

var video = {
    provider: false,
    videoId: false,
    currentPlayer: false,
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
        //'list':         '',
        //'listType':     '',
    }

}

jQuery('document').ready(function() {

    var $feeds = $('.cold-rss'),
        $poster = $('.cold-tmblr-list'),
        $body = $('.cold-tmblr-body');

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


    //--- May, 15th videos  ----------------------------------------------

    // a playlist by default, or a Tumblr video if exists
    tumblr.getVideos(function(data) {
        var found = false;
        video.provider = new Youtube();
        video.vars.autoplay = 1;

        if(data && 'OK' == data.meta.msg) {
            if(0 < data.response.posts.length) {
                found = true;
                $('#live-media-video-15 .video-container').empty().append($('<div>', {
                    id: video.iframeId,
                }));
                video.videoId = data.response.posts[0].youtube.videoId;
                video.provider.init(video.videoId, video.iframeId, video.vars, false);
            }
        }
        if(!found) {
            $('#live-media-video-15 .video-container').empty().append($('<div>', {
                id: video.iframeId,
            }));
            video.vars.list = 'PL9xW6UUQnWBKvquSnA5z4AxfWrfyOZynQ';
            video.vars.listType = 'playlist';
            video.provider.init(false, video.iframeId, video.vars, false); // videoId is optional in case of a list
        }
    });

    //--- Feeds ----------------------------------------------
    if(0 < $feeds.length) {
        var rss = new RssParser();
        rss.init($);
        rss.parse(function(data) {
            if(0 < data.value.items.length) {
                $feeds.empty();
                var months = Array("Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre");
                for(var i in data.value.items) {
                    var item = data.value.items[i];
                    var date = new Date(item.pubDate);
                    var $date = $('<span >').text(date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear());
                    var $article = $('<article />');
                    var $title = $('<a />', {
                        href: item.link
                    }).text(item.title);
                    item.description = item.description.replace(/[<]br[^>]*[>]/gi,"");
                    $article.append([$title, $date, item.description]);
                    $feeds.append($article);
                }
            }
        });
    }

    //--- Tabs clicking ----------------------------------------------
    // Tab click event handles stopping any video/audio players
    $('a[data-toggle=tab]').on('click', function(e){
        e.preventDefault();
        if(video.provider.player) {
            video.provider.player.pauseVideo();
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
    video.provider.player = video.provider.setPlayer();
    video.ready = true;
}
