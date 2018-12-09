import { html, PolymerElement } from "../../node_modules/@polymer/polymer/polymer-element.js";
import "../../node_modules/@polymer/polymer/lib/elements/dom-bind.js";
import "../../node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "../../node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "../../node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "../../node_modules/@polymer/app-layout/app-header/app-header.js";
import "../../node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js";
import "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../../node_modules/@polymer/app-layout/demo/sample-content.js";
import "../../node_modules/@polymer/iron-icons/iron-icons.js";
import "../../node_modules/@polymer/iron-icon/iron-icon.js";
import "../../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../../node_modules/@polymer/paper-item/paper-item.js";
import "../../node_modules/@polymer/paper-card/paper-card.js";
import "../../node_modules/@polymer/paper-listbox/paper-listbox.js";
import "../../node_modules/@polymer/iron-location/iron-location.js";
import "../../node_modules/@polymer/iron-location/iron-query-params.js";
import './module-selector.js';
import './xqdoc-module.js';
import './variable-detail.js';
import './import-detail.js';
import './function-detail.js';
/**
 * @customElement
 * @polymer
 */

class XqdocApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background-color: lightgrey;
          --app-drawer-width: 400px;
        }
        app-drawer-layout {
          background-color: lightgrey;
        }
        section {
          overflow: scroll;
          height: 100%;
          background-color: lightgrey;
        }
        paper-item {
          cursor: pointer;
        }
        paper-card {
          width: 100%;
          font-size: 10px;
          margin: 5px;
        }
      app-toolbar {
        background-color: grey;
        color: #fff;
      }
      </style>
      <iron-location id="sourceLocation" query="{{query}}"></iron-location>
      <iron-query-params id="sourceParams" params-string="{{query}}" params-object="{{params}}"></iron-query-params>
      <iron-ajax auto="true" 
        url="/v1/resources/xqdoc"  
        params="[[params]]"
        handle-as="json"
        last-response="{{result}}"></iron-ajax>
      <app-drawer-layout>
        <app-drawer slot="drawer">
          <app-toolbar>
            <div main-title>Modules</div>
          </app-toolbar>
        <section>
        <paper-listbox attr-for-selected="item-name" selected="{{selectedSuggestionId}}" fallback-selection="None">
          <h3>Libraries</h3>
          <template is="dom-repeat" items="[[result.modules.libraries]]">
            <paper-item item-name="[[item.uri]]">[[item.uri]]</paper-item>
          </template>
          <h3>Mains</h3>
          <template is="dom-repeat" items="[[result.modules.main]]">
            <paper-item item-name="[[item.uri]]">[[item.uri]]</paper-item>
          </template>
        </paper-listbox>
          <div style="margin-bottom:90px;width:100%;"></div>
        </section>
        </app-drawer>
        <app-header-layout>
          <app-header slot="header" reveals effects="waterfall">
          <app-toolbar>
            <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
            <div main-title>xqDoc</div>
          </app-toolbar>
          </app-header>
        <section>
          <template is="dom-if" if="{{result.response.uri}}">
            <xqdoc-module item="{{result.response}}"></xqdoc-module>
            <template is="dom-if" if="{{result.response.variables}}">
              <h3>Variables</h3>
              <template is="dom-repeat" items="{{result.response.variables}}">
                <variable-detail item="{{item}}"></variable-detail>
              </template>
            </template>
            <template is="dom-if" if="{{result.response.imports}}">
              <h3>Imports</h3>
              <template is="dom-repeat" items="{{result.response.imports}}">
                <import-detail item="{{item}}"></import-detail>
              </template>
            </template>
            <template is="dom-if" if="{{result.response.functions}}">
              <h3>Functions</h3>
              <template is="dom-repeat" items="{{result.response.functions}}">
                <function-detail item="{{item}}"></function-detail>
              </template>
            </template>
          </template>
          <paper-card>Created by xqDoc version [[result.response.control.version]] on [[result.response.control.date]]</paper-card>
          <div style="margin-bottom:200px;height:150px;width:100%;"></div>
        </section>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      result: {
        type: Object,
        notify: true
      },
      params: {
        type: Object,
        notify: true
      },
      selectedSuggestionId: {
        type: String,
        notify: true,
        observer: '_moduleSelected'
      }
    };
  }

  _moduleSelected(newValue, oldValue) {
    if (newValue != 'None') {
      var p = this.get('params');

      if (p['rs:module'] != newValue) {
        this.set('params', {
          'rs:module': newValue
        });
        this.notifyPath('params');
      }
    }
  }

}

window.customElements.define('xqdoc-app', XqdocApp);