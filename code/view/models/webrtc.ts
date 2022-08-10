class RTC {
  constructor() {

  }

  public async connect() {
    return new Promise((resolve, reject) => {
      const signalingChannel = new WebSocket('ws://localhost:9000/signal');

      const configuration = {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      };
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnection.onicecandidate = (event) => {
        signalingChannel.send(JSON.stringify({
          type: 'candidate',
          data: event.candidate,
        }));
      };
      peerConnection.oniceconnectionstatechange = (event) => {
        console.log(event.target.iceConnectionState);
      };
      peerConnection.onnegotiationneeded = (event) => {
        console.log(event);
      }
      peerConnection.onconnectionstatechange = (event) => {
        console.log(event.target.connectionState);
      }
    });
  }
}

export default RTC;