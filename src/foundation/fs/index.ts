/**
 * NODE.JS FILE SYSTEM (FS) MODULE
 * Promise-Based API Reference
 *
 * Recommended for modern Node.js backend development.
 */

import fs from "node:fs/promises";

// -------------------
// 1. FILE OPERATIONS
// -------------------

// 1. Create or overwrite a file
await fs.writeFile("data.txt", "Hello World", {
  encoding: "utf8",
});

// 2. Append content without overwriting
await fs.appendFile("data.txt", "\nNew content", {
  encoding: "utf8",
});

// 3. Read file as a string
const content = await fs.readFile("data.txt", {
  encoding: "utf8",
});

// 4. Read file as a Buffer
const buffer = await fs.readFile("image.png");

// 5. Copy a file
await fs.copyFile("data.txt", "backup.txt");

// 6. Rename a file
await fs.rename("backup.txt", "new-backup.txt");

// 7. Move a file (within the same filesystem)
await fs.rename("new-backup.txt", "uploads/backup.txt");

// 8. Delete a file
await fs.unlink("data.txt");

// 9. Delete a file, ignoring ENOENT
await fs.rm("data.txt", {
  force: true,
});

// 10. Truncate a file to 100 bytes
await fs.truncate("backup.txt", 100);

// 11. Create a new file without overwriting an existing one
await fs.writeFile("unique.txt", "Hello", {
  flag: "wx",
  encoding: "utf8",
});


// ----------------------------
// 2. DIRECTORY OPERATIONS
// ----------------------------


// 1. Create a directory safely if it doesn't exist
await fs.mkdir("uploads", {
  recursive: true,
});

// 2. Create nested directories
await fs.mkdir("uploads/images/profile", {
  recursive: true,
});

// 3. Read directory contents
const files = await fs.readdir("uploads");

// 4. Read directory entries with their types
const entries = await fs.readdir("uploads", {
  withFileTypes: true,
});

for (const entry of entries) {
  console.log({
    name: entry.name,
    isFile: entry.isFile(),
    isDirectory: entry.isDirectory(),
    isSymbolicLink: entry.isSymbolicLink(),
  });
}

// 5. Read only regular files
const regularFiles = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name);

// 6. Remove an empty directory
await fs.rmdir("empty-folder");

// 7. Remove a directory recursively
await fs.rm("uploads", {
  recursive: true,
  force: true,
});

// 8. Copy a directory recursively
await fs.cp("source", "destination", {
  recursive: true,
});

// 9. Create a temporary directory in the system temp folder
import os from "node:os";

const tempDir = await fs.mkdtemp(
  path.join(os.tmpdir(), "app-")
);

// 10. Iterate over directory entries
const dir = await fs.opendir("uploads");

for await (const entry of dir) {
  console.log(entry.name);
}


// -------------------------------
// 3. FILE INFORMATION / METADATA
// -------------------------------


// Get file information
const stats = await fs.stat("new.txt");

console.log(stats.size);          // Size in bytes
console.log(stats.birthtime);     // Creation time
console.log(stats.mtime);         // Last modified time
console.log(stats.atime);         // Last accessed time
console.log(stats.ctime);         // Last metadata change time
console.log(stats.mode);          // File mode
console.log(stats.uid);           // Owner user ID
console.log(stats.gid);           // Owner group ID

// File type checking
console.log(stats.isFile());
console.log(stats.isDirectory());
console.log(stats.isSymbolicLink());
console.log(stats.isSocket());
console.log(stats.isFIFO());
console.log(stats.isBlockDevice());
console.log(stats.isCharacterDevice());

// 2. Check whether a path is a regular file
const isFile = stats.isFile();

// 3. Check whether a path is a directory
const isDirectory = stats.isDirectory();

// 4. Get symbolic link metadata
const linkStats = await fs.lstat("my-link");

console.log(linkStats.isSymbolicLink());

// 5. Check accessibility
try {
  await fs.access("data.txt");
  console.log("Accessible");
} catch {
  console.log("Not accessible");
}

// 6. Resolve the real path
const realPath = await fs.realpath("data.txt");

// 7. Get filesystem statistics
const filesystemStats = await fs.statfs(".");

console.log({
  blockSize: filesystemStats.bsize,
  totalBlocks: filesystemStats.blocks,
  freeBlocks: filesystemStats.bfree,
});


// ---------------------------------
// 4. FILE PERMISSIONS AND OWNERSHIP
// ---------------------------------


// 1. Owner can read/write; others can read
await fs.chmod("data.txt", 0o644);

// 2. Owner can read/write only
await fs.chmod("private.txt", 0o600);

// 3. Owner full access; others read/execute
await fs.chmod("script.sh", 0o755);

// 4. Owner full access only
await fs.chmod("private-folder", 0o700);

// 5. Change ownership (Unix/Linux)
await fs.chown("data.txt", 1000, 1000);

// 6. Update timestamps
const now = new Date();

await fs.utimes("data.txt", now, now);


// ---------------------------------
// 5. SYMBOLIC LINKS AND HARD LINKS
// ---------------------------------


// 1. Create a symbolic link
await fs.symlink("data.txt", "data-link.txt");

// 2. Read the symbolic link target
const target = await fs.readlink("data-link.txt");

// 3. Create a hard link
await fs.link("data.txt", "data-hardlink.txt");

// 4. Inspect a symbolic link
const file_stats = await fs.lstat("data-link.txt");

console.log(stats.isSymbolicLink());

// 5. Resolve symbolic links
const actualPath = await fs.realpath("data-link.txt");

// 6. Delete a symbolic link
await fs.unlink("data-link.txt");

//----------------------------
// 6. FILE HANDLE OPERATIONS
//---------------------------

// Open file
const handle = await fs.open("new.txt", "r+");

try {
  // Read file using handle
  const content = await handle.readFile("utf8");
  console.log(content);

  // Get file metadata
  const fileStats = await handle.stat();
  console.log(fileStats.size);

  // Read bytes into a buffer
  const readBuffer = Buffer.alloc(10);

  const { bytesRead } = await handle.read(
    readBuffer,
    0,
    10,
    0
  );

  console.log(bytesRead);
  console.log(readBuffer.subarray(0, bytesRead).toString());

  // Write data at a specific position
  await handle.write("Hello", 0, "utf8");

  // Resize file
  await handle.truncate(20);

  // Synchronize file data and metadata
  await handle.sync();

  // Synchronize file data
  await handle.datasync();

  // Change permissions
  await handle.chmod(0o644);

  // Change timestamps
  await handle.utimes(new Date(), new Date());

} finally {
  // Always close file handle
  await handle.close();
}

// Other FileHandle methods:
// handle.writeFile()
// handle.appendFile()
// handle.chown()
// handle.createReadStream()
// handle.createWriteStream()

// ---------------------
// 7. STREAM OPERATIONS
// ---------------------
import { createReadStream, createWriteStream } from "node:fs";
// NOTE:
// createReadStream and createWriteStream belong to
// node:fs, not node:fs/promises.

// 1. Read a file incrementally
const readStream = createReadStream("large.txt", {
  encoding: "utf8",
});

for await (const chunk of readStream) {
  console.log(chunk);
}


import { pipeline } from "node:stream/promises";
// 2. Copy a large file using streams
await pipeline(
  createReadStream("large.txt"),
  createWriteStream("copy.txt")
);

// 3. Write using a stream
const writeStream = createWriteStream("output.txt", {
  encoding: "utf8",
});

writeStream.write("Hello\n");
writeStream.write("World\n");
writeStream.end();

// ---------------------
// 8. FILE WATCHING
// ---------------------

// Promise-based file watching
// Use AbortController to stop watching.

// Find JavaScript files recursively
for await (const file of fs.glob("**/*.js")) {
  console.log(file);
}

// Find TypeScript files inside src
for await (const file of fs.glob("src/**/*.ts")) {
  console.log(file);
}

// Exclude node_modules
for await (const file of fs.glob("**/*.js", {
  exclude: ["node_modules/**"],
})) {
  console.log(file);
}

// -----------------------
// 9. FILE OPENING FLAGS
// -----------------------

// "r"  -> Read only, file must exist
// "r+" -> Read and write, file must exist
// "w"  -> Write, create or truncate
// "w+" -> Read/write, create or truncate
// "a"  -> Append, create if missing
// "a+" -> Read/append, create if missing
// "wx" -> Write only if file doesn't exist
// "ax" -> Append only if file doesn't exist

await fs.writeFile("flags.txt", "Hello", {
  flag: "w"
});

await fs.appendFile("flags.txt", "\nWorld", {
  flag: "a"
});

// -------------------------
// 10. FILE SEARCHING (GLOB)
// -------------------------

// Find JavaScript files
for await (const file of fs.glob("**/*.js")) {
  console.log(file);
}

// Find TypeScript files
for await (const file of fs.glob("src/**/*.ts")) {
  console.log(file);
}

// -------------------
// 11. PATH OPERATIONS
// -------------------

import path from "node:path";

// path is a separate built-in Node.js module.

const filePath = path.join(
  process.cwd(),
  "uploads",
  "image.png"
);

console.log(filePath);

// Get filename
console.log(path.basename(filePath));

// Get directory
console.log(path.dirname(filePath));

// Get extension
console.log(path.extname(filePath));

// Get absolute path
console.log(path.resolve("uploads/image.png"));

// Normalize path
console.log(path.normalize("uploads/../data.txt"));

//-----------------------
// 12. ERROR HANDLING
//-----------------------

try {
  const content = await fs.readFile("unknown.txt", "utf8");
  console.log(content);

} catch (error) {
//@ts-ignore
  switch (error.code) {
    case "ENOENT":
      console.log("File or directory not found");
      break;

    case "EEXIST":
      console.log("File already exists");
      break;

    case "EACCES":
      console.log("Permission denied");
      break;

    case "EPERM":
      console.log("Operation not permitted");
      break;

    case "EISDIR":
      console.log("Expected file but found directory");
      break;

    case "ENOTDIR":
      console.log("Expected directory but found file");
      break;

    case "ENOTEMPTY":
      console.log("Directory is not empty");
      break;

    case "ENOSPC":
      console.log("No space left on device");
      break;

    default:
      throw error;
  }
}

//-----------------------------------------
// 13. MOST IMPORTANT METHODS TO REMEMBER
//-----------------------------------------

/*

FILE OPERATIONS
---------------
fs.readFile()
fs.writeFile()
fs.appendFile()
fs.copyFile()
fs.rename()
fs.truncate()
fs.unlink()

DIRECTORY OPERATIONS
--------------------
fs.mkdir()
fs.readdir()
fs.rmdir()
fs.rm()
fs.cp()
fs.mkdtemp()
fs.opendir()

FILE INFORMATION
----------------
fs.stat()
fs.lstat()
fs.statfs()
fs.access()
fs.realpath()

FILE PERMISSIONS
----------------
fs.chmod()
fs.chown()
fs.utimes()

LINKS
-----
fs.symlink()
fs.link()
fs.readlink()
fs.lchown()
fs.lutimes()

ADVANCED FILE OPERATIONS
------------------------
fs.open()
fs.glob()
fs.watch()

STREAMS (node:fs)
-----------------
createReadStream()
createWriteStream()

IMPORTANT FILEHANDLE METHODS
----------------------------
handle.read()
handle.write()
handle.readFile()
handle.writeFile()
handle.appendFile()
handle.stat()
handle.truncate()
handle.sync()
handle.datasync()
handle.close()

*/
