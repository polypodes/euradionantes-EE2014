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
        'list':         false,
        'listType':     false,
    }

}

jQuery('document').ready(function() {

    var $posts = $('#cold-tmblr'),
        $feeds = $('#feeds');

    //--- Posts ----------------------------------------------
    var tumblr = new Tumblr();
    tumblr.init($);
    if(0 < $posts.length) {
        tumblr.getPosts(function(data) {
            if('OK' == data.meta.msg) {
                $posts = $('#cold-tmblr');
                for(var i in data.response.posts) {
                    $posts.append($('<article data-index="'+i+'">').html(
                        '<div class="togglable summary" style="display:block">'
                        + '<h1><a href="#">' + data.response.posts[i].title + '</a></h1>'
                        + data.response.posts[i].summary
                        + '</div><div class="togglable body" style="display:none">'
                        + '<h1><a href="#">' + data.response.posts[i].title + '</a></h1>'
                        + data.response.posts[i].body
                        + '</div>'
                        )
                    );
                }

                $('article .togglable h1 a').on('click', function(e){
                    e.preventDefault();
                    $('.togglable', $(this).parent().parent().parent()).toggle();
                });
            }
        });
    }

    //--- May, 15th videos  ----------------------------------------------
    // a playlist by default, or a Tumblr video
    tumblr.getVideos(function(data) {
        var found = false;
        console.log(data);
        if(data && 'OK' == data.meta.msg) {
            if(0 < data.response.posts.length) {
                found = true;
                $('#live-media-video-15 .video-container').empty().append($('<div>', {
                    id: video.iframeId,
                }));
                video.videoId = data.response.posts[0].youtube.videoId;
                video.provider = new Youtube();
                video.vars.autoplay = 1;
                video.provider.init(video.videoId, video.iframeId, video.vars, false);
            }
        }
        if(!found) {
            $('#live-media-video-15 .video-container').empty().append($('<div>', {
                id: video.iframeId,
            }));
            video.provider = new Youtube();

            video.vars.autoplay = 1;
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
                for(var i in data.value.items) {
                    console.log('iteraring:',data[i]);
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

    $('#main-nav ul li a').on('click', function(e) {
        e.preventDefault();
    });

});

// YT Iframe API code downloads success event handler target
// see https://developers.google.com/youtube/iframe_api_reference
var onYouTubeIframeAPIReady = function() {
    video.provider.player = video.provider.setPlayer();
    video.ready = true;
}

