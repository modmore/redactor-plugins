if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{   
    $.fn.animateRotate = function(angle, duration, easing, start, complete) {
        var args = $.speed(duration, easing, complete);
        var step = args.step;
        return this.each(function(i, e) {
            args.complete = $.proxy(args.complete, e);
            args.step = function(now) {
                $.style(e, 'transform', 'rotate(' + now + 'deg)');
                if (step) return step.apply(e, arguments);
            };
            
            $({deg: start}).animate({deg: angle}, args);
        });
    };
    
	RedactorPlugins.counter = function()
	{
		return {
			init: function()
			{
				//if (!this.opts.counterCallback) return;
                //if(!$.isFunction(this.opts.counterCallback)) this.opts.counterCallback = Function("data",this.opts.counterCallback);
                
                $(this.$editor).after('<p class="redactor_counter" id="redactor_counter-' + this.uuid + '"><span class="time-wrap"><i class="icon icon-power-off"></i>&nbsp;<span class="reading-time"></span></span>&emsp;&emsp;<span class="word-count-wrap"><i class="icon icon-keyboard-o"></i>&nbsp;<span class="word-count"></span></span></p>');
                var messageBox = $('#redactor_counter-' + this.uuid);
                
				this.$editor.on('keyup.redactor-limiter', $.proxy(function(e) {
                    doKeyUp(this);
				}, this));
                
                var that = this;
                this.$element.on("sourceCallback",function(data){ // #janky REQUIRES redactor.js#L2717 hack.
                    if(!that.opts.visual) {
                        messageBox.hide();
                    } else {
                        messageBox.show();
                    }
                });
                
                doKeyUp(this);

                function doKeyUp(that) {
					var words = 0, characters = 0, spaces = 0;

					var html = that.code.get();

					var text = html.replace(/<\/(.*?)>/gi, ' ');
					text = text.replace(/<(.*?)>/gi, '');
					text = text.replace(/\t/gi, '');
					text = text.replace(/\n/gi, '');
					text = text.replace(/\r/gi, '');
					text = $.trim(text);

					if (text !== '')
					{
						var arrWords = text.split(/\s+/);
						var arrSpaces = text.match(/\s/g);

						if (arrWords) words = arrWords.length;
						if (arrSpaces) spaces = arrSpaces.length;

						characters = text.length;

					}
                    
                    var wordsPerMinute = that.opts.counterWPM || 275;

        	        //split text by spaces to define total words
        			var totalWords = $(that.$editor).text().trim().split(/\s+/g).length;
			
        			//define words per second based on words per minute (wordsPerMinute)
        			var wordsPerSecond = wordsPerMinute / 60;
			
        			//define total reading time in seconds
        			var totalReadingTimeSeconds = totalWords / wordsPerSecond;
                    
                    var _t = millisToTime(totalReadingTimeSeconds * 1000);
                                        
                    var _title = 'Estimated Read Time: ';
                    if(_t.hours) {
                        _title += _t.hours.toString() + ' ' + ((_t.hours > 1) ? 'Hours ' : 'Hour ');
                    }
                    
                    _title += _t.minutes.toString() + ' ' + ((_t.minutes > 1) ? 'Minutes ' : 'Minute ');
                    _title += _t.seconds.toString() + ' ' + ((_t.seconds > 1) ? 'Seconds ' : 'Second ');
                    
                    var _rc = $(that.$editor).parent().children('.redactor_counter');
                    
                    _rc.find('.reading-time')
                      .text(((_t.hours) ? _t.hours + ':' : '') + ((_t.minutes.toString().length < 2) ? '0' + _t.minutes.toString() : _t.minutes) + ':' + ((_t.seconds.toString().length < 2) ? '0' + _t.seconds.toString() : _t.seconds))
                      .parent().attr('title',_title);
                    _rc.find('.word-count')
                      .text(totalWords.toLocaleString() + ' words')
                      .parent().attr('title',characters.toLocaleString() + ' characters (' + Number(characters - spaces).toLocaleString() + ' non-space)');
                    
                    var d = (totalReadingTimeSeconds / (3600)) * 360;
                    
                    _rc.find('.icon-power-off').data('deg',d).animateRotate(d,
                      180,
                      'linear',
                      _rc.find('.icon-power-off').data('deg')
                    );
                    
                }
                
                function millisToTime(ms) {
                    var x, seconds, minutes, hours, days;
                    
                    x = ms / 1000;
                    seconds = Math.round(x % 60);
                    x /= 60;
                    minutes = Math.round(x % 60);
                    x /= 60;
                    hours = Math.round(x % 24);
                    x /= 24;
                    days = Math.round(x);

                    return {"days" : days, "hours" : hours, "minutes" : minutes, "seconds" : seconds};
                }
			}

		};
	};
})(jQuery);