import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import 'polymer-code-highlighter/code-highlighter.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
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
      ul.cptInstanceMetadata {
        list-style: none;
      }
    </style>
      <paper-card><h3>Module</h3></paper-card>
      <paper-card>
        <div class="card-content">
          <h2>[[item.uri]]</h2>
          <xqdoc-comment show-health="[[showHealth]]" comment="[[item.comment]]"></xqdoc-comment>
        </div>
        <paper-icon-button on-tap="toggleExpand" class="self-end" id="expandButton"></paper-icon-button>
        <paper-button on-tap="toggleExpand" id="expandText">Show details</paper-button>
        <iron-collapse id="contentCollapse" opened="{{expanded}}">
          <div class="conceptcard">
            <code-highlighter>[[item.body]]</code-highlighter>
          </div>
        </iron-collapse>
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
      showHealth: { type: Boolean, notify: true },
      item: { type: Object, notify: true }
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

window.customElements.define('xqdoc-module', XQDocModule);
