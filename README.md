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
npm i {{TODO}}
```

### Configuration File

After installation the configuration file `genopti.config.js` will have been added to the root of your project. This file is required to setup Optimizely configuartion, custom files and default values. This file is intended to be used for all dvelopers in the project and saved to source control.

#### Optimizely setup

**If either of the Optimizely Auth Token or Project ID are blank the Optimizely prompts will not be present.**

Optimizely auth token - this is the Optimizely Personal Access Token, follow [these instructions](https://docs.developers.optimizely.com/web-experimentation/docs/personal-access-token) to set one up.

```
optimizely.project_defaults.auth_token: [OPTIMIZELY_PERSONAL_ACCESS_TOKEN]
```

Optimizley Project ID - the ID of the Optimizely project you will be creating and requesting the experiments for.

```
optimizely.project_defaults.default_project_id:[OPTIMIZELY_PROJECT_ID]
```

Optimizely default audience (optional) - audience name, optimizely audience ID pairs. These audiences will be added to all new Optimizely experiments. AN example of usage would be a QA audience or a device list audience.

```
optimizely.project_defaults.default_audiences: []

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

Custom template structure... {{TODO}}

#### Template Variables

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

## Built With

- [Yeoman](https://yeoman.io/) - The web scaffolding tool
- [Optimizely API (2.0)](https://library.optimizely.com/docs/api/app/v2/index.html/) - Optimizely

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Billie Thompson** - _Initial work_ - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
