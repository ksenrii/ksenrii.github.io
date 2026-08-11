# [MoeCTF 2022]EquationPy

直接给了个pyc,找个在线网站转一下

![image-20260713220750201](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260713220750201.png)

明显的z3求解

```python
from z3 import *

a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v = Ints(
    'a b c d e f g h i j k l m n o p q r s t u v'
)

solver = Solver()

rule = [
a*7072+b*2523+c*6714+d*8810+e*6796+f*2647+g*1347+h*1289+i*8917+j*2304+k*5001+l*2882+m*7232+n*3192+o*9676+p*5436+q*4407+r*6269+s*9623+t*6230+u*6292+v*57 == 10743134,

a*3492+b*1613+c*3234+d*5656+e*9182+f*4240+g*8808+h*9484+i*4000+j*1475+k*2616+l*2766+m*6822+n*1068+o*9768+p*1420+q*4528+r*1031+s*8388+t*2029+u*2463+v*32 == 9663091,

a*9661+b*1108+c*2229+d*1256+e*7747+f*5775+g*5211+h*2387+i*1997+j*4045+k*7102+l*7853+m*5596+n*6952+o*8883+p*5125+q*9572+r*1149+s*7583+t*1075+u*9804+v*72 == 10521461,

a*4314+b*3509+c*6200+d*5546+e*1705+f*9518+g*2975+h*2689+i*2412+j*8659+k*5459+l*7572+m*3042+n*9701+o*4697+p*9863+q*1296+r*1278+s*5721+t*5116+u*4147+v*52 == 9714028,

a*2310+b*1379+c*5900+d*4876+e*5329+f*6485+g*6610+h*7179+i*7897+j*1094+k*4825+l*8101+m*9519+n*3048+o*3168+p*2775+q*4366+r*4066+s*7490+t*5533+u*2139+v*87 == 10030960,

a*1549+b*8554+c*6510+d*6559+e*5570+f*1003+g*8562+h*6793+i*3509+j*4965+k*6111+l*1229+m*5654+n*2204+o*2217+p*5039+q*5657+r*9426+s*7604+t*5883+u*5285+v*17 == 10946682,

a*2678+b*4369+c*7509+d*1564+e*7777+f*2271+g*9696+h*3874+i*2212+j*6764+k*5727+l*5971+m*5876+n*9959+o*4604+p*8461+q*2350+r*3564+s*1831+t*6088+u*4575+v*9 == 10286414,

a*8916+b*8647+c*4522+d*3579+e*5319+f*9124+g*9535+h*5125+i*3235+j*3246+k*3378+l*9221+m*1875+n*1008+o*6262+p*1524+q*8851+r*4367+s*7628+t*9404+u*2065+v*9 == 11809388,

a*9781+b*9174+c*3771+d*6972+e*6425+f*7631+g*8864+h*9117+i*4328+j*3919+k*6517+l*7165+m*6895+n*3609+o*3878+p*1593+q*9098+r*6432+s*2584+t*8403+u*4029+v*30 == 13060508,

a*2511+b*8583+c*2428+d*9439+e*3662+f*3278+g*8305+h*1100+i*7972+j*8510+k*8552+l*9993+m*6855+n*1702+o*1640+p*3787+q*8161+r*2110+s*5320+t*3313+u*9286+v*74 == 10568195,

a*4974+b*4445+c*7368+d*9132+e*5894+f*7822+g*7923+h*6822+i*2698+j*3643+k*8392+l*4126+m*1941+n*6641+o*2949+p*7405+q*9980+r*6349+s*3328+t*8766+u*9508+v*65 == 12514783,

a*4127+b*4703+c*6409+d*4907+e*5230+f*3371+g*5666+h*3194+i*5448+j*8415+k*4525+l*4152+m*1467+n*5254+o*2256+p*1643+q*9113+r*8805+s*4315+t*8371+u*1919+v*2 == 10299950,

a*6245+b*8783+c*6059+d*9375+e*9253+f*1974+g*8867+h*6423+i*2577+j*6613+k*2040+l*2209+m*4147+n*7151+o*1011+p*9446+q*4362+r*3073+s*3006+t*5499+u*8850+v*23 == 11180727,

a*1907+b*9038+c*3932+d*7054+e*1135+f*5095+g*6962+h*6481+i*7049+j*5995+k*6233+l*1321+m*4455+n*8181+o*5757+p*6953+q*3167+r*5508+s*4602+t*1420+u*3075+v*25 == 10167536,

a*1489+b*9236+c*7398+d*4088+e*4131+f*1657+g*9068+h*6420+i*3970+j*3265+k*5343+l*5386+m*2583+n*2813+o*7181+p*9116+q*4836+r*6917+s*1123+t*7276+u*2257+v*65 == 10202212,

a*2097+b*1253+c*1469+d*2731+e*9565+f*9185+g*1095+h*8666+i*2919+j*7962+k*1497+l*6642+m*4108+n*6892+o*7161+p*7552+q*5666+r*4060+s*7799+t*5080+u*8516+v*43 == 10435786,

a*1461+b*1676+c*4755+d*7982+e*3860+f*1067+g*6715+h*4019+i*4983+j*2031+k*1173+l*2241+m*2594+n*8672+o*4810+p*7963+q*7749+r*5730+s*9855+t*5858+u*2349+v*71 == 9526385,

a*9025+b*9536+c*1515+d*8177+e*6109+f*4856+g*6692+h*4929+i*1010+j*3995+k*3511+l*5910+m*3501+n*3731+o*6601+p*6200+q*8177+r*5488+s*5957+t*9661+u*4956+v*48 == 11822714,

a*4462+b*1940+c*5956+d*4965+e*9268+f*9627+g*3564+h*5417+i*2039+j*7269+k*9667+l*4158+m*2856+n*2851+o*9696+p*5986+q*6237+r*5845+s*5467+t*5227+u*4771+v*72 == 11486796,

a*4618+b*8621+c*8144+d*7115+e*1577+f*8602+g*3886+h*3712+i*1258+j*7063+k*1872+l*9855+m*4167+n*7615+o*6298+p*7682+q*8795+r*3856+s*6217+t*5764+u*5076+v*93 == 11540145,

a*7466+b*8442+c*4822+d*7639+e*2049+f*7311+g*5816+h*8433+i*5905+j*4838+k*1251+l*8184+m*6465+n*4634+o*5513+p*3160+q*6720+r*9205+s*6671+t*7716+u*1905+v*29 == 12227250,

a*5926+b*9095+c*2048+d*4639+e*3035+f*9560+g*1591+h*2392+i*1812+j*6732+k*9454+l*8175+m*7346+n*6333+o*9812+p*2034+q*6634+r*1762+s*7058+t*3524+u*7462+v*11 == 11118093
]

solver.add(rule)

if solver.check() == sat:
    model = solver.model()
    flag = ''.join(chr(model[x].as_long()) for x in [
        a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v
    ])
    print(flag)
```

# [LitCTF 2024]ezrc4

![image-20260713222122365](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260713222122365.png)

没壳进IDA

![image-20260714091744021](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714091744021.png)

rc4,密文是

![image-20260714091825148](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714091825148.png) 

注意到函数列表有X_X和X_X_init,也可对key交叉引用看

![image-20260714091931704](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714091931704.png)

对RC4的key进行了异或修改

![image-20260714092029681](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714092029681.png)

得到key是litctf!

![image-20260714092553547](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714092553547.png)

# [HNCTF 2022 WEEK3]What's 1n DLL?

给了exe和dll

![image-20260714094001163](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714094001163.png)

给了密文和key.接下来找加密方式即可

加载dll,`GetProcAddress` 从 DLL 的导出表里查找名为ttt的函数返回地址

dll加了壳,改成UPX即可

![image-20260714093321607](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714093321607.png)

![image-20260714093814984](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714093814984.png)

![image-20260714095748892](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714095748892.png)

xxtea

```python
import struct

MASK = 0xffffffff
DELTA = 0x9E3779B9

def mx(s, y, z, p, e, key):
    return (
        (((z >> 5) ^ (y << 2)) + ((y >> 3) ^ (z << 4)))
        ^ ((s ^ y) + (key[(p & 3) ^ e] ^ z))
    ) & MASK

def xxtea_encrypt(data, key):
    v = data[:]
    n = len(v)
    if n < 2:
        return v

    rounds = 6 + 52 // n
    s = 0
    z = v[-1]

    for _ in range(rounds):
        s = (s + DELTA) & MASK
        e = (s >> 2) & 3

        for p in range(n - 1):
            y = v[p + 1]
            v[p] = (v[p] + mx(s, y, z, p, e, key)) & MASK
            z = v[p]

        y = v[0]
        v[-1] = (v[-1] + mx(s, y, z, n - 1, e, key)) & MASK
        z = v[-1]

    return v

def xxtea_decrypt(data, key):
    v = data[:]
    n = len(v)
    if n < 2:
        return v

    rounds = 6 + 52 // n
    s = (rounds * DELTA) & MASK
    y = v[0]

    while s:
        e = (s >> 2) & 3

        for p in range(n - 1, 0, -1):
            z = v[p - 1]
            v[p] = (v[p] - mx(s, y, z, p, e, key)) & MASK
            y = v[p]

        z = v[-1]
        v[0] = (v[0] - mx(s, y, z, 0, e, key)) & MASK
        y = v[0]

        s = (s - DELTA) & MASK

    return v

def bytes_to_dwords(data):
    return list(struct.unpack("<%dI" % (len(data) // 4), data))

def dwords_to_bytes(data):
    return struct.pack("<%dI" % len(data), *data)



key = [0x37, 0x42, 0x4D, 0x58]


enc = [0x22A577C1,
       0x1C12C03,
       0xC74C3EBD,
       0xA9D03C85,
       0xADB8FFB3
]

plain = xxtea_decrypt(enc, key)

print("DWORD：", [hex(x) for x in plain])
print("plain：", dwords_to_bytes(plain))
```

# [SWPUCTF 2021 新生赛]简单的逻辑

z3爆,套上flag的前后缀

# [NSSRound#16 Basic]test your Debugger

![image-20260714102511481](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714102511481.png)

按题目提示下断点运行即可

# [长城杯 2021 院校组]Just_cmp-re





# [HNCTF 2022 WEEK4]ez_maze

![image-20260716122416737](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716122416737.png)

pyinstall打包了,用pyinstxtrctor.py

![image-20260716124342723](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716124342723.png)

找个在线的pyc转py

![image-20260716140051376](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716140051376.png)

这样的一个迷宫

推荐一个工具https://github.com/LingerJAB/MazeSolver

![image-20260716142539473](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716142539473.png)

得到路径再md5即可

# [NSSRound#X Basic]ez_z3

z3

```python
from z3 import *

c = [BitVec(f'z{i}', 8) for i in range(20)]

z = [ZeroExt(24, c[i]) for i in range(20)]

solver = SolverFor("QF_BV")

for i in range(20):
    solver.add(UGE(c[i], 32), ULE(c[i], 126))
rule=[
z[0] + 2 * z[1] - 3 * z[2] - 4 * z[3] + 5 * z[4]
+ 30 * z[5] - 7 * z[6] + 8 * z[7] - 9 * z[8]
+ 110 * z[9] * z[10] - 12 * z[11] + 13 * z[12]
+ 14 * z[13] - 240 * z[14] * z[15] - 17 * z[16]
- 18 * z[17] + 380 * z[18] * z[19] == 0x2766DF,

2 * z[0] * z[1] + 3 * z[2] - 4 * z[3] + 5 * z[4]
+ 30 * z[5] - 7 * z[6] + 8 * z[7] - 9 * z[8]
+ 110 * z[9] * z[10] - 12 * z[11] + 13 * z[12]
+ 14 * z[13] - 240 * z[14] * z[15] - 17 * z[16]
- 18 * z[17] + 380 * z[18] * z[19] == 0x27B6F5,

z[0] - 2 * z[1] - 12 * z[2] * z[3] - 5 * z[4]
+ 210 * z[5] * z[6] + 8 * z[7] + 9 * z[8] - 10 * z[9]
+ 132 * z[10] * z[11] + 182 * z[12] * z[13]
- 15 * z[14] - 272 * z[15] * z[16] + 18 * z[17]
+ 19 * z[18] - 20 * z[19] == 0x28B65B,

z[0] + 2 * z[1] - 3 * z[2] - 4 * z[3] + 5 * z[4]
+ 30 * z[5] - 7 * z[6] + 8 * z[7] - 9 * z[8]
+ 110 * z[9] * z[10] - 120 * z[9] * z[11]
+ 130 * z[9] * z[12] + 14 * z[13]
- 240 * z[14] * z[15] - 17 * z[16] - 18 * z[17]
+ 380 * z[18] * z[19] == 0x267481,

6 * z[0] * z[1] * z[2] - 4 * z[3] - 5 * z[4]
- 30 * z[5] - 7 * z[6] + 72 * z[7] * z[8]
+ 10 * z[9] - 11 * z[10] + 156 * z[11] * z[12]
- 14 * z[13] + 15 * z[14] - 16 * z[15]
+ 17 * z[16] + 18 * z[17] - 19 * z[18]
- 20 * z[19] == 0x87DF8B,

z[0] - 2 * z[1] - 3 * z[2] + 4 * z[3]
+ 1050 * z[4] * z[5] * z[6] + 8 * z[7] - 9 * z[8]
- 110 * z[9] * z[10] - 192 * z[11] * z[15]
- 208 * z[12] * z[15] + 224 * z[13] * z[15]
+ 240 * z[14] * z[15] - 17 * z[16] + 18 * z[17]
- 19 * z[18] - 20 * z[19] == 0x492C020A,

z[0] + 2 * z[1] + 3 * z[2] + 4 * z[3] + 5 * z[4]
+ 210 * z[5] * z[6] + 8 * z[7] - 9 * z[8]
+ 1320 * z[9] * z[10] * z[11] + 13 * z[12]
+ 14 * z[13] - 240 * z[14] * z[15] + 17 * z[16]
- 18 * z[17] + 380 * z[18] * z[19] == 0x6D78626B,

2 * z[0] * z[1] - 3 * z[2] + 4 * z[3] + 5 * z[4]
+ 210 * z[5] * z[6] + 8 * z[7] - 9 * z[8]
- 10 * z[9] - 11 * z[10] + 12 * z[11]
+ 13 * z[12] + 14 * z[13] + 240 * z[14] * z[15]
- 17 * z[16] - 18 * z[17] + 380 * z[18] * z[19]
== 0x8510B0,

z[0] + 2 * z[1] - 3 * z[2]
+ 44 * z[3] * z[10] + 55 * z[4] * z[10]
+ 330 * z[5] * z[10] - 77 * z[6] * z[10]
+ 88 * z[7] * z[10] - 99 * z[8] * z[10]
+ 110 * z[9] * z[10] - 12 * z[11]
+ 13 * z[12] + 14 * z[13]
- 240 * z[14] * z[15] + 255 * z[14] * z[16]
+ 270 * z[14] * z[17] + 380 * z[18] * z[19]
== 0xADC0A5,

z[0] - 2 * z[1] + 3 * z[2] + 4 * z[3] - 5 * z[4]
- 30 * z[5] - 7 * z[6] + 8 * z[7] + 9 * z[8]
+ 110 * z[9] * z[10] - 12 * z[11] - 13 * z[12]
+ 14 * z[13] + 240 * z[14] * z[15]
- 17 * z[16] - 18 * z[17]
+ 380 * z[18] * z[19] == 0x74E2ED,

z[0] + 2 * z[1] - 12 * z[2] * z[3] + 5 * z[4]
+ 30 * z[5] - 7 * z[6] + 8 * z[7] - 9 * z[8]
+ 110 * z[9] * z[10] - 12 * z[11]
+ 13 * z[12] + 14 * z[13]
- 240 * z[14] * z[15] - 17 * z[16] - 18 * z[17]
+ 380 * z[18] * z[19] == 0x2590BB,

2 * z[0] * z[1] - 12 * z[2] * z[3] - 5 * z[4]
- 30 * z[5] + 7 * z[6] + 72 * z[7] * z[8]
+ 110 * z[9] * z[10] - 12 * z[11] - 13 * z[12]
+ 14 * z[13] - 15 * z[14] - 272 * z[15] * z[16]
- 18 * z[17] - 19 * z[18] - 20 * z[19]
== 0xFFF14168,

z[0] + 6 * z[1] * z[2] + 8 * z[1] * z[3]
+ 10 * z[1] * z[4] + 60 * z[1] * z[5]
- 14 * z[1] * z[6] + 16 * z[1] * z[7]
- 18 * z[1] * z[8] + 220 * z[1] * z[9] * z[10]
- 12 * z[11] + 13 * z[12] + 14 * z[13]
- 15 * z[14] - 16 * z[15] - 17 * z[16]
- 18 * z[17] - 380 * z[18] * z[19]
== 0x0F2B5D7F,

z[0] - 2 * z[1] - 3 * z[2] - 20 * z[3] * z[4]
+ 210 * z[5] * z[6] + 8 * z[7] - 9 * z[8]
+ 110 * z[9] * z[10] - 12 * z[11] - 13 * z[12]
+ 14 * z[13] + 240 * z[14] * z[15]
- 17 * z[16] - 18 * z[17] - 19 * z[18]
- 20 * z[19] == 0x5BE48E,

2 * z[0] * z[1] + 12 * z[2] * z[3] + 5 * z[4]
+ 30 * z[5] - 504 * z[6] * z[7] * z[8]
+ 110 * z[9] * z[10] + 12 * z[11] - 13 * z[12]
+ 14 * z[13] - 15 * z[14] + 16 * z[15]
- 17 * z[16] + 18 * z[17] - 19 * z[18]
- 20 * z[19] == 0xDA08D28A,

6 * z[0] * z[1] * z[2] - 4 * z[3] + 5 * z[4]
+ 30 * z[5] + 7 * z[6] - 72 * z[7] * z[8]
+ 110 * z[9] * z[10] + 12 * z[11] + 13 * z[12]
- 14 * z[13] - 15 * z[14] - 16 * z[15]
- 17 * z[16] - 18 * z[17]
+ 380 * z[18] * z[19] == 0xA23A95,

z[0] + 2 * z[1] + 12 * z[2] * z[3]
- 15 * z[2] * z[4] - 90 * z[2] * z[5]
+ 7 * z[6] + 8 * z[7] - 9 * z[8]
+ 110 * z[9] * z[10] - 12 * z[11] + 13 * z[12]
+ 210 * z[13] * z[14] + 16 * z[15]
- 17 * z[16] - 18 * z[17]
+ 380 * z[18] * z[19] == 0x5E78E5,

2 * z[0] * z[1] + 12 * z[2] * z[3] + 5 * z[4]
- 210 * z[5] * z[6] + 720 * z[7] * z[8] * z[9]
- 11 * z[10] - 156 * z[11] * z[12]
+ 14 * z[13] - 240 * z[14] * z[15]
- 306 * z[16] * z[17] - 380 * z[18] * z[19]
== 0x3512A8FF,

z[0] + 24 * z[1] * z[2] * z[3] - 5 * z[4]
+ 30 * z[5] - 7 * z[6] + 8 * z[7] + 9 * z[8]
+ 10 * z[9] + 11 * z[10] + 12 * z[11]
- 13 * z[12] - 14 * z[13] - 15 * z[14]
+ 16 * z[15] - 17 * z[16] + 18 * z[17]
+ 19 * z[18] + 20 * z[19] == 0x1667C20,

z[0] + 6 * z[1] * z[2] - 4 * z[3] - 5 * z[4]
+ 1680 * z[5] * z[6] * z[7] - 9 * z[8] + 10 * z[9]
- 11 * z[10] + 12 * z[11] + 13 * z[12]
- 14 * z[13] - 240 * z[14] * z[15]
- 17 * z[16] - 18 * z[17]
+ 380 * z[18] * z[19] == 0x754201F0
]
solver.add(rule)
result = solver.check()
if result == sat:
    model = solver.model()
    values = [
        model.eval(c[i], model_completion=True).as_long()
        for i in range(20)
    ]

    print(values)
    print(''.join(chr(x) for x in values))



```

flag

```python
z3 = "hahahathisisfackflag"
flag = ""

target = [
    0x1207,0x4ca0,0x4f21,0x39,
    0x1a523,0x23a,0x926,0x4ca7,
    0x6560,0x36,0x1a99b,0x4ca8,
    0x1bbe0,0x3705,0x926,0x77d3,
    0x9a98,0x657b,0x18,0xb11
]
key = [
    7,7,7,9,5,
    6,7,7,7,9,
    7,7,5,7,7,
    7,5,7,9,7
]

def calc(a, b):
    v3 = 1
    while b:
        if b & 1:
            v3 *= a
        a = a*a % 1000
        b >>= 2
    return v3

for i in range(20):

    need = target[i] ^ ord(z3[19-i])
    for c in range(32,127):
        if calc(c,key[i]) == need:
            flag += chr(c)

print(flag)
```

# [SWPUCTF 2023 秋季新生赛]IDA动态调试

![image-20260714152318273](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714152318273.png)

ff1应是生成flag的函数,下断点

![image-20260714152502620](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260714152502620.png)

运行即可

# [FSCTF 2023]Tea_apk

![image-20260716205652232](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716205652232.png)

有个delta,tea系列的

![image-20260716210058560](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716210058560.png)

check的参数是我们的输入即flag,key是ABvWW7hqwNvHUhfP

vlgg9nNjUcYuWzBSSOwKxbMD2rhFgf4zuiyMpLxpNkM=是最后比对的base64字符串

```python
import struct
import base64

MASK = 0xffffffff
DELTA = 0x9E3779B9

def mx(s, y, z, p, e, key):
    return (
        (((z >> 5) ^ (y << 2)) + ((y >> 3) ^ (z << 4)))
        ^ ((s ^ y) + (key[(p & 3) ^ e] ^ z))
    ) & MASK

def xxtea_encrypt(data, key):
    v = data[:]
    n = len(v)
    if n < 2:
        return v

    rounds = 6 + 52 // n
    s = 0
    z = v[-1]

    for _ in range(rounds):
        s = (s + DELTA) & MASK
        e = (s >> 2) & 3

        for p in range(n - 1):
            y = v[p + 1]
            v[p] = (v[p] + mx(s, y, z, p, e, key)) & MASK
            z = v[p]

        y = v[0]
        v[-1] = (v[-1] + mx(s, y, z, n - 1, e, key)) & MASK
        z = v[-1]

    return v

def xxtea_decrypt(data, key):
    v = data[:]
    n = len(v)
    if n < 2:
        return v

    rounds = 6 + 52 // n
    s = (rounds * DELTA) & MASK
    y = v[0]

    while s:
        e = (s >> 2) & 3

        for p in range(n - 1, 0, -1):
            z = v[p - 1]
            v[p] = (v[p] - mx(s, y, z, p, e, key)) & MASK
            y = v[p]

        z = v[-1]
        v[0] = (v[0] - mx(s, y, z, 0, e, key)) & MASK
        y = v[0]

        s = (s - DELTA) & MASK

    return v

def bytes_to_dwords(data):
    return list(struct.unpack("<%dI" % (len(data) // 4), data))

def dwords_to_bytes(data):
    return struct.pack("<%dI" % len(data), *data)



# key = [0x37, 0x42, 0x4D, 0x58]
key = bytes_to_dwords(b"ABvWW7hqwNvHUhfP")

cipher = base64.b64decode("vlgg9nNjUcYuWzBSSOwKxbMD2rhFgf4zuiyMpLxpNkM=")

enc = bytes_to_dwords(cipher)

plain = xxtea_decrypt(enc, key)

print("DWORD：", [hex(x) for x in plain])
print("plain：", dwords_to_bytes(plain))
```

# [强网杯 2022]GameMaster

![image-20260719142340805](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260719142340805.png)



# [HZNUCTF 2023 final]signin

改特征码脱壳,RC4

![image-20260720084320777](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260720084320777.png)

# [SWPUCTF 2025 秋季新生赛]一种很新的签到

shift+F12

# [HGAME 2023 week4]vm



# [LitCTF 2025]easy_rc4

没壳进IDA

![image-20260716120901791](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716120901791.png)

给了cipher和key

![image-20260716120939973](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716120939973.png)

多了个异或

![image-20260716121807024](C:\Users\Petrichor\AppData\Roaming\Typora\typora-user-images\image-20260716121807024.png)
