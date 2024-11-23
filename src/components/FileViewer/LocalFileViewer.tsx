import { useEffect, useRef } from "react";

export default function LocalFileViewer(props: { document: any, className?: string, baseUrl?: string }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit: any;

    (async function () {
      // PSPDFKit = await import("pspdfkit");
      PSPDFKit = await import("pspdfkit");
      await PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document: props.document,
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [props.document]);

  return <div ref={containerRef} className={"w-full h-[500px] " + props.className} />;
}
