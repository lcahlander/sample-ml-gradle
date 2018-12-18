import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import 'polymer-code-highlighter/code-highlighter.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-toolbar/paper-toolbar.js';
import '@polymer/paper-button/paper-button.js';
import './xqdoc-comment.js';

/**
 * @customElement
 * @polymer
 */
class XQDocModule extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        }
      paper-card {
        width: 100%;
      }
      expanded-card {
        padding-top: 1px;
        padding-bottom: 1px;
      }
      paper-toggle-button {
        margin-right: 10px;
      }
      .card-content {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 10px;
      }
    </style>
    <paper-card>
      <paper-toolbar>
        <span slot="top" class="title">[[item.uri]]</span>
        <paper-toggle-button slot="top" checked="{{showDetail}}">Detail</paper-toggle-button>
        <paper-toggle-button slot="top" checked="{{showCode}}">Code</paper-toggle-button>
      </paper-toolbar>
      <div class="card-content">
        <xqdoc-comment show-detail="[[showDetail]]" show-health="[[showHealth]]" comment="[[item.comment]]"></xqdoc-comment>
        <iron-collapse id="contentCollapse" opened="{{showCode}}">
          <div class="conceptcard">
            <code-highlighter>[[item.body]]</code-highlighter>
          </div>
        </iron-collapse>
      </div>
    </paper-card>
    `;
  }
  static get properties() {
    return {
      showCode: {
        type: Boolean,
        value: false,
        notify: true
      },
      showDetail: {
        type: Boolean,
        value: false,
        notify: true
      },
      showHealth: { type: Boolean, notify: true },
      item: { type: Object, notify: true }
    };
  }
}

window.customElements.define('xqdoc-module', XQDocModule);
