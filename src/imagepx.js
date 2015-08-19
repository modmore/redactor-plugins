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