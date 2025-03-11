# shadcn-starter


#### vite + shadcn/ui + tailwindcss 3 starter

https://ui.shadcn.com/docs/installation/vite
vite + shadcn

```
bun create vite@latest

# go through wizard

create a project directory: example.com

# this example uses React + JavaScript
❯ React ❯ JavaScript 
```

place the project in the right directory


```
cd example.com
bun install
bun run dev
```

at this point you'll have a working react project using vite

shadcn documentation at this point will tell you to install tailwindcss but tailwindcss version has changed to 4
so following instructions will install version 4, we will be using version 3

```
bun install -D tailwindcss@3 postcss autoprefixer
bunx tailwindcss init -p
> tailwind.config.js
> postcss.config.js

touch tsconfig.json
touch tsconfig.app.json

add tailwind styles to index.css
configure tsconfig files

bun add -D @types/node
bunx --bun shadcn@latest init

should have all the checks marked off

go through another wizard

✔ Preflight checks.
✔ Verifying framework. Found Vite.
✔ Validating Tailwind CSS.
✔ Validating import alias.
✔ Which style would you like to use? › New York
✔ Which color would you like to use as the base color? › Slate
✔ Would you like to use CSS variables for theming? … no / yes
✔ Writing components.json.
✔ Checking registry.
✔ Updating tailwind.config.js
✔ Updating src/index.css
✔ Installing dependencies.
✔ Created 1 file:
  - src/lib/utils.ts

bunx --bun shadcn@latest add button card badge
```