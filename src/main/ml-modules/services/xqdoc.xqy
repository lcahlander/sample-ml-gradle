xquery version "1.0-ml";

(:~
  xqDoc display calls
  @author Loren Cahlander
  @version 1.0
  @since 1.0
 :)
module namespace xq = "http://marklogic.com/rest-api/resource/xqdoc";
import module namespace json="http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";
 
declare namespace xqdoc="http://www.xqdoc.org/1.0";

(:~ 
 :  This variable defines the name for the xqDoc collection.
 :  The xqDoc XML for all modules should be stored into the
 :  XML database with this collection value.
 :)
declare variable $xq:XQDOC_COLLECTION as xs:string := "xqdoc"; 

(:~
  @author Loren Cahlander
  @version 1.0
  @since 1.0
 :)
declare function xq:comment($comment as node()?) {
  if ($comment) 
  then 
    object-node { 
      "description" : fn:string-join($comment/xqdoc:description/text(), " "),
      "authors": array-node { $comment/xqdoc:author/text() },
      "versions": array-node { $comment/xqdoc:version/text() },
      "params": array-node { $comment/xqdoc:param/text() },
      "errors": array-node { $comment/xqdoc:error/text() },
      "deprecated": array-node { $comment/xqdoc:deprecated/text() },
      "see": array-node { $comment/xqdoc:see/text() },
      "since": array-node { $comment/xqdoc:since/text() }
    } 
  else fn:false()  
};

(:~
  @author Loren Cahlander
  @version 1.0
  @since 1.0
 :)
declare function xq:functions($functions as node()*, $module-uri as xs:string?) {
  for $function in $functions
  let $name := fn:string-join($function/xqdoc:name/text())
  let $function-comment := $function/xqdoc:comment
  return
    object-node {
      "comment" : xq:comment($function-comment), 
      "name" : $name,
      "signature" : fn:string-join($function/xqdoc:signature/text(), " "),
      "invoked" : array-node { xq:invoked($function/xqdoc:invoked, $module-uri) },
      "refVariables" : array-node { xq:ref-variables($function/xqdoc:ref-variable) },
      "references" : array-node { xq:all-function-references(fn:collection($xq:XQDOC_COLLECTION)/xqdoc:xqdoc/xqdoc:functions/xqdoc:function/xqdoc:invoked[xqdoc:uri = $module-uri][xqdoc:name = $name], $module-uri) }
    }
};

declare function xq:invoked($invokes as node()*, $module-uri as xs:string?) {
  for $invoke in $invokes
  let $uri := $invoke/xqdoc:uri/text()
  let $name := $invoke/xqdoc:name/text()
  return
    object-node {
      "uri" : $uri,
      "name" : $name,
      "isReachable" : 
            if (fn:collection($xq:XQDOC_COLLECTION)/xqdoc:xqdoc[xqdoc:module/xqdoc:uri = $uri][xqdoc:functions/xqdoc:function/xqdoc:name = $name])
            then fn:true()
            else fn:false(),
      "isInternal" :
            if ($invoke/xqdoc:uri/text() = $module-uri)
            then fn:true()
            else fn:false()
    }
};

declare function xq:ref-variables($references as node()*) {
  for $reference in $references
  return
    object-node {
      "uri" : $reference/xqdoc:uri/text(),
      "name" : $reference/xqdoc:name/text()
    }
};

declare function xq:all-variable-references($references as node()*, $module-uri as xs:string?) {
  for $reference in $references
  let $uri := $reference/fn:root()//xqdoc:module/xqdoc:uri/text()
  return 
    object-node { 
      "name" : $reference/../xqdoc:name/text(), 
      "uri": $uri,
      "isInternal" : if ($uri = $module-uri) then fn:true() else fn:false()
    }
};

declare function xq:all-function-references($references as node()*, $module-uri as xs:string?) {
  for $reference in $references
  let $uri := $reference/fn:root()//xqdoc:module/xqdoc:uri/text()
  return 
    object-node { 
      "name" : $reference/../xqdoc:name/text(), 
      "uri": $uri,
      "isInternal" : if ($uri = $module-uri) then fn:true() else fn:false()
    }
};

declare function xq:variables($variables as node()*, $module-uri as xs:string?) {
  for $variable in $variables
  let $uri := $variable/xqdoc:uri/text()
  let $name := $variable/xqdoc:name/text()
  return
    object-node {
      "comment" : xq:comment($variable/xqdoc:comment),
      "uri" : $uri,
      "name" : $name,
      "references" : array-node { xq:all-variable-references(fn:collection($xq:XQDOC_COLLECTION)/xqdoc:xqdoc/xqdoc:functions/xqdoc:function/xqdoc:ref-variable[xqdoc:uri = $uri][xqdoc:name = $name], $module-uri) }
    }
};

declare function xq:imports($imports as node()*) {
  for $import in $imports
  return
    object-node {
      "comment" : xq:comment($import/xqdoc:comment),
      "uri" : $import/xqdoc:uri/text(),
      "type" : xs:string($import/@type)
    }
};

(:~
  Gets the xqDoc of a module as JSON
  @param $context An object containing service request context information
  @param $params  An object containing extension-specific parameter values supplied by the client
  @author Loren Cahlander
  @version 1.0
  @since 1.0
  @custom:openapi
        "responses": {
          "200": {
            "description": "",
            "content": {
              "application/xml": {
                "schema": {
                  "example": "<status>online</status>"
                }
              }
            }
          }
        },
        "operationId": "GET_xqdoc",
        "parameters": [
          {
            "name": "module",
            "in": "query",
            "description": "Get the xqDoc module based on the URI of the module.",
            "schema": {
              "type": "string"
            }
          }
        ]
 :)
declare function xq:get(
  $context as map:map,
  $params  as map:map
  ) as document-node()*
{
  let $_ := xdmp:log("GET called")

  let $moduleURI := xs:string(map:get($params, "module"))
  let $doc := (fn:collection($xq:XQDOC_COLLECTION)/xqdoc:xqdoc[xqdoc:module/xqdoc:uri = $moduleURI], fn:doc($moduleURI)/xqdoc:xqdoc)[1]
  let $module-comment := $doc/xqdoc:module/xqdoc:comment
  return 
    document { 
      object-node {  
        "modules" : object-node {
            "libraries" : array-node {
              for $uri in fn:collection($xq:XQDOC_COLLECTION)/xqdoc:xqdoc/xqdoc:module[@type = "library"]/xqdoc:uri/text()
              order by $uri
              return
                object-node {
                  "uri" : $uri,
                  "selected" : if ($uri = $moduleURI) then fn:true() else fn:false()
                }
            },
            "main" : array-node {
              for $module in fn:collection($xq:XQDOC_COLLECTION)/xqdoc:xqdoc[xqdoc:module/@type = "main"]
              let  $uri := xs:string(fn:base-uri($module))
              order by $uri
              return
                object-node {
                  "uri" : $uri,
                  "selected" : if ($uri = $moduleURI) then fn:true() else fn:false()
                }
            }
          },
        "response" : if ($doc) then object-node {
          "control" : object-node {
                        "date" : $doc/xqdoc:control/xqdoc:date/text(),
                        "version" : $doc/xqdoc:control/xqdoc:version/text()
                      },
          "comment" : xq:comment($module-comment),
          "variables" : array-node { xq:variables($doc/xqdoc:variables/xqdoc:variable, $doc/xqdoc:module/xqdoc:uri/text()) },
          "imports" : array-node { xq:imports($doc/xqdoc:imports/xqdoc:import) },
          "functions" : array-node { xq:functions($doc/xqdoc:functions/xqdoc:function, $doc/xqdoc:module/xqdoc:uri/text()) }
        } else fn:false()
      } 
    }
};

(:~
 @param $context An object containing service request context information
 @param $params  An object containing extension-specific parameter values supplied by the client
 @param $input The data from the request body
 @author Loren Cahlander
 @version 1.0
 @since 1.0
 @custom:openapi-ignore Yes
 :)
declare function xq:put(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
  ) as document-node()?
{
  xdmp:log("PUT called")
};

(:~
 @param $context An object containing service request context information
 @param $params  An object containing extension-specific parameter values supplied by the client
 @param $input The data from the request body
 @author Loren Cahlander
 @version 1.0
 @since 1.0
 @custom:openapi-ignore Yes
 :)
declare function xq:post(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
  ) as document-node()*
{
  xdmp:log("POST called")
};

(:~
 @param $context An object containing service request context information
 @param $params  An object containing extension-specific parameter values supplied by the client
 @author Loren Cahlander
 @version 1.0
 @since 1.0
 @custom:openapi-ignore Yes
 :)
declare function xq:delete(
  $context as map:map,
  $params  as map:map
  ) as document-node()?
{
  xdmp:log("DELETE called")
};
