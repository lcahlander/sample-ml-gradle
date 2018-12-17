import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';

/**
 * @customElement
 * @polymer
 */
class HashButton extends PolymerElement {
  static get template() {
    return html`
    <style>
    paper-button {
      padding-top: 4px;
      padding-bottom: 3px;
    }
    </style>
    <paper-button disabled="[[disabled]]" raised on-click="selectLink">[[name]]</paper-button>
    `;
  }
  static get properties() {
    return {
      name: { type: String, notify: true },
      uri: { type: String, notify: true  },
      disabled: { type: Boolean, value: false },
      params: { type: Object, notify: true },
      hash: { type: String, notify: true }
    };
  }

  selectLink() {
    this.hash = this.name;
    if (this.params.module != this.uri) {
      this.params.module = this.uri;
    }
  }

}

window.customElements.define('hash-button', HashButton);
