import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';

/**
 * @customElement
 * @polymer
 */
class ImportDetail extends PolymerElement {
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
      <paper-card>
        <div class="card-content">
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

window.customElements.define('import-detail', ImportDetail);
