if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.breadcrumb = function()
	{
		return {
			init: function()
			{
                var that = this;
                
                $(this.$editor).after('<p class="redactor_message_box redactor_breadcrumb" id="redactor_breadcrumb-' + this.uuid + '"><i class="icon icon-code"></i>&nbsp;<span></span></p>');
                var _messageBox = $('#redactor_breadcrumb-' + this.uuid);

				this.$editor.on('keyup.redactor-limiter', $.proxy(function(e) {
                    this.breadcrumb.handleChange(e);
				  }, this))
                  .on('click', $.proxy(function(e) {
                    this.breadcrumb.handleChange(e);
				  }, this))
                  .on('sync', $.proxy(function(e) {
                    this.breadcrumb.handleChange(e);
				  }, this))
				;

                this.$element.on("sourceCallback",function(data){ // #janky REQUIRES redactor.js#L2717 hack.
                    if(!that.opts.visual) {
                        _messageBox.hide();
                    } else {
                        _messageBox.show();
                    }
                });
			},
            handleChange: function(e) {
                var that = this;
                var current = this.selection.getCurrent();
                var _messageBox = $('#redactor_breadcrumb-' + this.uuid);
                
                var cloned = $(current).clone();
                
                var _el = cloned.find('*[data-verified="redactor"]');
                
                var _editor = cloned.closest('div.redactor-editor');

                var _crumbs = [];
                
                if(!$(current).parent().is('div.redactor-editor')) {
                    var t = $(current);
                    while($(t)[0] && t.parent() !== undefined && !t.is('div.redactor-editor')) {
                        _crumbs.push($(t)[0].tagName);
                        t = t.parent();
                    }                        
                } else {
                    _crumbs.push($(cloned)[0].tagName);
                }
                
                _crumbs = _crumbs.reverse();
                
                _messageBox.children('span').html(_crumbs.join('&nbsp;&raquo;&nbsp;'));
            }
		};
	};
})(jQuery);
if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
    var $el;
	RedactorPlugins.clips = function()
	{
		return {
            json: null,
            tags: [],
            getTemplate: function(){
                var that = this;
                var _clips = this.clips.json;
                
                function unique(array){
                    return array.filter(function(el, index, arr) {
                        return index === arr.indexOf(el);
                    });
                }
                
                var _t = $(document.createElement("section")).attr('id','redactor-modal-clips').append([
                    $(document.createElement('select')).hide().append(
                        $(document.createElement('option')).attr('value', '').text('All')
                    ),
                    $(document.createElement('ul')).addClass('redactor_clips_box')
                ]);
                
                if(_clips && _clips.length) {
                    var _clipsCount = $('.clipsmodal').size();
                    var _modalId = "clipsmodal-" + _clipsCount;
                    _t.attr('id',_modalId);
                    var _tags = that.clips.tags;
                    $.each(_clips, function(i, item) {
                        var _li = $('<li class="redactor_clip_item"><a href="#" class="redactor_clip_link"' + ((item.advanced == 1) ? ' data-advanced="1"' : '') + '></a><div class="redactor_clip" style="display:none"></div></li>');
                        _li.children('a').html(item.title);
                        _li.children('.redactor_clip').html(item.clip);

                        if(item.tags) {
                            _li.addClass(item.tags);
                            that.clips.tags = unique($.merge(that.clips.tags,item.tags.split(" "))) 
                        }
                        
                        _t.find('.redactor_clips_box').append(_li);
                    });
                }
                
                return $(_t)[0].outerHTML;
            },
			init: function()
			{
                if(!this.opts.clipsJson) return;
                if(typeof(this.opts.clipsJson) === 'string') {
                    try {
                        this.clips.json = $.parseJSON(this.opts.clipsJson);
                    } catch (e) {
                        return false;
                    } 
                }
                if(!this.clips.json) this.clips.json = this.opts.clipsJson;
                
				var button = this.button.addAfter('link','clips', 'Clips');
                button.addClass('re-icon re-clips')
				this.button.addCallback(button, this.clips.show);
			},
            filter: function(tags) {
                if(tags.trim()) {
                    tags = tags.trim().split(' ');
                    $('#redactor-modal').find('.redactor_clip_item').hide();
                    for(var i = 0; i < tags.length; i++) {
                        var _tag = tags[i].trim();
                        if(_tag) $('#redactor-modal').find('.redactor_clip_item.' + _tag).show();
                    }
                } else {
                    $('#redactor-modal').find('.redactor_clip_item').show();
                }
            },
            show: function() {
                var that = this;
                
                this.modal.addTemplate('clips', this.clips.getTemplate());
                this.modal.load('clips', this.lang.get('clips') || 'Clips', 300);
                this.modal.createCancelButton();
                
				this.selection.save();
				this.modal.show();
                
                var _tags = that.clips.tags;
                
                if(_tags.length) {
                    $('#redactor-modal').find('select').show();
                    
                    for(var i = 0; i < _tags.length; i++) {
                        $('#redactor-modal').find('select').append(
                            $(document.createElement('option')).attr('value', _tags[i]).text(_tags[i])
                        );
                    }
                }
                
                $('#redactor-modal').find('select').on('change',function(){
                    that.clips.filter($(this).find('option:selected').val().trim());
                })
                
                $('#redactor-modal').find('.redactor_clips_box a').on('click',$.proxy(this.clips.clipClicked, this));
            },
            clipClicked: function(e) {
                this.clips.insertClip($(e.target).next().html(),$(e.target).data('advanced') !== undefined);
            },
            insertClip: function(html,advanced) {
				this.selection.restore();
				this.clean.isSingleLine(html);
                if(advanced) this.insert.htmlWithoutClean(html);
                else this.insert.html(html,true);
				this.modal.close();
				this.observe.load();      
            }
		};
	};
})(jQuery);

if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.contrast = function()
	{
		return {
			init: function() {
                $.extend(this.opts.shortcuts, {
                    'f5': {func:'contrast.toggle',params:[]}
                });
			},
            toggle: function() {
                 this.$editor.toggleClass('redactor-editor_contrast');
            }
		};
	};
})(jQuery);
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
if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.download = function()
	{
		return {
			init: function() {
				var button = this.button.add('download', 'Download');
                this.button.setAwesome('download', 'icon icon-download');
				this.button.addCallback(button, this.download.download);
			},
            download: function() {
                $('<a target="_blank" download="content.html" href="' + 'data:text/html,' + encodeURI(this.code.get()) + '"></a>').get(0).click();
            }
		};
	};
})(jQuery);
if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.imagepx = function()
	{
		return {
			init: function()
			{
                var that = this;
                this.modal.addCallback('imageEdit', $.proxy(this.imagepx.imageEdit, this));
                if(that.opts.showDimensionsOnResize !== false) {
                    that.$element.on("moveResizeCallback",function(e,data){ // #janky REQUIRES redactor.js#moveResize hack.
                        var p = data.el.el.parent();
                    
                        var message = data.w + 'x' + data.h;
                    
                        if(p.find('.dimensions')[0]) {
                            p.find('.dimensions').html(message)
                        } else {
                            p.append((function(){
                                var d = $('<p class="dimensions" />');
                                d.html(message)
                                return d;
                            })());
                        }
                    });
                }
			},
            imageEdit: function()
            {
                var that = this;
                var _c = $('#redactor-modal-body > section').append(document.createElement('hr')).append($(document.createElement('div')).addClass('image-edit-dimensions')).find('.image-edit-dimensions');
                
                var _bgs = [
                    $('#redactor-modal').css('background'),
                    $('#redactor-modal-image-edit').css('background')
                ];
                
                var _imageW =  $(document.createElement('input')).attr('type','text').attr('min','0').attr('maxlength','8').attr('pattern','\d+(px|%|)').attr('data-redactor-deminsion-axis','x').attr('name','redactor-imageEdit-image-width' ).attr('id','redactor-imageEdit-image-width');
                var _imageH =  $(document.createElement('input')).attr('type','text').attr('min','0').attr('maxlength','8').attr('pattern','\d+(px|%|)').attr('data-redactor-deminsion-axis','y').attr('name','redactor-imageEdit-image-height').attr('id','redactor-imageEdit-image-height');
                var _preview = $(document.createElement('input')).attr('disabled','disabled').attr('type','checkbox').attr('id','redactor-imageEdit-image-preview');
                var _previewLabel = $(document.createElement('label')).attr('for','redactor-imageEdit-image-preview').text(this.opts.curLang.previewDimensions || 'Preview Dimensions');
                // input should prepend in label, <label><input>...</label>
                _previewLabel.prepend(_preview);
                _c.append([
                    $(document.createElement('div')).addClass('option').addClass('redactor-imageEdit-image-width').append(
                        $(document.createElement('label')).attr('for','redactor-imageEdit-image-width').text(this.opts.curLang.width || 'Width'),
                        _imageW
                    ),
                    $(document.createElement('div')).addClass('option').addClass('redactor-imageEdit-image-height').append(
                        $(document.createElement('label')).attr('for','redactor-imageEdit-image-height').text(this.opts.curLang.height || 'Height'),
                        _imageH
                    ),

                    $(document.createElement('div')).addClass('option').addClass('redactor-imageEdit-image-preview').append(_previewLabel)
                ]);
                
                var _img = $('#redactor-image-box').children('img');
                var _p = _img.parent();
                var _imgO = _img.clone().css('opacity','');
                var _style = _img.attr('style') || '';
                var _id = $('#image-edit-dimensions').addClass('scalable');
                var _imageTouched, _listenersAdded = false;
                var _imgStyle = _img.prop('style');

                if(_imgStyle) {
                  if (_imgStyle.width) {
                    _imageW.val(_imgStyle.width);
                  }
                  if (_imgStyle.height) {
                    _imageH.val(_imgStyle.height);
                  }
                }

                $.each([_imageW,_imageH],function(index,value){
                    $(this).on('change keyup',function(e){
                        if(_imageW.val() || _imageH.val()) {
                            _preview.removeAttr('disabled');
                        }
                        else {
                            _preview.attr('disabled','disabled');
                        }
                        
                        handleChange(_preview.is(':checked'));
                    });
                });

                _preview.on('change',function(e){
                    var _checked = $(this).is(':checked');
                    handleChange(_checked);
                });
                
                that.$modalClose.on('click.redactor-modal', $.proxy(function(){
                    revert();
                }, this));
                
                $('#redactor-modal').click(function(e){
                    if($(e.target).hasClass('redactor-modal-close-btn')) {
                        revert();
                    }
                });
                                
                function handleChange(_checked) {
                    if(_imageW.val()) {
                        _img.width(_imageW.val());
                        _imageTouched = true;
                    } else {
                        _img.width('');
                    }
                    if(_imageH.val()) {
                        _img.height(_imageH.val());
                        _imageTouched = true;
                    } else {
                        _img.height('');
                    }
                    
                    if(_imageTouched && !_listenersAdded && $('.redactor-modal-close-btn')[0]) { // #janky
                        _listenersAdded = true;
                    }
                    
                    if(_checked) {
                        $('#redactor-modal-overlay').addClass('preview');
                  
                        $('#redactor-modal').css({
                            background:'rgba(255,255,255,0.667)'
                        }).find('#redactor-modal-image-edit').css({
                            background:'transparent'
                        });

                        $('#redactor-modal-overlay').css({
                            backgroundImage:'url(' + _img.attr('src') + ')',
                            backgroundSize:(_imageW.val() ? ($.isNumeric(_imageW.val()) ? _imageW.val() + 'px' : _imageW.val()) : 'auto') + ' ' + (_imageH.val() ? ($.isNumeric(_imageH.val()) ? _imageH.val() + 'px' : _imageH.val()) : 'auto')
                        });
                        
                    } else { 
                        $('#redactor-modal-overlay').removeClass('preview');

                        $('#redactor-modal').css({
                            background:_bgs[0]
                        }).find('#redactor-modal-image-edit').css({
                            background:_bgs[1]
                        });
                        
                        $('#redactor-modal-overlay').css({
                            backgroundImage:'',
                            backgroundSize:''
                        });
                    }
                };
                
                function revert() {
                    _t = _imgO.clone();
                    _img.replaceWith(_t);
                    _img = null;
            
                    _img = _t;
                    _img.attr('style',_style).css({opacity:''});
                    
                    that.code.sync();
                    that.observe.load();
                };

            }
		};
	};
})(jQuery);
if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.imageurl = function()
	{
		return {
			init: function() {
                var that = this;

                this.$element.on('modalOpenedCallback', $.proxy(this.imageurl.load, this));
			},
			load: function() {
                var that = this;
                
                if(!$('#redactor-modal-image-insert').length) return;
                
                that.modal.addTab('image-url', 'Image URL', 'active');
                
                $('#redactor-modal-tabber a[rel="tabimage-url"]').click(function(e){
                    $('#redactor-modal').removeClass('expanded eureka-modal');
                    $('#eureka-modal-footer').hide();
                }); 
                
                $('#redactor-modal-image-insert').append($(document.createElement('form')).attr('id','insert-image-form').addClass('redactor-tab redactor-tabimage-url').hide().append(
                    [
                        $('<label for="image-url" class="redactor-image-link-option">').html('Image URL'),
                        $('<input type="url" name="image-url" id="image-url-input" placeholder="Absolute URL to Image">'),
                        $('<footer id="insert-image-footer">').html(
                            $('<button id="insert-url-btn" type="submit">').addClass('redactor-modal-btn redactor-modal-action-btn').html('Insert')
                        )
                    ]
                ));
                
                $('#insert-image-form').submit(function(e){
                    e.preventDefault();

                    that.image.insert({filelink:$('#image-url-input').val()});
                    that.image.onDrop();
                    
    				that.modal.close();
    				that.selection.restore();
                });
			}
		};
	};
})(jQuery);
if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.norphan = function()
	{
		return {
			init: function() {
                if(this.opts.syncBeforeCallback !== undefined || !this.opts.tabifier) return;
                
                var that = this;
                
                that.opts.syncBeforeCallback = function(html) {
                    var _w = $(document.createElement('div'));
                    _w.html(html);
                    _w.find('div,p,h1,h2,h3,h4,h5,h6,blockquote,dd,dt,figcaption').each(function(){
                        $(this).replaceWith(that.norphan.adopt($(this).get(0).outerHTML));
                    });

                    return that.tabifier.get(_w.html());
                };
			},
            adopt: function(html) {
                var _t = '';

                var _a = String(html).reverse().split('');
                var _firstSpace = false;
                var _sniffingNonWhiteSpace = false;

                for(var i = 0; i < _a.length; i++) {
                    if(_a[i] == '>') {
                        _ignore = true;
                    } else if(_a[i] == '<') {
                        _ignore = false;
                        _sniffingNonWhiteSpace = true;
                    } else if(_a[i].trim().length > 0) {
                        _sniffingNonWhiteSpace = false;
                    }
    
                    if(!_ignore && !_firstSpace && _a[i] == ' ' && !_sniffingNonWhiteSpace) {
                        _t += String('&nbsp;').reverse();
                        _firstSpace = true;
                    } else {
                        _t += _a[i];
                    }
                }

                return _t.reverse();
            }
		};
	};
})(jQuery);
if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.replacer = function()
	{
		return {
			getTemplate: function()
			{
				return String()
				+ '<section id="redactor-modal-replacer">'
                    + '<p>Search and replace found text.</p>'
					+ '<label>' + 'Search' + '</label>'
					+ '<input type="text" size="5" value="2" id="redactor-replacer-find" required />'
					+ '<label>' + 'Replace' + '</label>'
					+ '<input type="text" size="5" value="3" id="redactor-replacer-replace" required />'
                    + '<div class="options">'
                        + '<div class="ignore-case">'
        					+ '<label>' + 'Ignore Case' + '</label>'
        					+ '<input type="checkbox" id="redactor-replacer-ignore-case" />'
                        + '</div>'
                        //+ '<div class="replace-all">'
        				//	+ '<label>' + 'Replace All' + '</label>'
        				//	+ '<input type="checkbox" id="redactor-replacer-replace-all" checked disabled readonly />'
                        //+ '</div>'
                    + '</div>'
				+ '</section>';
			},
			init: function()
			{
                //var button = this.button.add('replacer', 'replacer');

                //this.button.setAwesome('replacer', 'icon icon-eye');
                //this.button.addCallback(button, this.replacer.show);

                $.extend(this.opts.shortcuts, {
                    'ctrl+f': {func:'replacer.show',params:[]}
                });
			},
            show: function()
            {
				this.modal.addTemplate('replacer', this.replacer.getTemplate());

				this.modal.load('replacer', this.lang.get('replacer') || 'Replacer', 300);
				this.modal.createCancelButton();

				var button = this.modal.createActionButton('Replace');
				button.on('click', this.replacer.replace);

                if(this.sel && this.sel.toString()) {
                    $('#redactor-replacer-find').val(this.sel.toString());
                    $('#redactor-replacer-replace').focus();
                }

				this.selection.save();
				this.modal.show();

				$('#redactor-modal-replacer').focus();
            },
            replace: function() {
                var _f = $('#redactor-replacer-find').val();
                var _r = $('#redactor-replacer-replace').val();
                var _i = $('#redactor-replacer-ignore-case').is( ":checked" );

                if(_f && _r) this.insert.set(replaceAll(_f,_r,this.$editor.html(),'g' + ((_i) ? 'i' : '')));

				this.modal.close();
				this.selection.restore();

                function replaceAll(find, replace, str, flags) {
                  return str.replace((find instanceof RegExp) ? find : new RegExp(escapeRegExp(find), flags), replace);
                }

                function escapeRegExp(str) {
                  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                }
            }
		};
	};
})(jQuery);

if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
    var altPressed = false;
    $(window).keydown(function(evt) {
      if (evt.which == 18) { // alt
        altPressed = true;
      }
    }).keyup(function(evt) {
      if (evt.which == 18) { // alt
        altPressed = false;
      }
    });
    
	RedactorPlugins.speek = function() {
        var msg;
        var voices = window.speechSynthesis.getVoices();
        
        // Chrome loads voices asynchronously.
        window.speechSynthesis.onvoiceschanged = function(e) {
          voices = window.speechSynthesis.getVoices();
        };
        
		return {
			getTemplate: function() {
                var _t = $(document.createElement("section"));
                _t.attr('id','redactor-modal-speek');
                _t.append('<p>Listen as you wish.</p>');
                _t.append('<label for="voice">Voice</label>');
                _t.append(document.createElement('select'));
                
                $.each(voices,function(i,val){
                    _t.find('select').attr('id','voice').attr('name','voice').append($('<option value="' + val.name + '">' + val.name + '</option>'));
                });
                
                var _os = $('<div class="options"></div>');
                
                _os.append('<label for="volume">Volume</label><input data-varname="speechVolume" type="range" min="0" max="1" step="0.1" name="volume" id="volume" value="1">');
                _os.append('<label for="rate">Rate</label><input data-varname="speechRate" type="range" min="0" max="1" step="0.1" name="Rate" id="rate" value="1">');
                _os.append('<label for="pitch">Pitch</label><input data-varname="speechPitch" type="range" min="0" max="1" step="0.1" name="pitch" id="pitch" value="1">');
                
                _t.append(_os);
                
                return $(_t)[0].outerHTML;
			},
			init: function() {
                if (!'speechSynthesis' in window) return;
                
                var that = this;
				var button = this.button.add('speek', 'Listen');
                this.button.setAwesome('speek', 'icon icon-headphones');
				this.button.addCallback(button, this.speek.clicked);
                
                $.extend(this.opts.shortcuts, {
                    'esc': {func:'speek.shutup',params:[]}
                });
                
                this.$element.on('modalClosedCallback',function(){
                    that.speek.shutup();
                });
			},
            clicked: function() {
                
                if(altPressed) {
                    this.speek.show();
                    return;
                }
                
                this.speek.speek();
            },
            speek: function() {
                var _speaking = (window.speechSynthesis.speaking);
                this.speek.shutup();

                var that = this;
                var button = this.button.get('speek');
                
                var _voice = this.opts.speechVoice || 'Vicki';

                if(!_speaking) {
                    var _code = this.code.get();

                    var _ns = [];
                    $(_code).each(function(i,val){
                        _ns.push($(val).text());
                    });
                    _code = _ns.join(' ');
                  
                    msg = new SpeechSynthesisUtterance();
                    msg.text = _code;
                    msg.lang = this.opts.speechLang || 'en-US';
                    
                    msg.voice = voices.filter(function(voice) { return voice.name == (_voice); })[0];
                    msg.rate = (this.opts.speechRate !== undefined) ? this.opts.speechRate : 1;
                    msg.pitch = (this.opts.speechPitch !== undefined) ? this.opts.speechPitch : 1;
                    msg.volume = (this.opts.speechVolume !== undefined) ? this.opts.speechVolume : 1;
                    
                    msg.onend = msg.onerror = function() {
                        button.removeClass('speaking');
                    };
                    msg.onstart = msg.onresume = function() {
                        button.addClass('speaking');
                    };
                    
                    window.speechSynthesis.speak(msg); 
                    button.addClass('speaking');   
                    
                }
            },
            show: function() {
                var button = this.button.get('speek');
                
                var that = this;
				this.modal.addTemplate('choose-voice', this.speek.getTemplate());

				this.modal.load('choose-voice', this.lang.get('choose-voice') || 'Choose Voice', 300);
				this.modal.createCancelButton();

				var button = this.modal.createActionButton('Listen');
                button.on('click',this.speek.close)

                $('#redactor-modal-speek select').on('change',function(){
                    var _v = $(this).val();
                    that.speek.vocalChange(_v);
				}); 
                
                $('#redactor-modal-speek select').val(that.opts.speechVoice);
                
                $('#redactor-modal-speek #volume, #redactor-modal-speek #rate, #redactor-modal-speek #pitch').each(function(){
                    $(this).on('change',function(){
                        button = that.button.get('speek');
                        that.opts[$(this).data('varname')] = $(this).val();
                        
                        that.speek.shutup();
                        that.speek.speek();
                        button.addClass('speaking');
                    }).val(that.opts[$(this).data('varname')]);
                });

				this.selection.save();
				this.modal.show();
            },
            close: function() {
				this.modal.close();
                this.speek.shutup();
                this.speek.speek();
				this.selection.restore();
            },
            vocalChange: function(_v) {
                var button = this.button.get('speek');
                var _vo = voices.filter(function(voice) { return voice.name == (_v); })[0];
                if(_vo) {
                    this.opts.speechVoice = _vo.name;
                    this.speek.shutup();
                    this.speek.speek(); 
                    button.addClass('speaking');
                }
            },
            shutup: function() {
                var _t = (window.speechSynthesis.speaking) ? true : false;
                window.speechSynthesis.cancel();
                var button = this.button.get('speek');
                if(msg) {
                    try {
                        msg.cancel();
                    } catch (e) {} 
                }
                window.speechSynthesis.cancel();
                msg = null;
                button.removeClass('speaking');

                return _t;
            }
		};
	};
})(jQuery);
if (!RedactorPlugins) var RedactorPlugins = {};
 
(function($)
{
    var offlineMode = false;
	RedactorPlugins.syntax = function()
	{
        return {
            init: function() {
                var that = this;
                if(that.opts.aceLoaded === undefined) that.opts.aceLoaded = false;
                if(that.opts.aceLoaded) return;
                if(typeof ace === 'undefined') {
                    offlineMode = true;
                    $.getScript(that.opts.aceOfflineSource, function(){
                        that.syntax.handleLoaded();
                    });
                } else {
                    that.syntax.handleLoaded();
                }
            },
            handleLoaded: function(){
                var that = this;
                that.$textarea.after('<div class="redactor__modx-code-pretty-content" rows="4" style="display:none"></div>'); // not fun to have to do this http://stackoverflow.com/questions/6440439/how-do-i-make-a-textarea-an-ace-editor#comment9444773_7478430
                var _p = that.$textarea.parent().children('div.redactor__modx-code-pretty-content').attr('id','redactor__modx-code-pretty-content' + that.uuid);
                
                if(offlineMode) {
                    ace.config.set("modePath",that.opts.assetsUrl + 'lib/ace/');
                    ace.config.set("workerPath",that.opts.assetsUrl + 'lib/ace/');
                    ace.config.set("themePath",that.opts.assetsUrl + 'lib/ace/');
                }
                
                var editor = ace.edit('redactor__modx-code-pretty-content' + that.uuid);
                editor.setTheme(that.opts.aceTheme || "ace/theme/chrome");
                editor.getSession().setMode(that.opts.aceMode || "ace/mode/html");
                editor.getSession().setUseWorker(that.opts.useWorkers || false);
                editor.setValue(that.tabifier.get(that.$textarea.val())); 
                if(that.opts.aceUseSoftTabs !== undefined) editor.getSession().setUseSoftTabs(that.opts.aceUseSoftTabs);
                if(that.opts.aceTabSize !== undefined && parseInt(that.opts.aceTabSize)) editor.getSession().setTabSize(parseInt(that.opts.aceTabSize));
                if(that.opts.aceUseWrapMode !== undefined) editor.getSession().setUseWrapMode(that.opts.aceUseWrapMode);
                if(that.opts.aceHighlightActiveLine !== undefined) editor.setHighlightActiveLine(that.opts.aceHighlightActiveLine);
                if(that.opts.aceReadOnly !== undefined) editor.setReadOnly(that.opts.aceReadOnly);
                var textarea = that.$textarea;
            
                //console.log(editor.getSession().getHighlightActiveLine());
                /*editor.getSession().on('change',function(){
                    textarea.val(that.tabifier.get(editor.getSession().getValue()));
                });*/
            
                that.$element.on("sourceCallback",function(data){ // #janky REQUIRES redactor.js#L2717 hack.
                    var _h = that.$textarea.height();
                    that.$textarea.hide();
                    editor.setValue(that.tabifier.get(that.$textarea.val()));
                    _p.show().height(_h);  
                    editor.resize();
                });
                
                var editorDOM = $(document.getElementById(('redactor__modx-code-pretty-content' + that.uuid)));
                that.$element.on("visualCallback",function(data){
                    that.insert.set(editor.getValue(), false);
                    editorDOM.hide();
                });
                editor.on('change',function(e){
                    that.$textarea.val(editor.getValue());
                });
                
                if(that.opts.aceFontSize !== undefined) editorDOM.css({fontSize:that.opts.aceFontSize});
                that.opts.aceLoaded = true;
            }
        };
	};
})(jQuery);


if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.wym = function()
	{
		return {
			init: function()
			{
                this.$editor.addClass('redactor-editor_wym');
			}
		};
	};
})(jQuery);
if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.zoom = function()
	{
		return {
			init: function() {
                if(this.opts.zoomLevel === undefined) this.opts.zoomLevel = 0;
                $.extend(this.opts.shortcuts, {
                    'ctrl+=': {func:'zoom.zoom',params:[1]},
                    'ctrl+-': {func:'zoom.zoom',params:[-1]}
                });
			},
            zoom: function(amnt) {
                this.opts.zoomLevel += amnt;
                this.opts.zoomLevel = Math.min(3,this.opts.zoomLevel);
                this.opts.zoomLevel = Math.max(0,this.opts.zoomLevel);
                this.$editor.addClass('redactor-editor__zoom').removeClass('redactor-editor__zoom-0').removeClass('redactor-editor__zoom-1').removeClass('redactor-editor__zoom-2').removeClass('redactor-editor__zoom-3').addClass('redactor-editor__zoom-' + this.opts.zoomLevel);
            }
		};
	};
})(jQuery);