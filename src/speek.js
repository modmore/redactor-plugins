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