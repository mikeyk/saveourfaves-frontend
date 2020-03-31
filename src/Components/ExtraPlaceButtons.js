import React from "react";
import { Button, Tooltip, message } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { LogEngagementEvent } from "../Logging";

export class ExtraPlaceButtons extends React.Component {

  copyToClipboard(str){
    if(navigator.clipboard){
      navigator.clipboard.writeText(str)
    }
    else{
      const el = document.createElement('textarea');
      el.value = str
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    message.success('Copied');
  }

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
              this.copyToClipboard(window.location.origin + "/" + place.placeID)
            }}
          >
          </Button>
        </Tooltip>
      </div>
    );
  }
}
