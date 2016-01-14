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
