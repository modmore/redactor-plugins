# redactor-plugins
All plugins are fully compatible* with Imperavi's Redactor v10 and do not require [Redactor by mod<b>more</b>](https://www.modmore.com/extras/redactor/)<sup>&copy;</sup>.

As part of our continous effort to bring more awesomeness to your Rich Text experience within MODX Revolution we've authored several Redactor Plugins. This is their&nbsp;home.

_*Some plugins require a hack for multiple callback support, which we hope to see added to redactor.js in a future&nbsp;version._


### breadcrumb
Visually displays a breadcrumb navigation of the DOM node or nodes being&nbsp;edited.
![](http://cl.ly/image/2p1g402h0S0z/Screen%20Shot%202015-02-12%20at%205.40.36%20PM.png)

### clips
If set and a valid `clipsJson` String, adds the Redactor Clips plugin to the&nbsp;toolbar.

![](http://cl.ly/image/1J273u41243I/Screen%20Shot%202015-02-12%20at%205.38.14%20PM.png)

Example JSON:
```js
[
    {
        "title": "Buy Button",
        "advanced": "1",
        "tags": "apple cheese",
        "clip": "<a href='https://www.modmore.com/extras/?p=127' class='buy'>Buy this product now</a>."
    },
    {
        "title": "Copyright",
        "tags": "bacon cheese",
        "clip": "©2013 modmore."
    }
]
```

### contrast
Adds a keyboard shortcut for accessibility. F5 to invert eidtor screen contrast&nbsp;FTW.

![](http://cl.ly/image/2K181k0d3I0M/Screen%20Shot%202015-02-12%20at%205.39.55%20PM.png)

### counter
Begins where the [Imperavi Plugin leaves off](http://imperavi.com/redactor/plugins/counter/) and adds a nifty little estimated reading time counter. Cool&nbsp;huh?

![](http://cl.ly/image/1s3l2r021233/Screen%20Shot%202015-02-12%20at%205.39.22%20PM.png)

### download
Adds a toolbar button to download editor&nbsp;code.

![](http://cl.ly/image/010C2j220837/Screen%20Shot%202015-02-12%20at%205.37.42%20PM.png)

### imagepx
Adds options to set and preview image dimensions in the Image Edit modal&nbsp;window.

![](http://cl.ly/image/3E0p0s2g0p2n/Screen%20Shot%202015-02-12%20at%205.37.19%20PM.png)

### norphan
Attempts to prevent orphans by replacing the last space between words of block elements with a non-breaking&nbsp;space.

```html
<!-- norphan will change this -->
<blockquote>&#8220;Any man who would letterspace blackletter would steal sheep&#8221;.</blockquote>

<!--to this -->
<blockquote>&#8220;Any man who would letterspace blackletter would steal&nbsp;sheep&#8221;.</blockquote>
```

### replacer
![](http://cl.ly/image/0Q102l1J3r1R/Screen%20Shot%202015-02-12%20at%205.32.14%20PM.png)

Use CTRL+F to trigger a simple Find and Replace&nbsp;tool.

### speek
In supported browsers, adds a toolbar button which reads editor content&nbsp;aloud.

![](http://cl.ly/image/19121H0l2e3Y/Screen%20Shot%202015-02-12%20at%205.31.30%20PM.png)

### syntax
Adds Ace syntax highlighter to Redactor souce&nbsp;mode.

![](http://cl.ly/image/3R02103Z3k1v/Screen%20Shot%202015-02-12%20at%205.31.10%20PM.png)