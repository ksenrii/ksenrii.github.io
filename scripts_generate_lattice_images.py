from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math

OUT = Path(r"d:\blog\hexo-blog\source\images")
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1000, 650
BG = "white"
GRID = (230, 230, 230)
BLUE = (47, 111, 237)
RED = (226, 77, 77)
GREEN = (46, 160, 90)
ORANGE = (240, 145, 45)
PURPLE = (128, 80, 200)
DARK = (35, 35, 35)
GRAY = (110, 110, 110)
LIGHT_BLUE = (230, 240, 255)
LIGHT_ORANGE = (255, 242, 225)

try:
    FONT = ImageFont.truetype("arial.ttf", 24)
    SMALL = ImageFont.truetype("arial.ttf", 18)
    BIG = ImageFont.truetype("arial.ttf", 30)
except Exception:
    FONT = SMALL = BIG = ImageFont.load_default()


def arrow(draw, start, end, color, width=5):
    draw.line([start, end], fill=color, width=width)
    sx, sy = start
    ex, ey = end
    ang = math.atan2(ey - sy, ex - sx)
    size = 14
    pts = [
        (ex, ey),
        (ex - size * math.cos(ang - math.pi / 6), ey - size * math.sin(ang - math.pi / 6)),
        (ex - size * math.cos(ang + math.pi / 6), ey - size * math.sin(ang + math.pi / 6)),
    ]
    draw.polygon(pts, fill=color)


def draw_axes(draw, origin=(500, 330), scale=45):
    ox, oy = origin
    draw.line([(80, oy), (920, oy)], fill=GRID, width=2)
    draw.line([(ox, 80), (ox, 570)], fill=GRID, width=2)


def lattice_points(draw, basis, origin=(500, 330), scale=45, color=BLUE, r=5):
    ox, oy = origin
    b1, b2 = basis
    for i in range(-7, 8):
        for j in range(-7, 8):
            x = i * b1[0] + j * b2[0]
            y = i * b1[1] + j * b2[1]
            px = ox + x * scale
            py = oy - y * scale
            if 60 <= px <= 940 and 60 <= py <= 590:
                draw.ellipse((px-r, py-r, px+r, py+r), fill=color)


def v_to_px(v, origin=(500, 330), scale=45):
    return origin[0] + v[0] * scale, origin[1] - v[1] * scale


def save_lattice_2d():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    basis = ((2, 1), (1, 2))
    draw_axes(d)
    lattice_points(d, basis)
    origin = (500, 330)
    arrow(d, origin, v_to_px(basis[0]), RED)
    arrow(d, origin, v_to_px(basis[1]), GREEN)
    d.text((300, 40), "二维格：由两个基向量生成", fill=DARK, font=BIG)
    d.text((590, 275), "b1", fill=RED, font=FONT)
    d.text((545, 225), "b2", fill=GREEN, font=FONT)
    d.text((80, 600), "蓝色格点均为整数线性组合 z1*b1 + z2*b2", fill=GRAY, font=SMALL)
    im.save(OUT / "lattice-2d.png")


def save_lattice_bases():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    basis = ((2, 1), (1, 2))
    draw_axes(d)
    lattice_points(d, basis)
    origin = (500, 330)
    old = ((2, 1), (1, 2))
    new = ((3, 3), (1, 2))  # new1 = old1 + old2, new2 = old2
    arrow(d, origin, v_to_px(old[0]), RED)
    arrow(d, origin, v_to_px(old[1]), RED)
    arrow(d, origin, v_to_px(new[0]), PURPLE)
    arrow(d, origin, v_to_px(new[1]), ORANGE)
    d.text((250, 40), "不同基可以描述同一个格", fill=DARK, font=BIG)
    d.text((600, 275), "B", fill=RED, font=FONT)
    d.text((645, 190), "B'", fill=PURPLE, font=FONT)
    d.text((80, 600), "格点集合不变，仅表示方式（基）发生改变", fill=GRAY, font=SMALL)
    im.save(OUT / "lattice-bases.png")


def save_lattice_reduction():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((180, 40), "约简前（差基）", fill=DARK, font=BIG)
    d.text((620, 40), "约简后（好基）", fill=DARK, font=BIG)
    for ox in (260, 740):
        for x in range(80, 440, 45):
            d.line([(ox-180+x, 100), (ox-180+x, 560)], fill=GRID, width=1)
        for y in range(100, 580, 45):
            d.line([(ox-180, y), (ox+180, y)], fill=GRID, width=1)
    left_o = (260, 340)
    right_o = (740, 340)
    arrow(d, left_o, (430, 310), RED)
    arrow(d, left_o, (405, 135), RED)
    arrow(d, right_o, (850, 280), BLUE)
    arrow(d, right_o, (685, 210), GREEN)
    d.text((80, 600), "基约简不改变格本身，但使基向量更短、更接近正交", fill=GRAY, font=SMALL)
    im.save(OUT / "lattice-reduction.png")


def save_gso():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    origin = (250, 410)
    d.text((180, 40), "Gram-Schmidt：去除投影分量", fill=DARK, font=BIG)
    arrow(d, origin, (620, 300), BLUE)
    arrow(d, origin, (540, 120), RED)
    # projection of red vector onto blue line, approximate
    proj = (520, 330)
    arrow(d, origin, proj, ORANGE, width=4)
    d.line([proj, (540, 120)], fill=GREEN, width=4)
    d.text((625, 292), "b1", fill=BLUE, font=FONT)
    d.text((545, 110), "b2", fill=RED, font=FONT)
    d.text((430, 352), "投影", fill=ORANGE, font=FONT)
    d.text((555, 220), "正交部分 b2*", fill=GREEN, font=FONT)
    d.text((80, 600), "LLL 利用 Gram-Schmidt 数据判断基向量是否过度倾斜", fill=GRAY, font=SMALL)
    im.save(OUT / "lattice-gram-schmidt.png")


def save_lll_steps():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((280, 40), "LLL 约简：缩短向量与交换", fill=DARK, font=BIG)
    boxes = [(80, 170, 300, 420), (390, 170, 610, 420), (700, 170, 920, 420)]
    titles = ["原始基", "大小约简", "必要时交换"]
    for box, title in zip(boxes, titles):
        d.rounded_rectangle(box, radius=18, outline=GRID, width=3, fill=(250, 250, 250))
        d.text((box[0]+35, 135), title, fill=DARK, font=FONT)
    arrow(d, (310, 295), (380, 295), GRAY, width=3)
    arrow(d, (620, 295), (690, 295), GRAY, width=3)
    origins = [(190, 315), (500, 315), (810, 315)]
    vectors = [((95, -35), (140, -130)), ((95, -35), (50, -145)), ((65, -120), (110, -40))]
    colors = [(RED, BLUE), (RED, BLUE), (GREEN, BLUE)]
    for o, vs, cs in zip(origins, vectors, colors):
        arrow(d, o, (o[0]+vs[0][0], o[1]+vs[0][1]), cs[0])
        arrow(d, o, (o[0]+vs[1][0], o[1]+vs[1][1]), cs[1])
    d.text((85, 560), "LLL 反复用前面基向量的整数倍缩短后续向量，并在必要时交换相邻基", fill=GRAY, font=SMALL)
    im.save(OUT / "lattice-lll-steps.png")


def save_bkz_block():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((280, 40), "BKZ：在滑动块内做强约简", fill=DARK, font=BIG)
    start_x, y = 120, 270
    cell_w, cell_h = 80, 90
    for i in range(10):
        x = start_x + i * cell_w
        fill = LIGHT_ORANGE if 3 <= i <= 6 else (245, 245, 245)
        d.rounded_rectangle((x, y, x+cell_w-10, y+cell_h), radius=10, fill=fill, outline=GRID, width=2)
        d.text((x+20, y+30), f"b{i+1}", fill=DARK, font=FONT)
    d.rounded_rectangle((start_x+3*cell_w-8, y-15, start_x+7*cell_w-18, y+cell_h+15), radius=16, outline=ORANGE, width=5)
    d.text((start_x+3*cell_w+20, y-55), "块大小 beta", fill=ORANGE, font=FONT)
    arrow(d, (start_x+7*cell_w+20, y+45), (start_x+8*cell_w+35, y+45), GRAY, width=4)
    d.text((170, 500), "BKZ 在每个块内做更强的局部约简，然后向前滑动窗口", fill=GRAY, font=SMALL)
    im.save(OUT / "lattice-bkz-block.png")


def save_lattice_example():
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    basis = ((4, 1), (1, 3))
    draw_axes(d, scale=35)
    lattice_points(d, basis, scale=35)
    origin = (500, 330)
    arrow(d, origin, v_to_px(basis[0], scale=35), RED)
    arrow(d, origin, v_to_px(basis[1], scale=35), GREEN)
    examples = [
        ((5, 4), "b1+b2", ORANGE),
        ((7, -1), "2b1-b2", PURPLE),
        ((-2, 5), "-b1+2b2", ORANGE),
    ]
    for pt, label, color in examples:
        px, py = v_to_px(pt, scale=35)
        d.ellipse((px-7, py-7, px+7, py+7), fill=color, outline=DARK, width=2)
        d.text((px+12, py-10), label, fill=color, font=SMALL)
    d.text((250, 40), "例子：b1=(4,1), b2=(1,3) 生成的格", fill=DARK, font=BIG)
    d.text((origin[0]+95, origin[1]-15), "b1", fill=RED, font=FONT)
    d.text((origin[0]+25, origin[1]-75), "b2", fill=GREEN, font=FONT)
    d.text((80, 600), "橙色与紫色点标注了文中几个整数线性组合示例", fill=GRAY, font=SMALL)
    im.save(OUT / "lattice-example.png")

def main():
    save_lattice_2d()
    save_lattice_bases()
    save_lattice_reduction()
    save_lattice_example()
    save_gso()
    save_lll_steps()
    save_bkz_block()

if __name__ == "__main__":
    main()
