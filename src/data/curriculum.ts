export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export const curriculum: Module[] = [
  {
    id: 'microprocessors',
    title: 'Microprocessors',
    description: 'Evolution, memory design, architecture of 8085/8086, and interfacing.',
    lessons: [
      {
        id: 'evolution-plds',
        title: 'Evolution & Logic Devices',
        content: `
# Evolution of Microprocessors

The microprocessor has evolved dramatically since its inception. It is the "brain" of a computer, integrating the functions of a central processing unit (CPU) onto a single integrated circuit (IC).

## Generations of Microprocessors
1. **First Generation (4-bit)**: Intel 4004 (1971). Used for simple calculators.
2. **Second Generation (8-bit)**: Intel 8008, 8080, and **8085**. Faster, more memory addressing (up to 64KB).
3. **Third Generation (16-bit)**: Intel **8086**, 8088, Zilog Z8000. Introduced pipelining and segmented memory (up to 1MB).
4. **Fourth Generation (32-bit)**: Intel 80386, 80486. Introduced protected mode, paging, and virtual memory (up to 4GB).
5. **Fifth Generation & Beyond (64-bit/Multi-core)**: Pentium, Core i-series, AMD Ryzen. Superscalar execution, massive caches, and multiple cores.

## Register-Based vs Accumulator-Based Architecture

### Accumulator-Based (e.g., 8085)
In this architecture, one operand of an Arithmetic Logic Unit (ALU) operation is implicitly the **Accumulator** register. The result is also stored back in the Accumulator.
* **Pros**: Simple instruction decoding, shorter instructions.
* **Cons**: High memory traffic (bottleneck) because data must constantly be moved in and out of the single accumulator.

\`\`\`text
[Memory/Register] ---> (ALU) <--- [Accumulator]
                          |
                          v
                    [Accumulator]
\`\`\`

### Register-Based (e.g., 8086, Modern CPUs)
Features multiple general-purpose registers. Any register can act as a source or destination for ALU operations.
* **Pros**: Faster execution, less memory access, easier for compilers to optimize.
* **Cons**: Longer instruction encoding (need to specify which registers are used).

\`\`\`text
[Register A] ---> (ALU) <--- [Register B]
                    |
                    v
               [Register C]
\`\`\`

## Programmable Logic Devices (PLDs)
PLDs are electronic components used to build reconfigurable digital circuits. Unlike standard logic gates (AND, OR, NOT) which have fixed functions, PLDs can be programmed after manufacturing.

* **Types**: PROM, PLA (Programmable Logic Array), PAL (Programmable Array Logic), CPLD, FPGA.
* **Usage in Microprocessors**: Used for address decoding, generating control signals, and interfacing memory/IO devices, reducing the total chip count on a motherboard.
        `,
        quiz: [
          {
            question: "Which architecture relies on a single implicit register for one operand and the result of ALU operations?",
            options: ["Register-based", "Accumulator-based", "Stack-based", "Memory-memory"],
            correctIndex: 1
          }
        ]
      },
      {
        id: 'memory-io',
        title: 'Memory & I/O Techniques',
        content: `
# Main Memory Array Design & I/O

## Main Memory Array Design
Memory is organized as a 2D array of cells. To access a specific byte, the CPU places an address on the **Address Bus**. 
A **Decoder** (often a PLD) translates this address to select a specific memory chip (Chip Select / CS).

\`\`\`text
Address Bus (e.g., A0-A15)
      |
      v
+-----------+       +-----------------+
|  Decoder  | ----> | Memory Chip (CS)|
+-----------+       +-----------------+
                          ^
                          | Data Bus (D0-D7)
\`\`\`

## Memory Management Concepts
Memory management is crucial for system stability and multitasking.
1. **Segmentation**: Divides memory into variable-sized segments (Code, Data, Stack). Used heavily in 8086.
2. **Paging**: Divides memory into fixed-size pages (e.g., 4KB). Allows **Virtual Memory**, where the OS uses disk space to simulate extra RAM.

## Input/Output (I/O) Techniques
How does the CPU talk to external devices (keyboard, disk, display)?

1. **Programmed I/O (Polling)**: 
   The CPU constantly checks the status register of the I/O device in a loop.
   * *Analogy*: Asking "Are we there yet?" every 5 seconds.
   * *Pros*: Simple hardware. *Cons*: Wastes CPU cycles.

2. **Interrupt-Driven I/O**:
   The CPU does its normal work. When the I/O device is ready, it sends a hardware signal (Interrupt) to the CPU.
   * *Analogy*: Waiting for a doorbell to ring.
   * *Pros*: Efficient CPU usage. *Cons*: Overhead of saving/restoring CPU state.

3. **Direct Memory Access (DMA)**:
   For large data transfers (e.g., reading a file from disk), the CPU tells a **DMA Controller** to handle it. The DMA takes over the system buses and transfers data directly between I/O and Memory, bypassing the CPU entirely.
   * *Pros*: Extremely fast bulk transfers.
        `,
        quiz: [
          {
            question: "Which I/O technique allows an external device to transfer data directly to memory without the CPU's involvement?",
            options: ["Polling", "Programmed I/O", "Interrupt-driven I/O", "Direct Memory Access (DMA)"],
            correctIndex: 3
          }
        ]
      },
      {
        id: 'arch-8085-8086',
        title: '8085 & 8086 Architecture',
        content: `
# Internal Architecture: 8085 vs 8086

## Intel 8085 Architecture (8-bit)
The 8085 is an 8-bit microprocessor.
* **ALU**: 8-bit.
* **Registers**: Accumulator (A), B, C, D, E, H, L (all 8-bit). Can form 16-bit pairs (BC, DE, HL).
* **Buses**: 8-bit data bus, 16-bit address bus (can address $2^{16}$ = 64 KB of memory).

## Intel 8086 Architecture (16-bit)
The 8086 is a massive leap forward. It is divided into two independent units working in parallel (Pipelining).

### 1. Bus Interface Unit (BIU)
Handles all communication with external memory and I/O.
* Fetches instructions and stores them in a **6-byte Instruction Queue**.
* Calculates the 20-bit physical address using Segment Registers (CS, DS, SS, ES) and an offset.
* **Physical Address = (Segment Register * 10H) + Offset**

### 2. Execution Unit (EU)
Executes instructions.
* Pulls instructions from the BIU's queue.
* Contains the ALU, Flags register, and General Purpose Registers (AX, BX, CX, DX, SP, BP, SI, DI).

\`\`\`text
+-------------------------+      +-------------------------+
|  Execution Unit (EU)    |      | Bus Interface Unit (BIU)|
|                         |      |                         |
|  [ALU]   [Registers]    |<---->|  [Segment Registers]    |
|                         |      |  [Instruction Queue]    |
+-------------------------+      +-------------------------+
                                              |
                                     System Bus (Memory/IO)
\`\`\`

## Addressing Modes
How the CPU finds the data it needs to process.
* **Immediate**: Data is in the instruction itself (\`MOV AX, 1234H\`).
* **Register**: Data is in a register (\`MOV AX, BX\`).
* **Direct**: Memory address is given directly (\`MOV AX, [1234H]\`).
* **Indirect**: A register holds the memory address (\`MOV AX, [BX]\`).

## Instruction Format
Instructions consist of an **Opcode** (what to do) and **Operands** (what to do it on). 8086 instructions vary from 1 to 6 bytes.
        `,
        quiz: [
          {
            question: "In the 8086 microprocessor, which unit is responsible for fetching instructions and calculating physical addresses?",
            options: ["Execution Unit (EU)", "Arithmetic Logic Unit (ALU)", "Bus Interface Unit (BIU)", "Instruction Queue"],
            correctIndex: 2
          }
        ]
      },
      {
        id: 'hardware-interfacing',
        title: 'Hardware & Interfacing',
        content: `
# Hardware Configurations of 8086

## Pin Configuration
The 8086 is a 40-pin Dual Inline Package (DIP) IC.
* **AD0-AD15**: Multiplexed Address and Data bus. During the first clock cycle (T1), they carry the address. During T2-T4, they carry data. This saves pins.
* **A16/S3 - A19/S6**: Multiplexed upper address bits and status signals.
* **ALE (Address Latch Enable)**: A signal used to demultiplex (separate) the address from the data bus using external latches.

## Maximum / Minimum Mode
The 8086 can operate in two modes, determined by the **MN/MX'** pin (Pin 33).
1. **Minimum Mode (MN/MX' = 5V)**: 
   The 8086 acts as a single processor. It generates all control signals (RD, WR, INTA) directly.
2. **Maximum Mode (MN/MX' = 0V)**: 
   Used in multiprocessor systems (e.g., paired with an 8087 Math Coprocessor). The 8086 delegates control signal generation to an external **8288 Bus Controller**.

## Read/Write Cycle
A standard 8086 bus cycle takes **4 Clock Periods (T-states)**:
* **T1**: CPU places the address on the bus and pulses ALE.
* **T2**: CPU changes bus direction for read, or puts data on bus for write.
* **T3**: Data transfer occurs. (Wait states can be inserted here if memory is slow).
* **T4**: Cycle completes, buses are deactivated.

## Memory Banking
The 8086 has a 16-bit data bus, but memory is organized in 8-bit bytes. To access 16 bits at once, the 1MB memory is split into two 512KB banks:
* **Even Bank (Lower)**: Connected to D0-D7. Selected by A0 = 0.
* **Odd Bank (Upper)**: Connected to D8-D15. Selected by BHE' (Bus High Enable) = 0.
This allows the CPU to read an 8-bit byte or a 16-bit word in a single cycle.
        `,
        quiz: [
          {
            question: "Which pin on the 8086 is used to demultiplex the Address/Data bus?",
            options: ["BHE'", "ALE", "MN/MX'", "NMI"],
            correctIndex: 1
          }
        ]
      },
      {
        id: 'interrupts-dma',
        title: 'Interrupts & DMA',
        content: `
# Interrupts and DMA

## Interrupts and Handling
An interrupt is a signal that temporarily suspends the main program to execute a specific routine (Interrupt Service Routine - ISR).

### Types of Interrupts in 8086:
1. **Hardware Interrupts**: Triggered by external pins.
   * **NMI (Non-Maskable Interrupt)**: Cannot be ignored. Used for critical errors (e.g., power failure).
   * **INTR (Interrupt Request)**: Can be masked (ignored) by clearing the Interrupt Flag (IF).
2. **Software Interrupts**: Triggered by instructions (\`INT n\`, where n is 0-255).

### Interrupt Handling Process:
1. CPU finishes current instruction.
2. Pushes Flags, CS, and IP registers to the Stack.
3. Clears IF and TF flags.
4. Fetches the ISR address from the **Interrupt Vector Table (IVT)** (located at memory 00000H).
5. Executes ISR.
6. \`IRET\` instruction pops IP, CS, and Flags back, resuming the main program.

## Interrupt Controller (8259A)
When multiple devices need to interrupt the CPU, an **8259A Programmable Interrupt Controller (PIC)** is used. 
It accepts up to 8 interrupt requests, resolves priority, and sends a single INTR signal to the CPU, along with the vector number of the highest priority device.

## DMA (Direct Memory Access)
When transferring huge blocks of data (e.g., disk to RAM), routing it through the CPU is too slow.
1. The **8237 DMA Controller** sends a **HOLD** signal to the CPU.
2. The CPU finishes its current bus cycle and responds with **HLDA** (Hold Acknowledge), floating its buses (disconnecting from them).
3. The DMA Controller takes mastership of the buses and transfers data directly between I/O and Memory.
4. Once done, DMA drops HOLD, and CPU resumes control.
        `,
        quiz: [
          {
            question: "Which hardware interrupt on the 8086 cannot be ignored or masked by software?",
            options: ["INTR", "INT 21H", "NMI", "Software Interrupt"],
            correctIndex: 2
          }
        ]
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Microprocessors',
    description: 'Internal architecture, memory management, and overview of advanced processors.',
    lessons: [
      {
        id: 'x86-evolution',
        title: 'Intel x86 Evolution',
        content: `
# Evolution of Advanced Microprocessors

The x86 architecture evolved rapidly to meet the demands of modern operating systems like Windows and Linux.

## Intel 80186 & 80286
* **80186 (16-bit)**: Primarily an embedded processor. It integrated many peripheral chips (DMA, timers, interrupt controller) directly onto the CPU die to reduce motherboard cost.
* **80286 (16-bit)**: A massive milestone. It introduced **Protected Mode**. It could address 16MB of physical memory and 1GB of virtual memory. However, switching back to Real Mode (for DOS compatibility) required a hardware reset, which was clunky.

## Intel 80386 & 80486
* **80386 (32-bit)**: The first fully 32-bit x86 processor. 
  * 32-bit registers (EAX, EBX, etc.).
  * 32-bit address bus (can address **4GB** of physical memory).
  * Introduced **Paging**, the foundation of modern virtual memory.
* **80486 (32-bit)**: Highly integrated. 
  * Brought the Math Coprocessor (FPU) on-chip.
  * Added an **L1 Cache** (8KB) directly on the CPU die.
  * Heavily pipelined, executing many instructions in just 1 clock cycle.

## Pentium Microprocessors
The Pentium (80586) introduced **Superscalar Architecture**.
* It had two parallel integer execution pipelines (U and V pipes), allowing it to execute **two instructions per clock cycle**.
* Separated the L1 cache into a Data Cache and an Instruction Cache (Harvard architecture internally).
* Featured a 64-bit external data bus for faster memory access.
        `,
        quiz: [
          {
            question: "Which Intel processor was the first to feature a fully 32-bit architecture and introduce Paging?",
            options: ["80286", "80386", "80486", "Pentium"],
            correctIndex: 1
          }
        ]
      },
      {
        id: 'memory-protection',
        title: 'Memory Management & Protection',
        content: `
# Advanced Memory Management

Starting with the 80286 and perfected in the 80386, memory management shifted from simple segmentation to secure, protected environments.

## Protected Mode
In Real Mode (8086 style), any program can access any memory address, meaning a buggy app can crash the OS.
In **Protected Mode**, memory access is strictly controlled.
* **Descriptor Tables**: Segment registers no longer hold base addresses. They hold "Selectors" that point to a Descriptor in a Global Descriptor Table (GDT).
* **Descriptors**: Contain the base address, segment limit (size), and **Privilege Level**.

### Privilege Rings
Protection is enforced using 4 rings (0 to 3).
* **Ring 0**: Operating System Kernel (Highest privilege). Can execute any instruction and access any hardware.
* **Ring 3**: User Applications (Lowest privilege). Cannot access hardware directly or modify OS memory.
If a Ring 3 app tries to access Ring 0 memory, the CPU throws a General Protection Fault (crashing the app, but saving the OS).

\`\`\`text
  +-----------------------+
  | Ring 3: Applications  |
  |  +-----------------+  |
  |  | Ring 2: Drivers |  |
  |  |  +-----------+  |  |
  |  |  | Ring 1    |  |  |
  |  |  |  +-----+  |  |  |
  |  |  |  |Ring0|  |  |  |
  |  |  |  | OS  |  |  |  |
  |  |  |  +-----+  |  |  |
  |  |  +-----------+  |  |
  |  +-----------------+  |
  +-----------------------+
\`\`\`

## Paging
Introduced in the 80386. Paging divides physical memory and virtual memory into fixed-size blocks called **Pages** (usually 4KB).
* The OS maintains a **Page Table** that maps Virtual Addresses (what the program sees) to Physical Addresses (actual RAM chips).
* **Virtual Memory**: If RAM is full, the OS moves pages to the hard drive (Swap/Pagefile). When the program needs them, a "Page Fault" occurs, and the OS brings them back to RAM.
        `,
        quiz: [
          {
            question: "In the x86 protection ring model, which ring is typically reserved for user applications?",
            options: ["Ring 0", "Ring 1", "Ring 2", "Ring 3"],
            correctIndex: 3
          }
        ]
      },
      {
        id: 'risc-alpha',
        title: 'RISC, Coprocessors & Alpha',
        content: `
# Alternative Architectures

While Intel x86 dominated the PC market using CISC (Complex Instruction Set Computer), other architectures took different approaches.

## RISC Processors
**Reduced Instruction Set Computer (RISC)** philosophy argues that CPUs should have a small, simple set of instructions that execute extremely fast (usually in one clock cycle).
* **Characteristics**:
  1. **Load/Store Architecture**: Only \`LOAD\` and \`STORE\` instructions can access memory. All math/logic operations happen strictly between registers.
  2. **Many Registers**: To avoid memory access, RISC CPUs have dozens or hundreds of general-purpose registers.
  3. **Fixed-Length Instructions**: Makes decoding fast and pipelining highly efficient.
* Examples: ARM (used in almost all smartphones), MIPS, PowerPC.

## Coprocessors
A coprocessor is a specialized chip designed to assist the main CPU in specific, mathematically intensive tasks.
* **Math Coprocessor (FPU)**: The Intel 8087 was the coprocessor for the 8086. It handled floating-point arithmetic, trigonometry, and logarithms hundreds of times faster than the 8086 could do via software emulation.
* Modern CPUs integrate the coprocessor directly onto the main die.

## Alpha Processor
Developed by Digital Equipment Corporation (DEC) in 1992, the **DEC Alpha** was a revolutionary 64-bit RISC processor.
* It was designed purely for maximum performance and high clock speeds.
* It lacked some complex instructions (like integer divide), forcing the compiler to handle them, keeping the silicon simple and fast.
* For a time in the 1990s, Alpha processors were the fastest chips in the world, heavily used in supercomputers and high-end workstations.
        `,
        quiz: [
          {
            question: "Which architecture restricts memory access strictly to LOAD and STORE instructions?",
            options: ["CISC", "RISC", "Accumulator-based", "x86"],
            correctIndex: 1
          }
        ]
      }
    ]
  },
  {
    id: 'assembly',
    title: 'Assembly Language',
    description: 'Programming with 8086 instructions, jumps, strings, stacks, and macros.',
    lessons: [
      {
        id: '8086-instructions-jumps',
        title: 'Instructions & Jumps',
        content: `
# 8086 Assembly Programming

Assembly language is a low-level programming language where instructions correspond directly to machine code.

## Basic 8086 Instructions
* **Data Transfer**: \`MOV dest, src\` (Copies data from src to dest).
* **Arithmetic**: 
  * \`ADD dest, src\` (dest = dest + src)
  * \`SUB dest, src\` (dest = dest - src)
  * \`INC dest\` (dest = dest + 1)
  * \`DEC dest\` (dest = dest - 1)
* **Logical**: \`AND\`, \`OR\`, \`XOR\`, \`NOT\`.

## Conditional and Unconditional Jumps
Programs rarely execute in a straight line. Jumps alter the **Instruction Pointer (IP)** to branch to different parts of the code.

### Unconditional Jump
\`JMP label\`
Always jumps to the specified label, regardless of any conditions.

### Conditional Jumps
These jump *only* if specific flags in the **Flags Register** are set or cleared. The flags are usually updated by a previous \`CMP\` (Compare) or arithmetic instruction.

* \`CMP op1, op2\`: Subtracts op2 from op1 internally, updates flags, but discards the result.
* **Jump Instructions**:
  * \`JE\` / \`JZ\`: Jump if Equal / Zero (Zero Flag = 1)
  * \`JNE\` / \`JNZ\`: Jump if Not Equal / Not Zero (Zero Flag = 0)
  * \`JG\` / \`JL\`: Jump if Greater / Less (for signed numbers)
  * \`JA\` / \`JB\`: Jump if Above / Below (for unsigned numbers)

### Example: If-Else Logic
\`\`\`assembly
  MOV AL, 5
  CMP AL, 10
  JG is_greater    ; If AL > 10, jump to is_greater
  
  ; --- Else Block ---
  MOV BL, 0        ; This runs if AL <= 10
  JMP end_if       ; Skip the 'if' block

is_greater:
  ; --- If Block ---
  MOV BL, 1        ; This runs if AL > 10

end_if:
  ; Program continues...
\`\`\`
        `,
        quiz: [
          {
            question: "Which instruction compares two operands by subtracting them internally and updating the flags without modifying the operands?",
            options: ["SUB", "AND", "CMP", "TEST"],
            correctIndex: 2
          }
        ]
      },
      {
        id: 'strings-stacks',
        title: 'String & Stack Operations',
        content: `
# Strings and Stacks

## String Instructions
In 8086, a "string" is a contiguous block of memory (bytes or words). The 8086 has dedicated, highly efficient instructions for manipulating these blocks.
* **Registers used**: 
  * \`SI\` (Source Index) points to the source string in the Data Segment (DS).
  * \`DI\` (Destination Index) points to the destination string in the Extra Segment (ES).
* **Instructions**:
  * \`MOVSB\` / \`MOVSW\`: Move String Byte / Word. Copies data from [SI] to [DI], then auto-increments/decrements SI and DI.
  * \`CMPSB\` / \`CMPSW\`: Compare String Byte / Word.
  * \`SCASB\` / \`SCASW\`: Scan String (searches for a value in AL/AX).
* **The REP Prefix**: 
  You can prefix string instructions with \`REP\`. It will repeat the instruction, decrementing the \`CX\` register each time, until \`CX\` is 0. This creates a hardware-level loop!

\`\`\`assembly
  ; Copy 100 bytes from SI to DI
  MOV CX, 100
  REP MOVSB
\`\`\`

## Stacks Operation
The stack is a **Last-In-First-Out (LIFO)** memory structure. It grows downwards in memory.
* **Registers used**: \`SS\` (Stack Segment) and \`SP\` (Stack Pointer). \`SP\` always points to the top of the stack.

### PUSH and POP
* \`PUSH src\`: 
  1. Decrements SP by 2.
  2. Stores the 16-bit source operand at the new SP address.
* \`POP dest\`:
  1. Copies the 16-bit value at SP into the destination.
  2. Increments SP by 2.

**Why use the stack?**
1. Temporarily saving register values so they aren't overwritten.
2. Passing parameters to procedures.
3. Automatically storing the return address when calling a procedure.
        `,
        quiz: [
          {
            question: "When using the PUSH instruction on the 8086, what happens to the Stack Pointer (SP)?",
            options: ["It increments by 1", "It increments by 2", "It decrements by 1", "It decrements by 2"],
            correctIndex: 3
          }
        ]
      },
      {
        id: 'procedures-macros',
        title: 'Procedures & Macros',
        content: `
# Procedures, Recursion, and Macros

## Procedures (Subroutines)
A procedure is a reusable block of code, similar to a function in high-level languages.
* **CALL**: The \`CALL label\` instruction pushes the address of the *next* instruction (the return address) onto the stack, then jumps to the label.
* **RET**: The \`RET\` instruction pops the return address from the stack into the Instruction Pointer (IP), returning execution to right after the \`CALL\`.

\`\`\`assembly
  CALL my_procedure
  ; Execution resumes here after RET
  ...

my_procedure PROC
  ; Do some work
  RET
my_procedure ENDP
\`\`\`

## Reentrant and Recursive Procedures
* **Reentrant Procedure**: A procedure that can be safely interrupted in the middle of its execution, called again by the interrupting program, and still finish correctly when resumed. 
  * *Rule*: It must not use global memory variables. It must use registers or the stack for all its local data.
* **Recursive Procedure**: A procedure that calls itself.
  * It relies heavily on the stack. Each time it calls itself, it pushes a new set of parameters and a new return address onto the stack, preventing the different instances from interfering with each other.

## Macros
A macro is a named block of code. However, it works very differently from a procedure.
* When you use a macro, the assembler takes the macro's code and **pastes it directly into your program** at compile time (Inline expansion).
* **Pros**: Faster execution (no \`CALL\` or \`RET\` overhead). Can take parameters easily.
* **Cons**: Increases the size of the final executable file if used many times, because the code is duplicated.

### Procedure vs Macro
| Feature | Procedure | Macro |
| :--- | :--- | :--- |
| **Execution** | Jumped to at runtime | Expanded inline at compile time |
| **Overhead** | High (CALL/RET stack ops) | Zero |
| **Code Size** | Small (code exists once) | Large (code duplicated every use) |
        `,
        quiz: [
          {
            question: "Which of the following is expanded inline by the assembler, resulting in duplicated code but faster execution?",
            options: ["Procedure", "Interrupt", "Macro", "Subroutine"],
            correctIndex: 2
          }
        ]
      }
    ]
  }
];
