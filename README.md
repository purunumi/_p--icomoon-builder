# exporter icomoon


## Examples

### Export

Considering the following files are the ones icomoon generates and compresses:

```
.tmp/
├── demo-files
|   ├── demo.css
|   └── demo.js
├── fonts
|   ├── icomoon.svg
|   ├── icomoon.ttf
|   └── icomoon.woff
├── demo.html
├── liga.js
├── Read Me.txt
├── selection.json
├── style.css
├── style.scss
└── variables.scss
```

When running:

```bash
cd your/path/to/fancy-icons-project/
node your/path/to/_p--icomoon-builder/lib/builder export fancy-icons ~/Downloads/icomoon.zip scss css fonts docs liga
```

We will obtain:

```
target/
├── css
|   ├── fancy-icons.css
|   └── fancy-icons.min.css
├── docs
|   ├── demo
|   |   ├── index.html
|   |   ├── scripts.js
|   |   └── styles.css
|   └── icomoon.json
├── fonts
|   ├── fancy-icons.svg
|   ├── fancy-icons.ttf
|   └── fancy-icons.woff
├── liga
|   ├── fancy-icons.js
└── scss
    ├── fancy-icons.scss
    ├── _icons.scss
    └── _variables.scss
```

