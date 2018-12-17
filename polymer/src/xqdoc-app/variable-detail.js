import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
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
              <td><xqdoc-comment show-health="[[showHealth]]" comment="[[item.comment]]"></xqdoc-comment></td>
            </tr>
          </table>
          <h4>Functions that reference this Variable</h4>
          <vaadin-grid  theme="compact wrap-cell-content column-borders row-stripes" items="[[item.references]]"  height-by-rows>
            <vaadin-grid-column>
              <template class="header">Module URI</template>
              <template>[[item.uri]]</template>
            </vaadin-grid-column>
            <vaadin-grid-column>
              <template class="header">Function Names</template>
              <template>
                <template is="dom-repeat" items="{{item.functions}}">
                  <hash-button name="[[item.name]]" uri="[[item.uri]]" disabled="[[!item.isReachable]]" params="{{params}}" hash="{{hash}}"></hash-button>
                </template>
              </template>
            </vaadin-grid-column>
          </vaadin-grid>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      item: { type: Object, notify: true },
      showHealth: { type: Boolean, notify: true },
      params: { type: Object, notify: true },
      hash: { type: String, notify: true }
    };
  }

}

window.customElements.define('variable-detail', VariableDetail);
