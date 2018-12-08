import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-layout/demo/sample-content.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/iron-location/iron-location.js';
import '@polymer/iron-location/iron-query-params.js';
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
          <h3>Libraries</h3>
          <template is="dom-repeat" items="{{result.modules.libraries}}">
            <paper-item>{{item.uri}}</paper-item>
          </template>
          <h3>Main</h3>
          <template is="dom-repeat" items="{{result.modules.main}}">
            <paper-item>{{item.uri}}</paper-item>
          </template>
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
          <paper-card>Created by xqDoc version [[result.response.control.version]] on [[result.response.control.date]]</paper-card>
          <div style="margin-bottom:200px;height:150px;width:100%;"></div>
        </section>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }
  static get properties() {
    return {
      result: { type: Object, notify: true },
      params: { type: Object, notify: true }
    };
  }
}

window.customElements.define('xqdoc-app', XqdocApp);
