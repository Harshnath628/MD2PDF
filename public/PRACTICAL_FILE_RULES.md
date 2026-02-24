# Practical File Creation Rules (Internal Reference)

This document defines the structure, placeholders, and Markdown schema for creating university-style practical files (e.g. ADA, OS, DSA). Use it for consistency and to generate PDFs that match your institution's format.

---

## 1. Permanent Data (Same for All Practicals)

Fill these once and reuse across all practical files. Update only when your details change.

| Placeholder        | Description        | Example                    |
|--------------------|--------------------|----------------------------|
| `{{STUDENT_NAME}}` | Your full name     | Harsh Nath Tripathi        |
| `{{ROLL_NO}}`      | Roll number        | 24293916101                 |
| `{{SECTION}}`      | Class section      | CSE-A                      |
| `{{YEAR}}`         | Current year (e.g.)| 2nd Year                   |
| `{{DEGREE}}`       | Degree programme   | B.TECH(CSE)                |
| `{{INSTITUTION}}`   | University/College | UNIVERSITY OF DELHI        |
| `{{FACULTY}}`      | Faculty name       | FACULTY OF TECHNOLOGY      |
| `{{DEPARTMENT}}`   | Department        | COMPUTER SCIENCE & ENGINEERING |
| `{{SESSION}}`      | Academic session   | 2024-2028                 |

---

## 2. Variable Data (Change Per Subject/File)

Fill these for each new practical file (each subject/course).

| Placeholder        | Description     | Example           |
|--------------------|-----------------|-------------------|
| `{{SUBJECT}}`      | Subject name    | ADA Practical      |
| `{{TEACHER_NAME}}` | Teacher name    | Dr. Juhi Jain      |
| `{{TEACHER_TITLE}}`| Designation     | Assistant Professor |
| `{{TEACHER_DEPT}}` | Department      | CSE Department     |

---

## 3. Structure of a Practical File

### 3.1 Cover Page (First Page)

- Document title (e.g. subject name)
- Session
- Institution, Faculty, Degree, Department
- Two-column: **Submitted To:** (Teacher, Title, Dept) | **Submitted By:** (Name, Year, Degree, Section, Roll No)

### 3.2 Each Practical Entry

Use this order for every practical:

1. **Title** — e.g. `Practical 1 (A): Linear Searching`
2. **Aim** — One or two lines.
3. **Theory** — Short explanation, bullet points, complexity (Time/Space), applications.
4. **Program Code** — Source code in code blocks (C, Python, etc.). Use fenced code with language: ` ```c ` and ` ```python `.
5. **Output** — Sample run or screenshot description / table.
6. **Remark** — Brief observation (e.g. matching with theoretical complexity).
7. **Conclusion** — What you learned.

Use a horizontal rule (`---`) or page-break before each new practical for clearer PDF layout.

---

## 4. Markdown Schema for Complex PDFs

Use this schema to get rich, well-formatted PDFs.

### Headings

```markdown
# Main title (e.g. subject)
## Section
### Subsection
#### Subsubsection
```

### Text formatting

```markdown
**Bold** and *italic* and ~~strikethrough~~
`inline code`
```

### Lists

```markdown
- Bullet item
- Another item

1. Numbered item
2. Second item

- [ ] Unchecked task
- [x] Checked task
```

### Blockquote

```markdown
> Quote or note. Use for important remarks.
```

### Code blocks (important for practicals)

````markdown
```c
#include <stdio.h>
int main() { return 0; }
```

```python
print("Hello")
```
````

### Tables

```markdown
| Column A | Column B |
|----------|----------|
| Row 1    | Data     |
| Row 2    | Data     |
```

### Horizontal rule

```markdown
---
```

### Page break (for PDF)

In Practical File mode, the app can start each practical (each `##` heading) on a new page when you download PDF.

---

## 5. Template (Copy-Paste Ready)

Use "Load practical file template" in the app to fill placeholders from your saved details and this file's variable fields.

---

## 6. File Naming and Export

- **Suggested filename:** `{{SUBJECT}}_Practical.pdf` (e.g. `ADA_Practical.pdf`).
- Use **PDF style: Normal** for full practical files; **Compact** for summaries or handouts.
