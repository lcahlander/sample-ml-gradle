xquery version "1.0-ml";

declare namespace xqdoc="http://www.xqdoc.org/1.0";

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
(:
let $update := xdmp:node-replace($base/paths, )
:)
return object-node { 
    "openapi" : "3.0.0", 
    "info" : $base/info, 
    "servers" : array-node { $base/servers }, 
    "paths" : $myobj, 
    "components" : $base/components
    }