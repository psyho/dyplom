desc "builds the .pdf document"
task :pdf do
  file_name = ENV['FILE'] || 'konspekt'
  system("pdflatex #{file_name}")
  system("bibtex #{file_name}")
  2.times { system("pdflatex #{file_name}") }
end

desc "removes generated files"
task :clean do
  system "rm -rf *.aux *.log *.pdf *.bbl *.blg"
end
