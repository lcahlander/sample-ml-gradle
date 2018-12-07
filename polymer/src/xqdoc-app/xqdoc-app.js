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
        }
      </style>
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
          <div style="margin-bottom:200px;height:150px;width:100%;"></div>
        </section>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }
  static get properties() {
    return {
    };
  }
}

window.customElements.define('xqdoc-app', XqdocApp);
