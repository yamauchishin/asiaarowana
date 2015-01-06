/*global $:false */
$(function() {
	// SVG custom feature detection and svg to png fallback
	function supportsSVG() {
		return !!document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
	}
	if (supportsSVG()) {
		document.documentElement.className += ' svg';
	} else {
		document.documentElement.className += ' no-svg';
		var imgs = document.getElementsByTagName('img');
		var dotSVG = /.*\.svg$/;
		for (var i = 0; i !== imgs.length; ++i) {
			if (imgs[i].src.match(dotSVG)) {
				imgs[i].src = imgs[i].src.slice(0, -3) + 'png';
			}
		}
	}
	var chkTouch = ('ontouchstart' in window); // detect if touch device
	var infoWrap = '.rsActiveSlide .infoWrap';

	// add fade effect on page load and exit 
	$('head').append('<style>#wrap{visibility:hidden;}</style>');
	$('#wrap').after('<div id="fade"></div>').css('visibility', 'visible');
	$('#fade').fadeOut(400);
	// $('.jump').click(function() {
	// 	var url = $(this).attr('href');
	// 	$('#fade').fadeIn(400, function() {
	// 		location.href = url;
	// 	});
	// 	return false;
	// });
	// reload when page navigating back
	window.onunload = function() {};
	// hack to solve problem on mobile safari when page navigating back
	if ((/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
		window.onpageshow = function(evt) {
			// if persisted then it is in the page cache, force a reload of the page
			if (evt.persisted) {
				document.body.style.display = "none";
				location.reload();
			}
		};
	}

	// fullscreen img
	if ($('body').attr('class') === 'home') {
		function FullScreenBack(theItem) {
			var winWidth = $(window).width();
			var winHeight = $(window).height();
			var imageWidth = $(theItem).width();
			var imageHeight = $(theItem).height();
			var picHeight = imageHeight / imageWidth;
			var picWidth = imageWidth / imageHeight;
			if ((winHeight / winWidth) < picHeight) {
				$(theItem).css('width', winWidth);
				$(theItem).css('height', picHeight * winWidth);
			} else {
				$(theItem).css('height', winHeight);
				$(theItem).css('width', picWidth * winHeight);
			}
			$(theItem).css('margin-left', winWidth / 2 - $(theItem).width() / 2);
			$(theItem).css('margin-top', winHeight / 2 - $(theItem).height() / 2);
		}
		$(window).bind('load resize', function() {
			FullScreenBack('.bgImg');
		});


		// navigations switch bg img
		if (chkTouch) {
			$('.parent span').hover(function() {
				$(this).addClass('.hover');
			});
			$('.child').css('display','inline-block');
			$('a:not(.nolink)').css('color','#fff');
			$('.nolink').css('pointer-events','none');
		} else {
			$('.navItem').each(function(i) {
				i = i + 1;
				$(this).hover(function() {
					$('.navItem').not(this).css('color', 'rgba(255,255,255,.6)');
					$(this).css('color', '#fff');
					$('.bgImg').not('#bg' + i).fadeTo(0, 0);
					$('#bg' + i).fadeTo(0, 1);
				});
			});
		}
		// disable href value of link tag
		$(function() {
			$('a[class=nojump]').click(function() {
				return false;
			});
		});

		// show stockist section
		if (!$('#navStockist').hasClass('nolink')) {
			$('#navStockist').click(function() {
				$('#stockist').css('cssText', 'visibility: visible !important').css('z-index', 1).stop().fadeTo(1000, 1);
				$('nav ul, aside').css({
					opacity: 1,
					visibility: "visible"
				}).animate({
					opacity: 0
				});
			});
		}
		// show exhibition section
		if (!$('#navExhibition').hasClass('nolink')) {
			$('#navExhibition').click(function() {
				$('#exhibition').css('cssText', 'visibility: visible !important').css('z-index', 1).stop().fadeTo(1000, 1);
				$('nav ul, aside').css({
					opacity: 1,
					visibility: "visible"
				}).animate({
					opacity: 0
				});
			});
		}
		// show branding section
		if (!$('#navBranding').hasClass('nolink')) {
			$('#navBranding').click(function() {
				$('#branding').css('cssText', 'visibility: visible !important').css('z-index', 1).stop().fadeTo(1000, 1);
				$('nav ul, aside').css({
					opacity: 1,
					visibility: "visible"
				}).animate({
					opacity: 0
				});
			});
		}
	} else if ($('body').hasClass('gallery')) { // gallery page
		$(function() {
			if (!chkTouch) {
				mouseMoveSlider();
				$(window).resize(function() {
					mouseMoveSlider();
				});
			}
			// $('#branding, .rsContent, .rsImg').css('cssText', 'visibility: visible !important').css('z-index', 1).stop().fadeTo(1000, 1);
			// $('.royalSlider').data('royalSlider').updateSliderSize(true);
			var $rsThumbs = $('.rsThumbs');
			$rsThumbs.fadeTo(1000, 1);
			var thumbsFade = setTimeout(function() {
				$('.rsThumbs').fadeTo(1000, 0);
			}, 3000);
			$rsThumbs.hover(

			function() {
				$(this).stop().fadeTo(200, 1);
				clearTimeout(thumbsFade);
			}, function() {
				$(this).stop().fadeTo(600, 0);
			});

			$(infoWrap).fadeTo(1000, 1);
			var slider = $(".royalSlider").data('royalSlider');
			slider.ev.on('rsAfterSlideChange', function() {
				$(infoWrap).fadeTo(1000, 1);
				$('.rsSlide:not(.rsActiveSlide) .infoWrap').fadeTo(0, 0);
			});
		});
	} else if ($('body').hasClass('product')) { // product page
		$(function() {
			if (!chkTouch) {
				mouseMoveSlider();
				$(window).resize(function() {
					mouseMoveSlider();
				});
			}
			var n = 1;
			var total;
			var timer;

			function loop() {
				if (n < total) {
					$('.rsActiveSlide .rightCol img:nth-child(' + n + ')').fadeTo(800, 0).next('img').fadeTo(800, 1);
					n++;
				} else {
					$('.rsActiveSlide .rightCol img:nth-child(' + n + ')').fadeTo(800, 0);
					$('.rsActiveSlide .rightCol img:first-child').fadeTo(800, 1);
					n = 1;
				}
				start(); // restart the timer
			}

			function start() { // use a one-off timer
				total = $('.rsActiveSlide .rightCol img').length;
				if (total !== 1) {
					timer = setTimeout(loop, 5000);
				}
			}

			function pause() { // clear the timer
				clearTimeout(timer);
			}
			//switch columns width
			$(document).on('click', '.rsActiveSlide .rightCol:not(.on)', function() {
				$(this).addClass('on');
				$('.rsActiveSlide .leftCol').addClass('on');
				start();
			});
			$(document).on('click', '.rsActiveSlide .leftCol.on', function() {
				$(this).removeClass('on');
				$('.rsActiveSlide .rightCol').removeClass('on');
				pause();
			});
			var slider = $('.royalSlider').data('royalSlider');
			slider.ev.on('rsAfterSlideChange', function() {
				$('.on').removeClass('on'); // close right column
				pause(); // clear the timer
			});
		});
	}
	// close section
	var $close = $('.closeBtn');
	$(function() {
		if(!chkTouch) {
			if ($close.css('display') !== 'none') { // mouseover effect
				$close.fadeTo(400, 0.6);
			}
			$close.hover(

			function() { //mouse over
				var $this = $(this);
				$this.stop().fadeTo(400, 1);
			}, function() { //mouse out
				var $this = $(this);
				$this.stop().fadeTo(400, 0.6);
			});
		}
		$close.click(function() {
			if ($('body').hasClass('home')) {
				$('section, .rsContent, .rsImg').fadeTo(1000, 0, function() {
					$(this).css('cssText', 'visibility: hidden !important');
				});
				if ($('#stockist').children($(this))) {
					$('nav ul, aside').css({
						opacity: 0.0,
						visibility: "visible"
					}).animate({
						opacity: 1.0
					});
				}
				return false;
			}
		});
	});

	// mouse move thumbnail slider
	function mouseMoveSlider() {
		var $slider = $('.rsThumbsContainer');
		var $sliderWidth = $slider.width();
		var $windowWidth = $(window).width();
		var $placement = findPos(window);
		//mouse move
		$slider.mousemove(function(e) {
			if ($sliderWidth > $windowWidth) {
				var mouseCoords = (e.pageX - $placement[1]);
				var mousePercentX = mouseCoords / $windowWidth;
				var destX = -(($sliderWidth - ($windowWidth * 2)) * (mousePercentX));
				var thePosA = mouseCoords - destX;
				var thePosB = destX - mouseCoords;
				if (mouseCoords > destX) {
					$slider.stop().animate({
						left: -thePosA
					}, 600, 'easeOutCirc');
				} else if (mouseCoords < destX) {
					$slider.stop().animate({
						left: thePosB
					}, 600, 'easeOutCirc');
				} else {
					$slider.stop();
				}
			}
		});
	}

	function findPos(obj) {
		var curleft = 0;
		var curtop = 0;
		if (obj.offsetParent) {
			curleft = obj.offsetLeft;
			curtop = obj.offsetTop;
			while (obj === obj.offsetParent) {
				curleft += obj.offsetLeft;
				curtop += obj.offsetTop;
			}
		}
		return [curtop, curleft];
	}
}); // end document ready