# syntax=docker/dockerfile:1
##
# FashionHub Demo App
# -------------------
# Clones the FashionHub static site from GitHub and serves it via Jekyll
# on port 4000. Used by docker-compose.yml so tests can run against
# http://fashionhub-app:4000 instead of the live GitHub Pages URL.
#
# The app is served at: http://fashionhub-app:4000/fashionhub/
# (The /fashionhub/ sub-path comes from the Jekyll baseurl in _config.yml)
#
# Usage (standalone):
#   docker build -t fashionhub-app ./fashionhub-app
#   docker run -p 4000:4000 fashionhub-app
##
FROM ruby:3.1-slim

# Install git (to clone the repo) and Node.js (required by Jekyll for Sass)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      git \
      nodejs \
      build-essential && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Clone the FashionHub source directly — no need to copy files manually.
# Using --depth=1 keeps the image lean (no full git history needed).
RUN git clone --depth=1 https://github.com/pocketaces2/fashionhub.git .

# Install Ruby gems (Jekyll + dependencies)
RUN bundle install

EXPOSE 4000

# Serve the site, binding to all interfaces so Docker can forward traffic.
# --baseurl matches the GitHub Pages path (/fashionhub/) to keep URLs consistent.
CMD ["bundle", "exec", "jekyll", "serve", \
     "--host", "0.0.0.0", \
     "--port", "4000", \
     "--baseurl", "/fashionhub"]
