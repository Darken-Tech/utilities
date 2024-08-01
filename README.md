# @darkentech/utilities

A set of common utilities shared between multiple projects.

## Initialization

This step is only required if you are using a firebase utility.

```
import { initializeApp } from "firebase/app"
import utilities from "@darkentech/utilities"

//...
const app = initializeApp({...})
//...

utilities.init({ firebase: { app: app } })
```

## Functions

### `csv_to_json(data: string, delimiter: string = ",")`

Converts string csv to a json object.

Usage:

```
import { csv_to_json } from "@darkentech/utilities"
```

```
const csv = "" // any valid csv data

csv_to_json(csv)

// if any custom separator, default=","
csv_to_json(csv, ";")
```

### `json_to_csv(items: any[], filename: string, download: boolean = true)`

Converts string json to a csv object.

Usage:

```
import { json_to_csv } from "@darkentech/utilities"
```

```
const items = [{...}, {...}, ...] // any valid json data

await json_to_csv(items, "export.json")

// if you don't want to download, will only return csv string.
await json_to_csv(items, "export.json", false)
```

### `update_user(uid: string, data: any, collection: string = "users/")`

Updates any document in the firestore database.

```
import { update_user } from "@darkentech/utilities"
```

```
await update_user("SBUh3Xw6UTV3RwInrTDHLH7iyex1", { name: "John Doe" })

// For different collection.
await update_user("SBUh3Xw6UTV3RwInrTDHLH7iyex1", { name: "John Doe" }, "customers")
```

### `upload_file(path: string, file: Blob | Uint8Array | ArrayBuffer, metadata?: UploadMetadata)`

Uploads file to firebase storage.

```
import { upload_file } from "@darkentech/utilities"
```

```
await upload_file("User-Data/865694", file)
```
