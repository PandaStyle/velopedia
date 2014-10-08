
if (Meteor.isServer) {

    var APIKEY = 'OliOiDDbJHKwXQ4eBqFRP2u3XSU6YzQ15y5wgRYy1r0Js3sm8S';

    var cyclingNewsRss = 'http://feeds.feedburner.com/cyclingnews/news?format=xml',
        cyclingTipsRss = 'http://feeds.feedburner.com/cyclingtipsblog/TJog?format=xml';

    var urls = ["bokanev.tumblr.com",
                "hillsnotpills.tumblr.com",
                "bidonmagazin.tumblr.com",
                "embrocationcycling.tumblr.com",
                "coxcycling.tumblr.com",
                "theblueandred.tumblr.com",
                "laerodynamique.tumblr.com",
                "cyclocosm.tumblr.com",
                "thepacusworld.tumblr.com",
                "mountbuda.tumblr.com",
                "ironlegs.tumblr.com",
                "ototheo.tumblr.com"
                /*"twocirclescycling.tumblr.com",
                "designbennettrust.tumblr.com",
                "purecycling.tumblr.com",
                "cycloffee.tumblr.com",
                "manualforspeed.tumblr.com",
                "thestumpone.tumblr.com",
                "chrisgibson1985.tumblr.com",
                "podiumlegs.tumblr.com",
                "gaansari.tumblr.com",
                "cheekypeloton.tumblr.com",
                "cykln.tumblr.com"*/];





    Meteor.startup(function () {

    });

    Meteor.methods({
        getPosts: function () {

            this.unblock();

            var res = [];

            for(var i = 0; i < urls.length; i++) {
                var a = Meteor.http.call("GET", "http://api.tumblr.com/v2/blog/" + urls[i] + "/posts?api_key=" + APIKEY + "&type=photo");
                if(a.statusCode == 200){
                    res = res.concat(a.data.response.posts);
                } else {
                    console.log("error: " + a)
                }
            }
            console.log("Finished, start sort");

            var filtered = _.filter(res, function(item){return  dateDiffInDays(new Date(), new Date(item.date)) > -2})

            var sorted = _.sortBy(filtered, function(item){return item.note_count}).reverse();

            var unique = _.uniq(sorted, true, function(item){
                var correctSize = _.where(item.photos[0].alt_sizes, {width: 400});
                if(correctSize.length > 0) {
                    return correctSize[0].url;
                }
            });

            return _.first(unique, 60);
        },

        getNews: function () {
            var a = Meteor.http.call("GET", cyclingNewsRss);

            if(a.statusCode == 200){
                return a;
            } else {
                console.log("error: " + a)
            }
        },

        fetchFromService: function() {
            var token = "9b0ee979bc8ac6624040c69edabec731a6249597";
            var url = "https://www.strava.com/api/v3/activities/following";
            var LIMIT_PER_PAGE = 20;
            //synchronous GET
            var result = HTTP.get(url, {params: {access_token: token, page: 1, per_page: LIMIT_PER_PAGE}});

            if(result.statusCode==200) {
                var respJson = JSON.parse(result.content);
                console.log("response received.");
                return respJson;
            } else {
                console.log("Response issue: ", result.statusCode);
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        }
    });

    function dateDiffInDays(a, b) {
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        // Discard the time and time-zone information.
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

}
