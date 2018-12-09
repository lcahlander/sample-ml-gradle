import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@intcreator/markdown-element';

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
    <markdown-element markdown="[[comment.description]]"></markdown-element>
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
      <template is="dom-repeat" items="{{parameters}}">
        <li><b>parameter</b> $[[item.name]] - [[item.type]]
            <template is="dom-if" if="[[item.occurrence]]">
            [[item.occurrence]]
            </template>
        </li>
      </template>
      <template is="dom-if" if="[[return]]">
        <li><b>return</b> [[return.type]]
          <template is="dom-if" if="[[return.occurrence]]">
          [[return.occurrence]]
          </template>
          <template is="dom-if" if="[[comment.return]]">
          - [[comment.return]]
          </template>
        </li>
      </template>
    </ul>
    </template>
    `;
  }
  static get properties() {
    return {
      comment: { type: Object },
      parameters: { type: Array },
      return: { type: Object }
    };
  }

}

window.customElements.define('xqdoc-comment', XQDocComment);
