
## INDEX

| Exp No. | Experiment Name |
|:-------:|-----------------|
| 1 | Installation and familiarization with CPUSim software |
| 2 | Implementation for a Basic 16 bit computer |
| 3 | Write an assembly language code for performing ADD and SUBTRACT |
| 4 | CPU Sim practical: AND, OR and NOT operation |
| 5 | CPU Sim practical: XOR, NOR and NAND operations |
| 6 | Assembly for X = A*B + C*D; RISC vs CISC |
| 7 | Zero-address instructions: X = ((A*B)/C) + (D*E) |
| 8 | One-address instructions: X = ((A*B)/C) + (D*E) |
| 9 | Two-address instructions: X = ((A*B)/C) + (D*E) |
| 10 | Three-address instructions: X = ((A*B)/C) + (D*E) |

---

## Experiment - 1: Installation and Familiarization with CPUSim Software

### Aim

To install CPUSim software and become familiar with its user interface and
working environment.

### Software

CPUSim 3.6.9 (or latest version) - A Java-based computer simulation tool used
to design and simulate simple computer architectures at register and
microinstruction levels.

### Theory

CPUSim is an educational simulator used to model a computer system by defining
its hardware elements and control logic. It provides a graphical interface to
create registers, RAM, ALU operations, condition bits, microinstructions, and
machine instructions. This makes it suitable for understanding how instruction
execution happens inside a CPU.

In CPUSim, a student can:

- Build custom machine architecture.
- Define instruction format and opcode mapping.
- Simulate fetch-decode-execute flow.
- Trace register and memory updates step by step.

This practical introduces the software environment so that later experiments on
16-bit machine design, assembly programming, and microinstruction execution can
be performed correctly.

### Steps

1. Install Java Runtime Environment (if required by your CPUSim package).
2. Download and launch CPUSim.
3. Open a new machine file.
4. Explore main windows: Registers, RAM, Microinstructions, Instructions.
5. Load a sample machine and execute a small instruction sequence.
6. Observe how values change in `PC`, `IR`, and `ACC`.

### Implementation Screenshots

> [Insert Screenshot 1: CPUSim installation]

> [Insert Screenshot 2: CPUSim home/interface]

> [Insert Screenshot 3: Machine editor overview]

> [Insert Screenshot 4: First simulation run]

### Result

CPUSim was successfully installed and explored. The user interface and basic
workflow for machine simulation were understood.

### Learning Outcomes

1. Understand the purpose and features of CPUSim.
2. Identify important modules used during architecture practicals.
3. Execute and observe simple simulation steps in CPUSim.

---

## Experiment - 2: Implementation for a Basic 16 bit Computer

### Aim

To design and implement a basic 16-bit computer architecture in CPUSim.

### Software

CPUSim 3.6.9 (or latest version).

### Theory

A 16-bit basic computer is an architecture where primary CPU registers, data
paths, and memory word size are 16 bits wide. Such a machine can process 16-bit
data in one operation and can represent addresses and instructions according to
its design.

Key components in a basic 16-bit CPUSim machine:

- **Registers:** `PC`, `ACC`, `IR`, `MAR`, `MDR`, and optional temporary
  registers, each of width 16 bits.
- **Memory (RAM):** 16-bit words with suitable address capacity.
- **ALU:** Supports arithmetic and logical operations over 16-bit data.
- **Condition Bits:** Flags such as zero, carry, sign, and overflow (as needed).
- **Microinstructions:** Define internal control actions for each instruction.
- **Machine Instructions:** High-level instructions linked to microinstruction
  routines.

This practical builds the base machine used for all future assembly and
microinstruction experiments.

### Steps to Create Basic 16-bit Computer

1. Launch CPUSim and create a new machine.
2. Define all required registers with width set to 16 bits.
3. Configure RAM with 16-bit word size.
4. Define ALU operations and condition flags.
5. Create fetch cycle microinstructions:
   - `MAR <- PC`
   - `MDR <- Memory[MAR]`
   - `IR <- MDR`
   - `PC <- PC + 1`
6. Create template execute cycles for instruction implementation.
7. Save machine file and run a simple test program.

### Implementation Screenshots

> [Insert Screenshot 1: Register width definitions]

> [Insert Screenshot 2: RAM setup for 16-bit words]

> [Insert Screenshot 3: ALU and condition bits]

> [Insert Screenshot 4: Fetch cycle microinstructions]

> [Insert Screenshot 5: Successful test execution]

### Result

A basic 16-bit computer was successfully implemented in CPUSim with correct
register, memory, and fetch cycle behavior.

### Learning Outcomes

1. Build a complete 16-bit machine model in CPUSim.
2. Understand internal components of basic CPU architecture.
3. Implement and verify fetch cycle for instruction execution.

---

## Experiment - 3: Assembly Language Code for ADD and SUBTRACT

### Aim

To write and execute assembly language programs in CPUSim for performing `ADD`
and `SUBTRACT` operations.

### Software

CPUSim 3.6.9 (or latest version).

### Theory

Arithmetic operations are performed by the ALU and are central to CPU
functioning. In assembly language, arithmetic instructions operate on data
loaded from memory/registers and store results back into memory.

Common instructions used:

- `LDA X` - Load operand from memory location `X` into `ACC`.
- `ADD Y` - Add operand at `Y` to `ACC`.
- `SUB Y` - Subtract operand at `Y` from `ACC`.
- `STA Z` - Store accumulator result in memory location `Z`.
- `HLT` - Stop program execution.

Program flow for arithmetic implementation:

1. Load first operand.
2. Perform addition or subtraction with second operand.
3. Store result.
4. Halt execution.

### Steps

1. Open the basic 16-bit machine from Experiment 2.
2. Confirm instruction set contains `LDA`, `ADD`, `SUB`, `STA`, `HLT`.
3. Write assembly code for addition and load into memory.
4. Execute program and verify sum in destination location.
5. Write/modify code for subtraction and execute.
6. Compare result values with expected manual calculations.

### Sample Program

```text
LDA NUM1
ADD NUM2
STA SUM
LDA NUM1
SUB NUM2
STA DIFF
HLT
```

### Implementation Screenshots

> [Insert Screenshot 1: ADD program in CPUSim]

> [Insert Screenshot 2: ADD execution result]

> [Insert Screenshot 3: SUBTRACT program in CPUSim]

> [Insert Screenshot 4: SUBTRACT execution result]

### Result

Assembly programs for `ADD` and `SUBTRACT` were executed successfully, and
output values were verified as correct.

### Learning Outcomes

1. Write arithmetic assembly instructions in CPUSim.
2. Understand accumulator-based arithmetic execution.
3. Validate outputs using memory and register tracing.

---

## Experiment - 4: CPU Sim Practical for AND, OR and NOT Operation

### Aim

To write and execute assembly language programs for `AND`, `OR`, and `NOT`
operations in CPUSim.

### Software

CPUSim 3.6.9 (or latest version).

### Theory

Logical instructions perform bit-level operations on operands. In CPUSim, these
instructions are executed through ALU control and are very useful for masking,
setting, clearing, and testing bits.

Operations covered in this practical:

- **AND:** Produces `1` only when both bits are `1`.
  - Operation: `ACC <- ACC AND Operand`
- **OR:** Produces `1` when at least one bit is `1`.
  - Operation: `ACC <- ACC OR Operand`
- **NOT:** Inverts every bit in accumulator.
  - Operation: `ACC <- NOT ACC`

Truth table (binary operations):

| A | B | A AND B | A OR B |
|:-:|:-:|:-------:|:------:|
| 0 | 0 |    0    |   0    |
| 0 | 1 |    0    |   1    |
| 1 | 0 |    0    |   1    |
| 1 | 1 |    1    |   1    |

Truth table (NOT):

| A | NOT A |
|:-:|:-----:|
| 0 |   1   |
| 1 |   0   |

### Steps

1. Open the 16-bit machine in CPUSim.
2. Ensure `LDA`, `AND`, `OR`, `NOT`, `STA`, and `HLT` are available.
3. Store sample binary values in memory (for example `A` and `B`).
4. Write assembly code for `AND` and execute it.
5. Write assembly code for `OR` and execute it.
6. Write assembly code for `NOT` and execute it.
7. Compare outputs with expected truth table results.

### Sample Program Structure

```text
LDA A
AND B
STA R1
LDA A
OR B
STA R2
LDA A
NOT
STA R3
HLT
```

### Implementation Screenshots

> [Insert Screenshot 1: AND operation program and output]

> [Insert Screenshot 2: OR operation program and output]

> [Insert Screenshot 3: NOT operation program and output]

> [Insert Screenshot 4: Truth table verification/output panel]

### Result

`AND`, `OR`, and `NOT` assembly programs were implemented successfully in
CPUSim and outputs matched expected logic results.

### Learning Outcomes

1. Implement `AND`, `OR`, and `NOT` using assembly instructions.
2. Understand unary and binary logical processing in ALU.
3. Verify logical output using simulator and truth tables.

---

## Experiment - 5: CPU Sim Practical for XOR, NOR and NAND Operations

### Aim

To write and execute assembly language programs for `XOR`, `NOR`, and `NAND`
operations in CPUSim.

### Software

CPUSim 3.6.9 (or latest version).

### Theory

`XOR`, `NOR`, and `NAND` are advanced logical operations commonly used in
digital circuit design, bit manipulation, and low-level computation.

- **XOR (Exclusive OR):** Output is `1` only when both bits are different.
  - Operation: `ACC <- ACC XOR Operand`
- **NOR:** Complement of OR.
  - Operation: `ACC <- NOT (ACC OR Operand)`
- **NAND:** Complement of AND.
  - Operation: `ACC <- NOT (ACC AND Operand)`

Truth table:

| A | B | A XOR B | A NOR B | A NAND B |
|:-:|:-:|:-------:|:-------:|:--------:|
| 0 | 0 |    0    |    1    |    1     |
| 0 | 1 |    1    |    0    |    1     |
| 1 | 0 |    1    |    0    |    1     |
| 1 | 1 |    0    |    0    |    0     |

### Steps

1. Open the CPUSim 16-bit machine.
2. Ensure `LDA`, `XOR`, `NOR`, `NAND`, `STA`, and `HLT` are available.
3. Load input operands into memory locations.
4. Write and run assembly code for `XOR`.
5. Write and run assembly code for `NOR`.
6. Write and run assembly code for `NAND`.
7. Verify results with truth table values.

### Sample Program Structure

```text
LDA A
XOR B
STA R1
LDA A
NOR B
STA R2
LDA A
NAND B
STA R3
HLT
```

### Implementation Screenshots

> [Insert Screenshot 1: XOR program and output]

> [Insert Screenshot 2: NOR program and output]

> [Insert Screenshot 3: NAND program and output]

> [Insert Screenshot 4: Result verification panel]

### Result

`XOR`, `NOR`, and `NAND` operations were successfully implemented and executed
in CPUSim. All obtained outputs were verified and found correct.

### Learning Outcomes

1. Implement advanced logical operations in CPUSim.
2. Differentiate behavior of `XOR`, `NOR`, and `NAND`.
3. Verify logical operation outputs using truth tables and simulator output.
