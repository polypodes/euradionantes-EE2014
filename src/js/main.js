"use strict"

var video = {
    provider: false,
    videoId: false,
    currentPlayer: false,
    iframeClass: 'youtubeIframe',
    iframeId:    'youtubePlayer',
    vars: {'autoplay':1, 'rel':0, 'showinfo':0, 'egm':0, 'showsearch':0,}

}

jQuery('document').ready(function() {

    var $posts = $('#cold-tmblr'),
        $feeds = $('#feeds');

    //--- Posts ----------------------------------------------
    if(0 < $posts.length) {
        var tumblr = new Tumblr();
        tumblr.init($);
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
        tumblr.getVideos(function(data) {
            if('OK' == data.meta.msg) {
                /*
                 if(0 < data.response.posts.length) {
                     $('#live-media-video .video-container').empty().append($('<div>', {
                         id: video.iframeId,
                     }));
                     video.videoId = data.response.posts[0].youtube.videoId;
                     video.provider = new Youtube();
                     video.provider.init(video.videoId, video.iframeId, video.vars, false);
                 }
                 */
            }
        });
    }

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

    // $('#live-media-video .video-container').empty().html('<iframe src="http://www.glowbl.com/EGE" frameborder="0" style="width:100% height:100%"/>');

    //--- Tabs ----------------------------------------------
    // Tab click event handlers + consequences on video/audio players
    $('#tab-video').on('click', function(e){
        e.preventDefault();
        //video.provider.player.playVideo();
        $.scPlayer.stopAll()
    });

    $('#tab-audio').on('click', function(e){
        e.preventDefault();
        //video.provider.player.stopVideo();
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

