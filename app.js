

(function(){
	app = window.app || {};
	// Site content from omeka api as required by the client 
	//interfaces.
	app.controller = AppController();
	storyCollection = Backbone.Collection.extend({
		groupByTags: function(index){
			return this.groupBy(function(item){
				return item.get('tags').name.split('-')[index];
			}, index);
		}
	});
	APIcontent = new storyCollection;
	
	
	app.init = function() {
		//$('#ncbs-content-policy').modal();
		app.router = new ApplicationRouter();
		this.headerView = new HeaderView();
		this.headerView.render();
		this.footerView = new FooterView();
		this.footerView.render();
		Backbone.history.start();

		//$('#ncbs-content-policy').modal();
		//$("#spinner-launch").toggle();
	};

	require(['libs/text!templates/header.html', 'libs/text!templates/home.html', 'libs/text!templates/footer.html'], function (headerTpl, homeTpl, footerTpl) {
		


		HeaderView = Backbone.View.extend({
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

		FooterView = Backbone.View.extend({
			el: "#footer",
			template: footerTpl,
			render: function() {
				this.$el.html(_.template(this.template));
			}
		})
		HomeView = Backbone.View.extend({
			el: "#content",
			template: homeTpl,
			
			
			initialize: function() {
				this.$container = $("#main");
				
			},
			render: function() {

				this.$container.append(this.$el.html(_.template(this.template)));
			}
			
		});	

		aboutView = Backbone.View.extend({
			el: "#content",
			template: _.template($("#about-page-template").html()),
			
			
			initialize: function() {
				//this.$container = $("#main");
				
			},
			render: function() {
				this.$el.html(this.template);
			}
			
		});	

		subthemeNav = Backbone.View.extend({
			el: "#content",
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
				this.listenTo(this.collection, "add", this.render);
				//this.listenTo(APIcontent, "add", this.render);
				//APIcontent.once("add", this.render);
			},
			render: function(){
				this.model = this.collection.get(this.tags[0]);
				window.scrollTo(0,0);
				this.$el.html(this.template({content: this.model.toJSON(), sitemap:this.siteMap[this.tags[0]-1], 
							tabIcon: this.tabIconPath[this.tags[0]-1], className: this.siteMap[this.tags[0]-1][0]+"-tabs"}));
				this.$("#ncbs-narrative-container .nav-tabs li").first().addClass("active");
				this.$("#ncbs-narrative-container .tab-pane").first().addClass("active");
				this.mediaContainer = new storyMediaView({
					el:"#ncbs-narrative-container", 
					collection:APIcontent,
					theme: this.tags[0]
					//media: APIcontent.groupByTags(0)[this.tags[0]]
				});
				this.mediaContainer.render();
				this.Gallery = new GalleryView({
					//content: APIcontent.groupByTags(0)[this.tags[0]],
					collection:APIcontent, 
					theme: this.tags[0]
				});
				this.Gallery.render();
			},
			refreshViewer: function(event){
				_.each(this.mediaContainer.imgSlideSubViews, function(item){
					item.render();
					item.viewer.refresh();
					return item;
				});

			}
		});



		storyMediaView = Backbone.View.extend({
			events: {
				"click .audio-player-trigger": "launchAudioPlayer"
			},
			initialize: function(options) {
				this.options = options || {};

				this.listenToOnce(this.collection, "add", this.render);
				//this.listenTo(this.collection, "change", this.reRoute);
				this.siteMap = ["identity", "institution-building", "growth", "research", "education", "ripple-effect",
								"intersections"];
				
				console.log(this.options);
				this.spans = this.$("span");
				this.imgSlideSubViews = [];
				//this.render();
				//console.log(this.groupedMedia);
			},
			render: function() {
				this.groupedMedia = _.groupBy(this.collection.groupByTags(0)[this.options.theme[0]], function(item){
					return item.get('mime_type');
				});
				
				//iterate to each span from dom view
				_.each(this.spans, function(span){
					//find the matching tag from the file tags to match the tag in dom view
					var mappedAudio = _.find(this.groupedMedia["audio/mpeg"], function(item){
						//console.log(span.innerHTML, item.get('tags').name, 'matched?')
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
						//this.slider.trigger("refreshSlide");
						//sliderModel.set("hack", span.innerHTML);
					}				
				}, this);
				
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
						new VideoView({el: span, content: mappedVideo});
					}
				}, this);

				//$("#spinner-launch").toggle();

				return this;

			},
			launchAudioPlayer: function(event){
				console.log(event.target.dataset, event.currentTarget, app, "clicked audio icon");
				new AudioView({el: "#audio-player-container", data: event.target.dataset, content: this.groupedMedia["audio/mpeg"]});
			},
			reRoute: function(){
				if(this.collection.length > 900){
					this.render();
				}
				console.log("collection length is less");
				/*var routeIndex = this.options.theme.split('-')[0];
				console.log(this.siteMap[routeIndex-1], this.options);
				app.router.navigate(this.siteMap[routeIndex-1], {trigger: true});*/
			}
		});



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



