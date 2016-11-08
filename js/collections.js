
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

	
	window.PAGES = {};

PAGES.config = {
	getOmekaCollections: 'https://www.ncbs.res.in/ncbs25/omeka/api/collections',
	getOmekaFiles: "https://www.ncbs.res.in/ncbs25/omeka/api/files",
	getOmekaItems: 'https://www.ncbs.res.in/ncbs25/omeka/api/items',
	getOmekaContext: 'https://www.ncbs.res.in/ncbs/api/elements.json'
};

var FilesCollection = Backbone.Collection.extend({
	getFileUrlsById: function(id){
		
		return this.find(function(model){ 
			if(model.get('item').id == id) { 
				return model;
			}
		}, id);
		
	}
});
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
						description: omekaItems.getContextText(item, "Description") || null,
						rights: omekaItems.getContextText(item, "Rights") || null,
						format: omekaItems.getContextText(item, "Format") || null,
						tags: item.get('tags')[0] || null,
						mime_type: files.getFileUrlsById(item.get('id')).get('mime_type') || null, 
						fileurls: files.getFileUrlsById(item.get('id')).get('file_urls') || null
					} 
				});
	
		APIcontent.add(pages);
	}
});

var ContextCollection = Backbone.Collection.extend({
	getContextName: function(arg){
		
		return this.find(function(model){
			if(model.get('id') == arg){
				return model;
			}
			
		}, arg);
	}
});

//var context_done = false;
var files_done = false;
var items_done = false;
var collections_done = false;

/*context = new ContextCollection;
context.fetch({
	url: PAGES.config.getOmekaContext
}).then(function(response){
	//hack to be removed in production
	//due to slow internet
	
	//omekaItems.makeSiteContent();
	checkMakeSiteContent('context');
});*/


omekaCollections = new collectionProto;
omekaCollections.fetch({
	url: PAGES.config.getOmekaCollections
}).then(function(response){
	//hack to be removed in production
	//due to slow internet
	
	//omekaItems.makeSiteContent();
	//console.log("collections fetched");
	checkMakeSiteContent('collections');
});

files = new FilesCollection;
files.fetch({
	url: PAGES.config.getOmekaFiles
}).then(function(response){
	//hack to be removed in production
	//due to slow internet
	
	//omekaItems.makeSiteContent();
	//console.log("files fetched");
	checkMakeSiteContent('files');
});

window.content=[];
omekaItems = new collectionProto();
omekaItems.fetch({
	url: PAGES.config.getOmekaItems,
}).then(function(response){
	//hack to be removed in production
	//due to slow internet
	
	//omekaItems.makeSiteContent();
	//console.log("items fetched");
	checkMakeSiteContent('items');
});

function checkMakeSiteContent(typ) {
	switch(typ) {
		case 'files':
			files_done = true;
		case 'collections':
			collections_done = true;
		/*case 'context':
			context_done = true;*/
		case 'items':
			items_done = true;
	}
	if (files_done && collections_done &&  items_done)
		omekaItems.makeSiteContent();

}
return true;
};



