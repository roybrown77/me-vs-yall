export const spreadModeToggle = (flag) => (dispatch, getState) => {
  dispatch({
    type: 'SPREADMODETOGGLE',
    flag
  });
};