import React from "react";
import { RegisterNode } from "gg-editor";

class StartNode extends React.Component {
    render() {
      const config = {
        draw(item) {
  
        },
        anchor: [
          [0, 0.5],
          [1, 0.5],
          [0.5, 0],
          [0.5, 1]
        ]
      };
  
      return (
        <RegisterNode name="start-node" config={config} extend={"flow-rect"} />
      );
    }
  }
  
  export default StartNode;