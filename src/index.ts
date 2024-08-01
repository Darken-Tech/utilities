import { UploadMetadata, getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import { _update_doc, _upload_file } from "./firebase";
import { Firebase, Options } from "types/main";

class Utilities {
  public firebase: Firebase | null = null;

  constructor() {}

  init(options?: Options) {
    if (options?.firebase) {
      this.firebase = {
        app: options.firebase.app,
        db: getFirestore(options.firebase.app),
        storage: getStorage(options.firebase.app),
      };
    }
  }

  /**
   *
   * sorts the array of object by the "name" property
   *
   * @param {any[]} items array of objects
   * @returns {*} sorted array of objects
   */
  sort_by(items: any[]): any[] {
    items.sort((a, b) => {
      const name1 = a.name.toUpperCase();
      const name2 = b.name.toUpperCase();
      return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
    });
    return items;
  }

  /**
   *
   * Converts json array to to csv format.
   *
   * @param {any[]} items array of objects
   * @param {string} filename Browser: the name of the file which would be downloaded. NodeJS: path + name of the file which would be saved
   * @param {boolean} [download=true] download the csv file with {filename} along with returning csv string
   * @returns {Promise<string>} csv string
   */
  async json_to_csv(
    items: any[],
    filename: string,
    download: boolean = true
  ): Promise<string> {
    const replacer = (_: any, value: any) =>
      typeof value === "string" ? value : JSON.stringify(value); // specify how you want to handle null values here
    const header = Object.keys(items[0]).sort();
    const csv = [
      header.join(","), // header row first
      ...items.map((row: any) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");

    if (!download) {
      return csv;
    } else {
      if (typeof window === "undefined") {
        const fs = await import("fs/promises");
        await fs.writeFile(filename, csv);
      } else {
        const blob = new Blob([csv], { type: "text/csv" });
        // @ts-expect-error
        if (window.navigator?.msSaveOrOpenBlob) {
          // @ts-expect-error
          window.navigator?.msSaveBlob(blob, filename);
        } else {
          const elem = window.document.createElement("a");
          elem.href = window.URL.createObjectURL(blob);
          elem.download = filename;
          document.body.appendChild(elem);
          elem.click();
          document.body.removeChild(elem);
        }
      }
      return csv;
    }
  }

  /**
   * Uploads file to google cloud storage.
   *
   * NOTE: This is part of Firebase Group, initializing `utilities` is required
   *
   * @param {File} file file object of the file that needs to be uploaded
   * @param {string} path file path in google cloud storage
   * @returns {Promise<string>} url of the uploaded file
   */
  async upload_file(
    path: string,
    file: Blob | Uint8Array | ArrayBuffer,
    metadata?: UploadMetadata
  ): Promise<string> {
    if (!firebase?.storage)
      throw new Error(
        "Firebase Storage not found. Make sure you are initializing `utilities` with proper Firebase App."
      );
    return _upload_file(firebase.storage, path, file, metadata);
  }

  /**
   *
   * Converts csv string to json array of object
   *
   * @param {string} data csv data in string form
   * @param {string} [delimiter=","] separator used in csv data
   * @return {*} array of objects
   */
  csv_to_json(data: string, delimiter: string = ","): any {
    const titles = data
      .slice(0, data.indexOf("\n"))
      .split(delimiter)
      .map((title) => title.trim().replace("ï»¿", ""));
    return data
      .slice(data.indexOf("\n") + 1)
      .split("\n")
      .map((v) => {
        const values = v
          .split(delimiter)
          .map((value) => value.replaceAll(`\"`, ""));
        return titles.reduce(
          (obj: any, title: any, index: any) => (
            (obj[title] = values[index]), obj
          ),
          {}
        );
      });
  }

  /**
   * Updates user object in database.
   *
   * NOTE: This is part of Firebase Group, initializing `utilities` is required
   *
   * @param uid
   * @param data
   * @param path
   * @returns Promise<void>
   */
  async update_user(uid: string, data: any, collection: string = "users/") {
    if (!firebase?.db)
      throw new Error(
        "Firebase Firestore not found. Make sure you are initializing `utilities` with proper Firebase App."
      );
    return await _update_doc(firebase?.db, collection + "/" + uid, data);
  }
}

const utilities = new Utilities();

export default utilities;

export const firebase = utilities.firebase;
export const sort_by = utilities.sort_by;
export const json_to_csv = utilities.json_to_csv;
export const csv_to_json = utilities.csv_to_json;
export const upload_file = utilities.upload_file;
export const update_user = utilities.update_user;
