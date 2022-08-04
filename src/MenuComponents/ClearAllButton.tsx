import { TrashCanIcon } from "@jzohdi/jsx-icons";
import React from "react";
import styled from "styled-components";
import { COLORS } from "../constants";
import { MenuComponent } from "../types";
import { makeid } from "../utils";
import { batchDelete } from "../utils/utils";

const StyledButton = styled.button`
  width: 180px;
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  padding: 7px 10px;
  background-color: ${COLORS.primary.light};
  &:hover {
    background-color: ${COLORS.primary.main};
  }
`;

const ClearAllButton: MenuComponent = ({ getContext }) => {
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
    <StyledButton id={buttonId.current} onClick={handleClearAll}>
      <div style={{ padding: "0px 5px", height: 20 }}>
        <TrashCanIcon width={15} height={20} />
      </div>
      <label
        htmlFor={buttonId.current}
        style={{ padding: "0px 10px", pointerEvents: "none" }}
      >
        Clear All
      </label>
    </StyledButton>
  );
};

export default ClearAllButton;
