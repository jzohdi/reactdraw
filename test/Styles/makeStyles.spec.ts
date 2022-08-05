import { StylesContextState } from "../../src/Styles/types";
import cssFromState from "../../src/Styles/makeStyles";
import assert from "assert";
import { keyframes, mediaQuery } from "../../src/Styles/utils";
// const cssFromState = require("../src/Styles/makeStyles");

const basicState: StylesContextState = {
  className1: {
    opacity: 1,
    width: 150,
    height: "100%",
    maxHeight: "100%",
    borderRightColor: "red",
    "&:hover": {
      color: "red", // <Thing> when hovered
      height: 20,
    },
    "&:focus": {
      color: "blue",
    },
    "& ~ &": {
      background: "tomato", // <Thing> as a sibling of <Thing>, but maybe not directly next to it
    },
    "& + &": {
      background: "lime", // <Thing> next to <Thing>
    },
    "&.something": {
      background: "orange", // <Thing> tagged with an additional CSS class ".something"
    },
    ".something-else &": {
      border: "1px solid", // <Thing> inside another element labeled ".something-else"
    },
    [mediaQuery.applyBelow(500)]: {
      width: 100,
    },
  },
  className2: {
    padding: "0.5em",
    margin: "0.5em",
  },
};

const basicTestResult = `.className1:hover { color: red; height: 20px; }.className1:focus { color: blue; }.className1 ~ .className1 { background: tomato; }.className1 + .className1 { background: lime; }.className1.something { background: orange; }.something-else .className1 { border: 1px solid; }@media only screen and (max-width: 500px) { .className1 { width: 100px; } }.className1 { opacity: 1; width: 150px; height: 100%; max-height: 100%; border-right-color: red; }.className2 { padding: 0.5em; margin: 0.5em; }`;

const withKeyFrames: StylesContextState = {
  className1: {
    opacity: 1,
    width: 150,
    height: "100%",
    maxHeight: "100%",
    borderRightColor: "red",
    [keyframes("animation1")]: {
      "0%": {
        opacity: 1,
        width: 200,
      },
      "100%": {
        opacity: 0,
        width: 0,
      },
    },
  },
  className2: {
    padding: "0.5em",
    margin: "0.5em",
    [keyframes("animation2")]: {
      "0%": {
        opacity: 1,
        width: 200,
      },
      "100%": {
        opacity: 0,
        width: 0,
      },
    },
  },
};

const withStarOp: StylesContextState = {
  "bottom-bar-container": {
    display: "flex",
    zIndex: 1000,
    width: "100%",
    overflowX: "auto",
    "*": {
      scrollbarWidth: "none",
      scrollbarColor: `blue #e2ecf5`,
    },
    "&::-webkit-scrollbar": {
      height: 10,
    },
    "&::-webkit-scrollbar-track": {
      background: "#e2ecf5",
    },

    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#035195",
      borderRadius: 10,
      border: "3px none #ffffff",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: " #00294d",
    },
  },
};

const withStarOpExptected = `.bottom-bar-container * { scrollbar-width: none; scrollbar-color: blue #e2ecf5; }.bottom-bar-container::-webkit-scrollbar { height: 10px; }.bottom-bar-container::-webkit-scrollbar-track { background: #e2ecf5; }.bottom-bar-container::-webkit-scrollbar-thumb { background-color: #035195; border-radius: 10px; border: 3px none #ffffff; }.bottom-bar-container::-webkit-scrollbar-thumb:hover { background-color:  #00294d; }.bottom-bar-container { display: flex; z-index: 1000; width: 100%; overflow-x: auto; }`;

describe("Basic Test Cases", () => {
  it("tests basicState equal basicTestResult", () => {
    const result = cssFromState(basicState);
    assert.equal(result, basicTestResult);
    // console.log("basicState result: ", result);
  });
  it("tests keyframes handling", () => {
    const result = cssFromState(withKeyFrames);
    // assert.equal(result, basicTestResult);
    // console.log("withKeyFrames result: ", result);
  });
  it("tests star operator", () => {
    const result = cssFromState(withStarOp);
    assert.equal(result, withStarOpExptected);
  });
});
