

(function(){

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
		initialize: function(options){
			this.siteMap = [
			["Identity","Space for biology", "Science in India", "Recognition", "Reflections"],
			["Institution Building", "Space & Autonomy", "Paper Trails", "Architecture"],
			["Growth", "Hiring", "Start-ups", "Collaborations", "Student Selections", "Scaling"],
			["Research", "Basic/Applied toggle", "Areas and shifts", "Processes", "Queries and tools"],
			["Education", "Building knowledge", "Mentorship"],
			["Ripple Effect", "Effects and Toll", "Interaction/Isolation"],
			["Intersections", "Gender Equality", "Hierarchy & Class", "NCBS Community", "Outside World"]];
			this.options = options || {};
			this.tags = this.options.tag.split('-');
			this.listenTo(this.collection, "add", this.render);
		},
		render: function(){
			this.model = this.collection.get(this.tags[0]);
			
			window.scrollTo(0,0);
			this.$el.html(this.template({content: this.model.toJSON(), sitemap:this.siteMap[this.tags[0]-1]}));
			this.$("#ncbs-narrative-container .nav-tabs li").first().addClass("active");
			this.$("#ncbs-narrative-container .tab-pane").first().addClass("active");
			this.mediaContainer = new storyMediaView({
				el:"#ncbs-narrative-container", 
				tag: "1-india-ps-1", 
				media: this.options.content
			});
			this.mediaContainer.render();

		}
	});

	});

	storyMediaView = Backbone.View.extend({
		events: {
			"click .audio-player-trigger": "launchAudioPlayer"
		},
		initialize: function(options) {
			this.options = options || {};
			this.spans = this.$("span");
			this.groupedMedia = _.groupBy(this.options.media, function(item){
				return item.get('mime_type');
			});
			console.log(this.groupedMedia);
	
		},
		render: function() {
			//iterate to each item of the collection by media type
			_.each(this.groupedMedia["audio/mpeg"], function(item){
				//find the matching tag from  dom for each item
				this.found = _.find(this.spans, function(span){
					return span.innerHTML === item.get('tags').name;
				});
				console.log(this.found, "audio");
				//append audio icons where the dom matches
				$(this.found).html('<i class="fa fa-play-circle audio-player-trigger" aria-hidden="true" data-tag='+item.get("tags").name+'></i>');
			}, this);

			_.each(this.spans, function(span){
				var mapped = _.map(this.groupedMedia["image/jpeg"], function(item){
					var tagArray = item.get('tags').name.split('-');
					var domTagmatch = tagArray.splice(3, 1);
					if(span.innerHTML === tagArray.join('-')){
						return item;
					}
				});

				var cleanedMapped = _.compact(mapped);
				if(cleanedMapped.length){
					new imgSliderView({el: span, content: cleanedMapped});
				}
				
			}, this);
			
			//this.slide1 = new imgSliderView({el: this.spans[1], content: dummy});
			//this.slide1.render();

			return this;

		},
		launchAudioPlayer: function(event){
			console.log(event.target.dataset, event.currentTarget, "clicked audio icon");
			new AudioView({el: "#audio-player-container", tags: event.target.dataset, content: this.groupedMedia["audio/mpeg"]});
		}
	});

})();



