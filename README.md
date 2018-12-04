# sample-ml-gradle

A sample ml-gradle project that shows xqDoc and OpenAPI

This project contains the instructions to create an ml-gradle project with MarkLogic custom rest endpoints.

## 1. Create an ml-gradle project

Follow the instructions to create an [ml-gradle](https://github.com/marklogic-community/ml-gradle) project.  The values
for this particular project are:


|  |  |
|--|--|
| Application name  | gradle-xqdoc  |
| rest port | 8012 |
| test rest port | 8013 |

## 2. Modify the build.gradle

Here is the `build.gradle` from this project

```gradle
import org.apache.tools.ant.filters.BaseFilterReader

buildscript {
    repositories {
        jcenter()
    }

    dependencies {
        classpath "org.xqdoc:xqdoc:1.9.4"
    }
}

plugins {
  id "net.saliman.properties" version "1.4.6"
  id "com.marklogic.ml-gradle" version "3.10.0"
}

repositories {
  jcenter()
  maven { url "http://developer.marklogic.com/maven2/" }
  maven { url "http://repository.cloudera.com/artifactory/cloudera-repos/" }
}

configurations {
  mlcp {
    resolutionStrategy {
      force "xml-apis:xml-apis:1.4.01"
    }
  }
}

dependencies {
    mlcp "com.marklogic:mlcp:9.0.6"
    mlcp files("marklogic/lib")
}

class XQDocFilter extends BaseFilterReader {
    XQDocFilter(Reader input) {
        super(new StringReader(new org.xqdoc.MarkLogicProcessor().process(input.text)))
    }
}

task generateXQDocs(type: Copy) {
  into 'xqDoc'
  from 'src/main/ml-modules'
  include '**/*.xqy'
  rename { it - '.xqy' + '.xml' } 
  includeEmptyDirs = false
  filter XQDocFilter
}

 task importXQDoc(type: com.marklogic.gradle.task.MlcpTask) {
  classpath = configurations.mlcp
  command = "IMPORT"
  database = "gradle-xqdoc-content"
  input_file_path = "xqDoc"
  output_collections = "xqdoc"
  output_uri_replace = ".*xqDoc,'/xqDoc'"
  document_type = "mixed"
}
```

To generate the xqDoc file out of the XQuery source file, we use the gradle copy task with a custom filter.  The key parts are:

- Importing the Ant BaseFilterReader class

```gradle
import org.apache.tools.ant.filters.BaseFilterReader
```

- Get the xqDoc library from the Maven Repository

```gradle
    dependencies {
        classpath "org.xqdoc:xqdoc:1.9.4"
    }
```

- Create the XQDocFilter class

```gradle
class XQDocFilter extends BaseFilterReader {
    XQDocFilter(Reader input) {
        super(new StringReader(new org.xqdoc.MarkLogicProcessor().process(input.text)))
    }
}
```

- Create the filtered copy task to take the XQuery source file and generate the xqDoc file

```gradle
task generateXQDocs(type: Copy) {
  into 'xqDoc'
  from 'src/main/ml-modules'
  include '**/*.xqy'
  rename { it - '.xqy' + '.xml' } 
  includeEmptyDirs = false
  filter XQDocFilter
}
```

This task finds all of the XQuery source files within the `src/main/ml-modules` 
directory and generates corresponding xqDoc files in the `xqDoc` directory with the same relative paths.

There is already a file in the `xqDoc` directory called `openapi.json`.  That will be used in the displaying of the OpenAPI page.

## 3. Create a RESTful Endpoint

Use the `mlCreateResource` gradle task

```
gradle mlCreateResource -PresourceName=stat -PresourceType=xqy
```

This creates an XQuery file `src/main/ml-modules/services/stat.xqy` with the functions `get`, `put`, `post`, and `delete`.  
These are the HTTP operations for the 
[http://localhost:8012/v1/resources/stat](http://localhost:8012/v1/resources/stat) endpoint.

### Adding the xqDoc comments to the source file.

Add the xqDoc comment to the header of the file using the tags described at 
[https://github.com/lcahlander/xqdoc](https://github.com/lcahlander/xqdoc).

```xquery
(:~
  Status API calls
  @author John Q. Public
 :)
module namespace stat = "http://marklogic.com/rest-api/resource/stat";
```
Create an xqDoc comment for each of the HTTP operations.

```xquery
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
```

The first line in the comment is the description of the function.  It is used as both the description in the xqDoc display and the OpenAPI display.

The rest of the xqDoc comment is for the tag `@custom:openapi` which is the JSON content for the OpenAPI 
[Path Item Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#pathItemObject), excluding the description.

For the HTTP operations that are not supported, you can either delete the corresponding functions or add the custom tag `openapi-ignore` and it will 
not display the HTTP operation for the service in the OpenAPI display.

```xquery
(:~
 @custom:openapi-ignore Yes
 :)
```

## 4. Displaying the xqDoc and OpenAPI.

These are the gradle tasks to generate the xqDoc and then load them into the content database.

```gradle generateXQDocs```

```gradle mlDeploy```

```gradle importXQDoc```

- The code to display the xqDoc is in `src/main/ml-modules/root/xqDoc`.  
- The code to display the OpenAPI is in `src/main/ml-modules/root/openapi`.
- The code to generate the JSON for the OpenAPI display is `src/main/ml-modules/root/modules/openapi.xqy`.

To customize the OpenAPI to your project, you will need to edit the `xqDoc/openapi.json` file and add the elements for everything except for the 
[Paths Object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#pathsObject).  That is pulled out of the xqDoc files by the `openapi.xqy` file.

- View xqDoc at [http://localhost:8012/xqDoc](http://localhost:8012/xqDoc)
- View OpenAPI at [http://localhost:8012/openapi/](http://localhost:8012/openapi/)

