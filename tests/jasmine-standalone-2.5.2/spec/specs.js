
$(function(){

/* Router testing Begin */
	describe("AppRouter routes", function() {
	  beforeEach(function() {
	    this.router = new ApplicationRouter;
	    this.routeSpy = sinon.spy();
	    try {
	      Backbone.history.start({silent:true, pushState:true});
	    } catch(e) {}
	    this.router.navigate("elsewhere");
	  });

	  describe("Index handler", function() {
	  	beforeEach(function(){
	  		this.homeViewStub = sinon.stub(window.app, "HomeView")
	  							.returns(new Backbone.View());
	  		this.router.home();
	  	});


	  it("fires the home route with a blank hash", function() {
	    this.router.bind("route:home", this.routeSpy);
	    this.router.navigate("", true);
	    expect(this.routeSpy).toHaveBeenCalledOnce();
	    expect(this.routeSpy).toHaveBeenCalledWith();
	  });

	  

	  	it("creates a home page view", function(){
	  		expect(this.homeViewStub).toHaveBeenCalledOnce();
	  	});

	  	afterEach(function() {
	  	    window.app.HomeView.restore();
	  	    //window.app.aboutView.restore();
	  	  });
	  });

	  
	  //ABout page
	  describe("About handler", function() {
	  	beforeEach(function(){
	  		this.aboutViewStub = sinon.stub(window.app, "aboutView")
	  		 					.returns(new Backbone.View());
	  		this.router.about();
	  	});

	  it("fires the About route", function() {
	    this.router.bind("route:about", this.routeSpy);
	    this.router.navigate("about", true);
	    expect(this.routeSpy).toHaveBeenCalledOnce();
	    expect(this.routeSpy).toHaveBeenCalledWith();
	  });

	

	  	it("creates a About page view", function(){
	  		expect(this.aboutViewStub).toHaveBeenCalledOnce();
	  	});

	  	afterEach(function() {
	  	    window.app.aboutView.restore();
	  	  });
	  });

	  describe("Identity Theme handler", function() {
	  	beforeEach(function(){
	  		this.collection = new Backbone.Collection();
	  		/*this.omekaCollectionStub = sinon.stub(window, "collectionProto");
	  		this.fetchStub = sinon.stub(this.omekaCollectionStub, "fetch")
	  		      .returns(null);*/
	  		this.themeViewStub = sinon.stub(window.app, "ThemeTabs")
	  							.returns(new Backbone.View());
	  		this.router.theme1();
	  	});


	  it("fires the Identity theme", function() {
	    this.router.bind("route:theme1", this.routeSpy);
	    this.router.navigate("identity", true);
	    expect(this.routeSpy).toHaveBeenCalledOnce();
	    expect(this.routeSpy).toHaveBeenCalledWith();
	  });

	  

	  	it("creates a Identity page view", function(){
	  		expect(this.themeViewStub).toHaveBeenCalledOnce();
	  		/*expect(this.themeViewStub).toHaveBeenCalledWith({
	  			collection: this.collection
	  		});*/
	  	});

	  	afterEach(function() {
	  	    window.app.ThemeTabs.restore();
	  	    //window.app.omekaCollections.restore();
	  	  });
	  });
	});
/* Router testing End*/

/* Views testing start */
describe("Home view", function(){
	
	beforeEach(function(){
		this.view = new app.HomeView();	
	});

	describe("instantiation", function() {
		it("should exist", function(){
			expect(this.view).toBeDefined();
		});

		it("Should create a Div element", function() {
		      expect(this.view.el.nodeName).toBe("DIV");
		});

	});
	describe("render home", function(){
		beforeEach(function () {
		       this.view.render();
		   });
		it("Has Children", function(){
			expect(this.view.$el.children().length).toEqual(1);
		});
		it("ID to be content", function(){
			expect(this.view.el.id).toEqual("content");
		});
		
	});
	
});


describe("About view", function(){
	
	beforeEach(function(){
		this.view = new app.aboutView();	
	});

	describe("instantiation", function() {
		it("should exist", function(){
			expect(this.view).toBeDefined();
		});

		it("Should create a Div element", function() {
		      expect(this.view.el.nodeName).toBe("DIV");
		});

	});
	describe("render about", function(){
		beforeEach(function () {
		       this.view.render();
		   });
		it("Has Children", function(){
			expect(this.view.$el.children().length).toEqual(1);
		});

		it("Has text nodes", function(){
			expect(this.view.el.TEXT_NODE).toEqual(3);
		});

		it("ID to be content", function(){
			expect(this.view.el.id).toEqual("content");
		});
		
	});
	
});
/* Views testing end */

}); //end window on load

