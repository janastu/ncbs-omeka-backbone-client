
$(function(){

describe("Dummy view", function(){
	beforeEach(function(){
		this.view = new DummyView();
	});


	it("should exist", function(){
		expect(this.view).toBeDefined();
	});	
});



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
		
	});
	
});

});

/*describe("collection test", function(){
	beforeEach(function(){
		this.server = sinon.fakeServer.create();
		this.items = new collectionProto;
	});

	it("should make the correct request", function() {
	  this.items.fetch({url: PAGES.config.getOmekaItems});
	  expect(this.server.requests.length)
	    .toEqual(1);
	  expect(this.server.requests[0].method)
	    .toEqual("GET");
	  expect(this.server.requests[0].url)
	    .toEqual(PAGES.config.getOmekaItems);
	});
	afterEach(function() {
	  this.server.restore();
	});
});
*/