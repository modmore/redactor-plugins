if (!RedactorPlugins) var RedactorPlugins = {};

(function($)
{
	RedactorPlugins.clips = function()
	{
		return {
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
                
                var items = this.clips.json;

				this.clips.template = $('<ul id="redactor-modal-list">');

				for (var i = 0; i < items.length; i++)
				{
					var li = $('<li>');
					var a = $('<a href="#" class="redactor-clip-link">').text(items[i].title);
					var div = $('<div class="redactor-clip">').hide().html(items[i].clip);
                    
                    if(items[i].advanced !== undefined && items[i].advanced !== 'false' && items[i].advanced !== false) $(div).attr('data-advanced','1');

					li.append(a);
					li.append(div);
					this.clips.template.append(li);
				}

				this.modal.addTemplate('clips', '<section>' + this.utils.getOuterHtml(this.clips.template) + '</section>');

				var button = this.button.add('clips', 'Clips');
				this.button.addCallback(button, this.clips.show);

			},
			show: function()
			{
				this.modal.load('clips', 'Insert Clips', 400);

				this.modal.createCancelButton();

				$('#redactor-modal-list').find('.redactor-clip-link').each($.proxy(this.clips.load, this));

				this.selection.save();
				this.modal.show();
			},
			load: function(i,s)
			{
                $(s).addClass('loaded');
				$(s).on('click', $.proxy(function(e)
				{
					e.preventDefault();
					this.clips.insert($(s).next().html(),$(s).next().attr('data-advanced') == '1');

				}, this));
			},
			insert: function(html,advanced)
			{
				this.selection.restore();
                if(advanced) this.insert.htmlWithoutClean(html);
                else this.insert.html(html,true);
				this.modal.close();
				this.observe.load();
			}
		};
	};
})(jQuery);