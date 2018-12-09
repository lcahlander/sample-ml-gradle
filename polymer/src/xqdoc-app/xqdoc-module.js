import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
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
      .card-content {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 10px;
      }
    </style>
      <h3>Module</h3>
      <paper-card>
        <div class="card-content">
          <h2>[[item.uri]]</h2>
          <xqdoc-comment comment="[[item.comment]]"></xqdoc-comment>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      item: { type: Object, notify: true }
    };
  }

}

window.customElements.define('xqdoc-module', XQDocModule);
