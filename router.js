/* Application router and controller */


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
		"intersections": "theme7"
		//"*actions": "home"
	},
	initialize: function() {
		$('#ncbs-content-policy').modal();
		//$("#spinner-launch").toggle();
		
		this.viewCleanup = function() {
			if(this.currentView){
				if(this.currentView.mediaHandler){
					//to cleanup all the img subviews from the tabsview
					_.each(this.currentView.mediaHandler.imgSlideSubViews, function(imgviewNode){
						imgviewNode.unbind();
						imgviewNode.remove();
					});
					//to cleanup all video nodes from tabsview
					_.each(this.currentView.mediaHandler.videoSubview, function(videoNode){
						videoNode.unbind();
						videoNode.remove();
					});
				}
				//clean up Gallery view
				if(this.currentView.Gallery){
					this.currentView.Gallery.unbind();
					this.currentView.Gallery.remove();
				}
				//cleanup the tabs view or the content node
				this.currentView.unbind();
				this.currentView.remove();
			}
			//clean up audio player on route change
			if(app.currentAudio){
				app.currentAudio.unbind();
				app.currentAudio.remove();
			}
		}
	},
	home: function() {
	
		this.viewCleanup();
		this.currentView = new app.HomeView();
		this.currentView.render();
		//this.state.view=this.homeView;

	},
	about: function(){
		this.viewCleanup();
		this.currentView = new app.aboutView();
		this.currentView.render();
	},
	theme1: function(query) {
		this.viewCleanup();
		//url pattern - > #theme1?sub-theme=name&state=""
		
				this.currentView = new app.ThemeTabs({
							collection: app.omekaCollections, 
							tag: "1-*", 
							content: app.APIcontent
							});
				this.currentView.render();
	},
	theme2: function(query){
		this.viewCleanup();
		this.currentView = new app.ThemeTabs({
			collection: app.omekaCollections, 
			tag: "2-*", 
			content: app.APIcontent
		});
		this.currentView.render();
		
	},
	theme3: function(query){
		this.viewCleanup();
		this.currentView = new app.ThemeTabs({
			collection: app.omekaCollections, 
			tag: "3-*", 
			content: app.APIcontent
		});
		this.currentView.render();
		
	},
	theme4: function(query){
		this.viewCleanup();
		this.currentView = new app.ThemeTabs({
			collection: app.omekaCollections, 
			tag: "4-*", 
			content: app.APIcontent
		});
		this.currentView.render();
	},
	theme5: function(query){
		this.viewCleanup();
		this.currentView = new app.ThemeTabs({
			collection: app.omekaCollections, 
			tag: "5-*", 
			content: app.APIcontent
		});
		this.currentView.render();
	}, 
	theme6: function(query){
		this.viewCleanup();
		this.currentView = new app.ThemeTabs({
			collection: app.omekaCollections, 
			tag: "6-*", 
			content: app.APIcontent
		});
		this.currentView.render();
	},
	theme7: function(query){
		this.viewCleanup();
		this.currentView = new app.ThemeTabs({
			collection: app.omekaCollections, 
			tag: "7-*", 
			content: app.APIcontent
		});
		this.currentView.render();
	}
});


