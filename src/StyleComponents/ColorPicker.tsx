import React, { ChangeEvent, useRef } from "react";
import { StyleComponentProps } from "../types";
import { makeid } from "../utils";

type ColorPickerProps = StyleComponentProps & { label: string };

function ColorPicker({
  onUpdate,
  styleKey,
  label,
  styleValue,
}: ColorPickerProps) {
  const id = useRef<string>(makeid(5));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const hex = value === "transparent" ? value : "#" + value;
    onUpdate(styleKey, hex);
  };

  return (
    <div>
      <div style={{ textAlign: "left", marginBottom: 5 }}>
        <label style={{ fontWeight: "bold" }} htmlFor={id.current}>
          {label}
        </label>
      </div>
      <div style={{ display: "flex" }}>
        <span
          style={{
            display: "inline-block",
            borderRadius: 5,
            width: 30,
            height: 30,
            backgroundColor: styleValue,
          }}
        ></span>
        <div style={{ marginLeft: 10, display: "flex" }}>
          <span
            style={{
              borderRadius: "5px 0px 0px 5px",
              width: 30,
              padding: 5,
              fontWeight: "bold",
              fontSize: 18,
              textAlign: "center",
              color: "grey",
              backgroundColor: "lightgray",
            }}
          >
            #
          </span>
          <input
            id={id.current}
            value={styleValue.replace("#", "")}
            onChange={handleChange}
            style={{ width: 80, borderRadius: "0px 5px 5px 0px" }}
          />
        </div>
      </div>
    </div>
  );
}
export default ColorPicker;
