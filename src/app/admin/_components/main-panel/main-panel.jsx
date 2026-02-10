import { useRef, useState } from "react";
import "./main-panel.scss";
import { useBannerAPI } from "src/app/_utils/hooks/useBannerAPI";
import Table from "src/app/common/table";
import { blocksTypes, mainPanelHeader } from "./main-panel.data";
import MainPanelOptions from "./_components/main-panel-options/main-panel-options";
import { collectAllStyles } from "./_utils/collectStyles";
import { downloadHTML } from "./_utils/downloadHTML";
import HomePage from "src/app/home/page";

export default function MainPanel({ entityType, entityApiName }) {
  const { entity: cardsTypes } = useBannerAPI(entityType, entityApiName);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef(null);

  const handleExport = () => {
    setIsExporting(true);

    // Give time for HomePage to render
    setTimeout(() => {
      if (exportRef.current) {
        const homePageElement = exportRef.current.querySelector(".page");
        if (homePageElement) {
          const styles = collectAllStyles();
          const fullHTML = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Home Page Export</title>
                ${styles}
              </head>
              <body>
                ${homePageElement.outerHTML}
              </body>
            </html>
          `;

          // Download
          downloadHTML(fullHTML, "home-page-export.html");
        }
      }
      setIsExporting(false);
    }, 2000);
  };

  return (
    <div className="main-panel">
      {cardsTypes && (
        <Table
          addEntity={{
            name: "",
          }}
          table={{
            header: mainPanelHeader,
            body: cardsTypes.map((cardType) => {
              const entries = Object.entries(cardType);
              return entries.map(([key, value]) => ({
                type: key === "type" ? "select" : "label",
                propertyName: key,
                values: value,
                options:
                  key === "type"
                    ? blocksTypes.map((block) => ({
                        value: block.value,
                        label: block.label,
                        category: "blocks",
                      }))
                    : [],
              }));
            }),
          }}
          entityType={entityType}
          entityApiName={entityApiName}
          title="Components on the Main Page"
          options={
            <MainPanelOptions
              title={`Components on the Main Page`}
              entityType={"color"}
              onExport={handleExport}
            />
          }
        />
      )}
      {isExporting && (
        <>
          <div
            ref={exportRef}
            style={{
              position: "fixed",
              top: "-10000px",
              left: "-10000px",
              width: "100vw",
              height: "100vh",
            }}
          >
            <HomePage />
          </div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              Generating static HTML export...
            </div>
          </div>
        </>
      )}
    </div>
  );
}
