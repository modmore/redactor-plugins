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

