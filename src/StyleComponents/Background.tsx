import React from "react";
import { StyleComponent } from "../types";
import ColorPicker from "./ColorPicker";

const BackgroundStyle: StyleComponent = (props) => {
  return <ColorPicker {...props} label="background" />;
};
export default BackgroundStyle;
