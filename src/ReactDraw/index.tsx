import React, { DetailedHTMLProps, HTMLAttributes, forwardRef } from "react";
import Container from "./Container";
import { LayoutOption, ReactChild, ReactDrawProps } from "../types";
import { Children } from "react";
import { AlertMessageProvider } from "../Alerts";
import ReactDraw from "./ReactDraw";
import { StylesProvider } from "../Styles/context";

export default forwardRef<HTMLDivElement, ReactDrawProps>(
  function ReactDrawWrapper(
    { children, styles, style, classNames, ...props },
    ref
  ): JSX.Element {
    const { layout } = validateProps(children, props.layout);

    return (
      <StylesProvider styles={styles} classNames={classNames}>
        <AlertMessageProvider>
          <Container
            layout={layout}
            ref={ref}
            style={
              style as DetailedHTMLProps<
                HTMLAttributes<HTMLDivElement>,
                HTMLDivElement
              >
            }
          >
            <ReactDraw {...props}>{children}</ReactDraw>
          </Container>
        </AlertMessageProvider>
      </StylesProvider>
    );
  }
);

function validateProps(children: ReactChild, layout?: LayoutOption) {
  const numChildren = Children.count(children);
  if (numChildren > 1) {
    throw new Error("ReactDraw expects either 0 or 1 children, detected more.");
  }
  if (layout === undefined) {
    layout = "default";
  }
  return { numChildren, layout };
}
