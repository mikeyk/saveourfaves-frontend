import React from "react";
import { Row, Col } from "antd";
import { AddLinkModal } from "./AddLinkModal";
import { CallToActionButton } from "./CallToActionButton";
import { ExtraActionButtons } from "./ExtraActionButtons";
export class PlaceResultMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddModal: false
    };
  }
  hideAddLinkModal = () => {
    this.setState({
      showAddModal: false
    });
  };
  render() {
    var place = this.props.place;
    if (!place) {
      return null;
      place = {
        name: "The Snug",
        address: "2301 Fillmore Street",
        giftCardURL:
          "https://www.toasttab.com/the-snug-san-francisco/giftcards",
        donationURL:
          "https://www.toasttab.com/the-snug-san-francisco/giftcards",
        takeoutURL: null,
        placeURL: null,
        emailContact: null,
        imageURL:
          "https://lh3.googleusercontent.com/p/AF1QipM09mIPRVymgGeEM5ZSYH21AhYHk-uZQPKrC8c=s1600-w800",
        placeID: "ChIJ-_7qDsaAhYARKG4Gj6yw2ho"
      };
    }
    return (
      <Row className="place-result">
        <Col
          xs={24}
          sm={24}
          md={8}
          lg={8}
          xl={8}
          style={{
            minHeight: "100px",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundImage: "url(" + place.imageURL + ")"
          }}
        ></Col>
        <Col
          xs={24}
          sm={24}
          jjkk
          md={16}
          lg={16}
          xl={16}
          style={{ padding: "8px 16px" }}
        >
          <Row align="center">
            <Col span={14} className="flex-vertical">
              <h2 className="place-title">{place.name}</h2>
            </Col>
            <Col span={10} className="flex-vertical">
              <div style={{ textAlign: "right" }} className="place-address">
                {place.address.split(",")[0]}
              </div>
            </Col>
          </Row>
          <Row align="center">
            <Col span={24} className="flex-vertical">
              <ExtraActionButtons place={place} />
            </Col>
          </Row>
          <Row style={{ minHeight: 80 }} align="bottom">
            <Col
              xs={24}
              sm={14}
              md={14}
              lg={14}
              xl={14}
              style={{ position: "relative", top: 12 }}
            >
              {place.giftCardURL && (
                <p>
                  {place.name} offers gift cards online. Consider prepaying for
                  a month of spending.
                </p>
              )}
              {!place.giftCardURL && place.emailContact && (
                <p>Consider prepaying for a month of spending.</p>
              )}
              {!place.giftCardURL && !place.emailContact && (
                <p>
                  Do they have a link to sell gift cards?{" "}
                  <a
                    className="app-link"
                    onClick={() => this.setState({ showAddModal: true })}
                  >
                    Point us to it here.
                  </a>
                </p>
              )}
            </Col>
            <Col
              className="flex-vertical"
              xs={24}
              sm={10}
              md={10}
              lg={10}
              xl={10}
            >
              <div className="call-to-action-outer">
                <CallToActionButton place={place} size="large" />
              </div>
            </Col>
            <AddLinkModal
              shouldShow={this.state.showAddModal}
              place={place}
              onClose={() => {
                this.hideAddLinkModal();
              }}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}
