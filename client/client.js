if (Meteor.isClient) {

    Meteor.startup(function(){
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
