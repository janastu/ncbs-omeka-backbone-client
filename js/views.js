//View Partials - Common header and footer	


    DummyView = Backbone.View.extend({
    	template: _.template($("#dummy-view").html()),
    	initialize: function(options){
    		this.options = options || {};
    		this.render
    	},
    	render: function(options){
    		this.$el.html(this.template);
    	}
    });


imgSliderModel = Backbone.Model.extend({
	defaults: {
		content: [],
		currentIndex: 1,
		total: "",
		hack: ""
	},
	initialize: function() {

	}
});

imgSliderView = Backbone.View.extend({
	template: _.template($("#img-slider-template").html()),
	footerTemplate: _.template($("#img-slider-footer").html()),
	captionTemplate: _.template($("#caption-template").html()),
	events: {
		"click .prev": "slideDecrement",
		"click .next": "slideIncrement",
		"click .slider-refresh": "refreshSlide"
	},
	initialize: function(options){
		//Image slider view using http://ignitersworld.com/lab/imageViewer.html
		//expects options - el, content(array of objects for imgurls)
		this.options = options || {};
		this.model = this.options.model;
		this.model.set("content", this.options.content);
		this.model.set("total", this.options.content.length);
		this.$el.html(this.template(this.model.toJSON()));
		this.viewer = ImageViewer(this.$('.image-container'), {
			snapView: true,
			zoomOnMouseWheel: true,
			maxZoom: 400
		});
		//this.listenTo(app.tabsView, "refreshViewer", this.refreshSlide);
		//app.tabsView.on("refreshViewer", this.refreshSlide, this);
		this.listenTo(this.model, "change", this.render);
		this.render();

	},
	render: function(){
	
		if(this.model.get('currentIndex') > this.model.get('total')) {
			this.model.set('currentIndex', 1);
		} else if( this.model.get('currentIndex')<1) {
			this.model.set('currentIndex', this.model.get('total'));
		}
		this.viewer.load(this.model.get('content')[this.model.get('currentIndex')-1].get('fileurls').thumbnail, this.model.get('content')[this.model.get('currentIndex')-1].get('fileurls').original);
		this.$(".featured-img-caption").remove();
		window.imager = this.model;
		//console.log(this.model.get('content')[this.model.get('currentIndex')-1].get('description').text, this.model.get('content')[this.model.get('currentIndex')-1].get('rights').text);
		this.$el.append(this.captionTemplate({description: this.model.get('content')[this.model.get('currentIndex')-1].get('description'),
												rights: this.model.get('content')[this.model.get('currentIndex')-1].get('rights') || ""}));
		this.$('.footer-info').remove();
		this.$el.append(this.footerTemplate(this.model.toJSON()));
		this.model.set("total", this.options.content.length);
		this.viewer.refresh();
		//this.$('img').css('max-width', '100%', 'max-height', 'auto');
	},
	slideDecrement: function(e){
		this.model.set('currentIndex', this.model.get('currentIndex')-1);
	},
	slideIncrement: function(e){
		this.model.set('currentIndex', this.model.get('currentIndex')+1);
	},
	refreshSlide: function(e){
		console.log(e.target, "refreshed");
		this.model.set('currentIndex', this.model.get('currentIndex')+1);
		this.model.set('currentIndex', 1);

	}
});


 AudioView = Backbone.View.extend({
 	template: _.template($("#audio-player-template").html()),
 	captionTemplate: _.template($("#audio-caption-template").html()),
 	//galleryTemplate: _.template($("gallery-audio-template").html()),
 	events: {
 		"click .close": "closePlayer"
 	},
 	initialize: function(options){
 		this.options = options || {};
 		/*if(this.options.tags){}*/
 		this.found = _.find(this.options.content, function(item){
 			
 			return item.get('tags').name === this.options.tags.tag;
 		}, this);
 	 
 		this.render();
 	},
 	render: function(){
 		//console.log("audio render");
 		/*if(this.options.tag){
 			} else {
 				//console.log(this.options);
 				this.$el.html(this.template({src: this.options.url.src, original: undefined}));
 			}*/
 		this.$el.html(this.template(this.found.get('fileurls')));
 		this.$el.append(this.captionTemplate({description: this.found.get('description'),
 												rights: this.found.get('rights') || ""}));
 	
 		this.$el.show();
 		return this;
 	},
 	closePlayer: function(event){
 		event.preventDefault();
 		//console.log(this);
 		this.$('audio').trigger('pause');
 		this.$el.hide();
 		//$(this.el).children.remove();
 	}
 });

VideoView = Backbone.View.extend({
	template: _.template($("#video-player-template").html()),
	captionTemplate: _.template($("#caption-template").html()),

	initialize: function(options){
		this.options = options || {};
		this.render();
	},
	render: function(){
		this.$el.html(this.template(this.options.content.toJSON()));
		this.$el.append(this.captionTemplate({description: this.options.content.get('description'),
										rights: this.options.content.get('rights') || ""
									}));
	}
});

GalleryView = Backbone.View.extend({
	el: "#ncbs-narrative-container",
	imgTemplate: _.template($("#gallery-img-template").html()),
	audioTemplate: _.template($("#gallery-audio-template").html()),
	events: {
		"click .gallery-player-trriger": "launchAudioPlayer"
	},
	initialize: function(options){
	this.options = options || {};
	this.siteMap = [["Space", "India", "Recognition", "Reflection"], ["Autonomy", "Paper", "Arch"],
	["Hiring", "Startup", "Collaboration",  "Students", "Scaling"], ["Toggle", "Shifts", "Process", "Tool"],
	["Knowledge", "Mentor"], ["Effect_Toll", "Isolation"], ["Gender", "Hierarchy", "NCBS Community", "Outside"]
	];
	//console.log(this.options);
	this.items = _.compact(_.map(this.options.content, function(item){
		if(item.get('tags').name.split('-').length<3){
			return item;
		}
	}));
	this.groupedItems = _.groupBy(this.items, function(item){
		//console.log(item);
		return item.get('mime_type');
	})
	//console.log(this.items, this.groupedItems);
	this.render();
	},
	render: function(){
		var subTheme = this.siteMap[this.options.theme-1];
		_.each(subTheme, function(subIndex, index){
			_.each(this.groupedItems['image/jpeg'], function(item){
				//console.log(item.toJSON(), index, subIndex, "in second each");
				var fileTag = item.get('tags').name.split('-')[1];
				if(subIndex == fileTag){
					var indexBuild = index+1;
					var domElem = '#'+indexBuild+"-note";
					console.log(domElem, "in if");
					this.$(domElem).append(this.imgTemplate(item.toJSON()));
				}
				//var domID = subTheme
				//console.log(fileTag, subTheme, "in second each end");
				//this.$el.append(this.imgTemplate(item.toJSON()));
			}, this);

		}, this);

		_.each(subTheme, function(subIndex, index){
			_.each(this.groupedItems['audio/mpeg'], function(item){
				//console.log(item.toJSON(), index, subIndex, "in second each");
				var fileTag = item.get('tags').name.split('-')[1];
				if(subIndex == fileTag){
					var indexBuild = index+1;
					var domElem = '#'+indexBuild+"-note";
					//console.log(domElem, "in if");
					this.$(domElem).append(this.audioTemplate({
						description: item.get('description').text,
						src: item.get('fileurls').original
					}));
				}
			}, this);

		}, this);
		
	},

	launchAudioPlayer: function(event){
		//console.log(event.target.dataset);
		//new AudioView({el: "#audio-player-container", url: event.target.dataset});
}
});



ImageView = Backbone.View.extend({
	initialize: function(options){
		//initialize options - template, content is array of models
		//model {title: string, fileursl: array[]}
		this.$container = $("#main");
		this.template =  _.template($(options.template).html());
		this.collection = options.collection;
		//if(!this.collection){}
			this.listenTo(app.content, "add", this.onFly);
		
		this.render();
	},
	render: function(model){
		//console.log(this.collection);
		this.collection.each(function(item){
			this.$container.append(this.$el.append(this.template(item.toJSON())));
		}, this);
		
		this.initImgViewer();
	},
	onFly: function(model){
		this.$container.append(this.$el.append(this.template(model.toJSON())));
	},
	initImgViewer: function(){
		var viewer = ImageViewer( {maxZoom : 400});
		    $('.pannable-image').click(function () {
		        var imgSrc = this.src,
		            highResolutionImage = $(this).data('high-res-src');
		 
		        viewer.show(imgSrc, highResolutionImage);
		    });
	},
	initImageSlideshow: function(){
		//console.log(this.content);
		//console.log($(this.container).find('ol'));
		$(this.el).append(this.containerTemplate());
		_.each(this.content, function(item, index){
			$(this.container).find('ol').append(this.template({index: index}));
		}, this);


	}
});

