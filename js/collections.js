
/* Collections and controller */



$.ajaxSetup({
beforeSend: function(jqXHR) {
    jqXHR.crossDomain ={
        crossDomain: true
    };    
},
success:function(result, status, xhr){
	console.log(result, status, xhr, "setup");

},
error: function(result, status, xhr){
		console.log(xhr, status, error, "error setup");
	}
});


AppController = function(){
	window.content=[];
	var files_done = false;
	var items_done = false;
	var collections_done = false;
	
	window.PAGES = {};
// API end points for the server
	PAGES.config = {
		getOmekaCollections: 'https://www.ncbs.res.in/ncbs25/omeka/api/collections',
		getOmekaFiles: "https://www.ncbs.res.in/ncbs25/omeka/api/files",
		getOmekaItems: 'https://www.ncbs.res.in/ncbs25/omeka/api/items',
		getOmekaContext: 'https://www.ncbs.res.in/ncbs/api/elements.json'
	};


	function checkMakeSiteContent(typ) {
		switch(typ) {
			case 'files':
				files_done = true;
			case 'collections':
				collections_done = true;
			case 'items':
				items_done = true;
		}
		if (files_done && collections_done &&  items_done)
			app.omekaItems.makeSiteContent();

	}

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
	

	
//omeka files collection
	var FilesCollection = Backbone.Collection.extend({
		getFileUrlsById: function(id){
		
			return this.find(function(model){ 
				if(model.get('item').id == id) { 
					return model;
				}
			}, id);
		
		}
	});
	// instance with omeka files content
	app.files = new FilesCollection;
	app.files.fetch({
		cache: true,
		//expires: 43200,
		//prefill: true,
		url: PAGES.config.getOmekaFiles
	}).then(function(response){
		checkMakeSiteContent('files');
	});

	

//A protoyype collection for omeka items and omeka collections with common methods
	var collectionProto = Backbone.Collection.extend({
	
		filterItemsByTag: function(tag){
			this.filter(function(model){
				if(model.get('tags')[0].name == tag){
					return model;
				}
			});
		},
		getContextText: function(item, ctxName){
			return _.find(item.get('element_texts'), function(model){
				if(model.element.name == ctxName){
						return model.text;
					}
			});
	},
		makeSiteContent: function() {

		
			var pages = this.map(function(item, i){
				
					return {
						id: item.id,
						description: app.omekaItems.getContextText(item, "Description") || null,
						rights: app.omekaItems.getContextText(item, "Rights") || null,
						format: app.omekaItems.getContextText(item, "Format") || null,
						tags: item.get('tags')[0] || null,
						mime_type: app.files.getFileUrlsById(item.get('id')).get('mime_type') || null, 
						fileurls: app.files.getFileUrlsById(item.get('id')).get('file_urls') || null
					} 
			});
	
		app.APIcontent.add(pages);
	}
});
	// instance with omeka collections content
	app.omekaCollections = new collectionProto;
	app.omekaCollections.fetch({
		cache: true,
		//expires: 43200,
		//prefill: true,
		url: PAGES.config.getOmekaCollections
	}).then(function(response){
		checkMakeSiteContent('collections');
	});

	//instance omeka items content
	app.omekaItems = new collectionProto();
	app.omekaItems.fetch({
		cache: true,
		//expires: 43200,
		//prefill: true,
		url: PAGES.config.getOmekaItems,
	}).then(function(response){
		checkMakeSiteContent('items');
	});
// collection for the meta data set - > not used in this app
var ContextCollection = Backbone.Collection.extend({
	getContextName: function(arg){
		
		return this.find(function(model){
			if(model.get('id') == arg){
				return model;
			}
			
		}, arg);
	}
});


return true;
};



