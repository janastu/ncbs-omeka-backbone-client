
	/* Global application object, with all the functions, it's instances, views, collections or data
	console log app to see its contents */

	app = window.app || {};

	// View partial - HEADER it's instance can be accessed as app.headerView
	// template headerTpl context is from path libs/text!templates/header.html
			var HeaderView = Backbone.View.extend({
				el: "#header",
				//templateFileName: "header.html",
				template: $("#header-template").html(),//headerTpl,
				initialize: function() {
					// $.get(this.templateFileName, function(data){console.log(data);this.template=data});		
				},

				render: function() {
					$(this.el).html(_.template(this.template));
					//this.scrollEffect();
				},
				//A scrolling effect for the header
				scrollEffect: function(){
					window.addEventListener('scroll', function(e){
				    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
				        shrinkOn = 25,
				        header = document.querySelector("header");
				    if (distanceY > shrinkOn) {
				        classie.add(header,"smaller");
				        $("#ncbs-home-text-collapsible").hide();
				    } else {
				    	$("#ncbs-home-text-collapsible").show();
				        if (classie.has(header,"smaller")) {
				            classie.remove(header,"smaller");
				        }
				    }
				});
				}
			});

			app.headerView = new HeaderView();
			app.headerView.render();
		

	// View partial - FOOTER it's instance can be accessed as app.footerView
	// template footerTpl context is from path libs/text!templates/footer.html
			var FooterView = Backbone.View.extend({
				el: "#footer",
				template: $("#navigation-template").html(),//footerTpl,

				render: function() {
					this.$el.html(_.template(this.template));
				}
			});
			app.footerView = new FooterView();
			app.footerView.render();



	// Home page content 
	// template homeTpl context is from path libs/text!templates/home.html
			app.HomeView = Backbone.View.extend({
				id: "content",
				template: $("#home-page-template").html(),//homeTpl,

				initialize: function() {
					this.$container = $("#main");
				},

				render: function() {
					this.$container.append(this.$el.html(_.template(this.template)));
				}
			});	


	// About page content - template available in index.html
			app.aboutView = Backbone.View.extend({
				id: "content",
				template: _.template($("#about-page-template").html()),
				
				initialize: function() {
					this.$container = $("#main");
				},

				render: function() {
					this.$container.append(this.$el.html(this.template));
					//this.$el.html(this.template);
				}
			});	


	/* Each theme is rendered with this view 
	this view listens to app.omekaCollections which is passed as an option to the view. 
	template context in index.html which is a bootstrap tabs implementation
	Requirements: this.siteMap is the navigation tabs and count for each subtheme
	this.tabIconPath is the individual icons for each subtheme
	this.options.tag is a number which co-relates to the theme number -> 1 for identity, 
	2 for Institution Building and so on...
	 this.collection is an array of object which serves the text content in this views
	 along with the tags for rendering media */
	 //TODO: issue#72 when tabs are hidden - should check for any audio or video playing to stop
	 //https://github.com/janastu/ncbs-omeka-backbone-client/issues/72
			app.ThemeTabs = Backbone.View.extend({
				id: "content",
				template: _.template($('#sub-theme-nav-tabs').html()),
				events: {
					"shown.bs.tab a[data-toggle='tab']": "initMediaEl",
					"click .nav-tabs a[data-toggle='tab']": "updateRoute"
				},
				initialize: function(options){
					//called from router.js 
					// options = {collection: Omeka collection, tag: integer(to identify theme), 
						//content: Omeka items}
					this.options = options || {};

					// array of Theme and subtheme names as should reflect
					// in the presentation(DOM). taxonomy theme(integer)-subtheme(text)-component(alphanumeric)-order
					this.siteMap = [
					["Identity","Space for biology", "Science in India", "Recognition", "Reflections"],
					["Institution Building", "Space & Autonomy", "Paper Trails", "Architecture"],
					["Growth", "Hiring", "Start-ups", "Collaborations", "Student Selections", "Scaling"],
					["Research", "Basic and Applied toggle", "Areas and shifts", "Processes", 
					"Queries and tools"],
					["Education", "Building knowledge", "Mentorship"],
					["Ripple Effect", "Effects and Toll", "Interaction and Isolation"],
					["Intersections", "Gender Equality", "Hierarchy & Class", "NCBS Community", 
					"Outside World"]
					];
					//Each Theme has an unique icon in the first tab with css and color scheme
					this.tabIconPath = ["img/Assets/identity_inside-01.png", 
						"img/Assets/instituin_inside-01.png",
						"img/Assets/growth_inside.png", "img/Assets/research-inside.png", 
						"img/Assets/education_inside1.png",
						 "img/Assets/ripple_inside.png", "img/Assets/intersections_inside.png"];
					
					this.tags = this.options.tag.split('-');
					this.$parent=$("#main");
					
					this.listenTo(app.omekaCollections, "add", this.render);
				},
				render: function(){
					window.scrollTo(0,0);
					// the template expects a JSON object with properties content(text), sitemap(the navtabs),
					// tabIcon (context icons), className(each theme has different colors)
					this.$el.html(this.template({
												content: app.omekaCollections.get(this.tags[0]).toJSON(), 
												sitemap:this.siteMap[this.tags[0]-1], 
												tabIcon: this.tabIconPath[this.tags[0]-1], 
												className: this.siteMap[this.tags[0]-1][0]+"-tabs"
											}));
					this.$parent.append(this.$el);

					//After rendering the tabs view, the default tab needs to be switched active
					if(this.options.query == undefined){
						this.$("#ncbs-narrative-container .nav-tabs li").first().addClass("active");
						this.$("#ncbs-narrative-container .tab-pane").first().addClass("active");
					} else {
						_.each($("#ncbs-narrative-container .nav-tabs li"), function(item){ 
							var tabList = item.innerText.toLowerCase().trim().split(" "),
							urlTabState = window.location.hash.split("/")[2].split("-"),
							compareResult = _.difference(tabList,urlTabState);
							//console.log(tabList, urlTabState, compareResult);
							if(compareResult.length == 0){
								var panePartialID = this.siteMap[this.tags[0]-1].indexOf(item.innerText.trim()),
								activePaneID = "#"+panePartialID+"-note";
								$('#ncbs-narrative-container .nav-tabs a[href='+activePaneID+']').tab('show');
								/*$(item).addClass("active");
								this.$(activePaneID).addClass("active");*/
							}
						}, this);
					}
				},

				//bug fix: The image viewer behaves abnormaly when rendered in an hidden element
				//solution: every time a tab was shown, the imageViewer should be re-rendered and refreshed
				initMediaEl: function(event){
					  this.mediaHandler = new storyMediaView({
					  	theme: this.tags[0]
					  });
					  this.mediaHandler.render();
					  if(this.mediaHandler.imgSlideSubViews){
						_.each(this.mediaHandler.imgSlideSubViews, function(item){
							item.viewer.refresh();
						});
					}
				},
				updateRoute: function(event){
					//app.router.navigate("#/identity/space-for-biology", true);
					console.log(event.target.innerText.toLowerCase());
					if(event.target.innerText.toLowerCase() == window.location.hash.split("#/")[1].split("/")[0]){
						var urlFragmentPath = " ";
					} else {
						var urlFragmentPath = "/"+event.target.innerText.toLowerCase().split(" ").join("-");
					}
					
					var urlThemePath = "#/"+window.location.hash.split("#/")[1].split("/")[0];
					console.log(urlFragmentPath, urlThemePath);
					app.router.navigate(urlThemePath+urlFragmentPath, true);
				}
			});


	/* This is the child view for the subtheme view - Every subtheme or tab text content will contain
	TAGS in <span></span>. so, this view will get all spans and check and match the tags from DOM to the 
	tags in the app.APIcontent, which is the collection this view will listen to. */

			var storyMediaView = Backbone.View.extend({
				el: "#ncbs-narrative-container",
				events: {
					"click .audio-player-trigger": "launchAudioPlayer"
				},
				initialize: function(options) {
					//called from app.ThemeTabs
					//{el:"#ncbs-narrative-container", collection:app.APIcontent, theme: this.tags[0]}
					this.options = options || {};
					
					this.listenToOnce(app.APIcontent, "add", this.render);
					this.siteMap = ["identity", "institution-building", "growth", "research", "education", "ripple-effect",
									"intersections"];
					// All the spans in the DOM currentView
					//this.spans = app.router.currentView.$("span");
					this.spans = app.router.currentView.$(".tab-pane.active span");
					// A reference to the child views to unbind them when switching routes
					this.imgSlideSubViews = [];
					this.videoSubview = [];
				},
				render: function() {
					// Group media by mime type

					/*this.groupedMedia = _.chain(app.APIcontent.groupByTags(0)[this.options.theme])
												.groupBy(function(item){ return item.get('mime_type')})
												._wrapped;*/
					
					//iterate over each span from dom view
					_.each(this.spans, function(span){

						/* START rendering the Image slider view in between the text*/

						//find the matching tag from the file tags to match the tag in dom view
						//which will be an array of items for images and sort by the order of the tags
						// last attribute seperated by "-"
						var mappedImages = _.chain(
							_.chain(app.APIcontent.groupByTags(0)[this.options.theme])
									.groupBy(function(item){ 
										return item.get('mime_type');
									})
									._wrapped["image/jpeg"])
											.map(function(item){
							//the grouping is based on the 3rd char in tag series seperated by "-""
							var tagArray = item.get('tags').name.split('-');
							var domTagmatch = tagArray.splice(3, 2);
							//console.log(tagArray, span, "map dom", domTagmatch);
							if(span.innerHTML === tagArray.join('-')){
								return item;
							}
						}).compact().sortBy(function(item){
							//console.log(item.get('tags').name.split('-')[3]);
							return item.get('tags').name.split('-')[3]; // sort by the last attribute of tags seperated by "-"
						})._wrapped.sort(naturalCompare); //since sort goes through a string of values - a natural order sorting is required
						//var nsort = mappedImages.sort(naturalCompare); -> this is added to the _.chain function above
						
						// append the list of images to Dom by instantiating the slider subview
						if(mappedImages.length){
							
							var slider =  new imgSliderView({el: span, content: mappedImages, model: new imgSliderModel()});
							this.imgSlideSubViews.push(slider);
						}
						/* END rendering the Image slider view in between the text*/


						/* START rendering the Video players in between the text*/
						//find the matching tag from the file tags to match the tag in dom view
						var mappedVideo = _.find(_.chain(app.APIcontent.groupByTags(0)[this.options.theme])
												.groupBy(function(item){ 
													return item.get('mime_type');
												})
												._wrapped["video/mp4"], function(item){
							//console.log(span.innerHTML, item.get('tags').name, 'matched?')
							if(span.innerHTML === item.get('tags').name){
								return item;	
							}
						});
						
						//append the audio icon to dom
						if(mappedVideo){
							//console.log(mappedVideo.toJSON());
							/*$(span).parent().addClass("clearfix");
							$(span).css({"width": "50%", "float": "right"});*/
							this.video = new VideoView({el: span, content: mappedVideo});
							this.videoSubview.push(this.video);
						}
						/* END rendering the Video players in between the text*/


						/* START rendering the audio icons in between the text */
						//find the matching tag from the file tags to match the tag in dom view
						var mappedAudio = _.find(_.chain(app.APIcontent.groupByTags(0)[this.options.theme])
												.groupBy(function(item){ 
													return item.get('mime_type');
												})
												._wrapped["audio/mpeg"], function(item){
							return item.get('tags').name === span.innerHTML;
						});
						
						//append the audio icon to dom
						if(mappedAudio){
							$(span).html('<i class="fa fa-play-circle audio-player-trigger"  style="cursor: pointer;"  aria-hidden="true" data-tag="'+mappedAudio.get('tags').name+
									'"data-url="'+mappedAudio.get('fileurls').original+'"data-description="'+mappedAudio.get('description').text+'"data-rights="'+mappedAudio.get('rights').text+'"></i>');
						}

						/* END rendering the audio icons in between the text*/
					}, this);
					

					// Gallery view renders a collapsible gallery for each tab
					this.Gallery = new GalleryView({ 
						theme: this.options.theme
					});
					this.Gallery.render();
					
					//this.delegateEvents();
					return this;
				},
				// Bind event to the rendered audio icons to launch an Audio player when clicked
				launchAudioPlayer: function(event){
					event.preventDefault();
					if(app.currentAudio){
						app.currentAudio.unbind();
						app.currentAudio.remove();
					}
					//console.log(event.target.dataset, event.currentTarget, app, "clicked audio icon");
					app.currentAudio = new AudioView({data: event.target.dataset});
				}
			});


/* The Image slider view
 using http://ignitersworld.com/lab/imageViewer.html */


imgSliderModel = Backbone.Model.extend({
	defaults: {
		content: [],
		currentIndex: 1,
		total: "",
		currentZoom: 0
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
		"click img": "zoomControl"
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
			zoomOnMouseWheel: false
		});
		/*window.bLazy = new Blazy({ 
					       container : '.image-container' // all images
					   });*/
		//this.$el.css({"width": "200px", "height": "200px", "float": "right"});
		//this.$el.css("float", "right");
		//this.listenTo(app.tabsView, "refreshViewer", this.refreshSlide);
		//app.tabsView.on("refreshViewer", this.refreshSlide, this);
		this.listenTo(this.model, "change:currentIndex", this.render, this);
		this.render();

	},
	render: function(){
		if(this.model.get('currentIndex') > this.model.get('total')) {
			this.model.set('currentIndex', 1);
		} else if( this.model.get('currentIndex')<1) {
			this.model.set('currentIndex', this.model.get('total'));
		}
		this.viewer.load(this.model.get('content')[this.model.get('currentIndex')-1].get('fileurls').thumbnail, this.model.get('content')[this.model.get('currentIndex')-1].get('fileurls').original);
		//this.viewer.load(this.model.get('content')[this.model.get('currentIndex')-1].get('fileurls').thumbnail);
		this.$(".featured-img-caption").remove();
		window.imager = this.model;
		//console.log(this.model.get('content')[this.model.get('currentIndex')-1].get('description').text, this.model.get('content')[this.model.get('currentIndex')-1].get('rights').text);
		this.$el.append(this.captionTemplate({description: this.model.get('content')[this.model.get('currentIndex')-1].get('description'),
												rights: this.model.get('content')[this.model.get('currentIndex')-1].get('rights') || ""}));
		this.$('.footer-info').remove();
		this.$el.append(this.footerTemplate(this.model.toJSON()));
		this.model.set("total", this.options.content.length);
		//this.viewer.refresh();
		//this.$('img').css('max-width', '100%', 'max-height', 'auto');
	},
	slideDecrement: function(e){
		this.model.set('currentIndex', this.model.get('currentIndex')-1);
	},
	slideIncrement: function(e){
		this.model.set('currentIndex', this.model.get('currentIndex')+1);
	},
	zoomControl: function(e){
		e.preventDefault();
		//zoom on one click instead of default doubleclick
		this.viewer.zoom(200, {x:500, y:500});
	}
});

/*Global audio player view fixed to the bottom of browser view port */

 AudioView = Backbone.View.extend({
 	id: "audio-player-container", 
 	template: _.template($("#audio-player-template").html()),
 	captionTemplate: _.template($("#audio-caption-template").html()),
 	//galleryTemplate: _.template($("gallery-audio-template").html()),
 	events: {
 		"click .close": "closePlayer"
 	},
 	initialize: function(options){
 		this.options = options || {};
 		
 		//this.found is not needed - after change in architecture of dom data-* attribute
 		/*this.found = _.find(this.options.content, function(item){
 			return item.get('tags').name === this.options.data.tag;
 		}, this);*/
 	 	this.$parent = $('body');
 		this.render();
 	},
 	render: function(){
 		this.$el.html(this.template({original: this.options.data.url}));
 		this.$el.append(this.captionTemplate({description: this.options.data.description || "", 
 												rights: this.options.data.rights || "" })); 
 		this.$parent.append(this.$el);
 		//this.$el.show();
 		return this;
 	},
 	closePlayer: function(event){
 		event.preventDefault();
 		this.$('audio').trigger('pause');
 		this.unbind();
 		this.remove();
 	}
 });


/* Video player view - subview of the themes view */
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


/*Gallery view - subview of the Themes view */
GalleryView = Backbone.View.extend({
	el: "#ncbs-narrative-container",
	imgTemplate: _.template($("#gallery-img-template").html()),
	audioTemplate: _.template($("#gallery-audio-template").html()),
	videoTemplate: _.template($("#gallery-video-template").html()),
	events: {
		"click .gallery-player-trigger": "launchAudioPlayer",
		"click .pannable": "imgViewerClickable"
	},
	initialize: function(options){
	this.options = options || {};
	// array of subthemes as reflected in the tags. taxonomy theme(integer)-subtheme(text)-component(alphanumeric)-order
	this.siteMap = [["Space", "India", "Recognition", "Reflection"], ["Autonomy", "Paper", "Arch"],
	["Hiring", "Startup", "Collaboration",  "Students", "Scaling"], ["Toggle", "Shifts", "Process", "Tool"],
	["Knowledge", "Mentor"], ["Effect_Toll", "Isolation"], ["Gender", "Hierarchy", "NCBS", "Outside"]
	];
	this.listenToOnce(app.APIcontent, "add", this.render);

	this.viewer = ImageViewer();

	},
	render: function(){
		//iterate through each sub-theme to find items applicable for gallery
		_.each(this.siteMap[this.options.theme-1], function(subTheme, index){
			//console.log("subindex=", subIndex, index);
			//clear the gallery container
			this.$container = $('<div class="collapse"></div>');
			//find the dom node to append gallery items
			var indexBuild = index+1;
			var domElem = '#'+indexBuild+"-note";

			_.chain(app.APIcontent.groupByTags(0)[this.options.theme])
				.map(function(item){   	// mapped array of items that belong to gallery only
					 if(item.get('tags').name.split('-').length<3){  // match by tags
					 	return item;
					 }
				})
				.compact()				//remove unwanted items from the array
				.sortBy('mime_type')   // Sort items by mimme type, such that the audio is rendered first, 
				.each(function(item){  //iterate over each item for the sub-theme
				var fileTag = item.get('tags').name.split('-')[1];
				if(subTheme === fileTag){
					//console.log(domElem, "in if");
					if(item.get('mime_type') === "image/jpeg"){
						this.$container.append(this.imgTemplate(item.toJSON()));
					}
					else if(item.get('mime_type') === 'audio/mpeg'){
						this.$container.append(this.audioTemplate({
							description: item.get('description').text,
							rights: item.get('rights').text,
							src: item.get('fileurls').original
						}));
					}
					else {
						this.$container.append(this.videoTemplate({
							fileurls: item.get('fileurls'),
							description: item.get('description') || "",
							rights: item.get('rights') || ""
						}));
					}
				}

			}, this);

			//Append the container element to DOM
				
				//clear previously appended elements if any
				this.$(domElem).find(".gallery-btn").remove();	
				this.$(domElem).find(".collapse").remove();
				//add an ID reference for collapse plugin to call
				this.$container.attr("id", indexBuild+"-gallery");
				var collapseButton = '<a class="btn btn-success center-block gallery-btn" role="button" data-toggle="collapse" href="#'+indexBuild+'-gallery'+
					'" aria-expanded="false" aria-controls="'+indexBuild+'-gallery'+'">GALLERY</a>';
				
				this.$(domElem).append(collapseButton);	
				this.$(domElem).append(this.$container[0].outerHTML);
		}, this);
	},

	imgViewerClickable: function(event){
		event.preventDefault();
		var imgSrc = event.currentTarget.src,
		highResolutionImage = $(event.currentTarget).data('high-res-src');
		this.viewer.show(imgSrc, highResolutionImage);
	},

	launchAudioPlayer: function(event){
		event.preventDefault();
		if(app.currentAudio){
			app.currentAudio.unbind();
			app.currentAudio.remove();
		}
		app.currentAudio = new AudioView({data: event.target.dataset});
}
});

	ScrollHelper = Backbone.View.extend({
		el: "#scroller",
		events: {
			"click #scroll-to-top": "goToWindowTop",
			"click #scroll-to-bottom": "goToWindowBottom"
		},
		initialize: function(){
			$('[data-toggle="tooltip"]').tooltip();
		},
		goToWindowTop: function(event){
			event.preventDefault();
			//console.log(event.currentTarget);
			window.scrollTo(0,0);
		},
		goToWindowBottom: function(event){
			event.preventDefault();
			//console.log(event.currentTarget);
			window.scrollTo(0,document.body.scrollHeight);
		}
	});
	
	app.scroller = new ScrollHelper();


	pageNotFound = Backbone.View.extend({
		id: "content",
		tagName: "div",
		template: _.template($("#page-not-found-view").html()),
		initialize: function(options){
			this.options = options || {};
			this.$parent = $("#main");
			this.render();
		},
		render: function(options){
			this.$parent.append(this.$el.html(this.template));
		}
	});

	//Helper for sorting the items by tags
	// While sorting the order of the tags, we need to check for natural sorting since the tag is a text
	// with numbers marked as order

	  function naturalCompare(a, b) {
	      var ax = [], bx = [];
	      //console.log(a, b);
	      a.get('tags').name.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { ax.push([$1 || Infinity, $2 || ""]) });
	      b.get('tags').name.replace(/(\d+)|(\D+)/g, function(_, $1, $2) { bx.push([$1 || Infinity, $2 || ""]) });
	      
	      while(ax.length && bx.length) {
	          var an = ax.shift();
	          var bn = bx.shift();
	          var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
	          if(nn) return nn;
	      }
	          return ax.length - bx.length;
	      }
	
	


/*DummyView = Backbone.View.extend({
	tagName: "div",
	template: _.template($("#dummy-view").html()),
	initialize: function(options){
		this.options = options || {};
		this.render
	},
	render: function(options){
		this.$el.html(this.template);
	}
});
*/
