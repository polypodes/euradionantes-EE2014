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

    //var analyzer = new GoogleAnalyzer();
    //analyzer.init();

    var tumblr = new Tumblr(),
        $poster = $('.cold-tmblr-list'),
        $body = $('.cold-tmblr-body');

    tumblr.init($);

    tumblr.getPosts(function(data) {
        console.log($poster);
        if('OK' == data.meta.msg) {
            for(var i in data.response.posts) {
                // Let’s build that article list
                $poster.append($('<li data-index="'+i+'">').html(
                    '<a href="#">' + data.response.posts[i].title + '</a>'
                    + data.response.posts[i].summary
                    + '</li>'
                    )
                );
                // Let’s build those article’s bodys
                $body.append(
                    '<article class="cold-tmblr-article hidden" data-body="'+ i +'">'
                    + data.response.posts[i].body
                    + '</article>'
                );
            }
        }
        // Article swapping logic
        var $allArticles = $('.cold-tmblr-article');
        $('.cold-tmblr-article[data-body="0"]').removeClass('hidden');
        $('.cold-tmblr-list li').click(function() {
            $allArticles
                .addClass('hidden')
                .eq($(this).index())
                .removeClass('hidden');
        });
        // Same for the links
        $('.cold-tmblr-list li a').click(function(e) {
            e.preventDefault();
            $('.cold-tmblr-list li').click();
        });
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

    // $('#live-media-video .video-container').empty().html('<iframe src="http://www.glowbl.com/EGE" frameborder="0" style="width:100% height:100%"/>');

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
