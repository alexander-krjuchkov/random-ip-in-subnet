# Development guidelines

1. **Develop in a separate branch**

    Always start your development in a separate branch. This ensures that the main codebase remains stable and that your changes can be reviewed before they are merged.

    When working for a long time, remember to merge the remote master branch into yours to synchronize changes and avoid merge conflicts, and to stay up to date with the latest updates and improvements made to the main code.

1. **Push your branch**

    Once your changes are ready, don't forget to push your branch to the remote repository.

1. **Create a pull request**

    Create a pull request to merge your branch into the master branch.

    | ❗ Notice |
    |-----------|
    | Further actions are performed by the person who has access to work with the master branch. |

1. **Merge changes into master branch**

    Merge the pull request into the master branch.

1. **Update the package version**

   Update the package version. Use the following commands based on the type of changes made:

   - For small patches and bug fixes:

        `npm run patch`

   - For backward-compatible functionality:

        `npm run minor`

   - For breaking changes:

        `npm run major`

1. **Push the master branch with the new version**

    Push the updated version of the master branch to the remote repository with annotated tags.

    You can do this using this command:

    `npm run push`

    Updating a version on the master branch will trigger a GitHub workflow to publish the new version.
