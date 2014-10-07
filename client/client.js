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
        Meteor.call('fetchFromService', cb);
    }

    Template.strava.list = function(){
      return Session.get("stravaLogs");
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

                var tile = $('<div class="tile">\
                            <div class="profile-pic"><img class="profile-img" src="' +  respJson[i].athlete.profile_medium + '" /></div>\
                            <div class="numbers">\
                               <div class="distance">' +  (respJson[i].distance/1000).toFixed(1) + ' km</div>\
                               <div class="elevation">' +  respJson[i].total_elevation_gain + ' m</div>\
                               <div class="avg-speed">' +  (respJson[i].average_speed*3.6).toFixed(1) + ' km/h</div>\
                            </div>\
                          </div>');

                var div = $('<div class="map-item" id="' + respJson[i].id + '">');
                tile.prepend(div);
               tile.appendTo(".map-list");



                if(!respJson[i].map.summary_polyline){
                    console.log("NO POLYLINE: ", respJson[i]);
                } else {
                    var encodedPolyline = respJson[i].map.summary_polyline.replace(/\\/g, '&#92;');
                    //debugger;
                    var map = new L.Map( $('#' + respJson[i].id)[0], {
                        zoomControl: false,
                        attributionControl: false,
                        dragging: false,
                        scrollWheelZoom: false
                    });

                    L.tileLayer.provider('Hydda.Full').addTo(map);

                    var polyline = L.Polyline.fromEncoded(encodedPolyline, {color: '#fc4c02', weight: 4, opacity: 0.8, smoothFactor: 1}).addTo(map);

                    map.fitBounds(polyline.getBounds());

                }


            }


        }
    }


}

/*
Meteor.call("getPosts", function(error, results) {
    if(error){
        console.log(error);
    } else {
        debugger;
        console.log(results.data.response.posts);
        Session.set("posts", results.data.response.posts);
    }

});*/
