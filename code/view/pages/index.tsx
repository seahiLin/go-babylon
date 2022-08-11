import { useState, useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import RTC from "../models/webrtc";

import styles from "./index.module.scss";

const Cam = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rtcRef = useRef<RTC>(null);

  useEffect(() => {
    renderCam()
    initRtc()
  }, []);

  const renderCam = () => {
    const videoElem = document.createElement("video");

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      .then((stream) => {
        const { width, height } = stream.getVideoTracks()[0].getSettings();
        videoElem.width = width;
        videoElem.height = height;
        videoElem.srcObject = stream;
        videoElem.play();

        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;

        const engine = new BABYLON.Engine(canvas, true);

        const scene = createScene(engine, canvas, videoElem);

        engine.runRenderLoop(() => {
          scene.render();
        });

        return () => {
          engine.dispose();
        };
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const createScene = (engine, canvas, videoElem) => {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera(
      "arcR",
      -Math.PI / 2,
      Math.PI / 2,
      15,
      BABYLON.Vector3.Zero(),
      scene
    );

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    var planeOpts = {
      height: 5.4762,
      width: 7.3967,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    };
    var ANote0Video = BABYLON.MeshBuilder.CreatePlane(
      "plane",
      planeOpts,
      scene
    );
    var vidPos = new BABYLON.Vector3(0, 0, 0.1);
    ANote0Video.position = vidPos;
    var ANote0VideoMat = new BABYLON.StandardMaterial("m", scene);
    var ANote0VideoVidTex = new BABYLON.VideoTexture(
      "vidtex",
      videoElem,
      scene
    );
    ANote0VideoMat.diffuseTexture = ANote0VideoVidTex;
    ANote0VideoMat.roughness = 1;
    ANote0VideoMat.emissiveColor = BABYLON.Color3.White();
    ANote0Video.material = ANote0VideoMat;
    scene.onPointerObservable.add(function (evt) {
      if (evt.pickInfo.pickedMesh === ANote0Video) {
        //console.log("picked");
        if (ANote0VideoVidTex.video.paused) ANote0VideoVidTex.video.play();
        else ANote0VideoVidTex.video.pause();
        console.log(ANote0VideoVidTex.video.paused ? "paused" : "playing");
      }
    }, BABYLON.PointerEventTypes.POINTERPICK);

    return scene;
  };

  const initRtc = async() => {
    const rtc = new RTC();
    const connection = await rtc.connect();
    connection.ontrack = (event) => {
      const video = videoRef.current;
      video.srcObject = event.streams[0];
      video.play();
    }
    const canvas = canvasRef.current;
    const stream = canvas.captureStream();
    connection.addTrack(stream.getVideoTracks()[0]);
    rtcRef.current = rtc;
  }

  const makeCall = () => {
    rtcRef.current?.sendOffer();
  }

  return (
    <div>
      <canvas className={styles.canvas} ref={canvasRef}></canvas>
      <video className={styles.video} ref={videoRef}></video>
      <div className={styles.call} onClick={makeCall}>call</div>
    </div>
  );
};

export default Cam;
