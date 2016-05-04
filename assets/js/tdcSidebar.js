/**
 * Created by ra on 3/23/2016.
 */

/* global jQuery:{} */
/* global Backbone:{} */
/* global _:{} */

var tdcSidebar;

(function( jQuery, _, undefined ) {

    'use strict';

    tdcSidebar = {

        $editRow: undefined,
        $editColumn: undefined,
        $editInnerRow: undefined,
        $editInnerColumn: undefined,

        _$currentElement: undefined,

        _$currentRow: undefined,
        _$currentColumn: undefined,
        _$currentInnerRow: undefined,
        _$currentInnerColumn: undefined,

        $currentElementTitle: undefined,
        $inspector: undefined,

        // Row - Columns settings
        _$rowColumns: undefined,
        // Inner Row - Inner Columns settings
        _$innerRowInnerColumns: undefined,


        _rowColumnsPrevVal: undefined,
        _innerRowInnerColumnsPrevVal: undefined,




        init: function() {

            tdcSidebar.$editRow = jQuery( '#tdc-breadcrumb-row' );
            tdcSidebar.$editRow.data( 'name', 'Row' );

            tdcSidebar.$editColumn = jQuery( '#tdc-breadcrumb-column' );
            tdcSidebar.$editColumn.data( 'name', 'Column' );

            tdcSidebar.$editInnerRow = jQuery( '#tdc-breadcrumb-inner-row' );
            tdcSidebar.$editInnerRow.data( 'name', 'Inner Row' );

            tdcSidebar.$editInnerColumn = jQuery( '#tdc-breadcrumb-inner-column' );
            tdcSidebar.$editInnerColumn.data( 'name', 'Inner Column' );

            tdcSidebar.$currentElementTitle = jQuery( '.tdc-current-element-title' );
            tdcSidebar.$inspector = jQuery( '.tdc-inspector' );


            tdcSidebar.$editRow.click(function() {
                tdcSidebar.activeBreadcrumbItem( tdcSidebar.$editRow, tdcSidebar._$currentRow );

            }).mouseenter(function( event ) {

                if ( ! _.isUndefined( tdcSidebar._$currentElement ) ) {
                    tdcMaskUI.setCurrentElement( tdcSidebar._$currentElement );
                    tdcMaskUI.$wrapper.hide();
                }

                if ( ! _.isUndefined( tdcSidebar._$currentRow ) ) {
                    tdcMaskUI.setCurrentContainer( tdcSidebar._$currentRow );
                }

            }).mouseleave(function( event ) {
                tdcMaskUI.hide();
            });


            tdcSidebar.$editColumn.click(function() {
                tdcSidebar.activeBreadcrumbItem( tdcSidebar.$editColumn, tdcSidebar._$currentColumn );

            }).mouseenter(function( event ) {

                if ( ! _.isUndefined( tdcSidebar._$currentElement ) ) {
                    tdcMaskUI.setCurrentElement( tdcSidebar._$currentElement );
                    tdcMaskUI.$wrapper.hide();
                }

                if ( ! _.isUndefined( tdcSidebar._$currentColumn ) ) {
                    tdcMaskUI.setCurrentContainer( tdcSidebar._$currentColumn );
                }

            }).mouseleave(function( event ) {
                tdcMaskUI.hide();
            });


            tdcSidebar.$editInnerRow.click(function() {
                tdcSidebar.activeBreadcrumbItem( tdcSidebar.$editInnerRow, tdcSidebar._$currentInnerRow );

            }).mouseenter(function( event ) {

                if ( ! _.isUndefined( tdcSidebar._$currentElement ) ) {
                    tdcMaskUI.setCurrentElement( tdcSidebar._$currentElement );
                    tdcMaskUI.$wrapper.hide();
                }

                if ( ! _.isUndefined( tdcSidebar._$currentInnerRow ) ) {
                    tdcMaskUI.setCurrentContainer( tdcSidebar._$currentInnerRow );
                }

            }).mouseleave(function( event ) {
                tdcMaskUI.hide();
            });


            tdcSidebar.$editInnerColumn.click(function() {
                tdcSidebar.activeBreadcrumbItem( tdcSidebar.$editInnerColumn, tdcSidebar._$currentInnerColumn );

            }).mouseenter(function( event ) {

                if ( ! _.isUndefined( tdcSidebar._$currentElement ) ) {
                    tdcMaskUI.setCurrentElement( tdcSidebar._$currentElement );
                    tdcMaskUI.$wrapper.hide();
                }

                if ( ! _.isUndefined( tdcSidebar._$currentInnerColumn ) ) {
                    tdcMaskUI.setCurrentContainer( tdcSidebar._$currentInnerColumn );
                }

            }).mouseleave(function( event ) {
                tdcMaskUI.hide();
            });


            jQuery( '.tdc-sidebar-element').each(function( index, element ) {
                tdcSidebar._bindElement( jQuery( element ) );
            });



            tdcSidebar._$rowColumns = tdcSidebar.$inspector.find( 'select[name=tdc-row-column]' );
            tdcSidebar._rowColumnsPrevVal = tdcSidebar._$rowColumns.val();
            tdcSidebar._$rowColumns.change(function( event ) {
                tdcSidebar.changeRowColumns( tdcSidebar._rowColumnsPrevVal, jQuery(this).val() );
                tdcSidebar._rowColumnsPrevVal = jQuery(this).val();
            });


            tdcSidebar._$innerRowInnerColumns = tdcSidebar.$inspector.find( 'select[name=tdc-inner-row-inner-column]' );
            tdcSidebar._innerRowInnerColumnsPrevVal = tdcSidebar._$innerRowInnerColumns.val();
            tdcSidebar._$innerRowInnerColumns.change(function( event ) {
                tdcSidebar.changeInnerRowInnerColumns( tdcSidebar._innerRowInnerColumnsPrevVal, jQuery(this).val() );
                tdcSidebar._innerRowInnerColumnsPrevVal = jQuery(this).val();
            });


            tdcSidebar.sidebarModal();
            tdcSidebar.liveInspectorTabs();
        },



        activeBreadcrumbItem: function( $item, $currentContainer ) {
            tdcSidebar.setCurrentElementContent( $item.data( 'name' ) );
            $item.show();
            $item.nextAll().hide();
            tdcSidebar._showLayoutInspector( $currentContainer );
        },



        setCurrentElementContent: function( content ) {
            tdcSidebar.$currentElementTitle.html( content );
        },



        closeModal: function() {
            jQuery( '.tdc-sidebar-modal-elements' ).removeClass( 'tdc-modal-open' );
        },



        sidebarModal: function () {
            // Sidebar elements modal window - open
            jQuery('.tdc-add-element').click(function(){
                jQuery('.tdc-sidebar-modal-elements').addClass('tdc-modal-open');
            });

            // Sidebar elements modal window - close
            jQuery('.tdc-modal-close').click(function(){
                jQuery('.tdc-sidebar-modal-elements').removeClass('tdc-modal-open');

                //jQuery('.tdc-sidebar-modal-row').removeClass('tdc-modal-open');
                //jQuery('.tdc-sidebar-modal-column').removeClass('tdc-modal-open');
                //jQuery('.tdc-sidebar-modal-inner-row').removeClass('tdc-modal-open');
                //jQuery('.tdc-sidebar-modal-inner-column').removeClass('tdc-modal-open');
            });

        },



        _bindElement: function( $element ) {

            $element.click(function( event ) {
                //tdcDebug.log( 'click sidebar element' );

                event.preventDefault();

            }).mousedown(function( event ) {
                //tdcDebug.log( 'sidebar element mouse down' );

                // Consider only the left button
                if ( 1 !== event.which ) {
                    return;
                }

                event.preventDefault();

                tdcOperationUI.activeDraggedElement( $element );
                tdcOperationUI.showHelper( event );

            }).mouseup(function( event ) {

                // Respond only if dragged element is 'tdc-sidebar-element'
                if ( tdcOperationUI.isSidebarElementDragged() ) {

                    //tdcDebug.log( 'sidebar element mouse up' );
                    event.preventDefault();

                    tdcOperationUI.deactiveDraggedElement();
                    tdcOperationUI.hideHelper();
                }
            });
        },




        liveInspectorTabs: function () {

            jQuery('.tdc-tabs a').on('click', function(){
                if (jQuery(this).hasClass('tdc-tab-active') === true) {
                    return;
                }


                // the tab
                jQuery('.tdc-tabs a').removeClass('tdc-tab-active');
                jQuery(this).addClass('tdc-tab-active');


                // content - remove all visible classes
                jQuery('.tdc-tab-content-wrap .tdc-tab-content').removeClass( 'tdc-tab-content-visible' );

                // add the class to the good content
                var tabContentId = jQuery(this).data('tab-id');
                jQuery('#' + tabContentId).addClass('tdc-tab-content-visible');
            });
        },



        setCurrentElement: function( $currentElement ) {
            tdcSidebar._$currentElement = $currentElement;
        },
        getCurrentElement: function() {
            return tdcSidebar._$currentElement;
        },


        setCurrentRow: function( $currentRow ) {
            tdcSidebar._$currentRow = $currentRow;
        },
        getCurrentRow: function() {
            return tdcSidebar._$currentRow;
        },


        setCurrentColumn: function( $currentColumn ) {
            tdcSidebar._$currentColumn = $currentColumn;
        },
        getCurrentColumn: function() {
            return tdcSidebar._$currentColumn;
        },


        setCurrentInnerRow: function( $currentInnerRow ) {
            tdcSidebar._$currentInnerRow = $currentInnerRow;
        },
        getCurrentInnerRow: function() {
            return tdcSidebar._$currentInnerRow;
        },


        setCurrentInnerColumn: function( $currentInnerColumn ) {
            tdcSidebar._$currentInnerColumn = $currentInnerColumn;
        },
        getCurrentInnerColumn: function() {
            return tdcSidebar._$currentInnerColumn;
        },



        _showInspector: function() {

            if ( ! _.isUndefined( tdcSidebar._$currentElement ) ) {

                tdcSidebar.$inspector.find( '.tdc-tabs > a' ).each( function( index, element ) {

                    var $element = jQuery( element ),
                        $tabContent = tdcSidebar.$inspector.find( '#' + $element.data( 'tab-id' ) );

                    if ( 0 === index ) {
                        $element.show();
                        $element.addClass( 'tdc-tab-active' );
                        $tabContent.addClass( 'tdc-tab-content-visible' );
                    } else {
                        if ( $element.hasClass( 'tdc-layout' ) ) {
                            $element.hide();
                        } else {
                            $element.show();
                        }
                        $element.removeClass( 'tdc-tab-active' );
                        $tabContent.removeClass( 'tdc-tab-content-visible' );
                    }
                });
            }

            tdcSidebar.$inspector.show();
        },



        _showLayoutInspector: function( $currentContainer ) {

            //tdcDebug.log( '_showLayoutInspector' );

            var classLayout;

            if ( ! _.isUndefined( $currentContainer ) ) {

                if ( tdcRowHandlerUI.isRow( $currentContainer ) ) {
                    classLayout = 'tdc-layout-row';
                    tdcSidebar._setRowColumnSettings( $currentContainer );

                } else if ( tdcColumnHandlerUI.isColumn( $currentContainer ) ) {
                    classLayout = 'tdc-layout-column';

                } else if ( tdcInnerRowHandlerUI.isInnerRow( $currentContainer ) ) {
                    classLayout = 'tdc-layout-inner-row';
                    tdcSidebar._setInnerRowInnerColumnSettings( $currentContainer );

                } else if ( tdcInnerColumnHandlerUI.isInnerColumn( $currentContainer ) ) {
                    classLayout = 'tdc-layout-inner-column';
                }
            }

            tdcSidebar.$inspector.find( '.tdc-tabs > a' ).each( function( index, element ) {

                var $element = jQuery( element ),
                    $tabContent = tdcSidebar.$inspector.find( '#' + $element.data( 'tab-id' ) );

                //tdcDebug.log( classLayout );

                if ( _.isUndefined( classLayout ) ) {
                    if ( 0 === index ) {
                        $element.show();
                        $element.addClass( 'tdc-tab-active' );
                        $tabContent.addClass( 'tdc-tab-content-visible' );
                    } else {
                        if ( $element.hasClass( 'tdc-layout' ) ) {
                            $element.hide();
                        } else {
                            $element.show();
                        }
                        $element.removeClass( 'tdc-tab-active' );
                        $tabContent.removeClass( 'tdc-tab-content-visible' );
                    }
                } else {
                    if ( $element.hasClass( classLayout ) ) {
                        $element.show();
                        $element.addClass( 'tdc-tab-active' );
                        $tabContent.addClass( 'tdc-tab-content-visible' );
                    } else {
                        $element.hide();
                        $element.removeClass( 'tdc-tab-active' );
                        $tabContent.removeClass( 'tdc-tab-content-visible' );
                    }
                }
            });

            tdcSidebar.$inspector.show();
        },



        _setInnerRowInnerColumnSettings: function( $currentContainer ) {

            var modelId = $currentContainer.data( 'model_id' );

            if ( ! _.isUndefined( modelId ) ) {
                var model = tdcIFrameData.getModel( modelId );

                if ( ! _.isUndefined( model ) ) {
                    var childCollection = model.get( 'childCollection' );

                    if ( ! _.isUndefined( childCollection ) ) {

                        //tdcDebug.log( childCollection );

                        var width = '';
                        _.map( childCollection.models, function( val, key ) {

                            var attrs = val.get( 'attrs' );
                            if ( _.has( attrs, 'width' ) ) {
                                if ( ! width.length ) {
                                    width += attrs.width.replace( '/', '');
                                } else {
                                    width += '_' + attrs.width.replace( '/', '');
                                }
                            }
                        });

                        tdcDebug.log( width );

                        if ( width.length ) {
                            tdcSidebar._$innerRowInnerColumns.val( width );
                        } else {
                            tdcSidebar._$innerRowInnerColumns.val( '11' );
                        }
                    }
                }
            }
        },



        _setRowColumnSettings: function( $currentContainer ) {

            var modelId = $currentContainer.data( 'model_id' );

            if ( ! _.isUndefined( modelId ) ) {
                var model = tdcIFrameData.getModel( modelId );

                if ( ! _.isUndefined( model ) ) {
                    var childCollection = model.get( 'childCollection' );

                    if ( ! _.isUndefined( childCollection ) ) {

                        //tdcDebug.log( childCollection );

                        var width = '';
                        _.map( childCollection.models, function( val, key ) {

                            var attrs = val.get( 'attrs' );
                            if ( _.has( attrs, 'width' ) ) {
                                if ( ! width.length ) {
                                    width += attrs.width.replace( '/', '');
                                } else {
                                    width += '_' + attrs.width.replace( '/', '');
                                }
                            }
                        });

                        //tdcDebug.log( width );

                        if ( width.length ) {
                            tdcSidebar._$rowColumns.val( width );
                        } else {
                            tdcSidebar._$rowColumns.val( '11' );
                        }
                    }
                }
            }
        },




        changeRowColumns: function( oldValue, newValue ) {

            if ( '11' === oldValue ) {

                // 1 column -> 2 columns
                // Steps:
                //  1. A new column is added. All elements remains in their existing first column
                //  2. We must see what we have initially in that first column: 13_13_13, 23_13, 13_23 or 11. The new 23_13 will be 12 + 12 + 11
                //      A. 13_13_13 : All elements are 13
                //      B. 23_13 : All elements are 23 and 13
                //      C. 13_23 : All elements are 13 and 23
                //      D. 11 : All elements are 11
                //  For these (A, B, C and D), all elements will become 12 and will be added to the first 23 column. The last 13 column remains empty.
                if ( '23_13' === newValue ) {



                    var rowModelId = tdcSidebar._$currentRow.data( 'model_id' );

                    var rowModel = tdcIFrameData.getModel( rowModelId );

                    var $tdcColumns = tdcSidebar._$currentRow.find( '.tdc-columns' );

                    // Temporary columns are added. They will be replaced by the new columns
                    var $tempColumn = jQuery( '<div class="tdc-column-temp"></div>' );

                    $tdcColumns.append( $tempColumn );

                    // Define the first column model
                    var columnModel = new tdcIFrameData.TdcModel({
                        'content': '',
                        'attrs': {
                            width: '1/3'
                        },
                        'tag': 'vc_column',
                        'type': 'closed',
                        'level': 1,
                        'parentModel': rowModel
                    }),

                    // Define the first column liveView
                    columnView = new tdcIFrameData.TdcLiveView({
                        model: columnModel,
                        el: $tempColumn[0]
                    });

                    // Set the data model id to the liveView jquery element
                    $tempColumn.data( 'model_id', columnModel.cid );

                    var childCollectionRow = rowModel.get( 'childCollection' );

                    // Get the existing model and change its 'width' attribute
                    var firstModel = childCollectionRow.at( 0 );

                    var attrs = firstModel.get( 'attrs' );

                    attrs.width = '2/3';

                    firstModel.set( 'attrs', attrs );

                    _.map( childCollectionRow.models, function( val1, key1 ) {
                        var existingColumnModel = val1,
                            childCollection = existingColumnModel.get( 'childCollection' );
                        //@todo parametru al 4-lea nu e folosit?  Math.random() + Math.random() + Math.random()
                        existingColumnModel.getShortcodeRender( 1, null, true, Math.random() + Math.random() + Math.random() );
                    });

                    // Add the new models to the collection
                    childCollectionRow.add( columnModel );

                    columnModel.set( 'childCollection', new tdcIFrameData.TdcCollection() );

                    // Get the shortcode rendered
                    columnModel.getShortcodeRender( 1, null, true, columnView.cid ); //@todo issue: parametrul al 4-lea nu e folosit?





                // 1 column -> 2 columns
                } else if ( '13_23' === newValue ) {


                // 1 column -> 3 columns
                } else if ( '13_13_13' === newValue ) {

                }

            } else if ( '23_13' === oldValue ) {

                // 2 columns -> 1 column
                if ( '11' === newValue ) {


                // 2 columns -> 2 columns
                } else if ( '13_23' === newValue ) {


                // 2 columns -> 3 columns
                } else if ( '13_13_13' === newValue ) {

                }

            } else if ( '13_23' === oldValue ) {

                // 2 column -> 1 column
                if ( '11' === newValue ) {

                // 2 column -> 2 columns
                } else if ( '23_13' === newValue ) {

                // 2 column -> 3 columns
                } else if ( '13_13_13' === newValue ) {

                }

            } else if ( '13_13_13' === oldValue ) {

                // 3 column -> 1 column
                if ( '11' === newValue ) {


                // 3 column -> 2 columns
                } else if ( '23_13' === newValue ) {


                // 3 column -> 2 columns
                } else if ( '13_23' === newValue ) {

                }
            }
        },



        changeInnerRowInnerColumns: function( oldValue, innerValue ) {

        }


    };

    tdcSidebar.init();

})( jQuery, _ );