(function($) {
    $.fn.bunnySketch = function(options) {
        // valori di default
        var config = {
        	'brush': {
        		'color' : '#333',
	        	'size' : '5',
	        	'join' : 'round',
	        	'cap' : 'round'
        	}
        };
 
        if (options) $.extend(config, options);
 
        this.each(function(i,e) {
            $this = $(this);

            // definizione canvas
			var canvas=document.getElementById($this.attr('id'));
			var jCanvas=$('#'+$this.attr('id'));
 			// definizione context
 			var ctx=canvas.getContext('2d');
 			// definiamo la toolbar
 			var toolbar='[data-bunnySketch-toolbar='+$this.attr('id')+']';
 			// definiamo lo storico delle operazioni
 			var story = new Array();
			var step = -1;

 			// impostazione pennello di partenza
 			setBrush(config.brush);

 			// impostazioni canvas di partenza
			var x = null;
			var y = null;
			var drawing = false;



 			// funzioni di disegno
 			
 			function startDraw (e){
				drawing=true;
				x=e.gesture.center.pageX - canvas.offsetLeft;
				y=e.gesture.center.pageY - canvas.offsetLeft;
				console.log('x:', x, 'y:', y);
			}

			function stopDraw (e){
				drawing=false;
				sPush();
			}

			function draw (e){
				if (drawing==false) return;

				start={
					'x' : x,
					'y' : y
				};
				current={
					'x' : e.gesture.center.pageX - canvas.offsetLeft,
					'y' : e.gesture.center.pageY - canvas.offsetLeft
				};

				x=current.x;
				y=current.y;

				ctx.beginPath();
				ctx.moveTo(start.x, start.y);
				ctx.lineTo(current.x, current.y);
				ctx.stroke();
				ctx.closePath();
			}

			function insertImage(src){
				img = new Image();
  				img.src = src;
  				ctx.drawImage(img,0,0);
  				sPush();
			}

			function insertImageN(src){
				img = new Image();
  				img.src = src;
  				ctx.drawImage(img,0,0);
			}

			function clear(){
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				sPush();
			}

			function clearN(){
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			}



			// funzioni dello storico
			function sPush(){
				step++;
			    if (step < story.length) { story.length = step; }
			    story.push(canvas.toDataURL());
			}

			function undo(){
				console.log(story);
				if (step > 0) {
			        step--;
					clearN();
			        insertImageN(story[step]);
			    }
			}

			function redo(){
				if (step < story.length-1) {
			        step++;
					clearN();
			        insertImageN(story[step]);
			    }
			}
 			


 			// funzioni di settaggio

 			function setBrush (brush){
 				console.log(brush);
 				if(typeof brush.join!= 'undefined') ctx.lineJoin = brush.join; console.log('join:', ctx.lineJoin);
				if(typeof brush.cap!= 'undefined') ctx.lineCap = brush.cap; console.log('cap:', ctx.lineCap);
				if(typeof brush.color!= 'undefined') setColor(brush.color);
				if(typeof brush.size!= 'undefined') setSize(brush.size);
 			}

 			function setColor (color){
 				ctx.strokeStyle = color;
 			}

 			function setSize (size){
 				ctx.lineWidth = size;
 			}

 			function setAlpha(alpha){
 				ctx.globalAlpha = alpha;
 			}



 			// eventi
 			// mouse e touch
 			Hammer(canvas, {prevent_default: true})
			    .on('doubletap', function(e) { // And double click
			        // Zoom-in
			    })
			    .on('dragstart', function(e) { // And mousedown
			        startDraw(e);
			    })
			    .on('drag', function(e) { // And mousemove when mousedown
			        draw(e);
			    })
			    .on('dragend', function(e) { // And mouseup
			        stopDraw(e);
			    });


			// toolbar
			$(toolbar+' [data-bunnySketch-color]').click(function(e){
				setColor($(this).data('bunnySketch-color'));
			});

			$(toolbar+' [data-bunnySketch-size]').click(function(e){
				setSize($(this).data('bunnySketch-size'));
			});

			$(toolbar+' [data-bunnySketch-image]').click(function(e){
				insertImage($(this).data('bunnySketch-image'));
			});

			$(toolbar+' [data-bunnySketch-brush]').click(function(e){
				setBrush($(this).data('bunnySketch-brush'));
			});

			$(toolbar+' [data-bunnySketch-alpha]').click(function(e){
				setAlpha($(this).data('bunnySketch-alpha'));
			});

			$(toolbar+' [data-bunnySketch-undo]').click(function(e){
				undo();
			});

			$(toolbar+' [data-bunnySketch-redo]').click(function(e){
				redo();
			});

			$(toolbar+' [data-bunnySketch-clear]').click(function(e){
				clear();
			});

        });
 
        return this;
 
    }
})(jQuery);