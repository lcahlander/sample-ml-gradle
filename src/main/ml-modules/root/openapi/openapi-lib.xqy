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
module namespace openapi = "http://www.xqdoc.org/library/openapi";

declare namespace xqdoc="http://www.xqdoc.org/1.0";

declare variable $openapi:restxq-http-types := ("rest:GET", "rest:HEAD", "rest:PUT", "rest:POST", "rest:DELETE", "rest:OPTIONS", "rest:PATCH");


declare function openapi:get-restxq-parameter-description($function as node(), $literal as node())
as xs:string
{
  let $param-name := fn:substring-after(fn:substring-before(xs:string($literal), "}"), "{")
  return openapi:get-restxq-string-parameter-description($function, $param-name)
};

declare function openapi:get-restxq-string-parameter-description($function as node(), $param-name as xs:string)
as xs:string
{
  let $param := $function/xqdoc:comment/xqdoc:param[fn:starts-with(., $param-name)]/text()
  
  return 
    if ($param)
    then replace(fn:substring-after($param, $param-name),'^\s+','')
    else ""
};

declare function openapi:get-restxq-function($function as node()) {
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
                 "description" : openapi:get-restxq-parameter-description($function, $param/xqdoc:literal[2])
               },
             for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:header-param")]
             return
               object-node {
                 "name" : $param/xqdoc:literal[1]/text(),
                 "in" : "header",
                 "description" : openapi:get-restxq-parameter-description($function, $param/xqdoc:literal[2])
               },
             for $param in $function//xqdoc:annotation[fn:starts-with(@name, "rest:cookie-param")]
             return
               object-node {
                 "name" : $param/xqdoc:literal[1]/text(),
                 "in" : "cookie",
                 "description" : openapi:get-restxq-parameter-description($function, $param/xqdoc:literal[2])
               },
             for $param in $path-parameters
             return
               object-node {
                 "name" : fn:substring($param, 2),
                 "in" : "path",
                 "description" : openapi:get-restxq-string-parameter-description($function, $param)
               }
           }
       }
      }
  }
};

declare function openapi:get-restxq-path($restxq-docs as node()*, $path as xs:string) {

  let $functions := $restxq-docs//xqdoc:function[xqdoc:annotations/xqdoc:annotation[@name = "rest:path"][xqdoc:literal = $path]]
  let $services := for $function in $functions
                  return openapi:get-restxq-function($function)
  return

()
};

declare function openapi:get-rest-services-function($function as node()) {
  ()
};
