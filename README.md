# Security notes

DON'T replace files in the bundle with files created by somebody else
(especially if you don't trust sender OR you don't know the origin of those files)

# Setup

1. Download release from releases page
2. Unzip to empty (separate) folder
3. Add (drag&drop works) `index.html` from unpacked folder to obs scene.

# Config

No configuration required, but you might want to change `styles.css` and/or `config.js`.

* Configuration basics:
  * To change colors/appearance use `styles.css`
  * To change the text displayed in widget:
    * Go to `config.js`
    * Locate line with ```return `Bloqs booped ${notesCut}`;```
    * Replace content between backticks (\`) and use `${notesCut}` as a place where number will be displayed.
      * For example:
        * If you want to display "Box destroyed: 12312 (and counting)"
        * Then this line should be ```return `Box destroyed: ${notesCut} (and counting)`;```

# Help with customization and features

Feel free to write to me if you want to request some feature or you have problems with config.

# Contact

Discord server: https://discord.gg/vKAsUUs discord channel: #overlay-widget-bloq-counter
