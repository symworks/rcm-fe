import React from "react";
import { connect } from "react-redux";

class UIColorsContextual extends React.Component {
  render() {
    return (
      <div className="col-lg-6 col-md-12">
        <div className="card">
          <div className="header">
            <h2>Contextual text Colors</h2>
          </div>
          <div className="body">
            <p>
              classes also work well on anchors with the provided hover and
              focus states.{" "}
              <strong>
                Note that the{" "}
                <code className="highlighter-rouge">.text-white</code> and{" "}
                <code className="highlighter-rouge">.text-muted</code> class has
                no link styling.
              </strong>
            </p>
            <p>
              <a className="text-primary" href="#!">Primary link</a>
            </p>
            <p>
              <a className="text-secondary" href="#!">Secondary link</a>
            </p>
            <p>
              <a className="text-success" href="#!">Success link</a>
            </p>
            <p>
              <a className="text-danger" href="#!">Danger link</a>
            </p>
            <p>
              <a className="text-warning" href="#!">Warning link</a>
            </p>
            <p>
              <a className="text-info" href="#!">Info link</a>
            </p>
            <p>
              <a className="text-light bg-dark" href="#!">Light link</a>
            </p>
            <p>
              <a className="text-dark" href="#!">Dark link</a>
            </p>
            <p>
              <a className="text-muted" href="#!">Muted link</a>
            </p>
            <p>
              <a className="text-white bg-dark" href="#!">White link</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(UIColorsContextual);
