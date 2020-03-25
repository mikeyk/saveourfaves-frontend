import React from "react";

export function ExtraActionButtons(props) {
  const place = props.place;
  const donateText = "donate to staff";
  const takeoutText = "order takeout";
  const classOrder = ["extra-action-button-1", "extra-action-button-2"];
  const takeout = { url: place.takeoutURL, text: takeoutText };
  const donation = { url: place.donationURL, text: donateText };
  const toRender = [takeout, donation].filter(value => {
    return value.url !== null;
  });
  var spansToRender = [];
  toRender.forEach((value, index) => {
    spansToRender.push(
      <span
        onClick={event => window.open(value.url)}
        className={"extra-action-button " + classOrder[index]}
      >
        {value.text}
      </span>
    );
  });
  return <div className="extra-button-container">{spansToRender}</div>;
}
