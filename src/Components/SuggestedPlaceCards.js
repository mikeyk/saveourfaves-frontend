import React from "react";
import { Button, Row, Typography } from "antd";
import Skeleton from "react-loading-skeleton";
import { CallToActionButton } from "./CallToActionButton";
import { ExtraActionButtons } from "./ExtraActionButtons";

export class SuggestedPlaceCards extends React.Component {
  render() {
    const { Title } = Typography;
    var suggestedPlaceCards;
    if (this.props.suggestedPlaces && this.props.suggestedPlaces.length) {
      suggestedPlaceCards = this.props.suggestedPlaces.map(suggestion => (
        <div key={suggestion.placeID} className="suggested-place">
          <Row
            style={{
              backgroundSize: "cover",
              position: "relative",
              backgroundPosition: "center center",
              backgroundImage: "url(" + suggestion.imageURL + ")",
              minHeight: "80px"
            }}
          >
            <ExtraActionButtons place={suggestion} />
          </Row>
          <Row style={{ minHeight: "88px" }}>
            <Title
              className="suggestion-title"
              style={{
                textAlign: "center",
                width: "100%",
                marginTop: "12px",
                padding: "0px 6px"
              }}
              level={4}
            >
              {suggestion.name}
            </Title>
            <div style={{ margin: "0px auto" }}>
              <CallToActionButton place={suggestion} size={"default"} />
            </div>
          </Row>
        </div>
      ));
    } else {
      suggestedPlaceCards = [...Array(9).keys()].map(placeholder => (
        <div key={placeholder} className="suggested-place">
          <div style={{ marginTop: -4 }}>
            <Skeleton height={168} />
          </div>
        </div>
      ));
    }
    return (
      <div ref={this.props.passRef}>
        <section className="suggestions-container">
          <Row style={{ justifyContent: "center" }}>{suggestedPlaceCards}</Row>
        </section>
        {this.props.moreAvailable && (
          <div style={{ textAlign: "center" }}>
            <Button
              className="primary-button"
              shape="round"
              size="default"
              onClick={this.props.onLoadMore}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    );
  }
}
