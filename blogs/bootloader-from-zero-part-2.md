---
layout: blog.njk
title: "Bootloader from zero - Part 2: Second stage"
subtitle: 
date: 2026-09-11
---

## Introduction
In [part 1](https://yh-yahan.netlify.app/blogs/bootloader-from-zero-part-1/) of this series, I wrote a simple single stage bootloader that prints "Hello, World". For part 2, I turned that into a two stage bootloader and made it print "Hello, World" as well. My goal is to load another sector of the disk using the first stage and execute code from there, so to keep things simple, I skipped the partition table again and the second stage would be the following sector of the first stage.

## Implementation
### boot.asm
```
org 0x7c00
mov ax, 0
mov ds, ax

mov ah, 0x02
mov al, 1 ; reads 1 sector (512 bytes)
mov ch, 0 ; set cylinder to 0
mov cl, 2 ; starting from second sector
mov dh, 0 ; set head to 0
mov bx, 0
mov es, bx
mov bx, 0x7e00
int 0x13

jc error

jmp 0x7e00

error:
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

msg db "Disk read failed"
length dw $ - msg

times 510 - ($ - $$) db 0

db 0x55
db 0xAA
```

### Step by step explanation of code for boot.asm
```
org 0x7c00
mov ax, 0
mov ds, ax
```
At the top, I set the origin to 0x7c00 (which is the address the BIOS loads the code into), meaning the address of the memory that the code will be loaded into when it runs. Then ds is set to 0 so that `0 * 16 + 0x7c00 = 0x7c00`.

```
mov ah, 0x02
mov al, 1 ; reads 1 sector (512 bytes)
mov ch, 0 ; set cylinder to 0
mov cl, 2 ; starting from second sector
mov dh, 0 ; set head to 0
mov bx, 0
mov es, bx
mov bx, 0x7e00
int 0x13
```
Here, I need to read the second stage into memory by using BIOS interrupt calls 0x13 (low level disk services) 0x02 (read sectors). I set ah to 0x02 to tell BIOS that I want to read sectors. 0x02 have the parameters of al (sectors to read), ch (cylinder), cl (sector), dh (head), dl (drive) and ES:BX (buffer address pointer). 

al is set to 1 here to read one sector (with each sector being 512 bytes), al can be set to a higher number to read more sectors. However since for second stage I only intend to display hello world, 512 bytes is enough, so I only need to read one sector. cl is then set to 2 (as it starts from 1 not 0) to read the second sector (which is the one after the first stage code). ch (cylinder) and dh (head) is then set to 0, head is which record in the stack and cylinder is which ring on that record. dl (the drive to read from) is already set by the BIOS so there's no need to set it.

ES:BX is the memory the BIOS writes the sector to. `physical address = segment * 16 + offset`, the segment is es and the offset is bx. So, es is set to 0 and bx is set to the address where we want the BIOS to load it onto, 0x7e00. `0 * 16 + 0x7e00 = 0x7e00`. 0x7e00 is the address I want to use is because the first stage is loaded in 0x7c00 and as the first stage is 512 bytes (which is 0x200 in hex), so, 0x7c00+0x200=0x7e00.

And then we send the interrupt 0x13.

```
jc error

jmp 0x7e00

error:
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

msg db "Disk read failed"
length dw $ - msg
```
int 13h ah=02h also returns results of CF (set on error), AH (return code), and AL (actual sectors read count). Here, I'm trying to display an error when cf is set. Using jc (jump if carry), jump if CF is set, we jump to the error block. Otherwise, we jump to the memory address where we loaded our second stage onto which is 0x7e00 and continue executing code from there.

Then in the error block, an error message will be displayed and then hang. If CF is set, AH will contain the error code, but to keep things simple, I'll ignore AH for now.

```
times 510 - ($ - $$) db 0

db 0x55
db 0xAA
```
Finally, we add padding until we reach 510 bytes and then write the signature for BIOS to determine if the disk is bootable.

### second_stage.asm
```
org 0x7e00 ; 0x7c00+0x200
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
```

### Explanation of code for second_stage.asm
```
org 0x7e00 ; 0x7c00+0x200
mov ax, 0
mov ds, ax
```
The origin is set to 0x7e00 as in stage one, the BIOS was told to load stage two to the address of 0x7e00. Again, ds is set to 0 so `0 * 16 + 0x7e00 = 0x7e00`.

Then, the rest of the code is very similar to part 1 where we display hello world onto the screen using BIOS interrupt of 10h AH=0eh. Adding padding till 510 bytes and then add the signature is not required for stage two as the BIOS won't check or care if it's bootable.

### Assemble the code
`nasm -f bin boot.asm -o boot.bin`  
`nasm -f bin second_stage.asm -o second_stage.bin` 

### Create and write the binary to a disk image
`cat boot.bin second_stage.bin > disk.img` 
### Using qemu to boot from the disk image
`qemu-system-x86_64 -drive format=raw,file=disk.img` 

## References
[https://wiki.osdev.org/Bootloader](https://wiki.osdev.org/Bootloader)  
[https://jyywiki.cn/pages/OS/manuals/BIOS-interrupts.pdf](https://jyywiki.cn/pages/OS/manuals/BIOS-interrupts.pdf)  
[https://en.wikipedia.org/wiki/BIOS_interrupt_call](https://en.wikipedia.org/wiki/BIOS_interrupt_call)  
[https://en.wikipedia.org/wiki/INT_13H](https://en.wikipedia.org/wiki/INT_13H)  
