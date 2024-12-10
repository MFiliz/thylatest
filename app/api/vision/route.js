import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";
import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Google Vision API ve Cloud Storage istemcileri
const visionClient = new vision.ImageAnnotatorClient({
  credentials: {
    type: "service_account",
    project_id: "thyvisionapi",
    private_key_id: "ec4512d1638f4b40ea3557f070461f4d715e8a66",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFi8F7loPG2xn+\nSGPJhaUvkJqnqmHyKeJjOF1ZuZC+LpLrvLtyvq+1hEksu4t5Kg8D9TXNfDdjvPTg\nLGxpcDAO1xpCTrJTcdDKnf3FNI/mX9VObkbQsCiy3I2nepeUILvRLx2juytNcn0K\nsoS6wA98WwafsRgIseMO0h7zg21IROYK2wo1QKrOJNw0xtusC10n5CG+8dG9Iaq9\np+bb8qrtfVZDjBLQZGZ4hJn/gNDTBEfPj9buiNeTnLD9IbMTIM9J1QUD4Cmd0Yjz\n7Vvi5+E+n0onAGKhSZxBh/WiV87xqXJtu2pfIXWa86ZkOPpvwPhLiK0oNbrBIwHW\n5OFAyB5HAgMBAAECggEAGa7cVl2Qv2NQA1PVCWfDPKZfvQm1Vz8jzEORO2+ZRmiW\nuGhetIHfJUnQG608amHR9vFD7/XE28Y+zgBojeLElMFZjCJgI+Ipw5X73s5BITH3\ncQ18TniAqhRrpEkXeO4yjPVDtLxKWnTWlfP0trTurnvFJjDnj4XVH+GonX9KT3lO\n7+o2APMu8BXg9RvaeghkjduDL9TfMOulFlBVE8X6959S3xBECZ1siKLRDSDkq0s+\nu1hy6q3Hj2vJwKiVDVrvr9mer7CmPYmlhcW5dz/mgQuEVDbh16trfJZscEf5J0fh\nM1WApgxkycXUdR3VTo/pYKrviedMeqK6xBN4AXbrbQKBgQD4AXf1VQOaeuzO1cLs\nh2zSLgKmpiQMc8N2ZLPD2c0l1udQH2XYevD4VVHTfaxL8k3DQFyDGLdgBGsImSmw\neUe+Vs65xjRofFgVqXOhXt0mC/nKVxmxLaSWlNm8BIZvAniuytOnnjzrwbNXgp8t\nU3mVVUh9dgqstE14Y1n+rxIiwwKBgQDL6eUt/SbCMxN8Z0xqZE3S6Wn9ZHxgqA9w\n2D4UyzjkTF+JiD2hSYYsiDMhXY1gzYv1QZLF7ZAkQMfVWs9aSiseS7lJeVSgHtlO\nxf+1OoZ+qI7k4I4LC4AIJy1vgupBDiaradvCGyHV5yxw+/ER22PEHFLWkl7H/Jp8\nbr5GXcPWLQKBgBwvToq7FqW/wpnfAUAQQ/W+9N4rk302ysfxudxQLFhYjAE3EEQB\n9NDEIYB/j80xxFSkQ99CN9TZq7BWd75uihC/nM7QD7SwLPKJR3LXbRqd0c2FCI5y\nOXpDgFs1yHFlPoHe2x75hMLmSJNxbNWh3vdxscNQXvYxp3w/DkM7cjwxAoGAJ995\nl++Ld6fjJI1SbO9mJFrOBeVzSLc0Jb2zDf/bBRFGES+Z1YL6AJU1Yk3XylkHCBMl\nbxyP9fbQ3JBgQWiFW+w0tABMou7FUVj4MmjaScQOBQU/4TsDcxSuFsMDqWrp9tTB\nSwhhKmGE2Cb7saEztfJP5HNEo1hqoPBKtpm5JJUCgYEA9/oETrQXUcOtlF3EqmtW\nlle+DoFqWbjhzWZ5faW3JwhbNcDUS8rTkl4wEHUqfU5QobftdKNqgwxDIPof88Km\nodLXq2NRAKUtjnUXAHZyEHH+E+plPws+rDZVkgspNS7yHbSYQhF58CpUewVq3mYE\n8ygWMKP5qbYG9k7QUKkvQB4=\n-----END PRIVATE KEY-----\n",
    client_email: "thyvisionapi@thyvisionapi.iam.gserviceaccount.com",
    client_id: "109058761569509017529",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/thyvisionapi%40thyvisionapi.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  },
});
const storageClient = new Storage({
  credentials: {
    type: "service_account",
    project_id: "thyvisionapi",
    private_key_id: "ec4512d1638f4b40ea3557f070461f4d715e8a66",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFi8F7loPG2xn+\nSGPJhaUvkJqnqmHyKeJjOF1ZuZC+LpLrvLtyvq+1hEksu4t5Kg8D9TXNfDdjvPTg\nLGxpcDAO1xpCTrJTcdDKnf3FNI/mX9VObkbQsCiy3I2nepeUILvRLx2juytNcn0K\nsoS6wA98WwafsRgIseMO0h7zg21IROYK2wo1QKrOJNw0xtusC10n5CG+8dG9Iaq9\np+bb8qrtfVZDjBLQZGZ4hJn/gNDTBEfPj9buiNeTnLD9IbMTIM9J1QUD4Cmd0Yjz\n7Vvi5+E+n0onAGKhSZxBh/WiV87xqXJtu2pfIXWa86ZkOPpvwPhLiK0oNbrBIwHW\n5OFAyB5HAgMBAAECggEAGa7cVl2Qv2NQA1PVCWfDPKZfvQm1Vz8jzEORO2+ZRmiW\nuGhetIHfJUnQG608amHR9vFD7/XE28Y+zgBojeLElMFZjCJgI+Ipw5X73s5BITH3\ncQ18TniAqhRrpEkXeO4yjPVDtLxKWnTWlfP0trTurnvFJjDnj4XVH+GonX9KT3lO\n7+o2APMu8BXg9RvaeghkjduDL9TfMOulFlBVE8X6959S3xBECZ1siKLRDSDkq0s+\nu1hy6q3Hj2vJwKiVDVrvr9mer7CmPYmlhcW5dz/mgQuEVDbh16trfJZscEf5J0fh\nM1WApgxkycXUdR3VTo/pYKrviedMeqK6xBN4AXbrbQKBgQD4AXf1VQOaeuzO1cLs\nh2zSLgKmpiQMc8N2ZLPD2c0l1udQH2XYevD4VVHTfaxL8k3DQFyDGLdgBGsImSmw\neUe+Vs65xjRofFgVqXOhXt0mC/nKVxmxLaSWlNm8BIZvAniuytOnnjzrwbNXgp8t\nU3mVVUh9dgqstE14Y1n+rxIiwwKBgQDL6eUt/SbCMxN8Z0xqZE3S6Wn9ZHxgqA9w\n2D4UyzjkTF+JiD2hSYYsiDMhXY1gzYv1QZLF7ZAkQMfVWs9aSiseS7lJeVSgHtlO\nxf+1OoZ+qI7k4I4LC4AIJy1vgupBDiaradvCGyHV5yxw+/ER22PEHFLWkl7H/Jp8\nbr5GXcPWLQKBgBwvToq7FqW/wpnfAUAQQ/W+9N4rk302ysfxudxQLFhYjAE3EEQB\n9NDEIYB/j80xxFSkQ99CN9TZq7BWd75uihC/nM7QD7SwLPKJR3LXbRqd0c2FCI5y\nOXpDgFs1yHFlPoHe2x75hMLmSJNxbNWh3vdxscNQXvYxp3w/DkM7cjwxAoGAJ995\nl++Ld6fjJI1SbO9mJFrOBeVzSLc0Jb2zDf/bBRFGES+Z1YL6AJU1Yk3XylkHCBMl\nbxyP9fbQ3JBgQWiFW+w0tABMou7FUVj4MmjaScQOBQU/4TsDcxSuFsMDqWrp9tTB\nSwhhKmGE2Cb7saEztfJP5HNEo1hqoPBKtpm5JJUCgYEA9/oETrQXUcOtlF3EqmtW\nlle+DoFqWbjhzWZ5faW3JwhbNcDUS8rTkl4wEHUqfU5QobftdKNqgwxDIPof88Km\nodLXq2NRAKUtjnUXAHZyEHH+E+plPws+rDZVkgspNS7yHbSYQhF58CpUewVq3mYE\n8ygWMKP5qbYG9k7QUKkvQB4=\n-----END PRIVATE KEY-----\n",
    client_email: "thyvisionapi@thyvisionapi.iam.gserviceaccount.com",
    client_id: "109058761569509017529",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/thyvisionapi%40thyvisionapi.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  },
});

const BUCKET_NAME = "thyvisionapi"; // Buraya Google Cloud Storage Bucket.

async function uploadToCloudStorage(filePath, destination) {
  await storageClient.bucket(BUCKET_NAME).upload(filePath, {
    destination,
  });
  return `gs://${BUCKET_NAME}/${destination}`;
}

async function processPdf(filePath) {
  const destination = `uploads/${uuidv4()}.pdf`; // Unique bir dosya adı oluşturuyoruz.
  const gcsUri = await uploadToCloudStorage(filePath, destination);

  // Google Vision API ile OCR işleme
  const [operation] = await visionClient.asyncBatchAnnotateFiles({
    requests: [
      {
        inputConfig: {
          gcsSource: { uri: gcsUri },
          mimeType: "application/pdf",
        },
        features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
        outputConfig: {
          gcsDestination: { uri: `gs://${BUCKET_NAME}/results/` },
        },
      },
    ],
  });

  const [response] = await operation.promise();

  const [result] = await storageClient
    .bucket(BUCKET_NAME)
    .file("results/output-1-to-1.json")
    .download();

  const parsedResult = JSON.parse(result);
  const textAnnotations = parsedResult.responses.flatMap((res) =>
    res.fullTextAnnotation ? res.fullTextAnnotation.text : []
  );

  return textAnnotations;
}

async function processImage(filePath) {
  const [result] = await visionClient.textDetection(filePath);
  const detections = result.textAnnotations;
  return detections.map((text) => text.description);
}

export async function POST(req) {
  try {
    const { imageBase64, fileType } = await req.json();
    const buffer = Buffer.from(imageBase64, "base64");

    // Dosyayı geçici olarak kaydet
    const filePath = path.join(
      process.cwd(),
      `temp-file.${fileType === "pdf" ? "pdf" : "jpg"}`
    );
    fs.writeFileSync(filePath, buffer);

    let results;
    if (fileType === "pdf") {
      results = await processPdf(filePath);
    } else if (fileType === "image") {
      results = await processImage(filePath);
    } else {
      throw new Error(
        "Unsupported file type. Only 'image' and 'pdf' are allowed."
      );
    }

    // Geçici dosyayı temizle
    fs.unlinkSync(filePath);

    return NextResponse.json({ text: results });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
