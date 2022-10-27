import React from "react";

import {
  VisibilityContext,
  slidingWindow,
  getItemsPos
} from "react-horizontal-scrolling-menu";

function Arrow({children, disabled, onClick}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        right: "1%",
        opacity: disabled ? "0" : "0.6",
        userSelect: "none",
        border: "none",
      }}
    >
      {children}
    </button>
  );
}

export function LeftArrow() {
  const {
    items,
    visibleItems,
    getItemById,
    isFirstItemVisible,
    scrollToItem,
    visibleItemsWithoutSeparators,
    initComplete
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !initComplete || (initComplete && isFirstItemVisible)
  );
  React.useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isFirstItemVisible);
    }
  }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

  const prevGroupItems = slidingWindow(
    items.toItemsKeys(),
    visibleItems
  ).prev();
  const { center } = getItemsPos(prevGroupItems);
  const scrollPrevCentered = () =>
    scrollToItem(getItemById(center), "smooth", "center");

  return (
    <Arrow disabled={disabled} onClick={scrollPrevCentered}>
      <i className="fa fa-angle-left mx-2"/>
    </Arrow>
  );
}

export function RightArrow() {
  const {
    getItemById,
    isLastItemVisible,
    items,
    scrollToItem,
    visibleItems,
    visibleItemsWithoutSeparators
  } = React.useContext(VisibilityContext);

  const [disabled, setDisabled] = React.useState(
    !visibleItemsWithoutSeparators.length && isLastItemVisible
  );
  React.useEffect(() => {
    if (visibleItemsWithoutSeparators.length) {
      setDisabled(isLastItemVisible);
    }
  }, [isLastItemVisible, visibleItemsWithoutSeparators]);

  const nextGroupItems = slidingWindow(
    items.toItemsKeys(),
    visibleItems
  ).next();
  const { center } = getItemsPos(nextGroupItems);
  const scrollNextCentered = () =>
    scrollToItem(getItemById(center), "smooth", "center");

  return (
    <Arrow disabled={disabled} onClick={scrollNextCentered}>
      <i className="fa fa-angle-right mx-2"/>
    </Arrow>
  );
}
