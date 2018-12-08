import { PolymerElement, html } from "../../node_modules/@polymer/polymer/polymer-element.js";
import { GestureEventListeners } from "../../node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js";
import "../../node_modules/@polymer/paper-card/paper-card.js";
import "../../node_modules/@polymer/iron-collapse/iron-collapse.js";
import "../../node_modules/@polymer/iron-icons/iron-icons.js";
import "../../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../../node_modules/@polymer/paper-button/paper-button.js";
import "../../node_modules/@vaadin/vaadin-grid/vaadin-grid.js";
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
      <paper-card>
        <div class="card-content">
          <div>[[item.name]]</div>
          <paper-icon-button on-tap="toggleExpand" class="self-end" id="expandButton"></paper-icon-button>
          <paper-button on-tap="toggleExpand" id="expandText">Show details</paper-button>
          <iron-collapse id="contentCollapse" opened="{{expanded}}">
            <div class="conceptcard">
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
      item: {
        type: Object,
        notify: true
      }
    };
  } // Fires when the local DOM has been fully prepared


  ready() {
    super.ready(); //Set initial icon

    if (this.expanded) {
      this.$.expandButton.icon = "icons:expand-less";
      this.$.expandText.innerHTML = "Hide details";
    } else {
      this.$.expandButton.icon = "icons:expand-more";
      this.$.expandText.innerHTML = "Show details";
    }
  } // Fires when an attribute was added, removed, or updated


  _expandedChanged(newVal, oldVal) {
    //If icon is already set no need to animate!
    if (newVal && this.$.expandButton.icon == "icons:expand-less" || !newVal && this.$.expandButton.icon == "icons:expand-more") {
      return;
    }

    if (this.expanded) {
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