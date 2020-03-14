import React from "react";
import { Button, Popover } from "antd";
import axios from "axios";
import { AddLinkModal } from "./AddLinkModal";
import { LogEngagementEvent } from "../Logging";

export class EmailSubscription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      emailSubmitted: false,
      emailError: null,
      emailSuccess: null,
      showAddModal: false
    };
  }
  onEmailChange = event => {
    this.setState({
      email: event.target.value,
      emailSubmitted: false
    });
  };
  onEmailSubmit = event => {
    if (
      !this.state.email ||
      !this.state.email.length ||
      this.state.email.indexOf("@") === -1
    ) {
      this.setState({
        emailError: "Please enter an email."
      });
      return;
    }
    axios
      .post("/api/places/submit_email", {
        email: this.state.email,
        place_id: this.props.place.placeID
      })
      .then(response => {
        this.setState({
          emailError: null,
          emailSuccess: true
        });
      })
      .catch(error => {
        this.setState({
          emailError: "Sorry, we couldn't save your email."
        });
      });
  };
  hideAddLinkModal = () => {
    this.setState({ showAddModal: false });
  };
  render() {
    return (
      <Popover
        overlayClassName="email-popover"
        trigger="click"
        onVisibleChange={visible => {
          if (visible) {
            LogEngagementEvent(
              "user-click",
              "show-email-request-menu",
              this.props.place.placeID
            );
          }
        }}
        placement="bottomRight"
        content={
          <div className="email-popover-inner">
            {!this.state.emailSuccess && (
              <>
                <div>
                  <input
                    onChange={this.onEmailChange}
                    type="email"
                    value={this.state.email}
                    className="email-popover-input"
                    placeholder="Enter your email"
                  />
                  <Button
                    className="email-confirm-button"
                    shape="round"
                    size="default"
                    onClick={this.onEmailSubmit}
                    type="default"
                  >
                    OK
                  </Button>
                </div>
              </>
            )}
            {this.state.emailError && (
              <div class="email-popover-error">{this.state.emailError}</div>
            )}
            {!this.state.emailSuccess && (
              <>
                <AddLinkModal
                  shouldShow={this.state.showAddModal}
                  place={this.props.place}
                  onClose={() => {
                    this.hideAddLinkModal();
                  }}
                />
                <p>
                  We'll let the business know you're interested. We promise not
                  to spam you.
                </p>
                <p>
                  (If you've found their link{" "}
                  <a
                    onClick={() => {
                      this.setState({ showAddModal: true });
                    }}
                  >
                    let us know
                  </a>
                  )
                </p>
              </>
            )}
            {this.state.emailSuccess && (
              <div class="email-popover-success">
                Thanks! We'll let them know.
              </div>
            )}
          </div>
        }
      >
        <Button
          shape="round"
          size="default"
          className={this.props.buttonClass}
          type="default"
        >
          Request Gift Card
        </Button>
      </Popover>
    );
  }
}
