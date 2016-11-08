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
			if(this.contentView){
				if(this.contentView.mediaContainer){
					_.each(this.contentView.mediaContainer.imgSlideSubViews, function(imgSubview){
						imgSubview.remove();
					});
				}
				if(this.contentView.Gallery){
					this.contentView.Gallery.remove();
				}
				this.contentView.remove();
			}
		}
	},
	home: function() {
	
		this.viewCleanup();
		this.contentView = new HomeView();
		this.contentView.render();
		//this.state.view=this.homeView;

	},
	about: function(){
		this.viewCleanup();
		this.contentView = new aboutView();
		this.contentView.render();
	},
	theme1: function(query) {
		this.viewCleanup();
		//url pattern - > #theme1?sub-theme=name&state=""
		
				this.contentView = new subthemeNav({
							collection: omekaCollections, 
							tag: "1-*", 
							content: APIcontent
							});
				this.contentView.render();
	},
	theme2: function(query){
		this.viewCleanup();
		this.contentView = new subthemeNav({
			collection: omekaCollections, 
			tag: "2-*", 
			content: APIcontent
		});
		this.contentView.render();
		
	},
	theme3: function(query){
		this.viewCleanup();
		this.contentView = new subthemeNav({
			collection: omekaCollections, 
			tag: "3-*", 
			content: APIcontent
		});
		this.contentView.render();
		
	},
	theme4: function(query){
		this.viewCleanup();
		this.contentView = new subthemeNav({
			collection: omekaCollections, 
			tag: "4-*", 
			content: APIcontent
		});
		this.contentView.render();
	},
	theme5: function(query){
		this.viewCleanup();
		this.contentView = new subthemeNav({
			collection: omekaCollections, 
			tag: "5-*", 
			content: APIcontent
		});
		this.contentView.render();
	}, 
	theme6: function(query){
		this.viewCleanup();
		this.contentView = new subthemeNav({
			collection: omekaCollections, 
			tag: "6-*", 
			content: APIcontent
		});
		this.contentView.render();
	},
	theme7: function(query){
		this.viewCleanup();
		this.contentView = new subthemeNav({
			collection: omekaCollections, 
			tag: "7-*", 
			content: APIcontent
		});
		this.contentView.render();
	}
});


