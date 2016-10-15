
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
	getOmekaCollections: 'http://ncbs.test.openrun.net/api/collections',
	getOmekaFiles: "http://ncbs.test.openrun.net/api/files",
	getOmekaItems: 'http://ncbs.test.openrun.net/api/items',
	getOmekaContext: 'http://ncbs.test.openrun.net/api/elements?element_set=1'
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
		console.log(this, "after");
		
		var pages = this.map(function(item, i){

					return {
						id: item.id,
						description: omekaItems.getContextText(item, "Description"),
						rights: omekaItems.getContextText(item, "Rights"),
						format: omekaItems.getContextText(item, "Format"),
						mime_type: files.getFileUrlsById(item.get('id')).get('mime_type'), 
						fileurls: files.getFileUrlsById(item.get('id')).get('file_urls')
					} 
				});
		console.log(pages);
		app.content.add(pages);
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



context = new ContextCollection;
context.fetch({
	url: PAGES.config.getOmekaContext
});


omekaCollections = new collectionProto;
omekaCollections.fetch({
	url: PAGES.config.getOmekaCollections
});

files = new FilesCollection;
files.fetch({
	url: PAGES.config.getOmekaFiles
});

omekaItems = new collectionProto();
omekaItems.fetch({
	url: PAGES.config.getOmekaItems,
	success: function(response){
		//hack to be removed in production
		//due to slow internet
		if(files.length){
			omekaItems.makeSiteContent();
		}
	}
});

return true;
};


