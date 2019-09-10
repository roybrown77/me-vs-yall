import React from 'react';
import Popover from '@material-ui/core/Popover';

export default function SimplePopover(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = !!anchorEl ? Boolean(anchorEl) : false;
  const id = open ? 'simple-popover' : undefined;

  return (
    <div style={props.borderStyle}>
      <div 
        style={props.titleStyle}
        onClick={handleClick}>
        {props.title}
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {props.children}
      </Popover>
    </div>
  );
}