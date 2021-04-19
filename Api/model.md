## User
```json
{
  "PK": "USER#<user id>: String",
  "SK": "METADATA: static String",
  "email": "<user email>: String",
  "type": "<user type>: enum String",
  "storage_used": "<storage used by user in KB>: ",
  "thumbnail": "<profile image url>: String"
}
```

## File
```json
{
  "PK": "USER#<user-id>: String",
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
  "PK": "FILE#<YYYY-MM-DD-HH-mm-SS>: String",
  "SK": "URL#YYYY-MM-DD-HH-mm-SS: String",
  "GS1_PK": "<unique url id>: String",
  "hash": "<file hash>: String",
  "visible": "<is url visitable>: Boolean",
  "clicks_left": "<no of times url can be used>: Int"
}
```
