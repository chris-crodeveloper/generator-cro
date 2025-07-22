# Optimizely Generator

This configuarble Yeoman generator scaffolds Optimizely files in your local environment and can create an Optimizley experiment in the tool.

Main features:

- Simple prompts to help build boilerplate templates
- Capability to setup unlimited custom templates
- Build JS, CSS and HTML files
- Extendable to build custom files
- Build new Optimizely experiments within the Optimizely tool, returning all relevant IDs
- Fetch existing Optimizley experiments and build local files accordingly, returning all relevant IDs
- Setup template variables to work with local files or a local server

## Getting Started

These instructions will help you install and configure the generator.

### Prerequisites

What things you need to install the software and how to install them

```
Node v18
```

### Installing

Install the npm package

```
npm i -g yo@5.0.0
npm i 
```

### Configuration File

After installation the configuration file `genopti.config.js` will have been added to the root of your project. This file is required to setup Optimizely configuartion, custom files and default values. This file is intended to be used for all dvelopers in the project and saved to source control.

#### Optimizely setup

**If either of the Optimizely Auth Token or Project ID are blank the Optimizely prompts will not be present.**

Optimizely auth token - this is the Optimizely Personal Access Token, follow [these instructions](https://docs.developers.optimizely.com/web-experimentation/docs/personal-access-token) to set one up.

The Optimizely projects array allows you to setup multiple projects. You can select between the projects in the prompts. To set a default project, set the default flag to true.

Each project object requires the Project Name, Auth Token, Audiences (name / id key value pair) and default flag.

Project Name - required the prompts to allow you to select projects.
Auth token - required to use the Optimizely REST API
Project ID - Optimizely project ID, required to use the Optimizely REST API
Audiences - Audience name and ID pairs, these audiences will be automatically added to any Optimizely test created through the API. For example, QA Audiences.
Default - set to true to use project as a default

```
optimizely.projects: [{
       project_name: [PROJECT_NAME],
        auth_token:  [OPTIMIZELY_AUTH_TOKEN],
        project_id: [PROJECT_ID],
        audiences: {
          [AUDIENCE_NAME]: [AUDIENCE_ID],
          [AUDIENCE_NAME]: [AUDIENCE_ID],
        },
        default: [TRUE/FALSE],
}]
```

#### Defaults

The default values are used to help personalise the prompts, output file contents and output folder structure.

Child folders (optional). Array of string folder names will create a prompt. This allows for subfolders within the main output destination folder. Allowing for the ability to group tests together.

```
prompts.config.childFolders: []
```

Developers (optional) - Array of string names will create a prompt. This adds the developer name to the output files.

```
prompts.config.developers: []
```

Homepage URL (optional) - String url to show as an example in a prompt.

```
prompts.config.homepageUrl: []
```

Test ID Example (optional) - String - to show as an example in a prompt.

```
prompts.config.testIdExample: []
```

Test Name Example (optional) - String - to show as an example in a prompt.

```
prompts.config.testNameExample: []
```

#### Files and Custom Files

During the prompts you will be able to select and deselect which files you want to build for the current test, the files configuration options allows customisation of this prompt.To add more files simply add a new file to the files object (and make sure you add the new files to a custom template folder)

Show In Prompts - Boolean - Make this file available for selection in the prompt.

```
prompts.files.[filename].showInPrompts:
```

Checked by default - Boolean - File selected for scaffolding in the prompts or not

```
prompts.files.[filename].checkedByDefault:
```

File Extension (optional) - If unset the files object name will be used as the file extension.

```
prompts.files.[filename].fileExtension:
```

Single File (optional) - If unset or false then control and variation files will be created for this file type. If set to true a single file will be created for this file type.

```
prompts.files.[filename].singleFile:
```

#### Output

Output desination - the output destination for the tests. A folder will be created in the root if one doesn't already exist.

```
output.destination: [FOLDER_NAME]
```

Localhost - if you are using a local server to serve your files then add the server and port here. This will be used to generate the file template variables.

```
output.localhost: [LOCALHOST_AND_PORT]
```

#### Custom Templates

This generator has default templates which can be found in the /templates folder.
To add custom templates first add the custom template directory name.

```
templates.customDirectory: []
```

Custom template structure 

```
[folder-name] -> src -> [variation folders] -> [variation files]
                       -> [single files]
```

For example:
```
checkoutTemplates -> src -> js  -> variation-x.js
                                -> control.js
                                -> shared.js
                         -> css -> variation-x.js
                                -> control.js
                                -> shared.js
                         -> README.md
```

#### Template Variables
These variables can be added to any of the templates. 
To output the values add the variables like this: <%= VARIABLE %>


```
Test Details Variables

<%= testDetails %>
<%= testId %>
<%= testName %>
<%= testUrl %>
<%= testDescription %>
<%= variations %>
<%= childFolder %>
<%= filesToGenerate %>
<%= developer %>
<%= customTemplate %>

Variation Variables
<%= variations.control.id  %>
<%= variations.control.name %>
<%= variations.index  %>
<%= variations.currentVariation.id %>
<%= variations.currentVariation.name %>
<%= variations.currentVariation.filename %>

Optimizely Variables
<%= optimizely.experimentId %>
<%= optimizely.testType %> 
<%= optimizely.project_name %>

File Path Variables
<%= {folderName}.variation %>
<%= {folderName}.shared  %>
<%= {folderName}.control  %>

Server Path Variables
<%= {folderName}.server.variation %>
<%= {folderName}.server.shared  %>
<%= {folderName}.server.control  %>
```


## Running the tests

```
npm run test
```


### Break down into end to end tests

Testing verifies the prompt selections generate the correct folder and files outputs


## Built With

- [Yeoman](https://yeoman.io/) - The web scaffolding tool
- [Optimizely API (2.0)](https://library.optimizely.com/docs/api/app/v2/index.html/) - Optimizely
- Lots of love


## Authors

- **Chris Davies** 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
