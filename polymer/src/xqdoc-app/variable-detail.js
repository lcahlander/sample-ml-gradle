import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import '@polymer/paper-toolbar/paper-toolbar.js';
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
        <div class="card-content">
          <paper-toolbar>
            <span slot="top" class="title">$[[item.name]]</span>
            <paper-toggle-button slot="top" checked="{{showDetail}}">Detail</paper-toggle-button>
          </paper-toolbar>
          <xqdoc-comment show-detail="[[showDetail]]" show-health="[[showHealth]]" comment="[[item.comment]]" parameters="[[item.parameters]]" return="[[item.return]]"></xqdoc-comment>
          <iron-collapse id="detailCollapse" opened="{{showDetail}}">
            <div class="conceptcard">
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
          </iron-collapse>
        </div>
      </paper-card>
    `;
  }
  static get properties() {
    return {
      item: { type: Object, notify: true },
      showDetail: {
        type: Boolean,
        value: false,
        notify: true
      },
      showHealth: { type: Boolean, notify: true },
      params: { type: Object, notify: true },
      hash: { type: String, notify: true }
    };
  }

}

window.customElements.define('variable-detail', VariableDetail);
