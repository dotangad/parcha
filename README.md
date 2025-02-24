# Parcha

Parcha is a knowledge management app for the common man. It keeps your data in your hands and provides near infinte customizability through the extension engine. It's also open source!

## Development

### TODO
- [ ] Switch to postgres
- [ ] File upload with s3 - extension
- [ ] Figure out weird monorepo situation, switch to deno entirely if possible


## Notes on dev
### File extension routes
I was considering using a closure to which you pass the fully developed `EXTENSIONS` object but that somehow wasn't working. So I went with the dynamic import.

In `src/app.ts`, the extensions are registered in the beginning of the file -

```ts
import notes from "../extensions/notes/index.ts";
import files from "../extensions/files/index.ts";
// Register extensions
registerExtension(notes);
registerExtension(files);
```

Then, while mounting routes we must do a dynamic import since `extensions.ts` accessess the `EXTENSIONS` object directly -
```ts
const extrouter = await import("./src/extensions.ts");
app.use("/v1/extensions", extrouter.default);
```

In the future maybe I should think about mutexes or locks to make sure the `EXTENSIONS` object is accessed safely.

## Interesting UI Patterns
- [ ] Sublime Merge click again to confirm popover
- [ ] ctrl+alt+shift+cmd for modifiers - use Raycast's hyper key

