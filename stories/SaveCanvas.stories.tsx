import { Story } from "@storybook/react";
import React, { useEffect, useRef } from "react";
import {
  ReactDraw,
  selectTool,
  freeDrawTool,
  ClearAllButton,
  DrawingTools,
  MenuComponent,
  ReactDrawInnerProps,
  COLORS,
  useStyles,
  ReactDrawProps,
} from "../src";
import { PhotographBoldIcon } from "@jzohdi/jsx-icons";

export default {
  title: "Customization Examples/Save Canvas As Image",
};

const topBarTools: DrawingTools[] = [selectTool, freeDrawTool];

declare global {
  var html2canvas: (src: HTMLElement) => Promise<HTMLCanvasElement>;
}
const inputId = "my-id";

const SaveCanvas: MenuComponent = ({ getContext }) => {
  const classes = useStyles("saveCanvasComponent");
  const ref = useRef<HTMLButtonElement>(null);
  // could also do a loading state
  useEffect(() => {
    const scriptTag = document.createElement("script");
    scriptTag.async = true;
    scriptTag.integrity =
      "sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==";
    scriptTag.crossOrigin = "anonymous";
    scriptTag.referrerPolicy = "no-referrer";
    scriptTag.onload = function () {
      console.log("loaded html2canvas");
    };
    scriptTag.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    if (ref.current) {
      ref.current.appendChild(scriptTag);
    }
  }, []);

  const handleSaveCanvas = () => {
    const ctx = getContext();
    const container = ctx.viewContainer;
    if (window.html2canvas) {
      const html2canvas = window.html2canvas;
      html2canvas(container).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);

        downloadLink.href = base64image;
        downloadLink.target = "_self";
        downloadLink.download =
          "react-draw-saved-" +
          new Date().toLocaleDateString() +
          "_" +
          new Date()
            .toLocaleTimeString()
            .replace(/\s/g, "")
            .replace(/:/g, "_") +
          ".png";
        downloadLink.click();
      });
    }
  };
  return (
    <button
      className={classes}
      id={inputId}
      onClick={handleSaveCanvas}
      ref={ref}
    >
      <div style={{ padding: "0px 5px", height: 15 }}>
        <PhotographBoldIcon height={15} width={20} />
      </div>
      <label
        htmlFor={inputId}
        style={{ padding: "0px 10px", pointerEvents: "none" }}
      >
        Save Canvas
      </label>
    </button>
  );
};

const Template: Story<ReactDrawProps> = (args) => (
  <ReactDraw
    {...args}
    styles={{
      saveCanvasComponent: {
        width: 180,
        fontSize: 16,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: 5,
        cursor: "pointer",
        padding: "7px 10px",
        backgroundColor: "white",
        marginBottom: 10,
        boxSizing: "border-box",
        border: `1px solid ${COLORS.primary.main}`,
        "&:hover": {
          backgroundColor: COLORS.primary.light,
        },
      },
    }}
  />
);

export const SaveCanvasAsImage = Template.bind({});

SaveCanvasAsImage.args = {
  topBarTools,
  shouldSelectAfterCreate: true,
  menuComponents: [SaveCanvas, ClearAllButton],
  shouldKeepHistory: false,
};

SaveCanvasAsImage.parameters = {
  docs: {
    source: {
      code: `
import {
	ReactDraw,
	selectTool,
	freeDrawTool,
	ClearAllButton,
	DrawingTools,
	MenuComponent,
	ReactDrawProps,
	COLORS,
} from "@jzohdi/react-draw";
import { PhotographBoldIcon } from "@jzohdi/jsx-icons";
import styled from "styled-components";

const topBarTools: DrawingTools[] = [selectTool, freeDrawTool];

export default function ExampleProject() {

	return <ReactDraw 
		topBarTools={topBarTools}
		shouldSelectAfterCreate={true}
		menuComponents={[SaveCanvas, ClearAllButton]}
		shouldKeepHistory={false}
		styles={{
			saveCanvasComponent: {
			  width: 180,
			  fontSize: 16,
			  display: "flex",
			  justifyContent: "flex-start",
			  alignItems: "center",
			  borderRadius: 5,
			  cursor: "pointer",
			  padding: "7px 10px",
			  backgroundColor: "white",
			  marginBottom: 10,
			  boxSizing: "border-box",
			  border: \`1px solid \${COLORS.primary.main}\`,
			  "&:hover": {
				backgroundColor: COLORS.primary.light,
			  },
			},
		  }}		
		/>

}

const SaveCanvas: MenuComponent = ({ getContext }) => {
	const classes = useStyles("saveCanvasComponent");
	const ref = useRef<HTMLButtonElement>(null);

	// could also do a loading state
	
	useEffect(() => {
	  const scriptTag = document.createElement("script");
	  scriptTag.async = true;
	  scriptTag.integrity =
		"sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==";
	  scriptTag.crossOrigin = "anonymous";
	  scriptTag.referrerPolicy = "no-referrer";
	  scriptTag.onload = function () {
		console.log("loaded html2canvas");
	  };
	  scriptTag.src =
		"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
	  if (ref.current) {
		ref.current.appendChild(scriptTag);
	  }
	}, []);
  
	const handleSaveCanvas = () => {
	  const ctx = getContext();
	  const container = ctx.viewContainer;
	  if (window.html2canvas) {
		const html2canvas = window.html2canvas;
		html2canvas(container).then((canvas) => {
		  const base64image = canvas.toDataURL("image/png");
		  const downloadLink = document.createElement("a");
		  document.body.appendChild(downloadLink);
  
		  downloadLink.href = base64image;
		  downloadLink.target = "_self";
		  downloadLink.download =
			"react-draw-saved-" +
			new Date().toLocaleDateString() +
			"_" +
			new Date()
			  .toLocaleTimeString()
			  .replace(/\s/g, "")
			  .replace(/:/g, "_") +
			".png";
		  downloadLink.click();
		});
	  }
	};
	return (
	  <button
		className={classes}
		id={inputId}
		onClick={handleSaveCanvas}
		ref={ref}
	  >
		<div style={{ padding: "0px 5px", height: 15 }}>
		  <PhotographBoldIcon height={15} width={20} />
		</div>
		<label
		  htmlFor={inputId}
		  style={{ padding: "0px 10px", pointerEvents: "none" }}
		>
		  Save Canvas
		</label>
	  </button>
	);
};
	  `,
      language: "tsx",
      type: "auto",
    },
    description: {
      component: `In this example we create a menu component that saves the canvas to an image. This loades the <a href="https://html2canvas.hertzen.com">html2canvas library</a> and saves the DOM as a jpg`,
    },
  },
};
