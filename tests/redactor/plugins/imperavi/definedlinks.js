(function($)
{
	$.Redactor.prototype.definedlinks = function()
	{
		return {
			init: function()
			{
				if (!this.opts.definedlinks && !this.opts.definedLinks)
				{
					return;
				}

				this.modal.addCallback('link', $.proxy(this.definedlinks.load, this));

			},
			load: function()
			{
				var that = this;
				var $section = $('<section />');
				var $select = $('<select id="redactor-defined-links" />');

				$section.append($select);
				this.modal.getModal().prepend($section);

				this.definedlinks.storage = {};
				var definedlinks = (this.opts.definedlinks) ? this.opts.definedlinks : this.opts.definedLinks;
				try {
					handleData($.parseJSON(definedlinks));
				} catch (e) {
					$.getJSON(definedlinks, $.proxy(function(data)
					{
						handleData(data);
					}, this));
				} 
				
				function handleData(data) {
					$.each(data, $.proxy(function(key, val)
					{
						that.definedlinks.storage[key] = val;
						$select.append($('<option>').val(key).html(val.name));

					}, that));

					$select.on('change', $.proxy(that.definedlinks.select, that));
				}

			},
			select: function(e)
			{
				var oldText = $.trim($('#redactor-link-url-text').val());

				var key = $(e.target).val();
				var name = '', url = '';
				if (key !== 0)
				{
					name = this.definedlinks.storage[key].name;
					url = this.definedlinks.storage[key].url;
				}

				$('#redactor-link-url').val(url);

				if (oldText === '')
				{
					$('#redactor-link-url-text').val(name);
				}

			}
		};
	};
})(jQuery);