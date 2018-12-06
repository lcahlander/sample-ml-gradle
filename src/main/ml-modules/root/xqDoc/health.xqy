xquery version "1.0-ml";

declare namespace xqdoc="http://www.xqdoc.org/1.0";

element { 'health' } {
for $doc in fn:collection("xqdoc")/xqdoc:xqdoc
let $path := xs:string(fn:base-uri($doc))
let $services := if (fn:starts-with($path, "/xqDoc/services/")) then fn:true() else fn:false()
let $module-comment := $doc/xqdoc:module/xqdoc:comment
order by $path
return 
  element { 'module' } {
    element { 'path' } { fn:replace($path, ".xml", ".xqy") },
    element { 'has-xqdoc-comment' } { fn:exists($module-comment)},
    element { 'has-xqdoc-comment-description' } { (fn:string-length($module-comment/xqdoc:description) gt 0) },
    if ($doc//xqdoc:functions)
    then
      element { 'functions' } {
        for $function in $doc//xqdoc:function
        let $name := $function/xqdoc:name/text()
        let $function-comment := $function/xqdoc:comment
        let $missing-openapi := if ($services and (('get', 'put', 'post', 'delete') = $name)) then if (fn:exists($function-comment/xqdoc:custom[@tag = ("openapi", "openapi-ignore")])) then () else element { 'missing-openapi'} { fn:true() } else ()
        let $function-comment-params := $function-comment/xqdoc:param
        let $function-comment-return := $function-comment/xqdoc:return
        let $function-params := $function/xqdoc:parameters/xqdoc:parameter
        let $function-return := $function/xqdoc:return
        let $dollared-params := 
          for $param in $function-params/xqdoc:name/text() 
          return "$" || $param
        let $excess-comment-params := (: if ($dollared-params) then $function-comment-params[fn:not(fn:starts-with(., $dollared-params))] else :) ()
        order by $name
        return
          element { 'function' } {
            element { 'name' } { $name },
            $missing-openapi,
            element { 'has-xqdoc-comment' } { fn:exists($function-comment)},
            element { 'has-xqdoc-comment-description' } { (fn:string-length($function-comment/xqdoc:description) gt 0) },
            if (fn:exists($function-params))
            then
              element { 'parameters' } {
                for $param in $function-params
                return 
                  element { 'parameter' } {
                      attribute { 'name' } { $param/xqdoc:name/text() },
                      if (fn:exists($param/xqdoc:type))
                      then (
                        attribute { 'has-type' } { fn:true() },
                        attribute { 'type' } { $param/xqdoc:type/text() },
                        $param/xqdoc:type/@occurrence
                      )
                      else
                        attribute { 'has-type' } { fn:false() },
                        $function-comment-params[fn:starts-with(., "$" || $param/xqdoc:name/text())]/text()
                  }
              }
            else (),
            if (fn:exists($excess-comment-params))
            then
              element { 'excess-params' } {
                for $param in $excess-comment-params
                return element { 'param' } { $param/text() }
              }
            else (),
            element { 'return' } {
              if (fn:exists($function-return/xqdoc:type))
              then (
                attribute { 'has-return-type' } { fn:true() },
                attribute { 'type' } { $function-return/xqdoc:type/text() },
                $function-return/xqdoc:type/@occurrence
              )
              else 
                attribute { 'has-return-type' } { fn:false() },
                $function-comment-return/text()
            },
            ()
          }
      
      }
    else ()
  }
}
