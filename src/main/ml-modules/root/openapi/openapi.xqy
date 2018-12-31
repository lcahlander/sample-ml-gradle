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
 
import module namespace admin = "http://marklogic.com/xdmp/admin" at "/MarkLogic/admin.xqy";
import module namespace services2openapi="http://xqdoc.org/library/services/xqdoc/openapi" at "services2xqdoc2openapi-lib.xqy";
import module namespace xqrs2openapi="http://xqdoc.org/library/xqrs/xqdoc/openapi" at "xqrs2xqdoc2openapi-lib.xqy";
import module namespace rxq2openapi="http://xqdoc.org/library/rxq/xqdoc/openapi" at "rxq2xqdoc2openapi-lib.xqy";

let $base := fn:doc("/xqDoc/openapi.json")
let $config := admin:get-configuration()
let $rewriter :=   admin:appserver-get-url-rewriter($config, xdmp:server())


let $paths-object := 
	if (fn:ends-with($rewriter, "xqrs.xqy"))
	then 
		xdmp:to-json(xqrs2openapi:process-xqrs-to-xqDoc-to-OpenAPI())
	else if (fn:ends-with($rewriter, "rxq-rewriter.xqy"))
	then 
		xdmp:to-json(rxq2openapi:process-rxq-to-xqDoc-to-OpenAPI())
	else 
		services2openapi:process-services-to-xqDoc-to-OpenAPI()

return object-node { 
    "openapi" : "3.0.0", 
    "info" : $base/info, 
    "servers" : array-node { $base/servers }, 
    "paths" : $paths-object, 
    "components" : $base/components
    }
 