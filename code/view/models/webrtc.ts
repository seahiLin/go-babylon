class RTC {
  constructor() {

  }

  public async connect() {
    return new Promise((resolve, reject) => {
      const signalingChannel = new WebSocket('ws://localhost:9000/rtc/signal');

      const configuration = {
        iceServers: [
          {
            urls: 'stun:stun.l.google.com:19302',
          },
        ],
      };
      console.log(11)
      signalingChannel.onopen = () => {
        signalingChannel.send(JSON.stringify({
          type: 'offer',
          sdp: '',
        }));
      };
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnection.onicecandidate = (event) => {
        console.log(event)
        signalingChannel.onopen = () => {
          console.log('signaling channel open');
          signalingChannel.send(JSON.stringify({
            type: 'candidate',
            data: event.candidate,
          }));
        }
      };
      // peerConnection.oniceconnectionstatechange = (event) => {
      //   console.log(event.target.iceConnectionState);
      // };
      // peerConnection.onnegotiationneeded = (event) => {
      //   console.log(event);
      // }
      // peerConnection.onconnectionstatechange = (event) => {
      //   console.log(event.target.connectionState);
      // }
    });
  }
}

export default RTC;