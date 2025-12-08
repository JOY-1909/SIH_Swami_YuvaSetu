# Data Directory

This directory contains persistent data files for the application.

## Subdirectories

### faiss/

Contains FAISS index files for semantic search:

- `internships.index` - FAISS HNSWFlat index binary file
- `internships.index.ids` - Document ID mappings (text file)

These files are automatically created and updated by the application.
Do not manually edit these files.

## Gitignore

These files should be excluded from version control (add to .gitignore):

```
data/faiss/*.index
data/faiss/*.ids
```
