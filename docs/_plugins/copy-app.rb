# Make a copy of the Simplechart app & widget in the static/ dir
Jekyll::Hooks.register :site, :after_init do |jekyll|
  Dir.chdir ".."

  STDOUT.puts "Bundling app and widget JS for Jekyll site"
  system "JEKYLL=true npm run build"

  STDOUT.puts "Copying compiled app and widget"
  FileUtils.remove_dir "docs/static"
  FileUtils.cp_r "static/.", "docs/static"
  FileUtils.remove_dir "static"

  STDOUT.puts "Copying to index.html to docs/app.html"
  FileUtils.cp "index.html", "docs/app.html"
end