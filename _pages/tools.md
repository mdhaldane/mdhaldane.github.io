---
layout: single
title: Tools
permalink: /tools/
author_profile: false
group: navigation
tools_grid:
  - icon: "fas fa-comments"
    title: "Chat"
    excerpt: "A Delta Chat-based webapp. Generates a temporary account using PGP key pairs so you can send end-to-end encrypted messages to me. Data stays locally in your browser."
    url: "https://chat.matthaldane.com"
    btn_label: "Open Chat"
    btn_class: "btn--primary"
  - icon: "fas fa-calculator"
    title: "Org-Calc"
    excerpt: "An interactive, text-based calculator inspired by Emacs org-mode. Allows for quick inline calculations that can be copied and pasted into org documents for easy replication."
    url: "/calc/"
    btn_label: "Open Calculator"
    btn_class: "btn--primary"
  - icon: "fas fa-edit"
    title: "Markdown Editor"
    excerpt: "A web-based Markdown editor powered by EasyMDE and Turndown. HTML and rich text can be pasted into Markdown format. The editor includes Markdown, preview and rich-text modes."
    url: "/editor/"
    btn_label: "Open Editor"
    btn_class: "btn--primary"
---

The age of [personalized software](https://sockpuppet.org/blog/2026/05/12/emacsification/){:target="_blank"} is upon us. These are a few web-based tools for very niche use cases built — unsurprisingly, I'm sure — with the help of AI. I am not a developer. Bear that in mind when using them. That said, they are meant to run locally and so have no calls to the web, except for the chat app, which communicates through Delta Chat servers.

{% include feature_row id="tools_grid" %}
