if (Meteor.isClient) {
    Posts = new Mongo.Collection;
    var getPostTriggered = true;
    var smallestColumnOffset;

    var postItemCount = 40;

    var loading = $('.loading') ;
  
  
    Meteor.startup(function(){
        Session.set("rightContent", "tumblr");
        Session.set('t_offset', 0);
      
        $(window).resize(function(){
            $('.news').height($(window).height()-90);
            $('.loading').width($(window).width()-400);
        });

        $(window).on("scrollstop", scrollHandler);
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

    Template.loading.rendered = function(){
        $(this.firstNode).width($(window).width()-400);       
    }


  
    Template.tumblr.rendered = function(){
      console.log('Tumblr template rendered');
      $(this.firstNode.parentElement).attr('data-feed', 'tumblr');

    }
    
    Template.item.rendered = function(){

    }
    
    Template.tumblr.created = function(){
        $.get( "/getposts", {offset: 0},  function( data ) {
            console.log("from ajax");
            console.log(data)

        });
    }

    function scrollHandler() {
       var b = $(window).scrollTop() + $(window).height();
       if (b >= smallestColumnOffset || b >= $(document).height() ) {
           $(window).off("scrollstop");


           if(getPostTriggered){
               getPostTriggered = false;

               getPosts((Session.get('t_offset')));
           }

       };
    }

    function getColumnHeights() {
        for (var b = $(".column"), c = null, d = 0, e = b.length; e > d; d++) {
            var f = $(b[d]);

        }
    }

    function getPosts(o){
        var a = new Date();

        $('.loading').show();

        Meteor.call("getPosts", o, function(error, results) {
            if (error) {
                console.log(error);
            } else {
                $('.time').text(new Date() - a);
                console.log(results.length + 'items recieved with offset: ' + o );
                console.log(results);
                Session.set('t_offset', (Session.get('t_offset') + postItemCount));

                if(o == 0){
                    salvattore.register_grid($('.tumblr')[0]);
                }

                var arr = [];
                var fragment = $('<div />');
                for(var i=0; i < results.length; i++){

                    if(_.where(results[i].photos[0].alt_sizes, {width: 400}).length>0){
                        var url = _.where(results[i].photos[0].alt_sizes, {width: 400})[0].url;
                    } else {
                        continue;
                    }

                    var item = $(' <div class="box item">\
                                <img src="' + url + '" alt=""/>\
                                </div>');

                    fragment.append(item);
                    arr.push(item[0]);

                };

                fragment.imagesLoaded().done(function(a, b){
                  /*  for(var i=0; i < arr.length; i++){
                        salvattore.append_elements($('.tumblr')[0], [arr[i]]);
                    }*/
                    salvattore.append_elements($('.tumblr')[0], arr);


                    getColumnHeights();

                    $(window).on("scrollstop", scrollHandler);getPostTriggered = true;
                    $('.loading').hide();
                });

            }

        });
    }

    Template.tumblr.greeting = function () {
        return Posts.find() || [];
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

    Template.newslist.rendered = function(){
        $('.news').height($(window).height()-70);
    }

    Template.newslist.list = function(){
        return Session.get("news");
    }

    Template.strava.rendered = function(){
           $(this.firstNode.parentElement).attr('data-feed', 'strava');
    }
    
    
    Template.strava.created = function(){
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

    Template.stravaitem.style = function(){
        var subtle_grayscale = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
        var pale = [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}];
        var cool_grey = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}];
        var clean_grey = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#e3e3e3"}]},{"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#cccccc"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#FFFFFF"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}];

        var selected = subtle_grayscale    ;

        return get_static_style(selected);

        function get_static_style(styles) {
            var result = [];
            styles.forEach(function(v, i, a){
                var style='';
                if (v.stylers.length > 0) { // Needs to have a style rule to be valid.
                    style += (v.hasOwnProperty('featureType') ? 'feature:' + v.featureType : 'feature:all') + '|';
                    style += (v.hasOwnProperty('elementType') ? 'element:' + v.elementType : 'element:all') + '|';
                    v.stylers.forEach(function(val, i, a){
                        var propertyname = Object.keys(val)[0];
                        var propertyval = new String(val[propertyname]).replace('#', '0x');
                        style += propertyname + ':' + propertyval + '|';
                    });
                }
                result.push('style='+encodeURIComponent(style))
            });

            return result.join('&');
        }

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
