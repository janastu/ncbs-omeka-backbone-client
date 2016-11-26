/* Application router and controller */
//TODO: url pattern - > #theme1?sub-theme=name&state=""

var ApplicationRouter = Backbone.Router.extend({
	routes: {
		"": "home",
		"about": "about",
		"identity": "theme1",
		"identity?:query": "theme1",
		"institution-building": "theme2",
		"growth": "theme3",
		"research": "theme4",
		"education": "theme5",
		"ripple-effect": "theme6",
		"intersections": "theme7",
		"*notfound": "notfound"
	},
	initialize: function() {
		$('#ncbs-content-policy').modal();
		//$("#spinner-launch").toggle();
		
		this.unmountAndMountViews = function(newViewConfig) {
			if(this.currentView){
				if(this.currentView.mediaHandler){
					//to cleanup all child views of tabsview, like the img subviews, video subview
					// and gallery views
					_.each(this.currentView.mediaHandler.imgSlideSubViews, function(imgviewNode){
						imgviewNode.unbind();
						imgviewNode.remove();
					});
					//to cleanup all video nodes from tabsview
					_.each(this.currentView.mediaHandler.videoSubview, function(videoNode){
						videoNode.unbind();
						videoNode.remove();
					});
					//clean up Gallery view
					this.currentView.mediaHandler.Gallery.unbind();
					this.currentView.mediaHandler.Gallery.remove();
				}
				
				//cleanup the tabs view or the content node
				this.currentView.unbind();
				this.currentView.remove();
			}
			//clean up audio player on route change
			if(app.currentAudio){
				app.currentAudio.unbind();
				app.currentAudio.remove();
				//app.currentAudio = null;
			}
			if(newViewConfig !== "home" && newViewConfig !== "about" && newViewConfig !== "notfound"){
				this.currentView = new app.ThemeTabs(newViewConfig);
				this.currentView.render();
			} 
		}
	},
	home: function() {
	
		this.unmountAndMountViews("home");
		this.currentView = new app.HomeView();
		this.currentView.render();
		//this.state.view=this.homeView;

	},
	about: function(){
		this.unmountAndMountViews("about");
		this.currentView = new app.aboutView();
		this.currentView.render();
	},
	theme1: function(query) {
		//call view cleanup to unbind stale views and instantiate new view
		// arguments is the view options
		this.unmountAndMountViews({
			collection: app.omekaCollections, 
			tag: "1-*"
		});
	},
	theme2: function(query){
		this.unmountAndMountViews({
			collection: app.omekaCollections, 
			tag: "2-*"
		});
	},
	theme3: function(query){
		this.unmountAndMountViews({
			collection: app.omekaCollections, 
			tag: "3-*"
		});
	},
	theme4: function(query){
		this.unmountAndMountViews({
			collection: app.omekaCollections, 
			tag: "4-*"
		});
	},
	theme5: function(query){
		this.unmountAndMountViews({
			collection: app.omekaCollections, 
			tag: "5-*"
		});
	}, 
	theme6: function(query){
		this.unmountAndMountViews({
			collection: app.omekaCollections, 
			tag: "6-*"
		});
	},
	theme7: function(query){
		this.unmountAndMountViews({
			collection: app.omekaCollections, 
			tag: "7-*"
		});
	},
	notfound: function(){
		this.unmountAndMountViews("notfound");
		console.log("notfound");
		this.currentView = new pageNotFound();
	}
});


