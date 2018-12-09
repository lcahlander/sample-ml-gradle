import { PolymerElement, html } from "../../node_modules/@polymer/polymer/polymer-element.js";
/**
 * @customElement
 * @polymer
 */

class XQDocComment extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        }
    </style>
    <template is="dom-if" if="[[comment]]">
    <div>[[comment.description]]</div>
    <ul>
      <template is="dom-repeat" items="{{comment.authors}}">
        <li><b>author</b> [[item]]</li>
      </template>
      <template is="dom-repeat" items="{{comment.versions}}">
        <li><b>version</b> [[item]]</li>
      </template>
      <template is="dom-repeat" items="{{comment.errors}}">
        <li><b>error</b> [[item]]</li>
      </template>
      <template is="dom-repeat" items="{{comment.deprecated}}">
        <li><b>deprecated</b> [[item]]</li>
      </template>
      <template is="dom-repeat" items="{{comment.see}}">
        <li><b>see</b> [[item]]</li>
      </template>
      <template is="dom-repeat" items="{{comment.since}}">
        <li><b>since</b> [[item]]</li>
      </template>
    </ul>
    </template>
    `;
  }

  static get properties() {
    return {
      comment: {
        type: Object,
        notify: true
      }
    };
  }

}

window.customElements.define('xqdoc-comment', XQDocComment);