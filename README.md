# tagDiv Composer v1.0 BETA

License: GPL V3

Author: tagDiv - Themes for smart people

**Support forum:** http://forum.tagdiv.com/forum/tagdiv-composer/ - for now the support forum is open only to our clients that got Newspaper or Newsmag theme.

#### What's this?
A GPL pagebuilder plugin for WordPress that uses shortcodes to save and reder the page.

### Download
- [Download the latest release](https://github.com/tagDiv/td-composer/releases/latest) **(recommended)**
- or you can run the plugin from this github repo but please note that the built-in LESS compiler runs only on Windows for now. You can compile your own less files - modify the TDC_USE_LESS constant in td_deploy_mode.php

#### Blocks auto resize to the available width:
<img src="https://raw.githubusercontent.com/tagDiv/td-composer/master/github-site/Animation1.gif?token=AE_CY7mcJFFk223Q-QQgTAuKkhiLqy9kks5XhO3wwA%3D%3D" width="480">


#### Frontend live editor:
<img src="https://raw.githubusercontent.com/tagDiv/td-composer/master/github-site/Animation2.gif?token=AE_CY5UD9_NcRLMgOuB_L41hiXUbXu0xks5XhO3ywA%3D%3D" width="480">



#### What's special?
- It's somehow compatible with Visual Composer's shortcodes 
- It's much faster than other composers / pagebuilders
- The plugin works side by side with Visual Composer
- GPL license, open to new contribuitors, maintained and suppoerted by us (tagDiv)
- Custom drag and drop code, we don't rely on external libraries and we aim for the perfect user experience

We've implemented the following shortcodes: 
```
rev_slider
vc_column
vc_column_inner
vc_column_text
vc_empty_space
vc_raw_html
vc_row
vc_row_inner
vc_widget_sidebar
... + all the shortcodes from Newspaper theme
```

#### Limitations:
-  We generally recommend that you create the pages with tagDiv Composer, we don't have full support for pages generated with Visual Composer but some of them may work
-  Currently the plugin only works with our themes, we did extensive testing and development on Newspaper but it should also work on Newsmag. We plan to support other themes in the future when the plugin is more stable.

#### Contributing to this project:
- We are looking for contributors https://help.github.com/articles/fork-a-repo/
