# MD2PDF / Word — Full Feature Test

Use this file to verify **all** supported Markdown features in PDF and Word export. Upload it via **Upload .md** or paste into the editor, then use **Download PDF** and **Download Word**.

---

## 1. Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## 2. Text formatting

- **Bold text**
- *Italic text*
- ***Bold and italic***
- ~~Strikethrough~~
- `Inline code` in a sentence.
- Mix: **bold**, *italic*, ~~strikethrough~~, and `code` together.

---

## 3. Lists

### Bullet list
- First item
- Second item
- Third item with **bold** and *italic*

### Numbered list
1. First step
2. Second step
3. Third step

### Task list (checkboxes)
- [ ] Unchecked task one
- [ ] Unchecked task two
- [x] Checked task one
- [x] Checked task two

### Nested lists
1. Top level
   - Nested bullet A
   - Nested bullet B
2. Another top level
   - Sub-item one
   - Sub-item two

---

## 4. Blockquote

> This is a blockquote. Use it for callouts, notes, or quoted text.
>
> Multiple paragraphs in a blockquote are supported.

---

## 5. Code blocks

Inline: use `const x = 42;` for short snippets.

Fenced block (no language):

```
plain code block
line two
line three
```

Fenced block (C):

```c
#include <stdio.h>
int main() {
    printf("Hello, World!\n");
    return 0;
}
```

Fenced block (Python):

```python
def greet(name):
    return f"Hello, {name}!"
print(greet("MD2PDF"))
```

---

## 6. Tables

| Feature    | PDF | Word |
|------------|-----|------|
| Headings   | Yes | Yes  |
| Tables     | Yes | Yes  |
| Code blocks| Yes | Yes  |

| Left | Center | Right |
|:-----|:------:|------:|
| A    | B      | C     |
| 1    | 2      | 3     |

---

## 7. Horizontal rule

Content above.

---

Content below.

---

## 8. Links

- [Markdown Guide](https://www.markdownguide.org/)
- [MD2PDF repo](https://github.com/Harshnath628/MD2PDF)

---

## 9. Mixed content (practical-style)

### Aim
Test **all** Markdown features in one document.

### Theory
- Point one.
- Point two with `code`.
- **Time Complexity:** O(n)
- **Space Complexity:** O(1)

### Sample output

| Input | Output |
|-------|--------|
| Hello | Processed |

### Remark
This file is for testing only.

### Conclusion
If every section above appears correctly in your PDF and Word export, all features are working.
