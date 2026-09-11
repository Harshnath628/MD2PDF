# COMPUTER SYSTEM ARCHITECTURE

## LAB PRACTICAL FILE (PART 2)

This document continues `practical_file.md` with Experiments 6 through 10 on
instruction formats, RISC/CISC comparison, and address formats.

---

## INDEX (Experiments 6 to 10)

| Exp No. | Experiment Name |
|:-------:|-----------------|
| 6 | Assembly for X = A*B + C*D; RISC vs CISC |
| 7 | Zero-address (stack) instructions for X = ((A*B)/C) + (D*E) |
| 8 | One-address (accumulator) instructions for X = ((A*B)/C) + (D*E) |
| 9 | Two-address instructions for X = ((A*B)/C) + (D*E) |
| 10 | Three-address instructions for X = ((A*B)/C) + (D*E) |

---

## Experiment - 6: Assembly Language Code for X = A*B + C*D (RISC vs CISC)

### Aim

To write assembly language code for the expression `X = A*B + C*D` and to
differentiate between RISC and CISC instruction formats based on this
implementation.

### Software

CPUSim 3.6.9 (or latest version) / conceptual assembly reference.

### Theory

Computer architectures are broadly classified into two categories based on
their instruction set design:

- **CISC (Complex Instruction Set Computer):** Uses a large set of complex,
  often variable-length instructions. A single instruction can perform memory
  access and arithmetic together (memory-to-memory operations are allowed).
  Examples: Intel x86, VAX.
- **RISC (Reduced Instruction Set Computer):** Uses a small set of simple,
  fixed-length instructions. Only `LOAD` and `STORE` access memory; arithmetic
  works on registers (load/store architecture). Examples: ARM, MIPS, SPARC.

For `X = A*B + C*D`, CISC typically needs fewer instructions because each
instruction can do more work, while RISC needs more instructions but each may
execute in a single cycle in a pipelined design.

### CISC Assembly Code (Illustrative)

```text
MUL  R1, A, B      ; R1 <- A * B   (memory operands allowed)
MUL  R2, C, D      ; R2 <- C * D
ADD  R1, R1, R2    ; R1 <- R1 + R2
MOV  X, R1         ; Store result in X
```

### RISC Assembly Code (Illustrative)

```text
LOAD  R1, A        ; R1 <- M[A]
LOAD  R2, B        ; R2 <- M[B]
LOAD  R3, C        ; R3 <- M[C]
LOAD  R4, D        ; R4 <- M[D]
MUL   R1, R1, R2   ; R1 <- A * B
MUL   R3, R3, R4   ; R3 <- C * D
ADD   R1, R1, R3   ; R1 <- (A*B) + (C*D)
STORE X, R1        ; M[X] <- R1
```

### Comparison Table

| Feature | CISC | RISC |
|:--------|:-----|:-----|
| Instruction count | Fewer (example: 4) | More (example: 8) |
| Instruction length | Often variable | Typically fixed |
| Memory access | May appear in many instructions | Only LOAD/STORE to memory |
| Execution time per instruction | Often multiple cycles | Often 1 cycle per simple op |
| Hardware complexity | Generally higher | Generally lower |
| Code size | Often more compact | Often larger instruction count |

### Implementation Screenshots

> [Insert Screenshot 1: Notes or CPUSim reference for expression evaluation]

> [Insert Screenshot 2: Side-by-side RISC vs CISC code comparison]

### Result

The expression `X = A*B + C*D` was written in both RISC-style and CISC-style
assembly forms, and the structural differences between the two architectures
were analyzed.

### Learning Outcomes

1. Understand key differences between RISC and CISC.
2. Write the same arithmetic expression using both instruction styles.
3. Compare instruction count, format, and memory-access rules.

---

## Experiment - 7: Zero-Address (Stack) Instructions for X = ((A*B)/C) + (D*E)

### Aim

To explain and implement zero-address instructions using a stack-based machine
for the expression `X = ((A*B)/C) + (D*E)`.

### Software

CPUSim 3.6.9 (or latest version) / conceptual assembly reference.

### Theory

In **zero-address** instruction format, instructions do not name operand
addresses explicitly. Operands are taken from the **top of the stack (TOS)**;
results are pushed back. Such machines are **stack-organized**.

Common zero-address instructions:

- `PUSH M` - Push value at memory `M` onto the stack.
- `POP M` - Pop TOS into memory `M`.
- `ADD` - Pop two values, add, push result.
- `SUB`, `MUL`, `DIV` - Similar binary ops on TOS values.

The expression must be converted to **postfix (Reverse Polish Notation)** first.

**Postfix for** `X = ((A*B)/C) + (D*E)`:

```text
A B * C / D E * +
```

### Zero-Address Assembly Code

```text
PUSH A      ; TOS <- A
PUSH B      ; TOS <- B
MUL         ; TOS <- A * B
PUSH C      ; TOS <- C
DIV         ; TOS <- (A*B) / C
PUSH D      ; TOS <- D
PUSH E      ; TOS <- E
MUL         ; TOS <- D * E
ADD         ; TOS <- ((A*B)/C) + (D*E)
POP  X      ; M[X] <- TOS
```

### Implementation Screenshots

> [Insert Screenshot 1: Postfix conversion / stack trace]

> [Insert Screenshot 2: Zero-address code execution notes]

### Result

The expression was implemented with zero-address (stack) instructions; postfix
evaluation order was verified.

### Learning Outcomes

1. Understand stack-organized CPUs.
2. Convert infix expressions to postfix.
3. Implement an expression using only zero-address instructions.

---

## Experiment - 8: One-Address (Accumulator) Instructions for X = ((A*B)/C) + (D*E)

### Aim

To explain and implement one-address instructions using an accumulator-based
machine for `X = ((A*B)/C) + (D*E)`.

### Software

CPUSim 3.6.9 (or latest version) / conceptual assembly reference.

### Theory

**One-address** format names one operand explicitly; the other operand and the
result use the **accumulator (ACC)**. A CPUSim-style basic 16-bit machine often
matches this model.

Common one-address instructions:

- `LOAD M` - `ACC <- M[M]`
- `STORE M` - `M[M] <- ACC`
- `ADD M` - `ACC <- ACC + M[M]`
- `SUB M` - `ACC <- ACC - M[M]`
- `MUL M` - `ACC <- ACC * M[M]`
- `DIV M` - `ACC <- ACC / M[M]`

A **temporary** memory cell (e.g. `T`) holds intermediate results.

### One-Address Assembly Code

```text
LOAD  A      ; ACC <- A
MUL   B      ; ACC <- A * B
DIV   C      ; ACC <- (A*B) / C
STORE T      ; T <- (A*B)/C
LOAD  D      ; ACC <- D
MUL   E      ; ACC <- D * E
ADD   T      ; ACC <- (D*E) + T
STORE X      ; X <- result
```

### Implementation Screenshots

> [Insert Screenshot 1: Accumulator trace for intermediate T]

> [Insert Screenshot 2: Final store to X]

### Result

The expression was implemented with one-address instructions using temporary
storage `T` for the first sub-expression.

### Learning Outcomes

1. Understand accumulator-based execution.
2. Use temporary memory for partial results.
3. Implement arithmetic with one-address instructions only.

---

## Experiment - 9: Two-Address Instructions for X = ((A*B)/C) + (D*E)

### Aim

To explain and implement two-address instructions for
`X = ((A*B)/C) + (D*E)`.

### Software

CPUSim 3.6.9 (or latest version) / conceptual assembly reference.

### Theory

**Two-address** instructions specify two operands. One operand is usually both
**source and destination** (the destination is overwritten). Common in many
CISC-style ISAs (e.g. Intel x86 style).

General form:

```text
OP destination, source    ; destination <- destination OP source
```

Examples:

- `MOV D, S` - `D <- S`
- `ADD D, S` - `D <- D + S`
- `MUL D, S` - `D <- D * S`
- `DIV D, S` - `D <- D / S`

### Two-Address Assembly Code

```text
MOV  R1, A       ; R1 <- A
MUL  R1, B       ; R1 <- A * B
DIV  R1, C       ; R1 <- (A*B) / C
MOV  R2, D       ; R2 <- D
MUL  R2, E       ; R2 <- D * E
ADD  R1, R2      ; R1 <- ((A*B)/C) + (D*E)
MOV  X, R1       ; X <- R1
```

### Implementation Screenshots

> [Insert Screenshot 1: Register R1/R2 trace]

> [Insert Screenshot 2: Final MOV to X]

### Result

The expression was implemented with two-address instructions; destination
registers were updated in place.

### Learning Outcomes

1. Understand two-address format.
2. Recognize destination overwrite behavior.
3. Implement the expression efficiently with two-address code.

---

## Experiment - 10: Three-Address Instructions for X = ((A*B)/C) + (D*E)

### Aim

To explain and implement three-address instructions for
`X = ((A*B)/C) + (D*E)`.

### Software

CPUSim 3.6.9 (or latest version) / conceptual assembly reference.

### Theory

**Three-address** instructions name **two sources** and **one destination**:
`dest <- src1 OP src2`. Instruction encoding is wider, but **fewer
instructions** are often needed. Typical in RISC register operations (MIPS,
ARM-style models).

General form:

```text
OP dest, src1, src2    ; dest <- src1 OP src2
```

Examples:

- `ADD R1, R2, R3` - `R1 <- R2 + R3`
- `MUL R1, R2, R3` - `R1 <- R2 * R3`
- `DIV R1, R2, R3` - `R1 <- R2 / R3`

### Three-Address Assembly Code

```text
MUL  R1, A, B      ; R1 <- A * B
DIV  R1, R1, C     ; R1 <- (A*B) / C
MUL  R2, D, E      ; R2 <- D * E
ADD  X,  R1, R2    ; X  <- R1 + R2
```

### Comparison of Addressing Formats (Same Expression)

| Format | Typical instruction count | Operand encoding | Example style |
|:-------|:--------------------------|:-----------------|:--------------|
| Zero-address | More (stack ops) | Implicit (stack) | Stack machine |
| One-address | Medium | ACC + one memory | Accumulator CPU |
| Two-address | Medium | Dest = src and dest | CISC-like |
| Three-address | Fewest for this expr | Two src + one dest | RISC registers |

### Implementation Screenshots

> [Insert Screenshot 1: Three-address code listing]

> [Insert Screenshot 2: Comparison with Experiments 7-9]

### Result

The expression was implemented with three-address instructions, yielding a
short instruction sequence for this expression class.

### Learning Outcomes

1. Understand three-address format.
2. See how explicit dest reduces moves for this expression.
3. Compare zero-, one-, two-, and three-address styles for the same formula.

---

## References

1. Patterson, D. A. and Hennessy, J. L., *Computer Organization and Design:
   The Hardware/Software Interface* - RISC/CISC, instruction formats, MIPS
   style three-address register operations.
2. Stallings, W., *Computer Organization and Architecture* - addressing modes,
   stack machines, CISC vs RISC trade-offs.
3. Tanenbaum, A. S. and Austin, T., *Structured Computer Organization* -
   stack, accumulator, and general register organizations.
