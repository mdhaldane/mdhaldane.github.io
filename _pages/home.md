---
layout: splash
title: Matt Haldane
permalink: /
header:
  overlay_color: "#5e616c"
  overlay_image: /assets/images/transmetropolitan.jpg
  text_color: firebrick
#  caption: some caption
excerpt: "Tech in China"
# intro: 
#   - excerpt: ''
author_profile: true
feature_row:
  - image_path: /assets/images/who_is_matt.jpg
    alt: "Who am I?"
    title: "Who am I?"
    excerpt: "From tech to journalism to China."
    url: "/about/"
    btn_class: "btn--primary"
    btn_label: "About me"
  - image_path: /assets/images/front_page.jpg
    alt: "Clips"
    title: "Clips"
    excerpt: "A decade of covering tech and business."
    url: "/work/"
    btn_class: "btn--primary"
    btn_label: "See my work"
  - image_path: /assets/images/tinker.jpg
    alt: "Tinkerer"
    title: "Tinkerer"
    excerpt: "Data analysis and websites."
    url: "/projects/"
    btn_class: "btn--primary"
    btn_label: "Projects"
---

Matt Haldane is a tech journalist based in Hong Kong, where currently works as a business and technology editor at the *South China Morning Post*.

<div class="text-center text-small page__footer-follow"> <ul class="social-icons"> {% if site.data.ui-text[site.locale].follow_label %} <li><strong>{{ site.data.ui-text[site.locale].follow_label }}</strong></li> {% endif %} {% if site.footer.links %} {% for link in site.footer.links %} {% if link.label and link.url %} <li><a href="{{ link.url }}" rel="nofollow noopener noreferrer"><i class="{{ link.icon | default: 'fas fa-link' }}" aria-hidden="true" style="{{link.style}}"></i> {{ link.label }}</a></li> <li><strong><a rel="me" href="https://www.mastodon.social/@mdhaldane"><img src="/assets/images/mastodon.ico" style="width:20px">Mastodon</a></li> {% endif %} {% endfor %} {% endif %}</ul></div>

{% include feature_row %}
