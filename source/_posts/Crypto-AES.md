---
title: Crypto-AES
date: 2026-03-19 11:55:44
tags: [密码学]
categories: 密码学
mathjax: true
top_img: /images/1.jpg
cover: /images/1.jpg
---

# AES

高级加密标准（AES），又称Rijndael加密法，是美国联邦政府采用的一种区块加密标准。这个标准用来替代原先的DES，已经被多方分析且广为全世界所使用。经过五年的甄选流程，高级加密标准由美国国家标准与技术研究院（NIST）于2001年11月26日发布于FIPS PUB 197，并在2002年5月26日成为有效的标准。现在，高级加密标准已然成为对称密钥加密中最流行的算法之一。

<!-- more -->

## 概述

**AES**（Advanced Encryption Standard，高级加密标准）是目前最广泛使用的对称分组加密算法之一。所谓“对称加密”，指加密和解密使用同一把密钥；所谓“分组加密”，指算法不是一次处理任意长度的数据流，而是把明文切成固定大小的块逐块处理。

**AES** 的分组长度**固定**为 128 bit，常见密钥长度有 128 bit、192 bit 和 256 bit，因此分别称为 AES-128、AES-192 和 AES-256。它被广泛应用于 HTTPS、VPN、磁盘加密、无线通信等场景，可以说是现代信息安全体系中的基础设施之一。

## 整体架构

对于AES-128，即密钥长度为128bit

- 分组长度固定 128 bit
- 状态矩阵 State 是 4×4 字节
- 加密由若干“轮”组成
- 不同密钥长度对应不同轮数

| 类型    | 密钥长度 | 轮数 |
| ------- | -------- | ---- |
| AES-128 | 128 bit  | 10   |
| AES-192 | 192 bit  | 12   |
| AES-256 | 256 bit  | 14   |

加密时，各轮AES加密循环（除最后一轮外）均包含4个步骤：

**AddRoundKey**——矩阵中的每一个字节都与该次回合密钥（round key）做XOR运算；每个子密钥由密钥生成方案产生。
**SubBytes**——透过一个非线性的替换函数，用查找表的方式把每个字节替换成对应的字节。
**ShiftRows**——将矩阵中的每个横列进行循环式移位。
**MixColumns**——为了充分混合矩阵中各个直行的操作。这个步骤使用线性转换来混合每内联的四个字节。最后一个加密循环中省略MixColumns步骤，而以另一个AddRoundKey取代。

## 明文处理

在加密开始时，首先需要将明文划分为若干个 16 字节分组，并逐组进行处理。

以下讨论以单个 128 bit 明文分组为例，不考虑具体工作模式和 padding 细节。

设某个明文分组由 16 个字节组成，记为
$$
(p_0,p_1,p_2,\dots,p_{15})
$$
AES 并不会直接把这 16 个字节当作一维序列来操作，而是先将它们按**列优先**的方式填入一个 4×4 的状态矩阵 State 中：
$$
\mathbf{State}=
\left[
\begin{matrix}
p_0 & p_4 & p_8 & p_{12} \\\\
p_1 & p_5 & p_9 & p_{13} \\\\
p_2 & p_6 & p_{10} & p_{14} \\\\
p_3 & p_7 & p_{11} & p_{15}
\end{matrix}
\right]
$$
后续 AES 的各轮加密操作，例如字节代换（SubBytes）、行移位（ShiftRows）、列混淆（MixColumns）以及轮密钥加（AddRoundKey），都是围绕这个状态矩阵展开的。

![blockstate](/images/blockstate.png)

## 密钥处理

除了对明文进行分组和状态矩阵初始化之外，AES 在正式加密之前还需要先对密钥进行处理。原因在于，AES 并不是在每一轮都直接使用原始密钥，而是会先通过**密钥扩展（Key Expansion）算法，从原始密钥中生成一组彼此不同的轮密钥（Round Keys）**，供初始轮和后续各轮使用。

以 AES-128 为例，原始密钥长度为 128 bit，即 16 字节。由于 AES-128 一共需要进行 10 轮加密，再加上最开始的一次初始轮密钥加，因此总共需要 **11 组轮密钥**。每组轮密钥的长度同样为 128 bit，对应一个 4×4 的字节矩阵。

密钥扩展的作用，是让每一轮都使用不同的密钥材料，而不是简单重复同一个原始密钥。这样可以增强算法的安全性，使密文对密钥变化更加敏感，也避免因轮与轮之间结构过于相似而带来潜在风险。

在 AES 的密钥扩展过程中，通常会用到以下几种基本操作：

- **RotWord**：将一个 4 字节字循环左移 1 个字节

- **SubWord**：对一个字中的每个字节做 S 盒替换

- **Rcon**：引入轮常量，保证不同轮之间的差异性

  具体可以参照[Rijndael密钥生成方案 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/Rijndael密钥生成方案)

通过这些操作，AES 可以从初始密钥逐步推导出后续各轮所需的轮密钥。后面的加密过程中，无论是初始轮密钥加，还是每一轮末尾的 AddRoundKey，使用的都是这里生成出的轮密钥。

以 AES-128 为例，原始密钥长度为 128 bit，也就是 16 字节。
 密钥扩展会把这 16 字节扩展成 44 个字（word）：
$$
W_0, W_1, W_2, \dots, W_{43}
$$
每个字是 32 bit，也就是 4 字节。

然后每 4 个字组成一组轮密钥：
$$
K^{(0)} = (W_0, W_1, W_2, W_3)
$$
...
$$
K^{(10)} = (W_{40}, W_{41}, W_{42}, W_{43})
$$

## 初始轮密钥加

这一步的操作非常直接：将当前状态矩阵 `State` 与初始轮密钥 `RoundKey_0` 逐字节进行异或（XOR）运算，得到新的状态矩阵。

设初始状态矩阵为
$$
\mathbf{State}^{(0)}=
\left[
\begin{matrix}
s_{0,0}^{(0)} & s_{0,1}^{(0)} & s_{0,2}^{(0)} & s_{0,3}^{(0)} \\\\
s_{1,0}^{(0)} & s_{1,1}^{(0)} & s_{1,2}^{(0)} & s_{1,3}^{(0)} \\\\
s_{2,0}^{(0)} & s_{2,1}^{(0)} & s_{2,2}^{(0)} & s_{2,3}^{(0)} \\\\
s_{3,0}^{(0)} & s_{3,1}^{(0)} & s_{3,2}^{(0)} & s_{3,3}^{(0)}
\end{matrix}
\right]
$$
第 0 轮轮密钥为
$$
\mathbf{K}^{(0)}=
\left[
\begin{matrix}
k_{0,0}^{(0)} & k_{0,1}^{(0)} & k_{0,2}^{(0)} & k_{0,3}^{(0)} \\\\
k_{1,0}^{(0)} & k_{1,1}^{(0)} & k_{1,2}^{(0)} & k_{1,3}^{(0)} \\\\
k_{2,0}^{(0)} & k_{2,1}^{(0)} & k_{2,2}^{(0)} & k_{2,3}^{(0)} \\\\
k_{3,0}^{(0)} & k_{3,1}^{(0)} & k_{3,2}^{(0)} & k_{3,3}^{(0)}
\end{matrix}
\right]
$$
则初始轮密钥加可以表示为
$$
State^{(1)} = State^{(0)} \oplus K^{(0)}
$$
这里的异或是逐元素进行的，即
$$
s_{i,j}^{(1)} = s_{i,j}^{(0)} \oplus k_{i,j}^{(0)}, \qquad 0 \le i,j \le 3
$$

它的作用是先把密钥混进明文状态矩阵里。
 这一步**不属于标准轮内部的 4 步**，它是轮开始前额外先做的一次。

## 字节代换（SubBytes）

在完成初始轮密钥加之后，AES 进入标准轮变换的第一步，即 **字节代换（SubBytes）**。这一步会对状态矩阵中的每一个字节分别进行替换，替换规则由一张固定的查找表决定，这张表称为 **S 盒**。

经过初始轮密钥加后，状态矩阵记为

$$
\mathbf{State}^{(1)}
$$

在 SubBytes 变换中，状态矩阵中的每一个字节都会通过 AES 的 **S 盒**进行替换。变换后得到新的状态矩阵，记为

$$
\mathbf{State}_{\mathrm{SB}}^{(1)} = \mathrm{SubBytes}\!\left(\mathbf{State}^{(1)}\right)
$$

展开写为

$$
\mathbf{State}_{\mathrm{SB}}^{(1)}=
\left[
\begin{matrix}
S\!\left(s_{0,0}^{(1)}\right) & S\!\left(s_{0,1}^{(1)}\right) & S\!\left(s_{0,2}^{(1)}\right) & S\!\left(s_{0,3}^{(1)}\right) \\\\
S\!\left(s_{1,0}^{(1)}\right) & S\!\left(s_{1,1}^{(1)}\right) & S\!\left(s_{1,2}^{(1)}\right) & S\!\left(s_{1,3}^{(1)}\right) \\\\
S\!\left(s_{2,0}^{(1)}\right) & S\!\left(s_{2,1}^{(1)}\right) & S\!\left(s_{2,2}^{(1)}\right) & S\!\left(s_{2,3}^{(1)}\right) \\\\
S\!\left(s_{3,0}^{(1)}\right) & S\!\left(s_{3,1}^{(1)}\right) & S\!\left(s_{3,2}^{(1)}\right) & S\!\left(s_{3,3}^{(1)}\right)
\end{matrix}
\right]
$$

其中，$S(\cdot)$ 表示 AES 的 S 盒替换函数。

也就是说，矩阵中的每一个元素都独立地经过一次 S 盒映射，因此逐元素可以写为

$$
\left(\mathbf{State}_{\mathrm{SB}}^{(1)}\right)_{i,j}
=
S\!\left(s_{i,j}^{(1)}\right),
\qquad 0 \le i,j \le 3
$$

SubBytes 的作用是为 AES 引入**非线性**。这一过程并不改变字节在状态矩阵中的位置，而是只改变每个字节本身的取值。因此，SubBytes 可以理解为“改值不改位”的变换：它负责把原有字节替换为新的字节值，而不打乱矩阵结构。

例如，若某个位置上的字节为

$$
s_{i,j}^{(1)} = \texttt{0x53}
$$

1. 将 **8 位输入字节** 拆分为高 4 位和低 4 位。
2. **高 4 位** 作为 **行号**（0 ~ F），**低 4 位** 作为 **列号**（0 ~ F）。
3. 查表得到行列交叉处的值，即为 S 盒输出。

![sbox](/images/sbox.png)

则在查 S 盒后，能得到

$$
S(\texttt{0x53}) = \texttt{0xed}
$$

## 行移位（ShiftRows）

在完成字节代换之后，状态矩阵由变为
$$
State_{\mathrm{SB}}^{(1)}
=
\begin{bmatrix}
b_{0,0} & b_{0,1} & b_{0,2} & b_{0,3} \\\\
b_{1,0} & b_{1,1} & b_{1,2} & b_{1,3} \\\\
b_{2,0} & b_{2,1} & b_{2,2} & b_{2,3} \\\\
b_{3,0} & b_{3,1} & b_{3,2} & b_{3,3}
\end{bmatrix}
$$
ShiftRows 的规则非常简单：对状态矩阵的各行分别进行**循环左移**，其中：

- 第 0 行左移 0 位，即保持不变；
- 第 1 行左移 1 位；
- 第 2 行左移 2 位；
- 第 3 行左移 3 位。

经过行移位后，得到新的状态矩阵，记为
$$
State_{\mathrm{SR}}^{(1)}=\mathrm{ShiftRows}\!\left(State_{\mathrm{SB}}^{(1)}\right)
$$
其具体形式为
$$
State_{\mathrm{SR}}^{(1)}
=
\begin{bmatrix}
b_{0,0} & b_{0,1} & b_{0,2} & b_{0,3} \\\\
b_{1,1} & b_{1,2} & b_{1,3} & b_{1,0} \\\\
b_{2,2} & b_{2,3} & b_{2,0} & b_{2,1} \\\\
b_{3,3} & b_{3,0} & b_{3,1} & b_{3,2}
\end{bmatrix}
$$
从这个矩阵可以看出，ShiftRows **不会改变字节本身的值**，它只改变这些字节在状态矩阵中的位置。因此，ShiftRows 可以理解为“**改位不改值**”的变换。

SubBytes 和 ShiftRows 连在一起看会更清楚：

- **SubBytes**：改变每个字节的取值，但不改变位置；
- **ShiftRows**：改变字节的位置，但不改变取值。

这两步配合起来，就能同时实现“内容扰动”和“位置打散”。

## 列混淆（MixColumns）

在完成行移位之后，第一轮当前的状态矩阵为
$$
State_{\mathrm{SR}}^{(1)}
=
\begin{bmatrix}
b_{0,0} & b_{0,1} & b_{0,2} & b_{0,3} \\\\
b_{1,1} & b_{1,2} & b_{1,3} & b_{1,0} \\\\
b_{2,2} & b_{2,3} & b_{2,0} & b_{2,1} \\\\
b_{3,3} & b_{3,0} & b_{3,1} & b_{3,2}
\end{bmatrix}
$$
MixColumns 的基本思想是：将状态矩阵的**每一列**分别看作一个 4 维列向量，然后与一个固定矩阵M在有限域 GF(2^8) 上相乘，从而得到新的列。所使用的固定矩阵为
$$
M=
\begin{bmatrix}
02 & 03 & 01 & 01 \\\\
01 & 02 & 03 & 01 \\\\
01 & 01 & 02 & 03 \\\\
03 & 01 & 01 & 02
\end{bmatrix}
$$
经过列混淆后，得到新的状态矩阵，记为
$$
State_{\mathrm{MC}}^{(1)}=\mathrm{MixColumns}\!\left(State_{\mathrm{SR}}^{(1)}\right)
$$
即
$$
State_{\mathrm{MC}}^{(1)}
=
\begin{bmatrix}
c_{0,0} & c_{0,1} & c_{0,2} & c_{0,3} \\\\
c_{1,0} & c_{1,1} & c_{1,2} & c_{1,3} \\\\
c_{2,0} & c_{2,1} & c_{2,2} & c_{2,3} \\\\
c_{3,0} & c_{3,1} & c_{3,2} & c_{3,3}
\end{bmatrix}
$$
**具体实现如下：**

对于第一列
$$
\begin{bmatrix}
b_{0,0}\\\\
b_{1,1}\\\\
b_{2,2}\\\\
b_{3,3}
\end{bmatrix}
$$
进行列混淆，有
$$
\begin{bmatrix}
c_{0,0}\\\\
c_{1,0}\\\\
c_{2,0}\\\\
c_{3,0}
\end{bmatrix}
=
\begin{bmatrix}
02 & 03 & 01 & 01 \\\\
01 & 02 & 03 & 01 \\\\
01 & 01 & 02 & 03 \\\\
03 & 01 & 01 & 02
\end{bmatrix}
\begin{bmatrix}
b_{0,0}\\\\
b_{1,1}\\\\
b_{2,2}\\\\
b_{3,3}
\end{bmatrix}
$$
展开后可得
$$
c_{0,0}=(02\cdot b_{0,0})\oplus(03\cdot b_{1,1})\oplus(01\cdot b_{2,2})\oplus(01\cdot b_{3,3})
$$

$$
c_{1,0}=(01\cdot b_{0,0})\oplus(02\cdot b_{1,1})\oplus(03\cdot b_{2,2})\oplus(01\cdot b_{3,3})
$$

$$
c_{2,0}=(01\cdot b_{0,0})\oplus(01\cdot b_{1,1})\oplus(02\cdot b_{2,2})\oplus(03\cdot b_{3,3})
$$

$$
c_{3,0}=(03\cdot b_{0,0})\oplus(01\cdot b_{1,1})\oplus(01\cdot b_{2,2})\oplus(02\cdot b_{3,3})
$$

对于2,3,4列同理

因此，第一轮经过列混淆后的状态矩阵可以写为
$$
State_{\mathrm{MC}}^{(1)}
=
\begin{bmatrix}
c_{0,0} & c_{0,1} & c_{0,2} & c_{0,3} \\\\
c_{1,0} & c_{1,1} & c_{1,2} & c_{1,3} \\\\
c_{2,0} & c_{2,1} & c_{2,2} & c_{2,3} \\\\
c_{3,0} & c_{3,1} & c_{3,2} & c_{3,3}
\end{bmatrix}
$$

## 轮密钥加（AddRoundKey）

在完成列混淆之后，第一轮当前的状态矩阵为
$$
State_{\mathrm{MC}}^{(1)}
=
\begin{bmatrix}
c_{0,0} & c_{0,1} & c_{0,2} & c_{0,3} \\\\
c_{1,0} & c_{1,1} & c_{1,2} & c_{1,3} \\\\
c_{2,0} & c_{2,1} & c_{2,2} & c_{2,3} \\\\
c_{3,0} & c_{3,1} & c_{3,2} & c_{3,3}
\end{bmatrix}
$$
接下来，需要将其与第一轮轮密钥 K^{(1)} 逐元素进行异或，得到第一轮结束后的状态矩阵 State^{(2)}：
$$
State^{(2)} = State_{\mathrm{MC}}^{(1)} \oplus K^{(1)}
$$
也就是说，矩阵中的每一个位置都与对应位置上的轮密钥字节进行异或，因此逐元素可写为
$$
s_{i,j}^{(2)} = c_{i,j} \oplus k_{i,j}^{(1)}, \qquad 0 \le i,j \le 3
$$
至此，第一轮的完整过程可以总结为
$$
State^{(1)}
\;\xrightarrow{\mathrm{SubBytes}}\;
State_{\mathrm{SB}}^{(1)}
\;\xrightarrow{\mathrm{ShiftRows}}\;
State_{\mathrm{SR}}^{(1)}
\;\xrightarrow{\mathrm{MixColumns}}\;
State_{\mathrm{MC}}^{(1)}
\;\xrightarrow{\mathrm{AddRoundKey}}\;
State^{(2)}
$$

## 总结

在完成第一轮之后，AES 后续各轮的处理方式与第一轮基本相同。对于 AES-128 而言，接下来的第 2 轮到第 9 轮，都会重复执行以下四个步骤：
$$
\mathrm{SubBytes}
\;\rightarrow\;
\mathrm{ShiftRows}
\;\rightarrow\;
\mathrm{MixColumns}
\;\rightarrow\;
\mathrm{AddRoundKey}
$$
也就是说，第一轮中已经展示过的状态矩阵变换过程，在后续标准轮中会不断重复。**只是每一轮所使用的轮密钥不同**，分别由密钥扩展算法生成。

因此，从整体上看，AES-128 的中间各轮可以概括为：先对当前状态矩阵进行字节代换，再进行行移位，然后执行列混淆，最后与该轮对应的轮密钥异或，得到下一轮的输入状态矩阵。

需要注意的是，**最后一轮与前面的标准轮并不完全相同**。在最后一轮中，AES 仍然会执行字节代换、行移位和轮密钥加，但**不再执行列混淆**。因此，最后一轮的过程为：
$$
\mathrm{SubBytes}
\;\rightarrow\;
\mathrm{ShiftRows}
\;\rightarrow\;
\mathrm{AddRoundKey}
$$
若将 AES-128 的整体加密过程整理出来，则可以表示为：

1. 明文分组并初始化状态矩阵；

2. 执行初始轮密钥加；

3. 执行 9 轮标准轮变换；

4. 执行 1 轮不含 MixColumns 的最终轮变换；

5. 输出最终密文



## AES工作模式

上文讨论的是 AES 对单个 128 bit 分组的加密过程，即 AES 算法本体的内部结构。然而，在实际应用中，待加密的数据往往远不止一个分组，因此仅仅知道单个分组如何加密还不够。为了将 AES 用于任意长度的消息，还需要结合具体的**工作模式（Mode of Operation）**。不同的工作模式决定了多个分组之间如何关联，也会影响算法是否需要填充、是否能并行处理，以及整体的安全特性。

## ECB

ECB（Electronic Codebook，电子密码本模式）

ECB 是最简单的分组加密模式。它的基本思想是：将明文分成若干个 128 bit 分组后，对每个分组分别独立使用 AES 加密：
$$
C_i = E_K(P_i)
$$
其中，P_i 表示第 i 个明文分组，C_i 表示对应的密文分组，E_K 表示使用密钥 K 的 AES 加密操作。

ECB 的优点是结构简单、实现方便，而且各分组之间彼此独立，可以并行加密和解密。然而，它也有一个非常严重的问题：**相同的明文分组会得到相同的密文分组**。这意味着如果原始数据中存在重复结构，那么这些结构会在密文中被保留下来，从而泄露明文的模式信息。

因此，ECB 虽然概念简单，但通常**不适合在实际系统中直接使用**。

## CBC

CBC（Cipher Block Chaining，密码分组链接模式）

CBC 模式在 ECB 的基础上引入了“前一个密文分组”的影响。对于第一个明文分组，先与初始化向量 IV 异或，再进行加密；对于后续分组，则先与前一个密文分组异或，再进行加密：
$$
C_1 = E_K(P_1 \oplus IV)
$$
这样做的好处是，即使两个明文分组内容相同，只要它们前面的上下文不同，最终得到的密文也通常不同，因此比 ECB 更安全。

CBC 的特点是：

- 能隐藏重复分组的模式
- 加密时每个分组依赖前一个密文分组，不能完全并行
- 解密时需要知道前一个密文分组
- **通常需要 padding**，因为它仍然要求输入按完整分组处理

因此，当明文长度不是 16 字节整数倍时，CBC 模式通常需要使用 **PKCS#7** 等填充方式补齐。

## CTR

CTR（Counter Mode，计数器模式）

CTR 模式的思路与前两种不同。它并不是直接对明文分组本身做链接处理，而是先对一系列计数器进行 AES 加密，生成密钥流，然后再与明文逐块异或：
$$
C_i = P_i \oplus E_K(\mathrm{CTR}_i)
$$
其中，CTR_i 表示第 i 个计数器块，通常由 nonce 和递增计数器组成。

CTR 模式的优点在于：

- 可以并行加密和解密
- 加密和解密过程结构对称
- **通常不需要 padding**，因为它本质上更接近流加密

不过，CTR 模式对 nonce / counter 的唯一性要求很高；如果同一密钥下重复使用相同的计数器序列，会带来严重安全问题。



```cpp
#include <bits/stdc++.h>
using namespace std;

static const uint8_t SBOX[256] = {
0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
};

static const uint8_t INV_SBOX[256] = {
0x52,0x09,0x6a,0xd5,0x30,0x36,0xa5,0x38,0xbf,0x40,0xa3,0x9e,0x81,0xf3,0xd7,0xfb,
0x7c,0xe3,0x39,0x82,0x9b,0x2f,0xff,0x87,0x34,0x8e,0x43,0x44,0xc4,0xde,0xe9,0xcb,
0x54,0x7b,0x94,0x32,0xa6,0xc2,0x23,0x3d,0xee,0x4c,0x95,0x0b,0x42,0xfa,0xc3,0x4e,
0x08,0x2e,0xa1,0x66,0x28,0xd9,0x24,0xb2,0x76,0x5b,0xa2,0x49,0x6d,0x8b,0xd1,0x25,
0x72,0xf8,0xf6,0x64,0x86,0x68,0x98,0x16,0xd4,0xa4,0x5c,0xcc,0x5d,0x65,0xb6,0x92,
0x6c,0x70,0x48,0x50,0xfd,0xed,0xb9,0xda,0x5e,0x15,0x46,0x57,0xa7,0x8d,0x9d,0x84,
0x90,0xd8,0xab,0x00,0x8c,0xbc,0xd3,0x0a,0xf7,0xe4,0x58,0x05,0xb8,0xb3,0x45,0x06,
0xd0,0x2c,0x1e,0x8f,0xca,0x3f,0x0f,0x02,0xc1,0xaf,0xbd,0x03,0x01,0x13,0x8a,0x6b,
0x3a,0x91,0x11,0x41,0x4f,0x67,0xdc,0xea,0x97,0xf2,0xcf,0xce,0xf0,0xb4,0xe6,0x73,
0x96,0xac,0x74,0x22,0xe7,0xad,0x35,0x85,0xe2,0xf9,0x37,0xe8,0x1c,0x75,0xdf,0x6e,
0x47,0xf1,0x1a,0x71,0x1d,0x29,0xc5,0x89,0x6f,0xb7,0x62,0x0e,0xaa,0x18,0xbe,0x1b,
0xfc,0x56,0x3e,0x4b,0xc6,0xd2,0x79,0x20,0x9a,0xdb,0xc0,0xfe,0x78,0xcd,0x5a,0xf4,
0x1f,0xdd,0xa8,0x33,0x88,0x07,0xc7,0x31,0xb1,0x12,0x10,0x59,0x27,0x80,0xec,0x5f,
0x60,0x51,0x7f,0xa9,0x19,0xb5,0x4a,0x0d,0x2d,0xe5,0x7a,0x9f,0x93,0xc9,0x9c,0xef,
0xa0,0xe0,0x3b,0x4d,0xae,0x2a,0xf5,0xb0,0xc8,0xeb,0xbb,0x3c,0x83,0x53,0x99,0x61,
0x17,0x2b,0x04,0x7e,0xba,0x77,0xd6,0x26,0xe1,0x69,0x14,0x63,0x55,0x21,0x0c,0x7d
};
static const uint8_t RCON[16] = {0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36,0x6c,0xd8,0xab,0x4d,0x9a};

using State = array<array<uint8_t,4>,4>;

vector<uint8_t> hexToBytes(const string &s) {
    vector<uint8_t> out;
    for (size_t i=0; i<s.size(); i+=2) out.push_back((uint8_t)stoi(s.substr(i,2), nullptr, 16));
    return out;
}
string bytesToHex(const vector<uint8_t> &v) {
    stringstream ss; ss << hex << setfill('0') << nouppercase;
    for (auto b: v) ss << setw(2) << (int)b;
    return ss.str();
}
State bytesToState(const vector<uint8_t> &b) {
    State s{};
    for (int c=0;c<4;c++) for (int r=0;r<4;r++) s[r][c]=b[4*c+r];
    return s;
}
vector<uint8_t> stateToBytes(const State &s) {
    vector<uint8_t> b;
    for (int c=0;c<4;c++) for (int r=0;r<4;r++) b.push_back(s[r][c]);
    return b;
}
string stateHex(const State &s) { return bytesToHex(stateToBytes(s)); }

uint8_t gmul(uint8_t a, uint8_t b) {
    uint8_t p=0;
    for(int i=0;i<8;i++) {
        if(b&1) p^=a;
        bool hi=a&0x80;
        a <<= 1;
        if(hi) a ^= 0x1b;
        b >>= 1;
    }
    return p;
}
State addRoundKey(const State &a, const State &k) {
    State o{}; for(int r=0;r<4;r++) for(int c=0;c<4;c++) o[r][c]=a[r][c]^k[r][c]; return o;
}
State subBytes(const State &s) {
    State o{}; for(int r=0;r<4;r++) for(int c=0;c<4;c++) o[r][c]=SBOX[s[r][c]]; return o;
}
State invSubBytes(const State &s) {
    State o{}; for(int r=0;r<4;r++) for(int c=0;c<4;c++) o[r][c]=INV_SBOX[s[r][c]]; return o;
}
State shiftRows(const State &s) {
    State o{};
    for(int r=0;r<4;r++) for(int c=0;c<4;c++) o[r][c]=s[r][(c+r)%4];
    return o;
}
State invShiftRows(const State &s) {
    State o{};
    for(int r=0;r<4;r++) for(int c=0;c<4;c++) o[r][(c+r)%4]=s[r][c];
    return o;
}
State mixColumns(const State &s) {
    State o{};
    for(int c=0;c<4;c++) {
        uint8_t a0=s[0][c], a1=s[1][c], a2=s[2][c], a3=s[3][c];
        o[0][c]=gmul(a0,2)^gmul(a1,3)^a2^a3;
        o[1][c]=a0^gmul(a1,2)^gmul(a2,3)^a3;
        o[2][c]=a0^a1^gmul(a2,2)^gmul(a3,3);
        o[3][c]=gmul(a0,3)^a1^a2^gmul(a3,2);
    }
    return o;
}
State invMixColumns(const State &s) {
    State o{};
    for(int c=0;c<4;c++) {
        uint8_t a0=s[0][c], a1=s[1][c], a2=s[2][c], a3=s[3][c];
        o[0][c]=gmul(a0,14)^gmul(a1,11)^gmul(a2,13)^gmul(a3,9);
        o[1][c]=gmul(a0,9)^gmul(a1,14)^gmul(a2,11)^gmul(a3,13);
        o[2][c]=gmul(a0,13)^gmul(a1,9)^gmul(a2,14)^gmul(a3,11);
        o[3][c]=gmul(a0,11)^gmul(a1,13)^gmul(a2,9)^gmul(a3,14);
    }
    return o;
}

vector<State> keyExpansion(const vector<uint8_t> &key) {
    int Nk = (int)key.size()/4;
    int Nr = Nk + 6;
    vector<array<uint8_t,4>> w;
    for(int i=0;i<Nk;i++) w.push_back({key[4*i],key[4*i+1],key[4*i+2],key[4*i+3]});
    for(int i=Nk;i<4*(Nr+1);i++) {
        auto temp = w[i-1];
        if(i%Nk==0) {
            temp = {temp[1],temp[2],temp[3],temp[0]};
            for(auto &x:temp) x=SBOX[x];
            temp[0] ^= RCON[i/Nk];
        } else if(Nk>6 && i%Nk==4) {
            for(auto &x:temp) x=SBOX[x];
        }
        array<uint8_t,4> nw{};
        for(int j=0;j<4;j++) nw[j]=w[i-Nk][j]^temp[j];
        w.push_back(nw);
    }
    vector<State> rks;
    for(int r=0;r<=Nr;r++) {
        vector<uint8_t> rb;
        for(int i=4*r;i<4*r+4;i++) for(int j=0;j<4;j++) rb.push_back(w[i][j]);
        rks.push_back(bytesToState(rb));
    }
    return rks;
}

string encryptBlock(const string &ptHex, const string &keyHex, vector<State>* savedKeys=nullptr) {
    vector<uint8_t> pt=hexToBytes(ptHex), key=hexToBytes(keyHex);
    int Nr=(int)key.size()/4+6;
    auto rks=keyExpansion(key);
    if(savedKeys) *savedKeys = rks;
    State s=bytesToState(pt);
    s=addRoundKey(s,rks[0]);
    for(int r=1;r<Nr;r++) s=addRoundKey(mixColumns(shiftRows(subBytes(s))),rks[r]);
    s=addRoundKey(shiftRows(subBytes(s)),rks[Nr]);
    return stateHex(s);
}

string decryptBlock(const string &ctHex, const string &keyHex) {
    vector<uint8_t> ct=hexToBytes(ctHex), key=hexToBytes(keyHex);
    int Nr=(int)key.size()/4+6;
    auto rks=keyExpansion(key);
    State s=bytesToState(ct);
    s=addRoundKey(s,rks[Nr]);
    for(int r=Nr-1;r>=1;r--) s=invMixColumns(addRoundKey(invSubBytes(invShiftRows(s)),rks[r]));
    s=addRoundKey(invSubBytes(invShiftRows(s)),rks[0]);
    return stateHex(s);
}

int main() {
    struct Test { string type, pt, key; };
    vector<Test> tests = {
        {"AES-128","0123456789abcdeffedcba9876543210","0f1571c947d9e8590cb7add6af7f6798"},
        {"AES-128","1b5e8b0f1bc78d238064826704830cdb","3475bd76fa040b73f521ffcd9de93f24"},
        {"AES-128","41b267bc5905f0a3cd691b3ddaee149d","2b24424b9fed596659842a4d0b007c61"},
        {"AES-192","123456789012345678901234567890ab","1234567890123456789012345678901234567890abcdef01"},
        {"AES-256","123456789012345678901234567890ab","123456789012345678901234567890123456789012345678901234567890abcd"}
    };
    cout << "AES encrypt/decrypt test result\n";
    cout << "--------------------------------\n";
    for(size_t i=0;i<tests.size();i++) {
        string ct=encryptBlock(tests[i].pt, tests[i].key);
        string dec=decryptBlock(ct, tests[i].key);
        cout << tests[i].type << " group " << (i+1) << "\n";
        cout << "ciphertext : " << ct << "\n";
        cout << "decrypted  : " << dec << "\n";
        cout << "check      : " << (dec==tests[i].pt ? "OK" : "FAIL") << "\n\n";
    }
    vector<State> rks;
    encryptBlock(tests[0].pt, tests[0].key, &rks);
    cout << "AES-128 group 1 round keys:\n";
    for(size_t i=0;i<rks.size();i++) cout << setw(2) << i << " : " << stateHex(rks[i]) << "\n";
    return 0;
}

```

