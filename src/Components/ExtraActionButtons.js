import React from "react";
import LogEngagementEvent from "../Logging";

export function ExtraActionButtons(props) {
  function handleClick(buttonData, placeID) {
    LogEngagementEvent("user-click", buttonData.log, placeID);
    window.open(buttonData.url);
  }
  const place = props.place;
  const donateText = "donate to staff";
  const takeoutText = "order takeout";
  const classOrder = ["extra-action-button-1", "extra-action-button-2"];
  const takeout = { url: place.takeoutURL, log: "takeout", text: takeoutText };
  const donation = { url: place.donationURL, log: "donate", text: donateText };
  const toRender = [takeout, donation].filter(value => {
    return value.url !== null;
  });
  var spansToRender = [];
  toRender.forEach((value, index) => {
    spansToRender.push(
      <span
        onClick={e => {
          handleClick(value, place.placeID);
        }}
        className={"extra-action-button " + classOrder[index]}
      >
        {value.text}
      </span>
    );
  });
  return <div className="extra-button-container">{spansToRender}</div>;
}
