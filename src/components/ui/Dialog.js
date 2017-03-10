import React, { PropTypes } from 'react';
import MDialog from 'material-ui/Dialog';
import './dialog.css';

const Dialog = props => (
  <MDialog
    {...props}

    repositionOnUpdate={false}
    autoDetectWindowHeight={false}
    autoScrollBodyContent={false}
    className="dialog-root"
    contentClassName="dialog-content"
    bodyClassName="dialog-body"
  >
    <div className="dialog-scroll" >
      {props.children}
    </div>
  </MDialog>
);

Dialog.propTypes = {
  children: PropTypes.node,
};

export default Dialog;
