

if (Meteor.isServer) {
    var News = new Mongo.Collection;
    var Scratchpad = new Mongo.Collection;


    var tumblr = Meteor.npmRequire ('tumblr.js');
    var client = tumblr.createClient({
        consumer_key: 'g0tjMDWC1jHasbTkTdi6jkYz0lcBz9cPMUC3Fz8PnV6LUjmzBo',
        consumer_secret: 'KFKTyBlIZ6ZeIdBrais2ylfcp052DFnPSVlHQW3VXnb1jj1R5z',
        token: 'UXqgyWDhidYbH9nIsBg8r2DxQqKxDWmYAsjxiaDMDfYPVlqgIs',
        token_secret: 'nePBkXogpc7tWzW3E5z6htKPs48N6xJ2v4ldYX7AmhsuFB1Yyu'
    });


    var APIKEY = 'OliOiDDbJHKwXQ4eBqFRP2u3XSU6YzQ15y5wgRYy1r0Js3sm8S';

    var stravaAccessToken;

    var rssUrls = [
            {
                name:"cyclingNews",
                url:'http://feeds.feedburner.com/cyclingnews/news?format=xml',
                short: "cyclingnews.com"
            },
            {
                name: "cyclingTips",
                url:'http://feeds.feedburner.com/cyclingtipsblog/TJog?format=xml',
                short: "cyclingtips.com.au"
            },
            {
                name: "roadCc",
                url:'http://road.cc/all/feed',
                short: "road.cc"
            },
            {
                name: "roadCycling",
                url:'http://feeds2.feedburner.com/roadcycling/ZlDv',
                short: "roadcycling.com"
            },
            {
                name: "roadBikeAction",
                url:'http://roadbikeaction.com/feed',
                short: "roadbikeaction.com"
            }
    ];

    HTTP.publish({name: 'getnews'}, function(data) {

        if(News){
            News.remove({});
        }

        for(var j = 0; j < rssUrls.length; j++ ){
            var url = rssUrls[j].url;

            var res = Meteor.http.call("GET", url);

            if(res.statusCode == 200){

                xml2js.parseStringSync(res.content, function (err, result) {

                    var items = result.rss.channel[0].item;

                    var arr  = _.map(items, function(el){
                        return {
                            site: rssUrls[j]["name"],
                            title: el.title[0],
                            link: el.link[0],
                            date:new Date(el.pubDate[0]),
                            diff:  moment.duration(moment().diff(moment(new Date(el.pubDate[0])))).humanize(),
                            shortSiteName: rssUrls[j]["short"]
                        };
                    })

                    for(var i = 0; i < arr.length; i++){
                        News.insert(arr[i]);
                    }
                });

            } else {
                console.log("error on getNews: " + res)
            }
        }

        var a = News.find({}, {sort: {date: -1}});
        a.forEach(function (row) {
            console.log(row.diff, " --- ", row.site, " --- ", row.title);
        });
        return a;

    });

    // Add access points for `GET`
    HTTP.publish({name: 'getposts'}, function(data) {

        var offset = this.query.offset ? this.query.offset : 0;
console.log('offset: ' + offset);
        var startDate = moment();

        var r = Async.runSync(function(done) {
            client.dashboard({offset: offset, limit: 20, type: 'photo' }, function (err, data) {
                done(err, data);
            });
        });

        var concated = r.result.posts;

        Scratchpad.remove({});

        for(var i = 0; i < concated.length; i++){
            Scratchpad.insert(concated[i]);
        }

        console.log(concated.length + " items fetched from tumblr in" + moment().diff(startDate, 'milliseconds')+ "ms")

        return Scratchpad.find({});
    });



    /*Meteor.methods({

        getNews: function () {
            var a = Meteor.http.call("GET", roadCCRSS);

            if(a.statusCode == 200){
                return a;
            } else {
                console.log("error: " + a)
            }
        },

        fetchFromService: function(t) {
            var token = t;

            if(!token){
                throw new Meteor.Error(100, {reason: "NO Access token for strava"});
            }

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
        },

        tokenExchange: function(code){
            var client_id = 1016,
                client_secret = '2f90780737db3a91907ff7ac5200e46615a8b396',

                url =  'https://www.strava.com/oauth/token';

            var result = HTTP.post(url, {params: {client_id: client_id, client_secret: client_secret, code: code}});
            if(result.statusCode==200) {
                var respJson = JSON.parse(result.content);
                stravaAccessToken = result.content.access_token;
                console.log(result.content);
                return respJson;
            }else{
                console.log("Response issue: ", result.statusCode);
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        }
    });*/
}
