
/* Main views of the site are defined here - mainly, Home, about, Header, footer, subtheme(tabsview)
and story media view - sub views for media is defined in js/views.js*/
(function(){
	/* Global application object, with all the functions, it's instances, views, collections or data
	console log app to see its contents */

	app = window.app || {};

	// call to start the api requests to the Omeka server
	// will return true
	app.controller = AppController();

	// Site content required by the client interfaces.
	// the items, files and collections are put through makesitecontent method to add 
	// models to this app.APIcontent collection - and views will listen to this collection for rendering
	// particular media and meta content 
	var storyCollection = Backbone.Collection.extend({
		groupByTags: function(index){
			return this.groupBy(function(item){
				return item.get('tags').name.split('-')[index];
			}, index);
		}
	});
	app.APIcontent = new storyCollection;
	
	
	app.init = function() {
		app.router = new ApplicationRouter();
		Backbone.history.start();

		//loading a test image on router init so that the .htaccess login dialog will open on site launch
		//Loading the icons in background - as the load times in firefox was too slow - issue#36
		_.each(["https://www.ncbs.res.in/ncbs25/omeka/files/thumbnails/72e51417b77adaafccc6798ab6b2b136.jpg", "img/Assets/identity_inside-01.png", "img/Assets/instituin_inside-01.png",
					"img/Assets/growth_inside.png", "img/Assets/research-inside.png", "img/Assets/education_inside1.png",
					 "img/Assets/ripple_inside.png", "img/Assets/intersections_inside.png"], function(imgSrc){
					 	var backLoad = new Image();
					 	backLoad.src = imgSrc;
				});
	};

	app.init();


})(); // end window load



