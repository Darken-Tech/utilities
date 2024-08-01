type FirebaseApp = import("firebase/app").FirebaseApp;
type Firestore = import("firebase/firestore").Firestore;
type FirebaseStorage = import("firebase/storage").FirebaseStorage;

export declare interface Options {
  firebase?: {
    app: FirebaseApp;
  };
}

export declare interface Firebase {
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
}
