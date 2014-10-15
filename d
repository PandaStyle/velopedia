[33mcommit 9b0c422301be2848c214ddd993a649cec8a4d413[m
Author: Nemeth Zsolt <furion1@gmail.com>
Date:   Mon Oct 13 20:33:52 2014 -0400

    strava list design

[1mdiff --git a/.meteor/packages b/.meteor/packages[m
[1mindex cbba0fc..7b2b56a 100644[m
[1m--- a/.meteor/packages[m
[1m+++ b/.meteor/packages[m
[36m@@ -4,11 +4,11 @@[m
 # but you can also edit it by hand.[m
 [m
 standard-app-packages[m
[31m-autopublish[m
[31m-insecure[m
 jquery[m
 http[m
 underscore[m
 mrt:leaflet[m
 iron:router[m
[32m+[m[32mmrt:normalize.css[m
[32m+[m[32mnatestrauser:animate-css[m
 [m
[1mdiff --git a/client/client.js b/client/client.js[m
[1mindex 7173b4c..e6d7577 100644[m
[1m--- a/client/client.js[m
[1m+++ b/client/client.js[m
[36m@@ -2,9 +2,15 @@[m [mif (Meteor.isClient) {[m
 [m
     Meteor.startup(function(){[m
         Session.set("rightContent", "strava");[m
[32m+[m
[32m+[m[32m        $(window).resize(function(){[m
[32m+[m[32m            $('.news').height($(window).height()-70);[m
[32m+[m[32m        });[m
[32m+[m
     })[m
 [m
 [m
[32m+[m
     Template.header.events = {[m
         'click input': function(a, b, c){[m
             Session.set("rightContent", a.currentTarget.value);[m
[36m@@ -69,6 +75,10 @@[m [mif (Meteor.isClient) {[m
         return _.where(this.photos[0].alt_sizes, {width: 400})[0].url;[m
     }[m
 [m
[32m+[m[32m    Template.newslist.rendered = function(){[m
[32m+[m[32m        $('.news').height($(window).height()-70);[m
[32m+[m[32m    }[m
[32m+[m
     Template.newslist.list = function(){[m
         return Session.get("news");[m
     }[m
[36m@@ -92,6 +102,37 @@[m [mif (Meteor.isClient) {[m
         return this.map.summary_polyline;[m
     }[m
 [m
[32m+[m[32m    Template.stravaitem.style = function(){[m
[32m+[m[32m        var subtle_grayscale = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];[m
[32m+[m[32m        var pale = [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}];[m
[32m+[m[32m        var cool_grey = [{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"stylers":[{"hue":"#00aaff"},{"saturation":-100},{"gamma":2.15},{"lightness":12}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"lightness":24}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":57}]}];[m
[32m+[m[32m        var clean_grey = [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#e3e3e3"}]},{"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#cccccc"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#FFFFFF"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}];[m
[32m+[m
[32m+[m[32m        var selected = subtle_grayscale    ;[m
[32m+[m
[32m+[m[32m        return get_static_style(selected);[m
[32m+[m
[32m+[m[32m        function get_static_style(styles) {[m
[32m+[m[32m            var result = [];[m
[32m+[m[32m            styles.forEach(function(v, i, a){[m
[32m+[m[32m                var style='';[m
[32m+[m[32m                if (v.stylers.length > 0) { // Needs to have a style rule to be valid.[m
[32m+[m[32m                    style += (v.hasOwnProperty('featureType') ? 'feature:' + v.featureType : 'feature:all') + '|';[m
[32m+[m[32m                    style += (v.hasOwnProperty('elementType') ? 'element:' + v.elementType : 'element:all') + '|';[m
[32m+[m[32m                    v.stylers.forEach(function(val, i, a){[m
[32m+[m[32m                        var propertyname = Object.keys(val)[0];[m
[32m+[m[32m                        var propertyval = new String(val[propertyname]).replace('#', '0x');[m
[32m+[m[32m                        style += propertyname + ':' + propertyval + '|';[m
[32m+[m[32m                    });[m
[32m+[m[32m                }[m
[32m+[m[32m                result.push('style='+encodeURIComponent(style))[m
[32m+[m[32m            });[m
[32m+[m
[32m+[m[32m            return result.join('&');[m
[32m+[m[32m        }[m
[32m+[m
[32m+[m[32m    }[m
[32m+[m
     Template.stravaitem.distance = function(){[m
         return (this.distance/1000).toFixed(1)[m
     }[m
[1mdiff --git a/client/css/strava.css b/client/css/strava.css[m
[1mindex 9952f35..849e46d 100644[m
[1m--- a/client/css/strava.css[m
[1m+++ b/client/css/strava.css[m
[36m@@ -1,6 +1,7 @@[m
 /* CSS declarations go here */[m
 body {[m
[31m-    font-family: 'Montserrat', sans-serif;[m
[32m+[m[32m    font-family: 'Lato', sans-serif;[m
[32m+[m[32m    color: #333;[m
     background-color: #eee;[m
 }[m
 .map-item { height: 200px; width: 200px;}[m
[36m@@ -11,26 +12,44 @@[m [mbody {[m
     display: inline-block;[m
     padding: 10px;[m
     margin: 10px;[m
[32m+[m
[32m+[m[32m    -webkit-transition: all 0.2s ease-out;[m
[32m+[m[32m    -moz-transition: all 0.2s ease-out;[m
[32m+[m[32m    -ms-transition: all 0.2s ease-out;[m
[32m+[m[32m    -o-transition: all 0.2s ease-out;[m
[32m+[m[32m    transition: all 0.2s ease-out;[m
 }[m
 [m
[31m-.tile .profile-pic {[m
[32m+[m[32m.tile .desc {[m
[32m+[m[32m    position: absolute;[m
[32m+[m[32m    top: 20px;[m
[32m+[m[32m    left: 10px;[m
[32m+[m[32m    color: #fff;[m
[32m+[m[32m    display: none;[m
[32m+[m[32m}[m
 [m
[32m+[m[32m.tile .desc .activity-name {[m
[32m+[m[32m    font-size: 22px;[m
[32m+[m[32m    margin-top: 5px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.tile .profile-pic {[m
     display: inline-block;[m
[31m-    position: absolute;[m
[31m-    top: 5px;[m
[31m-    left: 15px;[m
[31m-    opacity: 01;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.tile .staticmap {[m
[32m+[m[32m    display: block;[m
 }[m
 [m
 .tile .profile-img {[m
     border-radius: 50%;[m
[31m-    margin: 10px 10PX 0 0;[m
[32m+[m[32m    margin: 15px 10px 0 0;[m
 }[m
 [m
 .tile .numbers  {[m
     display: inline-block;[m
     vertical-align: top;[m
[31m-    margin: 10px;[m
[32m+[m[32m    margin: 15px 10px 0 0;[m
 }[m
 [m
 .tile .distance  {[m
[36m@@ -41,7 +60,35 @@[m [mbody {[m
     display: inline-block;[m
 }[m
 [m
[31m-.tile .avg-speed {[m
[32m+[m[32m.tile .kudos_count {[m
     display: inline-block;[m
     margin-left: 10px;[m
 }[m
[32m+[m
[32m+[m[32m.tile .icon {[m
[32m+[m[32m    margin: 0 3px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.tile .icon-mountains{[m
[32m+[m[32m    font-size: 18px;[m
[32m+[m[32m    vertical-align: middle;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.tile .icon-like{[m
[32m+[m[32m    font-size: 14px;[m
[32m+[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.tile:hover {[m
[32m+[m[32m    background-color: #fc4c02;[m
[32m+[m[32m    color: #fff;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.tile:hover img.staticmap {[m
[32m+[m[32m    opacity: 0.1;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.tile:hover .desc {[m
[32m+[m[32m    display: block;[m
[32m+[m[32m}[m
[41m+[m
[1mdiff --git a/server/server.js b/server/server.js[m
[1mindex 4eed5e1..ede1b4c 100644[m
[1m--- a/server/server.js[m
[1m+++ b/server/server.js[m
[36m@@ -58,7 +58,7 @@[m [mif (Meteor.isServer) {[m
             }[m
             console.log("Finished, start sort");[m
 [m
[31m-            var filtered = _.filter(res, function(item){return  dateDiffInDays(new Date(), new Date(item.date)) > -2})[m
[32m+[m[32m            var filtered = _.filter(res, function(item){return  dateDiffInDays(new Date(), new Date(item.date)) > -3})[m
 [m
             var sorted = _.sortBy(filtered, function(item){return item.note_count}).reverse();[m
 [m
[1mdiff --git a/velopedia.css b/velopedia.css[m
[1mindex 76c6102..77f952b 100644[m
[1m--- a/velopedia.css[m
[1m+++ b/velopedia.css[m
[36m@@ -9,14 +9,21 @@[m [mheader {[m
     position: fixed;[m
     width: 100%;[m
     z-index: 10;[m
[32m+[m[32m    background-color: #A25757;[m
[32m+[m[32m    height: 50px;[m
 }[m
 [m
 header .header-wrapper {[m
[31m-    padding: 10px 10px 23px 10px;[m
[32m+[m[32m    padding: 0px 0px 23px 0px;[m
     background-color:  #f1f1f1;[m
     z-index: 5;[m
 }[m
 [m
[32m+[m[32mheader .header-inner {[m
[32m+[m[32m    background-color: #A36A6A;[m
[32m+[m[32m    padding: 10px;[m
[32m+[m[32m}[m
[32m+[m
 header .radios {[m
     float: right;[m
 }[m
[36m@@ -28,8 +35,30 @@[m [mheader .logo {[m
 .left {[m
     position: fixed;[m
     width: 400px;[m
[31m-    top: 60px;[m
[32m+[m[32m    top: 70px;[m
     left: 0;[m
[32m+[m[32m    height: 100%;[m
[32m+[m[32m    overflow-x: hidden;[m
[32m+[m[32m    margin-bottom: 20px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.left .news {[m
[32m+[m[32m    height: 100%;[m
[32m+[m[32m    overflow-y: auto;[m
[32m+[m[32m    padding-right: 15px;[m
[32m+[m[32m    overflow-x: hidden;[m
[32m+[m[32m    width: 415px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.cont {[m
[32m+[m[32m    margin: 10px 15px 10px 10px;[m
[32m+[m[32m    padding: 10px;[m
[32m+[m[32m    background-color: #fff;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.cont a {[m
[32m+[m[32m    color: inherit;[m
[32m+[m[32m    text-decoration: none;[m
 }[m
 [m
 [m
[36m@@ -37,7 +66,7 @@[m [mheader .logo {[m
     position: absolute;[m
     left: 400px;[m
     max-width: 1520px;[m
[31m-    margin: 60px 20px;[m
[32m+[m[32m    margin: 70px 20px;[m
 }[m
 [m
 .right[data-feed="tumblr"] {[m
[36m@@ -69,20 +98,6 @@[m [mheader .logo {[m
     display: block;[m
 }[m
 [m
[31m-.left {[m
[31m-    width: 400px;[m
[31m-}[m
[31m-[m
[31m-.cont {[m
[31m-    margin: 10px;[m
[31m-    padding: 10px;[m
[31m-    background-color: #fff;[m
[31m-    color: #444;[m
[31m-}[m
[31m-[m
[31m-.cont a {[m
[31m-    text-decoration: none;[m
[31m-}[m
 [m
 [m
 @media only screen and (min-width: 980px) {[m
[1mdiff --git a/velopedia.html b/velopedia.html[m
[1mindex 1b19852..0bc8e8f 100644[m
[1m--- a/velopedia.html[m
[1m+++ b/velopedia.html[m
[36m@@ -1,5 +1,6 @@[m
 <head>[m
     <title>velopedia</title>[m
[32m+[m[32m    <link href='http://fonts.googleapis.com/css?family=Lato:400,700,900' rel='stylesheet' type='text/css'>[m
 </head>[m
 [m
 <body>[m
[36m@@ -15,13 +16,14 @@[m
 <template name="header">[m
     <header>[m
         <div class="header-wrapper">[m
[31m-            <span class="logo">VELOPEDIA</span>[m
[31m-            <span>Loading time: <span class="time"></span></span>[m
[31m-[m
[31m-            <span class="radios">[m
[31m-                <input type="radio" name="switch" value="tumblr" />tumblr[m
[31m-                <input type="radio" name="switch" value="strava" checked/>strava[m
[31m-            </span>[m
[32m+[m[32m            <div class="header-inner">[m
[32m+[m[32m                <span class="logo">VELOPEDIA</span>[m
[32m+[m[32m                <span>Loading time: <span class="time"></span></span>[m
[32m+[m[32m                <span class="radios">[m
[32m+[m[32m                    <input type="radio" name="switch" value="tumblr" />tumblr[m
[32m+[m[32m                    <input type="radio" name="switch" value="strava" checked/>strava[m
[32m+[m[32m                </span>[m
[32m+[m[32m            </div>[m
         </div>[m
     </header>[m
 </template>[m
[36m@@ -46,7 +48,6 @@[m
 [m
 [m
 <template name="strava">[m
[31m-    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />[m
     {{#each list}}[m
     {{> stravaitem}}[m
     {{/each}}[m
[36m@@ -55,14 +56,16 @@[m
 [m
 <template name="stravaitem">[m
     <div class="tile">[m
[31m-        <!--<div class="map-item" id="{{id}}"></div> -->[m
[31m-        <img class="staticmap" src="https://maps.googleapis.com/maps/api/staticmap?size=400x400&maptype=terrain&path=weight:3%7Ccolor:orange%7Cenc:{{src}}" />[m
[31m-[m
[31m-        <div class="profile-pic"><img class="profile-img" src="{{athlete.profile_medium}}" /></div>[m
[32m+[m[32m        <div class="desc">[m
[32m+[m[32m            <div class="athlete-name">{{athlete.firstname}} {{athlete.lastname}}</div>[m
[32m+[m[32m            <div class="activity-name">{{name}}</div>[m
[32m+[m[32m        </div>[m
[32m+[m[32m        <img class="staticmap" src="https://maps.googleapis.com/maps/api/staticmap?size=250x250&maptype=terrain&path=weight:3%7Ccolor:0xff0000ff%7Cenc:{{src}}&key=AIzaSyAPFGBr9K2wsB_K6YmOW1Y_QykwzAoS1IE" />[m
[32m+[m[32m        <img class="profile-img" src="{{athlete.profile_medium}}" />[m
         <div class="numbers">[m
             <div class="distance">{{distance}} km</div>[m
[31m-            <div class="elevation">{{total_elevation_gain}} m</div>[m
[31m-            <div class="avg-speed">{{average_speed}} km/h</div>[m
[32m+[m[32m            <div class="elevation"><span class="icon icon-mountains"></span>{{total_elevation_gain}} m</div>[m
[32m+[m[32m            <div class="kudos_count"><span class="icon icon-like"></span>{{kudos_count}}</div>[m
         </div>[m
     </div>[m
 </template>[m
[36m@@ -85,9 +88,11 @@[m
 [m
 [m
 <template name="newslist">[m
[31m-    {{#each list}}[m
[31m-    {{> newsitem}}[m
[31m-    {{/each}}[m
[32m+[m[32m    <div class="news">[m
[32m+[m[32m        {{#each list}}[m
[32m+[m[32m        {{> newsitem}}[m
[32m+[m[32m        {{/each}}[m
[32m+[m[32m    </div>[m
 </template>[m
 [m
 <template name="newsitem">[m
