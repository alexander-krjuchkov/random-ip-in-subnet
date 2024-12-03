# Development guidelines

1. **Develop in a separate branch**

    Always start your development in a separate branch. This ensures that the main codebase remains stable and that your changes can be reviewed before they are merged.

1. **Update the package version**

   After completing your changes, update the package version. Use the following commands based on the type of changes made:

   - For small patches and bug fixes:

        `npm run patch`

   - For backward-compatible functionality:

        `npm run minor`

   - For breaking changes:

        `npm run major`

1. **Push and merge to master branch**

   Once your changes are ready and the version is updated, push your branch and create a pull request to merge into the master branch. Merging with the master branch will trigger the GitHub workflow to publish the new version.
