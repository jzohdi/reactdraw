import React, { ChangeEvent } from "react";
import { StyleComponentProps } from "../types";
import { makeid } from "../utils";

const regex = /^([0-9A-F]{3}){1,2}$/i;

// type
type ColorPickerProps = StyleComponentProps & { label: string };

function ColorPicker({
  onUpdate,
  styleKey,
  label,
  styleValue,
}: ColorPickerProps) {
  const id = makeid(5);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate(styleKey, "#" + value);
  };

  return (
    <div>
      <div style={{ textAlign: "left", marginBottom: 5 }}>
        <label style={{ fontWeight: "bold" }} htmlFor={id}>
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
