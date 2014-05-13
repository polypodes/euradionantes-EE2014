# Euradionantes - EE2014

An EuradioNantes website for 2014 european elections.

A Github "Project Pages" based website available at http://ep2014.euradionantes.eu


## PROD/PREPROD environments

### Remote repos:

- `origin`: https://github.com/polypodes/euradionantes-EE2014
- `preprod`: https://github.com/polypodes/euradionantes-EE2014-preprod

Other branches are not used for now.

### PREPROD usage:

Remember not to push into `origin` : `git push preprod gh-pages` only

```bash
git checkout gh-pages
git pull origin gh-pages
git remote add preprod https://github.com/polypodes/euradionantes-EE2014-preprod.git
git fetch preprod
(coding...)
(commiting...)
git push preprod gh-pages
```

Mind the CNAME file that has changed from `ep2014.euradionantes.eu` to `euradionantes.lespolypodes.com`

### PRE-Production deployement ([Github pages](https://pages.github.com/))

```bash
(check CNAME + robots.txt value)
git push preprod gh-pages
```

Check your immediate changes: http://euradionantes.lespolypodes.com

### Production deployement ([Github pages](https://pages.github.com/))

```bash
(check CNAME + robots.txt value)
git push origin gh-pages
```

Check your immediate changes: http://ep2014.euradionantes.eu

## Contributions

Contributions must be pushed into the __[gh-pages branch](https://github.com/polypodes/euradionantes-EE2014-preprod/tree/gh-pages) as the main branch__

## Installing packages & dependencies ([Bower](http://bower.io/))

```bash
npm install -g bower
bower install
```

## Building assets & pages ([Gulp](http://gulpjs.com/))

```bash
npm install -g gulp
npm install
gulp
```


## DNS config (Registrar)

Check this [Help article from Github](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages#subdomains)

Validate it using `dig`:

```bash
dig ep2014.euradionantes.eu +nostats +nocomments +nocmd                                                          14:28  ronan@cider

; <<>> DiG 9.8.3-P1 <<>> euradionantes.lespolypodes.com +nostats +nocomments +nocmd
;; global options: +cmd
;euradionantes.lespolypodes.com.    IN  A
euradionantes.lespolypodes.com. 21599 IN CNAME  polypodes.github.io.
polypodes.github.io.    3599    IN  CNAME   github.map.fastly.net.
github.map.fastly.net.  3   IN  A   185.31.17.133
```
