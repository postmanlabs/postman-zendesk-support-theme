![Postman logo](https://assets.getpostman.com/common-share/postman-github-logo.png 'Postman logo')

# Postman Zendesk Support Center

[Postman Support Center](https://support.postman.com) theme support for Zendesk v2 API. The post-zen theme consists of a set of templates, styles, a Javascript file used mainly for interactions and an assets folder. The theme is managed by the Postman Marketing Engineering Team.

## Project structure

When importing a theme to Zendesk Guide it will mainly look for the following files and folders:

- [`templates/`](#templates) - contains all markup.
- [`style.css`](#styles) - contains all CSS.
- [`script.js`](#scripts) - main script file.
- [`assets/`](#assets-folder) - assets such as scripts or fonts.
- [`manifest.json`](#manifest-file) - project metadata and settings.
- [`settings/`](#settings-folder) - files to be used in settings in [`manifest.json`](manifest.json).

### Styles
The styles that the Postman Support Center use in the theme are in the style.css file in the root folder.

### Assets
Add assets as images and files to the [`assets/`](assets/) folder and use them in your CSS and templates.
The assets will be uploaded to Zendesk CDN (`theme.zdassets.com`). You can read more about assets [here](https://support.zendesk.com/hc/en-us/articles/115012399428).

### Templates

For markup Zendesk Guide uses [Handlebars](https://handlebarsjs.com/) and each template is stored in the [`templates/`](templates/) folder.

### Manifest file

The [`manifest.json`](manifest.json) contains theme metadata and allows you to define a group of settings for your theme that can then be changed via the UI in theming center.
You can read more about the manifest file [here](https://support.zendesk.com/hc/en-us/articles/115012547687).

### Settings folder

If you have a `type` variable of `file`, you need to provide a default file for that variable in the [`settings/`](settings/) folder. This file will be used on the settings panel by default and users can upload a different file if they like.
For example, if you'd like to have a variable for the background image of a section, the variable in your manifest file would look something like this:

```json
{
  ...
  "settings": [{
    "label": "Images",
    "variables": [{
      "identifier": "background_image",
      "type": "file",
      "description": "background image description",
      "label": "background image label",
    }]
  }]
}
```

And this would look for a file inside the [`settings/`](settings/) folder named `background_image`.

## Develop
- [ZAT setup](https://support.zendesk.com/hc/en-us/articles/115012547687)
- [Node.js](Node.js)
- API Token from Zendesk

  

## Deploy
To deploy to production, we use the [Zendesk GitHub integration](https://support.zendesk.com/hc/en-us/community/posts/360004400007). 
## License

[Apache License 2.0](LICENSE)
