var smoother = new Smoother(0.85, [0, 0, 0, 0, 0]);
var step = "=0";

$(document).ready(function(){

	var video = document.createElement("video");
	video.id = "tilt-video";
	$('body').prepend(video);

	$('#tilt-video').on('click', function(){
		$(this).toggleClass('scroll-on');
	});

	var map = [];
	onkeydown = onkeyup = function(e){
	    e = e || event; // to deal with IE
	    map[e.keyCode] = e.type == 'keydown';

	    if (map[84] && map[32]){
				$("#tilt-video").toggleClass('scroll-on');
				console.log(e);
				e.preventDefault();
			}
	    console.log('key pressed');
	    return;
	}

	$('body').bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
    if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
    	$('body').stop().unbind('scroll mousedown DOMMouseScroll mousewheel keyup');
    }
	});

	try {
		compatibility.getUserMedia({video: true}, function(stream) {
			try {
				video.src = compatibility.URL.createObjectURL(stream);
			} catch (error) {
				video.src = stream;
			}
			video.play();

			compatibility.requestAnimationFrame(tick);
		}, function (error) {
			alert("WebRTC not available");
		});
	} catch (error) {
		alert(error);
	}

	function tick() {
		compatibility.requestAnimationFrame(tick);
		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			$(video).objectdetect("all", {scaleMin: 3, scaleFactor: 1.1, classifier: objectdetect.frontalface}, function(coords) {
				if ($('#tilt-video').hasClass('scroll-on') && !coords[0]) {
					$("#tilt-video").toggleClass('detected');
					scrollDown();
				}
			});
		}
	}

	function scrollDown() {
		if ($('#tilt-video').hasClass('scroll-on')){
			step = "+=30";
		} else {
			step = "+=0";
		}

	  $("body").animate({scrollTop: step}, 1);
	}
});