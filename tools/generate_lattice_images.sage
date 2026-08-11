# -*- coding: utf-8 -*-
# Generate lattice images for the blog post using SageMath + matplotlib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch
import numpy as np
from pathlib import Path

OUT = Path(r'd:/blog/hexo-blog/source/images')
OUT.mkdir(parents=True, exist_ok=True)

from matplotlib.font_manager import FontProperties

import shutil

FONT_SRC = Path(r'd:/blog/hexo-blog/tools/fonts/simhei.ttf')
FONT_LOCAL = Path('/home/sage/simhei.ttf')
if FONT_SRC.exists() and (not FONT_LOCAL.exists() or FONT_LOCAL.stat().st_size != FONT_SRC.stat().st_size):
    shutil.copy(str(FONT_SRC), str(FONT_LOCAL))
CN = FontProperties(fname=str(FONT_LOCAL)) if FONT_LOCAL.exists() else None
plt.rcParams['axes.unicode_minus'] = False


def cn_title(ax, title, **kwargs):
    ax.set_title(title, fontproperties=CN, **kwargs)


def cn_figtext(fig, x, y, text, **kwargs):
    fig.text(x, y, text, fontproperties=CN, **kwargs)


def cn_suptitle(fig, title, **kwargs):
    fig.suptitle(title, fontproperties=CN, **kwargs)

BLUE = '#2f6fed'
RED = '#e24d4d'
GREEN = '#2ea05a'
ORANGE = '#f0912d'
PURPLE = '#8050c8'
GRID = '#e6e6e6'
DARK = '#232323'
GRAY = '#6e6e6e'


def draw_arrow(ax, start, vec, color, width=2.5):
    ax.add_patch(FancyArrowPatch(
        start, (start[0] + vec[0], start[1] + vec[1]),
        arrowstyle='->', mutation_scale=18, linewidth=width, color=color
    ))


def plot_lattice_points(ax, b1, b2, origin=(0, 0), color=BLUE, r=0.08):
    for i in range(-7, 8):
        for j in range(-7, 8):
            p = (origin[0] + i * b1[0] + j * b2[0], origin[1] + i * b1[1] + j * b2[1])
            if -5.5 <= p[0] <= 5.5 and -4.5 <= p[1] <= 4.5:
                ax.add_patch(plt.Circle(p, r, color=color, zorder=2))


def setup_ax(ax, title=None):
    ax.set_aspect('equal')
    ax.axhline(0, color=GRID, lw=1)
    ax.axvline(0, color=GRID, lw=1)
    ax.set_xlim(-5.5, 5.5)
    ax.set_ylim(-4.5, 4.5)
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)
    if title:
        cn_title(ax, title, fontsize=16, color=DARK, pad=12)


def save_lattice_2d():
    fig, ax = plt.subplots(figsize=(10, 6.5))
    b1, b2 = (2, 1), (1, 2)
    plot_lattice_points(ax, b1, b2)
    draw_arrow(ax, (0, 0), b1, RED)
    draw_arrow(ax, (0, 0), b2, GREEN)
    ax.text(b1[0] + 0.15, b1[1] + 0.1, 'b1', color=RED, fontsize=14)
    ax.text(b2[0] - 0.1, b2[1] + 0.15, 'b2', color=GREEN, fontsize=14)
    setup_ax(ax, '二维格：由两个基向量生成')
    cn_figtext(fig, 0.08, 0.03, '蓝色格点均为整数线性组合 z1*b1 + z2*b2', color=GRAY, fontsize=11)
    fig.savefig(OUT / 'lattice-2d.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)


def save_lattice_bases():
    fig, ax = plt.subplots(figsize=(10, 6.5))
    b1, b2 = (2, 1), (1, 2)
    new1 = (b1[0] + b2[0], b1[1] + b2[1])
    new2 = b2
    plot_lattice_points(ax, b1, b2)
    draw_arrow(ax, (0, 0), b1, RED)
    draw_arrow(ax, (0, 0), b2, RED, width=2)
    draw_arrow(ax, (0, 0), new1, PURPLE)
    draw_arrow(ax, (0, 0), new2, ORANGE)
    ax.text(b1[0] + 0.2, b1[1], "B", color=RED, fontsize=14)
    ax.text(new1[0] + 0.1, new1[1] + 0.1, "B'", color=PURPLE, fontsize=14)
    setup_ax(ax, '不同基可以描述同一个格')
    cn_figtext(fig, 0.08, 0.03, '格点集合不变，仅表示方式（基）发生改变', color=GRAY, fontsize=11)
    fig.savefig(OUT / 'lattice-bases.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)


def save_lattice_reduction():
    fig, axes = plt.subplots(1, 2, figsize=(10, 6.5))
    bad = ((3.2, 0.8), (2.8, 2.6))
    good = ((1.8, 0.4), (0.6, 1.6))
    for ax, vecs, title in zip(axes, [bad, good], ['约简前（差基）', '约简后（好基）']):
        plot_lattice_points(ax, (2, 1), (1, 2), r=0.06)
        color = RED if title.startswith('约简前') else BLUE
        draw_arrow(ax, (0, 0), vecs[0], color)
        draw_arrow(ax, (0, 0), vecs[1], GREEN if title.startswith('约简后') else color)
        setup_ax(ax, title)
    cn_figtext(fig, 0.08, 0.03, '基约简不改变格本身，但使基向量更短、更接近正交', color=GRAY, fontsize=11)
    fig.savefig(OUT / 'lattice-reduction.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)


def save_lattice_example():
    fig, ax = plt.subplots(figsize=(10, 6.5))
    b1, b2 = (4, 1), (1, 3)
    plot_lattice_points(ax, b1, b2, r=0.07)
    draw_arrow(ax, (0, 0), b1, RED)
    draw_arrow(ax, (0, 0), b2, GREEN)
    examples = [((5, 4), 'b1+b2', ORANGE), ((7, -1), '2b1-b2', PURPLE), ((-2, 5), '-b1+2b2', ORANGE)]
    for pt, label, color in examples:
        ax.add_patch(plt.Circle(pt, 0.12, color=color, ec=DARK, lw=1.5, zorder=4))
        ax.text(pt[0] + 0.15, pt[1] + 0.1, label, color=color, fontsize=12)
    ax.text(b1[0] + 0.15, b1[1], 'b1', color=RED, fontsize=14)
    ax.text(b2[0] - 0.2, b2[1] + 0.15, 'b2', color=GREEN, fontsize=14)
    setup_ax(ax, '例子：b1=(4,1), b2=(1,3) 生成的格')
    cn_figtext(fig, 0.08, 0.03, '橙色与紫色点标注了文中几个整数线性组合示例', color=GRAY, fontsize=11)
    fig.savefig(OUT / 'lattice-example.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)


def save_gso():
    fig, ax = plt.subplots(figsize=(10, 6.5))
    b1, b2 = (3.5, 0.8), (1.2, 2.8)
    draw_arrow(ax, (0, 0), b1, BLUE)
    draw_arrow(ax, (0, 0), b2, RED)
    t = np.dot(b2, b1) / np.dot(b1, b1)
    proj = (t * b1[0], t * b1[1])
    draw_arrow(ax, (0, 0), proj, ORANGE, width=2)
    ax.plot([proj[0], b2[0]], [proj[1], b2[1]], color=GREEN, lw=3)
    ax.text(b1[0] + 0.1, b1[1], 'b1', color=BLUE, fontsize=14)
    ax.text(b2[0] + 0.1, b2[1], 'b2', color=RED, fontsize=14)
    ax.text(proj[0] - 0.8, proj[1] - 0.35, '投影', color=ORANGE, fontsize=13, fontproperties=CN)
    ax.text(b2[0] + 0.2, (proj[1] + b2[1]) / 2, '正交部分 b2*', color=GREEN, fontsize=13, fontproperties=CN)
    setup_ax(ax, 'Gram-Schmidt：去除投影分量')
    cn_figtext(fig, 0.08, 0.03, 'LLL 利用 Gram-Schmidt 数据判断基向量是否过度倾斜', color=GRAY, fontsize=11)
    fig.savefig(OUT / 'lattice-gram-schmidt.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)


def save_lll_steps():
    fig, axes = plt.subplots(1, 3, figsize=(10, 6.5))
    titles = ['原始基', '大小约简', '必要时交换']
    vecs = [((1.6, -0.5), (2.2, -2.0)), ((1.6, -0.5), (0.8, -1.8)), ((0.9, -1.8), (1.4, -0.6))]
    colors = [(RED, BLUE), (RED, BLUE), (GREEN, BLUE)]
    for ax, title, vs, cs in zip(axes, titles, vecs, colors):
        draw_arrow(ax, (0, 0), vs[0], cs[0])
        draw_arrow(ax, (0, 0), vs[1], cs[1])
        setup_ax(ax, title)
        ax.set_xlim(-3, 3)
        ax.set_ylim(-3, 2.5)
    cn_suptitle(fig, 'LLL 约简：缩短向量与交换', fontsize=16, color=DARK, y=0.98)
    cn_figtext(fig, 0.08, 0.03, 'LLL 反复用前面基向量的整数倍缩短后续向量，并在必要时交换相邻基', color=GRAY, fontsize=11)
    fig.savefig(OUT / 'lattice-lll-steps.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)


def save_bkz_block():
    fig, ax = plt.subplots(figsize=(10, 6.5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6)
    ax.axis('off')
    start_x, y = 0.8, 2.5
    cell_w, cell_h = 0.75, 1.0
    for i in range(10):
        x = start_x + i * cell_w
        fill = '#fff2e1' if 3 <= i <= 6 else '#f5f5f5'
        rect = plt.Rectangle((x, y), cell_w - 0.08, cell_h, fill=fill, ec=GRID, lw=1.5)
        ax.add_patch(rect)
        ax.text(x + 0.18, y + 0.35, f'b{i+1}', fontsize=12, color=DARK)
    block = plt.Rectangle((start_x + 3 * cell_w - 0.04, y - 0.15), 4 * cell_w - 0.08, cell_h + 0.3,
                            fill=False, ec=ORANGE, lw=3)
    ax.add_patch(block)
    ax.annotate('', xy=(start_x + 8.2 * cell_w, y + 0.5), xytext=(start_x + 7.2 * cell_w, y + 0.5),
                arrowprops=dict(arrowstyle='->', color=GRAY, lw=2))
    ax.text(start_x + 3.3 * cell_w, y + 1.55, '块大小 beta', color=ORANGE, fontsize=14, fontproperties=CN)
    cn_title(ax, 'BKZ：在滑动块内做强约简', fontsize=16, color=DARK, pad=16)
    cn_figtext(fig, 0.08, 0.03, 'BKZ 在每个块内做更强的局部约简，然后向前滑动窗口', color=GRAY, fontsize=11)
    fig.savefig(OUT / 'lattice-bkz-block.png', dpi=150, bbox_inches='tight', facecolor='white')
    plt.close(fig)


for fn in [save_lattice_2d, save_lattice_bases, save_lattice_reduction, save_lattice_example,
           save_gso, save_lll_steps, save_bkz_block]:
    fn()

print('Generated images in', OUT)
for p in sorted(OUT.glob('lattice-*.png')):
    print(p.name, p.stat().st_size)
