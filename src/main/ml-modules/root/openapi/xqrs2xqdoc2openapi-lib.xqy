xquery version "1.0-ml";

(:
 : Module Name: RestXQ (XQRS) Module xqDoc to OpenAPI Display Library Module
 : Module Version: 1.0
 : Date: January 6, 2006
 : Copyright: EasyMetaHub, LLC.
 : Proprietary XQuery Extensions Used: None
 : XQuery Specification: November 2005
 :)

(:~
## RestXQ (XQRS) Module xqDoc to OpenAPI Display

This library module takes the xqDoc files with RestXQ (%rest:xxx) annotations to the 
OpenAPI 3 JSON format for the OpenAPI UI webpage.

 @author Loren Cahlander
 @version 1.0
 @since 1.0
 @return the OpenAPI JSON document for the OpenAPI display
 @see https://github.com/OAI/OpenAPI-Specification
 @see https://github.com/lcahlander/xqdoc
 :)
module namespace xqrs2openapi="http://xqdoc.org/library/xqrs/xqdoc/openapi";

import module namespace json = "http://marklogic.com/xdmp/json"
    at "/MarkLogic/json/json.xqy";
    
declare default element namespace "http://marklogic.com/xdmp/json/basic";
declare namespace xqdoc="http://www.xqdoc.org/1.0";

(:~
The RestXQ annotation names for the various HTTP method
 :)
declare variable $xqrs2openapi:service-names := ("rest:GET", "rest:HEAD", "rest:PUT", "rest:POST", "rest:DELETE", "rest:OPTIONS", "rest:PATCH");

(:~
Strip the curly braces and the dollar sign from the RestXQ annotation literal.

e.g.  {$id} become id
 @param $literal
 @return The name of the parameter
 :)
declare function xqrs2openapi:param-name($literal as node())
as xs:string
{
    fn:substring(fn:substring-after(fn:substring-before(xs:string($literal), "}"), "{"), 2)
};

(:~
 :)
declare function xqrs2openapi:get-parameter-description($function as node(), $literal as node())
as xs:string
{
  let $param-name := fn:substring-after(fn:substring-before(xs:string($literal), "}"), "{")
  return xqrs2openapi:get-string-parameter-description($function, $param-name)
};

(:~
 @param $function The xqDoc element for a function
 @param $param-name
 :)
declare function xqrs2openapi:get-string-parameter-description($function as node(), $param-name as xs:string)
as xs:string
{
  let $param := $function/xqdoc:comment/xqdoc:param[fn:starts-with(., $param-name)]/text()
  
  return 
    if ($param)
    then replace(fn:substring-after($param, $param-name),'^\s+','')
    else ""
};
 
(:~
 @param $type
 :)
declare function xqrs2openapi:schema-object($type as node())
as map:map
{
    let $schema-object := map:map()
    let $_type := 
        if ($type/text() = "map:map")
        then
            let $_ := map:put($schema-object, "type", "array")
            let $items-object := map:map()
            let $_ := (map:put($items-object, "type", "string"), map:put($items-object, "format", "binary"))
            return map:put($schema-object, "items", $items-object)
        else
            let $_ := map:put($schema-object, "type", $type/text())
            let $_card := 
                    switch ($type/@occurrence/string())
                    case "*" return (map:put($schema-object, "minItems", 0))
                    case "+" return (map:put($schema-object, "minItems", 1))
                    case "?" return (map:put($schema-object, "minItems", 0), map:put($schema-object, "maxItems", 1))
                    default return (map:put($schema-object, "minItems", 1), map:put($schema-object, "maxItems", 1))
            return ()
    return $schema-object
};

(:~
 @param $name
 @param $pname
 @param $in
 @param $description
 @param $parameters
 :)
declare function xqrs2openapi:parameter-object(
                    $name as xs:string, 
                    $pname as xs:string, 
                    $in as xs:string, 
                    $description as xs:string?, 
                    $parameters as node()?)
as map:map
{
    let $obj := map:map()
    let $_name := map:put($obj, "name", $name)
    let $_in   := map:put($obj, "in", $in)
    let $_desc := map:put($obj, "description", $description)
    let $_param := 
              if ($parameters/xqdoc:parameter[xqdoc:name = $pname][xqdoc:type])
              then map:put($obj, "schema", xqrs2openapi:schema-object($parameters/xqdoc:parameter[xqdoc:name = $pname]/xqdoc:type))
              else ()
    return $obj
};

(:~
 @param $function The xqDoc element for a function
 @param $path The %rest:path annotation string to extract the path parameters
 @return the OpenAPI JSON for a service object for `get`, `put`, `post`, `delete`
 :)
declare function xqrs2openapi:service-object($function as node()?, $path as xs:string) 
as map:map?
{
  if ($function)
  then 
    let $service-object := map:map()
    let $path-parameters := 
            for $token in fn:tokenize($path, "[{{}}]")[fn:starts-with(., "$")]
            return if (fn:contains($token, "=")) then fn:substring-before($token, "=") else $token

    let $responses-object := map:map()
    let $response-content-object := map:map()
    let $_ := if ($function//xqdoc:annotation[fn:starts-with(@name, "rest:produces")]) then (
        for $producer in $function//xqdoc:annotation[fn:starts-with(@name, "rest:produces")]
        return 
            for $literal in $producer/xqdoc:literal
            let $produces-opject := map:map()
            let $schema-object := map:map()
            let $schema-put := map:put($schema-object, "type", "object")
            let $produces-put := map:put($produces-opject, "schema", $schema-object)
            return map:put($response-content-object, xs:string($literal), $produces-opject),
        map:put($responses-object, "content", $response-content-object)
    ) else ()

    let $tags-array := json:array()
    let $_ := for $tag in $function//xqdoc:custom[@tag = 'openapi-tag']
              let $tag-name := fn:normalize-space($tag/text())
              let $_push := json:array-push($tags-array, $tag-name)
              return ()

    let $request-body := map:map()
    let $request-content-object := map:map()
    let $schema-object := map:map()
    let $items-properties := map:map()
    let $properties-object := map:map()
    let $form-data-properties := map:map()
    let $_ := (
        map:put($items-properties, "type", "string"),
        map:put($items-properties, "format", "binary")
        )
    let $_ :=
        if ($function//xqdoc:annotation[fn:starts-with(@name, "rest:form-param")])
        then 
            (
                for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:form-param")]
                let $form-param-property := map:map()
                let $name := $param/xqdoc:literal[1]/text()
                let $pname := xqrs2openapi:param-name($param/xqdoc:literal[2])
                let $description := map:put($form-param-property, "description", xqrs2openapi:get-parameter-description($function, $param/xqdoc:literal[2]))
                let $type-obj := $function//xqdoc:parameter[xqdoc:name = $pname]/xqdoc:type
                let $_type := switch ($type-obj/text())
                    case "map:map" return
                        (
                            map:put($form-param-property, "type", "array"),
                            map:put($form-param-property, "items", $items-properties)
                        )
                    default return
                        map:put($form-param-property, "type", "string")
                return map:put($properties-object, $name, $form-param-property),
                map:put($schema-object, "properties", $properties-object),
                map:put($schema-object, "type", "object"),
                map:put($form-data-properties, "schema", $schema-object),
                map:put($request-content-object, "multipart/form-data", $form-data-properties),
                map:put($request-body, "content", $request-content-object)
            )
        else 
            if ($function//xqdoc:annotation[fn:starts-with(@name, "rest:consumes")]) 
            then 
                (
                for $consumer in $function//xqdoc:annotation[fn:starts-with(@name, "rest:consumes")]
                return 
                    for $literal in $consumer/xqdoc:literal
                    let $consumes-opject := map:map()
                    let $schema-object := map:map()
                    let $schema-put := map:put($schema-object, "type", "object")
                    let $consumes-put := map:put($consumes-opject, "schema", $schema-object)
                    return map:put($request-content-object, xs:string($literal), $consumes-opject),
                map:put($request-body, "content", $request-content-object)
                ) 
            else ()

    let $parameters-array := json:array()
    let $_ := (
                for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:query-param")]
                let $name := $param/xqdoc:literal[1]/text()
                let $pname := xqrs2openapi:param-name($param/xqdoc:literal[2])
                let $description := xqrs2openapi:get-parameter-description($function, $param/xqdoc:literal[2])
                let $obj := xqrs2openapi:parameter-object($name, $pname, "query", $description, $function//xqdoc:parameters)
                let $_push := json:array-push($parameters-array, $obj)
                return (),
                for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:header-param")]
                let $name := $param/xqdoc:literal[1]/text()
                let $pname := xqrs2openapi:param-name($param/xqdoc:literal[2])
                let $description := xqrs2openapi:get-parameter-description($function, $param/xqdoc:literal[2])
                let $obj := xqrs2openapi:parameter-object($name, $pname, "header", $description, $function//xqdoc:parameters)
                let $_push := json:array-push($parameters-array, $obj)
                return (),
                for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:cookie-param")]
                let $name := $param/xqdoc:literal[1]/text()
                let $pname := xqrs2openapi:param-name($param/xqdoc:literal[2])
                let $description := xqrs2openapi:get-parameter-description($function, $param/xqdoc:literal[2])
                let $obj := xqrs2openapi:parameter-object($name, $pname, "cookie", $description, $function//xqdoc:parameters)
                let $_push := json:array-push($parameters-array, $obj)
                return (),
                for $param in $path-parameters
                let $name := fn:substring($param, 2)
                let $description := xqrs2openapi:get-string-parameter-description($function, $param)
                let $obj := xqrs2openapi:parameter-object($name, $name, "path", $description, $function//xqdoc:parameters)
                let $_push := json:array-push($parameters-array, $obj)
                return ()
    )
    let $_ := (
            map:put($service-object, "description", fn:string-join($function/xqdoc:comment/xqdoc:description/text())),
            map:put($service-object, "responses", $responses-object),
            if (json:array-size($tags-array) gt 0) 
            then map:put($service-object, "tags", $tags-array) 
            else (),
            if (json:array-size($parameters-array) gt 0) 
            then map:put($service-object, "parameters", $parameters-array) 
            else (),
            if ($function//xqdoc:annotation[@name = ("rest:PUT", "rest:POST")] or $function//xqdoc:annotation[fn:starts-with(@name, "rest:form-param")]) 
            then map:put($service-object, "requestBody", $request-body) 
            else ()
    )

    return $service-object
  else ()
};

(:~

 @return the OpenAPI JSON document for the OpenAPI display
 :)
declare function xqrs2openapi:process-xqrs-to-xqDoc-to-OpenAPI()
as map:map
{
let $paths-object := map:map()

let $functions := fn:collection("xqdoc")/xqdoc:xqdoc/xqdoc:functions/xqdoc:function[xqdoc:annotations/xqdoc:annotation[@name = "rest:path"]] 
let $path-names := 
    for $path in fn:distinct-values($functions//xqdoc:annotation[@name = "rest:path"]/xqdoc:literal[1]/text())
    order by $path
    return $path

let $paths := 
    for $path in $path-names    
    let $path-functions := $functions[xqdoc:annotations/xqdoc:annotation[@name = "rest:path"][xqdoc:literal = $path]]
    let $path-object := map:map()
    let $services := (
          if (fn:not($path-functions[xqdoc:annotations/xqdoc:annotation[@name = $xqrs2openapi:service-names]]))
          then 
            let $function := $path-functions[xqdoc:annotations/xqdoc:annotation[fn:not(@name = $xqrs2openapi:service-names)]][1]
            let $service-object := xqrs2openapi:service-object($function, $path)
            return 
              if (fn:exists($service-object))
              then 
                if ($function//xqdoc:annotation[fn:starts-with(@name, "rest:form-param")])
                then map:put($path-object, "post", $service-object)
                else map:put($path-object, "get", $service-object)
              else ()
          else (),
          for $service-name in $xqrs2openapi:service-names
          let $function := $path-functions[xqdoc:annotations/xqdoc:annotation[@name = $service-name]][1]
          let $service-object := xqrs2openapi:service-object($function, $path)
          return 
            if (fn:exists($service-object))
            then map:put($path-object, fn:lower-case(fn:substring-after($service-name, ":")), $service-object)
            else ()
    )
    return map:put($paths-object, fn:replace($path, "\{\$", "{"), $path-object)
return $paths-object
};
