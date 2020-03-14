import React from "react";
import { Button } from "antd";
import { EmailSubscription } from "./EmailSubscription";
import { LogEngagementEvent } from "../Logging";

export class CallToActionButton extends React.Component {
  render() {
    var place = this.props.place;
    var size = this.props.size;
    const emailBody =
      "Hi there! I was on SaveYourFave.org and saw that " +
      place.name +
      " offers gift certificates over email. I want to support you all, so please let me know how to proceed. Thanks, and stay healthy.";
    const className =
      size === "large" ? "large-primary-button" : "secondary-button";
    return (
      <div key={place.placeID}>
        {place.giftCardURL && (
          <Button
            shape="round"
            size={size}
            className={className}
            type="default"
            onClick={event => {
              LogEngagementEvent(
                "user-click",
                "get-gift-card-" + size,
                place.placeID
              );
              window.open(place.giftCardURL);
            }}
          >
            Get Gift Card
          </Button>
        )}
        {!place.giftCardURL && place.emailContact && (
          <Button
            shape="round"
            size={size}
            className={className}
            type="default"
            onClick={event => {
              LogEngagementEvent(
                "user-click",
                "email-for-gift-card-" + size,
                place.placeID
              );
              window.location.href =
                "mailto:" +
                place.emailContact +
                "?subject=Buying a Gift Card%3F&body=" +
                emailBody;
            }}
          >
            Get Gift Card
          </Button>
        )}
        {!place.giftCardURL && !place.emailContact && (
          <EmailSubscription place={this.props.place} buttonClass={className} />
        )}
      </div>
    );
  }
}
