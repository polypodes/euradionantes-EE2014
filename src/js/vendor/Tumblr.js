/**
 * Tumblr API Consumer
 * Author : LesPolypodes.com
 * License : MIT
 * Disclaimer: This depends on jQuery (for $.extends(), mainly)
 */
var Tumblr = function(){

    var params = {
            key:    'JF1gaswtw9E1npDP7mtDhBfhgsdxRrhovUBIF52VPJj13hnzFZ',
            base_url:  'http://api.tumblr.com/v2/blog/euradionantes-ep2014.tumblr.com/',
        };
    var jQuery;

    /**
     * Init function
     * @public
     */
    var init = function($) {
        jQuery = $;
    }

    var getUrl = function (type) {
        return params.base_url + 'posts/' + type + '?api_key=' + params.key;
    }

    var getData = function(type, callBack) {
        jQuery.ajax({
            url: getUrl(type),
            dataType: 'jsonp',
            success: function(data){
                return callBack(data);
            }
        });
    }

    /**
     * Exposes public methods only
     */
    return {
        init:init,
        getUrl: getUrl,
        getData: getData
    }

}
