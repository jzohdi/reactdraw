import { MenuIcon, PaletteBoldIcon } from "@jzohdi/jsx-icons";
import React, { useState } from "react";
import ToolTip from "../Alerts/ToolTip";

import {
  BOTTOM_BAR_CONTAINER_CLASSES,
  BOTTOM_TOOL_BUTTON_CLASSES,
  MENU_BUTTON_CLASSES,
  MENU_CONTAINER_CLASSES,
} from "../constants";
import { useStyles } from "../Styles/hooks";
import {
  ActionTools,
  BottomToolDisplayMap,
  ReactChild,
  ReactDrawContext,
  StringObject,
  StyleComponents,
  UpdateStyleFn,
} from "../types";
import StylesMenu from "./StylesMenu";

export type BottomToolBarProps = {
  tools: ActionTools[];
  displayMap: BottomToolDisplayMap;
  dispatch: (fn: (ctx: ReactDrawContext) => void) => void;
  stylesMenu: {
    getEditProps: () => StringObject;
    styleComponents?: StyleComponents;
    onUpdateStyle: UpdateStyleFn;
  };
  children: ReactChild;
};

type MenuKeys = "styles" | "menu" | null;

export function BottomToolBar({
  tools,
  displayMap,
  dispatch,
  stylesMenu,
  children,
}: BottomToolBarProps) {
  //   console.log(displayMap);
  const bottomBarContainerClasses = useStyles(BOTTOM_BAR_CONTAINER_CLASSES);
  const bottomToolButtonClasses = useStyles(BOTTOM_TOOL_BUTTON_CLASSES);
  const menuButtonClasses = useStyles(MENU_BUTTON_CLASSES);
  const menuContainerClasses = useStyles(MENU_CONTAINER_CLASSES);

  const [menuOpen, setMenuOpen] = useState<MenuKeys>(null);

  const handleToggleMenu = (key: MenuKeys) => {
    if (key === menuOpen) {
      return setMenuOpen(null);
    }
    return setMenuOpen(key);
  };

  const hasStyleMenu =
    !!stylesMenu.styleComponents && !isObjEmpty(stylesMenu.styleComponents);
  const hasMenu = !!children && React.Children.count(children) > 0;

  return (
    <>
      {menuOpen === "styles" && (
        <div className={menuContainerClasses}>
          <StylesMenu {...stylesMenu} />
        </div>
      )}
      {menuOpen === "menu" && (
        <div className={menuContainerClasses}>{children}</div>
      )}
      <div className={bottomBarContainerClasses}>
        {hasMenu && (
          <ToolTip text="Menu" position="bottom">
            <button
              className={menuButtonClasses}
              onClick={() => handleToggleMenu("menu")}
              data-open={menuOpen === "menu"}
            >
              <MenuIcon size={20} />
            </button>
          </ToolTip>
        )}
        {hasStyleMenu && (
          <ToolTip text="Styles" position="bottom">
            <button
              className={menuButtonClasses}
              onClick={() => handleToggleMenu("styles")}
              data-open={menuOpen === "styles"}
            >
              <PaletteBoldIcon size={20} />
            </button>
          </ToolTip>
        )}
        {tools.map((tool, i) => {
          const toolId = tool.id;
          const toolDisplayMode = displayMap.get(toolId) || "hide";
          const isDisabled = toolDisplayMode === "disabled";
          return (
            <ToolTip
              key={tool.id}
              text={tool.tooltip}
              position="bottom"
              disabled={isDisabled}
            >
              <button
                className={bottomToolButtonClasses}
                aria-aria-disabled={isDisabled}
                data-disabled={isDisabled}
                data-mode={toolDisplayMode}
                disabled={isDisabled}
                onClick={() => dispatch(tool.handleContext)}
              >
                {tool.icon}
              </button>
            </ToolTip>
          );
        })}
      </div>
    </>
  );
}
function isObjEmpty(obj: { [key: string]: any }): boolean {
  for (var _x in obj) {
    return false;
  }
  return true;
}
