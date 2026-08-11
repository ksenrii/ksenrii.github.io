from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUT = Path("output/pdf/2026-07-23-Day02-Unit2-3.pdf")


GROUPS = [
    {
        "sentence": "A sudden casualty made the ceremony less casual, and the guests could hardly celebrate before the cause was certain.",
        "translation": "一场突然的伤亡事件让仪式不再轻松；在原因确定之前，宾客们几乎无法庆祝。",
        "words": [
            ("casualty", "n.", "伤亡人员；受害者；损失物"),
            ("casual", "adj.", "随意的；偶然的；非正式的"),
            ("ceremony", "n.", "仪式，典礼"),
            ("celebrate", "v.", "庆祝；赞扬"),
            ("cause", "n./v.", "原因，事业；导致，引起"),
            ("certain", "adj.", "确定的；某个；一定会发生的"),
            ("certainty", "n.", "确定性；确信；必然的事"),
        ],
    },
    {
        "sentence": "The category of the error was hard to catch, so the team treated the warning with caution and made a cautious decision.",
        "translation": "错误的类别很难捕捉，因此团队谨慎对待警告，并做出了审慎决定。",
        "words": [
            ("catch", "v./n.", "抓住；捕捉；理解；赶上；捕获物"),
            ("category", "n.", "种类，类别"),
            ("caution", "n./v.", "谨慎；警告；提醒"),
            ("cautious", "adj.", "谨慎的，小心的"),
            ("decision", "n.", "决定，决策"),
        ],
    },
    {
        "sentence": "The hotel tried to cater to fashionable tourists, but the site could not sit comfortably beside such a delicate old street.",
        "translation": "这家酒店试图迎合时尚游客，但这个地点与如此精致的老街放在一起并不协调。",
        "words": [
            ("cater", "v.", "迎合；提供饮食，承办酒席"),
            ("fashion", "n./v.", "时尚；方式；制作，塑造"),
            ("fashionable", "adj.", "流行的，时髦的"),
            ("site", "n./v.", "地点，场所；使位于"),
            ("sit", "v.", "坐；位于；适合"),
            ("delicate", "adj.", "精美的；脆弱的；微妙的"),
        ],
    },
    {
        "sentence": "The certificate did not certify his skill, and the manager began to deem the decline in performance a serious warning.",
        "translation": "证书并不能证明他的技能，经理开始认为业绩下降是一个严重警告。",
        "words": [
            ("certificate", "n.", "证书，证明"),
            ("certify", "v.", "证明，证实；颁发证书"),
            ("deem", "v.", "认为，视为"),
            ("decline", "n./v.", "下降，衰退；拒绝；谢绝"),
            ("performance", "n.", "表现；性能；演出"),
        ],
    },
    {
        "sentence": "The new decree aimed to decrease waste, but economists tried to deduce its cost and deduct hidden expenses from the budget.",
        "translation": "新法令旨在减少浪费，但经济学家试图推断其成本，并从预算中扣除隐性开支。",
        "words": [
            ("decree", "n./v.", "法令，政令；颁布"),
            ("decrease", "v./n.", "减少，降低；减少量"),
            ("deduce", "v.", "推论，演绎出"),
            ("deduct", "v.", "扣除，减去"),
            ("budget", "n.", "预算"),
        ],
    },
    {
        "sentence": "The teacher dedicated the lesson to a skeptical student, using a simple skeleton and a clear sketch to explain the situation.",
        "translation": "老师把这节课专门讲给一位持怀疑态度的学生，用简单框架和清晰草图解释情况。",
        "words": [
            ("dedicate", "v.", "献身于；把……用于；题献"),
            ("skeptical", "adj.", "怀疑的"),
            ("skeleton", "n.", "骨架；纲要；骨瘦如柴的人"),
            ("sketch", "n./v.", "草图，速写；概述；画草图"),
            ("situation", "n.", "情况，形势；位置"),
            ("situate", "v.", "使位于；使处于"),
        ],
    },
    {
        "sentence": "The celebrity won public favour after a favourable report called the project his favourite example of social service.",
        "translation": "一篇正面报道称该项目是他最喜欢的社会服务案例后，这位名人赢得了公众好感。",
        "words": [
            ("celebrity", "n.", "名人，名流"),
            ("favour/favor", "n./v.", "赞同，恩惠；偏爱；支持，帮助"),
            ("favourable/favorable", "adj.", "有利的；赞成的；良好的"),
            ("favourite/favorite", "n./adj.", "最喜欢的人或物；最喜欢的"),
            ("service", "n.", "服务；公共事业"),
        ],
    },
    {
        "sentence": "A finite amount of money cannot finance every global plan, so the financial report listed the first finding in fine detail.",
        "translation": "有限的资金无法资助每一个全球计划，因此财务报告详细列出了第一项发现。",
        "words": [
            ("finite", "adj.", "有限的"),
            ("finance", "n./v.", "财政，金融；资助"),
            ("financial", "adj.", "财政的，金融的"),
            ("global", "adj.", "全球的；总体的"),
            ("globe", "n.", "地球；球体"),
            ("first", "adj./adv./n.", "第一的；首先；第一"),
            ("finding", "n.", "发现；调查结果；判决"),
            ("fine", "adj./n./v.", "好的；精细的；罚款；罚款"),
        ],
    },
    {
        "sentence": "The player had to fight for every point, figure out a new strategy, and stay fit during a fierce competition on the field.",
        "translation": "这名选手必须为每一分而战，想出新策略，并在赛场上的激烈竞争中保持健康。",
        "words": [
            ("fight", "v./n.", "战斗，斗争；打架"),
            ("figure", "n./v.", "数字；人物；身材；图形；认为；计算"),
            ("fit", "adj./v./n.", "健康的；合适的；适合；安装；发作"),
            ("fierce", "adj.", "激烈的；凶猛的"),
            ("field", "n.", "田地；领域；场地"),
            ("competition", "n.", "竞争，比赛"),
        ],
    },
    {
        "sentence": "To embrace a new idea, scholars sometimes embed it in a larger theory and embody it in a concrete model.",
        "translation": "为了接纳一个新想法，学者有时会把它嵌入更大的理论，并用具体模型体现出来。",
        "words": [
            ("embrace", "v./n.", "拥抱；欣然接受；包括；拥抱"),
            ("embed", "v.", "嵌入，埋置"),
            ("embody", "v.", "体现；包含；使具体化"),
            ("embryo", "n.", "胚胎；萌芽阶段的事物"),
            ("theory", "n.", "理论"),
            ("model", "n./v.", "模型；模特；建模，模仿"),
        ],
    },
    {
        "sentence": "The interview managed to elicit an honest answer from an elite expert who had been working elsewhere.",
        "translation": "这次采访成功从一位一直在别处工作的精英专家口中引出了诚实回答。",
        "words": [
            ("elicit", "v.", "引出，诱出"),
            ("elite", "n./adj.", "精英；精英的"),
            ("elsewhere", "adv.", "在别处，到别处"),
            ("expert", "n./adj.", "专家；熟练的"),
            ("interview", "n./v.", "采访，面试；采访，面试"),
        ],
    },
    {
        "sentence": "His thirst for thorough research did not disappear, though every thoughtful comment made him rethink his original thought.",
        "translation": "他对彻底研究的渴望没有消失，尽管每一条深思熟虑的评论都会让他重新思考原来的想法。",
        "words": [
            ("thirst", "n./v.", "渴；渴望；渴求"),
            ("thorough", "adj.", "彻底的，全面的"),
            ("though", "conj./adv.", "虽然，尽管；可是，不过"),
            ("thought", "n.", "思想，想法；思考"),
            ("thoughtful", "adj.", "深思熟虑的；体贴的"),
            ("research", "n./v.", "研究；调查"),
        ],
    },
    {
        "sentence": "The threat of failure did not threaten the team; instead, they updated the plan, upheld the principle, and stayed up-to-date.",
        "translation": "失败的威胁并没有吓倒团队；相反，他们更新了计划，坚持原则，并保持信息最新。",
        "words": [
            ("threat", "n.", "威胁，恐吓；构成威胁的人或物"),
            ("threaten", "v.", "威胁；预示凶兆；危及"),
            ("update", "v./n.", "更新；最新消息"),
            ("uphold", "v.", "支持，维护；维持"),
            ("up-to-date", "adj.", "最新的，现代的"),
            ("principle", "n.", "原则，原理"),
        ],
    },
    {
        "sentence": "The bad news upset investors, so the firm tried to ventilate the room, venture a new explanation, and win back trust with wit.",
        "translation": "坏消息让投资者不安，因此公司试图让会议室通风，冒险提出新解释，并用机智重新赢回信任。",
        "words": [
            ("upset", "v./adj./n.", "使心烦；打乱；心烦的；意外的失败"),
            ("ventilate", "v.", "使通风；公开讨论"),
            ("venture", "v./n.", "冒险；敢于；风险项目"),
            ("win", "v./n.", "赢得；获胜；胜利"),
            ("wit", "n.", "机智；才智"),
            ("trust", "n./v.", "信任；相信"),
        ],
    },
    {
        "sentence": "A widespread witness report forced the company to withdraw its advertisement and inaugurate an academic review with the local academy.",
        "translation": "一份广泛传播的目击者报告迫使公司撤回广告，并与当地学院启动一次学术审查。",
        "words": [
            ("widespread", "adj.", "广泛的，普遍的"),
            ("witness", "n./v.", "目击者；证人；目击；见证"),
            ("withdraw", "v.", "撤回；退出；取款"),
            ("inaugurate", "v.", "为……举行就职典礼；开创，启动"),
            ("academic", "adj./n.", "学术的；大学教师，学者"),
            ("academy", "n.", "学院；研究院"),
            ("review", "n./v.", "审查；评论；复习；审查，评论"),
        ],
    },
    {
        "sentence": "The government offered an incentive to accelerate acceptance of clean energy, but access remained limited and many accessories were expensive.",
        "translation": "政府提供激励措施以加速清洁能源的接受度，但获取渠道仍然有限，许多配件也很昂贵。",
        "words": [
            ("incentive", "n.", "激励，刺激，诱因"),
            ("accelerate", "v.", "加速，促进"),
            ("acceptance", "n.", "接受，认可"),
            ("accept", "v.", "接受；承认；同意"),
            ("access", "n./v.", "通道；使用权；接近；访问，进入"),
            ("accessory", "n./adj.", "附件，配件；从犯；附属的"),
            ("energy", "n.", "能源；精力"),
        ],
    },
    {
        "sentence": "At the beginning of the incident, officials began to behave on behalf of the public, because belief in the system was beginning to weaken.",
        "translation": "事件开始时，官员们开始代表公众行动，因为人们对制度的信任正在减弱。",
        "words": [
            ("begin", "v.", "开始"),
            ("beginning", "n.", "开始，开端"),
            ("incident", "n.", "事件；adj. 附带的"),
            ("incidence", "n.", "发生率；影响范围"),
            ("incidentally", "adv.", "顺便说一句；偶然地"),
            ("behalf", "n.", "代表；利益"),
            ("behave", "v.", "表现，举止；守规矩"),
            ("behaviour/behavior", "n.", "行为，举止"),
            ("belief", "n.", "信念；相信"),
        ],
    },
    {
        "sentence": "People who believe they belong to a beneficial community are more likely to benefit from benevolent policies and benign institutions.",
        "translation": "相信自己属于有益共同体的人，更可能从仁慈的政策和良性的制度中受益。",
        "words": [
            ("believe", "v.", "相信；认为"),
            ("belong", "v.", "属于；适合"),
            ("beneficial", "adj.", "有益的，有利的"),
            ("benefit", "n./v.", "利益，好处；受益；有益于"),
            ("benevolent", "adj.", "仁慈的，慈善的"),
            ("benign", "adj.", "良性的；和善的"),
            ("institution", "n.", "制度；机构"),
        ],
    },
    {
        "sentence": "The challenge was not merely a chance for change; it was a channel through which character and characteristic habits could be tested.",
        "translation": "这个挑战不仅是改变的机会，也是检验性格和特征性习惯的渠道。",
        "words": [
            ("challenge", "n./v.", "挑战；质疑；向……挑战"),
            ("chance", "n./v.", "机会；偶然；冒险做"),
            ("change", "v./n.", "改变；变化；零钱"),
            ("channel", "n./v.", "渠道；频道；引导，输送"),
            ("character", "n.", "性格；人物；文字；特征"),
            ("characterise/characterize", "v.", "以……为特征；描述"),
            ("characteristic", "n./adj.", "特征，特点；典型的"),
        ],
    },
    {
        "sentence": "A clear definition can define the issue in definite terms, but some people defy rules and defend delay as deliberate caution.",
        "translation": "清晰的定义可以用明确措辞界定问题，但有些人无视规则，并把拖延辩护成有意的谨慎。",
        "words": [
            ("definition", "n.", "定义；清晰度"),
            ("define", "v.", "定义，界定；说明"),
            ("definite", "adj.", "明确的，确定的"),
            ("defy", "v.", "违抗，蔑视；经受住"),
            ("defend", "v.", "防御；为……辩护"),
            ("delay", "v./n.", "推迟，耽搁；延误"),
            ("deliberate", "adj./v.", "故意的；慎重的；仔细考虑"),
            ("degree", "n.", "程度；学位；度数"),
        ],
    },
]


CHECKLIST = [
    ("casualty", "n.", "伤亡人员；受害者；损失物"),
    ("catch", "v./n.", "抓住；捕捉；理解；赶上；捕获物"),
    ("category", "n.", "种类，类别"),
    ("cater", "v.", "迎合；提供饮食，承办酒席"),
    ("cause", "n./v.", "原因，事业；导致，引起"),
    ("caution", "n./v.", "谨慎；警告；提醒"),
    ("cautious", "adj.", "谨慎的，小心的"),
    ("cease", "v./n.", "停止，终止；停止"),
    ("celebrate", "v.", "庆祝；赞扬"),
    ("celebrity", "n.", "名人，名流"),
    ("ceremony", "n.", "仪式，典礼"),
    ("certain", "adj.", "确定的；某个；一定会发生的"),
    ("certainty", "n.", "确定性；确信；必然的事"),
    ("certificate", "n.", "证书，证明"),
    ("certify", "v.", "证明，证实；颁发证书"),
    ("decline", "n./v.", "下降，衰退；拒绝；谢绝"),
    ("decrease", "v./n.", "减少，降低；减少量"),
    ("decree", "n./v.", "法令，政令；颁布"),
    ("deem", "v.", "认为，视为"),
    ("dedicate", "v.", "献身于；把……用于；题献"),
    ("deduce", "v.", "推论，演绎出"),
    ("deduct", "v.", "扣除，减去"),
    ("fashion", "n./v.", "时尚；方式；制作，塑造"),
    ("fashionable", "adj.", "流行的，时髦的"),
    ("favour/favor", "n./v.", "赞同，恩惠；偏爱；支持，帮助"),
    ("favourable/favorable", "adj.", "有利的；赞成的；良好的"),
    ("favourite/favorite", "n./adj.", "最喜欢的人或物；最喜欢的"),
    ("sit", "v.", "坐；位于；适合"),
    ("site", "n./v.", "地点，场所；使位于"),
    ("situate", "v.", "使位于；使处于"),
    ("situation", "n.", "情况，形势；位置"),
    ("skeleton", "n.", "骨架；纲要；骨瘦如柴的人"),
    ("skeptical", "adj.", "怀疑的"),
    ("sketch", "n./v.", "草图，速写；概述；画草图"),
    ("embrace", "v./n.", "拥抱；欣然接受；包括；拥抱"),
    ("embed", "v.", "嵌入，埋置"),
    ("embody", "v.", "体现；包含；使具体化"),
    ("embryo", "n.", "胚胎；萌芽阶段的事物"),
    ("elicit", "v.", "引出，诱出"),
    ("elite", "n./adj.", "精英；精英的"),
    ("elsewhere", "adv.", "在别处，到别处"),
    ("thirst", "n./v.", "渴；渴望；渴求"),
    ("thorough", "adj.", "彻底的，全面的"),
    ("though", "conj./adv.", "虽然，尽管；可是，不过"),
    ("thought", "n.", "思想，想法；思考"),
    ("thoughtful", "adj.", "深思熟虑的；体贴的"),
    ("threat", "n.", "威胁，恐吓；构成威胁的人或物"),
    ("threaten", "v.", "威胁；预示凶兆；危及"),
    ("update", "v./n.", "更新；最新消息"),
    ("uphold", "v.", "支持，维护；维持"),
    ("upset", "v./adj./n.", "使心烦；打乱；心烦的；意外的失败"),
    ("up-to-date", "adj.", "最新的，现代的"),
    ("ventilate", "v.", "使通风；公开讨论"),
    ("venture", "v./n.", "冒险；敢于；风险项目"),
    ("widespread", "adj.", "广泛的，普遍的"),
    ("win", "v./n.", "赢得；获胜；胜利"),
    ("wit", "n.", "机智；才智"),
    ("withdraw", "v.", "撤回；退出；取款"),
    ("witness", "n./v.", "目击者；证人；目击；见证"),
    ("inaugurate", "v.", "为……举行就职典礼；开创，启动"),
    ("incentive", "n.", "激励，刺激，诱因"),
    ("incidence", "n.", "发生率；影响范围"),
    ("incident", "n.", "事件；adj. 附带的"),
    ("incidentally", "adv.", "顺便说一句；偶然地"),
    ("incline", "v./n.", "倾向于；使倾斜；斜坡"),
    ("academic", "adj./n.", "学术的；大学教师，学者"),
    ("academy", "n.", "学院；研究院"),
    ("accelerate", "v.", "加速，促进"),
    ("accept", "v.", "接受；承认；同意"),
    ("acceptance", "n.", "接受，认可"),
    ("access", "n./v.", "通道；使用权；接近；访问，进入"),
    ("accessory", "n./adj.", "附件，配件；从犯；附属的"),
    ("begin", "v.", "开始"),
    ("beginning", "n.", "开始，开端"),
    ("behalf", "n.", "代表；利益"),
    ("behave", "v.", "表现，举止；守规矩"),
    ("behaviour/behavior", "n.", "行为，举止"),
    ("belief", "n.", "信念；相信"),
    ("believe", "v.", "相信；认为"),
    ("belong", "v.", "属于；适合"),
    ("beneficial", "adj.", "有益的，有利的"),
    ("benefit", "n./v.", "利益，好处；受益；有益于"),
    ("benevolent", "adj.", "仁慈的，慈善的"),
    ("benign", "adj.", "良性的；和善的"),
    ("challenge", "n./v.", "挑战；质疑；向……挑战"),
    ("chance", "n./v.", "机会；偶然；冒险做"),
    ("change", "v./n.", "改变；变化；零钱"),
    ("channel", "n./v.", "渠道；频道；引导，输送"),
    ("character", "n.", "性格；人物；文字；特征"),
    ("characterise/characterize", "v.", "以……为特征；描述"),
    ("characteristic", "n./adj.", "特征，特点；典型的"),
    ("defend", "v.", "防御；为……辩护"),
    ("define", "v.", "定义，界定；说明"),
    ("definite", "adj.", "明确的，确定的"),
    ("definition", "n.", "定义；清晰度"),
    ("defy", "v.", "违抗，蔑视；经受住"),
    ("degree", "n.", "程度；学位；度数"),
    ("delay", "v./n.", "推迟，耽搁；延误"),
    ("deliberate", "adj./v.", "故意的；慎重的；仔细考虑"),
    ("delicate", "adj.", "精美的；脆弱的；微妙的"),
]


def register_fonts():
    font_path = Path(r"C:\Windows\Fonts\NotoSansSC-VF.ttf")
    if not font_path.exists():
        font_path = Path(r"C:\Windows\Fonts\msyh.ttc")
    pdfmetrics.registerFont(TTFont("CJK", str(font_path)))
    return "CJK"


def p(text, style):
    return Paragraph(text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), style)


def build_pdf():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    font = register_fonts()
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "TitleCJK",
        parent=styles["Title"],
        fontName=font,
        fontSize=20,
        leading=26,
        textColor=colors.HexColor("#183153"),
        spaceAfter=12,
    )
    h2 = ParagraphStyle(
        "H2CJK",
        parent=styles["Heading2"],
        fontName=font,
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#1f5f99"),
        spaceBefore=8,
        spaceAfter=5,
    )
    body = ParagraphStyle(
        "BodyCJK",
        parent=styles["BodyText"],
        fontName=font,
        fontSize=9.5,
        leading=14,
        spaceAfter=5,
    )
    en = ParagraphStyle(
        "English",
        parent=body,
        fontName=font,
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#111827"),
    )
    small = ParagraphStyle(
        "SmallCJK",
        parent=body,
        fontName=font,
        fontSize=8.2,
        leading=11,
    )

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        rightMargin=1.35 * cm,
        leftMargin=1.35 * cm,
        topMargin=1.25 * cm,
        bottomMargin=1.2 * cm,
        title="Day 02 - Unit 2 + Unit 3",
    )
    story = [
        Paragraph("Day 02 - Unit 2 + Unit 3", title),
        p("范围：从 Unit 2 的 casualty 继续，接 Unit 3 开头，共 100 个词。", body),
        p("方法：先通过句子混脸熟，再看每组下面的词性和释义。句子为原创整理。", body),
        Spacer(1, 6),
    ]

    for i, group in enumerate(GROUPS, 1):
        story.append(Paragraph(f"{i}. Sentence Group", h2))
        story.append(p(group["sentence"], en))
        story.append(p(group["translation"], body))
        data = [[p("Word", small), p("POS", small), p("Meaning", small)]]
        for word, pos, meaning in group["words"]:
            data.append([p(word, small), p(pos, small), p(meaning, small)])
        table = Table(data, colWidths=[4.1 * cm, 2.1 * cm, 10.4 * cm], repeatRows=1)
        table.setStyle(
            TableStyle(
                [
                    ("FONTNAME", (0, 0), (-1, -1), font),
                    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eaf3ff")),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#183153")),
                    ("GRID", (0, 0), (-1, -1), 0.3, colors.HexColor("#c7d2e0")),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                    ("TOPPADDING", (0, 0), (-1, -1), 3),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
                ]
            )
        )
        story.append(table)
        story.append(Spacer(1, 5))

    story.append(PageBreak())
    story.append(Paragraph("100 词清单", title))
    checklist = [[p("No.", small), p("Word", small), p("POS", small), p("Meaning", small)]]
    for idx, (word, pos, meaning) in enumerate(CHECKLIST, 1):
        checklist.append([p(str(idx), small), p(word, small), p(pos, small), p(meaning, small)])
    table = Table(checklist, colWidths=[1.0 * cm, 4.2 * cm, 2.1 * cm, 9.3 * cm], repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (-1, -1), font),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eaf3ff")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#d5dde8")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTSIZE", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 3),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 10))
    story.append(p("明天从 Unit 3 的 deliver 继续。", body))
    doc.build(story)


if __name__ == "__main__":
    assert len(CHECKLIST) == 100, len(CHECKLIST)
    build_pdf()
    print(OUT)
