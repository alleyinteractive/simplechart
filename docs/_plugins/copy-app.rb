# Make a copy of the Simplechart app & widget in the static/ dir
Jekyll::Hooks.register :site, :after_init do |jekyll|
  Dir.chdir ".."

  STDOUT.puts "Copying to index.html to docs/app/index.html"
  FileUtils.cp "index.html", "docs/app.html"

  STDOUT.puts "Bundling app and widget JS for Jekyll site"
  exec "JEKYLL=true npm run build"
  FileUtils.mv "static/app.js", "docs/static/app.js"
  FileUtils.mv "static/widget.js", "docs/static/widget.js"
  FileUtils.remove_dir "static"
end