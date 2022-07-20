import React from "react";
import { StyleComponent } from "../types";
import ColorPicker from "./ColorPicker";

const ColorStyle: StyleComponent = (props) => {
  return <ColorPicker {...props} label="color" />;
};
export default ColorStyle;
