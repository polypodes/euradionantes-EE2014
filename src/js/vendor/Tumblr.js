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
            summary_length: 200,
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
                return callBack(decorate(data));
            }
        });
    }

    /**
     * Decorate data items: text transforming, etc.
     *
     * @param Array data
     *
     * @return data items
     */
     var decorate = function(data) {
        if(0 < data.response.posts.length) {
            for(var i in data.response.posts) {
                var html = data.response.posts[i].body;
                data.response.posts[i].summary = getSummary(html, params.summary_length);
            }
            return data;
        }
    }

    /**
     * Return stripped shorten versino of an html string
     * source: http://stackoverflow.com/a/1199420/490589
     *
     * @param jQueryObj $
     * @param string html
     * @param int length
     *
     * @return string
     */
    var getSummary = function(html, len) {
        var str = html.replace(/(<([^>]+)>)/ig, "");
        return str.length > len ? str.substr(0,len-1)+'&hellip;' : str;
    }

    /**
     * Exposes public methods only
     */
    return {
        init:init,
        getUrl: getUrl,
        getData: getData,
        getSummary: getSummary
    }

}
