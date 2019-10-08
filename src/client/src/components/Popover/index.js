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
      <div style={props.titleStyle} onClick={handleClick}>
        {props.title}
      </div>
      {
        (props.segments || []).map((segment,index)=>
          <div 
            key={index} 
            onClick={handleClick}
            style={{fontSize:'30px', display:'flex', color:'darkgreen', borderBottom: props.segments.length-1 === index ? 'none' : '3px solid lightgreen'}}
          >
            <div style={{minWidth:'75px', padding:'10px', borderRight:'solid 3px lightgreen'}}>
              {segment.amount}
            </div>
            <div style={{width:'100%', padding:'10px'}}>
              {segment.description}
            </div>
          </div>
        )
      }
      <div style={props.subTitleStyle} onClick={handleClick}>
        {props.subTitle}
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