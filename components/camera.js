import React, { useRef, useState } from "react";

const CameraComponent = () => {
  const videoRef = useRef(null); // Video akışı için referans
  const canvasRef = useRef(null); // Fotoğraf çekimi için referans
  const [base64Image, setBase64Image] = useState(null); // Çekilen fotoğrafın base64 formatı

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // "user" ön kamera, "environment" arka kamera
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Kameraya erişim reddedildi:", err);
    }
  };

  const takePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Fotoğrafı Base64 formatında al
      const base64 = canvas.toDataURL("image/png");
      setBase64Image(base64);

      // Kamerayı otomatik kapat
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null; // Kamera akışını durdur
    }
  };

  return (
    <div>
      {!base64Image ? (
        <>
          <button onClick={startCamera}>
            Fotoğraf Çekmek İçin Kamerayı Başlat
          </button>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: "100%",
              maxWidth: "400px",
              border: "1px solid #ccc",
              display: videoRef.current?.srcObject ? "block" : "none",
            }}
          ></video>
          <canvas
            ref={canvasRef}
            style={{ display: "none" }} // Canvas görünmez
          ></canvas>
          {videoRef.current?.srcObject && (
            <button onClick={takePhoto}>Fotoğraf Çek</button>
          )}
        </>
      ) : (
        <div>
          <h3>Fotoğraf Çekildi!</h3>
          <button onClick={() => setBase64Image(null)}>
            Başka Fotoğraf Çek
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
