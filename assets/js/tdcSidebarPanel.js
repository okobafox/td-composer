/**
 * Sidebar Panel Generator
 * Created by ra on 5/5/2016.
 */


/* global jQuery:{} */
/* global Backbone:{} */
/* global _:{} */

/* tdcAdminSettings */

var tdcSidebarPanel = {};


(function ( undefined ) {
    'use strict';


    tdcSidebarPanel = {

        _defaultGroupName: 'General', // where to put params that don't have a group


        /**
         * Small hook system for Sidebar Panel events
         * @private
         */
        _hook: {
            _hooks: [],
            addAction: function ( name, callback ) {
                if (_.isUndefined(tdcSidebarPanel._hook._hooks[name]) ) {
                    tdcSidebarPanel._hook._hooks[name] = [];
                }
                tdcSidebarPanel._hook._hooks[name].push( callback );
            },

            doAction: function ( name, callArguments ) {
                if (!_.isUndefined(tdcSidebarPanel._hook._hooks[name])) {
                    for(var i = 0; i < tdcSidebarPanel._hook._hooks[name].length; i++ ) {
                        tdcSidebarPanel._hook._hooks[name][i]( callArguments );
                    }
                }
            }
        },




        /**
         * we just hook the dom events here
         */
        init: function () {
            var $body = jQuery('body');


            // dropdown hook
            $body.on('change focus', '.tdc-property-dropdown:not(.tdc-row-col-dropdown):not(.tdc-innerRow-col-dropdown) select', function() {
                // save the oldValue on focus in
                if (event.type === 'focusin' || event.type === 'focus') { // the select raises a focus event instead of focusin
                    this.oldValue = this.value;
                    return;
                }

                console.log('on change: Select');
                var curValue = jQuery(this).val();
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );

                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    this.oldValue,                      // the old value
                    curValue                 // the new value
                );
                this.oldValue = curValue;
            });






            // textfield hook
            $body.on('keyup focus', '.tdc-property-textfield input', function(event) {

                // save the oldValue on focus in
                if (event.type === 'focusin') {
                    this.oldValue = this.value;
                    return;
                }


                var curValue = jQuery(this).val();
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );

                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    this.oldValue,                      // the old value
                    curValue                 // the new value
                );
                this.oldValue = curValue;
            });





            // colorpicker (change for colropicker, keyup for clear)
            $body.on('change keyup focus', '.tdc-property-colorpicker input', function(event) {
                // save the oldValue on focus in
                if (event.type === 'focusin') {
                    this.oldValue = this.value;
                    return;
                }

                var curValue = jQuery(this).val();
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );

                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    this.oldValue,                      // the old value
                    curValue                 // the new value
                );
                this.oldValue = curValue;



            });






            // hook the custom row dropdown
            $body.on( 'change focus', '.tdc-row-col-dropdown select', function () {

                // save the oldValue on focus in
                if ( event.type === 'focusin' || event.type === 'focus' ) { // the select raises a focus event instead of focusin
                    this.oldValue = this.value;
                    return;
                }

                var curValue = jQuery(this).val(),
                    rowModelId = tdcSidebar.getCurrentRow().data( 'model_id' ),
                    rowModel = tdcIFrameData.getModel( rowModelId );


                // check if the change is correct
                // 1 column -> 2 columns
                // 1 column -> 2 columns
                // 1 column -> 3 columns
                if ( ( ( '11' === this.oldValue ) && ( '23_13' === curValue || '13_23' === curValue || '13_13_13' === curValue ) )  ||

                        // 2 columns -> 1 column
                        // 2 columns -> 2 columns
                        // 2 columns -> 3 columns
                    ( ( '23_13' === this.oldValue ) && ( '11' === curValue || '13_23' === curValue || '13_13_13' === curValue ) ) ||

                        // 2 column -> 1 column
                        // 2 column -> 2 columns
                        // 2 column -> 3 columns
                    ( ( '13_23' === this.oldValue ) && ( '11' === curValue || '23_13' === curValue || '13_13_13' === curValue ) ) ||

                        // 3 column -> 1 column
                        // 3 column -> 2 columns
                        // 3 column -> 2 columns
                    ( ( '13_13_13' === this.oldValue ) && ( '11' === curValue || '23_13' === curValue || '13_23' === curValue ) ) ) {

                    tdcIFrameData.changeRowModel( rowModel, this.oldValue, curValue );
                    rowModel.getShortcodeRender( 1, null, true, Math.random() + Math.random() + Math.random());

                } else {
                    throw 'Invalid row change detected: this.oldValue:' + this.oldValue + ' and curValue: ' + curValue;
                }

                this.oldValue = curValue;

            });




            // hook the custom innerRow dropdown
            $body.on('change focus', '.tdc-innerRow-col-dropdown select', function() {

                // save the oldValue on focus in
                if (event.type === 'focusin' || event.type === 'focus') { // the select raises a focus event instead of focusin
                    this.oldValue = this.value;
                    return;
                }

                var curValue = jQuery(this).val(),
                    innerRowModelId = tdcSidebar._$currentInnerRow.data( 'model_id' ),
                    innerRowModel = tdcIFrameData.getModel( innerRowModelId );

                tdcIFrameData.changeInnerRowModel( innerRowModel, this.oldValue, curValue);

                innerRowModel.getShortcodeRender( 1, null, true, Math.random() + Math.random() + Math.random());  // clean up the rendom things

                this.oldValue = curValue;
            });


            /***************************************************************************************************
             *  events for css box!
             */

            // all the inputs for margin, padding, border
            $body.on('keyup', 'input.tdc-css-box-input', function(event) {
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );

                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    '',                      // the old value
                    tdcSidebarPanel._generateCssAttValue()                 // the new value
                );
            });


            // bg color
            $body.on('change keyup', '.tdc-css-background-color', function(event) {
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );
                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    '',                      // the old value
                    tdcSidebarPanel._generateCssAttValue()                 // the new value
                );


            });

            // border color
            $body.on('change keyup', '.tdc-css-border-color', function(event) {
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );
                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    '',                      // the old value
                    tdcSidebarPanel._generateCssAttValue()                 // the new value
                );
            });


            // border style selector
            $body.on('change', '.tdc-css-border-style', function(event) {
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );
                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    '',                      // the old value
                    tdcSidebarPanel._generateCssAttValue()                 // the new value
                );
            });


            // border radius
            $body.on('keyup', 'input.tdc-css-border-radius', function(event) {
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );

                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    '',                      // the old value
                    tdcSidebarPanel._generateCssAttValue()                 // the new value
                );
            });


            // on image click
            $body.on( 'click', '.tdc-css-bg-image', function(event) {

                var $imgBackgroundImage = jQuery(this);
                window.original_send_to_editor = window.send_to_editor;
                wp.media.editor.open(jQuery(this));

                window.send_to_editor = function(html) {
                    var img_link = jQuery('img', html).attr('src');
                    if(typeof img_link === 'undefined') {
                        img_link = jQuery(html).attr('src');
                    }

                    jQuery('.tdc-css-bg-remove').removeClass('tdc-hidden-button');

                    $imgBackgroundImage.attr('src', img_link);
                    $imgBackgroundImage.removeClass('tdc-no-image-selected');

                    //reset the send_to_editor function to its original state
                    window.send_to_editor = window.original_send_to_editor;

                    //close the modal window
                    tb_remove();

                    // fire the bg change event
                    var model = tdcIFrameData.getModel( $imgBackgroundImage.data('model_id') );
                    tdcSidebarController.onUpdate (
                        model,
                        $imgBackgroundImage.data('param_name'),    // the name of the parameter
                        '',                      // the old value
                        tdcSidebarPanel._generateCssAttValue()                 // the new value
                    );
                };
                return false;

            });
            // on remove image button click
            $body.on( 'click', '.tdc-css-bg-remove', function(event) {
                var $imgBackgroundImage = jQuery('.tdc-css-bg-image');
                $imgBackgroundImage.addClass('tdc-no-image-selected');
                $imgBackgroundImage.attr('src', window.tdcAdminSettings.pluginUrl +  '/assets/images/sidebar/no_img_upload.png');

                // fire the bg change event
                var model = tdcIFrameData.getModel( $imgBackgroundImage.data('model_id') );
                tdcSidebarController.onUpdate (
                    model,
                    $imgBackgroundImage.data('param_name'),    // the name of the parameter
                    '',                      // the old value
                    tdcSidebarPanel._generateCssAttValue()                 // the new value
                );
            });


            // bg style change
            $body.on('change', '.tdc-css-bg-style', function(event) {
                var model = tdcIFrameData.getModel( jQuery(this).data('model_id') );
                tdcSidebarController.onUpdate (
                    model,
                    jQuery(this).data('param_name'),    // the name of the parameter
                    '',                      // the old value
                    tdcSidebarPanel._generateCssAttValue()                 // the new value
                );
            });






        },


        /**
         *
         * @param $curDomBit - may be a row or column or element DOM etc...
         */
        bindPanelToModel: function (model) {

            // get the mapped shortcode for this model
            var mappedShortCode = window.tdcAdminSettings.mappedShortcodes[model.attributes.tag];
            //tdcDebug.log( mappedShortCode );


            // step 0 - delete the old panel. HTML + items
            tdcSidebarPanel._deletePanel();


            // step 1 - make the tabs
            var allGroupNames = [];
            for (var cnt = 0; cnt < mappedShortCode.params.length; cnt++) {
                var currentTabName = tdcSidebarPanel._defaultGroupName;
                if (!_.isEmpty(mappedShortCode.params[cnt].group)) {
                    currentTabName = mappedShortCode.params[cnt].group;
                }
                allGroupNames.push(currentTabName);
            }
            allGroupNames = _.uniq(allGroupNames); // make the tabs unique. First occurrence remains in the array.



            // step 3 - make the tabs and all the HTML
            var panelHtml = '';




            // tabs - top
            panelHtml += '<div class="tdc-tabs">';
                for (cnt = 0; cnt < allGroupNames.length; cnt++) {
                    if (cnt === 0) {
                        panelHtml += '<a href="#" data-tab-id="td-tab-' + tdcUtil.makeSafeForCSS(allGroupNames[cnt]) + '" class="tdc-tab-active">' + allGroupNames[cnt] + '</a>';
                    } else {
                        panelHtml += '<a href="#" data-tab-id="td-tab-' + tdcUtil.makeSafeForCSS(allGroupNames[cnt]) + '">' + allGroupNames[cnt] + '</a>';
                    }

                }
            panelHtml += '</div>';


            // tabs - content
            panelHtml += '<div class="tdc-tab-content-wrap">';
                for (cnt = 0; cnt < allGroupNames.length; cnt++) {
                    if (cnt === 0) {
                        panelHtml += '<div class="tdc-tab-content tdc-tab-content-visible" id="td-tab-' + tdcUtil.makeSafeForCSS(allGroupNames[cnt]) + '">';
                    } else {
                        panelHtml += '<div class="tdc-tab-content" id="td-tab-' + tdcUtil.makeSafeForCSS(allGroupNames[cnt]) + '">';
                    }

                        // tab content
                        panelHtml += tdcSidebarPanel._bindGroupAndGetHtml(allGroupNames[cnt], mappedShortCode, model);


                    panelHtml += '</div>'; // close tab content wrap
                }
            panelHtml += '</div>';



            jQuery('.tdc-inspector .tdc-tabs-wrapper').html(panelHtml);



            // step 4 - hook up all the events and update the newly generate panel ui








            jQuery('.tdc-breadcrumbs').show();


            // on this hook, the color picker attaches. Because we render in a buffer, all the panel controls that have to run code have to use this hook to run
            // the code after the panel is rendered in the page.
            tdcSidebarPanel._hook.doAction( 'panel_rendered' );






            // @todo Its content should be moved

            /**
             * update the row layout dropdown to represent the reality
             */
            (function () {
                var modelTag = model.get( 'tag' );
                if ( 'vc_row' === modelTag ) {

                    var $tdcRowColumnsModifier = jQuery('body .tdc-row-col-dropdown select' );


                    var childCollection = model.get( 'childCollection' );
                    if ( ! _.isUndefined( childCollection ) ) {
                        //tdcDebug.log( childCollection );

                        var width = tdcIFrameData.getChildCollectionWidths( childCollection );

                        if ( _.isUndefined( width ) ) {
                            // Default value
                            width = '11';
                        }
                        $tdcRowColumnsModifier.val( width );
                    }
                }

            })();


            /**
             * update the inner_row layout dropdown to represent the reality
             */
            (function () {
                var modelTag = model.get( 'tag' );

                if ( 'vc_row_inner' === modelTag ) {


                    var $tdcInnerRowColumnsModifier = jQuery('body .tdc-innerRow-col-dropdown select' ) ;



                    var childCollection = model.get( 'childCollection' );

                    if ( ! _.isUndefined( childCollection ) ) {

                        //tdcDebug.log( childCollection );

                        var width = tdcIFrameData.getChildCollectionWidths( childCollection );

                        //tdcDebug.log( width );

                        if ( _.isUndefined( width ) ) {
                            // Default value
                            width = '11';
                        }
                        $tdcInnerRowColumnsModifier.val( width );

                        var columnModel = model.get( 'parentModel' ),
                            attrsColumnModel = columnModel.get( 'attrs' ),
                            columnWidth = '';

                        if ( _.has( attrsColumnModel, 'width' ) ) {
                            columnWidth = attrsColumnModel.width.replace( '/', '' );
                        }

                        switch ( columnWidth ) {
                            case '' :
                                $tdcInnerRowColumnsModifier.find('option[value=12_12]').hide();
                                $tdcInnerRowColumnsModifier.find('option[value=23_13]').show();
                                $tdcInnerRowColumnsModifier.find('option[value=13_23]').show();
                                $tdcInnerRowColumnsModifier.find('option[value=13_13_13]').show();
                                break;

                            case '13' :
                                $tdcInnerRowColumnsModifier.find('option[value=12_12]').hide();
                                $tdcInnerRowColumnsModifier.find('option[value=23_13]').hide();
                                $tdcInnerRowColumnsModifier.find('option[value=13_23]').hide();
                                $tdcInnerRowColumnsModifier.find('option[value=13_13_13]').hide();
                                break;

                            case '23' :
                                $tdcInnerRowColumnsModifier.find('option[value=12_12]').show();
                                $tdcInnerRowColumnsModifier.find('option[value=23_13]').hide();
                                $tdcInnerRowColumnsModifier.find('option[value=13_23]').hide();
                                $tdcInnerRowColumnsModifier.find('option[value=13_13_13]').hide();
                                break;
                        }


                    }

                }

            })();




        },



        /**
         * Renders a whole group ( one tab )
         * @param groupName - the name of the group that you want to render
         * @param mappedShortCode - the full shortcode map
         * @param model - the full model for this element/shortcode
         * @returns {string} HTML with the tab
         * @private
         */
        _bindGroupAndGetHtml: function (groupName, mappedShortCode,  model) {
            var buffy = '';

            for (var cnt = 0; cnt < mappedShortCode.params.length; cnt++) {

                if (groupName === tdcSidebarPanel._defaultGroupName) { // default group, check for empty
                    if (_.isEmpty(mappedShortCode.params[cnt].group)) {
                        buffy += tdcSidebarPanel._bindParamAndGetHtml(mappedShortCode.params[cnt], model);
                    }
                } else { // all other groups, check by name
                    if (mappedShortCode.params[cnt].group === groupName) {
                        buffy += tdcSidebarPanel._bindParamAndGetHtml(mappedShortCode.params[cnt], model);
                    }
                }
            }
            return buffy;
        },


        _bindParamAndGetHtml: function (mappedParameter, model) {
            //console.log(model.attributes.attrs);


            switch(mappedParameter.type) {
                case 'colorpicker':
                    return tdcSidebarPanel.addColorpicker(mappedParameter, model);

                case 'dropdown':
                    return tdcSidebarPanel.addDropDown(mappedParameter, model);

                case 'textfield':
                    return tdcSidebarPanel.addTextField(mappedParameter, model);

                case 'textarea_html':
                    return tdcSidebarPanel.addTextAreaHtml(mappedParameter, model);

                case 'css_editor':
                    return tdcSidebarPanel.addCssEditor(mappedParameter, model);

                default:
                    return mappedParameter.param_name + ' - ' + mappedParameter.type + '<br>';
            }


            //console .log(mappedParameter);
        },


        /**
         * Delete the old panel.
         * @private
         */
        _deletePanel: function () {
            //return;
            console.log('clear  _deletePanel ');

            // @todo The hook callback stack should be cleaned!
            tdcSidebarPanel._hook._hooks = [];

            jQuery('.tdc-breadcrumbs').hide();
            jQuery('.tdc-inspector .tdc-current-element-head').empty();
            jQuery('.tdc-inspector .tdc-tabs-wrapper').empty();
        },




        /**
         * Adds classes the the wrap of a property in a panel
         * @param mappedParameter
         * @returns {string}
         * @private
         */
        _getParameterClasses: function (mappedParameter) {
           var mappedClasses = 'tdc-property-wrap';

            // add the autogenerated tdc-property-PROPERTY_TYPE
            mappedClasses += ' tdc-property-' + mappedParameter.type;

            // add the mapped 'class'
            if (!_.isUndefined(mappedParameter.class)) {
                mappedClasses +=  ' ' + mappedParameter.class;
            }

            return mappedClasses;
        },


        /**
         * returns the current value of a parameter. If it's not set by the user in the shortcode's atts, we will return the
         * default mapped value
         * @param mappedParameter
         * @param model
         * @returns {*}
         * @private
         */
        _getParameterCurrentValue: function (mappedParameter, model) {
            if (_.isEmpty(model.get('attrs')[mappedParameter.param_name])) {

                // for dropdowns the default value is always an empty string. Note that this is different from the vc implementation
                if (mappedParameter.type === 'dropdown') {
                    return '';
                }
                return mappedParameter.value; // return the 'default' value
            }

            return model.get('attrs')[mappedParameter.param_name];
        },


        /**
         * get the HTML dom name of the att
         * @param mappedParameter
         * @returns {string}
         * @private
         */
        _getParameterDomName: function (mappedParameter) {
            return 'tdc-param-' + mappedParameter.param_name;
        },


        /**
         * adds model id and param_name @todo we may need to remove this, macar model id -ul s-ar putea tine in calasa ca sa nu-l mai luam din dom
         * @param mappedParameter
         * @param model
         * @returns {string}
         * @private
         */
        _getParamterDataAtts: function (mappedParameter, model) {
            return 'data-model_id="' + model.cid +  '" data-param_name="' + mappedParameter.param_name + '"';
        },


        addColorpicker: function (mappedParameter, model) {

            var buffy = '';
            var colorPickerId = _.uniqueId();
            buffy += '<div class="' + tdcSidebarPanel._getParameterClasses(mappedParameter) + '">';
                buffy += '<div class="tdc-property-title">' + mappedParameter.heading + ':</div>';
                buffy += '<div class="tdc-property">';
                    buffy += '<input ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' id="' + colorPickerId + '" name="' + tdcSidebarPanel._getParameterDomName(mappedParameter) + '" type="text" value="' + tdcSidebarPanel._getParameterCurrentValue(mappedParameter, model) + '"/>';
                buffy += '</div>';
            buffy += '</div>';



            tdcSidebarPanel._hook.addAction( 'panel_rendered', function () {
                jQuery("#" + colorPickerId).cs_wpColorPicker();
            });


            return buffy;


        },


        addDropDown: function (mappedParameter, model) {
            var buffy = '';

            // make the selectOptions
            var selectOptions = '';
            var keys = Object.keys(mappedParameter.value);
            //console.log('------------ -------------- ------------');
            for (var i = 0; i < keys.length; i++) {
                var value = mappedParameter.value[keys[i]];
                var currentSelectedValue = tdcSidebarPanel._getParameterCurrentValue(mappedParameter, model);
                var selected = '';

                if (String(currentSelectedValue) === String(value)) {
                    //console.log('selected');
                    selected = ' selected="selected" ';
                }

                //console.log(currentSelectedValue + ' - ' + value);
                selectOptions += '<option ' + selected + ' value="' + value + '">' + keys[i] + '</option>';
            }




            buffy += '<div class="' + tdcSidebarPanel._getParameterClasses(mappedParameter) + '">';
                buffy += '<div class="tdc-property-title">' + mappedParameter.heading + ':</div>';
                buffy += '<div class="tdc-property">';
                    buffy += '<select ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' name="' + tdcSidebarPanel._getParameterDomName(mappedParameter) + '">';
                        buffy += selectOptions;
                    buffy += '</select>';
                buffy += '</div>';
            buffy += '</div>';



            return buffy;
        },



        addTextArea: function () {

        },

        addTextField: function (mappedParameter, model) {


            //console.log(mappedParameter);
            var buffy = '';
            buffy += '<div class="' + tdcSidebarPanel._getParameterClasses(mappedParameter) + '">';
                buffy += '<div class="tdc-property-title">' + mappedParameter.heading + ':</div>';
                buffy += '<div class="tdc-property">';
                    buffy += '<input ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' name="' + tdcSidebarPanel._getParameterDomName(mappedParameter) + '" type="text" value="' + tdcSidebarPanel._getParameterCurrentValue(mappedParameter, model) + '"/>';
                buffy += '</div>';
            buffy += '</div>';


            return buffy;
        },


        addTextAreaHtml: function (mappedParameter, model) {

            var editorContent = tdcSidebarPanel._getParameterCurrentValue(mappedParameter, model);

            var buffy = '';
            //var tinymceId = _.uniqueId( 'tinymce_' );
            var tinymceId = 'tdctinymce';
            buffy += '<div class="' + tdcSidebarPanel._getParameterClasses(mappedParameter) + '">';
            buffy += '<div class="tdc-property-title">' + mappedParameter.heading + ':</div>';
            buffy += '<div class="tdc-property">';
            buffy += '<div id="' + tinymceId + '" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '>' + tdcSidebarPanel._getParameterCurrentValue(mappedParameter, model) + '</div>';
            buffy += '</div>';
            buffy += '</div>';


            /**
             * There were some attempts to reuse a tinymce instance once it has been created, but destroying the DOM elements that has been referenced by the editor,
             * there's no tinymce API support to rebind it (as I can see!). This means a new tinymce editor should be created!
             *
             * Important! Even though the existing tinymce editor (once previously created) is found and removed, the tinymce.EditorManager keep a reference to it (@todo Is it a bug or what?)
             */
            tdcSidebarPanel._hook.addAction( 'panel_rendered', function () {

                var existingEditor = tinymce.get( tinymceId );

                if ( ! _.isNull( existingEditor ) ) {
                    tinymce.remove( tinymceId );
                }

                var newEditor = tinymce.createEditor( tinymceId, {

                    setup: function( editor ) {

                        var $input = jQuery( '#' + tinymceId );

                        var model = tdcIFrameData.getModel( $input.data( 'model_id' ) );

                        editor.on( 'keyup change undo', function( event ) {

                            var currentValue = editor.getContent({format: 'html'}),

                            // @todo This should be the content before change
                                previousValue = currentValue;

                            tdcSidebarController.onUpdate (
                                model,
                                $input.data( 'param_name' ),    // the name of the parameter
                                previousValue,                  // the old value
                                currentValue                    // the new value
                            );
                        });
                    }
                });

                newEditor.render();
            });

            return buffy;
        },


        /**
         * generates the CSS att value from the CssEditor values
         * @private
         */
        _generateCssAttValue: function () {

            var cssGenerator = new TdcCssGenerator();

            // css for padding, border margin (the square inputs)
            jQuery( ".tdc-css-box-input" ).each(function( index ) {
                cssGenerator[jQuery(this).data('tdc-for')] = jQuery(this).val();
            });


            cssGenerator.backgroundColor = jQuery('.tdc-css-background-color').val();
            cssGenerator.borderColor = jQuery('.tdc-css-border-color').val();
            cssGenerator.borderStyle = jQuery('.tdc-css-border-style').val();
            cssGenerator.borderRadius = jQuery('.tdc-css-border-radius').val();
            cssGenerator.setBackgroundStyle(jQuery('.tdc-css-bg-style').val());  // custom directive that sets multiple css properties


            // bg image, only if we don't have .tdc-no-image-selected
            var $imgBackgroundImage = jQuery('.tdc-css-bg-image');
            if ( !$imgBackgroundImage.hasClass('tdc-no-image-selected') ) {
                cssGenerator.backgroundUrl =   $imgBackgroundImage.attr('src');
            }

            var generatedCss = cssGenerator.generateCss();

            //tdcDebug.log(generatedCss);
            return generatedCss;
        },


        addCssEditor: function (mappedParameter, model) {


            //var cssAtt = tdcSidebarPanel._getParameterCurrentValue(mappedParameter, model);

            if (_.isEmpty(model.get('attrs').css)) {
                tdcCssParser.parse('');
            } else {
                tdcCssParser.parse(model.get('attrs').css);
            }

            //var propertyValue = tdcCssParser.getPropertyValueClean(cssProperty);


            //console.log(tdcCssParser.getPropertyValueClean('margin-top'));


            //console.log(model.get('attrs')['css']);

            var buffy = '';
            buffy += '<div class="' + tdcSidebarPanel._getParameterClasses(mappedParameter) + '">';
                buffy += '<div class="tdc-property-title">Margin:</div>';
                buffy += '<div class="tdc-box-margin">';
                    buffy += '<input data-tdc-for="marginTop" class="tdc-css-box-input tdc-css-box-input-top" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('margin-top') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                    buffy += '<input data-tdc-for="marginRight" class="tdc-css-box-input tdc-css-box-input-right" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('margin-right') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                    buffy += '<input data-tdc-for="marginBottom" class="tdc-css-box-input tdc-css-box-input-bottom" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('margin-bottom') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                    buffy += '<input data-tdc-for="marginLeft" class="tdc-css-box-input tdc-css-box-input-left" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('margin-left') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';

                    buffy += '<div class="tdc-box-border">';
                        buffy += '<input data-tdc-for="borderWidthTop" class="tdc-css-box-input tdc-css-box-input-top" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('border-width-top') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                        buffy += '<input data-tdc-for="borderWidthRight" class="tdc-css-box-input tdc-css-box-input-right" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('border-width-right') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                        buffy += '<input data-tdc-for="borderWidthBottom" class="tdc-css-box-input tdc-css-box-input-bottom" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('border-width-bottom') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                        buffy += '<input data-tdc-for="borderWidthLeft" class="tdc-css-box-input tdc-css-box-input-left" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('border-width-left') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';

                        buffy += '<div class="tdc-box-padding">';
                            buffy += '<input data-tdc-for="paddingTop" class="tdc-css-box-input tdc-css-box-input-top" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('padding-top') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                            buffy += '<input data-tdc-for="paddingRight" class="tdc-css-box-input tdc-css-box-input-right" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('padding-right') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                            buffy += '<input data-tdc-for="paddingBottom" class="tdc-css-box-input tdc-css-box-input-bottom" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('padding-bottom') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                            buffy += '<input data-tdc-for="paddingLeft" class="tdc-css-box-input tdc-css-box-input-left" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('padding-left') + '" placeholder="-" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + '/>';
                        buffy += '</div>';

                    buffy += '</div>';

                buffy += '</div>';



            buffy += '</div>';




            // border color
            var borderColorPickerId = _.uniqueId();
            buffy += '<div class="tdc-property-wrap">';
            buffy += '<div class="tdc-property-title">Border color:</div>';
            buffy += '<div class="tdc-property">';
            buffy += '<input class="tdc-css-border-color" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' id="' + borderColorPickerId + '" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('border-color') + '"/>';
            buffy += '</div>';
            buffy += '</div>';
            tdcSidebarPanel._hook.addAction( 'panel_rendered', function () {
                jQuery("#" + borderColorPickerId).cs_wpColorPicker();
            });

            // bg color
            var bgColorPickerId = _.uniqueId();
            buffy += '<div class="tdc-property-wrap">';
            buffy += '<div class="tdc-property-title">Background color:</div>';
            buffy += '<div class="tdc-property">';
            buffy += '<input class="tdc-css-background-color" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' id="' + bgColorPickerId + '" name="" type="text" value="' + tdcCssParser.getPropertyValueClean('background-color') + '"/>';
            buffy += '</div>';
            buffy += '</div>';
            tdcSidebarPanel._hook.addAction( 'panel_rendered', function () {
                jQuery("#" + bgColorPickerId).cs_wpColorPicker();
            });



            // border style
            var currentBorderStyle = tdcCssParser.getPropertyValueClean('border-style');
            var borderStyles = [
                {value: '', display: 'Theme defaults'},
                {value: 'solid', display: 'Solid'},
                {value: 'dotted', display: 'Dotted'},
                {value: 'dashed', display: 'Dashed'},
                {value: 'none', display: 'None'},
                {value: 'hidden', display: 'Hidden'},
                {value: 'double', display: 'Double'},
                {value: 'groove', display: 'Groove'},
                {value: 'ridge', display: 'Ridge'},
                {value: 'inset', display: 'Inset'},
                {value: 'outset', display: 'Outset'},
                {value: 'initial', display: 'Initial'},
                {value: 'inherit', display: 'Inherit'}
            ];
            buffy += '<div class="tdc-property-wrap">';
                buffy += '<div class="tdc-property-title">Border style:</div>';
                buffy += '<div class="tdc-property">';
                    buffy += '<select class="tdc-css-border-style" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' name="">';
                        buffy += tdcSidebarPanel._generateDropdownOptions(borderStyles, currentBorderStyle);
                    buffy += '</select>';
                buffy += '</div>';
            buffy += '</div>';




            // border radius
            buffy += '<div class="tdc-property-wrap">';
                buffy += '<div class="tdc-property-title">Border radius:</div>';
                buffy += '<div class="tdc-property">';
                    buffy += '<input class="tdc-css-border-radius" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' name="" type="text" value="' + tdcCssParser.getPropertyValueClean('border-radius') + '"/>';
                buffy += '</div>';
            buffy += '</div>';


            // bg upload
            buffy += '<div class="tdc-property-wrap">';
                buffy += '<div class="tdc-property-title">Background upload:</div>';
                buffy += '<div class="tdc-property">';
                        buffy += '<div class="tdc-css-bg-image-wrap">';
                            buffy += '<img class="tdc-no-image-selected tdc-css-bg-image" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' src="'  + window.tdcAdminSettings.pluginUrl +  '/assets/images/sidebar/no_img_upload.png" />';
                        buffy += '</div>';
                        buffy += '<a class="tdc-css-bg-remove tdc-hidden-button" href="#" >Remove</a>';
                buffy += '</div>';
            buffy += '</div>';
            tdcSidebarPanel._hook.addAction( 'panel_rendered', function () {

                // read the value and show the image + remove button
                var currentBgUrl = tdcCssParser.getPropertyValueClean('background-url');
                if (currentBgUrl !== '') {
                    jQuery('.tdc-css-bg-image').attr('src', currentBgUrl);
                    jQuery('.tdc-css-bg-image').removeClass('tdc-no-image-selected');

                    jQuery('.tdc-css-bg-remove').removeClass('tdc-hidden-button');
                }
            });



            // bg style
            var currentBgStyle = tdcCssParser.getPropertyValueClean('background-style'); // background-style is a custom directive that sets multiple css properties
            var bgStyles = [
                {value: '', display: 'Theme defaults'},
                {value: 'cover', display: 'Cover'},
                {value: 'contain', display: 'Contain'},
                {value: 'no-repeat', display: 'No repeat'},
                {value: 'repeat', display: 'Repeat'}
            ];
            buffy += '<div class="tdc-property-wrap">';
                buffy += '<div class="tdc-property-title">Background style:</div>';
                buffy += '<div class="tdc-property">';
                    buffy += '<select class="tdc-css-bg-style" ' + tdcSidebarPanel._getParamterDataAtts(mappedParameter, model) + ' name="">';
                        buffy += tdcSidebarPanel._generateDropdownOptions(bgStyles, currentBgStyle);
                    buffy += '</select>';
                buffy += '</div>';
            buffy += '</div>';





            return buffy;
        },




        _generateDropdownOptions: function (dropDownOptions, currentValue) {
            var buffy = '';
            for ( var i = 0; i < dropDownOptions.length; i++ ) {
                buffy += '<option ' + (currentValue === dropDownOptions[i].value  ? ' selected="selected" ' : '') + ' value="' + dropDownOptions[i].value + '">' + dropDownOptions[i].display + '</option>';
            }
            return buffy;
        }





    };


    tdcSidebarPanel.init();
})();













