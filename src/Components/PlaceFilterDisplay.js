import React from "react";
import axios from "axios";
import { NearbySpots } from "./NearbySpots";
import { PlaceResultMain } from "./PlaceResultMain";
import { PlaceAutosuggestion } from "./PlacesAutosuggestion";
import Areas from "../CityData/Areas";

export class PlaceFilterDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      hasFetched: false,
      place: null,
      suggestedPlaces: null
    };
    this.elementRef = React.createRef();
  }

  updateAreaFromPlace = place => {
    if (Areas[place.area]) {
      this.props.updateArea(place.area);
    }
  };

  fetchPlaceInfo = (scrollElementRef, placeKey) => {
    axios
      .get("/api/places/detail", {
        params: {
          place_id: placeKey
        }
      })
      .then(response => {
        this.updateAreaFromPlace(response.data.place);
        const place = response.data.place;
        const suggestions = response.data.suggestedPlaces;
        this.setState((state, props) => {
          return { place: place, suggestedPlaces: suggestions };
        });
      });
  };
  render() {
    return (
      <div ref={this.elementRef}>
        <PlaceAutosuggestion
          onPlaceSelected={placeID => {
            this.fetchPlaceInfo(this.elementRef, placeID);
          }}
          onSearchChanged={newValue => {
            if (newValue.length === 0) {
              this.setState({ place: null, suggestedPlaces: null });
            }
          }}
        />
        <div style={{ textAlign: "left" }}>
          <PlaceResultMain place={this.state.place} />
          {this.state.suggestedPlaces &&
            this.state.suggestedPlaces.length > 0 && (
              <NearbySpots suggestedPlaces={this.state.suggestedPlaces} />
            )}
        </div>
      </div>
    );
  }
}

export default PlaceFilterDisplay;
