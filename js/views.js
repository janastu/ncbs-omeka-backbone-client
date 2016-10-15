//View Partials - Common header and footer	



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

ImageCarousel = new Backbone.View.extend({
	el: "#test-carousel",
 
	initialize: function(options){
		/*this.container = _.template($("#image-carousel-template")),
		this.indicators = _.template($("#carousel-indicator-template")),*/
		this.content = options.content;
		console.log(this.content, "in slider view");
	},
	render: function(){

	}
});
