/**
 * Created by tagdiv on 07.04.2016.
 */

/* global jQuery:{} */
/* global Backbone:{} */
/* global _:{} */

/* global tdcAdminWrapperUI:{} */
/* global tdcOperationUI:{} */
/* global tdcDebug:{} */

/*
 * The Recycle object
 *   - it allows removing 'tdc-element' or 'tdc-element-inner-row' elements from the structure data
 */

var tdcRecycleUI;

(function( jQuery, backbone, _, undefined ) {

    'use strict';

    tdcRecycleUI = {

        _activeClass: 'active',

        _isInitialized: false,



        init: function() {

            // Do nothing if it's already initialized
            if ( tdcRecycleUI._isInitialized ) {
                return;
            }


            tdcAdminWrapperUI.$recycle.mouseup(function( event ) {

                // Respond only if dragged element is 'tdc-element' or 'tdc-element-inner-row', and not 'tdc-sidebar-element'
                if ( ( tdcOperationUI.isElementDragged() || tdcOperationUI.isInnerRowDragged() ) && ! tdcOperationUI.isSidebarElementDragged() ) {
                    //tdcDebug.log( 'recycle mouse up' );

                    event.preventDefault();

                    tdcOperationUI.deactiveDraggedElement();

                    tdcRecycleUI._deactivate();
                }

            }).mouseenter(function(event) {

                // Respond only if dragged element is 'tdc-element' or 'tdc-element-inner-row', and not 'tdc-sidebar-element'
                if ( ( tdcOperationUI.isElementDragged() || tdcOperationUI.isInnerRowDragged() ) && ! tdcOperationUI.isSidebarElementDragged() ) {
                    //tdcDebug.log('recycle mouse enter');

                    event.preventDefault();

                    tdcOperationUI.setCurrentElementOver( tdcAdminWrapperUI.$recycle );
                    tdcRecycleUI._activate();
                }

            }).mouseleave(function(event) {

                // Respond only if dragged element is 'tdc-element' or 'tdc-element-inner-row', and not 'tdc-sidebar-element'
                if ( ( tdcOperationUI.isElementDragged() || tdcOperationUI.isInnerRowDragged() ) && ! tdcOperationUI.isSidebarElementDragged() ) {
                    //tdcDebug.log('recycle mouse leave');

                    event.preventDefault();

                    tdcOperationUI.setCurrentElementOver( undefined );
                    tdcRecycleUI._deactivate();
                }
            });

            tdcRecycleUI._isInitialized = true;
        },


        _activate: function() {
            tdcAdminWrapperUI.$recycle.parent().addClass( tdcRecycleUI._activeClass );
        },


        _deactivate: function() {
            tdcAdminWrapperUI.$recycle.parent().removeClass( tdcRecycleUI._activeClass );
        }

    };

})( jQuery, Backbone, _ );