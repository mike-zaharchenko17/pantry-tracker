"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from "react-camera-pro";

const CameraInterface = () => {
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const camera = useRef(null);
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(undefined);
  const [torchToggled, setTorchToggled] = useState(false);
  const [awaitingAsync, setAwaitingAsync] = useState(false);
  const router = useRouter();


  const classify = async (image) => {
    try {
      setAwaitingAsync(true);
      const response = await fetch("/api/item-add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoB64: image })
      });
      setAwaitingAsync(false);

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    (async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setDevices(videoDevices);
    })();
  }, []);

  if (showImage && image) {
    return awaitingAsync ? (
      <div className="fixed inset-0 z-10">
        <div
          className="absolute inset-0 z-50 bg-center bg-cover"
          style={{ backgroundImage: `url(${image})` }}
        >
            <div className="fixed flex flex-col-reverse items-center justify-around right-0 w-full bg-purple-400 bg-opacity-20 p-12 box-border z-20 
              md:flex-col md:bottom-0 md:h-full m:h-full md:w-auto sm:w-auto md:p-2 sm:h-full
              sm: bottom-0 xs:bottom-0 xs:h-1/4"
            >
              <button className="bg-purple-800 rounded text-lg text-center h-12 p-2 my-5 mx-5" onClick={() => setShowImage(false)}>Retake</button>
              <button className="bg-purple-800 rounded text-lg text-center h-12 p-2 my-5 mx-5" onClick={() => classify(image)}>Classify</button>
              <div role="status mt-2">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-200 fill-purple-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
        </div>
      </div>
    ) : (
    <div className="fixed inset-0 z-10">
      <div
        className="absolute inset-0 z-50 bg-center bg-cover"
        style={{ backgroundImage: `url(${image})` }}
      >
          <div className="fixed flex flex-col-reverse items-center justify-around right-0 w-full bg-purple-400 bg-opacity-20 p-12 box-border z-20 
            md:flex-col md:bottom-0 md:h-full m:h-full md:w-auto sm:w-auto md:p-2 sm:h-full
            sm: bottom-0 xs:bottom-0 xs:h-1/4"
          >
          <button className="bg-purple-800 rounded text-lg text-center h-12 p-2 my-5 mx-5" onClick={() => setShowImage(false)}>Retake</button>
          <button className="bg-purple-800 rounded text-lg text-center h-12 p-2 my-5 mx-5" onClick={() => classify(image)}>Classify</button>
        </div>
      </div>
    </div>
    )
  } else {
    return (
      <div className="fixed inset-0 z-10">
          <Camera
            ref={camera}
            aspectRatio="cover"
            numberOfCamerasCallback={(num) => setNumberOfCameras(num)}
            videoSourceDeviceId={activeDeviceId}
            errorMessages={{
              noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
              permissionDenied: 'Permission denied. Please refresh and give camera permission.',
              switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
              canvas: 'Canvas is not supported.',
            }}
            videoReadyCallback={() => {
              console.log('Video feed ready.');
            }}
          />
         <div className="fixed flex flex-col-reverse items-center justify-around right-0 w-full bg-purple-400 bg-opacity-10 p-12 box-border z-20 
                        md:flex-col md:bottom-0 md:h-full m:h-full md:w-auto sm:w-auto md:p-2 sm:h-full
                        sm: bottom-0 xs:bottom-0 xs:h-1/4">
            <select
              className="bg-purple-700 text-white rounded p-2 mx-2"
              onChange={(event) => setActiveDeviceId(event.target.value)}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
            <button
              className="bg-purple-700 rounded text-lg text-center h-12 p-2 my-5"
              onClick={() => {
                const photo = camera.current.takePhoto();
                setImage(photo);
                setShowImage(true);
                console.log(image);
              }}
            >
              Take Photo
            </button>
            {camera.current?.torchSupported && (
              <button
                className={`bg-[url('https://img.icons8.com/ios/50/000000/light.png')] bg-center bg-no-repeat bg-contain w-20 h-20 rounded-full border-4 border-black filter invert-100 ${torchToggled ? 'bg-black/30' : ''}`}
                onClick={() => {
                  if (camera.current) {
                    setTorchToggled(camera.current.toggleTorch());
                  }
                }}
              />
            )}
            <button
              className={`bg-[url('https://img.icons8.com/ios/50/000000/switch-camera.png')] bg-center bg-no-repeat bg-contain w-10 h-10 rounded-full p-10 filter invert-100 ${numberOfCameras <= 1 ? 'opacity-0 cursor-default' : ''}`}
              disabled={numberOfCameras <= 1}
              onClick={() => {
                if (camera.current) {
                  const result = camera.current.switchCamera();
                  console.log(result);
                }
              }}
            />
        </div>
      </div>  
    );
  }
}

export default CameraInterface;