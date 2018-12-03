xquery version "1.0-ml";

(:~
  Status API calls
  @author John Q. Public
 :)
module namespace resource = "http://marklogic.com/rest-api/resource/stat";

(:~
  Gets the status of the system
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
        "operationId": "GET_status",
        "parameters": [
          {
            "name": "id",
            "in": "query",
            "description": "Get all statuses created by the user.",
            "schema": {
              "type": "string"
            }
          }
        ]
 :)
declare function get(
  $context as map:map,
  $params  as map:map
  ) as document-node()*
{
  let $_ := xdmp:log("GET called")
  return document { <status>online</status> }
};

(:~
 @custom:openapi-ignore Yes
 :)
declare function put(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
  ) as document-node()?
{
  xdmp:log("PUT called")
};

(:~
 @custom:openapi-ignore Yes
 :)
declare function post(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
  ) as document-node()*
{
  xdmp:log("POST called")
};

(:~
 @custom:openapi-ignore Yes
 :)
declare function delete(
  $context as map:map,
  $params  as map:map
  ) as document-node()?
{
  xdmp:log("DELETE called")
};
