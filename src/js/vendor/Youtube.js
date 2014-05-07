/**
 * Youtube API Consumer
 * Author : LesPolypodes.com
 * License : MIT
 */
var Youtube = function(){

    /**
     * Play/Pause any iframe-included Youtube Player
     *
     * @param string (container's) id
     * @param boolean play ( = play/pause)
     */
    function toggleVideo(id, play) {
        // if state == 'hide', hide. Else: show video
        var container = document.getElementById(id);
        var iframe = container.getElementsByTagName("iframe")[0].contentWindow;
        var func = play ? 'pauseVideo' : 'playVideo';

        iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
    }

    /**
     * Exposes public methods only
     */
    return {
        init:init,
        toggleVideo: toggleVideo,
    }

}
