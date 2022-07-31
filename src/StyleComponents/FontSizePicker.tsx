import React, { ChangeEvent, useRef } from "react";
import { StyleComponentProps } from "../types";
import { makeid } from "../utils";

type LineWidthPickerProps = StyleComponentProps;

export default function LineWidthPicker({
  onUpdate,
  styleKey,
  styleValue,
}: LineWidthPickerProps) {
  const id = useRef<string>(makeid(5));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate(styleKey, value);
  };

  return (
    <div>
      <div style={{ textAlign: "left", marginBottom: 5 }}>
        <label style={{ fontWeight: "bold" }} htmlFor={id.current}>
          font size
        </label>
      </div>
      <div style={{ width: "100%" }}>
        <input
          id={id.current}
          value={styleValue}
          onChange={handleChange}
          type="number"
          style={{
            boxSizing: "border-box",
            width: 168,
            height: 30,
            borderRadius: 5,
            paddingLeft: 10,
            fontSize: 19,
            lineHeight: "1.6",
          }}
          min="0"
          step="1"
        />
      </div>
    </div>
  );
}
