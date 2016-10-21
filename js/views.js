//View Partials - Common header and footer	
dummy = [{
        small : 'https://www.ncbs.res.in/ncbs25dev/files/thumbnails/9982b559f1492ba7df902e9f15103dde.jpg',
        big : 'https://www.ncbs.res.in/ncbs25dev/files/original/9982b559f1492ba7df902e9f15103dde.jpg'
    },{
        small : 'https://www.ncbs.res.in/ncbs25dev/files/thumbnails/221b610a7e70e4a7a537761178309511.jpg',
        big : 'https://www.ncbs.res.in/ncbs25dev/files/original/221b610a7e70e4a7a537761178309511.jpg'
    },{
        small : 'https://www.ncbs.res.in/ncbs25dev/files/thumbnails/9795fbb14b84b0d635db2c61d006a104.jpg',
        big : 'https://www.ncbs.res.in/ncbs25dev/files/original/9795fbb14b84b0d635db2c61d006a104.jpg'
    },{
        small : 'https://www.ncbs.res.in/ncbs25dev/files/thumbnails/2ed67b2f00cb40156d244a2fab870e47.jpg',
        big : 'https://www.ncbs.res.in/ncbs25dev/files/original/2ed67b2f00cb40156d244a2fab870e47.jpg'
    }];

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
		total: ""
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
		"click .next": "slideIncrement"
	},
	initialize: function(options){
		//Image slider view using http://ignitersworld.com/lab/imageViewer.html
		//expects options - el, content(array of objects for imgurls)
		this.options = options || {};
		this.model = new imgSliderModel();
		this.model.set("content", this.options.content);
		this.model.set("total", this.options.content.length);
		this.$el.html(this.template(this.model.toJSON()));
		this.viewer = ImageViewer(this.$('.image-container'), {
			snapView: false,
			zoomOnMouseWheel: true
		});
		this.listenTo(this.model, "change", this.render);
		this.render();

	},
	render: function(){
		console.log(this.model.toJSON());
		if(this.model.get('currentIndex') > this.model.get('total')) {
			this.model.set('currentIndex', 1);
		} else if( this.model.get('currentIndex')<1) {
			this.model.set('currentIndex', this.model.get('total'));
		}
		this.viewer.load(this.model.get('content')[this.model.get('currentIndex')-1].get('fileurls').thumbnail, this.model.get('content')[this.model.get('currentIndex')-1].get('fileurls').original);
		this.$(".featured-img-caption").remove();
		this.$el.append(this.captionTemplate(this.model.get('content')[this.model.get('currentIndex')-1].get('description')));
		this.$('.footer-info').remove();
		this.$el.append(this.footerTemplate(this.model.toJSON()));
		this.model.set("total", this.options.content.length);
		this.viewer.refresh();
		this.$('img').css('max-width', '100%', 'max-height', 'auto');
	},
	slideDecrement: function(e){
		this.model.set('currentIndex', this.model.get('currentIndex')-1);
	},
	slideIncrement: function(e){
		this.model.set('currentIndex', this.model.get('currentIndex')+1);
	}
});


 AudioView = Backbone.View.extend({
 	template: _.template($("#audio-player-template").html()),
 	captionTemplate: _.template($("#caption-template").html()),
 	initialize: function(options){
 		this.options = options || {};
 		this.found = _.find(this.options.content, function(item){
 			
 			return item.get('tags').name === this.options.tags.tag;
 		}, this);
 		this.render();
 	},
 	render: function(){
 		console.log("audio render");
 		this.$el.html(this.template(this.found.get('fileurls')));
 		this.$el.append(this.captionTemplate(this.found.get('description')));
 		return this;
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
		console.log(this.collection);
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
		console.log(this.content);
		console.log($(this.container).find('ol'));
		$(this.el).append(this.containerTemplate());
		_.each(this.content, function(item, index){
			$(this.container).find('ol').append(this.template({index: index}));
		}, this);


	}
});

