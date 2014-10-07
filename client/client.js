if (Meteor.isClient) {

    Meteor.startup(function(){
        Session.set("rightContent", $('input[name=switch]').val());
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
        Meteor.call('fetchFromService', cb);
    }

    Template.strava.list = function(){
        return Session.get("stravaLogs");
    }

    Template.stravaitem.rendered = function(){

        if(!this.data.map.summary_polyline){
            console.log("NO POLYLINE: ", this);
        } else {
            var encodedPolyline = this.data.map.summary_polyline.replace(/\\/g, '&#92;');
            //debugger;
            var map = new L.Map( $(this.firstNode).find('#' +this.data.id)[0], {
                zoomControl: false,
                attributionControl: false,
                dragging: true,
                scrollWheelZoom: false
            });

            L.tileLayer.provider('Hydda.Full').addTo(map);

            var polyline = L.Polyline.fromEncoded(encodedPolyline, {color: 'red', weight: 2.5, opacity: 0.8, smoothFactor: 0.3}).addTo(map);

            map.fitBounds(polyline.getBounds());

        }
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


}
