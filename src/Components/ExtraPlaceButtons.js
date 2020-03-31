import React from "react";
import { Button, Tooltip, message } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { LogEngagementEvent } from "../Logging";

export class ExtraPlaceButtons extends React.Component {
  render() {
    var place = this.props.place;
    return (
      <div className="place-buttons">
        <Tooltip title="copy">
          <Button
            shape="circle"
            size="small"
            type="default"
            icon={<ShareAltOutlined />}
            onClick={event => {
              LogEngagementEvent(
                "user-click",
                "share",
                place.placeID
              );
            navigator.clipboard.writeText(window.location.origin + "/" + place.placeID)
            message.success('Copied');
            }}
          >
          </Button>
        </Tooltip>
      </div>
    );
  }
}
