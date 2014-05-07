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

    var analyzer = new GoogleAnalyzer();
    analyzer.init();

    var tumblr = new Tumblr(),
    $poster = $('#cold-tmblr .container');

    tumblr.init($);

    tumblr.getPosts(function(data) {
        if('OK' == data.meta.msg) {
            $poster = $('#cold-tmblr');
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
                $('#live-media-video .video-container').empty().append($('<div>', {
                    id: video.iframeId,
                }));
                video.videoId = data.response.posts[0].youtube.videoId;
                video.provider = new Youtube();
                video.provider.init(video.videoId, video.iframeId, video.vars, false);
            }
        }
    });

    // Tab click event handlers + consequences on video/audio players
    $('#tab-video').on('click', function(e){
        e.preventDefault();
        video.provider.player.playVideo();
        $.scPlayer.stopAll()
    });

    $('#tab-audio').on('click', function(e){
        e.preventDefault();
        video.provider.player.stopVideo();
    });



});

// YT Iframe API code downloads success event handler target
// see https://developers.google.com/youtube/iframe_api_reference
var onYouTubeIframeAPIReady = function() {
    video.provider.player = video.provider.setPlayer();
    video.ready = true;
}

