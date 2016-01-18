// Including the required scrollTo script
/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c);};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable();};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement;});};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0;}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e===null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break;}targ=$(targ,this);if(!targ.length){return;}break;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset();}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0;}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos];}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c;}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key];}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,e,g);});}}).end();};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d]);};function both(a){return typeof a=='object'?a:{top:a,left:a};}})(jQuery);


/*
// YB Content Grid Plugin
// jQuery Plugin for Displaying Content in a grid form
// by Shelby Neil Smith
*/

;(function($) {
	$.ContentGrid = function(options) {
		var defaults = {
			container: $('.content-grid'),
			directionNav: false,
			ajax: false,
			getActiveContent: function() { console.log('Set up an active content callback function!'); },
		};

		this.settings = $.extend({}, defaults, options);
	};

	$.ContentGrid.prototype.init = function() {
		var ContentGrid = this;

		if ( this.settings.container.length > 0 ) {
			var activeContainerHTML = "<div class='active-container' tabindex='1'>";
			activeContainerHTML += "<div class='active-controls'>";
			activeContainerHTML += "<span class='close-btn active-btn' title='Close'>Close</span>";
			if (this.settings.directionNav) {
				activeContainerHTML += "<span class='prev-btn active-btn' title='Previous'>Previous</span>";
				activeContainerHTML += "<span class='next-btn active-btn' title='Next'>Next</span>";
			}
			activeContainerHTML += "</div>";
			activeContainerHTML += "<div class='content'></div>";
			activeContainerHTML += "</div>";
			this.settings.container.before(activeContainerHTML);

			$( '.grid-square' ).each( function() {
				$(this).bind( 'click', function(evt) {
					ContentGrid.showActive(evt);
				});
			});

			this.bindActiveBtns();
		}
	};

	$.ContentGrid.prototype.showActive = function( evt ) {
		var target;

		if ($( '.active-container' ).hasClass( 'active' ) ) {
			this.hideActive();
		}

		if (typeof evt.target === 'undefined') {
			target = evt.srcElement;
		} else {
			target = evt.target;
		}

		var $elem = $( target ).closest('.grid-square');

		var ContentGrid = this;

		if (!$elem.hasClass('active')) {
			$elem.addClass('active');

			scrollToElement('#content', function() {
				if (!$('.active-container').hasClass('active')) {
					$( '.active-container' ).addClass( 'active' ).focus();

					if (ContentGrid.settings.directionNav) {
						$('.active-container').bind('keydown', function(evt) {
							if ( evt.which == 39 ) {
								navHandler(evt, 'next');
							}
							if ( evt.which == 37 ) {
								navHandler(evt, 'prev');
							}
						});
					}
				}

				if (ContentGrid.settings.ajax) {
					$('.active-container').prepend('<div class="grid-loading"></div>');

					var activeAjaxData = ContentGrid.settings.ajax.ajaxDataFunction($elem);

					$.ajax({
						url: ContentGrid.settings.ajax.url,
						data: (activeAjaxData),
						success: function(response) {
							$('.active-container .grid-loading').remove();

							$('.active-container .content').html(response).fadeIn('fast', function() {
								var activeHeight = 0;
								var t_elem;  // the highest element (after the function runs)

								$('.active-container .content').children().each(function () {
									var $this = $(this);
									if ( parseInt($this.css('height')) > activeHeight ) {
										t_elem = this;
										activeHeight = parseInt($this.css('height'));
									}
								});

								$('.active-container').css('min-height', activeHeight);

								ContentGrid.settings.ajax.successCallback($elem);
							});
						}
					});
				} else {
					ContentGrid.settings.getActiveContent($elem);
				}

				if ($('.grid-square.active').is('.grid-square:last-of-type')) {
					$( '.active-container.active .next-btn' ).addClass('disabled').unbind('click');
				} else {
					if ($( '.active-container.active .next-btn' ).hasClass('disabled')) {
						$( '.active-container.active .next-btn' ).removeClass('disabled').bind( 'click', function(evt) {
							navHandler(evt, 'next');
						});
					}
				}
				if ($('.grid-square.active').is('.grid-square:first-of-type')) {
					$( '.active-container.active .prev-btn' ).addClass('disabled').unbind('click');
				} else {
					if ($( '.active-container.active .prev-btn' ).hasClass('disabled')) {
						$( '.active-container.active .prev-btn' ).removeClass('disabled').bind( 'click', function(evt) {
							navHandler(evt, 'prev');
						});
					}
				}
			});
		}

		return false;
	};

	$.ContentGrid.prototype.bindActiveBtns = function() {
		var ContentGrid = this;
		$( '.active-container .close-btn' ).fadeIn().bind( 'click', function(evt) {
			$('.active-container').unbind('keydown');
			$('.active-container').css('min-height', '');
			$('.active-container.active').removeClass('active');
			ContentGrid.hideActive();
		});
		if (ContentGrid.settings.directionNav) {
			$( '.active-container .next-btn' ).fadeIn().bind( 'click', function(evt) {
				navHandler(evt, 'next');
			});
			$( '.active-container .prev-btn' ).fadeIn().bind( 'click', function(evt) {
				navHandler(evt, 'prev');
			});
		}
	};

	$.ContentGrid.prototype.hideActive = function() {
		$( '.grid-square.active' ).removeClass('active');
		$( '.active-container .content' ).fadeOut('fast', function() {
			$('.active-container .content').html('');
		});
	};

	function navHandler(evt, dir) {
		var curGridItem = $('.grid-square.active');

		if (dir === 'next') {
			curGridItem = curGridItem.next();
		}
		if (dir === 'prev') {
			curGridItem = curGridItem.prev();
		}
		curGridItem.trigger('click');
	}

	function scrollToElement(selector, callback) {
		var animation = {scrollTop: $(selector).offset().top};
		$('html,body').animate(animation, 'fast', 'swing', function() {
			if (typeof callback === 'function') {
				callback();
			}
			callback = null;
		});
	}

})(jQuery);
