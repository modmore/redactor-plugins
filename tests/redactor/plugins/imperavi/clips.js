(function($)
{
	$.Redactor.prototype.clips = function()
	{
		return {
			json:null,
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
				if(!this.clips.json) this.clips.json = this.opts.clipsJson || ([
					{title:'Lorem ipsum...', clip:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
					{title:'Red label', clip:'<b class="label-red">Label</b>'}
				]);

				var items = this.clips.json;
				this.clips.template = $('<ul id="redactor-modal-list">');

				for (var i = 0; i < items.length; i++)
				{
					var item = items[i];
					var li = $('<li>');
					var a = $('<a href="#" class="redactor-clips-link">').text(item.title);
					var div = $('<div class="redactor-clips">').hide().html(item.clip);

					li.append(a);
					li.append(div);
					this.clips.template.append(li);
				}

				this.modal.addTemplate('clips', '<div class="modal-section">' + this.utils.getOuterHtml(this.clips.template) + '</div>');

				var button = this.button.add('clips', 'Clips');

				this.button.addCallback(button, this.clips.show);

			},
			show: function()
			{
				this.modal.load('clips', 'Insert Clips', 500);

				$('#redactor-modal-list').find('.redactor-clips-link').each($.proxy(this.clips.load, this));

				this.modal.show();
			},
			load: function(i,s)
			{
				$(s).on('click', $.proxy(function(e)
				{
					e.preventDefault();
					this.clips.insert($(s).next().html());

				}, this));
			},
			insert: function(html)
			{
				this.buffer.set();
				this.air.collapsedEnd();
				this.insert.html(html);
				this.modal.close();
			}
		};
	};
})(jQuery);
