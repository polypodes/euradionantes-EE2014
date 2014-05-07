/**
 * Tumblr API Consumer
 * Author : LesPolypodes.com
 * License : MIT
 * Disclaimer: This depends on jQuery
 */
var Tumblr = function(){

    var params = {
        key:            'JF1gaswtw9E1npDP7mtDhBfhgsdxRrhovUBIF52VPJj13hnzFZ',
        base_url:       'http://api.tumblr.com/v2/blog/euradionantes-ep2014.tumblr.com/',
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

    var getVideos = function(callBack) {
        return getData('video', callBack);
    }

    var getPosts = function(callBack) {
        return getData('text', callBack);
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
                if(data.response.posts[i].body) {
                    var html = data.response.posts[i].body;
                    data.response.posts[i].summary = getSummary(html, params.summary_length);
                }
                if(data.response.posts[i].permalink_url) {
                    // we allow http/https/www/no www URLs:
                    var watch = "youtube.com/watch?v=";
                    if(data.response.posts[i].permalink_url.indexOf(watch) > -1) {
                        var url = data.response.posts[i].permalink_url;
                        var boom = url.split("=");
                        url = url.replace(watch,'youtube.com/embed/');
                        data.response.posts[i].youtube = {
                            embed: url,
                            videoId: boom[1]
                        }
                    }
                }
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
        getPosts: getPosts,
        getVideos: getVideos,
        getSummary: getSummary
    }

}
