

if (Meteor.isServer) {

    var tumblr = Meteor.npmRequire ('tumblr.js');
    var client = tumblr.createClient({
        consumer_key: 'g0tjMDWC1jHasbTkTdi6jkYz0lcBz9cPMUC3Fz8PnV6LUjmzBo',
        consumer_secret: 'KFKTyBlIZ6ZeIdBrais2ylfcp052DFnPSVlHQW3VXnb1jj1R5z',
        token: 'UXqgyWDhidYbH9nIsBg8r2DxQqKxDWmYAsjxiaDMDfYPVlqgIs',
        token_secret: 'nePBkXogpc7tWzW3E5z6htKPs48N6xJ2v4ldYX7AmhsuFB1Yyu'
    });


    var APIKEY = 'OliOiDDbJHKwXQ4eBqFRP2u3XSU6YzQ15y5wgRYy1r0Js3sm8S';

    var stravaAccessToken;

    var cyclingNewsRss = 'http://feeds.feedburner.com/cyclingnews/news?format=xml',
        cyclingTipsRss = 'http://feeds.feedburner.com/cyclingtipsblog/TJog?format=xml',
        roadCCRSS = 'http://road.cc/all/feed';

    // Add access points for `GET`
    HTTP.publish({name: 'getposts'}, function(data) {
        var offset = data ? data.offset : 0;

        var startDate = moment();

        var r = Async.runSync(function(done) {
            client.dashboard({offset: offset, limit: 20, type: 'photo' }, function (err, data) {
                done(err, data);
            });
        });

        var k = Async.runSync(function(done) {
            client.dashboard({offset: offset+20, limit: 20, type: 'photo' }, function (err, data) {
                done(err, data);
            });
        });

        var concated = r.result.posts.concat(k.result.posts);

        var Scratchpad = new Mongo.Collection;
        for(var i = 0; i < concated.length; i++){
            Scratchpad.insert(concated[i]);
        }

        console.log(concated.length + " items fetched from tumblr in" + moment().diff(startDate, 'milliseconds')+ "ms")

        return Scratchpad.find({});
    });

    Meteor.methods({

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
    });


}
