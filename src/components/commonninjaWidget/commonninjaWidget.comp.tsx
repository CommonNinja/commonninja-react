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
  lazyLoad?: boolean;
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
    lazyLoad = false,
  } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(
    typeof document !== "undefined" &&
      !!document?.getElementById("commonninja-sdk")
  );
  const [isVisible, setIsVisible] = useState<boolean>(!lazyLoad);
  const placeholderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const conditionalProps: any = {};

  if (muteEvents) {
    conditionalProps["mute-events"] = true;
  }

  if (widgetProps) {
    conditionalProps["comp-props"] = widgetProps;
  }

  function init() {
    if (!widgetId || (lazyLoad && !isVisible)) {
      return;
    }

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
      });

      if (
        instanceId &&
        window.CommonNinja.installedPlugins?.[instanceId]?.widgetElm
      ) {
        setLoading(false);
        onInit?.();
        return;
      }

      if (
        !instanceId ||
        !window.CommonNinja.installedPlugins?.[instanceId]?.processing
      ) {
        window.CommonNinja.init();
      }
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
    if (lazyLoad) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (placeholderRef.current) {
        observerRef.current.observe(placeholderRef.current);
      }

      return () => observerRef.current?.disconnect();
    } else {
      setIsVisible(true);
    }
  }, [lazyLoad]);

  useEffect(() => {
    if (scriptLoaded && isVisible) {
      init();
      onSdkLoad?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, isVisible]);

  if (!widgetId) {
    return <></>;
  }

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
