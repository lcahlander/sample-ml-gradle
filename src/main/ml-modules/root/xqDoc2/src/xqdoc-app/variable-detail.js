import { PolymerElement, html } from "../../node_modules/@polymer/polymer/polymer-element.js";
import "../../node_modules/@polymer/paper-card/paper-card.js";
import './xqdoc-comment.js';
/**
 * @customElement
 * @polymer
 */

class VariableDetail extends PolymerElement {
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
          <div>[[item.name]]</div>
          <xqdoc-comment comment="[[item.comment]]"></xqdoc-comment>
          <template is="dom-repeat" items="{{item.references}}">
            <div><a name$="[[item.name]]">[[item.name]]</a></div>
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

window.customElements.define('variable-detail', VariableDetail);