xquery version "1.0-ml";

(:~
 This module generates the OpenAPI JSON document for the OpenAPI display.
 @author Loren Cahlander
 @version 1.0
 @since 1.0
 @return the OpenAPI JSON document for the OpenAPI display
 @see https://github.com/OAI/OpenAPI-Specification
 @see https://github.com/lcahlander/xqdoc
 :)
declare namespace xqdoc="http://www.xqdoc.org/1.0";

declare function local:get-restxq-parameter-description($function as node(), $literal as node())
as xs:string
{
  let $param-name := fn:substring-after(fn:substring-before(xs:string($literal), "}"), "{")
  return local:get-restxq-string-parameter-description($function, $param-name)
};

declare function local:get-restxq-string-parameter-description($function as node(), $param-name as xs:string)
as xs:string
{
  let $param := $function/xqdoc:comment/xqdoc:param[fn:starts-with(., $param-name)]/text()
  
  return 
    if ($param)
    then replace(fn:substring-after($param, $param-name),'^\s+','')
    else ""
};

declare function local:get-restxq-function($function as node()) {
let $path := $function//xqdoc:annotation[@name = "rest:path"]/xqdoc:literal/text()
let $path-parameters := 
  for $token in fn:tokenize($path, "[{{}}]")[fn:starts-with(., "$")]
  return if (fn:contains($token, "=")) then fn:substring-before($token, "=") else $token

return 
  object-node {
    $path : 
      object-node {
       $function//xqdoc:annotation[@name = ("rest:GET", "rest:HEAD", "rest:PUT", "rest:POST", "rest:DELETE", "rest:OPTIONS", "rest:PATCH")]/@name/fn:lower-case(fn:substring-after(., ":"))
       : object-node {
         "description" : fn:string-join($function/xqdoc:comment/xqdoc:description/text()),
         "responses" : object-node {
             for $producer in $function//xqdoc:annotation[fn:starts-with(@name, "rest:produces")]
             return 
               for $literal in $producer/xqdoc:literal
               return xs:string($literal) : object-node { }    
         },
         "parameters": 
           array-node {
             for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:query-param")]
             return
               object-node {
                 "name" : $param/xqdoc:literal[1]/text(),
                 "in" : "query",
                 "description" : local:get-restxq-parameter-description($function, $param/xqdoc:literal[2])
               },
             for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:header-param")]
             return
               object-node {
                 "name" : $param/xqdoc:literal[1]/text(),
                 "in" : "header",
                 "description" : local:get-restxq-parameter-description($function, $param/xqdoc:literal[2])
               },
             for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:cookie-param")]
             return
               object-node {
                 "name" : $param/xqdoc:literal[1]/text(),
                 "in" : "cookie",
                 "description" : local:get-restxq-parameter-description($function, $param/xqdoc:literal[2])
               },
             for $param in $path-parameters
             return
               object-node {
                 "name" : fn:substring($param, 2),
                 "in" : "path",
                 "description" : local:get-restxq-string-parameter-description($function, $param)
               }
           }
       }
      }
  }
};


let $services := fn:collection("xqdoc")/xqdoc:xqdoc[xqdoc:functions/xqdoc:function/xqdoc:comment/xqdoc:custom/@tag = 'openapi']
let $base := fn:doc("/xqDoc/openapi.json")

let $service-output :=
  for $service in $services
let $name := fn:substring-before(fn:reverse(fn:tokenize(fn:base-uri($service), '/'))[1], ".xml")
let $service-doc-comment := $service/xqdoc:module/xqdoc:comment
let $service-doc-description := $service-doc-comment/xqdoc:description/text()
let $service-openapi-component := $service-doc-comment/xqdoc:custom[@tag = 'openapi']/text()

let $endpoints := 
    for $endpoint in $service//xqdoc:function[xqdoc:name = ('get', 'put', 'post', 'delete')][fn:not(xqdoc:comment/xqdoc:custom/@tag = "openapi-ignore")]
    let $http-name := $endpoint/xqdoc:name/text()
    let $http-doc-comment := $endpoint/xqdoc:comment
    let $http-doc-description := fn:normalize-space($http-doc-comment/xqdoc:description/text())
    let $http-doc-return-description := $http-doc-comment/xqdoc/return/text()
    let $return-type := $endpoint/xqdoc:return/xqdoc:type/text()
    let $return-occurence := xs:string($endpoint/xqdoc:return/xqdoc:type/@occurence)
    let $openapi-component := $http-doc-comment/xqdoc:custom[@tag = 'openapi']/text()
    return if (fn:exists($openapi-component)) then """" || $http-name ||  """: {      ""description"": """ || $http-doc-description || """" || "," || fn:string-join($openapi-component) || "}" else ()
order by $name
return """/" || $name || """: {" || fn:string-join($endpoints, ",") || "}"
let $myobj := xdmp:from-json-string("{" || fn:string-join($service-output, ",") || "}")
return object-node { 
    "openapi" : "3.0.0", 
    "info" : $base/info, 
    "servers" : array-node { $base/servers }, 
    "paths" : $myobj, 
    "components" : $base/components
    }