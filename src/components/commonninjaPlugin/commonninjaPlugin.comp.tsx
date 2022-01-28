import React, { useEffect, useState } from 'react';

interface ICommonNinjaPluginProps {
  pluginId: string;
  type: string;
  pluginProps?: string;
  muteEvents?: boolean;
  onLoad?: () => void;
}

declare global {
  interface Window {
    CommonNinja: any;
  }
}

let loadedPluginId: string = '';

export const CommonNinjaPlugin = (props: ICommonNinjaPluginProps) => {
  const { pluginId, type, onLoad, muteEvents, pluginProps } = props;
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(
    !!document.getElementById('commonninja-sdk'),
  );
  const conditionalProps: any = {};

  if (muteEvents) {
    conditionalProps['mute-events'] = true;
  }

  if (pluginProps) {
    conditionalProps['comp-props'] = pluginProps;
  }

  function init() {
    loadedPluginId = pluginId;

    if (
      typeof window !== 'undefined' &&
      typeof window.CommonNinja !== 'undefined'
    ) {
      window.CommonNinja.init();
    }
  }

  useEffect(() => {
    const existingScript = document.getElementById('commonninja-sdk');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cdn.commoninja.com/sdk/latest/commonninja.js';
      script.id = 'commonninja-sdk';
      document.body.appendChild(script);
      script.onload = () => {
        setScriptLoaded(true);
      };
    }
  });

  useEffect(() => {
    if (pluginId !== loadedPluginId) {
      init();
    }
  }, [pluginId]);

  useEffect(() => {
    if (scriptLoaded) {
      init();
      onLoad?.();
    }
  }, [scriptLoaded]);

  return (
    <div
      className="commonninja_component"
      comp-type={type}
      comp-id={pluginId}
      {...conditionalProps}
    ></div>
  );
};
