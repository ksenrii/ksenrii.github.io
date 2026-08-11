---
title: Crypto-Elgamal
date: 2026-02-17 11:55:44
tags: [密码学]
categories: 密码学
mathjax: true
top_img: /images/8.jpg
cover: /images/8.jpg
---

# **Elgamal**

在密码学中，ElGamal加密算法是一个基于迪菲-赫尔曼密钥交换的非对称加密算法。它在1985年由塔希尔·盖莫尔提出。GnuPG和PGP等很多密码学系统中都应用到了ElGamal算法。
ElGamal加密算法可以定义在任何循环群G上。它的安全性基于**离散对数难题**

**ElGamal**既是加密算法，也是签名算法

<!-- more -->

ElGamal 工作在一个数学结构中：
$$
\mathbb{Z}_p^* = \{1,2,\dots,p-1\}
$$
也就是模 p 的乘法群

## 加密

给定公钥 (p, g, y)，其中：

- p：大素数（所有运算都在 mod p 下进行）

- g：模 p 的生成元（可以生成整个群）

  > 对某个元素 g，如果不断计算它的幂
  > $$
  > g^1, g^2, g^3, \dots
  > $$
  > 并且都在模 p 意义下取值，如果这些结果能够把 Z*p下的所有非零元素包含进去
  > $$
  > 1,2,\dots,p-1
  > $$
  > 那么 g 就是这个群的生成元

- y = g^x mod p：公钥，由私钥 x 计算得到

要加密明文 m（满足 1 ＜ m < p）：

1. 随机选择一个整数 k
2. 计算：

$$
c_1 = g^k \mod p
$$

$$
c_2 = m \cdot y^k \mod p
$$
   3.密文为：
$$
(c_1, c_2)
$$

```python
from secrets import randbelow

def elgamal_encrypt(p: int, g: int, y: int, m: int) -> tuple[int, int]:

    if not (1 <= m < p):
        raise ValueError("Message m must satisfy 1 <= m < p.")

    if not (1 <= g < p):
        raise ValueError("g must satisfy 1 <= g < p.")

    if not (1 <= y < p):
        raise ValueError("y must satisfy 1 <= y < p.")

    # Random ephemeral key k in [1, p-2]
    k = randbelow(p - 2) + 1

    c1 = pow(g, k, p)
    c2 = (m * pow(y, k, p)) % p

    return c1, c2


if __name__ == "__main__":
   
    p = 23
    g = 5
    x = 6
    y = pow(g, x, p)
    m = 10

    c1, c2 = elgamal_encrypt(p, g, y, m)
    print("Public key:")
    print(f"p = {p}, g = {g}, y = {y}")
    print(f"Message m = {m}")
    print(f"Ciphertext = ({c1}, {c2})")
```



## 解密

对于
$$
c_2 = m \cdot y^k \mod p
$$

只需算出

$$
c_1^x = g^{xk} \mod p=y^k \mod p
$$

那么

$$
c_2 \cdot (c_1^x)^{-1}
= m \cdot y^k \cdot (y^k)^{-1}
= m \mod p
$$

即可恢复明文m

```python
def extended_gcd(a: int, b: int) -> tuple[int, int, int]:

    if b == 0:
        return a, 1, 0

    g, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return g, x, y


def mod_inverse(a: int, mod: int) -> int:

    g, x, _ = extended_gcd(a, mod)
    if g != 1:
        raise ValueError(f"{a} has no inverse modulo {mod}.")
    return x % mod


def elgamal_decrypt(p: int, x: int, c1: int, c2: int) -> int:

    if not (1 <= c1 < p and 1 <= c2 < p):
        raise ValueError("Ciphertext components must satisfy 1 <= c1, c2 < p.")

    s = pow(c1, x, p)
    s_inv = mod_inverse(s, p)
    m = (c2 * s_inv) % p
    return m


if __name__ == "__main__":

    p = 23
    g = 5
    x = 6
    y = pow(g, x, p)

    m_original = 10
    k = 3
    c1 = pow(g, k, p)
    c2 = (m_original * pow(y, k, p)) % p

    m = elgamal_decrypt(p, x, c1, c2)

    print("Private key:")
    print(f"x = {x}")
    print(f"Ciphertext = ({c1}, {c2})")
    print(f"Recovered message = {m}")
```



## 签名

RSA 的数字签名方案几乎与其加密方案完全一致，只是利用私钥进行了签名。但是，对于 ElGamal 来说，其签名方案与相应的加密方案具有很大区别

对消息 m 进行签名时：

1. 选择一个随机整数 k，满足

$$
1<k<p-1,\quad \gcd(k,p-1)=1
$$

也就是说，k 在模 p-1 下必须可逆。

2.计算

$$
r=g^k \mod p
$$

3.计算 k 在模 p-1 下的逆元 k^{-1}，然后求
$$
s \equiv k^{-1}(m-xr) \pmod{p-1}
$$

4.签名就是

$$
(r,s)
$$

```python
import hashlib
from math import gcd
from secrets import randbelow

def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    if b == 0:
        return a, 1, 0

    g, x1, y1 = extended_gcd(b, a % b)
    x = y1
    y = x1 - (a // b) * y1
    return g, x, y


def mod_inverse(a: int, mod: int) -> int:
    g, x, _ = extended_gcd(a, mod)
    if g != 1:
        raise ValueError(f"{a} has no inverse modulo {mod}.")
    return x % mod


def hash_message(message: bytes) -> int:
    """
    Hash message with SHA-256 and convert to integer.
    """
    digest = hashlib.sha256(message).digest()
    return int.from_bytes(digest, byteorder="big")


def elgamal_sign(p: int, g: int, x: int, message: bytes) -> tuple[int, int]:

    if not (1 <= g < p):
        raise ValueError("g must satisfy 1 <= g < p.")
    if not (1 <= x <= p - 2):
        raise ValueError("Private key x must satisfy 1 <= x <= p-2.")

    h = hash_message(message)

    # Choose k such that gcd(k, p-1) = 1
    while True:
        k = randbelow(p - 2) + 1  # in [1, p-2]
        if gcd(k, p - 1) == 1:
            break

    r = pow(g, k, p)
    k_inv = mod_inverse(k, p - 1)
    s = (k_inv * (h - x * r)) % (p - 1)

    return r, s


if __name__ == "__main__":
    p = 23
    g = 5
    x = 6

    message = b"Hello ElGamal"

    r, s = elgamal_sign(p, g, x, message)

    print("Private key:")
    print(f"x = {x}")
    print(f"Message = {message!r}")
    print(f"Signature = ({r}, {s})")
```



### 为什么这样构造

因为这样可以让下面这个关系成立：

$$
m \equiv xr + ks \pmod{p-1}
$$

于是：

$$
g^m \equiv g^{xr+ks} = g^{xr}g^{ks} = (g^x)^r(g^k)^s \pmod p
$$

又因为

$$
y=g^x,\quad r=g^k \mod p
$$

所以就得到验证公式：

$$
g^m \equiv y^r r^s \pmod p
$$

这就是 ElGamal 签名能被验证的原因

## 验证

收到消息 m 和签名 (r,s) 后用公钥 (p,g,y) 检查：

1. 先确认

$$
1 \le r \le p-1
$$

   2.然后计算两边：

左边：

$$
v_1 = g^m \mod p
$$
右边：

$$
v_2 = y^r \cdot r^s \mod p
$$

1. 如果

$$
v_1 = v_2
$$

那么签名有效；否则签名无效。



封面来自汐風HY

