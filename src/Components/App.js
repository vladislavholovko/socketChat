import React from 'react';
import '../Sources/App.css';
import {StyleSheet, css} from 'aphrodite';
import io from 'socket.io-client';

const socket = io('http://dev.bidon-tech.com:65058/');

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      connect: false,
      addPeople: "",
      nickname: "",
      message: "",
      onlineList: [],
      allMessage: []
    };
    this.send = this.send.bind(this)
  }

  componentDidMount() {
    socket.on('connect', () => {
      socket.on('history', history => console.log('server history:', history));
      socket.on('online', list => {
        this.setState({onlineList: list});
      });
      socket.on('connected', nickname => {
        let mas = this.state.allMessage;
        let users = {nickname: "User " + nickname + " connected"};
        mas.push(users)
        this.setState({allMessage: mas});
      });
      socket.on('disconnected', nickname => {
        let mas = this.state.allMessage;
        let users = {nickname: "User " + nickname + " disconnect"};
        mas.push(users)
        this.setState({allMessage: mas});
      });
      socket.on('message', message => {
        let mas = this.state.allMessage;
        mas.push(message);
        this.setState({allMessage: mas});
        document.getElementById('mes').scroll(0, document.getElementById('mes').scrollHeight);
      })
    });
  };

  login(e) {
    e.preventDefault();
    let nickName = this.state.nickname;
    socket.emit('nickname', nickName, () => {
      this.setState({connect: true});
    })
  };

  send(e) {
    e.preventDefault();
    let massage = this.state.message;
    socket.emit('message', massage);
    this.setState({message: ""});
    console.log(this.state.onlineList);
    console.log(this.state.allMessage);
  };

  exit() {
    // this.setState({connect: false, nickname: "" })
    alert("You shall not pass!")
  };

  render() {
    let message = this.state.allMessage.map((value, index) => {
      return (
        <div key={index} className={css(styles.line)}>
          <div className={css(styles.name)}><b>{value.nickname}: </b></div>
          <div className={css(styles.message)}>{value.message}</div>
          <div className={css(styles.date)}>{value.date}</div>
        </div>
      )
    });
    return (
      <div className={this.state.connect ? css(styles.bodyFalse) : css(styles.bodyTrue)}>
        <form className={this.state.connect ? css(styles.nicknameInputTrue) : css(styles.nicknameInputFalse)}>
          <input type="text"
                 placeholder="Enter your nickname"
                 id="nickname"
                 value={this.state.nickname}
                 onChange={(val) => this.setState({nickname: val.target.value})}/>
          <button onClick={(e) => this.login(e)}>Create new coinflip</button>
        </form>
        {/*----*/}
        <div className={this.state.connect ? css(styles.chatTrue) : css(styles.chatFalse)}>
          <div className={css(styles.logo)}>
            <div className={css(styles.logoInfo)}>
              <div className={css(styles.logoImage)}>

              </div>
              <div className={css(styles.logoName)}>{this.state.nickname}</div>
            </div>
            <div className={css(styles.logoExit)}>
              <div onClick={() => this.exit()}>Exit</div>
            </div>
          </div>
          {/*-----*/}
          <div className={css(styles.massageChat)}>
            <div className={css(styles.messageBody)}>
              <b>CHAT</b>
              <div id="mes">
                {message}
                {this.state.addPeople !== "" ?
                  <div className={css(styles.connectedUsers)}>User: {this.state.addPeople} connected</div> :
                  <div></div>}
              </div>
            </div>
            <div className={css(styles.onlineUsers)}>
              <b>Online Users</b>
              <div>
                {this.state.onlineList.map((value, index) => <div key={index}>
                  <div></div>
                  <b>{value}</b></div>)}
              </div>
            </div>
          </div>
          {/*----*/}
          <form className={css(styles.massageInput)}>
            <input
              type="text"
              placeholder="Enter your message"
              id="message"
              value={this.state.message}
              onChange={(val) => this.setState({message: val.target.value})}/>
            <button onClick={(e) => this.send(e)}>Send</button>
          </form>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  bodyTrue: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bodyFalse: {
    width: '100%',
  },
  //-------
  nicknameInputTrue: {
    display: 'none'
  },
  nicknameInputFalse: {
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ':nth-child(1n) > input': {
      height: '30px',
      width: '700px',
      margin: ' 0 5px',
      paddingLeft: '10px',
      border: '1px solid rgb(244, 179, 66)',
      borderRadius: '5px',
      fontFamily: 'Skranji',
      ':hover': {
        border: '2px solid rgb(244, 179, 66)',
      },
      ':focus': {
        border: '2px solid rgb(244, 179, 66)',
        outline: 'none'
      }
    },
    ':nth-child(1n) > button': {
      height: '34px',
      margin: ' 0 5px',
      padding: '0 15px',
      outline: 'none',
      border: '1px solid #000',
      borderRadius: '5px',
      backgroundColor: 'rgba(206, 206, 206, 0.3)',
      fontFamily: 'Skranji',
      ':hover': {
        backgroundColor: 'rgba(206, 206, 206, 0.6)',
        border: '2px solid rgb(244, 179, 66)',
        cursor: 'pointer'
      },
    }
  },
  //----------------------
  chatFalse: {
    display: 'none'
  },
  chatTrue: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  //---
  logo: {
    width: '100%',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
  },
  logoInfo: {
    display: 'flex',
    justifyContent: 'flex-start',
    flex: '1',
    margin: '10px 10px'
  },
  logoImage: {
    width: '75px',
    height: '75px',
    border: '3px solid #000',
    borderRadius: '40px',
    backgroundColor: 'rgba(206,206,206,0.5)',
    ':hover': {
      boxShadow: '2px 2px 2px #000',
      marginBottom: '2px',
      backgroundColor: 'rgba(206,206,206,0.8)',
      cursor: 'pointer'
    }
  },
  logoName: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 10px',
    font: '30px Permanent Marker',

  },
  logoExit: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '10px 20px',
    ':nth-child(1n) > div': {
      font: '25px Concert One',
      ':hover': {
        cursor: 'pointer',
        textShadow: ' 2px 2px 5px #000'
      }
    }
  },
  //---
  massageChat: {
    width: '100%',
    display: 'flex',
    flex: '1',
  },
  messageBody: {
    flex: '1',
    margin: '20px 10px',
    border: '2px solid rgba(252, 191, 191, 0.7)',
    borderRadius: '7px',
    backgroundColor: 'rgba(255, 198, 198, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ':nth-child(1n) > b': {
      font: '25px Concert One',
      // margin:'5px 0'
    },
    ':nth-child(1n) > div': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'space-between',
      overflowY: 'auto'
    }
  },
  line: {
    width: '100%',
    minHeight: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px 0'
  },
  name: {
    padding: '0 15px',
    font: '20px Concert One',
  },
  message: {
    flex: '1',
    font: '24px Caveat'
  },
  date: {
    padding: '0 10px',
    font: '15px Concert One',
  },
  //---
  onlineUsers: {
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid rgba(252, 191, 191, 0.7)',
    borderRadius: '7px',
    backgroundColor: 'rgba(255, 198, 198, 0.3)',
    margin: '20px 10px',
    font: '25px Concert One',
    ':nth-child(1n)>div': {
      width: '100%',
      fontFamily: 'Caveat',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      overflowY: 'auto',
      ':nth-child(1n) > div': {
        minHeight: '32px',
        display: 'flex',
        margin: '5px 5px',
        ':nth-child(1n) > div': {
          width: '25px',
          height: '25px',
          border: '1px solid #000',
          borderRadius: '25px',
          backgroundColor: 'rgba(206,206,206,0.5)',
          margin: '0 5px',
          ':hover': {
            boxShadow: '2px 2px 2px #000',
            marginBottom: '2px',
            backgroundColor: 'rgba(206,206,206,0.8)',
            cursor: 'pointer'
          }
        }
      }
    },
  },
  //---
  massageInput: {
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ':nth-child(1n) > input': {
      flex: '1',
      height: '70px',
      margin: ' 0 5px 0 10px',
      padding: '0 10px',
      border: '1px solid rgb(244, 179, 66)',
      borderRadius: '5px',
      fontFamily: 'Skranji',
      ':hover': {
        border: '2px solid rgb(244, 179, 66)',
      },
      ':focus': {
        border: '2px solid rgb(244, 179, 66)',
        outline: 'none'
      }
    },
    ':nth-child(1n) > button': {
      height: '60px',
      margin: ' 0 10px 0 5px',
      width: '100px',
      outline: 'none',
      border: '1px solid #000',
      borderRadius: '5px',
      backgroundColor: 'rgba(206, 206, 206, 0.3)',
      fontFamily: 'Skranji',
      ':hover': {
        backgroundColor: 'rgba(206, 206, 206, 0.6)',
        border: '2px solid rgb(244, 179, 66)',
        cursor: 'pointer'
      },
    },
  },
});
export default App;
