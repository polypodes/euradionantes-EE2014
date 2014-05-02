# Euradionantes - EE2014

An EuradioNantes website for 2014 european elections.

This is a Github "Project Pages" based website available at
- (primary) http://euradionantes.lespolypodes.com
- (secondary) http://polypodes.github.io/euradionantes-EE20144

## Contributions

Contributions must be pushed into the __[gh-pages branch](https://github.com/polypodes/euradionantes-EE2014/tree/gh-pages) as the main branch__

## Pages build: 1/2 Gulp

```bash
npm install -g gulp
npm install
gulp
```

## Pages build: 2/2 Jekyll

Every GitHub Page is run through Jekyll when you push content. To run this locally, check this [Jelp article from Github](https://help.github.com/articles/using-jekyll-with-pages).

Assuming that `ruby --version` returns `1.9.3`or `2.0.0`, first install `Bundler`

If asked, install [nogogiri](http://nokogiri.org/tutorials/installing_nokogiri.html) (targetting homebrew 0.9)

Then install Jekyll:

```bash
sudo gem install bundler jekyll github-pages
```

Then build your pages locally:

```bash
bundle install
```

To run Jekyll in a way that matches the GitHub Pages build server, run Jekyll with Bundler:

```bash
bundle exec jekyll serve
```

in the root of your repository (after switching to the gh-pages branch for project repositories), and your site should be available at [http://localhost:4000].

Check the [Jekyll basic commands here](http://jekyllrb.com/docs/usage/)

Working [solution for the nokogiri, libxml, libxslt errors while installing Jekyll](http://iamjosh.wordpress.com/2014/03/14/installing-nokogiri-via-bundler-on-mac-or-why-did-this-take-two-hours/)


## Deployement

```bash
git push origin gh-pages
```

Check your immediate changes: http://euradionantes.lespolypodes.com

## DNS config

Check this [Help article from Github](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages#subdomains)

Validate it using `dig`:

```bash
dig euradionantes.lespolypodes.com +nostats +nocomments +nocmd                                                          14:28  ronan@cider

; <<>> DiG 9.8.3-P1 <<>> euradionantes.lespolypodes.com +nostats +nocomments +nocmd
;; global options: +cmd
;euradionantes.lespolypodes.com.    IN  A
euradionantes.lespolypodes.com. 21599 IN CNAME  polypodes.github.io.
polypodes.github.io.    3599    IN  CNAME   github.map.fastly.net.
github.map.fastly.net.  3   IN  A   185.31.17.133
```

