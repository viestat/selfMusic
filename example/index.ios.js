import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  NativeModules,
  NavigatorIOS,
  Text,
  TouchableHighlight,
  View
} from 'react-native';


const SpotifyModule = NativeModules.SpotifyModule;

class logIn extends Component {

  componentWillMount() {
    return SpotifyModule.initWithCredentials('YOUR_CLIENT_ID','YOUR_REDIRECT_URL',['streaming'],(error) => {
        if(error){
          alert(`some ${error}`);
        }
      });
    
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.normalText}>
          React Native Spotify Module Basic Example!
        </Text>
        <TouchableHighlight
          style={styles.button}
          onPress={() => { 
            //Start Auth process
            SpotifyModule.loggedIn((res, accessToken) => {
              console.warn(res)
              if(!res) {
                SpotifyModule.startAuthenticationFlow((error, str) => {
                  if(!error){
                      console.log(`New Access Token ${str}`);
                      this.props.navigator.replace({
                        component: logInSuccess,
                        title: 'Success'
                      });
                    } else {
                      alert(error);
                    }
                  });
              } else {
                console.log(`Cached Access Token ${accessToken}`);
                this.props.navigator.replace({
                  component: logInSuccess,
                  title: 'Success'
                });
              }
            })
          }}
        >
          <Image
            resizeMode ={'contain'}
            style={styles.image}
            source={require('./assets/login-button-mobile.png')}
          />
        </TouchableHighlight>
      </View>
    );
  }

}

class logInSuccess extends Component {

  componentDidMount() {
    SpotifyModule.initialized((error) => {
      if(error) {
        console.warn(error)
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.normalText}>
          LogIn Success!
        </Text>
        <Text style={styles.normalText}>
          Select a song to start!
        </Text>
        <TouchableHighlight
          style={styles.button}
          onPress={() => {
            SpotifyModule.playSpotifyURI("spotify:track:12x8gQl2UYcQ3tizSfoPbZ", 0, 0.0, (error) => {
              if(error) {
                console.error('Something went wrong')
              }
            });
          }}
        >
          <Text style={styles.btnSong}>
            1. Sheen - Xeno & Oaklander
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={() => {
            SpotifyModule.playSpotifyURI("spotify:track:0U0ldCRmgCqhVvD6ksG63j", 0, 0.0, (error) => {
              if(error) {
                console.error('Something went wrong')
              }
            });
          }}
        >
          <Text style={styles.btnSong}>
            2. Nightcall - Kavinsky
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.button}
          onPress={() => {
            SpotifyModule.playbackState((res) => {
              if(res.isPlaying) {
                SpotifyModule.setIsPlaying(false, (err) => {
                  if(err){
                    console.warn('Pause', err);
                  }
                });
              } else {
                SpotifyModule.setIsPlaying(true, (err) => {
                  if(err){
                    console.warn('Play', err);
                  }
                });
              }
            })
          }}
        >
          <Text style={styles.btnText}>
            Play/Pause
          </Text>
        </TouchableHighlight>
      </View>
      );

  }

}

//Used to navigate between other components
class spotifyModule extends Component {
  render(){
    return (
      <NavigatorIOS
        initialRoute={{
          component: logIn,
          title: 'Log In ',
        }}
        style={{flex: 1}}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 45,
    borderRadius: 64
  },
  image: {
    width: 250,
    height: 50
  },
  normalText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  btnText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
  btnSong: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },

});

AppRegistry.registerComponent('spotifyModule', () => spotifyModule);
