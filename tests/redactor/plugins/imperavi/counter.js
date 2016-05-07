(function($)
{
	$.Redactor.prototype.counter = function() {
		return {
			init: function() {
				//if (typeof this.opts.callbacks.counter === 'undefined') return;

				this.core.editor().after('<p class="redactor_counter" id="redactor_counter-' + this.uuid + '"><span class="time-wrap"><i class="icon icon-power-off"></i>&nbsp;<span class="reading-time"></span></span>&emsp;&emsp;<span class="word-count-wrap"><i class="icon icon-keyboard-o"></i>&nbsp;<span class="word-count"></span></span></p>');
        this.counter.messageBox = $('#redactor_counter-' + this.uuid);

				this.core.editor().on('keyup.redactor-plugin-counter', $.proxy(this.counter.count, this));
				this.core.editor().on('sourceToggle', $.proxy(this.counter.sourceCallback, this));

				this.counter.count();
			},
			sourceCallback: function(e,data){
				(data.sourceMode) ? $(this.counter.messageBox).hide() : $(this.counter.messageBox).show();
			},
			count: function() {
				var that = this,
				words = 0, characters = 0, spaces = 0,
				html = this.code.get(),
				text = html.replace(/<\/(.*?)>/gi, ' ');

				text = text.replace(/<(.*?)>/gi, '');
				text = text.replace(/\t/gi, '');
				text = text.replace(/\n/gi, ' ');
				text = text.replace(/\r/gi, ' ');
				text = text.replace(/\u200B/g, '');
				text = $.trim(text);

				if (text !== '') {
					var arrWords = text.split(/\s+/),
					arrSpaces = text.match(/\s/g);

					words = (arrWords) ? arrWords.length : 0;
					spaces = (arrSpaces) ? arrSpaces.length : 0;

					characters = text.length;
				}

				var wordsPerMinute = that.opts.counterWPM || 275;

        //split text by spaces to define total words
        var totalWords = words; //this.core.editor().text().trim().split(/\s+/g).length;

        //define words per second based on words per minute (wordsPerMinute)
        var wordsPerSecond = wordsPerMinute / 60;

        //define total reading time in seconds
        var totalReadingTimeSeconds = totalWords / wordsPerSecond;

        var _t = millisToTime(totalReadingTimeSeconds * 1000);

				var _title = 'Estimated Read Time: ';

        if (_t.hours) _title += _t.hours.toString() + ' ' + ((_t.hours > 1) ? 'Hours ' : 'Hour ');
				_title += _t.minutes.toString() + ' ' + ((_t.minutes > 1) ? 'Minutes ' : 'Minute ');
        _title += _t.seconds.toString() + ' ' + ((_t.seconds > 1) ? 'Seconds ' : 'Second ');

				var _rc = this.core.editor().parent().children('.redactor_counter');

				_rc.find('.reading-time')
	          .text(((_t.hours) ? _t.hours + ':' : '') + ((_t.minutes.toString().length < 2) ? '0' + _t.minutes.toString() : _t.minutes) + ':' + ((_t.seconds.toString().length < 2) ? '0' + _t.seconds.toString() : _t.seconds))
	          .parent().attr('title', _title);
	      _rc.find('.word-count')
	          .text(totalWords.toLocaleString() + ' words')
	          .parent().attr('title', characters.toLocaleString() + ' characters (' + Number(characters - spaces).toLocaleString() + ' non-space)');

	      var d = (totalReadingTimeSeconds / (3600)) * 360;

	      _rc.find('.icon-power-off').data('deg', d).animateRotate(d,
	          180,
	          'linear',
	          _rc.find('.icon-power-off').data('deg')
	      );

				this.core.callback('counter', { words: words, characters: characters, spaces: spaces });

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

						return {
								"days": days,
								"hours": hours,
								"minutes": minutes,
								"seconds": seconds
						};
				}

			}
		};
	};

	$.fn.animateRotate = function(angle, duration, easing, start, complete) {
			var args = $.speed(duration, easing, complete);
			var step = args.step;
			return this.each(function(i, e) {
					args.complete = $.proxy(args.complete, e);
					args.step = function(now) {
							$.style(e, 'transform', 'rotate(' + now + 'deg)');
							if (step) return step.apply(e, arguments);
					};

					$({
							deg: start
					}).animate({
							deg: angle
					}, args);
			});
	};

})(jQuery);
