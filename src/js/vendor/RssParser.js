/**
 * Rss Parser
 * Author : LesPolypodes.com
 * License : MIT
 * Disclaimer: This depends on jQuery
 */
var RssParser = function(){

    var params = {
        feed: 'http://pipes.yahoo.com/pipes/pipe.run?_id=a7a5b8f009647f559b54107dbcec9002&_render=json',
    };
    var jQuery;

    /**
     * Init function
     * @public
     * @param Object $ Jquery
     * @param string feed url
     */
    var init = function($, feed) {
        jQuery = $;
        params.feed = feed || params.feed;
    }

    /**
     * Get all entries
     * @public
     * @param string url feed
     * @param function callback
     * @see http://stackoverflow.com/a/6271906/490589
     *
     * @return JSON object
     */
    function parse(callback) {
        $.ajax({
            url: params.feed,
            dataType: 'json',
            success: function(data) {
                if(typeof callback != 'undefined') {
                    callback(data);
                }
            }
        });
    }

    /**
     * Grab authoring name from url source
     * ex: "http://www.yahoo.com/foo/bar?baz=1" => "Yahoo.com"
     * @public
     * @param string url
     *
     * @return string author name
     */
    var getAuthor = function(url) {
        var author = url.split('http://')[1].replace('www.','');
        if(author.indexOf('/') > -1) {
            author = author.split('/')[0];
        }

        return author.charAt(0).toUpperCase() + author.slice(1);
    }

    /**
     * Exposes public methods only
     */
    return {
        init:init,
        parse: parse,
        getAuthor: getAuthor,
    }

}
