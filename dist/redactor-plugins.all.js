(function($)
{
	$.Redactor.prototype.breadcrumb = function() {
		return {
			messageBox:null,
			init: function() {
        var that = this;
				
				this.core.element().after('<p class="redactor_message_box redactor_breadcrumb" id="redactor_breadcrumb-' + this.uuid + '"><i class="fa fa-code icon icon-code"></i>&nbsp;<span></span></p>');
				this.breadcrumb.messageBox = $('#redactor_breadcrumb-' + this.uuid);

				this.core.editor().on('keyup.redactor-plugin-counter click sync', $.proxy(this.breadcrumb.handleChange, this));
			},
			handleChange: function(e) {
				var that = this;

				var current = this.selection.current(),
				cloned = $(current).clone(),
				_el = cloned.find('*[data-verified="redactor"]'),
				_editor = cloned.closest('div.redactor-editor'),
				_crumbs = [];

				if (!$(current).parent().is('div.redactor-editor')) {
						var t = $(current);
						while ($(t)[0] && t.parent() !== undefined && !t.is('div.redactor-editor')) {
								_crumbs.push($(t)[0].tagName);
								t = t.parent();
						}
				} else {
						_crumbs.push($(cloned)[0].tagName);
				}

				_crumbs = _crumbs.reverse();

				this.breadcrumb.messageBox.children('span').html(_crumbs.join('&nbsp;&raquo;&nbsp;').toLowerCase());
			}
		};
	};
})(jQuery);

(function($)
{
	$.Redactor.prototype.contrast = function() {
		return {
			init: function() {
        var that = this;
				$.extend(this.opts.shortcuts, {
						'f5': {func:'contrast.toggle',params:[]}
				});
			},
			toggle: function() {
					console.log('contrast toggle');
					 this.core.editor().toggleClass('redactor-editor_contrast');
			}
		};
	};
})(jQuery);

(function($)
{
	$.Redactor.prototype.download = function() {
		return {
			init: function() {
        var that = this;
				var button = this.button.add('download', 'Download');
				this.button.addCallback(button, this.download.download);
			},
			download: function() {
					$('<a target="_blank" download="content.html" href="' + 'data:text/html,' + encodeURI(this.code.get()) + '"></a>').get(0).click();
			}
		};
	};
})(jQuery);

(function($)
{
	$.Redactor.prototype.imagepx = function() {
		return {
			init: function() {
        var that = this;
				this.core.element().on('modalOpened.callback.redactor', $.proxy(this.imagepx.modalOpened, this));
			},
      modalOpened:function(type,data){
				var that = this;
				if(type == 'image-edit') {
					$('#redactor-image-link').attr('type','url');

					$('#redactor-modal .redactor-modal-tab-area section').last().before((function(){

						return $('<section>').addClass('dimension').append([
							createSection('Width','width'),
							createSection('Height','height')
						]);

						function createSection(title,name) {
							var div = $('<div>'),
							label = $('<label>'),
							input = $('<input name="' + name + '" type="number" min="0" step="1">');

							label.text(title);
							div.append([label,input]);

							return div;
						}
					})());

					if($(that.observe.image).attr('width')) $('section.dimension input[name="width"]').val($(that.observe.image).attr('width'));
					if($(that.observe.image).attr('height')) $('section.dimension input[name="height"]').val($(that.observe.image).attr('height'));

					$('section.dimension input[type="number"]').each(function(){
						$(this).on('change keyup',function(e){
							switch(e.target.name) {
								case 'width':
								$(that.observe.image).attr('width',$(e.target).val());
								break;

								case 'height':
								$(that.observe.image).attr('height',$(e.target).val());
								break;
							}
						});
					});

				}
      }
		};
	};
})(jQuery);

(function($)
{
	$.Redactor.prototype.imageurl = function() {
		return {
			'url-tab' : String()
			+ '<form id="insert-image-form" class="redactor-modal-tab" data-title="URL">'
				+ '<section>'
					+ '<label>' + 'URL' + '</label>'
					+ '<input type="url" id="image-url-input" aria-label="' + 'Insert Image by URL' + '" />'
				+ '</section>'
				+ '<section>'
					+ '<button id="redactor-modal-button-action" type="submit">Insert</button>'
					+ '<button id="redactor-modal-button-cancel">Cancel</button>'
				+ '</section>'
			+ '</form>',
			init: function() {
        var that = this;

				$.extend(this.opts.modal, {
					image:this.opts.modal.image + this.imageurl['url-tab']
				});

				this.core.element().on('modalOpened.callback.redactor', $.proxy(this.imageurl.load, this));
			},
			load: function() {
				var that = this;

				if(!$('#redactor-modal-image-droparea').length) return;

				$('#insert-image-form').submit(function(e){
						e.preventDefault();

						that.image.insert({url:$('#image-url-input').val()});

						that.modal.close();
						that.selection.restore();
				});
			}
		};
	};
})(jQuery);

(function($) {
    $.Redactor.prototype.replacer = function() {
        return {
            getTemplate: function() {
                return String() +
										'<form id="redactor-modal-replacer">' +
	                    '<section>' +
			                    '<p>Search and replace found text.</p>' +
													'<div>' +
				                    '<label>' + 'Search' + '</label>' +
				                    '<input type="text" size="5" value="" id="redactor-replacer-find" required />' +
													'</div>' +
													'<div>' +
				                    '<label>' + 'Replace' + '</label>' +
				                    '<input type="text" size="5" value="" id="redactor-replacer-replace" required />' +
													'</div>' +
			                    '<div class="options">' +
				                    '<div class="ignore-case">' +
					                    '<label>' + 'Ignore Case' + '</label>' +
					                    '<input type="checkbox" id="redactor-replacer-ignore-case" />' +
				                    '</div>'
				                    //+ '<div class="replace-all">'
				                    //	+ '<label>' + 'Replace All' + '</label>'
				                    //	+ '<input type="checkbox" id="redactor-replacer-replace-all" checked disabled readonly />'
				                    //+ '</div>'
				                    +
			                    '</div>' +
													'<footer>'
														+ '<button id="redactor-modal-button-action" type="submit">Replace</button>'
														+ '<button id="redactor-modal-button-cancel">Cancel</button>'
												+ '</footer>'
	                    + '</section>'
										+ '</form>';
            },
            init: function() {
                var that = this;

                $.extend(this.opts.shortcuts, {
                    'ctrl+f': {
                        func: 'replacer.show',
                        params: []
                    }
                });
            },
            show: function() {
                var that = this;

                this.modal.addTemplate('replacer', this.replacer.getTemplate());

                this.modal.load('replacer', this.lang.get('replacer') || 'Replacer', 400);
                //this.modal.createCancelButton();

                //var button = this.modal.createActionButton('Replace');
                //button.on('click', this.replacer.replace);

								$('#redactor-modal-replacer').submit(function(e){
									e.preventDefault();
									that.replacer.replace();
								});

                if (this.sel && this.sel.toString()) {
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
                var _i = $('#redactor-replacer-ignore-case').is(":checked");

                if (_f && _r) this.insert.set(replaceAll(_f, _r, this.code.get(), 'g' + ((_i) ? 'i' : '')));

                this.modal.close();
                this.selection.restore();

                function replaceAll(find, replace, str, flags) {
                    return str.replace((find instanceof RegExp) ? find : new RegExp(find, flags), replace);
                }
            }
        };
    };
})(jQuery);

(function($) {
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

    $.Redactor.prototype.speek = function() {
        var msg;
        var voices = window.speechSynthesis.getVoices();

        // Chrome loads voices asynchronously.
        window.speechSynthesis.onvoiceschanged = function(e) {
            voices = window.speechSynthesis.getVoices();
        };

        return {
            getTemplate: function() {
                var _t = $(document.createElement("section"));
                _t.attr('id', 'redactor-modal-speek');
                _t.append('<p>Listen as you wish.</p>');
                _t.append('<label for="voice">Voice</label>');
                _t.append($('<div style="margin-bottom:1em">').append(document.createElement('select')));

                $.each(voices, function(i, val) {
                    _t.find('select').attr('id', 'voice').attr('name', 'voice').append($('<option value="' + val.name + '">' + val.name + '</option>'));
                });

                var _os = $('<div class="options"></div>');

                _os.append('<label for="volume">Volume</label><input data-varname="speechVolume" type="range" min="0" max="1" step="0.1" name="volume" id="volume" value="1">');
                _os.append('<label for="rate">Rate</label><input data-varname="speechRate" type="range" min="0" max="1" step="0.1" name="Rate" id="rate" value="1">');
                _os.append('<label for="pitch">Pitch</label><input data-varname="speechPitch" type="range" min="0" max="1" step="0.1" name="pitch" id="pitch" value="1">');

                _os.append('<section style="margin-top:1em">'
                  //+ '<button id="redactor-modal-button-action" type="submit">Save</button>'
                  + '<button id="redactor-modal-button-cancel">Close</button>'
                + '</section>');

                _t.append(_os);

                return $(_t)[0].outerHTML;
            },
            init: function() {
                if (!'speechSynthesis' in window) return;

                var that = this;
                var button = this.button.add('speek', 'Listen');
                this.button.addCallback(button, this.speek.clicked);

                $.extend(this.opts.shortcuts, {
                    'esc': {
                        func: 'speek.shutup',
                        params: []
                    }
                });

                this.core.element().on('modalClosed.callback.redactor', $.proxy(this.speek.shutup, this));
                /*this.$element.on('modalClosedCallback', function() {
                    that.speek.shutup();
                });*/
            },
            clicked: function() {

                if (altPressed) {
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

                if (!_speaking) {
                    var _code = this.code.get();

                    var _ns = [];
                    $(_code).each(function(i, val) {
                        _ns.push($(val).text());
                    });
                    _code = _ns.join(' ');

                    msg = new SpeechSynthesisUtterance();
                    msg.text = _code;
                    msg.lang = this.opts.speechLang || 'en-US';

                    msg.voice = voices.filter(function(voice) {
                        return voice.name == (_voice);
                    })[0];
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

                this.modal.load('choose-voice', this.lang.get('choose-voice') || 'Choose Voice', 400);
                //this.modal.createCancelButton();

                //var button = this.modal.createActionButton('Listen');
                //  button.on('click', this.speek.close)

                $('#redactor-modal-speek select').on('change', function() {
                    var _v = $(this).val();
                    that.speek.vocalChange(_v);
                });

                $('#redactor-modal-speek select').val(that.opts.speechVoice);

                $('#redactor-modal-speek #volume, #redactor-modal-speek #rate, #redactor-modal-speek #pitch').each(function() {
                    $(this).on('change', function() {
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
                var _vo = voices.filter(function(voice) {
                    return voice.name == (_v);
                })[0];
                if (_vo) {
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
                if (msg) {
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

(function($)
{
	$.Redactor.prototype.syntax = function() {
		return {
      offlineMode:false,
      editor:null,
      editorDOM:null,
      prettyContent:null,
			init: function() {
        var that = this;

        if(that.opts.aceLoaded === undefined) that.opts.aceLoaded = false;
        if(that.opts.aceLoaded) return;

        this.opts = $.extend({
          aceUseSoftTabs:true,
          aceTabSize:4,
          aceUseWrapMode:true,
          aceHighlightActiveLine:true,
          aceReadOnly:false,
          aceTheme:"ace/theme/chrome",
          aceMode:"ace/mode/html"
        }, this.opts);

        if(typeof ace === 'undefined') {
            that.syntax.offlineMode = true;
            $.getScript(that.opts.aceOfflineSource, function(){
                that.syntax.handleLoaded();
            });
        } else {
            that.syntax.handleLoaded();
        }
			},
      handleLoaded: function(){
        var that = this,
        textarea = that.$textarea;

        that.$textarea.after('<div hidden="true" class="redactor__modx-code-pretty-content" rows="4" style="display:none"></div>'); // not fun to have to do this http://stackoverflow.com/questions/6440439/how-do-i-make-a-textarea-an-ace-editor#comment9444773_7478430
        that.syntax.prettyContent = that.$textarea.parent().children('div.redactor__modx-code-pretty-content').attr('id','redactor__modx-code-pretty-content' + that.uuid);
        that.syntax.editorDOM = $(document.getElementById(('redactor__modx-code-pretty-content' + that.uuid)));

        if(that.syntax.offlineMode && that.opts.aceOfflineSource) {
            ace.config.set("modePath",that.opts.assetsUrl + 'lib/ace/');
            ace.config.set("workerPath",that.opts.assetsUrl + 'lib/ace/');
            ace.config.set("themePath",that.opts.assetsUrl + 'lib/ace/');
        }

        that.syntax.editor = ace.edit('redactor__modx-code-pretty-content' + that.uuid);
        var editor = that.syntax.editor;

        editor.setTheme(that.opts.aceTheme);
        editor.getSession().setMode(that.opts.aceMode);
        editor.getSession().setUseWorker((that.opts.useWorkers === undefined) ? that.opts.useWorkers : false);
        editor.setValue(textarea.val()); //that.tabifier.get(that.$textarea.val())
        if(that.opts.aceUseSoftTabs !== undefined) editor.getSession().setUseSoftTabs(that.opts.aceUseSoftTabs);
        if(that.opts.aceTabSize !== undefined && parseInt(that.opts.aceTabSize)) editor.getSession().setTabSize(parseInt(that.opts.aceTabSize));
        if(that.opts.aceUseWrapMode !== undefined) editor.getSession().setUseWrapMode(that.opts.aceUseWrapMode);
        if(that.opts.aceHighlightActiveLine !== undefined) editor.setHighlightActiveLine(that.opts.aceHighlightActiveLine);
        if(that.opts.aceReadOnly !== undefined) editor.setReadOnly(that.opts.aceReadOnly);

        //this.core.editor().on('sourceToggle', $.proxy(this.syntax.sourceCallback, this));
        var button = that.button.get('html');
        that.button.addCallback(button, that.syntax.sourceCallback);

        editor.on('change',function(e){
            that.source.$textarea.val(editor.getValue());
        });

        if(that.opts.aceFontSize !== undefined) that.syntax.editorDOM.css({fontSize:that.opts.aceFontSize});
        that.opts.aceLoaded = true;
      },
			sourceCallback: function(e,data){
        var that = this,
        editor = that.syntax.editor;

        var hiddenAttr = that.syntax.editorDOM.attr('hidden');
        if(typeof hiddenAttr !== typeof undefined && hiddenAttr !== false) {
          var _h = that.source.$textarea.height();

          that.source.$textarea.hide();

          editor.setValue(that.source.$textarea.val());
          that.syntax.prettyContent.removeAttr('hidden').show().height(_h);
          editor.resize();
        } else {
          that.insert.set(editor.getValue(), false);
          that.syntax.editorDOM.hide();
          that.syntax.prettyContent.attr('hidden','true');
        }

			}
		};
	};
})(jQuery);

(function($)
{
	$.Redactor.prototype.wym = function() {
		return {
			init: function() {
        this.core.editor().addClass('redactor-editor_wym');
			}
		};
	};
})(jQuery);

(function($)
{
	$.Redactor.prototype.zoom = function() {
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
					this.$editor.attr('data-zoom',this.opts.zoomLevel);
			}
		};
	};
})(jQuery);
