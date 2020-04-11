import React from "react";
import { Button } from "antd";
import { LogEngagementEvent } from "../Logging";

export function GooglePlacesLink(props) {
  function clickHandler() {
    LogEngagementEvent(
      "user-click",
      "open-google-places-link",
      props.place.placeID
    );
    window.open(
      "https://www.google.com/maps/search/?api=1&query=" +
        props.place.address +
        "&query_place_id=" +
        props.place.placeID
    );
  }

  return (
    <Button
      shape="round"
      size="default"
      className={props.buttonClass}
      type="default"
      onClick={clickHandler}
    >
      Contact Them
    </Button>
  );
}

export default GooglePlacesLink;
