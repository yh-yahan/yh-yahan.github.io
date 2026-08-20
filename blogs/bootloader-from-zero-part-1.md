---
layout: blog.njk
title: "Bootloader from zero - Part 1: Hello World"
subtitle: 
date: 2026-8-20 17:57:00
---

## Introduction
> Note: This is written for the classic/legacy BIOS + MBR boot process. Modern PCs mostly use UEFI, and legacy BIOS support is being phased out. We’re doing this purely for learning.

From almost no where, I decided to write a bootloader. I started with almost zero knowledge of what a bootloader actually is or does, so I did some research. Below are some of the things I've learned and written from my own understanding.

The BIOS is a firmware that initializes and checks the hardware during system initialization. The BIOS have a boot priority which defines what devices to look and in what order, it follows the order and checks each device to see if it's bootable. By loading the MBR (first 512 bytes of the disk) on to the physical memory starting at 0x7c00 and check if the last two bytes of the 512 bytes are 0x55 followed by 0xAA to determine if it's bootable. It then jumps into the boot code found in the first bootable device. 

MBR (Master Boot Record) is the first 512 bytes on a disk. It contains the boot code, partition information of the disk and the two bytes which the BIOS uses to check if it's bootable (0x55 and 0xAA). The MBR's space usage is usually expected as, 446 bytes for boot code, 64 bytes for partition information and the signature which is two bytes. Each partition's information takes 16 bytes and since the MBR can only store a maximum of 4 primary partitions, it takes up 16*4, 64 bytes. 

Due to the size limit of MBR, the boot code stored on MBR is usually the first stage, where from here, it could load a second stage to perform further operations. The bootloader's job is to load the kernel. For a first stage bootloader, it usually checks for an active flag (0x80) by searching the partition table, then loads the second stage code from the boot sector of the partition. 

The BIOS also provides interrupt calls, which could be used to display output or interact with the hardware. For the first goal of this project, I want to be able to display the text "Hello, World!" on to the screen, which could be done with the help of interrupt calls provided by the BIOS. I think for the first goal, we could skip the partition information (which gives us more space for the boot code), so we'll end up with 510 bytes available for the boot code and the remaining two bytes for the signature. 

## Implementation
```
org 0x7c00
mov ax, 0
mov ds, ax

mov cx, [length]

lea si, msg[0]

msg_loop:
mov ah, 0x0e
mov al, [si]
int 0x10
inc si
loop msg_loop

hang:
jmp hang

msg db "Hello, World!"
length dw $ - msg

times 510 - ($ - $$) db 0

db 0x55
db 0xAA
```

### Step by step explanation of code
```
org 0x7c00
mov ax, 0
mov ds, ax
```
`org` is short for origin which tells the assembler the memory address the code will be loaded once it runs. It is set to 0x7c00 since that's the address where the BIOS loads the 512 bytes into. Without it, the labels we set (such as `msg` or `length`) would be assembled to a lower address, such as 0x00, which would give us garbage if we try to access it since that's not where the code is loaded into.

We then set `ds` (Data Segment) to zero because the cpu calculates the address to look for data as `ds * 16 + offset`. With the offset (`ip`, instruction pointer) being 0x7c00. So, `0 * 16 + 0x7c00 = 0x7c00`. We first set `ax` to zero and then set `ds` to `ax` since we can't set `ds` to a number directly. 

```
mov cx, [length]

lea si, msg[0]

msg_loop:
mov ah, 0x0e
mov al, [si]
int 0x10
inc si
loop msg_loop
```
A loop is used here since we can only display a single character at a time. 

We set `cx` to the value of the `length` variable we defined below. Square brackets are used in order to access the value of the variable instead of the address of where the variable `length` is at. We set the value of length to `cx` (which is a general purpose register that can hold a maximum of 16 bit data) since that's the register that our loop will use to keep track of where we are at. `cx` is set to the length of `msg` because we want to continue the loop until we've got the whole `msg` displayed onto screen. 

`si` is set to the address of the first character of the `msg` variable using `lea` (Load Effective Address). This keeps track of where we are at of the `msg`.

We set the `ah` to 0x0e which is a BIOS interrupt call to write character in TTY mode. `al` is set to the character we want to print for the current loop, `si` contains the address of the character in `msg`, so we use square brackets to access the value of it, giving us an ascii character to print.

`int 0x10` is used to send the interrupt of 10h which is a BIOS interrupt call for video services.

Finally, at the end of the loop, increment `si` so that `si` now stores the address for the next character of `msg`.

Closing the loop with `loop msg_loop`, `loop` will take care of decrementing `cx` and stop once it reaches zero.

```
hang:
jmp hang
```
This causes the code to hang after we have displayed the message. Since we wouldn't want the cpu to try to execute the data section (the variables we defined).

```
msg db "Hello, World!"
length dw $ - msg
```
Our variables, `db` stands for define byte (defines 1 byte) and `dw` stands for define word (defines 2 bytes). A string is an array of characters. `length` stores the length of the `msg` by finding the difference of the address we're at now and the address of `msg`.

```
times 510 - ($ - $$) db 0

db 0x55
db 0xAA
```

This part calculates and pads the binary to 510 bytes and puts the signature at the end. We need a lot of padding since we're ignoring the partition information for this hello world version. The cpu never executes this section (it doesn't execute at the variable section either, since we made it hang before this). `times` is used here to tell the assembler to keep adding 0 to the binary until we reach 510 bytes, `$` means the current address and `$$` means the address since we started. So, it's like `510 - (current location - start location)`. And finally we write `0x55` followed by `0xAA` to the end of the binary.

### Assemble the code

`nasm -f bin -o boot.bin boot.asm`

### Create and write the binary to a disk image

`dd if=/dev/zero of=disk.img bs=1M count=1`

`dd if=boot.bin of=disk.img bs=512 count=1 conv=notrunc`

### Using qemu to boot from the disk image
`qemu-system-x86_64 -drive format=raw,file=disk.img`

We should now be able to see Hello, World! printed on screen. 

![Hello, World!](/assets/images/blogs/bootloader-from-zero-part-1/hello-world.png)

## Conclusion
That's it for Part 1. We now have a tiny bootloader that can print "Hello, World!" and then hang. I still need to get back to work on my main project, so I'm not sure when Part 2 will appear. But whenever it does, the plan is to turn this into at least a simple two stage bootloader. We'll see how long that takes.