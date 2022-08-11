class RTC {
  peerConnection: RTCPeerConnection;
  signalingChannel: WebSocket;

  constructor() {}

  public async connect() {
    const signalingChannel = this.signalingChannel = new WebSocket(
      "ws://localhost:9000/rtc/signal"
    );
    const configuration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    const peerConnection = this.peerConnection = new RTCPeerConnection(configuration);
    
    signalingChannel.onopen = async () => {
      peerConnection.onicecandidate = (event) => {
        signalingChannel.send(
          JSON.stringify({
            type: "candidate",
            room: "test",
            data: event.candidate,
          })
        );
      };

      signalingChannel.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "offer") {
          peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.data)
          );
          const answer = await peerConnection.createAnswer();
          peerConnection.setLocalDescription(answer);
          signalingChannel.send(
            JSON.stringify({
              type: "answer",
              room: "test",
              data: answer,
            })
          );
        } else if (data.type === "answer") {
          peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.data)
          );
        } else if (data.type === "candidate") {
          peerConnection.addIceCandidate(new RTCIceCandidate(data.data));
        }
      };
    };

    return peerConnection;
  }

  public async sendOffer() {
    const offer = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(offer);
    await this.signalingChannel.send(
      JSON.stringify({
        type: "offer",
        room: "test",
        data: offer,
      })
    );
  }
}

export default RTC;