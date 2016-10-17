/* Application router and controller */


var ApplicationRouter = Backbone.Router.extend({
	routes: {
		"": "home",
		"identity": "theme1",
		"identity?:query": "theme1",
		"institution-building": "theme2"
		//"*actions": "home"
	},
	initialize: function() {
		this.headerView = new HeaderView();
		this.headerView.render();
		this.footerView = new FooterView();
		this.footerView.render();

		// Site content from omeka api as required by the client 
		//interfaces.
		this.content = new Backbone.Collection;

	},
	home: function() {
		console.log("in home");
		if(app.state.view){
			app.state.view.$el.html('');
		}
		this.homeView = new HomeView({el: "#content"});
		this.homeView.render();
		this.state.view=this.homeView;
	},
	about: function(){
		this.dummyView = new DummyView({el: "#content"});
		this.dummyView.render();
	},
	theme1: function(query) {
		//url pattern - > #theme1?sub-theme=name&state=""
		console.log(omekaCollections, "in theme 1");
		this.tabsView = new subthemeNav({collection: omekaCollections, tag: "1-india-ps-1"});
		this.tabsView.render();
	},
	theme2: function(query){
		this.dummyView = new DummyView({el: "#content"});
		this.dummyView.render();
		
	},
	theme3: function(query){
		this.dummyView = new DummyView({el: "#content"});
		this.dummyView.render();
	},
	theme4: function(query){
		this.dummyView = new DummyView({el: "#content"});
		this.dummyView.render();
	},
	theme5: function(query){
		this.dummyView = new DummyView({el: "#content"});
		this.dummyView.render();
	}, 
	theme6: function(query){
		this.dummyView = new DummyView({el: "#content"});
		this.dummyView.render();
	},
	theme7: function(query){
		this.dummyView = new DummyView({el: "#content"});
		this.dummyView.render();
	}
});


