## User
```json
{
  "PK": "USER#<user email>: String",
  "SK": "METADATA: static String",
  "name": "<user's name>: String",
  "type": "<user type>: enum String",
  "storage_used": "<storage used by user in KB>: ",
  "thumbnail": "<profile image url>: String"
}
```

## File
```json
{
  "PK": "USER#<user-email>: String",
  "SK": "FILE#<YYYY-MM-DD-HH-mm-SS>: String",
  "LS1_SK": "<file name>: String",
  "hash": "<file hash>: String",
  "size": "<file size>: Int",
  "type": "<file type>: String"
}
```

## Url
```json
{
  "PK": "<file hash>: String",
  "SK": "URL#YYYY-MM-DD-HH-mm-SS: String",
  "GS1_PK": "<random url id>: String",
  "size": "<file size>: Int",
  "visible": "<is url visitable>: Boolean",
}
```
