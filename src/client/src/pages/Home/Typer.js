import React from 'react';

const TYPING_SPEED = 70;
const DELETING_SPEED = 30;
const WAIT_BEFORE_DELETING_SECONDS = 3;

class Typer extends React.Component {
  state = {
    text: '',
    isDeleting: false,
    loopNum: 0,
    typingSpeed: TYPING_SPEED
  }

  componentDidMount() {
    this.handleType();
  }

  handleType = () => {
    const { dataText } = this.props;
    const { isDeleting, loopNum, text, typingSpeed } = this.state;
    const fullText = dataText[loopNum];

    this.setState((state) => ({
      text: state.isDeleting ? fullText.substring(0, state.text.length - 1) : fullText.substring(0, state.text.length + 1),
      typingSpeed: state.isDeleting ? DELETING_SPEED : TYPING_SPEED
    }));

    if (!isDeleting && text === fullText) {     
      setTimeout(() => this.setState({ isDeleting: true }), WAIT_BEFORE_DELETING_SECONDS * 1000);
    } else if (isDeleting && text === '') {
      this.setState((state) => ({
        isDeleting: false
      }));
    } else {
      if (text.length === 1 && isDeleting) {
        this.setState((state) => ({
          loopNum: state.loopNum >= dataText.length-1 ? 0 : ++state.loopNum
        }));
      }
    }

    setTimeout(this.handleType, typingSpeed);
  };

  render() {
    return (
      <div>{ this.props.heading }&nbsp;
        <span>{ this.state.text }</span>
        <span className="typer-cursor">_</span>
      </div>
    );
  }
}

export default Typer;