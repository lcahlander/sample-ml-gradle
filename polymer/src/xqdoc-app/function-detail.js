import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/paper-card/paper-card.js';
import 'polymer-code-highlighter/code-highlighter.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import './xqdoc-comment.js';
import './hash-button.js';

/**
 * @customElement
 * @polymer
 */
class FunctionDetail extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        }
      paper-card {
        width: 100%;
        margin-bottom: 5px;
      }
      .conceptcard {
        background-color: #fafafa;
        border-radius: 3px;
        padding: 5px;
        font-size: 16px;
      }
      .card-content {
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 10px;
      }
      paper-button.label {
        padding: 1px;
      }
      expanded-card {
        padding-top: 1px;
        padding-bottom: 1px;
      }
      code-highlighter {
        overflow: scroll;
      }
      ul.cptInstanceMetadata {
        list-style: none;
      }
    </style>
      <paper-card>
        <div class="card-content">
          <h3>[[item.name]]</h3>
          <xqdoc-comment comment="[[item.comment]]" parameters="[[item.parameters]]" return="[[item.return]]"></xqdoc-comment>
          <code-highlighter>[[item.signature]]</code-highlighter>
          <template is="dom-if" if="{{_showInvoked(item)}}">
          <h4>Functions that are invoked in this function</h4>
          <table width="100%">
            <tr>
              <th>Module URI</th>
              <th>Function Name</th>
            </tr>
            <template is="dom-repeat" items="{{item.invoked}}">
              <tr>
                <td>[[item.uri]]</td>
                <td>
                  <template is="dom-repeat" items="{{item.functions}}">
                    <hash-button name="[[item.name]]" uri="[[item.uri]]" disabled="[[!item.isReachable]]" params="{{params}}" hash="{{hash}}"></hash-button>
                  </template>
                </td>
              </tr>
            </template>
          </table>
          </template>
          <template is="dom-if" if="{{_showRefVariables(item)}}">
          <h4>Variables that are referred to in this function</h4>
          <table width="100%">
            <tr>
              <th>Module URI</th>
              <th>Variable Name</th>
            </tr>
            <template is="dom-repeat" items="{{item.refVariables}}">
              <tr>
                <td>[[item.uri]]</td>
                <td>
                  <template is="dom-repeat" items="{{item.variables}}">
                    <paper-button noink>$[[item.name]]</paper-button>
                  </template>
                </td>
              </tr>
            </template>
          </table>
          </template>
          <template is="dom-if" if="{{_showReferences(item)}}">
          <h4>Functions that are invoke this function</h4>
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
                    <hash-button name="[[item.name]]" uri="[[item.uri]]" disabled="[[!item.isReachable]]" params="{{params}}" hash="{{hash}}"></hash-button>
                  </template>
                </td>
              </tr>
            </template>
          </table>
          </template>
          <paper-icon-button on-tap="toggleExpand" class="self-end" id="expandButton"></paper-icon-button>
          <paper-button on-tap="toggleExpand" id="expandText">Show details</paper-button>
          <iron-collapse id="contentCollapse" opened="{{expanded}}">
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
      expanded: {
        type: Boolean,
        value: false,
        notify: true,
        observer: '_expandedChanged'
      },
      item: { type: Object, notify: true },
      params: { type: Object, notify: true },
      hash: { type: String, notify: true, observer: "_hashChanged" }
    };
  }

    // Fires when the local DOM has been fully prepared
    ready() {
      super.ready();
    //Set initial icon
      if(this.expanded) {
        this.$.expandButton.icon = "icons:expand-less";
        this.$.expandText.innerHTML = "Hide details";
      }
      else {
        this.$.expandButton.icon = "icons:expand-more";
        this.$.expandText.innerHTML = "Show details";
      }
    }

    _showInvoked(item) {
      if (item.invoked.length > 0) {
        return true;
      } else {
        return false;
      }
    }

    _showRefVariables(item) {
      if (item.refVariables.length > 0) {
        return true;
      } else {
        return false;
      }
    }

    _showReferences(item) {
      if (item.references.length > 0) {
        return true;
      } else {
        return false;
      }
    }

    // Fires when an attribute was added, removed, or updated
    _hashChanged(newVal, oldVal) {
      if (newVal && newVal == this.item.name) {
        
      }
    }
    // Fires when an attribute was added, removed, or updated
    _expandedChanged(newVal, oldVal) {
    
      //If icon is already set no need to animate!
      if((newVal && (this.$.expandButton.icon == "icons:expand-less")) || (!newVal && (this.$.expandButton.icon == "icons:expand-more"))) {
        return;
      }
      
      if(this.expanded) {
        this.$.expandButton.icon = "icons:expand-less";
        this.$.expandText.innerHTML = "Hide details";
      } else {
        this.$.expandButton.icon = "icons:expand-more";
        this.$.expandText.innerHTML = "Show details";
      }
    }
    toggleExpand(e) {
      this.expanded = !this.expanded;
    }

}

window.customElements.define('function-detail', FunctionDetail);
