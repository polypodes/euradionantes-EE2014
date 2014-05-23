"use strict"

var tumblr = false,
    videos = false,
    api = false,
    videoParams = {
        iframeClass: 'youtubeIframe',
        divId:    'youtubePlayer',
        tagId :         'iframe_api',
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
            'list': 'PL9xW6UUQnWBKvquSnA5z4AxfWrfyOZynQ',
            'listType': 'playlist',
        }
    };

jQuery('document').ready(function() {

    if(!tumblr) {
        tumblr = new Tumblr();
        tumblr.init($);
    }

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
        videoPlayersPause();
        $.scPlayer.stopAll();
        stopDailymotion();

    });

    // Tab click event Avoir/A écouter (stop dailymotion)
    $('.live-media .nav.nav-tabs').on('click', function(e) {
        // stop daylimotion
        stopDailymotion();
    });

    var stopDailymotion = function() {
        $('#dm_jukebox_iframe').attr('src','');
        $('.active #dm_jukebox_iframe').attr('src', 'http://www.dailymotion.com/widget/jukebox?list[]=%2Fplaylist%2Fx37d08_euradionantes_tele-nantes%2F1&skin=default&autoplay=1&automute=0');
    };

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

    /*
     * YoutubeIframeApi init. Triggers players creation (see event below)
     * see https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
     */
    if(!api) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        tag.id = videoParams.tagId;
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }


});

// YT Iframe API code downloads success event handler target
// see https://developers.google.com/youtube/iframe_api_reference
var onYouTubeIframeAPIReady = function() {
    api = true;
    videos = videoPlayersCreate();
}

// YT Video players pausing
// Firefox stops it. see
// see https://developers.google.com/youtube/iframe_api_reference?hl=fr#Playback_status
var videoPlayersPause = function() {
    for (key in videos){
        if($.inArray(videos[key].player.getPlayerState(), [0,1,3])){ // 0 is strange but OK
            videos[key].player.pauseVideo();
        }
    }
}

// YT Video players creating
var videoPlayersCreate = function() {
    var videos = {
        '_9': {
            container: $('#live-media-video-9 .video-container'),
            divId: videoParams.divId + 9,
            div: $('<div>', {id: videoParams.divId + 9}),
            player: false,
        },
        '_15': {
            container: $('#live-media-video-15 .video-container'),
            divId: videoParams.divId + 15,
            div: $('<div>', {id: videoParams.divId + 15}),
            player: false,
        }
    }

    //--- May, 9th video playlist player
    if(0 < videos._9.container.length){
        videos._9.container.empty().append(videos._9.div);
        videos._9.player = new YT.Player(videos._9.divId, {
            playerVars: videoParams.vars
        });
    }
    //--- May, 15th video playlist player

   //--- May, 15th Tumblr Single Video

   if (!tumblr) {
       tumblr = new Tumblr();
       tumblr.init($);
   }

   tumblr.getVideos(function(data) {
       var found = false;

       if(data && 'OK' == data.meta.msg) {
           if(0 < data.response.posts.length) {
               found = true;
               if(0 < videos._15.container.length){
                   videos._15.container.empty().append(videos._15.div);

                   customParams = videoParams;
                   customParams.vars.list = false;
                   customParams.vars.listType = false;
                   customParams.vars.videoId = data.response.posts[0].youtube.videoId;

                   videos._15.player = new YT.Player(videos._15.divId, {
                       videoId: customParams.vars.videoId,
                       playVars: customParams.vars
                   });
               }
           }
       }
       if(!found) {
           // fallback to playlist
           if(0 < videos._15.container.length){
               videos._15.container.empty().append(videos._15.div);
               videos._15.player = new YT.Player(videos._15.divId, {
                   playerVars: videoParams.vars
               });
           }
       }
   });

   return videos;
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
