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
import '@polymer/paper-icon-button/paper-icon-button.js';
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
      <app-drawer-layout>
        <app-drawer slot="drawer">
          <app-toolbar>
            <div main-title>Modules</div>
          </app-toolbar>
        <section>
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
          <xqdoc-module item="{{item}}"></xqdoc-module>
          <template is="dom-repeat" items="{{result.variables}}">
            <variable-detail item="{{item}}"></variable-detail>
          </template>
          <template is="dom-repeat" items="{{result.imports}}">
            <import-detail item="{{item}}"></import-detail>
          </template>
          <template is="dom-repeat" items="{{result.functions}}">
            <function-detail item="{{item}}"></function-detail>
          </template>
          <paper-card>Created by xqDoc version 1.1 on 2018-12-04T07:21:10.778-05:00</paper-card>
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
