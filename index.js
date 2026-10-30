
กำลังโหลดข้อความก่อนหน้า…
ตั้งค่าให้มันยืดหยุ่นเองไม่ได้เหรอ
ได้สิ และจริง ๆ ควรตั้งให้ยืดหยุ่นตั้งแต่แรกด้วย ไม่ควรกำหนดความสูงตายตัวให้มือถือแต่ละรุ่น

ปรับให้ Modal ทำงานแบบนี้ได้เลย:

ปรับความสูงอัตโนมัติ ตามปริมาณเนื้อหา แต่ไม่เกินพื้นที่หน้าจอ

จัดกึ่งกลางหน้าจอ ทั้งแนวตั้งและแนวนอน

ถ้าเนื้อหาสั้น กล่องจะหดตามเนื้อหา ไม่เหลือพื้นที่ว่างมาก

ถ้าเนื้อหายาว กล่องจะขยายจนถึงขีดจำกัด แล้วเลื่อนดูเนื้อหาภายในได้

ส่วนหัวและปุ่มปิดยังอยู่ในตำแหน่งเดิม ไม่เลื่อนหายไป

รองรับทั้งมือถือแนวตั้ง แนวนอน และคอมพิวเตอร์

หลัก ๆ ใช้ height: auto, max-height: calc(100dvh - ...), min-height: 0 และกำหนด overflow-y: auto ให้เฉพาะส่วนเนื้อหา

ไม่จำเป็นต้องแยก CSS มือถือกับคอมให้มีขนาดกล่องคนละแบบ ใช้ระบบเดียวให้ปรับตามพื้นที่หน้าจอได้เลย

อืมเอามาไฟล์ล่าสุดที่นายแก้ไง

It seems like I can’t do more advanced data analysis right now. Please try again later.

ตอนนี้ฉันเรียกเครื่องมือสร้างไฟล์ให้ไม่ได้ จึงยังส่งไฟล์ดาวน์โหลด index.js และ style.css ที่แก้แล้วให้ไม่ได้ ขอไม่ส่งโค้ดที่ยังไม่ได้ตรวจสอบแทนไฟล์จริงนะ


ข้อความที่วาง (1)(9).txt
เอกสาร

It seems like I can’t do more advanced data analysis right now. Please try again later.

ได้รับไฟล์ index.js ล่าสุดแล้ว แต่เครื่องมือสร้างไฟล์ยังเรียกใช้งานไม่ได้ จึงยังส่งไฟล์ที่แก้แล้วให้ดาวน์โหลดไม่ได้

ฉันจะยึดไฟล์นี้เป็นต้นฉบับ และแก้ให้ Modal ปรับขนาดตามเนื้อหาและพื้นที่หน้าจออัตโนมัติ โดยไม่เปลี่ยนระบบสุ่มหรือการทำงานส่วนอื่นของ Extension

อ่านแล้วพิมแก้มาสิ
แก้จาก index.js ล่าสุดที่ส่งมาแล้ว โดยคงระบบสุ่มสถานการณ์, Parser, Copy, ปุ่มปิด และการทำงานเดิมไว้

ไฟล์ที่แก้แล้ว

ดาวน์โหลด index.js

ดาวน์โหลด style.css

สิ่งที่ปรับ

กล่อง Modal ขยายตามปริมาณเนื้อหาโดยอัตโนมัติ

ไม่บังคับความสูงตายตัว

จำกัดขนาดตามพื้นที่หน้าจอจริง รวมถึง Safe Area ของมือถือ

ถ้าเนื้อหายาวเกินหน้าจอ จะเลื่อนเฉพาะส่วนรายการสถานการณ์

หัวข้อ ปุ่มปิด และปุ่มสุ่มใหม่ยังอยู่กับที่

รองรับจอเล็กและแนวนอน

นำไปแทนไฟล์เดิมทั้งสองไฟล์แล้วรีเฟรช SillyTavern ได้เลย


index.js
โค้ด

style.css
โค้ด
index.js เปิดไม่ได้
ลองโหลดจากลิงก์สำรองนี้แทน ไฟล์มีเนื้อหาเดียวกับ index.js ที่แก้แล้ว

ดาวน์โหลด index-fixed.js

ดาวน์โหลด index.txt

ถ้าโหลดเป็น .txt ให้เปลี่ยนชื่อไฟล์เป็น index.js ก่อนนำไปแทนไฟล์เดิมนะ ส่วน style.css ใช้ไฟล์เดิมได้เลย: ดาวน์โหลด style.css


index-fixed.js
โค้ด

index.txt
เอกสาร

style.css
โค้ด
คุณกำลังใช้ ChatGPT เวอร์ชันฟรี เปลี่ยนแพ็กเกจเพื่อใช้โมเดลขั้นสูง พร้อมหน่วยความจำที่ดีขึ้นและการสร้างรูปภาพที่มีคุณภาพสูงขึ้น




const EXTENSION_ID = 'rp-situation-generator';
const BUTTON_ID = 'rpsg-generate-button';
const PANEL_ID = 'rpsg-panel';
const BACKDROP_ID = 'rpsg-backdrop';

const GENERATOR_PROMPT = `
You are a roleplay situation-suggestion assistant. Read the CURRENT conversation context, including the latest scene, established lore, characters present, relationships, location, time, and unresolved events.

Generate exactly THREE distinct, concise suggestions for what could naturally happen next.

Rules:
- Base every suggestion on the actual current roleplay context. Do not invent established facts or contradict the lore.
- Create fresh situations by combining details from the current story; do not use a fixed list of generic events.
- Make the three options meaningfully different in direction and tone.
- Suggestions may be everyday developments, character interactions, discoveries, complications, opportunities, or unexpected events, depending on what fits the current scene.
- Keep each suggestion short: 1–3 sentences.
- Do not continue or write the roleplay scene itself.
- Never write, decide, or assume the user's dialogue, actions, thoughts, feelings, reactions, or choices.
- Do not force romance, conflict, danger, intimacy, or dramatic twists.
- Do not repeat events that have already happened.
- Output ONLY valid JSON in this exact structure:
{
  "situations": [
    {"title": "Short Thai title", "text": "Short Thai situation suggestion"},
    {"title": "Short Thai title", "text": "Short Thai situation suggestion"},
    {"title": "Short Thai title", "text": "Short Thai situation suggestion"}
  ]
}
Write the titles and suggestions in Thai unless the roleplay context clearly requires another language.
`;

function notify(message, type = 'info') {
    if (window.toastr?.[type]) {
        window.toastr[type](message, 'RP Situation Generator');
    } else {
        console.log(`[RP Situation Generator] ${message}`);
    }
}

function getContext() {
    return window.SillyTavern?.getContext?.();
}

function ensureButton() {
    if (document.getElementById(BUTTON_ID)) return true;

    const sendForm = document.querySelector('#send_form');
    if (!sendForm) return false;

    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.className = 'menu_button rpsg-button';
    button.innerHTML = '<i class="fa-solid fa-dice"></i><span>สุ่มสถานการณ์ ×3</span>';
    button.title = 'สร้างสถานการณ์ต่อจากบริบท RP ปัจจุบัน';
    button.addEventListener('click', generateSituations);

    const sendButton = sendForm.querySelector('#send_but');

    if (sendButton?.parentElement) {
        sendButton.parentElement.insertBefore(button, sendButton);
    } else {
        sendForm.appendChild(button);
    }

    return true;
}

function closePanel() {
    const panel = document.getElementById(PANEL_ID);
    const backdrop = document.getElementById(BACKDROP_ID);

    panel?.classList.remove('is-open');
    backdrop?.classList.remove('is-open');
    document.body.classList.remove('rpsg-modal-open');
}

function openPanel(panel = createPanel()) {
    const backdrop = document.getElementById(BACKDROP_ID);

    backdrop?.classList.add('is-open');
    panel.classList.add('is-open');
    document.body.classList.add('rpsg-modal-open');
}

function createPanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    let backdrop = document.getElementById(BACKDROP_ID);

    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = BACKDROP_ID;
        backdrop.className = 'rpsg-backdrop';

        backdrop.addEventListener('click', closePanel);
        document.body.appendChild(backdrop);
    }

    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.className = 'rpsg-panel';

    panel.innerHTML = `
        <div class="rpsg-panel-head">
            <div>
                <div class="rpsg-eyebrow">ROLEPLAY TOOL</div>
                <div class="rpsg-heading">Situation Generator</div>
            </div>
            <button type="button" class="rpsg-close" aria-label="Close" title="ปิดหน้าต่าง">×</button>
        </div>

        <div class="rpsg-status">กดปุ่มเพื่อสร้างสถานการณ์จากฉากปัจจุบัน</div>

        <div class="rpsg-results"></div>

        <div class="rpsg-panel-foot">
            <span>สร้างจากบริบทแชตล่าสุด · ไม่ส่งข้อความเข้าแชต</span>
            <button type="button" class="rpsg-again">สุ่มใหม่</button>
        </div>
    `;

    document.body.appendChild(panel);

    panel.querySelector('.rpsg-close').addEventListener('click', closePanel);
    panel.querySelector('.rpsg-again').addEventListener('click', generateSituations);

    return panel;
}

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closePanel();
    }
});

function setLoading(isLoading) {
    const button = document.getElementById(BUTTON_ID);
    const panel = createPanel();
    const status = panel.querySelector('.rpsg-status');
    const again = panel.querySelector('.rpsg-again');

    if (button) {
        button.disabled = isLoading;
        button.classList.toggle('is-loading', isLoading);
    }

    again.disabled = isLoading;

    status.textContent = isLoading
        ? 'กำลังอ่านบริบทและสร้างสถานการณ์ 3 แบบ…'
        : 'เลือกสถานการณ์ที่สนใจ แล้วกด Copy เพื่อนำไปวางในแชต';
}

function extractResponseText(raw) {
    if (typeof raw === 'string') return raw.trim();
    if (raw == null) return '';

    if (typeof raw === 'object') {
        for (const key of ['text', 'content', 'response', 'result', 'output', 'message']) {
            if (typeof raw[key] === 'string' && raw[key].trim()) {
                return raw[key].trim();
            }
        }

        if (Array.isArray(raw)) {
            return raw.map(part =>
                typeof part === 'string'
                    ? part
                    : (part?.text || part?.content || '')
            ).filter(Boolean).join('\n').trim();
        }
    }

    return String(raw).trim();
}

function findJsonObject(source) {
    const first = source.indexOf('{');
    if (first < 0) return null;

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = first; i < source.length; i++) {
        const ch = source[i];

        if (inString) {
            if (escaped) escaped = false;
            else if (ch === '\\') escaped = true;
            else if (ch === '"') inString = false;
            continue;
        }

        if (ch === '"') inString = true;
        else if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) {
            return source.slice(first, i + 1);
        }
    }

    return null;
}

function normalizeSituationItems(value) {
    if (!Array.isArray(value)) return [];

    return value.map((item, index) => {
        if (typeof item === 'string') {
            return {
                title: `สถานการณ์ ${index + 1}`,
                text: item.trim()
            };
        }

        if (!item || typeof item !== 'object') return null;

        const title = item.title ?? item.name ?? item.heading ?? `สถานการณ์ ${index + 1}`;
        const text = item.text ?? item.description ?? item.situation ?? item.content ?? item.prompt ?? '';

        return {
            title: String(title),
            text: String(text).trim()
        };
    }).filter(item => item && item.text).slice(0, 3);
}

function parseResult(raw) {
    const response = extractResponseText(raw)
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

    if (!response) {
        throw new Error('AI ส่งคำตอบกลับมาเป็นค่าว่าง ลองกดสุ่มใหม่อีกครั้ง');
    }

    const candidates = [response, findJsonObject(response)].filter(Boolean);

    for (const candidate of candidates) {
        try {
            const parsed = JSON.parse(candidate);

            const list = Array.isArray(parsed)
                ? parsed
                : (parsed.situations ?? parsed.suggestions ?? parsed.options ?? parsed.items);

            const items = normalizeSituationItems(list);

            if (items.length === 3) return items;
        } catch (_) {
            // Try the next representation.
        }
    }

    const numbered = response.match(/(?:^|\n)\s*(?:[1-3][.)、]|ตัวเลือก\s*[1-3][:)：.-])\s*([\s\S]*?)(?=(?:\n\s*(?:[1-3][.)、]|ตัวเลือก\s*[1-3][:)：.-]))|$)/g);

    if (numbered?.length === 3) {
        const items = numbered.map((part, index) => ({
            title: `สถานการณ์ ${index + 1}`,
            text: part.replace(/^\s*(?:[1-3][.)、]|ตัวเลือก\s*[1-3][:)：.-])\s*/, '').trim()
        })).filter(item => item.text);

        if (items.length === 3) return items;
    }

    console.warn('[RP Situation Generator] Unparsed AI response:', response);
    throw new Error('AI สร้างคำตอบแล้ว แต่รูปแบบไม่ตรงที่ระบบอ่านได้ กรุณากดสุ่มใหม่อีกครั้ง');
}

function renderSituations(items) {
    const panel = createPanel();
    const results = panel.querySelector('.rpsg-results');

    results.replaceChildren();

    items.forEach((item, index) => {
        const title = String(item.title || `สถานการณ์ ${index + 1}`);
        const text = String(item.text || item.description || '').trim();

        if (!text) return;

        const card = document.createElement('article');
        card.className = 'rpsg-card';

        const top = document.createElement('div');
        top.className = 'rpsg-card-top';

        const number = document.createElement('span');
        number.className = 'rpsg-number';
        number.textContent = String(index + 1).padStart(2, '0');

        const heading = document.createElement('strong');
        heading.className = 'rpsg-card-title';
        heading.textContent = title;

        top.append(number, heading);

        const description = document.createElement('p');
        description.className = 'rpsg-card-text';
        description.textContent = text;

        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'rpsg-copy';
        copy.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';

        copy.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(text);
                copy.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
                notify('คัดลอกสถานการณ์แล้ว', 'success');

                setTimeout(() => {
                    copy.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                }, 1300);
            } catch (error) {
                const area = document.createElement('textarea');
                area.value = text;
                document.body.appendChild(area);
                area.select();
                document.execCommand('copy');
                area.remove();

                copy.textContent = 'Copied';

                setTimeout(() => {
                    copy.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
                }, 1300);
            }
        });

        card.append(top, description, copy);
        results.appendChild(card);
    });

    if (!results.children.length) {
        throw new Error('ไม่พบสถานการณ์ในผลลัพธ์จาก AI');
    }

    panel.querySelector('.rpsg-status').textContent =
        'เลือกสถานการณ์ที่สนใจ แล้วกด Copy เพื่อนำไปวางในแชต';

    openPanel(panel);
    results.scrollTop = 0;
}

async function generateSituations() {
    const context = getContext();

    if (!context) {
        notify('ยังเชื่อมต่อกับ SillyTavern ไม่ได้ กรุณารีเฟรชหน้าแชต', 'error');
        return;
    }

    if (!Array.isArray(context.chat) || context.chat.length === 0) {
        notify('ยังไม่มีประวัติแชตให้ใช้อ้างอิง', 'warning');
        return;
    }

    if (typeof context.generateQuietPrompt !== 'function') {
        notify('SillyTavern รุ่นนี้ไม่พบ generateQuietPrompt กรุณาอัปเดต SillyTavern', 'error');
        return;
    }

    const panel = createPanel();

    openPanel(panel);
    panel.querySelector('.rpsg-results').replaceChildren();

    setLoading(true);

    try {
        const raw = await context.generateQuietPrompt({
            quietPrompt: GENERATOR_PROMPT
        });

        console.debug('[RP Situation Generator] Quiet generation returned:', typeof raw, raw);

        const situations = parseResult(raw);

        if (situations.length !== 3) {
            throw new Error(`AI สร้างมา ${situations.length} รายการ ต้องการ 3 รายการพอดี ลองกดสุ่มใหม่`);
        }

        renderSituations(situations);
    } catch (error) {
        console.error('[RP Situation Generator]', error);

        panel.querySelector('.rpsg-status').textContent =
            error?.message || 'เกิดข้อผิดพลาดระหว่างสร้างสถานการณ์';

        notify(error?.message || 'สร้างสถานการณ์ไม่สำเร็จ', 'error');
    } finally {
        setLoading(false);
    }
}

function initialize() {
    if (ensureButton()) return;

    const observer = new MutationObserver(() => {
        if (ensureButton()) observer.disconnect();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => observer.disconnect(), 30000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}

const ctx = getContext();

if (ctx?.eventSource && ctx?.event_types?.APP_READY) {
    ctx.eventSource.on(ctx.event_types.APP_READY, initialize);
}
