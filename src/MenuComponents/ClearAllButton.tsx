import { TrashCanIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { CLEAR_ALL_BUTTON_CLASSES } from "../constants";
import { useStyles } from "../Styles/hooks";
import { MenuComponent } from "../types";
import { makeid } from "../utils";
import { batchDelete } from "../utils/utils";

const ClearAllButton: MenuComponent = ({ getContext }) => {
  const classes = useStyles(CLEAR_ALL_BUTTON_CLASSES);
  const buttonId = React.useRef<string>(makeid(6));

  const handleClearAll = () => {
    const ctx = getContext();
    if (ctx.objectsMap.size === 0) {
      return;
    }
    const objectKeys = ctx.objectsMap.keys();
    batchDelete(Array.from(objectKeys), ctx);
  };

  return (
    <button className={classes} id={buttonId.current} onClick={handleClearAll}>
      <div style={{ padding: "0px 5px", height: 20 }}>
        <TrashCanIcon width={15} height={20} />
      </div>
      <label
        htmlFor={buttonId.current}
        style={{ padding: "0px 10px", pointerEvents: "none" }}
      >
        Clear All
      </label>
    </button>
  );
};

export default ClearAllButton;
