import React, { useState } from "react";
import { Modal } from "antd";
import axios from "axios";
import { LogEngagementEvent } from "../Logging";

export function AddLinkModal(props) {
  const [giftLink, setGiftLink] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [counter, setCounter] = useState(0);
  function resetAndClose() {
    setGiftLink(null);
    setHasSubmitted(false);
    setCounter(0);
    props.onClose();
  }
  function closeSoon() {
    window.setTimeout(() => {
      resetAndClose();
    }, 5000);
  }
  function handleLinkSubmission() {
    setHasSubmitted(true);
    LogEngagementEvent("user-action", "submitted-new-place");
    setCounter(1);
    axios
      .post("/api/places/submit_gift_card_link", {
        place_id: props.place.placeID,
        gift_card_url: giftLink
      })
      .then(response => {
        closeSoon();
      })
      .catch(error => {
        closeSoon();
      });
  }
  return (
    <Modal
      title={
        <span>
          Add a Gift Card link for <b>{props.place.name}</b>
        </span>
      }
      visible={props.shouldShow}
      onOk={args => {
        counter === 0 ? handleLinkSubmission() : resetAndClose();
      }}
      width="400px"
      destroyOnClose={true}
      okButtonProps={{ shape: "round", className: "primary-button" }}
      cancelButtonProps={{ shape: "round" }}
      okText={hasSubmitted ? "Done" : "Submit"}
      onCancel={resetAndClose}
    >
      {hasSubmitted && (
        <div>
          Thanks! We'll add this to our queue and get the listing updated as
          soon as possible.
        </div>
      )}
      {!hasSubmitted && (
        <input
          className="add-link-modal-input"
          onChange={event => {
            setGiftLink(event.target.value);
          }}
          type="text"
          placeholder="Please paste in the link to their gift card site"
          value={giftLink}
        />
      )}
    </Modal>
  );
}
