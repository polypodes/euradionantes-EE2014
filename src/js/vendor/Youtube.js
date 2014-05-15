/**
 * Youtube API Consumer
 * Author : LesPolypodes.com
 * License : MIT
 * Documentation: https://developers.google.com/youtube/iframe_api_reference
 */
var Youtube = function()
{

    var params = {
            tagId :         'iframe_api',
            playerId :      false,
            videoId :       false,
            vars: { // see https://developers.google.com/youtube/player_parameters?playerVersion=HTML5
            }
        },
        player = false;

    /**
     * initialize parameters
     * @param string videoId    Youtube video unique ID
     * @param string playerId   container (HTML Element) id
     * @param Obj vars          Youtube Iframe Api parameters
     * @param boolean play      video autoplay
     *
     */
    var init = function(videoId, playerId, vars, play) {
        params.videoId = videoId;
        params.playerId = playerId;
        params.vars = vars;
        if(video.api) {
            video.provider.player = video.provider.setPlayer();
        } else {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            tag.id = params.tagId;
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }

    /**
     * onYouTubeIframeAPIReady event handler target
     * Set YT.Player
     */
    var setPlayer = function() {
        player = new YT.Player(params.playerId, {
            videoId: params.videoId,
            events: {
                'onReady': onPlayerReady,
            },
            playerVars: params.vars
        });
        return player;
    }

    /**
     * YT.Player.events.onReady event handler target
     * Play video
     * Note we can pause the player using Youtube.player.stopVideo()
     */
    var onPlayerReady = function(event) {
        if(params.vars.autoplay == 1) {
            event.target.playVideo();
        }
    }

    var stopVideo = function() {
        player.stopVideo();
    }
    var playVideo = function() {
        player.playVideo();
    }



    /**
     * Exposes public methods only
     */
    return {
        params:     params,
        player:     player,
        setPlayer:  setPlayer,
        init:       init,
        playVideo:  playVideo,
        stopVideo:  stopVideo,
    }

}
