/**
 * Tumblr API Consumer
 * Author : LesPolypodes.com
 * License : MIT
 * Disclaimer: This depends on jQuery (for $.extends(), mainly)
 */
var Tumblr = function(){

    var params = {
            key:    'JF1gaswtw9E1npDP7mtDhBfhgsdxRrhovUBIF52VPJj13hnzFZ',
            base_url:  'http://api.tumblr.com/v2/blog/euradionantes-ee2014.tumblr.com/',
            default_type: 'posts',
        };
    var jQuery;

    /**
     * Init function
     * @public
     */
    var init = function($) {
        jQuery = $;
        return getData();
    }

    var getUrl = function () {
        return params.base_url + params.default_type + '?api_key=' + params.key;
    }

    var getData = function() {
        var api = getUrl();
        jQuery.getJSON( api, {})
            .done(function( data ) {
                jQuery.each( data.items, function( key, item ) {
                    console.log(key,data);
                });
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
