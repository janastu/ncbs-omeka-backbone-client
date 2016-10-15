/* Application router and controller */


var ApplicationRouter = Backbone.Router.extend({
	routes: {
		"": "home",
		"identity": "theme1",
		"identity?:query": "theme1"
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
	theme1: function(query) {
		//url pattern - > #theme1?sub-theme=name&state=""
		console.log(PAGES, app.state.view, query, "in theme 1");
		if(app.state.view){
			app.state.view.$el.html('');
		}
		this.itemsTestView = new ImageView({
			el: "#list-item", 
			template: "#listItems", 
			collection: this.content
		});
		setTimeout(this.itemsTestView.render, 1000);
		this.state.view=this.itemsTestView;

	},
	theme2: function(query){
		
	}
});


