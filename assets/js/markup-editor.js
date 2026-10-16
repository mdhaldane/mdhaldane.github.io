(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const rich = $('wysiwyg-editor');
  const key = 'joplin_editor_content';
  const snapshotKey = key + '_source';
  let mode = 'edit', changing = false, richBaseline = '', sourceSnapshot = null;
  let initial = '';
  try { initial = localStorage.getItem(key) || ''; sourceSnapshot = JSON.parse(localStorage.getItem(snapshotKey) || 'null'); } catch (_) { /* Storage may be disabled. */ }
  const editor = new EasyMDE({element: $('markdown-editor'), initialValue: initial,
    toolbar: false, status: false, spellChecker: false,
    autoDownloadFontAwesome: false, lineNumbers: true, lineWrapping: true,
    indentWithTabs: false, tabSize: 2});
  const cm = editor.codemirror;
  const CodeMirror = cm.constructor;
  CodeMirror.defineMode('org', () => ({
    startState: () => ({block: false}),
    token(stream, state) {
      if (stream.sol() && stream.match(/\s*#\+END_\w+.*/i)) { state.block = false; return 'keyword'; }
      if (stream.sol() && stream.match(/\s*#\+BEGIN_(SRC|EXAMPLE).*/i)) { state.block = true; return 'keyword'; }
      if (state.block) { stream.skipToEnd(); return 'comment'; }
      if (stream.sol()) {
        const heading = stream.match(/(\*+)\s+.*/);
        if (heading) return 'header header-' + ((heading[1].length - 1) % 6 + 1);
      }
      if (stream.sol() && stream.match(/\s*#\+.*/)) return 'keyword';
      if (stream.sol() && stream.match(/\s*# .*/)) return 'comment';
      if (stream.match(/\[\[[^\n]*?\]\]/)) return 'link';
      if (stream.match(/\b(TODO|DONE|NEXT|WAITING|HOLD|CANCELLED)\b|\[[ Xx-]\]/)) return 'atom';
      if (stream.match(/~[^~\n]+~|=[^=\n]+=/)) return 'comment';
      if (stream.match(/\*[^*\n]+\*/)) return 'strong';
      if (stream.match(/\/[^/\n]+\//)) return 'em';
      if (stream.match(/\+[^+\n]+\+/)) return 'strikethrough';
      if (stream.match(/\|/)) return 'keyword';
      stream.next(); return null;
    }
  }));
  cm.setOption('extraKeys', {'Tab': c => c.replaceSelection('  '), 'Ctrl-S': save, 'Cmd-S': save,
    'Enter': continueList, 'Shift-Enter': c => c.replaceSelection('\n'), 'Ctrl-Q': toggleCurrentHeading});
  cm.setOption('gutters', ['CodeMirror-linenumbers', 'heading-fold-gutter']);
  function sourceStructure() {
    const headings = [], codeLines = new Set();
    let fence = null, orgBlock = false;
    for (let line = 0; line < cm.lineCount(); line++) {
      const text = cm.getLine(line);
      if (mode === 'org') {
        if (/^\s*#\+BEGIN_(SRC|EXAMPLE)\b/i.test(text)) orgBlock = true;
        if (orgBlock) {
          codeLines.add(line);
          if (/^\s*#\+END_(SRC|EXAMPLE)\b/i.test(text)) orgBlock = false;
          continue;
        }
      } else {
        const match = text.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);
        if (fence) {
          codeLines.add(line);
          if (match && match[1][0] === fence[0] && match[1].length >= fence.length && !match[2].trim()) fence = null;
          continue;
        }
        if (match) { fence = match[1]; codeLines.add(line); continue; }
      }
      const match = text.match(mode === 'org' ? /^(\*+)\s+/ : /^ {0,3}(#{1,6})\s+/);
      if (match) headings.push({line, level: match[1].length});
    }
    return {headings, codeLines};
  }
  function foldRange(heading, headings) {
    const next = headings.find(h => h.line > heading.line && h.level <= heading.level);
    const endLine = next ? next.line - 1 : cm.lastLine();
    return endLine > heading.line ? {from: {line: heading.line, ch: cm.getLine(heading.line).length}, to: {line: endLine, ch: cm.getLine(endLine).length}} : null;
  }
  function toggleHeading(line) {
    const existing = cm.getAllMarks().find(mark => mark.headingFold && mark.find()?.from.line === line);
    if (existing) existing.clear();
    else {
      const {headings} = sourceStructure(), heading = headings.find(h => h.line === line);
      const range = heading && foldRange(heading, headings);
      if (!range) return;
      const widget = document.createElement('button');
      widget.type = 'button'; widget.className = 'heading-fold-placeholder';
      widget.textContent = ' … '; widget.title = 'Expand heading'; widget.setAttribute('aria-label', 'Expand heading');
      const mark = cm.markText(range.from, range.to, {collapsed: true, replacedWith: widget, clearOnEnter: true});
      mark.headingFold = true;
      widget.addEventListener('click', () => { mark.clear(); refreshHeadingGutter(); });
      mark.on('clear', () => refreshHeadingGutter());
    }
    refreshHeadingGutter();
  }
  function toggleCurrentHeading() {
    const line = cm.getCursor().line;
    const heading = sourceStructure().headings.filter(h => h.line <= line).pop();
    if (heading) toggleHeading(heading.line);
  }
  function refreshHeadingGutter() {
    cm.clearGutter('heading-fold-gutter');
    if (mode !== 'org' && mode !== 'edit') return;
    const {headings} = sourceStructure();
    const folded = new Set(cm.getAllMarks().filter(m => m.headingFold && m.find()).map(m => m.find().from.line));
    for (const heading of headings) {
      if (!foldRange(heading, headings)) continue;
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'heading-fold-toggle';
      button.textContent = folded.has(heading.line) ? '▸' : '▾';
      button.title = (folded.has(heading.line) ? 'Expand' : 'Fold') + ' heading (Ctrl+Q)';
      button.setAttribute('aria-label', button.title); button.setAttribute('aria-expanded', String(!folded.has(heading.line)));
      button.addEventListener('mousedown', e => e.preventDefault());
      button.addEventListener('click', e => { e.stopPropagation(); toggleHeading(heading.line); });
      cm.setGutterMarker(heading.line, 'heading-fold-gutter', button);
    }
  }
  function continueList() {
    const pos = cm.getCursor(), line = cm.getLine(pos.line);
    const indentedCode = mode === 'edit' && /^(?: {4}|\t)/.test(line) && /\bcomment\b/.test(cm.getTokenAt(pos).type || '');
    if (cm.somethingSelected() || sourceStructure().codeLines.has(pos.line) || indentedCode) { cm.execCommand('newlineAndIndent'); return; }
    const match = line.match(/^(\s*)([-+*]|\d+[.)])\s+(?:\[([ Xx-])\]\s*)?/);
    if (match && !(mode === 'org' && match[2] === '*' && !match[1]) && pos.ch >= match[0].length) {
      if (!line.slice(match[0].length).trim()) {
        cm.replaceRange(match[1], {line: pos.line, ch: 0}, {line: pos.line, ch: line.length});
        return;
      }
      let marker = match[2];
      if (/^\d/.test(marker)) marker = String(parseInt(marker, 10) + 1) + marker.slice(-1);
      cm.replaceSelection('\n' + match[1] + marker + ' ' + (match[3] !== undefined ? '[ ] ' : ''), 'end');
      return;
    }
    const quote = mode === 'edit' && line.match(/^(\s*>\s?)+/);
    if (quote && pos.ch >= quote[0].length) { cm.replaceSelection('\n' + quote[0], 'end'); return; }
    cm.execCommand('newlineAndIndent');
  }
  const markdownMode = cm.getOption('mode');
  const td = new TurndownService({headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', emDelimiter: '*'});
  if (window.turndownPluginGfm) td.use(turndownPluginGfm.gfm);
  td.keep(['u', 'sub', 'sup']);
  td.addRule('strikethrough', {filter: ['del', 's', 'strike'], replacement: content => '~~' + content + '~~'});
  td.addRule('checked', {filter: 'input', replacement: (_, node) => node.type === 'checkbox' ? (node.checked ? '[x] ' : '[ ] ') : ''});
  // Allow document formatting while excluding executable HTML and unsafe URLs.
  function clean(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const allowed = new Set('P DIV SPAN BR H1 H2 H3 H4 H5 H6 STRONG B EM I U S STRIKE DEL SUB SUP CODE PRE BLOCKQUOTE UL OL LI A IMG TABLE THEAD TBODY TFOOT TR TH TD HR INPUT'.split(' '));
    doc.body.querySelectorAll('script,style,iframe,object,embed,svg,math,template,link,meta').forEach(n => n.remove());
    doc.body.querySelectorAll('*').forEach(n => {
      if (!allowed.has(n.tagName)) { n.replaceWith(...n.childNodes); return; }
      // Office and browser selections often encode emphasis as inline CSS.
      // Convert those styles to semantic elements before removing attributes.
      const styles = n.style;
      const wrappers = [];
      if (styles && (styles.fontWeight === 'bold' || Number(styles.fontWeight) >= 600)) wrappers.push('strong');
      if (styles && styles.fontStyle === 'italic') wrappers.push('em');
      if (styles && /underline/.test(styles.textDecoration)) wrappers.push('u');
      if (styles && /line-through/.test(styles.textDecoration)) wrappers.push('del');
      for (const tag of wrappers) {
        const wrapper = doc.createElement(tag);
        wrapper.append(...n.childNodes); n.appendChild(wrapper);
      }
      for (const attr of Array.from(n.attributes)) {
        if (!['href', 'src', 'alt', 'title', 'start', 'colspan', 'rowspan', 'type', 'checked', 'disabled', 'class'].includes(attr.name)) n.removeAttribute(attr.name);
      }
      for (const name of ['href', 'src']) {
        if (!n.hasAttribute(name)) continue;
        const value = n.getAttribute(name).replace(/[\u0000-\u0020]/g, '');
        if (/^[a-z][a-z\d+.-]*:/i.test(value) && !/^(https?:|mailto:)/i.test(value)) n.removeAttribute(name);
      }
      if (n.tagName === 'INPUT') { n.type = 'checkbox'; n.disabled = true; }
    });
    return doc.body.innerHTML;
  }
  function markdown() {
    if (mode === 'wysiwyg') {
      if (rich.innerHTML === richBaseline) return initial;
      sourceSnapshot = null;
      return td.turndown(clean(rich.innerHTML));
    }
    return mode === 'org' ? OrgConverter.orgToMarkdown(cm.getValue()) : cm.getValue();
  }
  function save() {
    updateStatus();
    const md = markdown();
    if (mode === 'org') sourceSnapshot = {org: cm.getValue(), markdown: md};
    try {
      localStorage.setItem(key, md);
      if (sourceSnapshot && sourceSnapshot.markdown === md) localStorage.setItem(snapshotKey, JSON.stringify(sourceSnapshot));
      else localStorage.removeItem(snapshotKey);
      $('editor-message').textContent = '';
    } catch (_) { $('editor-message').textContent = 'Browser storage is unavailable. Copy your work before closing.'; }
  }
  function updateStatus() {
    const source = mode === 'edit' || mode === 'org';
    const text = source ? cm.getValue() : (mode === 'wysiwyg' ? rich : $('markup-preview')).innerText.replace(/\r\n?/g, '\n');
    const words = text.trim() ? (text.match(/\S+/gu) || []).length : 0;
    $('editor-lines').textContent = 'Lines: ' + (text ? text.split('\n').length : 1);
    $('editor-words').textContent = 'Words: ' + words;
    $('editor-characters').textContent = 'Characters: ' + Array.from(text).length;
    $('editor-cursor').hidden = !source;
    const cursor = cm.getCursor();
    $('editor-cursor').textContent = (cursor.line + 1) + ':' + (cursor.ch + 1);
  }
  function setMode(next) {
    if (mode === next) return;
    const md = markdown();
    if (mode === 'org') sourceSnapshot = {org: cm.getValue(), markdown: md};
    initial = md;
    changing = true;
    mode = next;
    cm.setOption('mode', next === 'org' ? 'org' : markdownMode);
    const placeholder = next === 'org' ? 'Type Org-mode here...' : 'Type Markdown here...';
    cm.setOption('placeholder', placeholder);
    $('markdown-editor').placeholder = placeholder;
    cm.getInputField().setAttribute('aria-label', next === 'org' ? 'Org-mode source' : 'Markdown source');
    cm.getWrapperElement().classList.toggle('cm-s-org', next === 'org');
    cm.setValue(next === 'org' ? (sourceSnapshot && sourceSnapshot.markdown === md ? sourceSnapshot.org : OrgConverter.markdownToOrg(md)) : md);
    changing = false;
    $('markdown-container').style.display = ['edit', 'org'].includes(next) ? 'block' : 'none';
    $('wysiwyg-container').style.display = next === 'wysiwyg' ? 'block' : 'none';
    $('rich-toolbar').hidden = next === 'preview';
    $('rich-toolbar').setAttribute('aria-label', next === 'org' ? 'Org formatting' : next === 'edit' ? 'Markdown formatting' : 'Rich text formatting');
    $('markup-preview').hidden = next !== 'preview';
    if (next === 'wysiwyg') { rich.innerHTML = clean(marked.parse(md)); richBaseline = rich.innerHTML; }
    if (next === 'preview') $('markup-preview').innerHTML = clean(marked.parse(md));
    for (const name of ['edit', 'org', 'preview', 'wysiwyg']) {
      const btn = $('view-' + name + '-btn');
      btn.classList.toggle('active', next === name);
      btn.setAttribute('aria-pressed', String(next === name));
    }
    $('mode-badge').textContent = {edit: 'MARKDOWN', org: 'ORG', preview: 'PREVIEW', wysiwyg: 'RICH TEXT'}[next];
    $('copy-md-btn').title = next === 'org' ? 'Copy Org source' : 'Copy Markdown';
    cm.refresh(); refreshHeadingGutter(); save();
  }
  cm.on('change', () => { if (!changing) { if (mode !== 'org') sourceSnapshot = null; save(); } });
  cm.on('changes', () => { if (!changing) refreshHeadingGutter(); });
  cm.on('cursorActivity', () => { if (!changing) updateStatus(); });
  rich.addEventListener('input', save);
  window.addEventListener('pagehide', save);
  for (const name of ['edit', 'org', 'preview', 'wysiwyg']) $('view-' + name + '-btn').addEventListener('click', () => setMode(name));
  $('rich-toolbar').addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  $('rich-toolbar').addEventListener('click', e => {
    const btn = e.target.closest('button'); if (!btn) return;
    if (mode === 'edit' || mode === 'org') { formatSource(btn); return; }
    rich.focus();
    if (btn.dataset.command === 'table') {
      const dimensions = prompt('Table dimensions (rows x columns):', '3 x 3');
      const size = dimensions && dimensions.match(/^\s*(\d+)\s*x\s*(\d+)\s*$/i);
      if (!size) return;
      const rows = Math.min(50, Number(size[1])), cols = Math.min(20, Number(size[2]));
      if (!rows || !cols) return;
      const html = '<table><thead><tr>' + Array.from({length: cols}, (_, i) => '<th>Header ' + (i + 1) + '</th>').join('') + '</tr></thead><tbody>' + Array.from({length: rows}, () => '<tr>' + '<td><br></td>'.repeat(cols) + '</tr>').join('') + '</tbody></table><p><br></p>';
      document.execCommand('insertHTML', false, html); save(); return;
    }
    if (btn.dataset.command === 'inlineCode') {
      const selection = window.getSelection();
      if (!selection.rangeCount || !rich.contains(selection.anchorNode)) return;
      const range = selection.getRangeAt(0), code = document.createElement('code');
      code.appendChild(range.extractContents());
      if (!code.textContent) code.textContent = 'code';
      range.insertNode(code); range.selectNodeContents(code);
      selection.removeAllRanges(); selection.addRange(range); save(); return;
    }
    let value = btn.dataset.value || null;
    if (['createLink', 'insertImage'].includes(btn.dataset.command)) {
      value = prompt(btn.dataset.command === 'insertImage' ? 'Image URL:' : 'Link URL:', 'https://');
      if (!value || !/^(https?:\/\/|mailto:|\/|#)/i.test(value)) return;
    }
    document.execCommand(btn.dataset.command, false, value); save();
  });
  function formatSource(btn) {
    const org = mode === 'org', command = btn.dataset.command;
    const selected = cm.getSelection();
    function insert(text) { cm.replaceSelection(text, 'around'); cm.focus(); }
    function wrap(open, close = open, fallback = 'text') { insert(open + (selected || fallback) + close); }
    function lines(prefix) {
      const from = cm.getCursor('from'), to = cm.getCursor('to');
      const end = to.line > from.line && to.ch === 0 ? to.line - 1 : to.line;
      const startPos = {line: from.line, ch: 0}, endPos = {line: end, ch: cm.getLine(end).length};
      const text = cm.getRange(startPos, endPos).split('\n').map((line, i) => prefix(i) + line).join('\n');
      cm.replaceRange(text, startPos, endPos); cm.focus();
    }
    switch (command) {
      case 'bold': wrap(org ? '*' : '**'); break;
      case 'italic': wrap(org ? '/' : '*'); break;
      case 'underline': wrap(org ? '_' : '<u>', org ? '_' : '</u>'); break;
      case 'strikeThrough': wrap(org ? '+' : '~~'); break;
      case 'inlineCode': wrap(org ? '~' : '`', org ? '~' : '`', 'code'); break;
      case 'formatBlock':
        if (btn.dataset.value === 'h2') lines(() => org ? '** ' : '## ');
        else if (btn.dataset.value === 'blockquote') {
          if (org) wrap('#+BEGIN_QUOTE\n', '\n#+END_QUOTE');
          else lines(() => '> ');
        } else if (btn.dataset.value === 'pre') wrap(org ? '#+BEGIN_EXAMPLE\n' : '```\n', org ? '\n#+END_EXAMPLE' : '\n```', 'code');
        else {
          const from = cm.getCursor('from'), to = cm.getCursor('to');
          const end = to.line > from.line && to.ch === 0 ? to.line - 1 : to.line;
          const start = {line: from.line, ch: 0}, finish = {line: end, ch: cm.getLine(end).length};
          cm.replaceRange(cm.getRange(start, finish).replace(org ? /^\*+\s+/gm : /^(?:#{1,6}\s+|>\s?)/gm, ''), start, finish); cm.focus();
        }
        break;
      case 'insertUnorderedList': lines(() => '- '); break;
      case 'insertOrderedList': lines(i => (i + 1) + '. '); break;
      case 'createLink': case 'insertImage': {
        const url = prompt(command === 'insertImage' ? 'Image URL:' : 'Link URL:', 'https://');
        if (!url || !/^(https?:\/\/|mailto:|\/|#)/i.test(url)) return;
        const image = command === 'insertImage';
        insert(org ? (image ? '[[' + url + ']]' : '[[' + url + '][' + (selected || 'link') + ']]') : (image ? '!' : '') + '[' + (selected || (image ? 'image' : 'link')) + '](' + url + ')');
        break;
      }
      case 'table': {
        const answer = prompt('Table dimensions (rows x columns):', '3 x 3');
        const size = answer && answer.match(/^\s*(\d+)\s*x\s*(\d+)\s*$/i);
        if (!size) return;
        const rows = Math.min(50, Number(size[1])), cols = Math.min(20, Number(size[2]));
        if (!rows || !cols) return;
        const header = '| ' + Array.from({length: cols}, (_, i) => 'Header ' + (i + 1)).join(' | ') + ' |';
        const divider = '|' + Array(cols).fill('---').join(org ? '+' : '|') + '|';
        insert('\n' + [header, divider, ...Array(rows).fill('| ' + Array(cols).fill('Cell').join(' | ') + ' |')].join('\n') + '\n');
        break;
      }
      case 'undo': cm.undo(); cm.focus(); break;
      case 'redo': cm.redo(); cm.focus(); break;
    }
  }
  rich.addEventListener('paste', e => {
    if (!e.clipboardData) return;
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    if (html) document.execCommand('insertHTML', false, clean(html));
    else document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
    save();
  });
  rich.addEventListener('drop', e => { e.preventDefault(); });
  async function copy(formatted) {
    const md = markdown();
    const text = !formatted && mode === 'org' ? cm.getValue() : md;
    const html = clean(mode === 'wysiwyg' ? rich.innerHTML : marked.parse(md));
    try {
      if (formatted && navigator.clipboard && window.ClipboardItem) await navigator.clipboard.write([new ClipboardItem({'text/html': new Blob([html], {type: 'text/html'}), 'text/plain': new Blob([text], {type: 'text/plain'})})]);
      else if (!formatted && navigator.clipboard) await navigator.clipboard.writeText(text);
      else throw new Error('Use fallback');
      $('editor-message').textContent = 'Copied.';
    } catch (_) {
      const listener = e => { e.preventDefault(); e.clipboardData.setData('text/plain', text); if (formatted) e.clipboardData.setData('text/html', html); };
      document.addEventListener('copy', listener);
      const ok = document.execCommand('copy');
      document.removeEventListener('copy', listener);
      $('editor-message').textContent = ok ? 'Copied.' : 'Copy unavailable. Select and copy the source manually.';
    }
  }
  $('copy-rich-btn').addEventListener('click', () => copy(true));
  $('copy-md-btn').addEventListener('click', () => copy(false));
  $('clear-btn').addEventListener('click', () => {
    sourceSnapshot = null; initial = ''; changing = true; cm.setValue(''); changing = false;
    rich.innerHTML = ''; richBaseline = ''; $('markup-preview').innerHTML = ''; save();
  });
  document.querySelector('.editor-container').addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    e.preventDefault();
    if ((e.ctrlKey || e.metaKey) && a.getAttribute('href')) window.open(a.href, '_blank', 'noopener,noreferrer');
  });
  setMode('wysiwyg');
})();
