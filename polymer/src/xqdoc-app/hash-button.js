import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';

/**
 * @customElement
 * @polymer
 */
class HashButton extends PolymerElement {
  static get template() {
    return html`
    <paper-button raised on-click="selectLink">[[name]]</paper-button>
    `;
  }
  static get properties() {
    return {
      name: { type: String, notify: true },
      hash: { type: String, notify: true }
    };
  }

  selectLink() {
    this.hash = this.name;
  }

}

window.customElements.define('hash-button', HashButton);
