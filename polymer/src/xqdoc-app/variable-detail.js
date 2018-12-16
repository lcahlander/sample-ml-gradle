import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import './xqdoc-comment.js';
import './hash-button.js';

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
            <hash-button name="[[item.name]]" hash="{{hash}}"></hash-button>
          </template>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      item: { type: Object, notify: true },
      hash: { type: String, notify: true }
    };
  }

}

window.customElements.define('variable-detail', VariableDetail);
