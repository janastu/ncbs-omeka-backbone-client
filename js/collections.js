
/* Collections and controller */



$.ajaxSetup({
beforeSend: function(jqXHR) {
    jqXHR.crossDomain ={
        crossDomain: true
    };    
},
success:function(result, status, xhr){
	//console.log(result, status, xhr, "setup");

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


	 PAGES.checkMakeSiteContent = function(typ) {
		switch(typ) {
			case 'files':
				files_done = true;
			case 'collections':
				collections_done = true;
			case 'items':
				items_done = true;
		}
		if (typ === "files"){
			app.omekaItems.makeSiteContent();
			files_done = false;
		}
		if(typ === "items"){
			app.omekaItems.getFilesForItems();
			items_done = false;
		}
		

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
	var cacheStory = new storyCollection;
	app.APIcontent = new storyCollection;
	cacheStory.fetch({
		cache: true,
		url: "https://jants.cloudant.com/ncbs-narrative/d2dffbc585d35241ec14e22f565eefaa",
		headers: {"Authorization": "Basic amFudHM6YnJ0MW1yaDJzem4z"},
		success: function(response) {
			//console.log(response.toJSON()[0].narrative, "jants");
			app.APIcontent.set(response.toJSON()[0].narrative);
		}
	});	
	

	
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
	//app.files = new FilesCollection;


	

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
		getFilesForItems: function(){
			//fileArray = [];
			var self = this;
			tempFiles = new FilesCollection;
			fetchFiles = new FilesCollection;

		    app.omekaItems.each(function(item){
				var fileUrl = item.toJSON().files.url;
				fetchFiles.fetch({
							cache: true,
							expires: 43200,
							url: fileUrl,
							success: function(collection, response, options){
								tempFiles.add(response);
								fetchFiles.setter();
							}
						});
		
			});
			
			fetchFiles.setter =function() {
				if(tempFiles.length == self.length){
					app.files.set(tempFiles.models);
					PAGES.checkMakeSiteContent('files');
				}
			}
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
	
		app.APIcontent.set(pages);
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
		PAGES.checkMakeSiteContent('collections');
	});

	/*//instance omeka items content
	app.omekaItems = new collectionProto();*/
	
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



