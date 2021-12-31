# Common Ninja for React

A small library for using Common Ninja's plugins in React projects.

A list of all available plugins, apps, and widgets could be found here:
https://www.commoninja.com

## How to use

```
<CommonNinjaPlugin
  pluginId=""
  type=""
/>
```

## Props
Here's a list of available props for the `<CommonNinjaPlugin />` component:

### Mandatory
* `pluginId` - the instance ID of the plugin.
* `type` - type type of the plugin (bracket, faq, comparison_table, etc.).

### Not Mandatory
* `muteEvents` - set to true if you don't want your plugin to report engagement events for analytics (views, impressions, custom events, etc.).
* `onLoad` - a callback that will dispatch once the plugin has been loaded completely.
* `pluginProps` - a string that will be passed to the viewer's url. Please note that this property isn't being used in most of apps.

## Contact

Having issues / questions using this library? Feel free to reach out at [contact@commoninja.com](mailto:contact@commoninja.com).