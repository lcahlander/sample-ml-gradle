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
          <table>
            <tr>
              <td>$[[item.name]]</td>
              <td><xqdoc-comment comment="[[item.comment]]"></xqdoc-comment></td>
            </tr>
          </table>
          <h4>Functions that reference this Variable</h4>
          <table width="100%">
            <tr>
              <th>Module URI</th>
              <th>Function Name</th>
            </tr>
            <template is="dom-repeat" items="{{item.references}}">
              <tr>
                <td>[[item.uri]]</td>
                <td>
                  <template is="dom-repeat" items="{{item.functions}}">
                    <template is="dom-if" if="[[item.isInternal]]">
                      <hash-button name="[[item.name]]" uri="[[item.uri]]" disabled="[[!item.isReachable]]" params="{{params}}" hash="{{hash}}"></hash-button>
                    </template>
                  </template>
                </td>
              </tr>
            </template>
          </table>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      item: { type: Object, notify: true },
      params: { type: Object, notify: true },
      hash: { type: String, notify: true }
    };
  }

}

window.customElements.define('variable-detail', VariableDetail);
