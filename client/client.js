if (Meteor.isClient) {

    Meteor.startup(function(){
        Session.set("rightContent", "strava");
    })


    Template.header.events = {
        'click input': function(a, b, c){
            Session.set("rightContent", a.currentTarget.value);
        }
    }

    Template.right.tumblrIsVisible = function(){
        return Session.get("rightContent") == "tumblr";
    };

    Template.right.stravaIsVisible = function(){
        return Session.get("rightContent") == "strava";
    };


    Template.tumblr.created = function(){
        $('.right').attr('data-feed', 'tumblr');
        var a = new Date();
        Meteor.call("getPosts", function(error, results) {
            if (error) {
                console.log(error);
            } else {
                $('.time').text(new Date() - a);
                console.log(results);

                Session.set("posts", results);
            }
        });
    }

    Template.tumblr.greeting = function () {
        return Session.get("posts") || [];
    };

    Template.tumblr.hasSize = function () {

        return _.where(this.photos[0].alt_sizes, {width: 400}).length>0 ? true : false;
    };



    Template.newslist.created = function(){
        Meteor.call("getNews", function(error, results) {
            if (error) {
                console.log(error);
            } else {
                var parsed = $.parseXML(results.content);
                var items = $(parsed).find('item');

                arr = _.map(items, function(el){
                    return {title: $(el).find('title').html(), link :$(el).find('link').html()};
                });
                console.log(arr);

                Session.set("news", arr);
            }
        });
    }

    Template.item.url = function(){

        return _.where(this.photos[0].alt_sizes, {width: 400})[0].url;
    }

    Template.newslist.list = function(){
        return Session.get("news");
    }

    Template.strava.created = function(){
        $('.right').attr('data-feed', 'strava');
        var token = localStorage.getItem('stravaAccessToken');

        if(!token){
            console.log('not strava authorized user');
            return;
        }
        Meteor.call('fetchFromService', token, cb);
    }

    Template.strava.list = function(){
        return Session.get("stravaLogs");
    }

    Template.stravaitem.src = function(){
        return this.map.summary_polyline;
    }

    Template.stravaitem.distance = function(){
        return (this.distance/1000).toFixed(1)
    }

    function cb(err, respJson){
        if(err) {
            window.alert("Error: " + err.reason);
            console.log("error occured on receiving data on server. ", err );
        } else {
            console.log(respJson);
            for(var i = 0; i < respJson.length; i++){
                Session.set("stravaLogs", respJson);
                if(respJson[i].type != "Ride"){
                    continue;
                }
            }


        }
    }

    Router.map(function () {
        this.route('stravalogin');  // By default, path = '/about', template = 'about'
        this.route('stravaauth', {
            path: '/stravaauth',
            action: function(){
                if(this.params){
                    var code = this.params.code;
                    Meteor.call('tokenExchange', code, function(error, results) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Success' + results.access_token);
                            localStorage.setItem('stravaAccessToken', results.access_token);
                            Router.go('/');
                        }
                    });

                } else {
                    console.log('this.params undefined')
                }


            }
        });
        this.route('home', {
            path: '/'  //overrides the default '/home'
        });
    });



}
