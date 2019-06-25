---
title: Golang笔记
date: 2019-06-26
tags:
- git
- jenkins

categories:
- 运维jenkins
---
代码提交git后自动发消息给jenkins, 开启构建和部署的动作. 做到全自动
<!--more-->

```go
type VisitRecord struct {
    url_visited map[string]bool
    mux         sync.Mutex
}

func (vr *VisitRecord) visit(url string) {
    vr.mux.Lock()
    vr.url_visited[url] = true
    vr.mux.Unlock()
}
func (vr *VisitRecord) hasVisited(url string) bool {
    vr.mux.Lock()
    defer vr.mux.Unlock()
    return vr.url_visited[url]
}

// Crawl uses fetcher to recursively crawl
// pages starting with url, to a maximum of depth.
func Crawl(url string, depth int, fetcher Fetcher, vr *VisitRecord) {
    // TODO: Fetch URLs in parallel.
    // TODO: Don't fetch the same URL twice.
    // This implementation doesn't do either:
    defer wg.Done()
    if depth <= 0 {
        return
    }
    if vr.hasVisited(url) {
        return
    }
    body, urls, err := fetcher.Fetch(url)
    vr.visit(url)
    if err != nil {
        fmt.Println(err)
        return
    }

    fmt.Printf("found: %s %q\n", url, body)
    for _, u := range urls {
        wg.Add(1)
        go Crawl(u, depth-1, fetcher, vr)
    }
    return
}

var wg sync.WaitGroup

func main() {
    visitRecord := VisitRecord{url_visited: make(map[string]bool)}
    wg.Add(1)
    go Crawl("https://golang.org/", 4, fetcher, &visitRecord)
    wg.Wait()
}
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMzk5NDk3NjQ2XX0=
-->