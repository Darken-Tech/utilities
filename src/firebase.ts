import {
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
  UploadMetadata,
} from "firebase/storage";
import { Firestore, doc, updateDoc } from "firebase/firestore";

export const _upload_file = async (
  storage: FirebaseStorage,
  path: string,
  file: Blob | Uint8Array | ArrayBuffer,
  metadata?: UploadMetadata
) => {
  const fileRef = ref(storage, path);
  const fileSnapshot = await uploadBytes(fileRef, file, metadata);
  const downloadURL = await getDownloadURL(fileSnapshot.ref);
  return downloadURL;
};

export const _update_doc = async (db: Firestore, path: string, data: any) => {
  return await updateDoc(doc(db, path), data);
};
