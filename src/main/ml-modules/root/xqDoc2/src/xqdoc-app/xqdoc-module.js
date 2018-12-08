import { PolymerElement, html } from "../../node_modules/@polymer/polymer/polymer-element.js";
import "../../node_modules/@polymer/paper-card/paper-card.js";
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
      <paper-card>
        <div class="card-content">
          <h2>[[item.uri]]</h2>
          <template is="dom-if" if="[[item.comment]]">
          <div>[[item.comment.description]]</div>
          </template>
        </div>
      </paper-card>
    `;
  }

  static get properties() {
    return {
      item: {
        type: Object,
        notify: true
      }
    };
  }

}

window.customElements.define('xqdoc-module', XQDocModule);