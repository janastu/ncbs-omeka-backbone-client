
/* Main views of the site are defined here - mainly, Home, about, Header, footer, subtheme(tabsview)
and story media view - sub views for media is defined in js/views.js*/
(function(){
	/* Global application object, with all the functions, it's instances, views, collections or data
	console log app to see its contents */

	app = window.app || {};

	// call to start the api requests to the Omeka server
	// will return true
	app.controller = AppController();

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
	
	
	app.init = function() {
		app.router = new ApplicationRouter();
		this.headerView = new app.HeaderView();
		this.headerView.render();
		this.footerView = new app.FooterView();
		this.footerView.render();
		Backbone.history.start();
	};

// require to import the html files where the templates are declared for the view partials
	require(['libs/text!templates/header.html', 'libs/text!templates/home.html', 'libs/text!templates/footer.html'], function (headerTpl, homeTpl, footerTpl) {

// View partial - HEADER it's instance can be accessed as app.headerView
// template headerTpl context is from path libs/text!templates/header.html
		app.HeaderView = Backbone.View.extend({
			el: "#header",
			templateFileName: "header.html",
			template: headerTpl,

			initialize: function() {
				// $.get(this.templateFileName, function(data){console.log(data);this.template=data});		
			},

			render: function() {
				$(this.el).html(_.template(this.template));
				this.scrollEffect();
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


// View partial - FOOTER it's instance can be accessed as app.footerView
// template footerTpl context is from path libs/text!templates/footer.html
		app.FooterView = Backbone.View.extend({
			el: "#footer",
			template: footerTpl,

			render: function() {
				this.$el.html(_.template(this.template));
			}
		});


// Home page content 
// template homeTpl context is from path libs/text!templates/home.html
		app.HomeView = Backbone.View.extend({
			id: "content",
			template: homeTpl,

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


/* Each subtheme is rendered with this view 
this view listens to app.omekaCollections which is passed as an option to the view. 
template context in index.html which is a bootstrap tabs implementation
Requirements: this.siteMap is the navigation tabs and count for each subtheme
this.tabIconPath is the individual icons for each subtheme
this.options.tag is a number which co-relates to the theme number -> 1 for identity, 2 for Institution Building
and so on...
 this.collection is an array of object with serves the text content in this views
 along with the tags for rendering media */

		app.subthemeNav = Backbone.View.extend({
			id: "content",
			template: _.template($('#sub-theme-nav-tabs').html()),
			events: {
				"shown.bs.tab a[data-toggle='tab']": "refreshViewer"
			},
			initialize: function(options){
				this.siteMap = [
				["Identity","Space for biology", "Science in India", "Recognition", "Reflections"],
				["Institution Building", "Space & Autonomy", "Paper Trails", "Architecture"],
				["Growth", "Hiring", "Start-ups", "Collaborations", "Student Selections", "Scaling"],
				["Research", "Basic/Applied toggle", "Areas and shifts", "Processes", "Queries and tools"],
				["Education", "Building knowledge", "Mentorship"],
				["Ripple Effect", "Effects and Toll", "Interaction/Isolation"],
				["Intersections", "Gender Equality", "Hierarchy & Class", "NCBS Community", "Outside World"]];
				this.tabIconPath = ["img/Assets/identity_inside-01.png", "img/Assets/instituin_inside-01.png",
					"img/Assets/growth_inside.png", "img/Assets/research-inside.png", "img/Assets/education_inside1.png",
					 "img/Assets/ripple_inside.png", "img/Assets/intersections_inside.png"];
				this.options = options || {};
				this.tags = this.options.tag.split('-');
				this.$parent=$("#main");
				this.listenTo(this.collection, "add", this.render);
			},
			render: function(){
				this.model = this.collection.get(this.tags[0]);
				window.scrollTo(0,0);
				// the template expects a JSON object with properties content(text), sitemap(the navtabs),
				// tabIcon (context icons), className(each theme has different colors)
				this.$el.html(this.template({content: this.model.toJSON(), sitemap:this.siteMap[this.tags[0]-1], 
											tabIcon: this.tabIconPath[this.tags[0]-1], className: this.siteMap[this.tags[0]-1][0]+"-tabs"}));
				this.$parent.append(this.$el);

				//After rendering the tabs view, the default tab needs to be switched active
				this.$("#ncbs-narrative-container .nav-tabs li").first().addClass("active");
				this.$("#ncbs-narrative-container .tab-pane").first().addClass("active");

				// Initializing the child view, mediaContainer is an instance of storyMediaView
				// Gallery view renders a collapsible gallery for each tab
				this.mediaContainer = new storyMediaView({
					el:"#ncbs-narrative-container", 
					collection:app.APIcontent,
					theme: this.tags[0]
					//media: app.APIcontent.groupByTags(0)[this.tags[0]]
				});
				this.mediaContainer.render();
				this.Gallery = new GalleryView({
					//content: app.APIcontent.groupByTags(0)[this.tags[0]],
					collection:app.APIcontent, 
					theme: this.tags[0]
				});
				this.Gallery.render();
			},

			//bug fix: The image viewer behaves abnormaly when rendered in an hidden element
			//solution: every time a tab was shown, the imageViewer should be re-rendered and refreshed
			refreshViewer: function(event){
				_.each(this.mediaContainer.imgSlideSubViews, function(item){
					item.render();
					item.viewer.refresh();
				});

			}
		});


/* This is the child view for the subtheme view - Every subtheme or tab text content will contain
TAGS in <span></span>. so, this view will get all spans and check and match the tags from DOM to the 
tags in the app.APIcontent, which is the collection this view will listen to. */

		var storyMediaView = Backbone.View.extend({
			events: {
				"click .audio-player-trigger": "launchAudioPlayer"
			},
			initialize: function(options) {
				this.options = options || {};
				this.listenToOnce(this.collection, "add", this.render);
				this.siteMap = ["identity", "institution-building", "growth", "research", "education", "ripple-effect",
								"intersections"];
				// All the spans in the DOM
				this.spans = this.$("span");
				// A reference to the child views to unbind them when switching routes
				this.imgSlideSubViews = [];
				this.videoSubview = [];
			},
			render: function() {
				// Group media by mime type
				this.groupedMedia = _.groupBy(this.collection.groupByTags(0)[this.options.theme[0]], function(item){
					return item.get('mime_type');
				});
				/* START rendering the audio icons in between the text */
				//iterate to each span from dom view
				_.each(this.spans, function(span){
					//find the matching tag from the file tags to match the tag in dom view
					var mappedAudio = _.find(this.groupedMedia["audio/mpeg"], function(item){
						if(span.innerHTML === item.get('tags').name){
							return item;	
						}
					});
					
					//append the audio icon to dom
					if(mappedAudio){
						$(span).html('<i class="fa fa-play-circle audio-player-trigger"  style="cursor: pointer;"  aria-hidden="true" data-tag="'+mappedAudio.get('tags').name+
								'"data-url="'+mappedAudio.get('fileurls').original+'"data-description="'+mappedAudio.get('description').text+'"data-rights="'+mappedAudio.get('rights').text+'"></i>');
					}
				}, this);
				/* END rendering the audio icons in between the text*/

				/* START rendering the Image slider view in between the text*/
				//iterate to each span from dom view
				_.each(this.spans, function(span){
					//find the matching tag from the file tags to match the tag in dom view
					//which will be an array of items for images
					var mapped = _.map(this.groupedMedia["image/jpeg"], function(item){
						//the grouping is based on the 3rd char in tag series seperated by -
						var tagArray = item.get('tags').name.split('-');
						var domTagmatch = tagArray.splice(3, 2);
						//console.log(tagArray, span, "map dom", domTagmatch);
						if(span.innerHTML === tagArray.join('-')){
							return item;
						}
					});
					//clean up the array of unwanted values
					var cleanedMapped = _.compact(mapped);
					//sort the array by order
					var sorted = _.sortBy(cleanedMapped, function(item){
						//console.log(item.get('tags').name.split('-')[3]);
						return item.get('tags').name.split('-')[3];
					});
					//since sort goes through a string of values - a natural order sorting is required
					var nsort = sorted.sort(naturalCompare);
					// append the list of images to Dom
					if(sorted.length){
						this.slider =  new imgSliderView({el: span, content: nsort, model: new imgSliderModel()});
						this.imgSlideSubViews.push(this.slider);
					}

				}, this);
				/* END rendering the Image slider view in between the text*/

				/* START rendering the Video players in between the text*/
				//iterate to each span from dom view
				_.each(this.spans, function(span){
					//find the matching tag from the file tags to match the tag in dom view
					var mappedVideo = _.find(this.groupedMedia["video/mp4"], function(item){
						//console.log(span.innerHTML, item.get('tags').name, 'matched?')
						if(span.innerHTML === item.get('tags').name){
							return item;	
						}
					});
					
					//append the audio icon to dom
					if(mappedVideo){
						//console.log(mappedVideo.toJSON());
						this.video = new VideoView({el: span, content: mappedVideo});
						this.videoSubview.push(this.video);
					}
				}, this);
				/* END rendering the Video players in between the text*/
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
				app.currentAudio = new AudioView({data: event.target.dataset, content: this.groupedMedia["audio/mpeg"]});
			}
		});

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

	app.init();
	}); // end require statement



})(); // end window load



