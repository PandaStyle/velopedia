if (Meteor.isClient) {

    Meteor.startup(function(){
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
    })

    Template.hello.greeting = function () {
       return Session.get("posts") || [];
    };

    Template.hello.hasSize = function () {

        return _.where(this.photos[0].alt_sizes, {width: 400}).length>0 ? true : false;
    };

    Template.item.url = function(){

        return _.where(this.photos[0].alt_sizes, {width: 400})[0].url;
    }

    Template.newslist.list = function(){
        return Session.get("news");
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
