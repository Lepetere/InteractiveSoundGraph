(defproject interactivesoundgraph "0.2.0"
  :plugins [[lein-cljsbuild "1.0.3"]]
  :dependencies [[org.clojure/clojurescript "0.0-2234"]]
  :cljsbuild {
    :builds [{
        ; The path to the top-level ClojureScript source directory:
        :source-paths ["javascript"]
        ; The standard ClojureScript compiler options:
        ; (See the ClojureScript compiler documentation for details.)
        :compiler {
          :output-to "javascript/clojurescripttest.js"  ; default: target/cljsbuild-main.js
          :optimizations :advanced
          :pretty-print true}}]})