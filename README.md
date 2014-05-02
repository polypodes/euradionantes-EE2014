# Euradionantes - EE2014

An EuradioNantes website for 2014 european elections.

This is a Github "Project Pages" based website available at
- (primary) http://euradionantes.lespolypodes.com
- (secondary) http://polypodes.github.io/euradionantes-EE20144

## Contributions

Contributions must be pushed into the __[gh-pages branch](https://github.com/polypodes/euradionantes-EE2014/tree/gh-pages) as the main branch__


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



