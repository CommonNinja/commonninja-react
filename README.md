# Common Ninja for React

A small library for using Common Ninja's widgets in React projects.

A list of all available widgets could be found here:
https://www.commoninja.com/widgets

## How to use

Start by installing the library in your project:
```
// npm
npm i commonninja-react

// yarn
yarn add commonninja-react
```

Then, add the following code where you want the widget to appear in your React app:

```
import { CommonNinjaWidget } from 'commonninja-react';

const MyComponent = () => {
  return (
    <CommonNinjaWidget
      widgetId=""
    />
  );
}
```

## Props
Here's a list of available props for the `<CommonNinjaWidget />` component:

### Mandatory
* `widgetId` - Common Ninja's widget ID.

### Not Mandatory
* `muteEvents` - set to true if you don't want your widget to report engagement events for analytics (views, impressions, custom events, etc.).
* `onLoad` - a callback that will dispatch once the widget has been loaded completely.
* `widgetProps` - a string that will be passed to the viewer's url. Please note that this property isn't being used in most of apps.

## Contact

Having issues / questions using this library? Feel free to reach out at [contact@commoninja.com](mailto:contact@commoninja.com).
