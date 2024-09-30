import React, { CSSProperties, useEffect, useRef, useState } from "react";

interface ICommonNinjaWidgetProps {
  widgetId: string;
  type?: string;
  widgetProps?: string;
  muteEvents?: boolean;
  onSdkLoad?: () => Promise<void> | void;
  onInit?: () => Promise<void> | void;
  loader?: React.ReactNode;
  style?: CSSProperties;
}

declare global {
  interface Window {
    CommonNinja: any;
  }
}

export const CommonNinjaWidget = (props: ICommonNinjaWidgetProps) => {
  const {
    widgetId,
    onSdkLoad,
    onInit,
    loader = <></>,
    muteEvents,
    style,
    widgetProps,
  } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(
    typeof document !== "undefined" &&
      !!document?.getElementById("commonninja-sdk")
  );
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const conditionalProps: any = {};

  if (muteEvents) {
    conditionalProps["mute-events"] = true;
  }

  if (widgetProps) {
    conditionalProps["comp-props"] = widgetProps;
  }

  function init() {
    if (
      typeof window !== "undefined" &&
      typeof window.CommonNinja !== "undefined"
    ) {
      let instanceId = "";

      Object.keys(window.CommonNinja.installedPlugins).forEach((key) => {
        if (
          window.CommonNinja.installedPlugins[key].placeholderElm ===
          placeholderRef?.current
        ) {
          instanceId = key;
        }

        // const [wId] = key.split('_');

        // if (wId === widgetId) {
        // 	instanceId = key;
        // }
      });

      if (
        instanceId &&
        window.CommonNinja.installedPlugins?.[instanceId]?.widgetElm
      ) {
        setLoading(false);
        onInit?.();
        return;
      }

      window.CommonNinja.init();
    }

    setTimeout(() => {
      init();
    }, 100);
  }

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const existingScript = document?.getElementById("commonninja-sdk");

    if (!existingScript) {
      const script = document?.createElement("script");
      script.src = "https://cdn.commoninja.com/sdk/latest/commonninja.js";
      script.id = "commonninja-sdk";
      document?.body.appendChild(script);
      script.onload = () => {
        setScriptLoaded(true);
      };
    } else {
      setScriptLoaded(true);
    }
  });

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetId]);

  useEffect(() => {
    if (scriptLoaded) {
      init();
      onSdkLoad?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded]);

  return (
    <>
      {loading && loader}
      <div
        className={`commonninja_component pid-${widgetId}`}
        style={style}
        {...conditionalProps}
        ref={placeholderRef}
      ></div>
    </>
  );
};

export const CommonNinjaPlugin = CommonNinjaWidget;
