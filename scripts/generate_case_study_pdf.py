import os
import shutil
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)

# Color Palette matching Formula Apex PDF style, accented in Dead Air Amber & Slate
NAVY_DARK = colors.HexColor("#0f172a")
SLATE_TEXT = colors.HexColor("#334155")
SLATE_MUTED = colors.HexColor("#64748b")
BORDER_GRAY = colors.HexColor("#cbd5e1")
BG_LIGHT = colors.HexColor("#f8fafc")
BG_HEADER = colors.HexColor("#f1f5f9")
AMBER_ACCENT = colors.HexColor("#d97706")
AMBER_DARK = colors.HexColor("#b45309")
EMERALD_ACCENT = colors.HexColor("#059669")
BLUE_ACCENT = colors.HexColor("#0284c7")
PURPLE_ACCENT = colors.HexColor("#7c3aed")
CODE_BG = colors.HexColor("#0f172a")
CODE_TEXT = colors.HexColor("#e2e8f0")
CONCLUSION_BG = colors.HexColor("#f0f9ff")
CONCLUSION_BORDER = colors.HexColor("#0284c7")


def build_styles():
    return {
        "eyebrow": ParagraphStyle(
            "eyebrow", fontName="Helvetica-Bold", fontSize=7.5,
            textColor=AMBER_DARK, leading=10
        ),
        "eyebrow_right": ParagraphStyle(
            "eyebrow_right", fontName="Helvetica-Bold", fontSize=7.5,
            textColor=SLATE_MUTED, leading=10, alignment=2
        ),
        "title": ParagraphStyle(
            "title", fontName="Helvetica-Bold", fontSize=18.5,
            textColor=NAVY_DARK, leading=22, spaceAfter=4
        ),
        "lead": ParagraphStyle(
            "lead", fontName="Helvetica", fontSize=8.8,
            textColor=SLATE_TEXT, leading=12.4, spaceAfter=7
        ),
        "h2": ParagraphStyle(
            "h2", fontName="Helvetica-Bold", fontSize=12,
            textColor=NAVY_DARK, leading=15, spaceBefore=5, spaceAfter=4
        ),
        "h3": ParagraphStyle(
            "h3", fontName="Helvetica-Bold", fontSize=9.5,
            textColor=NAVY_DARK, leading=13, spaceBefore=6, spaceAfter=4
        ),
        "meta_label": ParagraphStyle(
            "meta_label", fontName="Helvetica-Bold", fontSize=7.2,
            textColor=SLATE_MUTED, leading=10
        ),
        "meta_val": ParagraphStyle(
            "meta_val", fontName="Helvetica", fontSize=8.3,
            textColor=NAVY_DARK, leading=11.5
        ),
        "kpi_num": ParagraphStyle(
            "kpi_num", fontName="Helvetica-Bold", fontSize=16,
            textColor=AMBER_DARK, leading=20, alignment=1
        ),
        "kpi_label": ParagraphStyle(
            "kpi_label", fontName="Helvetica-Bold", fontSize=7,
            textColor=NAVY_DARK, leading=9.5, alignment=1
        ),
        "kpi_sub": ParagraphStyle(
            "kpi_sub", fontName="Helvetica", fontSize=6.8,
            textColor=SLATE_MUTED, leading=9, alignment=1
        ),
        "th": ParagraphStyle(
            "th", fontName="Helvetica-Bold", fontSize=7.5,
            textColor=colors.white, leading=10
        ),
        "td": ParagraphStyle(
            "td", fontName="Helvetica", fontSize=7.5,
            textColor=SLATE_TEXT, leading=10.2
        ),
        "td_bold": ParagraphStyle(
            "td_bold", fontName="Helvetica-Bold", fontSize=7.7,
            textColor=NAVY_DARK, leading=10.2
        ),
        "td_italic": ParagraphStyle(
            "td_italic", fontName="Helvetica-Oblique", fontSize=7.2,
            textColor=SLATE_MUTED, leading=9.6
        ),
        "td_impact": ParagraphStyle(
            "td_impact", fontName="Helvetica-Bold", fontSize=7.7,
            textColor=EMERALD_ACCENT, leading=10.2
        ),
        "pillar_title": ParagraphStyle(
            "pillar_title", fontName="Helvetica-Bold", fontSize=8.5,
            textColor=AMBER_DARK, leading=11.5, spaceAfter=3
        ),
        "pillar_body": ParagraphStyle(
            "pillar_body", fontName="Helvetica", fontSize=7.8,
            textColor=SLATE_TEXT, leading=11, spaceAfter=4
        ),
        "bullet": ParagraphStyle(
            "bullet", fontName="Helvetica", fontSize=7.4,
            textColor=SLATE_TEXT, leading=10.5, leftIndent=6
        ),
        "code": ParagraphStyle(
            "code", fontName="Courier", fontSize=7.1,
            textColor=CODE_TEXT, leading=10
        ),
        "code_light_box": ParagraphStyle(
            "code_light_box", fontName="Courier", fontSize=7.2,
            textColor=colors.HexColor("#f8fafc"), leading=10.2
        ),
        "bug_title": ParagraphStyle(
            "bug_title", fontName="Helvetica-Bold", fontSize=8.3,
            textColor=AMBER_DARK, leading=11, spaceAfter=2
        ),
        "conclusion": ParagraphStyle(
            "conclusion", fontName="Helvetica", fontSize=8.1,
            textColor=NAVY_DARK, leading=12
        ),
    }


def draw_header_footer(canvas, doc):
    canvas.saveState()
    w, h = letter
    page_num = doc.page

    # Top running header on pages 2-4
    if page_num > 1:
        canvas.setFont("Helvetica-Bold", 7.2)
        canvas.setFillColor(SLATE_MUTED)
        canvas.drawString(0.6 * inch, h - 0.42 * inch, "DEAD AIR — TECHNICAL ARCHITECTURE & SYSTEMS CASE STUDY")
        canvas.drawRightString(w - 0.6 * inch, h - 0.42 * inch, f"PAGE {page_num} OF 4")
        canvas.setStrokeColor(BORDER_GRAY)
        canvas.setLineWidth(0.5)
        canvas.line(0.6 * inch, h - 0.48 * inch, w - 0.6 * inch, h - 0.48 * inch)

    # Bottom footer on all pages
    canvas.setStrokeColor(BORDER_GRAY)
    canvas.setLineWidth(0.5)
    canvas.line(0.6 * inch, 0.55 * inch, w - 0.6 * inch, 0.55 * inch)
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(SLATE_MUTED)
    canvas.drawString(0.6 * inch, 0.38 * inch, "DEAD AIR: 1994 EMERGENCY SWITCHBOARD & FORENSIC AUDIO PLATFORM  |  LEAD SYSTEMS ARCHITECT")
    canvas.drawRightString(w - 0.6 * inch, 0.38 * inch, f"PORTFOLIO CASE STUDY  •  PAGE {page_num} OF 4")
    canvas.restoreState()


def generate_pdf(out_path: str):
    doc = SimpleDocTemplate(
        out_path,
        pagesize=letter,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
        topMargin=0.6 * inch,
        bottomMargin=0.68 * inch,
        title="Dead Air — Technical Architecture & Systems Case Study",
        author="Lead Systems Architect",
    )
    st = build_styles()
    story = []
    usable_w = letter[0] - 1.2 * inch  # 7.3 inches

    # ======================== PAGE 1 ========================
    top_strip = Table(
        [[
            Paragraph("DEAD AIR // SYSTEMS ARCHITECTURE CASE STUDY", st["eyebrow"]),
            Paragraph("PORTFOLIO CASE STUDY  |  STACK: REACT 18 • TS • ZUSTAND • WEB AUDIO • PWA", st["eyebrow_right"]),
        ]],
        colWidths=[usable_w * 0.42, usable_w * 0.58],
    )
    top_strip.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 2)]))
    story.append(top_strip)

    story.append(Paragraph("1994 Emergency Switchboard &amp; Cognitive Forensics Engine", st["title"]))
    story.append(Paragraph(
        "A browser-native psychological audio thriller engineered with <b>React 18, TypeScript, Zustand</b>, and a zero-dependency "
        "<b>Web Audio API DSP engine</b>. Designed around five empirical cognitive psychology principles—confirmation bias, false "
        "confidence calibration, working-memory load, source monitoring, and selective listening—across a 10-case anthology with a "
        "dual-deck A/B oscilloscope, rotary police scanner, and offline Progressive Web App installation.",
        st["lead"]
    ))

    # Meta Strip Table
    meta_data = [
        [
            Paragraph("PRIMARY ROLES", st["meta_label"]),
            Paragraph("TARGET PLATFORM", st["meta_label"]),
            Paragraph("CORE STACK", st["meta_label"]),
            Paragraph("FORENSIC SPECS", st["meta_label"]),
        ],
        [
            Paragraph("Lead Systems Architect<br/>Narrative &amp; Audio Systems<br/>Frontend Engineer", st["meta_val"]),
            Paragraph("Web (Offline PWA),<br/>Desktop, Tablet &amp; Mobile<br/>100dvh Responsive", st["meta_val"]),
            Paragraph("React 18, TypeScript 5.7,<br/>Zustand 5, Tailwind CSS,<br/>Web Audio API + Service Worker", st["meta_val"]),
            Paragraph("10 Interactive Cases<br/>3 Gameplay Protocols<br/>Dual-Deck A/B Comparator", st["meta_val"]),
        ],
    ]
    meta_table = Table(meta_data, colWidths=[usable_w * 0.23, usable_w * 0.23, usable_w * 0.29, usable_w * 0.25])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BG_HEADER),
        ("BACKGROUND", (0, 1), (-1, 1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("LINEBELOW", (0, 0), (-1, 0), 0.6, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 7))

    # 4 KPI Boxes
    kpi_data = [[
        [
            Paragraph("10 Cases", st["kpi_num"]),
            Paragraph("PSYCHOLOGICAL ANTHOLOGY", st["kpi_label"]),
            Paragraph("Branching dialogue trees &amp; multi-call triage", st["kpi_sub"]),
        ],
        [
            Paragraph("493 KB", st["kpi_num"]),
            Paragraph("APP CODE BUNDLE", st["kpi_label"]),
            Paragraph("~140 KB gzipped; zero external audio libs", st["kpi_sub"]),
        ],
        [
            Paragraph("90+ Clips", st["kpi_num"]),
            Paragraph("NEURAL VOICE + LIVE DSP", st["kpi_label"]),
            Paragraph("Procedural SFX + pre-generated MP3 &amp; TTS", st["kpi_sub"]),
        ],
        [
            Paragraph("5 Biases", st["kpi_num"]),
            Paragraph("EPISTEMIC ENGINE", st["kpi_label"]),
            Paragraph("Live debrief &amp; confidence calibration", st["kpi_sub"]),
        ],
    ]]
    kpi_table = Table(kpi_data, colWidths=[usable_w / 4.0] * 4)
    kpi_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BG_LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 7))

    # 01 / Engineering Challenges vs Architectural Solutions
    story.append(Paragraph("01 / Engineering Challenges vs. Architectural Solutions", st["h2"]))

    chal_data = [
        [
            Paragraph("THE CHALLENGE", st["th"]),
            Paragraph("ARCHITECTURAL SOLUTION", st["th"]),
            Paragraph("QUANTIFIABLE IMPACT", st["th"]),
        ],
        [
            [
                Paragraph("Overlapping Voice &amp; Hold Audio Bleed", st["td_bold"]),
                Paragraph("Placing a call on hold while TTS or MP3 playback ran triggered browser onerror/onend callbacks, causing held callers to talk over active lines.", st["td_italic"]),
            ],
            Paragraph("Engineered a monotonic <b>voiceSessionId fencing token</b> and centralized timer/element teardown inside <i>SoundEngine.stopVoice()</i>, paired with an active-call guard in Zustand.", st["td"]),
            [
                Paragraph("0 audio overlap bugs", st["td_impact"]),
                Paragraph("Instantaneous silence on hold/switch across Chrome, Edge, and Safari.", st["td"]),
            ],
        ],
        [
            [
                Paragraph("Manipulating Interpretation Without Unfair Puzzles", st["td_bold"]),
                Paragraph("Traditional detective games rely on scanning text for 'lie tokens' or hiding clues below audible volume thresholds.", st["td_italic"]),
            ],
            Paragraph("Built an <b>Epistemic Provenance &amp; A/B Carrier Correlation Engine</b> tagging dialogue nodes and scanner intercepts with shared <i>ambientSourceId</i> fingerprints and forensic reveals.", st["td"]),
            [
                Paragraph("5 cognitive pillars", st["td_impact"]),
                Paragraph("Players discover circular radio echoes and phonemic mishearings organically.", st["td"]),
            ],
        ],
        [
            [
                Paragraph("Multi-Mode Difficulty Without Content Duplication", st["td_bold"]),
                Paragraph("Maintaining 3 distinct difficulty modes (Story, Standard, Hardcore) across 10 branching cases risked duplicating dialogue trees.", st["td_italic"]),
            ],
            Paragraph("Bound <b>settings.gameMode</b> dynamically across all 4 console screens: regex-stripping hint prefixes, masking background sound labels, tightening RF lock tolerances, and scaling calibration deltas.", st["td"]),
            [
                Paragraph("100% single-source data", st["td_impact"]),
                Paragraph("3 genuinely distinct playstyles driven from one typed CaseDef schema.", st["td"]),
            ],
        ],
        [
            [
                Paragraph("Zero-Latency Telephony SFX &amp; Voice Fallback", st["td_bold"]),
                Paragraph("Bundling dozens of uncompressed WAV sound effects bloated network payloads and broke offline resilience.", st["td_italic"]),
            ],
            Paragraph("Constructed a <b>Procedural Web Audio API Synthesizer</b> generating 60Hz HVAC hum, DTMF ringers, relay clunks, and RF static in code, layered with neural MP3 reels and Web Speech TTS fallback.", st["td"]),
            [
                Paragraph("0 bundled SFX files", st["td_impact"]),
                Paragraph("Sub-millisecond hardware sound cues + full offline voice playback via PWA cache.", st["td"]),
            ],
        ],
        [
            [
                Paragraph("Complex CRT Console on Mobile Viewports", st["td_bold"]),
                Paragraph("A 4-screen dispatch desk with modals, vector map pins, and scrolling transcripts clipped under mobile Safari/Chrome URL bars.", st["td_italic"]),
            ],
            Paragraph("Adopted <b>100dvh dynamic viewports</b>, a 4-column phone mode bar, collision-free mobile map labels, and touch-scrollable split panes inside a standalone PWA shell.", st["td"]),
            [
                Paragraph("360px to 4K responsive", st["td_impact"]),
                Paragraph("Full standalone mobile &amp; desktop installation with zero horizontal overflow.", st["td"]),
            ],
        ],
    ]
    chal_table = Table(chal_data, colWidths=[usable_w * 0.30, usable_w * 0.44, usable_w * 0.26])
    chal_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY_DARK),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 5.5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5.5),
    ]))
    story.append(chal_table)

    # ======================== PAGE 2 ========================
    story.append(PageBreak())
    story.append(Paragraph("02 / System Architecture &amp; Core Modules", st["h2"]))
    story.append(Paragraph(
        "Dead Air pairs a reactive React 18 + Zustand single-source state store with an imperative procedural Web Audio DSP engine, "
        "four dedicated hardware terminal screens (F1–F4), and a data-driven TypeScript case anthology.",
        st["lead"]
    ))

    # 2x2 Pillar Grid
    pillar_data = [
        [
            [
                Paragraph("PILLAR 01: SWITCHBOARD &amp; MULTI-LINE TRIAGE [F1]", st["pillar_title"]),
                Paragraph("Handles live branching caller conversations, automatic hold-on-answer swapping, agitation timers, and clickable acoustic clue chips with instant two-way pin toggling.", st["pillar_body"]),
                Paragraph("• <b>Auto-Hold Swap:</b> Picking up Line 2 parks Line 1 cleanly", st["bullet"]),
                Paragraph("• <b>Past Logs Bar:</b> Re-open completed transcripts anytime", st["bullet"]),
                Paragraph("• <b>Chained Node Engine:</b> Auto-resolves terminal system logs", st["bullet"]),
            ],
            [
                Paragraph("PILLAR 02: VECTOR MAP &amp; CAD DISPATCH [F2]", st["pillar_title"]),
                Paragraph("Interactive 1994 USGS SVG county map covering all 10 cases with deployable spike-strip roadblocks, direct map dispatch, and timed field SITREP radio feedback.", st["pillar_body"]),
                Paragraph("• <b>Mode-Scaled Cooldowns:</b> 5m (Story) / 15m / 25m (Hardcore)", st["bullet"]),
                Paragraph("• <b>Case-Aware SITREPs:</b> Field units verify physical alibis", st["bullet"]),
                Paragraph("• <b>Collision-Free Mobile UI:</b> Adaptive marker pills on phones", st["bullet"]),
            ],
        ],
        [
            [
                Paragraph("PILLAR 03: EVIDENCE BOARD &amp; A/B AUDIO LAB [F3]", st["pillar_title"]),
                Paragraph("Consolidated 3-tab forensics deck: Evidence Board with click-to-cycle provenance badges, Dual-Deck Tektronix A/B Oscilloscope, and Suspect Dossiers + Scratchpad.", st["pillar_body"]),
                Paragraph("• <b>Provenance Stamps:</b> Firsthand / Hearsay Echo / Assumption", st["bullet"]),
                Paragraph("• <b>A/B Phase-Lock:</b> Exposes shared TV/radio broadcast bleed", st["bullet"]),
                Paragraph("• <b>Challenge Bias Audit:</b> Attach disconfirming counter-clues", st["bullet"]),
            ],
            [
                Paragraph("PILLAR 04: ROTARY SCANNER, AUDIO DSP &amp; PWA [F4]", st["pillar_title"]),
                Paragraph("4-channel Regency RF scanner (154.80 MHz Sheriff, 27.185 MHz CB, 162.55 NOAA, 462.57 Repeater) paired with procedural Web Audio synthesis and Service Worker offline caching.", st["pillar_body"]),
                Paragraph("• <b>Voice Session Fencing:</b> Zero cross-call audio overlap", st["bullet"]),
                Paragraph("• <b>Hardcore Rotary Lock:</b> Manual ±0.05 MHz fine-tuning", st["bullet"]),
                Paragraph("• <b>Offline PWA:</b> Cache-first MP3 reels + standalone install", st["bullet"]),
            ],
        ],
    ]
    pillar_table = Table(pillar_data, colWidths=[usable_w / 2.0] * 2)
    pillar_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BG_LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(pillar_table)
    story.append(Spacer(1, 10))

    # 5-step Execution Sequence
    story.append(Paragraph("Shift Investigation &amp; Epistemic Loop Sequence", st["h3"]))
    seq_data = [
        [
            Paragraph("1. Pre-Shift Setup", st["td_bold"]),
            Paragraph("2. Live Triage [F1]", st["td_bold"]),
            Paragraph("3. Forensics [F3/F4]", st["td_bold"]),
            Paragraph("4. Field Verify [F2]", st["td_bold"]),
            Paragraph("5. Form 911-B", st["td_bold"]),
        ],
        [
            Paragraph("Select Case 01–10 and protocol (Story / Standard / Hardcore) on the CRT Title Menu.", st["td"]),
            Paragraph("Answer calls, manage holds, avoid leading questions, and pin spoken &amp; acoustic clues.", st["td"]),
            Paragraph("Compare two tapes on the A/B Oscilloscope, audit radio echoes, and challenge initial bias.", st["td"]),
            Paragraph("Deploy cruisers, fire engines, or roadblocks to receive timed field radio SITREPs.", st["td"]),
            Paragraph("Submit suspect, cause, corroborating pins, and calibrated certainty (50%/75%/95%).", st["td"]),
        ],
    ]
    seq_table = Table(seq_data, colWidths=[usable_w / 5.0] * 5)
    seq_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BG_HEADER),
        ("BACKGROUND", (0, 1), (-1, 1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(seq_table)
    story.append(Spacer(1, 10))

    # Dark Subsystem Interaction Diagram
    story.append(Paragraph("Decoupled Console Subsystem Interaction", st["h3"]))
    arch_text = (
        "[React 18 CRT Shell (App.tsx)] → Title Menu, Mode Switcher [F1–F4], Modals, Keyboard Shortcuts<br/>"
        "&nbsp;&nbsp;↓ (Zustand Subscriptions + 15s localStorage Snapshot Persistence)<br/>"
        "[Central Shift Store (store.ts)] → 250ms Tick Loop ↔ [Call Queue, Hold Agitation, Power Surges]<br/>"
        "&nbsp;&nbsp;↓ (CaseDef Graph Resolution + Chained Node Traversal + Bias &amp; Provenance Tracking)<br/>"
        "[Forensic Analysis Layer] → Dual-Deck A/B Comparator (Canvas 2D) ↔ [Shared Carrier Detection]<br/>"
        "&nbsp;&nbsp;↓ (voiceSessionId Token + Active Call Guard)<br/>"
        "[SoundEngine (sound.ts)] → Procedural Web Audio DSP (Oscillators, Noise) + Neural MP3 / TTS<br/>"
        "&nbsp;&nbsp;↓ (Service Worker Cache-First Audio &amp; Network-First App Shell)<br/>"
        "[Offline PWA Runtime (sw.js + manifest.webmanifest)] ↔ Standalone Desktop &amp; Mobile Install"
    )
    arch_box = Table([[Paragraph(arch_text, st["code_light_box"])]], colWidths=[usable_w])
    arch_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
        ("BOX", (0, 0), (-1, -1), 0.8, NAVY_DARK),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(arch_box)

    # ======================== PAGE 3 ========================
    story.append(PageBreak())
    story.append(Paragraph("03 / Core Algorithms &amp; Psychological Systems Logic", st["h2"]))
    story.append(Paragraph(
        "Deterministic state machines, epistemic calibration formulas, and session-fenced audio pipelines guarantee consistent, "
        "fair investigative mechanics across all 10 cases and 3 gameplay modes.",
        st["lead"]
    ))

    def algo_cell(title_str, desc_str, code_str, impact_str):
        code_tbl = Table([[Paragraph(code_str, st["code"])]], colWidths=[usable_w * 0.46])
        code_tbl.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), CODE_BG),
            ("TOPPADDING", (0, 0), (-1, -1), 6),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ]))
        return [
            Paragraph(title_str, st["pillar_title"]),
            Paragraph(desc_str, st["pillar_body"]),
            code_tbl,
            Spacer(1, 5),
            Paragraph(f"<b>Impact:</b> {impact_str}", st["td"]),
        ]

    algo_grid = [
        [
            algo_cell(
                "1. EPISTEMIC CONFIDENCE CALIBRATION",
                "Scores verdict accuracy alongside stated certainty (50% / 75% / 95%), scaled dynamically by gameplay protocol:",
                "// Mode-aware epistemic calibration delta<br/>"
                "let calibrationDelta = 0;<br/>"
                "if (baseScore &gt;= 80) {<br/>"
                "&nbsp;&nbsp;if (conf === 95) calibrationDelta = mode==='hardcore' ? 10 : 5;<br/>"
                "&nbsp;&nbsp;else if (conf === 50 &amp;&amp; mode !== 'story') calibrationDelta = -5;<br/>"
                "} else {<br/>"
                "&nbsp;&nbsp;if (conf === 95) calibrationDelta =<br/>"
                "&nbsp;&nbsp;&nbsp;&nbsp;mode==='story' ? 0 : mode==='hardcore' ? -25 : -15;<br/>"
                "&nbsp;&nbsp;else if (conf === 50) calibrationDelta = 10;<br/>"
                "}",
                "Rewards careful reasoning over lucky guessing: reckless 95% overconfidence on a wrong theory incurs up to a −25 penalty."
            ),
            algo_cell(
                "2. DUAL-DECK A/B CARRIER CORRELATION",
                "Compares any two archived recordings on the Tektronix oscilloscope to detect circular reporting or acoustic anomalies:",
                "// Phase-locked broadcast bleed detection<br/>"
                "const sharedAmbientId = deckA.ambientSourceId &amp;&amp;<br/>"
                "&nbsp;&nbsp;deckA.ambientSourceId === deckB.ambientSourceId<br/>"
                "&nbsp;&nbsp;? deckA.ambientSourceId : undefined;<br/>"
                "if (sharedAmbientId) {<br/>"
                "&nbsp;&nbsp;renderPhaseLockedRedTrace(ctx);<br/>"
                "&nbsp;&nbsp;return { type: 'source_contamination', sharedAmbientId };<br/>"
                "}",
                "Visually locks Trace A and Trace B in phase when two witnesses heard the exact same radio/TV broadcast."
            ),
        ],
        [
            algo_cell(
                "3. MONOTONIC VOICE SESSION FENCING",
                "Eliminates overlapping speech when callers are placed on hold or switched mid-sentence:",
                "public stopVoice() {<br/>"
                "&nbsp;&nbsp;this.voiceSessionId++; // invalidates stale callbacks<br/>"
                "&nbsp;&nbsp;clearTimeout(this.activeSafetyTimer);<br/>"
                "&nbsp;&nbsp;if (this.currentVoiceAudio) {<br/>"
                "&nbsp;&nbsp;&nbsp;&nbsp;this.currentVoiceAudio.onended = null;<br/>"
                "&nbsp;&nbsp;&nbsp;&nbsp;this.currentVoiceAudio.pause();<br/>"
                "&nbsp;&nbsp;}<br/>"
                "&nbsp;&nbsp;window.speechSynthesis?.cancel();<br/>"
                "}",
                "Guarantees browser onerror/onend events from cancelled speech can never launch a held caller's reply over an active call."
            ),
            algo_cell(
                "4. BLIND WIRE MODE DIALOGUE GATING",
                "Adapts dialogue presentation across Story, Standard, and Hardcore protocols from a single CaseDef source:",
                "// Hardcore Blind Wire strips hints &amp; hides locked spoilers<br/>"
                "if (mode === 'hardcore' &amp;&amp; !unlocked) return null;<br/>"
                "const displayLabel = mode === 'hardcore'<br/>"
                "&nbsp;&nbsp;? option.label.replace(/⚠️\\s*/g, '')<br/>"
                "&nbsp;&nbsp;&nbsp;&nbsp;.replace(/^\\[[^\\]]+\\]\\s*/g, '').trim()<br/>"
                "&nbsp;&nbsp;: option.label;<br/>"
                "// Normalized hyphen-insensitive pin keyword match<br/>"
                "const words = req.replace(/-/g, ' ').split(/[\\s,]+/);",
                "Delivers zero-spoiler veteran deduction while preventing fragile punctuation mismatches on unlocked challenges."
            ),
        ],
    ]
    algo_table = Table(algo_grid, colWidths=[usable_w / 2.0] * 2)
    algo_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(algo_table)

    # ======================== PAGE 4 ========================
    story.append(PageBreak())
    story.append(Paragraph("04 / Full-Stack Specification &amp; Subsystem Matrix", st["h2"]))

    spec_data = [
        [
            Paragraph("LAYER", st["th"]),
            Paragraph("TECHNOLOGIES", st["th"]),
            Paragraph("RESPONSIBILITIES &amp; IMPLEMENTATION", st["th"]),
        ],
        [
            Paragraph("Presentation &amp; CRT UI", st["td_bold"]),
            Paragraph("React 18, TypeScript 5.7, Tailwind CSS 3, Inline SVGs", st["td"]),
            Paragraph("1994 CRT Title Menu, 4-screen terminal workstation (F1–F4), dynamic 100dvh mobile layout, 4-column phone mode bar, and 3-tab interactive Field Manual.", st["td"]),
        ],
        [
            Paragraph("State &amp; Simulation", st["td_bold"]),
            Paragraph("Zustand 5, LocalStorage Snapshot Persistence", st["td"]),
            Paragraph("250ms shift clock tick, multi-line hold/swap queue, mode-scaled hold agitation &amp; power surge breakers, unit dispatch cooldowns, and 5-pillar debrief scoring.", st["td"]),
        ],
        [
            Paragraph("Audio DSP &amp; Voices", st["td_bold"]),
            Paragraph("Web Audio API, Edge Neural TTS (MP3), Web Speech API", st["td"]),
            Paragraph("0 bundled SFX files (60Hz room tone, DTMF ringer, breaker trip/reset, RF squelch) + 90+ neural voice MP3 files with automatic TTS fallback and session fencing.", st["td"]),
        ],
        [
            Paragraph("Forensic Visualization", st["td_bold"]),
            Paragraph("HTML5 Canvas 2D, Vector SVG County Map", st["td"]),
            Paragraph("Dual-trace green/amber/red Tektronix oscilloscope with phase-locked carrier visualization + interactive 1994 USGS county map with direct dispatch &amp; roadblocks.", st["td"]),
        ],
        [
            Paragraph("Case Anthology Engine", st["td_bold"]),
            Paragraph("Strict TypeScript CaseDef Schema (Cases 01–10)", st["td"]),
            Paragraph("10 hand-authored cases spanning decoy thefts, zero-Doppler auditory illusions, circular radio echoes, and an Internal Affairs courthouse vault cover-up.", st["td"]),
        ],
        [
            Paragraph("Progressive Web App", st["td_bold"]),
            Paragraph("Service Worker (sw.js), Cache API, Web Manifest", st["td"]),
            Paragraph("Cache-first offline audio caching, network-first shell updates, standalone desktop/mobile installation, custom 192/512px CRT icons, and beforeinstallprompt UI.", st["td"]),
        ],
    ]
    spec_table = Table(spec_data, colWidths=[usable_w * 0.21, usable_w * 0.26, usable_w * 0.53])
    spec_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY_DARK),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(spec_table)
    story.append(Spacer(1, 10))

    # 05 / Engineering Resilience & Critical Bugs Solved
    story.append(Paragraph("05 / Engineering Resilience &amp; Critical Bugs Solved", st["h2"]))

    bugs_data = [
        [
            [
                Paragraph("Bug 1: Chained Terminal Nodes Blocking Case Completion", st["bug_title"]),
                Paragraph("<b>Symptom:</b> In Cases 3, 4, and 5, ending nodes using <i>next: 'node_complete'</i> with <i>audioCue: 'click'</i> never marked calls 'completed', preventing Form 911-B from triggering.", st["td"]),
                Paragraph("<b>Resolution:</b> Implemented a bounded chained-node traversal loop in <i>selectDialogueOption</i> that appends terminal system logs and marks any option-less node completed.", st["td"]),
            ],
            [
                Paragraph("Bug 2: Cross-Call Voice Overlap on Hold / Answer", st["bug_title"]),
                Paragraph("<b>Symptom:</b> Putting a call on hold while Operator 7 spoke caused Chrome's cancelled speech <i>onerror</i> handler to fire the held caller's MP3 right over the new active call.", st["td"]),
                Paragraph("<b>Resolution:</b> Introduced a monotonic <i>voiceSessionId</i> fence in <i>SoundEngine</i> and an active-call guard so stale callbacks are discarded immediately on hold or swap.", st["td"]),
            ],
        ],
        [
            [
                Paragraph("Bug 3: Orphaned Active Call on Multi-Line Switch", st["bug_title"]),
                Paragraph("<b>Symptom:</b> Answering an incoming call on Line 2 while Line 1 was active overwrote <i>activeCallId</i> without setting Line 1 to <i>on_hold</i>, stranding the previous caller.", st["td"]),
                Paragraph("<b>Resolution:</b> Updated <i>answerCall</i> and <i>resumeCall</i> to atomically park any active unfinished call on hold and added instant <i>[SWITCH BACK]</i> and <i>PAST LOGS</i> pills.", st["td"]),
            ],
            [
                Paragraph("Bug 4: Premature Verdict Modal Blocking Final A/B Audit", st["bug_title"]),
                Paragraph("<b>Symptom:</b> Completing the 3rd call immediately locked the viewport behind Form 911-B with no dismiss button, preventing players from comparing Call 3 in the A/B Oscilloscope.", st["td"]),
                Paragraph("<b>Resolution:</b> Added a one-shot auto-open flag, an <i>[← INSPECT EVIDENCE &amp; A/B AUDIO FIRST]</i> dismiss action, and a persistent <i>[📋 FILE VERDICT]</i> button in the header.", st["td"]),
            ],
        ],
    ]
    bugs_table = Table(bugs_data, colWidths=[usable_w / 2.0] * 2)
    bugs_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), BG_LIGHT),
        ("BOX", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("INNERGRID", (0, 0), (-1, -1), 0.6, BORDER_GRAY),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.append(bugs_table)
    story.append(Spacer(1, 10))

    # Conclusion Box
    conc_text = (
        "<b>CONCLUSION &amp; SYSTEM VERIFICATION:</b> Dead Air demonstrates that deep psychological mystery mechanics—"
        "confirmation bias auditing, circular radio echo detection, dual-deck A/B waveform forensics, and epistemic confidence "
        "calibration—can be delivered inside a lean, zero-plugin React 18 + TypeScript Progressive Web App. Strict type safety, "
        "session-fenced Web Audio synthesis, 3 dynamic gameplay protocols, and offline Service Worker caching verify seamless "
        "performance across all 10 cases on desktop and mobile devices."
    )
    conc_table = Table([[Paragraph(conc_text, st["conclusion"])]], colWidths=[usable_w])
    conc_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CONCLUSION_BG),
        ("BOX", (0, 0), (-1, -1), 0.9, CONCLUSION_BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(conc_table)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    doc.build(story, onFirstPage=draw_header_footer, onLaterPages=draw_header_footer)
    print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")


if __name__ == "__main__":
    landing_pdf = os.path.join("landing-page", "Dead_Air_Case_Study.pdf")
    root_pdf = "Dead_Air_Case_Study.pdf"
    generate_pdf(landing_pdf)
    shutil.copyfile(landing_pdf, root_pdf)
    print(f"Copied to {root_pdf}")
