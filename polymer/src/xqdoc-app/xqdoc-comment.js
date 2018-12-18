import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@polymer/iron-collapse/iron-collapse.js';
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
    <template is="dom-if" if="[[!comment]]">
      <template is="dom-if" if="[[showHealth]]">
        <h1>NO COMMENT<h1>
      </template>
    </template>
    <template is="dom-if" if="[[comment]]">
      <markdown-element markdown="[[comment.description]]"></markdown-element>
      <iron-collapse id="detailCollapse" opened="{{showDetail}}">
        <div class="conceptcard">
          <template is="dom-if" if="{{_showCommentDetails(comment)}}">
            <vaadin-grid  theme="compact wrap-cell-content column-borders row-stripes" items="{{_listDetail(comment)}}"  height-by-rows>
              <vaadin-grid-column>
                <template class="header">Type</template>
                <template>[[item.name]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Comment</template>
                <template><markdown-element markdown="[[item.comment]]"></markdown-element></template>
              </vaadin-grid-column>
            </vaadin-grid>
          </template>
          <template is="dom-if" if="{{_showParameters(parameters)}}">
            <h2>Parameters</h2>
            <vaadin-grid  theme="compact wrap-cell-content column-borders row-stripes" items="{{_listParameters(comment.params, parameters)}}"  height-by-rows>
              <vaadin-grid-column>
                <template class="header">Parameter</template>
                <template>[[item.name]]</template>
                </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Data Type</template>
                <template>[[item.type]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Occurrence</template>
                <template>[[item.occurrence]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Comment</template>
                <template><markdown-element markdown="[[item.comment]]"></markdown-element></template>
              </vaadin-grid-column>
            </vaadin-grid>
          </template>
          <template is="dom-if" if="{{_showReturn(comment.return, return)}}">
            <h2>Return</h2>
            <vaadin-grid  theme="compact wrap-cell-content column-borders row-stripes" items="{{_listReturn(comment.return, return)}}"  height-by-rows>
              <vaadin-grid-column>
                <template class="header">Data Type</template>
                <template>[[item.type]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Occurrence</template>
                <template>[[item.occurrence]]</template>
              </vaadin-grid-column>
              <vaadin-grid-column>
                <template class="header">Comment</template>
                <template><markdown-element markdown="[[item.comment]]"></markdown-element></template>
              </vaadin-grid-column>
            </vaadin-grid>
          </template>
        </div>
      </iron-collapse>
    </template>
    `;
  }
  static get properties() {
    return {
      comment: { type: Object },
      showHealth: { type: Boolean, notify: true },
      showDetail: {
        type: Boolean,
        notify: true
      },
      parameters: { type: Array },
      return: { type: Object }
    };
  }

  _showParameters(parameters) {
      if (parameters.length > 0) {
        return true;
      } else {
        return false;
      }
  }

  _showReturn(comments, returnDescription) {
      if (comments) {
        return true;
      } else if (returnDescription) {
        return true;
      } else {
        return false;
      }
  }

  _showCommentDetails(comment) {
    if ((comment.authors.length + 
         comment.versions.length + 
         comment.errors.length + 
         comment.deprecated.length + 
         comment.see.length + 
         comment.since.length) > 0) {
      return true;
    } else {
      return false;
    }
  }

  _listDetail(comment) {
    var detail = [];
    var idx2 = 0;

    if (comment.authors.length) {
      for (idx2 = 0; idx2 < comment.authors.length; idx2++) {
        detail.push({ name: "Author", comment: comment.authors[idx2] });
      }
    }
    if (comment.versions.length) {
      for (idx2 = 0; idx2 < comment.versions.length; idx2++) {
        detail.push({ name: "Version", comment: comment.versions[idx2] });
      }
    }
    if (comment.errors.length) {
      for (idx2 = 0; idx2 < comment.errors.length; idx2++) {
        detail.push({ name: "Error", comment: comment.errors[idx2] });
      }
    }
    if (comment.deprecated.length) {
      for (idx2 = 0; idx2 < comment.deprecated.length; idx2++) {
        detail.push({ name: "Deprecated", comment: comment.deprecated[idx2] });
      }
    }
    if (comment.see.length) {
      for (idx2 = 0; idx2 < comment.see.length; idx2++) {
        detail.push({ name: "See", comment: comment.see[idx2] });
      }
    }
    if (comment.since.length) {
      for (idx2 = 0; idx2 < comment.since.length; idx2++) {
        detail.push({ name: "Since", comment: comment.since[idx2] });
      }
    }
    return detail;
  }

  _listParameters(comments, parameters) {
    var params = [];

    for (var index = 0; index < parameters.length; index++) {
      var item = parameters[index];
      var param = { name: item.name };

      if (item.type) {
        param.type = item.type;
      }
      if (item.occurrence) {
        param.occurrence = item.occurrence;
      }

      var matchstr = '/\$' + item.name + '\s+';

      if (comments.length) {
        for (var idx2 = 0; idx2 < comments.length; idx2++) {
          var paramc = comments[idx2];
          var theMatch = paramc.match(matchstr);
          if (theMatch) {
            var positiona = theMatch.index;
            var positionb = theMatch[0].length;
            param.comment = paramc.substring(positiona + positionb);
          }

        }
      }
      params.push(param);
    }
    return params;
  }

  _listReturn(comments, returnDescription) {
    var returns = [];
    var returnObject = { };

      if (returnDescription.type) {
        returnObject.type = returnDescription.type;
      }
      if (returnDescription.occurrence) {
        returnObject.occurrence = returnDescription.occurrence;
      }

      if(comments) {
        returnObject.comment = comments;
      }
      returns.push(returnObject);
    return returns;
  }
}

window.customElements.define('xqdoc-comment', XQDocComment);
