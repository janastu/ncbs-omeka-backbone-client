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
		//$('#ncbs-content-policy').modal();
		//$("#spinner-launch").toggle();
	},
	home: function() {
		console.log("in home");
		this.homeView = new HomeView({el: "#content"});
		this.homeView.render();
		//this.state.view=this.homeView;

	},
	about: function(){
		this.aboutPage = new aboutView();
		this.aboutPage.render();
	},
	theme1: function(query) {
		//url pattern - > #theme1?sub-theme=name&state=""
		console.log(APIcontent);
		
				this.tabsView = new subthemeNav({
							collection: omekaCollections, 
							tag: "1-*", 
							content: APIcontent
							});
				this.tabsView.render();
	},
	theme2: function(query){
		
		this.tabsView = new subthemeNav({
			collection: omekaCollections, 
			tag: "2-*", 
			content: APIcontent
		});
		this.tabsView.render();
		
	},
	theme3: function(query){
		this.tabsView = new subthemeNav({
			collection: omekaCollections, 
			tag: "3-*", 
			content: APIcontent
		});
		this.tabsView.render();
		
	},
	theme4: function(query){
		this.tabsView = new subthemeNav({
			collection: omekaCollections, 
			tag: "4-*", 
			content: APIcontent
		});
		this.tabsView.render();
	},
	theme5: function(query){
		this.tabsView = new subthemeNav({
			collection: omekaCollections, 
			tag: "5-*", 
			content: APIcontent
		});
		this.tabsView.render();
	}, 
	theme6: function(query){
		this.tabsView = new subthemeNav({
			collection: omekaCollections, 
			tag: "6-*", 
			content: APIcontent
		});
		this.tabsView.render();
	},
	theme7: function(query){
		this.tabsView = new subthemeNav({
			collection: omekaCollections, 
			tag: "7-*", 
			content: APIcontent
		});
		this.tabsView.render();
	}
});


