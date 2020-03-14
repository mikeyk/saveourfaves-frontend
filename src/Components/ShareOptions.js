import React from "react";
import { Button } from "antd";
import { FacebookProvider, Share } from "react-facebook";
export class ShareOptions extends React.Component {
  shareToFB() {}
  render() {
    return (
      <div>
        <FacebookProvider appId="202370887681802">
          <Share href="https://saveourfaves.org">
            {({ handleClick, loading }) => (
              <Button
                onClick={handleClick}
                shape="round"
                className="secondary-button"
              >
                Facebook
              </Button>
            )}
          </Share>
        </FacebookProvider>

        <Button
          style={{ marginLeft: 12 }}
          shape="round"
          className="secondary-button"
          onClick={() => {
            window.open(
              "https://twitter.com/intent/tweet?url=https://saveourfaves.org&text=San%20Francisco%20businesses%20need%20us%20more%20than%20ever%20%E2%80%93%20gift%20cards%20can%20make%20a%20big%20difference.%20Please%20join%20me%20in%20supporting%20your%20favorite%20restaurants%20at"
            );
          }}
        >
          Twitter
        </Button>
      </div>
    );
  }
}

export default ShareOptions;