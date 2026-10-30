const EXTENSION_ID = 'rp-situation-generator';
const BUTTON_ID = 'rpsg-generate-button';
const PANEL_ID = 'rpsg-panel';

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

    // Insert near the send controls without replacing any existing controls.
    const sendButton = sendForm.querySelector('#send_but');
    if (sendButton?.parentElement) {
        sendButton.parentElement.insertBefore(button, sendButton);
    } else {
        sendForm.appendChild(button);
    }
    return true;
}

function createPanel() {
    let panel = document.getElementById(PANEL_ID);
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.className = 'rpsg-panel';
    panel.innerHTML = `
      <div class="rpsg-panel-head">
        <div>
          <div class="rpsg-eyebrow">ROLEPLAY TOOL</div>
          <div class="rpsg-heading">Situation Generator</div>
        </div>
        <button type="button" class="rpsg-close" aria-label="Close">×</button>
      </div>
      <div class="rpsg-status">กดปุ่มเพื่อสร้างสถานการณ์จากฉากปัจจุบัน</div>
      <div class="rpsg-results"></div>
      <div class="rpsg-panel-foot">
        <span>สร้างจากบริบทแชตล่าสุด · ไม่ส่งข้อความเข้าแชต</span>
        <button type="button" class="rpsg-again">สุ่มใหม่</button>
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelector('.rpsg-close').addEventListener('click', () => panel.classList.remove('is-open'));
    panel.querySelector('.rpsg-again').addEventListener('click', generateSituations);
    return panel;
}

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

function parseResult(raw) {
    if (typeof raw !== 'string') raw = String(raw ?? '');
    const cleaned = raw
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

    try {
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed.situations)) {
            return parsed.situations.slice(0, 3);
        }
    } catch (_) {
        // Try to recover JSON embedded in surrounding text.
        const match = cleaned.match(/\{[\s\S]*"situations"[\s\S]*\}/);
        if (match) {
            try {
                const parsed = JSON.parse(match[0]);
                if (Array.isArray(parsed.situations)) return parsed.situations.slice(0, 3);
            } catch (_) {}
        }
    }

    throw new Error('AI ไม่ได้ส่งผลลัพธ์ตามรูปแบบที่ต้องการ ลองกดสุ่มใหม่อีกครั้ง');
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
            const content = text;
            try {
                await navigator.clipboard.writeText(content);
                copy.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
                notify('คัดลอกสถานการณ์แล้ว', 'success');
                setTimeout(() => { copy.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 1300);
            } catch (error) {
                const area = document.createElement('textarea');
                area.value = content;
                document.body.appendChild(area);
                area.select();
                document.execCommand('copy');
                area.remove();
                copy.textContent = 'Copied';
                setTimeout(() => { copy.innerHTML = '<i class="fa-regular fa-copy"></i> Copy'; }, 1300);
            }
        });

        card.append(top, description, copy);
        results.appendChild(card);
    });

    if (!results.children.length) {
        throw new Error('ไม่พบสถานการณ์ในผลลัพธ์จาก AI');
    }
    panel.querySelector('.rpsg-status').textContent = 'เลือกสถานการณ์ที่สนใจ แล้วกด Copy เพื่อนำไปวางในแชต';
    panel.classList.add('is-open');
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
    panel.classList.add('is-open');
    panel.querySelector('.rpsg-results').replaceChildren();
    setLoading(true);

    try {
        const raw = await context.generateQuietPrompt({
            quietPrompt: GENERATOR_PROMPT,
        });
        const situations = parseResult(raw);
        if (situations.length !== 3) {
            throw new Error(`AI สร้างมา ${situations.length} รายการ ต้องการ 3 รายการพอดี ลองกดสุ่มใหม่`);
        }
        renderSituations(situations);
    } catch (error) {
        console.error('[RP Situation Generator]', error);
        panel.querySelector('.rpsg-status').textContent = error?.message || 'เกิดข้อผิดพลาดระหว่างสร้างสถานการณ์';
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
    observer.observe(document.body, { childList: true, subtree: true });

    // Safety stop in case the expected chat composer is not present.
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
