var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  MedicalComparisonPlugin: () => MedicalComparisonPlugin,
  default: () => main_default
});
module.exports = __toCommonJS(main_exports);
var import_obsidian17 = require("obsidian");

// src/types.ts
var PASTEL_PALETTE = [
  "#d6e9c9",
  "#cfeae6",
  "#d2e8ef",
  "#d4def5",
  "#e4dcf5",
  "#f3d7de",
  "#f7e0d2",
  "#f7edd2"
];
var DEFAULT_CONDITIONS_TEMPLATE = {
  id: "conditions",
  name: "Conditions",
  folder: "Conditions",
  properties: ["Speciality", "Presenting Complaint"],
  headings: [
    { id: "def", text: "Definition", level: 2 },
    { id: "bg", text: "Background", level: 2 },
    { id: "bg-epi", text: "Epidemiology", level: 3 },
    { id: "bg-aet", text: "Aetiology", level: 3 },
    { id: "bg-path", text: "Pathophysiology", level: 3 },
    { id: "rf", text: "Risk Factors", level: 2 },
    { id: "pres", text: "Presentation", level: 2 },
    { id: "pres-sx", text: "Signs and Symptoms", level: 3 },
    { id: "pres-exam", text: "Examination", level: 3 },
    { id: "ddx", text: "Differential Diagnoses", level: 2 },
    { id: "ix", text: "Investigations", level: 2 },
    { id: "ix-bed", text: "Bedside", level: 3 },
    { id: "ix-bl", text: "Bloods", level: 3 },
    { id: "ix-img", text: "Imaging", level: 3 },
    { id: "ix-spec", text: "Special Tests", level: 3 },
    { id: "class", text: "Classification", level: 2 },
    { id: "mx", text: "Management", level: 2 },
    { id: "mx-init", text: "Initial Treatment", level: 3 },
    { id: "mx-maint", text: "Maintenance", level: 3 },
    { id: "mx-prev", text: "Prevention", level: 3 },
    { id: "comp", text: "Complications", level: 2 },
    { id: "fu", text: "Follow Up", level: 2 },
    { id: "fu-couns", text: "Counselling", level: 3 },
    { id: "fu-mon", text: "Monitoring", level: 3 },
    { id: "prog", text: "Prognosis", level: 2 },
    { id: "an", text: "Additional Notes", level: 2 },
    { id: "rflags", text: "Red Flags", level: 2 },
    { id: "res", text: "Resources", level: 2 }
  ]
};
var DEFAULT_DRUGS_TEMPLATE = {
  id: "drugs",
  name: "Drugs",
  folder: "Drugs",
  properties: ["Speciality", "Presenting Complaint"],
  headings: [
    { id: "drug-a", text: "Action", level: 2 },
    { id: "drug-t1", text: "Timeline", level: 2 },
    { id: "drug-h", text: "How to take", level: 2 },
    { id: "drug-l", text: "Length of treatment", level: 2 },
    { id: "drug-e", text: "Effects", level: 2 },
    { id: "drug-t2", text: "Tests", level: 2 },
    { id: "drug-i", text: "Important side effects", level: 2 },
    { id: "drug-c", text: "Complications and contraindications", level: 2 },
    { id: "drug-s", text: "Supplementary advice", level: 2 },
    { id: "drug-an", text: "Additional Notes", level: 2 },
    { id: "drug-res", text: "Resources", level: 2 }
  ]
};
var DEFAULT_TEMPLATES = [
  DEFAULT_CONDITIONS_TEMPLATE,
  DEFAULT_DRUGS_TEMPLATE
];
var DEFAULT_PROPERTIES = [
  { id: "prop-spec", name: "Speciality", color: "#dfe8f2" },
  { id: "prop-pc", name: "Presenting Complaint", color: "#f2e0e4" }
];
var DEFAULT_SETTINGS = {
  conditionsFolder: "Conditions",
  redFlagSymbol: "\u{1F6A9}",
  redFlagActiveColor: "#8b0000",
  defaultZoom: 1,
  savedViews: [],
  templates: DEFAULT_TEMPLATES,
  properties: DEFAULT_PROPERTIES,
  redFlagSweepEnabled: true,
  redFlagSweepIntervalMs: 2500,
  hiddenToolbarButtons: [],
  toolbarButtonLabels: {},
  compactToolbar: false,
  scrollZoom: true,
  toolbarMode: "floating",
  dockOffsetTop: 40
};

// src/settings/settings.ts
var import_obsidian15 = require("obsidian");

// src/views/comparisonView.ts
var import_obsidian9 = require("obsidian");

// src/parser/conditionParser.ts
function parseCondition(file, fileContent, metadataCache, properties) {
  var _a;
  const id = file.path;
  const name = file.basename;
  const cache = metadataCache.getFileCache(file);
  const frontmatter = (_a = cache == null ? void 0 : cache.frontmatter) != null ? _a : {};
  const meta = {};
  for (const prop of properties) {
    const val = frontmatter[prop.name];
    if (val === void 0 || val === null) {
      meta[prop.name] = [];
    } else if (Array.isArray(val)) {
      meta[prop.name] = val.map((v) => String(v));
    } else {
      meta[prop.name] = [String(val)];
    }
  }
  const body = stripFrontmatter(fileContent);
  const sections = parseSections(body);
  const content = {};
  let differentials = [];
  let additionalNotes = "";
  for (const section of sections) {
    if (section.key === "Differential Diagnoses") {
      differentials = parseDifferentials(section.body);
    } else if (section.key === "Additional Notes") {
      additionalNotes = section.body.trim();
    } else if (section.key === "Red Flags") {
      continue;
    } else {
      content[section.key] = parseCellContent(section.body);
    }
  }
  restructureOverview(content);
  return {
    id,
    name,
    path: file.path,
    meta,
    content,
    differentials,
    additionalNotes
  };
}
function stripFrontmatter(text) {
  if (text.startsWith("---")) {
    const end = text.indexOf("---", 3);
    if (end !== -1) {
      return text.slice(end + 3).trim();
    }
  }
  return text;
}
function parseSections(body) {
  const lines = body.split("\n");
  const sections = [];
  let currentRoot = "";
  let currentChild = "";
  let currentBody = [];
  const saveSection = () => {
    if (currentRoot && currentBody.join("").trim().length > 0) {
      const key = currentChild ? currentRoot + "/" + currentChild : currentRoot;
      sections.push({ key, body: currentBody.join("\n") });
    }
    currentBody = [];
  };
  for (const line of lines) {
    if (/^#\s+/.test(line)) continue;
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      saveSection();
      currentRoot = h2Match[1].trim();
      currentChild = "";
      continue;
    }
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      saveSection();
      currentChild = h3Match[1].trim();
      continue;
    }
    currentBody.push(line);
  }
  saveSection();
  return sections;
}
function restructureOverview(content) {
  const childRoots = /* @__PURE__ */ new Set();
  for (const key of Object.keys(content)) {
    const parts = key.split("/");
    if (parts.length > 1) {
      childRoots.add(parts[0]);
    }
  }
  for (const root of childRoots) {
    if (content[root]) {
      content[root + "/Overview"] = content[root];
      delete content[root];
    }
  }
}
function parseCellContent(raw) {
  const trimmed = raw.trim();
  const lines = trimmed.split("\n").filter((l) => l.trim().length > 0).map((l) => {
    let text = l.trim();
    let redFlag = false;
    if (text.endsWith("<!-- rf -->")) {
      redFlag = true;
      text = text.replace("<!-- rf -->", "").trim();
    }
    return { text, redFlag };
  });
  return { raw: trimmed, lines };
}
function parseDifferentials(body) {
  return body.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("- [[") || l.startsWith("* [[")).map((l) => {
    const match = l.match(/\[\[([^\]]+)\]\]/);
    return match ? match[1] : "";
  }).filter((l) => l.length > 0);
}

// src/parser/headingParser.ts
function buildColumnTree(conditions) {
  const rootMap = /* @__PURE__ */ new Map();
  const rootOrder = [];
  for (const condition of conditions) {
    for (const key of Object.keys(condition.content)) {
      const parts = key.split("/");
      const rootName = parts[0];
      const childName = parts.length > 1 ? parts[1] : null;
      if (!rootMap.has(rootName)) {
        const rootId = `col-${rootName}`;
        rootMap.set(rootName, {
          id: rootId,
          heading: rootName,
          level: 2,
          parentId: null,
          childrenIds: [],
          collapsed: false,
          width: null
        });
        rootOrder.push(rootName);
      }
      if (childName) {
        const childId = `col-${rootName}/${childName}`;
        if (!rootMap.has(childId)) {
          const root = rootMap.get(rootName);
          rootMap.set(childId, {
            id: childId,
            heading: childName,
            level: 3,
            parentId: root.id,
            childrenIds: [],
            collapsed: false,
            width: null
          });
          root.childrenIds.push(childId);
        }
      }
    }
  }
  return rootOrder.map((name) => rootMap.get(name)).filter(Boolean);
}
function buildColumnsFromTemplate(templateHeadings) {
  const rootMap = /* @__PURE__ */ new Map();
  const rootOrder = [];
  let lastRootName = null;
  for (const h of templateHeadings) {
    if (h.level === 2) {
      if (!rootMap.has(h.text)) {
        const col = {
          id: `col-${h.text}`,
          heading: h.text,
          level: 2,
          parentId: null,
          childrenIds: [],
          collapsed: false,
          width: null
        };
        rootMap.set(h.text, col);
        rootOrder.push(h.text);
      }
      lastRootName = h.text;
    } else if (h.level === 3 && lastRootName) {
      const root = rootMap.get(lastRootName);
      if (root) {
        const childId = `col-${lastRootName}/${h.text}`;
        if (!root.childrenIds.includes(childId)) {
          root.childrenIds.push(childId);
        }
      }
    }
  }
  return rootOrder.map((name) => rootMap.get(name)).filter(Boolean);
}

// src/table/tableRenderer.ts
var import_obsidian4 = require("obsidian");

// src/table/cellEditor.ts
var import_obsidian3 = require("obsidian");

// src/storage/fileWriter.ts
var import_obsidian = require("obsidian");

// src/storage/redFlagSync.ts
function rfStripLine(text) {
  let out = text;
  let guard = 0;
  while (out.indexOf("%%") >= 0 && guard < 50) {
    const o = out.indexOf("%%");
    const c = out.indexOf("%%", o + 2);
    if (c < 0) break;
    const inner = out.slice(o + 2, c);
    const sep = inner.indexOf("|");
    const phrase = sep >= 0 ? inner.slice(0, sep).trim() : "";
    out = out.slice(0, o) + " " + phrase + " " + out.slice(c + 2);
    guard++;
  }
  const gt = out.indexOf(" >> ");
  if (gt >= 0) out = out.slice(0, gt);
  return out.replace(/\s{2,}/g, " ").trim();
}
async function syncRedFlagsInFile(vault, file) {
  try {
    const fileContent = await vault.read(file);
    const synced = syncRedFlagsSection(fileContent);
    if (synced !== fileContent) {
      await vault.modify(file, synced);
      return true;
    }
  } catch (e) {
    console.error("MC sync error:", e);
  }
  return false;
}
function syncRedFlagsSection(fileContent) {
  const lines = fileContent.split("\n");
  const flaggedLines = [];
  let inRedFlagsSection = false;
  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      inRedFlagsSection = h2Match[1].trim() === "Red Flags";
      continue;
    }
    if (!inRedFlagsSection && line.trim().endsWith("<!-- rf -->")) {
      const text = rfStripLine(line.replace("<!-- rf -->", "").replace(/^[-*]\s*/, ""));
      if (text.length > 0) {
        flaggedLines.push(text);
      }
    }
  }
  const rfSection = ["## Red Flags"];
  if (flaggedLines.length > 0) {
    for (const fl of flaggedLines) {
      rfSection.push("- " + fl);
    }
  } else {
    rfSection.push("None");
  }
  const result = [];
  let inserted = false;
  let skipRedFlags = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match && h2Match[1].trim() === "Red Flags") {
      skipRedFlags = true;
      continue;
    }
    if (skipRedFlags) {
      if (h2Match) {
        skipRedFlags = false;
      } else {
        continue;
      }
    }
    if (h2Match && h2Match[1].trim() === "Resources" && !inserted) {
      result.push(...rfSection);
      result.push("");
      inserted = true;
    }
    result.push(line);
  }
  if (!inserted) {
    result.push("");
    result.push(...rfSection);
  }
  return result.join("\n");
}

// src/storage/fileWriter.ts
async function writeCellToFile(vault, file, contentKey, newLines) {
  try {
    let fileContent = await vault.read(file);
    const newRaw = newLines.map((l) => l.redFlag ? `${l.text} <!-- rf -->` : l.text).join("\n");
    fileContent = replaceSection(fileContent, contentKey, newRaw);
    fileContent = syncRedFlagsSection(fileContent);
    await vault.modify(file, fileContent);
  } catch (e) {
    new import_obsidian.Notice(`Error saving: ${e}`);
    console.error("MC write error:", e);
  }
}
function replaceSection(fileContent, contentKey, newRaw) {
  const lines = fileContent.split("\n");
  const result = [];
  const parts = contentKey.split("/");
  const rootName = parts[0];
  const childName = parts.length > 1 ? parts[1] : null;
  let i = 0;
  let replaced = false;
  while (i < lines.length) {
    const line = lines[i];
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match && h2Match[1].trim() === rootName) {
      result.push(line);
      i++;
      if (!childName) {
        while (i < lines.length) {
          const nextLine = lines[i];
          if (/^##\s+/.test(nextLine)) break;
          if (/^###\s+/.test(nextLine)) break;
          i++;
        }
        for (const contentLine of newRaw.split("\n")) {
          result.push(contentLine);
        }
        replaced = true;
        continue;
      }
      while (i < lines.length) {
        const childLine = lines[i];
        const h3Match = childLine.match(/^###\s+(.+)$/);
        if (h3Match && h3Match[1].trim() === childName) {
          result.push(childLine);
          i++;
          while (i < lines.length) {
            const nextLine = lines[i];
            if (/^##\s+/.test(nextLine)) break;
            if (/^###\s+/.test(nextLine)) break;
            i++;
          }
          for (const contentLine of newRaw.split("\n")) {
            result.push(contentLine);
          }
          replaced = true;
          break;
        }
        if (/^##\s+/.test(childLine)) break;
        result.push(childLine);
        i++;
      }
      continue;
    }
    result.push(line);
    i++;
  }
  if (!replaced) {
    result.push("");
    result.push(`## ${rootName}`);
    if (childName) {
      result.push(`### ${childName}`);
    }
    for (const contentLine of newRaw.split("\n")) {
      result.push(contentLine);
    }
  }
  return result.join("\n");
}

// src/storage/undoManager.ts
var MAX_HISTORY = 20;
var stack = [];
var pointer = 0;
function baseLabel(path, contentKey) {
  const name = path.split("/").pop() || path;
  return name.replace(/\.md$/, "") + " / " + contentKey;
}
function copyLines(lines) {
  return lines.map((l) => ({ text: l.text, redFlag: l.redFlag }));
}
function pushUndo(entry) {
  stack.length = pointer;
  stack.push({
    path: entry.path,
    contentKey: entry.contentKey,
    lines: copyLines(entry.lines),
    after: entry.after ? copyLines(entry.after) : void 0,
    label: entry.label || baseLabel(entry.path, entry.contentKey),
    at: Date.now()
  });
  if (stack.length > MAX_HISTORY) stack.shift();
  pointer = stack.length;
}
function undo() {
  if (pointer <= 0) return null;
  pointer--;
  return stack[pointer];
}
function redo() {
  if (pointer >= stack.length) return null;
  const entry = stack[pointer];
  pointer++;
  return entry;
}
function undoDepth() {
  return pointer;
}
function redoDepth() {
  return stack.length - pointer;
}

// src/dialogs/annotationModal.ts
var import_obsidian2 = require("obsidian");
var AnnotationModal = class extends import_obsidian2.Modal {
  constructor(app, opts) {
    super(app);
    this.opts = opts;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("mc-ann-modal");
    contentEl.createEl("h3", { text: this.opts.title || "Annotation", cls: "mc-ann-title" });
    contentEl.createDiv({ text: "Details", cls: "mc-ann-label" });
    const ta = contentEl.createEl("textarea", { cls: "mc-ann-textarea" });
    ta.value = this.opts.initial;
    ta.focus();
    ta.select();
    const btns = contentEl.createDiv({ cls: "mc-ann-btn-row" });
    if (this.opts.onDelete) {
      const del = btns.createEl("button", { text: "Delete annotation", cls: "mc-ann-delete" });
      del.addEventListener("click", () => {
        const f = this.opts.onDelete;
        this.close();
        if (f) f();
      });
    }
    const cancel = btns.createEl("button", { text: "Cancel", cls: "mc-ann-cancel" });
    cancel.addEventListener("click", () => {
      this.close();
    });
    const save = btns.createEl("button", { text: "Save", cls: "mc-ann-save" });
    save.addEventListener("click", () => {
      const val = ta.value.trim();
      if (!val) return;
      this.close();
      this.opts.onSave(val);
    });
  }
  onClose() {
    this.contentEl.empty();
    if (this.opts.onClosed) this.opts.onClosed();
  }
};

// src/shared/icons.ts
var FLAG_ICON_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>';

// src/parser/annotationUtil.ts
var ANN_MARK = "%%";
function dedupeAdjacentPhrases(line) {
  let out = line;
  let guard = 0;
  while (guard < 50) {
    const o = out.indexOf(ANN_MARK);
    if (o < 0) break;
    const c = out.indexOf(ANN_MARK, o + 2);
    if (c < 0) break;
    const inner = out.slice(o + 2, c);
    const sep = inner.indexOf("|");
    const phrase = sep >= 0 ? inner.slice(0, sep).trim() : "";
    const before = out.slice(0, o);
    if (phrase && before.trimEnd().endsWith(phrase)) {
      const cut = before.trimEnd().slice(0, before.trimEnd().length - phrase.length);
      out = cut + ANN_MARK + inner + ANN_MARK + out.slice(c + 2);
    } else {
      break;
    }
    guard++;
  }
  return out;
}
function locate(line, open, close, occ) {
  const inner = line.slice(open + 2, close);
  const sep = inner.indexOf("|");
  const phrase = sep >= 0 ? inner.slice(0, sep).trim() : "";
  const detail = sep >= 0 ? inner.slice(sep + 1).trim() : inner.trim();
  return { open, close, phrase, detail, occ };
}
function findAllAnnotations(line) {
  line = dedupeAdjacentPhrases(line);
  const out = [];
  let p = 0;
  let occ = 0;
  let guard = 0;
  while (guard < 50) {
    const open = line.indexOf(ANN_MARK, p);
    if (open < 0) break;
    const close = line.indexOf(ANN_MARK, open + 2);
    if (close < 0) break;
    out.push(locate(line, open, close, occ));
    p = close + 2;
    occ++;
    guard++;
  }
  return out;
}
function findAnnotationAt(line, pos) {
  for (const ann of findAllAnnotations(line)) {
    if (pos > ann.open && pos < ann.close + 2) return ann;
  }
  return null;
}
function findAnnotationOcc(line, occ) {
  const all = findAllAnnotations(line);
  return occ < all.length ? all[occ] : null;
}
function updateDetail(line, occ, newDetail) {
  const ann = findAnnotationOcc(line, occ);
  if (!ann) return line;
  return line.slice(0, ann.open) + ANN_MARK + ann.phrase + " | " + newDetail + ANN_MARK + line.slice(ann.close + 2);
}
function removeAnnotation(line, occ) {
  const ann = findAnnotationOcc(line, occ);
  if (!ann) return line;
  return line.slice(0, ann.open) + ann.phrase + line.slice(ann.close + 2);
}
function buildMarker(phrase, detail) {
  return ANN_MARK + phrase.trim() + " | " + detail.trim() + ANN_MARK;
}
function rfStripLine2(text) {
  let out = text;
  let guard = 0;
  while (out.indexOf(ANN_MARK) >= 0 && guard < 50) {
    const o = out.indexOf(ANN_MARK);
    const c = out.indexOf(ANN_MARK, o + 2);
    if (c < 0) break;
    const inner = out.slice(o + 2, c);
    const sep = inner.indexOf("|");
    const phrase = sep >= 0 ? inner.slice(0, sep).trim() : "";
    out = out.slice(0, o) + " " + phrase + " " + out.slice(c + 2);
    guard++;
  }
  const gt = out.indexOf(" >> ");
  if (gt >= 0) out = out.slice(0, gt);
  return out.replace(/\s{2,}/g, " ").trim();
}

// src/table/cellEditor.ts
function renderLineWithLinks(parent, text, app, sourcePath) {
  const re = /\[\[([^\]]+)\]\]/g;
  let cursor = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) {
      parent.createSpan({ cls: "mc-line-plain", text: text.slice(cursor, m.index) });
    }
    const inner = m[1];
    const bar = inner.indexOf("|");
    const target = (bar >= 0 ? inner.slice(0, bar) : inner).trim();
    const alias = bar >= 0 ? inner.slice(bar + 1).trim() : "";
    const link = parent.createSpan({ cls: "mc-cell-link", text: alias || target });
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      if (target) app.workspace.openLinkText(target, sourcePath, false);
    });
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) {
    parent.createSpan({ cls: "mc-line-plain", text: text.slice(cursor) });
  }
}
var CALLOUT_RE = /^>\s*\[!(\w+)\]([+-])?\s*(.*)$/;
var CALLOUT_COLORS = {
  note: "#086ddd",
  info: "#086ddd",
  todo: "#086ddd",
  tip: "#009649",
  success: "#009649",
  done: "#009649",
  question: "#e0ac00",
  help: "#e0ac00",
  faq: "#e0ac00",
  warning: "#e0ac00",
  caution: "#e0ac00",
  attention: "#e0ac00",
  danger: "#d4232f",
  error: "#d4232f",
  failure: "#d4232f",
  fail: "#d4232f",
  bug: "#d4232f",
  example: "#7852ee",
  abstract: "#7852ee",
  summary: "#7852ee",
  tldr: "#7852ee",
  quote: "#9e9e9e",
  cite: "#9e9e9e"
};
function calloutColor(type) {
  return CALLOUT_COLORS[type.toLowerCase()] || CALLOUT_COLORS["note"];
}
function makeEditable(td, app, conditionPath, contentKey, vault, onSave, initialLines, enableRedFlags) {
  let currentLines = initialLines.map((l) => ({ text: l.text, redFlag: l.redFlag }));
  let isEditing = false;
  let modalActive = false;
  const linesContainer = td.createDiv({ cls: "mc-cell-lines" });
  const saveLines = (lines) => {
    const file = vault.getAbstractFileByPath(conditionPath);
    if (file instanceof import_obsidian3.TFile) {
      writeCellToFile(vault, file, contentKey, lines).then(() => onSave());
    }
  };
  const snapshot = () => currentLines.map((l) => ({ text: l.text, redFlag: l.redFlag }));
  const openAnnotationModal = (lineIndex, occ) => {
    const line = currentLines[lineIndex];
    if (!line) return;
    const anns = findAllAnnotations(line.text);
    const ann = anns[occ];
    if (!ann) return;
    new AnnotationModal(app, {
      initial: ann.detail,
      onSave: (detail) => {
        const before = snapshot();
        currentLines[lineIndex] = { text: updateDetail(line.text, occ, detail), redFlag: line.redFlag };
        pushUndo({ path: conditionPath, contentKey, lines: before, after: snapshot() });
        renderDisplay();
        saveLines(snapshot());
      },
      onDelete: () => {
        const before = snapshot();
        currentLines[lineIndex] = { text: removeAnnotation(line.text, occ), redFlag: line.redFlag };
        pushUndo({ path: conditionPath, contentKey, lines: before, after: snapshot() });
        renderDisplay();
        saveLines(snapshot());
      }
    }).open();
  };
  const renderDisplay = () => {
    linesContainer.empty();
    const renderLineRow = (parent, line, i2, displayText) => {
      const row = parent.createDiv({ cls: "mc-cell-line" });
      if (enableRedFlags) {
        const flag = row.createSpan({ cls: line.redFlag ? "mc-red-flag-toggle is-active" : "mc-red-flag-toggle" });
        flag.innerHTML = FLAG_ICON_SVG;
        flag.addEventListener("click", (e) => {
          e.stopPropagation();
          const before = snapshot();
          line.redFlag = !line.redFlag;
          if (line.redFlag) {
            flag.addClass("is-active");
          } else {
            flag.removeClass("is-active");
          }
          pushUndo({ path: conditionPath, contentKey, lines: before, after: snapshot() });
          saveLines(snapshot());
        });
      }
      const flow = row.createSpan({ cls: "mc-line-flow" });
      const anns = findAllAnnotations(displayText);
      if (anns.length === 0) {
        renderLineWithLinks(flow, displayText, app, conditionPath);
      } else {
        let cursor = 0;
        anns.forEach((ann, occ) => {
          if (ann.open > cursor) {
            renderLineWithLinks(flow, displayText.slice(cursor, ann.open), app, conditionPath);
          }
          const phraseEl = flow.createSpan({ cls: "mc-ann-phrase", text: ann.phrase });
          phraseEl.addEventListener("click", (e) => {
            e.stopPropagation();
            openAnnotationModal(i2, occ);
          });
          cursor = ann.close + 2;
        });
        if (cursor < displayText.length) {
          renderLineWithLinks(flow, displayText.slice(cursor), app, conditionPath);
        }
      }
    };
    let i = 0;
    while (i < currentLines.length) {
      const m = currentLines[i].text.match(CALLOUT_RE);
      if (m) {
        let j = i + 1;
        while (j < currentLines.length && currentLines[j].text.startsWith(">")) j++;
        const box = linesContainer.createDiv({ cls: "mc-callout" });
        box.style.borderLeftColor = calloutColor(m[1]);
        const head = box.createDiv({ cls: "mc-callout-head" });
        const chev = head.createSpan({ cls: "mc-callout-chevron", text: ">" });
        head.createSpan({ cls: "mc-callout-title", text: m[3] || m[1] });
        const body = box.createDiv({ cls: "mc-callout-body" });
        if (m[2] === "-") box.addClass("is-collapsed");
        chev.setText(box.hasClass("is-collapsed") ? ">" : "v");
        head.addEventListener("click", (e) => {
          e.stopPropagation();
          if (box.hasClass("is-collapsed")) {
            box.removeClass("is-collapsed");
          } else {
            box.addClass("is-collapsed");
          }
          chev.setText(box.hasClass("is-collapsed") ? ">" : "v");
        });
        for (let k = i + 1; k < j; k++) {
          const stripped = currentLines[k].text.replace(/^>\s?/, "");
          renderLineRow(body, currentLines[k], k, stripped);
        }
        i = j;
      } else {
        renderLineRow(linesContainer, currentLines[i], i, currentLines[i].text);
        i++;
      }
    }
    if (currentLines.length === 0) {
      linesContainer.createDiv({ cls: "mc-cell-empty" });
    }
  };
  const startEditing = (clickX, clickY) => {
    if (isEditing) return;
    isEditing = true;
    linesContainer.empty();
    linesContainer.addClass("is-editing");
    const editor = linesContainer.createDiv({ cls: "mc-cell-editor" });
    editor.setAttribute("contenteditable", "true");
    editor.setAttribute("spellcheck", "false");
    editor.setText(currentLines.map((l) => l.text).join("\n"));
    editor.focus();
    try {
      const range = document.caretRangeFromPoint(clickX, clickY);
      if (range && editor.contains(range.startContainer)) {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } catch (err) {
    }
    let cancelled = false;
    let annBtn = null;
    const hideAnnBtn = () => {
      if (annBtn) {
        annBtn.remove();
        annBtn = null;
      }
    };
    const annotateFromSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) return;
      const text = sel.toString();
      if (!text.trim()) return;
      if (text.indexOf("\n") >= 0) {
        new import_obsidian3.Notice("Select within a single line");
        return;
      }
      if (text.indexOf(ANN_MARK) >= 0) {
        new import_obsidian3.Notice("Selection includes a marker - select plain text only");
        return;
      }
      const full = editor.innerText;
      const preRange = document.createRange();
      preRange.selectNodeContents(editor);
      preRange.setEnd(range.startContainer, range.startOffset);
      const before = preRange.toString();
      const selStart = before.length;
      const selEnd = selStart + text.length;
      let lineStart = 0;
      const lastNl = before.lastIndexOf("\n");
      if (lastNl >= 0) lineStart = lastNl + 1;
      const lineText = full.slice(lineStart, full.indexOf("\n", lineStart) < 0 ? full.length : full.indexOf("\n", lineStart));
      let replacement;
      const lineAnns = findAllAnnotations(lineText);
      const markersBefore = (lineText.slice(0, selStart - lineStart).match(new RegExp(ANN_MARK + ANN_MARK, "g")) || []).length;
      let overlapping = null;
      for (const ann of lineAnns) {
        const aStart = lineStart + ann.open;
        const aEnd = lineStart + ann.close + 2;
        if (selStart < aEnd && selEnd > aStart) {
          overlapping = { open: ann.open, close: ann.close, detail: ann.detail };
          break;
        }
      }
      modalActive = true;
      hideAnnBtn();
      const occ = Math.floor(markersBefore / 2);
      new AnnotationModal(app, {
        initial: overlapping ? overlapping.detail : "",
        title: overlapping ? "Re-link annotation" : "Annotation",
        onSave: (detail) => {
          let newLine;
          if (overlapping) {
            const rebuilt = ANN_MARK + text + " | " + detail + ANN_MARK;
            newLine = lineText.slice(0, overlapping.open) + rebuilt + lineText.slice(overlapping.close + 2);
          } else {
            const marker = ANN_MARK + text + " | " + detail + ANN_MARK;
            newLine = lineText.slice(0, selStart - lineStart) + marker + lineText.slice(selEnd - lineStart);
          }
          const newFull = full.slice(0, lineStart) + newLine + full.slice(lineStart + lineText.length);
          editor.setText(newFull);
          editor.focus();
        },
        onClosed: () => {
          modalActive = false;
          editor.focus();
        }
      }).open();
    };
    const updateAnnBtn = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        hideAnnBtn();
        return;
      }
      const range = sel.getRangeAt(0);
      if (!editor.contains(range.commonAncestorContainer)) {
        hideAnnBtn();
        return;
      }
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        hideAnnBtn();
        return;
      }
      hideAnnBtn();
      annBtn = document.body.createEl("button", { cls: "mc-fold-btn" });
      annBtn.setText("Annotate");
      annBtn.setAttribute("title", "Annotate the selected phrase (re-links if it overlaps an annotation)");
      annBtn.style.left = Math.max(8, Math.round(rect.left + rect.width / 2 - 32)) + "px";
      annBtn.style.top = Math.max(8, Math.round(rect.top - 32)) + "px";
      annBtn.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
      });
      annBtn.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        annotateFromSelection();
      }, { passive: false });
      annBtn.addEventListener("click", () => {
        annotateFromSelection();
      });
    };
    editor.addEventListener("mouseup", updateAnnBtn);
    editor.addEventListener("keyup", updateAnnBtn);
    const onSelChange = () => {
      if (!isEditing) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        hideAnnBtn();
        return;
      }
      const node = sel.getRangeAt(0).commonAncestorContainer;
      if (editor.contains(node)) updateAnnBtn();
      else hideAnnBtn();
    };
    document.addEventListener("selectionchange", onSelChange);
    editor.addEventListener("paste", (e) => {
      e.preventDefault();
      const text = e.clipboardData ? e.clipboardData.getData("text/plain") : "";
      document.execCommand("insertText", false, text);
    });
    editor.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        cancelled = true;
        ev.preventDefault();
        editor.blur();
      }
    });
    editor.addEventListener("blur", () => {
      if (modalActive) return;
      isEditing = false;
      hideAnnBtn();
      document.removeEventListener("selectionchange", onSelChange);
      linesContainer.removeClass("is-editing");
      if (cancelled) {
        renderDisplay();
        return;
      }
      const raw = editor.innerText || "";
      const parts = raw.split("\n");
      const newLines = [];
      let src = 0;
      for (let i = 0; i < parts.length; i++) {
        const text = parts[i].trim();
        if (text.length === 0) continue;
        const redFlag = src < currentLines.length ? currentLines[src].redFlag : false;
        newLines.push({ text, redFlag });
        src++;
      }
      const contentChanged = JSON.stringify(newLines) !== JSON.stringify(currentLines);
      if (contentChanged) {
        pushUndo({ path: conditionPath, contentKey, lines: snapshot(), after: newLines });
      }
      currentLines = newLines;
      renderDisplay();
      saveLines(snapshot());
    });
  };
  td.addEventListener("click", (e) => {
    if (isEditing) return;
    const t = e.target;
    if (t.closest(".mc-red-flag-toggle")) return;
    if (t.closest(".mc-ann-phrase")) return;
    if (t.closest("a")) return;
    if (t.closest(".mc-cell-link")) return;
    if (t.closest(".mc-callout-head")) return;
    startEditing(e.clientX, e.clientY);
  });
  renderDisplay();
}

// src/shared/tagColor.ts
var DARK_MAP = {
  "#d6e9c9": "#3b5c40",
  "#cfeae6": "#35605a",
  "#d2e8ef": "#33566b",
  "#d4def5": "#3a4a72",
  "#e4dcf5": "#4d4374",
  "#f3d7de": "#74424f",
  "#f7e0d2": "#75563c",
  "#f7edd2": "#75663e"
};
function tagColorFor(color) {
  if (!color) return "";
  if (!document.body.classList.contains("theme-dark")) return color;
  return DARK_MAP[color.toLowerCase()] || color;
}

// src/table/tableRenderer.ts
var DIFF_COMPARE_ICON_SVG = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>';
var MINIMIZE_ICON_SVG = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
var MIN_COL_WIDTH = 60;
var MIN_ROW_HEIGHT = 36;
var EDGE_ZONE = 7;
var DRAG_THRESHOLD = 6;
function getColumnType(heading) {
  if (heading === "Differential Diagnoses") return "differentials";
  if (heading === "Additional Notes") return "additionalNotes";
  if (heading === "Red Flags") return "redFlags";
  return "content";
}
function buildLeafSpecs(columns) {
  const specs = [];
  for (const col of columns) {
    const type = getColumnType(col.heading);
    if (col.childrenIds.length > 0) {
      for (const childId of col.childrenIds) {
        const childHeading = childId.split("/")[1] || childId;
        const contentKey = childId.replace(/^col-/, "");
        specs.push({
          id: childId,
          heading: childHeading,
          type: "content",
          contentKey,
          parentId: col.id,
          enableRedFlags: col.heading !== "Resources"
        });
      }
    } else {
      const contentKey = col.id.replace(/^col-/, "");
      specs.push({
        id: col.id,
        heading: col.heading,
        type,
        contentKey,
        parentId: null,
        enableRedFlags: type === "additionalNotes" || type === "content" && col.heading !== "Resources"
      });
    }
  }
  return specs;
}
function addHideButton(th, colId, onHideColumn) {
  if (!onHideColumn) return;
  const btn = th.createSpan({ cls: "mc-col-hide-btn" });
  btn.innerHTML = MINIMIZE_ICON_SVG;
  btn.setAttribute("aria-label", "Hide column");
  btn.setAttribute("title", "Hide column");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    onHideColumn(colId);
  });
}
function startColumnDrag(table, colId, e, onEnd) {
  const cells = Array.from(table.querySelectorAll('[data-col-id="' + colId + '"]'));
  const startX = e.clientX;
  const startWidth = cells.length > 0 ? cells[0].getBoundingClientRect().width : 220;
  const onMove = (ev) => {
    const w = Math.max(MIN_COL_WIDTH, Math.round(startWidth + ev.clientX - startX));
    for (const c of cells) {
      c.style.width = w + "px";
      c.style.minWidth = w + "px";
      c.style.maxWidth = w + "px";
    }
  };
  const onUp = (ev) => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    onEnd(Math.max(MIN_COL_WIDTH, Math.round(startWidth + ev.clientX - startX)));
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}
function startRowDrag(table, rowId, e, onEnd) {
  const tr = table.querySelector('tr[data-row-id="' + rowId + '"]');
  if (!tr) return;
  const lists = Array.from(tr.querySelectorAll(".mc-cell-lines, .mc-rf-list, .mc-diff-list"));
  const startY = e.clientY;
  const startHeight = tr.getBoundingClientRect().height;
  const onMove = (ev) => {
    const h = Math.max(MIN_ROW_HEIGHT, Math.round(startHeight + ev.clientY - startY));
    tr.style.height = h + "px";
    for (const l of lists) {
      l.style.maxHeight = Math.max(40, h - 12) + "px";
    }
  };
  const onUp = (ev) => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    onEnd(Math.max(MIN_ROW_HEIGHT, Math.round(startHeight + ev.clientY - startY)));
  };
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}
function startColumnDragTouch(table, colId, startX, startWidth, onEnd) {
  const cells = Array.from(table.querySelectorAll('[data-col-id="' + colId + '"]'));
  const onMove = (ev) => {
    ev.preventDefault();
    const w = Math.max(MIN_COL_WIDTH, Math.round(startWidth + ev.touches[0].clientX - startX));
    for (const c of cells) {
      c.style.width = w + "px";
      c.style.minWidth = w + "px";
      c.style.maxWidth = w + "px";
    }
  };
  const onUp = (ev) => {
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onUp);
    onEnd(Math.max(MIN_COL_WIDTH, Math.round(startWidth + ev.changedTouches[0].clientX - startX)));
  };
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("touchend", onUp);
}
function startRowDragTouch(table, rowId, startY, startHeight, onEnd) {
  const tr = table.querySelector('tr[data-row-id="' + rowId + '"]');
  if (!tr) return;
  const lists = Array.from(tr.querySelectorAll(".mc-cell-lines, .mc-rf-list, .mc-diff-list"));
  const onMove = (ev) => {
    ev.preventDefault();
    const h = Math.max(MIN_ROW_HEIGHT, Math.round(startHeight + ev.touches[0].clientY - startY));
    tr.style.height = h + "px";
    for (const l of lists) {
      l.style.maxHeight = Math.max(40, h - 12) + "px";
    }
  };
  const onUp = (ev) => {
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("touchend", onUp);
    onEnd(Math.max(MIN_ROW_HEIGHT, Math.round(startHeight + ev.changedTouches[0].clientY - startY)));
  };
  document.addEventListener("touchmove", onMove, { passive: false });
  document.addEventListener("touchend", onUp);
}
function attachResize(table, onColumnResize, onRowResize) {
  table.addEventListener("mousedown", (e) => {
    const t = e.target;
    if (t.closest(".mc-col-hide-btn")) return;
    if (t.closest(".mc-red-flag-toggle")) return;
    if (t.closest("a")) return;
    const cell = t.closest("td, th");
    if (!cell) return;
    const colId = cell.getAttribute("data-col-id");
    if (!colId) return;
    const rect = cell.getBoundingClientRect();
    const nearRight = e.clientX >= rect.right - EDGE_ZONE;
    const nearBottom = e.clientY >= rect.bottom - EDGE_ZONE;
    const isGroup = !!cell.getAttribute("colspan");
    if (nearRight && !isGroup && onColumnResize) {
      e.preventDefault();
      startColumnDrag(table, colId, e, (w) => {
        onColumnResize(colId, w);
      });
    } else if (nearBottom && onRowResize) {
      const tr = cell.closest("tr");
      const rowId = tr ? tr.getAttribute("data-row-id") : null;
      if (rowId) {
        e.preventDefault();
        startRowDrag(table, rowId, e, (h) => {
          onRowResize(rowId, h);
        });
      }
    }
  });
  table.addEventListener("mousemove", (e) => {
    const t = e.target;
    const cell = t.closest("td, th");
    if (!cell) {
      table.style.cursor = "";
      return;
    }
    const rect = cell.getBoundingClientRect();
    const isGroup = !!cell.getAttribute("colspan");
    if (e.clientX >= rect.right - EDGE_ZONE && !isGroup) {
      table.style.cursor = "col-resize";
    } else if (e.clientY >= rect.bottom - EDGE_ZONE) {
      table.style.cursor = "row-resize";
    } else {
      table.style.cursor = "";
    }
  });
  table.addEventListener("dblclick", (e) => {
    const t = e.target;
    const cell = t.closest("td, th");
    if (!cell) return;
    const colId = cell.getAttribute("data-col-id");
    if (!colId) return;
    if (cell.getAttribute("colspan")) return;
    const rect = cell.getBoundingClientRect();
    if (e.clientX < rect.right - EDGE_ZONE) return;
    fitColumnToContent(table, colId);
  });
  table.addEventListener("mouseleave", () => {
    table.style.cursor = "";
  });
  table.addEventListener("touchstart", (e) => {
    const t = e.target;
    if (t.closest(".mc-col-hide-btn")) return;
    if (t.closest(".mc-red-flag-toggle")) return;
    if (t.closest("a")) return;
    const cell = t.closest("td, th");
    if (!cell) return;
    const colId = cell.getAttribute("data-col-id");
    if (!colId) return;
    const rect = cell.getBoundingClientRect();
    const touch = e.touches[0];
    const nearRight = touch.clientX >= rect.right - EDGE_ZONE;
    const nearBottom = touch.clientY >= rect.bottom - EDGE_ZONE;
    const isGroup = !!cell.getAttribute("colspan");
    if (nearRight && !isGroup && onColumnResize) {
      e.preventDefault();
      const cells = Array.from(table.querySelectorAll('[data-col-id="' + colId + '"]'));
      const startWidth = cells.length > 0 ? cells[0].getBoundingClientRect().width : 220;
      startColumnDragTouch(table, colId, touch.clientX, startWidth, (w) => {
        onColumnResize(colId, w);
      });
    } else if (nearBottom && onRowResize) {
      const tr = cell.closest("tr");
      const rowId = tr ? tr.getAttribute("data-row-id") : null;
      if (tr && rowId) {
        e.preventDefault();
        const startHeight = tr.getBoundingClientRect().height;
        startRowDragTouch(table, rowId, touch.clientY, startHeight, (h) => {
          onRowResize(rowId, h);
        });
      }
    }
  }, { passive: false });
}
function attachColumnReorder(table, columns, onColumnReorder) {
  if (!onColumnReorder) return;
  table.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    const t = e.target;
    if (t.closest(".mc-col-hide-btn")) return;
    const th = t.closest("th");
    if (!th) return;
    const srcId = th.getAttribute("data-col-id");
    if (!srcId || srcId === "col-condition") return;
    const isChild = th.hasClass("mc-th-child");
    let validTargetIds = [];
    if (isChild) {
      let parent = null;
      for (const c of columns) {
        if (c.childrenIds.indexOf(srcId) >= 0) {
          parent = c;
          break;
        }
      }
      if (!parent) return;
      validTargetIds = parent.childrenIds.filter((id) => id !== srcId);
    } else {
      validTargetIds = columns.map((c) => c.id).filter((id) => id !== srcId);
    }
    const rect = th.getBoundingClientRect();
    if (e.clientX >= rect.right - EDGE_ZONE) return;
    const startX = e.clientX;
    let active = false;
    let targetId = null;
    let targetSide = "after";
    const clearDrop = () => {
      const marked = table.querySelectorAll(".is-col-drop-before, .is-col-drop-after");
      marked.forEach((el) => {
        el.removeClass("is-col-drop-before");
        el.removeClass("is-col-drop-after");
      });
    };
    const headersFor = (ids) => {
      const out = [];
      for (const id of ids) {
        const els = table.querySelectorAll('th[data-col-id="' + id + '"]');
        els.forEach((el) => out.push(el));
      }
      return out;
    };
    const onMove = (ev) => {
      if (!active) {
        if (Math.abs(ev.clientX - startX) < DRAG_THRESHOLD) return;
        active = true;
        th.addClass("is-col-drag-src");
      }
      clearDrop();
      targetId = null;
      const candidates = headersFor(validTargetIds);
      let target = null;
      let side = "after";
      for (const cand of candidates) {
        const rr = cand.getBoundingClientRect();
        if (ev.clientX >= rr.left && ev.clientX <= rr.right) {
          target = cand;
          side = ev.clientX < rr.left + rr.width / 2 ? "before" : "after";
          break;
        }
      }
      if (target) {
        const tid = target.getAttribute("data-col-id");
        if (tid) {
          targetId = tid;
          targetSide = side;
          target.addClass(side === "before" ? "is-col-drop-before" : "is-col-drop-after");
        }
      }
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      th.removeClass("is-col-drag-src");
      clearDrop();
      if (active && targetId) {
        onColumnReorder(srcId, targetId, targetSide);
      }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  });
}
function applyColumnWidths(table, columnWidths) {
  if (!columnWidths) return;
  for (const colId of Object.keys(columnWidths)) {
    const w = columnWidths[colId];
    if (!w || w < MIN_COL_WIDTH) continue;
    const cells = Array.from(table.querySelectorAll('[data-col-id="' + colId + '"]'));
    for (const c of cells) {
      c.style.width = w + "px";
      c.style.minWidth = w + "px";
      c.style.maxWidth = w + "px";
    }
  }
}
function applyRowHeights(table, rowHeights) {
  if (!rowHeights) return;
  for (const rowId of Object.keys(rowHeights)) {
    const h = rowHeights[rowId];
    if (!h || h < MIN_ROW_HEIGHT) continue;
    const tr = table.querySelector('tr[data-row-id="' + rowId + '"]');
    if (!tr) continue;
    tr.style.height = h + "px";
    const lists = Array.from(tr.querySelectorAll(".mc-cell-lines, .mc-rf-list, .mc-diff-list"));
    for (const l of lists) {
      l.style.maxHeight = Math.max(40, h - 12) + "px";
    }
  }
}
function measureTextWidth(text, font) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.length * 8;
  ctx.font = font;
  return ctx.measureText(text).width;
}
function cellFont(cell) {
  const cs = getComputedStyle(cell);
  return cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
}
function setColumnWidth(cells, w) {
  for (const c of cells) {
    c.style.width = w + "px";
    c.style.minWidth = w + "px";
    c.style.maxWidth = w + "px";
  }
}
function autoFitConditionColumn(table, conditions) {
  const cells = Array.from(table.querySelectorAll('[data-col-id="col-condition"]'));
  if (cells.length === 0) return;
  const cs = getComputedStyle(cells[0]);
  const font = "700 " + cs.fontSize + " " + cs.fontFamily;
  let maxW = 0;
  for (const cond of conditions) {
    const w2 = measureTextWidth(cond.name, font) + 36 + 26;
    if (w2 > maxW) maxW = w2;
  }
  const w = Math.max(140, Math.min(400, Math.round(maxW)));
  setColumnWidth(cells, w);
}
function fitColumnToContent(table, colId) {
  const cells = Array.from(table.querySelectorAll('[data-col-id="' + colId + '"]'));
  if (cells.length === 0) return;
  const font = cellFont(cells[0]);
  let maxW = 60;
  for (const c of cells) {
    const strongEl = c.querySelector("strong");
    if (strongEl && strongEl.textContent) {
      const cs = getComputedStyle(c);
      const bFont = "700 " + cs.fontSize + " " + cs.fontFamily;
      const iconBtn = c.querySelector(".mc-diff-cmp-btn");
      const iconW = iconBtn ? 26 : 0;
      const w2 = measureTextWidth(strongEl.textContent.trim(), bFont) + 36 + iconW;
      if (w2 > maxW) maxW = w2;
      continue;
    }
    const lines = c.querySelectorAll(".mc-line-text, .mc-rf-text, .mc-diff-link");
    if (lines.length === 0) continue;
    lines.forEach((node) => {
      const t = (node.textContent || "").trim();
      if (!t) return;
      const w2 = measureTextWidth(t, font) + 28;
      if (w2 > maxW) maxW = w2;
    });
  }
  const w = Math.max(MIN_COL_WIDTH, Math.min(600, Math.round(maxW)));
  setColumnWidth(cells, w);
}
function renderTable(container, conditions, columns, vault, app, onSave, onHideColumn, columnWidths, onColumnResize, rowHeights, onRowResize, tagProps, onColumnReorder, onCompareDiff) {
  const dockedBar = container.querySelector(":scope > .mc-toolbar");
  if (dockedBar) dockedBar.remove();
  container.empty();
  const wrapper = container.createDiv({ cls: "mc-table-wrapper" });
  const table = wrapper.createEl("table", { cls: "mc-table" });
  const leafSpecs = buildLeafSpecs(columns);
  const thead = table.createEl("thead");
  const headerRow1 = thead.createEl("tr");
  const conditionTh = headerRow1.createEl("th", { cls: "mc-th-condition" });
  conditionTh.setAttribute("data-col-id", "col-condition");
  conditionTh.setText("Condition");
  conditionTh.setAttribute("rowspan", "2");
  for (const col of columns) {
    const type = getColumnType(col.heading);
    const cls = type === "redFlags" ? "mc-th mc-th-rf mc-th-root" : "mc-th mc-th-root";
    const th = headerRow1.createEl("th", { cls });
    th.setAttribute("data-col-id", col.id);
    th.setText(col.heading);
    addHideButton(th, col.id, onHideColumn);
    if (col.childrenIds.length > 0) {
      th.setAttribute("colspan", String(col.childrenIds.length));
    } else {
      th.setAttribute("rowspan", "2");
    }
  }
  const headerRow2 = thead.createEl("tr");
  for (const col of columns) {
    if (col.childrenIds.length > 0) {
      for (const childId of col.childrenIds) {
        const childHeading = childId.split("/")[1] || childId;
        const th = headerRow2.createEl("th", { cls: "mc-th mc-th-child" });
        th.setAttribute("data-col-id", childId);
        th.setText(childHeading);
        addHideButton(th, childId, onHideColumn);
      }
    }
  }
  const tbody = table.createEl("tbody");
  for (const condition of conditions) {
    const row = tbody.createEl("tr");
    row.setAttribute("data-row-id", condition.id);
    const nameTd = row.createEl("td", { cls: "mc-td-condition" });
    nameTd.setAttribute("data-col-id", "col-condition");
    const nameLink = nameTd.createEl("a", { cls: "mc-condition-link" });
    nameLink.createEl("strong", { text: condition.name });
    nameLink.addEventListener("click", (e) => {
      e.stopPropagation();
      app.workspace.openLinkText(condition.path, "", false);
    });
    if (onCompareDiff) {
      const cmpBtn = nameTd.createSpan({ cls: "mc-diff-cmp-btn" });
      cmpBtn.innerHTML = DIFF_COMPARE_ICON_SVG;
      cmpBtn.setAttribute("aria-label", "Compare differentials");
      cmpBtn.setAttribute("title", "Compare differentials");
      cmpBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        onCompareDiff(condition.path);
      });
    }
    if (tagProps && tagProps.length > 0) {
      const tagsWrap = nameTd.createDiv({ cls: "mc-cond-tags" });
      let anyTag = false;
      for (const tp of tagProps) {
        const vals = condition.meta[tp.name] || [];
        for (const v of vals) {
          if (!v) continue;
          anyTag = true;
          const chip = tagsWrap.createSpan({ cls: "mc-cond-tag", text: v });
          if (tp.color) {
            chip.style.backgroundColor = tagColorFor(tp.color);
          }
        }
      }
      if (!anyTag) tagsWrap.remove();
    }
    for (const spec of leafSpecs) {
      if (spec.type === "content") {
        const td = row.createEl("td", { cls: "mc-td" });
        td.setAttribute("data-col-id", spec.id);
        const cellContent = condition.content[spec.contentKey];
        if (cellContent) {
          makeEditable(td, app, condition.path, spec.contentKey, vault, onSave, cellContent.lines, spec.enableRedFlags);
        } else {
          makeEditable(td, app, condition.path, spec.contentKey, vault, onSave, [], spec.enableRedFlags);
        }
      } else if (spec.type === "differentials") {
        const td = row.createEl("td", { cls: "mc-td" });
        td.setAttribute("data-col-id", spec.id);
        if (condition.differentials.length > 0) {
          const list = td.createEl("ul", { cls: "mc-diff-list" });
          for (const diff of condition.differentials) {
            const li = list.createEl("li");
            const parts = diff.split("|");
            const target = parts[0].trim();
            const alias = parts.length > 1 ? parts[1].trim() : "";
            const file = app.metadataCache.getFirstLinkpathDest(target, "");
            if (file) {
              const link = li.createEl("a", { cls: "mc-diff-link" });
              link.setText(alias || target);
              link.addEventListener("click", (e) => {
                e.stopPropagation();
                openNote(app, target);
              });
            } else {
              li.setText(alias || target);
            }
          }
        }
      } else if (spec.type === "additionalNotes") {
        const td = row.createEl("td", { cls: "mc-td" });
        td.setAttribute("data-col-id", spec.id);
        const notesLines = parseAdditionalNotes(condition.additionalNotes);
        makeEditable(td, app, condition.path, "Additional Notes", vault, onSave, notesLines, true);
      } else if (spec.type === "redFlags") {
        const td = row.createEl("td", { cls: "mc-td mc-td-rf" });
        td.setAttribute("data-col-id", spec.id);
        renderRedFlagsColumn(td, condition, vault, onSave);
      }
    }
  }
  applyColumnWidths(table, columnWidths);
  applyRowHeights(table, rowHeights);
  autoFitConditionColumn(table, conditions);
  attachResize(table, onColumnResize, onRowResize);
  attachColumnReorder(table, columns, onColumnReorder);
  if (dockedBar) container.insertBefore(dockedBar, container.firstChild);
}
function rfVisible(text) {
  let out = text;
  let guard = 0;
  while (out.indexOf("%%") >= 0 && guard < 50) {
    const o = out.indexOf("%%");
    const c = out.indexOf("%%", o + 2);
    if (c < 0) break;
    const inner = out.slice(o + 2, c);
    const sep = inner.indexOf("|");
    const phrase = sep >= 0 ? inner.slice(0, sep).trim() : "";
    out = out.slice(0, o) + " " + phrase + " " + out.slice(c + 2);
    guard++;
  }
  const gt = out.indexOf(" >> ");
  if (gt >= 0) out = out.slice(0, gt);
  return out.replace(/\s{2,}/g, " ").trim();
}
function parseAdditionalNotes(raw) {
  if (!raw) return [];
  return raw.split("\n").filter((l) => l.trim().length > 0).map((l) => {
    let text = l.trim();
    let redFlag = false;
    if (text.endsWith("<!-- rf -->")) {
      redFlag = true;
      text = text.replace("<!-- rf -->", "").trim();
    }
    return { text, redFlag };
  });
}
function renderRedFlagsColumn(td, condition, vault, onSave) {
  const list = td.createEl("ul", { cls: "mc-rf-list" });
  let hasFlags = false;
  for (const key of Object.keys(condition.content)) {
    const cell = condition.content[key];
    for (let i = 0; i < cell.lines.length; i++) {
      if (cell.lines[i].redFlag) {
        hasFlags = true;
        const line = cell.lines[i];
        const li = list.createEl("li", { cls: "mc-rf-item" });
        const flag = li.createSpan({ cls: "mc-red-flag-toggle is-active" });
        flag.innerHTML = FLAG_ICON_SVG;
        const textSpan = li.createSpan({ cls: "mc-rf-text" });
        textSpan.setText(rfVisible(line.text));
        flag.addEventListener("click", (e) => {
          e.stopPropagation();
          cell.lines[i].redFlag = false;
          const file = vault.getAbstractFileByPath(condition.path);
          if (file instanceof import_obsidian4.TFile) {
            writeCellToFile(vault, file, key, cell.lines).then(() => onSave());
          }
        });
      }
    }
  }
  const notesLines = parseAdditionalNotes(condition.additionalNotes);
  for (let i = 0; i < notesLines.length; i++) {
    if (notesLines[i].redFlag) {
      hasFlags = true;
      const line = notesLines[i];
      const li = list.createEl("li", { cls: "mc-rf-item" });
      const flag = li.createSpan({ cls: "mc-red-flag-toggle is-active" });
      flag.innerHTML = FLAG_ICON_SVG;
      const textSpan = li.createSpan({ cls: "mc-rf-text" });
      textSpan.setText(rfVisible(line.text));
      flag.addEventListener("click", (e) => {
        e.stopPropagation();
        notesLines[i].redFlag = false;
        const file = vault.getAbstractFileByPath(condition.path);
        if (file instanceof import_obsidian4.TFile) {
          writeCellToFile(vault, file, "Additional Notes", notesLines).then(() => onSave());
        }
      });
    }
  }
  if (!hasFlags) {
    list.remove();
    td.createEl("em", { text: "None", cls: "mc-muted" });
  }
}
function openNote(app, noteName) {
  const file = app.metadataCache.getFirstLinkpathDest(noteName, "");
  if (file) {
    app.workspace.openLinkText(file.path, "", false);
  } else {
    new import_obsidian4.Notice('Note "' + noteName + '" not found');
  }
}

// src/table/sidebar.ts
var import_obsidian5 = require("obsidian");
var savedViewsHeight = 160;
var FilterInfoModal = class extends import_obsidian5.Modal {
  constructor(app, view, conditions) {
    super(app);
    this.view = view;
    this.conditions = conditions;
  }
  onOpen() {
    this.contentEl.empty();
    this.titleEl.setText("Filters: " + this.view.name);
    const content = this.contentEl.createDiv({ cls: "mc-filter-info" });
    if (this.view.searchQuery && this.view.searchQuery.trim() !== "") {
      const searchSection = content.createDiv({ cls: "mc-filter-info-section" });
      searchSection.createDiv({ text: "Search by Condition", cls: "mc-filter-info-title" });
      searchSection.createDiv({ text: this.view.searchQuery, cls: "mc-filter-info-value" });
    }
    if (this.view.propertyFilters) {
      for (const propName of Object.keys(this.view.propertyFilters)) {
        const filter = this.view.propertyFilters[propName];
        if (filter.values && filter.values.length > 0) {
          const propSection = content.createDiv({ cls: "mc-filter-info-section" });
          propSection.createDiv({ text: propName, cls: "mc-filter-info-title" });
          const valuesDiv = propSection.createDiv({ cls: "mc-filter-info-values" });
          for (const v of filter.values) {
            valuesDiv.createDiv({ text: v, cls: "mc-filter-info-value" });
          }
          propSection.createDiv({ text: "Match: " + filter.matchMode, cls: "mc-filter-info-match" });
        }
      }
    }
    const condSection = content.createDiv({ cls: "mc-filter-info-section" });
    condSection.createDiv({ text: "Included Conditions (" + this.view.includedConditions.length + ")", cls: "mc-filter-info-title" });
    for (const id of this.view.includedConditions) {
      const condition = this.conditions.find((c) => c.id === id);
      condSection.createDiv({ text: condition ? condition.name : id, cls: "mc-filter-info-condition" });
    }
    const closeBtn = this.contentEl.createEl("button", { text: "Close", cls: "mc-sidebar-btn" });
    closeBtn.addEventListener("click", () => this.close());
  }
  onClose() {
    this.contentEl.empty();
  }
};
var ComparisonSidebar = class {
  constructor(container, conditions, properties, savedViews, app, callbacks, initialCheckedIds = /* @__PURE__ */ new Set()) {
    this.searchQuery = "";
    this.propertyFilters = {};
    this.searchInput = null;
    this.propSectionsEl = null;
    this.listEl = null;
    this.selectAllBtn = null;
    this.saveViewArea = null;
    this.savedViewsEl = null;
    this.editingViewId = null;
    this.propSelectAllBtns = /* @__PURE__ */ new Map();
    this.propBadges = /* @__PURE__ */ new Map();
    this.container = container;
    this.conditions = conditions;
    this.properties = properties;
    this.savedViews = savedViews;
    this.app = app;
    this.callbacks = callbacks;
    this.checkedIds = new Set(initialCheckedIds);
    for (const prop of this.properties) {
      this.propertyFilters[prop.name] = {
        values: /* @__PURE__ */ new Set(),
        matchMode: "any",
        collapsed: true
      };
    }
  }
  render() {
    this.container.empty();
    this.container.addClass("mc-sidebar");
    const searchDiv = this.container.createDiv({ cls: "mc-sidebar-search" });
    this.searchInput = searchDiv.createEl("input", {
      type: "text",
      placeholder: "Search conditions...",
      cls: "mc-sidebar-search-input"
    });
    this.searchInput.value = this.searchQuery;
    this.searchInput.addEventListener("input", () => {
      this.searchQuery = this.searchInput.value;
      this.renderList();
    });
    const scrollRegion = this.container.createDiv({ cls: "mc-sidebar-scroll" });
    this.propSectionsEl = scrollRegion.createDiv({ cls: "mc-prop-sections" });
    this.renderPropertySections();
    this.listEl = scrollRegion.createDiv({ cls: "mc-sidebar-list" });
    this.renderList();
    const actionsDiv = this.container.createDiv({ cls: "mc-sidebar-actions" });
    this.selectAllBtn = actionsDiv.createEl("button", {
      text: "Select All",
      cls: "mc-sidebar-btn"
    });
    this.selectAllBtn.addEventListener("click", () => this.toggleSelectAll());
    const applyBtn = actionsDiv.createEl("button", {
      text: "Apply",
      cls: "mc-sidebar-btn mc-sidebar-apply"
    });
    applyBtn.addEventListener("click", () => {
      this.callbacks.onApply(Array.from(this.checkedIds));
    });
    this.saveViewArea = this.container.createDiv({ cls: "mc-save-view-area" });
    this.showSaveViewButton();
    const savedViewsSection = this.container.createDiv({ cls: "mc-saved-views-section" });
    const resizer = savedViewsSection.createDiv({ cls: "mc-saved-views-resizer" });
    resizer.setAttribute("title", "Drag up to show more saved views");
    const svHeader = savedViewsSection.createDiv({ text: "Saved Views", cls: "mc-saved-views-header" });
    this.savedViewsEl = savedViewsSection.createDiv({ cls: "mc-saved-views-list" });
    this.renderSavedViews();
    this.attachSavedViewsResize(savedViewsSection, resizer, svHeader);
    savedViewsSection.style.height = savedViewsHeight + "px";
  }
  renderPropertySections() {
    if (!this.propSectionsEl) return;
    this.propSectionsEl.empty();
    this.propSelectAllBtns.clear();
    this.propBadges.clear();
    for (const prop of this.properties) {
      const filter = this.propertyFilters[prop.name];
      if (!filter) continue;
      const section = this.propSectionsEl.createDiv({ cls: "mc-prop-section" });
      if (filter.collapsed) section.addClass("collapsed");
      const header = section.createDiv({ cls: "mc-prop-section-header" });
      header.createSpan({ text: "\u25BC", cls: "mc-prop-section-arrow" });
      header.createSpan({ text: prop.name });
      if (filter.values.size > 0) {
        const badge = header.createSpan({ text: String(filter.values.size), cls: "mc-prop-section-badge" });
        this.propBadges.set(prop.name, badge);
      } else {
        const badge = header.createSpan({ text: "", cls: "mc-prop-section-badge" });
        badge.style.display = "none";
        this.propBadges.set(prop.name, badge);
      }
      header.addEventListener("click", () => {
        filter.collapsed = !filter.collapsed;
        if (filter.collapsed) section.addClass("collapsed");
        else section.removeClass("collapsed");
      });
      const contentDiv = section.createDiv({ cls: "mc-prop-section-content" });
      const modeToggle = contentDiv.createDiv({ cls: "mc-sidebar-match-mode" });
      const anyBtn = modeToggle.createEl("button", { text: "Any", cls: "mc-sidebar-match-btn" });
      const allBtn = modeToggle.createEl("button", { text: "All", cls: "mc-sidebar-match-btn" });
      if (filter.matchMode === "any") anyBtn.addClass("is-active");
      else allBtn.addClass("is-active");
      anyBtn.addEventListener("click", () => {
        filter.matchMode = "any";
        anyBtn.addClass("is-active");
        allBtn.removeClass("is-active");
        this.renderList();
      });
      allBtn.addEventListener("click", () => {
        filter.matchMode = "all";
        allBtn.addClass("is-active");
        anyBtn.removeClass("is-active");
        this.renderList();
      });
      const propSelectAll = contentDiv.createEl("button", {
        text: "Select All",
        cls: "mc-sidebar-btn mc-prop-select-all"
      });
      this.propSelectAllBtns.set(prop.name, propSelectAll);
      propSelectAll.addEventListener("click", () => this.toggleSelectAllPropertyValues(prop.name));
      const allValues = /* @__PURE__ */ new Set();
      for (const condition of this.conditions) {
        const values = condition.meta[prop.name] || [];
        for (const v of values) allValues.add(v);
      }
      const valuesList = contentDiv.createDiv({ cls: "mc-sidebar-prop-values" });
      if (allValues.size === 0) {
        valuesList.createDiv({ text: "No values found.", cls: "mc-sidebar-empty" });
      } else {
        for (const value of Array.from(allValues).sort()) {
          const item = valuesList.createDiv({ cls: "mc-sidebar-prop-value" });
          const label = item.createEl("label", { cls: "mc-sidebar-item-label" });
          const checkbox = label.createEl("input", { type: "checkbox", cls: "mc-sidebar-checkbox" });
          checkbox.checked = filter.values.has(value);
          checkbox.addEventListener("change", () => {
            if (checkbox.checked) filter.values.add(value);
            else filter.values.delete(value);
            this.updatePropBadge(prop.name);
            this.updatePropSelectAllButton(prop.name);
            this.renderList();
          });
          label.createSpan({ text: value });
        }
      }
      this.updatePropSelectAllButton(prop.name);
    }
  }
  toggleSelectAllPropertyValues(propName) {
    const filter = this.propertyFilters[propName];
    if (!filter) return;
    const allValues = /* @__PURE__ */ new Set();
    for (const condition of this.conditions) {
      const values = condition.meta[propName] || [];
      for (const v of values) allValues.add(v);
    }
    if (allValues.size === 0) return;
    const allSelected = Array.from(allValues).every((v) => filter.values.has(v));
    if (allSelected) {
      for (const v of allValues) filter.values.delete(v);
    } else {
      filter.values.clear();
      for (const v of allValues) filter.values.add(v);
    }
    this.renderPropertySections();
    this.renderList();
  }
  updatePropSelectAllButton(propName) {
    const btn = this.propSelectAllBtns.get(propName);
    if (!btn) return;
    const filter = this.propertyFilters[propName];
    if (!filter) return;
    const allValues = /* @__PURE__ */ new Set();
    for (const condition of this.conditions) {
      const values = condition.meta[propName] || [];
      for (const v of values) allValues.add(v);
    }
    if (allValues.size === 0) {
      btn.textContent = "Select All";
      return;
    }
    const allSelected = Array.from(allValues).every((v) => filter.values.has(v));
    btn.textContent = allSelected ? "Deselect All" : "Select All";
  }
  updatePropBadge(propName) {
    const badge = this.propBadges.get(propName);
    if (!badge) return;
    const filter = this.propertyFilters[propName];
    if (!filter) return;
    if (filter.values.size > 0) {
      badge.textContent = String(filter.values.size);
      badge.style.display = "";
    } else {
      badge.style.display = "none";
    }
  }
  getFilteredConditions() {
    let filtered = this.conditions;
    if (this.searchQuery.trim() !== "") {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(query));
    }
    for (const prop of this.properties) {
      const filter = this.propertyFilters[prop.name];
      if (filter && filter.values.size > 0) {
        filtered = filtered.filter((c) => {
          const values = c.meta[prop.name] || [];
          if (filter.matchMode === "any") {
            return Array.from(filter.values).some((v) => values.includes(v));
          } else {
            return Array.from(filter.values).every((v) => values.includes(v));
          }
        });
      }
    }
    return filtered;
  }
  renderList() {
    if (!this.listEl) return;
    this.listEl.empty();
    const filtered = this.getFilteredConditions();
    if (filtered.length === 0) {
      const hasFilters = this.searchQuery.trim() !== "" || Object.values(this.propertyFilters).some((f) => f.values.size > 0);
      this.listEl.createDiv({
        text: hasFilters ? "No conditions match." : "Search conditions...",
        cls: "mc-sidebar-empty"
      });
      if (this.selectAllBtn) this.selectAllBtn.textContent = "Select All";
      return;
    }
    for (const condition of filtered) {
      const item = this.listEl.createDiv({ cls: "mc-sidebar-item" });
      item.dataset.conditionId = condition.id;
      const label = item.createEl("label", { cls: "mc-sidebar-item-label" });
      const checkbox = label.createEl("input", { type: "checkbox", cls: "mc-sidebar-checkbox" });
      checkbox.checked = this.checkedIds.has(condition.id);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) this.checkedIds.add(condition.id);
        else this.checkedIds.delete(condition.id);
        this.updateSelectAllButton();
      });
      label.createSpan({ text: condition.name });
    }
    this.updateSelectAllButton();
  }
  toggleSelectAll() {
    const filtered = this.getFilteredConditions();
    if (filtered.length === 0) return;
    const allChecked = filtered.every((c) => this.checkedIds.has(c.id));
    if (allChecked) {
      for (const c of filtered) this.checkedIds.delete(c.id);
    } else {
      for (const c of filtered) this.checkedIds.add(c.id);
    }
    this.renderList();
  }
  updateSelectAllButton() {
    if (!this.selectAllBtn) return;
    const filtered = this.getFilteredConditions();
    if (filtered.length === 0) {
      this.selectAllBtn.textContent = "Select All";
      return;
    }
    const allChecked = filtered.every((c) => this.checkedIds.has(c.id));
    this.selectAllBtn.textContent = allChecked ? "Deselect All" : "Select All";
  }
  showSaveViewButton() {
    if (!this.saveViewArea) return;
    this.saveViewArea.empty();
    if (this.editingViewId) {
      const updateBtn = this.saveViewArea.createEl("button", {
        text: "Update View",
        cls: "mc-sidebar-btn mc-save-view-btn"
      });
      updateBtn.addEventListener("click", () => {
        this.callbacks.onUpdateView(this.editingViewId, this.getState());
        this.editingViewId = null;
        this.showSaveViewButton();
      });
    } else {
      const saveBtn = this.saveViewArea.createEl("button", {
        text: "Save View",
        cls: "mc-sidebar-btn mc-save-view-btn"
      });
      saveBtn.addEventListener("click", () => this.showSaveNameInput());
    }
  }
  showSaveNameInput() {
    if (!this.saveViewArea) return;
    this.saveViewArea.empty();
    const inputRow = this.saveViewArea.createDiv({ cls: "mc-save-view-input-row" });
    const nameInput = inputRow.createEl("input", {
      type: "text",
      placeholder: "View name...",
      cls: "mc-sidebar-search-input"
    });
    nameInput.focus();
    const btnRow = this.saveViewArea.createDiv({ cls: "mc-save-view-btn-row" });
    const confirmBtn = btnRow.createEl("button", {
      text: "Save",
      cls: "mc-sidebar-btn mc-sidebar-apply"
    });
    const doSave = () => {
      const name = nameInput.value.trim();
      if (name) {
        this.callbacks.onSaveView(name, this.getState());
        this.showSaveViewButton();
      }
    };
    confirmBtn.addEventListener("click", doSave);
    const cancelBtn = btnRow.createEl("button", {
      text: "Cancel",
      cls: "mc-sidebar-btn"
    });
    cancelBtn.addEventListener("click", () => this.showSaveViewButton());
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSave();
      if (e.key === "Escape") this.showSaveViewButton();
    });
  }
  renderSavedViews() {
    if (!this.savedViewsEl) return;
    this.savedViewsEl.empty();
    if (this.savedViews.length === 0) {
      this.savedViewsEl.createDiv({ text: "No saved views", cls: "mc-sidebar-empty" });
      return;
    }
    for (const view of this.savedViews) {
      const viewEl = this.savedViewsEl.createDiv({ cls: "mc-saved-view-item" });
      viewEl.dataset.viewId = view.id;
      viewEl.createSpan({ text: view.name });
      viewEl.addEventListener("click", () => this.loadView(view));
      viewEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const menu = new import_obsidian5.Menu();
        menu.addItem((item) => {
          item.setTitle("See filters").setIcon("eye").onClick(() => {
            new FilterInfoModal(this.app, view, this.conditions).open();
          });
        });
        menu.addItem((item) => {
          item.setTitle("Edit filters").setIcon("pencil").onClick(() => {
            this.editView(view);
          });
        });
        menu.addItem((item) => {
          item.setTitle("Delete").setIcon("trash").onClick(() => {
            this.callbacks.onDeleteView(view.id);
          });
        });
        menu.showAtMouseEvent(e);
      });
    }
  }
  attachSavedViewsResize(section, resizer, header) {
    let resizing = false;
    let startY = 0;
    let startH = 0;
    let maxH = 320;
    const onDown = (e) => {
      resizing = true;
      startY = e.clientY;
      startH = section.getBoundingClientRect().height;
      const parent = section.parentElement;
      if (parent) {
        let fixed = 0;
        for (const el of Array.from(parent.children)) {
          if (el === section) continue;
          if (el.classList.contains("mc-sidebar-scroll")) continue;
          fixed += el.offsetHeight;
        }
        maxH = Math.max(120, parent.clientHeight - fixed - 70);
      }
      e.preventDefault();
      e.stopPropagation();
    };
    resizer.addEventListener("mousedown", onDown, true);
    header.addEventListener("mousedown", onDown, true);
    const onTouchDown = (e) => {
      resizing = true;
      startY = e.touches[0].clientY;
      startH = section.getBoundingClientRect().height;
      const parent = section.parentElement;
      if (parent) {
        let fixed = 0;
        for (const el of Array.from(parent.children)) {
          if (el === section) continue;
          if (el.classList.contains("mc-sidebar-scroll")) continue;
          fixed += el.offsetHeight;
        }
        maxH = Math.max(120, parent.clientHeight - fixed - 70);
      }
      e.preventDefault();
    };
    resizer.addEventListener("touchstart", onTouchDown, { passive: false });
    header.addEventListener("touchstart", onTouchDown, { passive: false });
    const onTouchMove = (e) => {
      if (!resizing) return;
      e.preventDefault();
      const dy = startY - e.touches[0].clientY;
      const h = Math.max(80, Math.min(maxH, Math.round(startH + dy)));
      section.style.height = h + "px";
    };
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    const onTouchUp = () => {
      if (!resizing) return;
      resizing = false;
      savedViewsHeight = Math.round(section.getBoundingClientRect().height);
    };
    document.addEventListener("touchend", onTouchUp, true);
    const onMove = (e) => {
      if (!resizing) return;
      const dy = startY - e.clientY;
      const h = Math.max(80, Math.min(maxH, Math.round(startH + dy)));
      section.style.height = h + "px";
    };
    const onUp = () => {
      if (!resizing) return;
      resizing = false;
      const h = Math.round(section.getBoundingClientRect().height);
      savedViewsHeight = h;
    };
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("mouseup", onUp, true);
  }
  updateSavedViews(views) {
    this.savedViews = views;
    this.renderSavedViews();
  }
  getState() {
    const filters = {};
    for (const [name, filter] of Object.entries(this.propertyFilters)) {
      filters[name] = {
        values: Array.from(filter.values),
        matchMode: filter.matchMode
      };
    }
    return {
      searchQuery: this.searchQuery,
      propertyFilters: filters,
      checkedIds: Array.from(this.checkedIds)
    };
  }
  loadState(state) {
    var _a;
    this.searchQuery = state.searchQuery || "";
    this.checkedIds = new Set(state.checkedIds || []);
    for (const prop of this.properties) {
      const saved = (_a = state.propertyFilters) == null ? void 0 : _a[prop.name];
      if (saved) {
        this.propertyFilters[prop.name] = {
          values: new Set(saved.values),
          matchMode: saved.matchMode,
          collapsed: false
        };
      } else {
        this.propertyFilters[prop.name] = {
          values: /* @__PURE__ */ new Set(),
          matchMode: "any",
          collapsed: true
        };
      }
    }
    if (this.searchInput) this.searchInput.value = this.searchQuery;
    this.renderPropertySections();
    this.renderList();
  }
  loadView(view) {
    this.editingViewId = null;
    this.showSaveViewButton();
    this.loadState({
      searchQuery: view.searchQuery || "",
      propertyFilters: view.propertyFilters || {},
      checkedIds: view.includedConditions || []
    });
    this.callbacks.onApply(view.includedConditions || []);
  }
  editView(view) {
    this.editingViewId = view.id;
    this.showSaveViewButton();
    this.loadState({
      searchQuery: view.searchQuery || "",
      propertyFilters: view.propertyFilters || {},
      checkedIds: view.includedConditions || []
    });
  }
  refresh(conditions) {
    this.conditions = conditions;
    const currentIds = new Set(conditions.map((c) => c.id));
    for (const id of Array.from(this.checkedIds)) {
      if (!currentIds.has(id)) this.checkedIds.delete(id);
    }
    for (const prop of this.properties) {
      const filter = this.propertyFilters[prop.name];
      if (!filter) continue;
      const allValues = /* @__PURE__ */ new Set();
      for (const condition of conditions) {
        const values = condition.meta[prop.name] || [];
        for (const v of values) allValues.add(v);
      }
      for (const v of Array.from(filter.values)) {
        if (!allValues.has(v)) filter.values.delete(v);
      }
    }
    this.renderPropertySections();
    this.renderList();
  }
};

// src/table/findBar.ts
var import_obsidian6 = require("obsidian");
var DEBOUNCE_MS = 150;
var HL_ALL = "mc-find";
var HL_CURRENT = "mc-find-current";
var activeBar = null;
function toggleFindBar(plugin) {
  if (activeBar) {
    if (activeBar.isConnected()) {
      activeBar.focusInput();
      return;
    }
    activeBar.dispose();
    activeBar = null;
  }
  const leaves = plugin.app.workspace.getLeavesOfType(VIEW_TYPE_COMPARISON);
  if (leaves.length === 0) {
    new import_obsidian6.Notice("Open the comparison table first");
    return;
  }
  const view = leaves[0].view;
  activeBar = new FindBar(view.contentEl, plugin.settings.defaultZoom);
}
var FindBar = class {
  constructor(containerEl, zoom) {
    this.tableEl = null;
    this.ranges = [];
    this.current = -1;
    this.debounceTimer = null;
    this.observer = null;
    this.containerEl = containerEl;
    this.zoom = zoom > 0 ? zoom : 1;
    this.supportsHighlightAPI = typeof CSS !== "undefined" && !!CSS.highlights && typeof window.Highlight === "function";
    this.barEl = document.createElement("div");
    this.barEl.className = "mc-find-bar";
    this.inputEl = this.barEl.createEl("input", {
      cls: "mc-find-input",
      type: "text",
      placeholder: "Find in table..."
    });
    this.counterEl = this.barEl.createSpan({ cls: "mc-find-counter", text: "" });
    const prevBtn = this.barEl.createEl("button", { text: "\u2191", cls: "mc-find-btn" });
    prevBtn.setAttribute("aria-label", "Previous match");
    prevBtn.setAttribute("title", "Previous match (Shift+Enter)");
    const nextBtn = this.barEl.createEl("button", { text: "\u2193", cls: "mc-find-btn" });
    nextBtn.setAttribute("aria-label", "Next match");
    nextBtn.setAttribute("title", "Next match (Enter)");
    const closeBtn = this.barEl.createEl("button", { text: "\u2715", cls: "mc-find-btn" });
    closeBtn.setAttribute("aria-label", "Close find bar");
    closeBtn.setAttribute("title", "Close (Esc)");
    document.body.appendChild(this.barEl);
    this.inputEl.addEventListener("input", () => this.scheduleRun(true));
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.goToRelative(e.shiftKey ? -1 : 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.dispose();
      }
    });
    prevBtn.addEventListener("click", () => this.goToRelative(-1));
    nextBtn.addEventListener("click", () => this.goToRelative(1));
    closeBtn.addEventListener("click", () => this.dispose());
    this.observer = new MutationObserver(() => this.scheduleRun(false));
    this.observer.observe(this.containerEl, { childList: true, subtree: true, characterData: true });
    this.focusInput();
  }
  isConnected() {
    return this.barEl.isConnected && this.containerEl.isConnected;
  }
  focusInput() {
    this.inputEl.focus();
    this.inputEl.select();
  }
  scheduleRun(jump) {
    if (this.debounceTimer !== null) window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => {
      this.debounceTimer = null;
      this.run(jump);
    }, DEBOUNCE_MS);
  }
  run(jump) {
    this.clearPaint();
    this.tableEl = this.containerEl.querySelector(".mc-table");
    const q = this.inputEl.value.trim();
    if (!q || !this.tableEl) {
      this.ranges = [];
      this.current = -1;
      this.updateCounter();
      return;
    }
    this.ranges = this.collectRanges(q);
    if (this.ranges.length > 0) {
      if (this.supportsHighlightAPI) {
        try {
          CSS.highlights.set(HL_ALL, new window.Highlight(...this.ranges));
        } catch (err) {
          this.supportsHighlightAPI = false;
          this.fallbackPaintAll();
        }
      } else {
        this.fallbackPaintAll();
      }
    }
    this.updateCounter();
    if (jump) {
      this.current = this.ranges.length > 0 ? 0 : -1;
    } else if (this.current >= this.ranges.length) {
      this.current = this.ranges.length - 1;
    }
    this.paintCurrent();
  }
  collectRanges(query) {
    const out = [];
    if (!this.tableEl) return out;
    const walker = document.createTreeWalker(this.tableEl, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n = walker.nextNode();
    while (n) {
      const t = n;
      if (t.nodeValue && t.nodeValue.trim().length > 0) nodes.push(t);
      n = walker.nextNode();
    }
    const q = query.toLowerCase();
    for (const node of nodes) {
      const hay = (node.nodeValue || "").toLowerCase();
      let idx = hay.indexOf(q);
      while (idx >= 0) {
        const r = document.createRange();
        r.setStart(node, idx);
        r.setEnd(node, idx + q.length);
        out.push(r);
        idx = hay.indexOf(q, idx + q.length);
      }
    }
    return out;
  }
  fallbackPaintAll() {
    for (const r of this.ranges) {
      const el = r.startContainer.parentElement;
      const td = el ? el.closest("td, th") : null;
      if (td) td.addClass("mc-find-cell");
    }
  }
  paintCurrent() {
    if (this.supportsHighlightAPI) {
      CSS.highlights.delete(HL_CURRENT);
      const r = this.current >= 0 ? this.ranges[this.current] : null;
      if (r) {
        try {
          const hl = new window.Highlight(r);
          hl.priority = 1;
          CSS.highlights.set(HL_CURRENT, hl);
        } catch (err) {
        }
      }
    } else {
      const cells = this.containerEl.querySelectorAll(".mc-find-cell-current");
      for (const c of Array.from(cells)) c.removeClass("mc-find-cell-current");
      const r = this.current >= 0 ? this.ranges[this.current] : null;
      if (r) {
        const el = r.startContainer.parentElement;
        const td = el ? el.closest("td, th") : null;
        if (td) td.addClass("mc-find-cell-current");
      }
    }
    this.updateCounter();
  }
  clearPaint() {
    if (this.supportsHighlightAPI) {
      CSS.highlights.delete(HL_ALL);
      CSS.highlights.delete(HL_CURRENT);
    }
    const cells = this.containerEl.querySelectorAll(".mc-find-cell, .mc-find-cell-current");
    for (const c of Array.from(cells)) {
      c.removeClass("mc-find-cell");
      c.removeClass("mc-find-cell-current");
    }
  }
  goToRelative(delta) {
    if (this.ranges.length === 0) return;
    let next = this.current + delta;
    if (next < 0) next = this.ranges.length - 1;
    if (next >= this.ranges.length) next = 0;
    this.current = next;
    this.paintCurrent();
    this.scrollToCurrent();
  }
  scrollToCurrent() {
    if (this.current < 0 || !this.ranges[this.current] || !this.tableEl) return;
    const rect = this.ranges[this.current].getBoundingClientRect();
    const scroller = this.tableEl.closest(".mc-table-container");
    if (!scroller) return;
    const sRect = scroller.getBoundingClientRect();
    scroller.scrollTop += (rect.top - sRect.top - 60) / this.zoom;
    scroller.scrollLeft += (rect.left - sRect.left - 80) / this.zoom;
  }
  updateCounter() {
    const q = this.inputEl.value.trim();
    if (!q) {
      this.counterEl.setText("");
      return;
    }
    if (this.ranges.length === 0) {
      this.counterEl.setText("0/0");
      return;
    }
    const shown = this.current >= 0 ? this.current + 1 : 0;
    this.counterEl.setText(shown + "/" + this.ranges.length);
  }
  dispose() {
    if (this.debounceTimer !== null) window.clearTimeout(this.debounceTimer);
    if (this.observer) this.observer.disconnect();
    this.clearPaint();
    this.barEl.remove();
    if (activeBar === this) activeBar = null;
  }
};

// src/storage/templateManager.ts
var import_obsidian7 = require("obsidian");
async function applyTemplateToCurrentPage(app, templateHeadings, comparisonTag) {
  const activeView = app.workspace.getActiveViewOfType(import_obsidian7.MarkdownView);
  if (!activeView || !activeView.file) {
    new import_obsidian7.Notice("No active Markdown file");
    return;
  }
  const file = activeView.file;
  const content = await app.vault.read(file);
  let newContent = reconstructFile(content, [], templateHeadings);
  if (comparisonTag) newContent = upsertComparisonTag(newContent, comparisonTag);
  await app.vault.modify(file, newContent);
  new import_obsidian7.Notice("Template applied to current page");
}
async function updateAllPages(app, templateName, oldTemplate, newTemplate) {
  const files = app.vault.getMarkdownFiles().filter((f) => hasComparisonTag(app, f, templateName));
  let count = 0;
  for (const file of files) {
    const content = await app.vault.read(file);
    const newContent = reconstructFile(content, oldTemplate, newTemplate);
    if (newContent !== content) {
      await app.vault.modify(file, newContent);
      count++;
    }
  }
  new import_obsidian7.Notice(`Updated ${count} pages`);
}
function hasComparisonTag(app, file, templateName) {
  var _a;
  if (!templateName) return false;
  const fm = (_a = app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
  const val = fm == null ? void 0 : fm.Comparison;
  if (val === void 0 || val === null) return false;
  const wanted = templateName.trim().toLowerCase();
  if (Array.isArray(val)) {
    return val.some((v) => String(v).trim().toLowerCase() === wanted);
  }
  return String(val).trim().toLowerCase() === wanted;
}
function parseTagList(raw) {
  const out = [];
  let s = raw.trim();
  if (s.startsWith("[") && s.endsWith("]")) s = s.slice(1, -1);
  for (const part of s.split(",")) {
    const v = part.trim().replace(/^["']/, "").replace(/["']$/, "");
    if (v) out.push(v);
  }
  return out;
}
function serializeTagList(names) {
  if (names.length === 1) return names[0];
  return "[" + names.join(", ") + "]";
}
function upsertComparisonTag(content, tagName) {
  if (!tagName) return content;
  if (!content.startsWith("---")) {
    return "---\nComparison: " + tagName + "\n---\n\n" + content;
  }
  const end = content.indexOf("---", 3);
  if (end === -1) return content;
  const fmLines = content.slice(0, end).split("\n");
  const rest = content.slice(end + 3);
  let found = -1;
  for (let i = 1; i < fmLines.length; i++) {
    if (/^comparison\s*:/i.test(fmLines[i])) {
      found = i;
      break;
    }
  }
  if (found === -1) {
    fmLines.splice(1, 0, "Comparison: " + tagName);
  } else {
    const names = parseTagList(fmLines[found].replace(/^comparison\s*:\s*/i, ""));
    if (!names.some((n) => n.toLowerCase() === tagName.toLowerCase())) {
      names.push(tagName);
    }
    fmLines[found] = "Comparison: " + serializeTagList(names);
  }
  return fmLines.join("\n") + "---" + rest;
}
function renameTagInContent(content, oldName, newName) {
  if (!content.startsWith("---")) return content;
  const end = content.indexOf("---", 3);
  if (end === -1) return content;
  const fmLines = content.slice(0, end).split("\n");
  const rest = content.slice(end + 3);
  for (let i = 1; i < fmLines.length; i++) {
    if (!/^comparison\s*:/i.test(fmLines[i])) continue;
    const names = parseTagList(fmLines[i].replace(/^comparison\s*:\s*/i, ""));
    let changed = false;
    for (let j = 0; j < names.length; j++) {
      if (names[j].toLowerCase() === oldName.toLowerCase()) {
        names[j] = newName;
        changed = true;
      }
    }
    if (!changed) return content;
    fmLines[i] = "Comparison: " + serializeTagList(names);
    return fmLines.join("\n") + "---" + rest;
  }
  return content;
}
async function renameComparisonTag(app, oldName, newName) {
  if (!oldName || !newName || oldName === newName) return 0;
  let count = 0;
  for (const file of app.vault.getMarkdownFiles()) {
    if (!hasComparisonTag(app, file, oldName)) continue;
    const content = await app.vault.read(file);
    const next = renameTagInContent(content, oldName, newName);
    if (next !== content) {
      await app.vault.modify(file, next);
      count++;
    }
  }
  return count;
}
async function migrateFoldersToTags(app, templates) {
  let tagged = 0;
  let already = 0;
  for (const template of templates) {
    if (!template.folder || !template.name) continue;
    const folder = app.vault.getAbstractFileByPath(template.folder);
    if (!folder || !(folder instanceof import_obsidian7.TFolder)) continue;
    const files = folder.children.filter((f) => f instanceof import_obsidian7.TFile && f.extension === "md");
    for (const file of files) {
      if (hasComparisonTag(app, file, template.name)) {
        already++;
        continue;
      }
      const content = await app.vault.read(file);
      const next = upsertComparisonTag(content, template.name);
      if (next !== content) {
        await app.vault.modify(file, next);
        tagged++;
      }
    }
  }
  new import_obsidian7.Notice("Migration done: tagged " + tagged + ", already tagged " + already);
}
function reconstructFile(fileContent, oldTemplate, newTemplate) {
  let frontmatter = "";
  let body = fileContent;
  if (fileContent.startsWith("---")) {
    const end = fileContent.indexOf("---", 3);
    if (end !== -1) {
      frontmatter = fileContent.slice(0, end + 3);
      body = fileContent.slice(end + 3).trim();
    }
  }
  let title = "";
  const titleMatch = body.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    title = `# ${titleMatch[1].trim()}`;
    body = body.replace(/^#\s+.+$/m, "").trim();
  }
  const contentMap = /* @__PURE__ */ new Map();
  const lines = body.split("\n");
  let currentRoot = "";
  let currentChild = "";
  let currentBody = [];
  const saveSection = () => {
    if (currentRoot) {
      const key = currentChild ? `${currentRoot}/${currentChild}` : currentRoot;
      contentMap.set(key, currentBody.join("\n").trim());
    }
    currentBody = [];
  };
  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      saveSection();
      currentRoot = h2Match[1].trim();
      currentChild = "";
      continue;
    }
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      saveSection();
      currentChild = h3Match[1].trim();
      continue;
    }
    currentBody.push(line);
  }
  saveSection();
  const idToOldKey = /* @__PURE__ */ new Map();
  let lastOldRoot = "";
  for (const h of oldTemplate) {
    if (h.level === 2) {
      lastOldRoot = h.text;
      idToOldKey.set(h.id, h.text);
    } else {
      idToOldKey.set(h.id, `${lastOldRoot}/${h.text}`);
    }
  }
  const result = [];
  if (frontmatter) {
    result.push(frontmatter);
    result.push("");
  }
  if (title) {
    result.push(title);
    result.push("");
  }
  let newLastRoot = "";
  let currentKey = "";
  for (let i = 0; i < newTemplate.length; i++) {
    const h = newTemplate[i];
    if (currentKey) {
      const content = contentMap.get(currentKey);
      if (content) result.push(content);
    }
    if (h.level === 2) {
      newLastRoot = h.text;
      result.push(`## ${h.text}`);
      currentKey = idToOldKey.get(h.id) || h.text;
    } else {
      result.push(`### ${h.text}`);
      currentKey = idToOldKey.get(h.id) || `${newLastRoot}/${h.text}`;
    }
  }
  if (currentKey) {
    const content = contentMap.get(currentKey);
    if (content) result.push(content);
  }
  return result.join("\n").trim() + "\n";
}

// src/views/diffCompareView.ts
var import_obsidian8 = require("obsidian");
var VIEW_TYPE_DIFF_COMPARE = "medical-diff-compare-view";
async function openDiffView(app, conditionPath) {
  const file = app.vault.getAbstractFileByPath(conditionPath);
  if (!(file instanceof import_obsidian8.TFile)) {
    new import_obsidian8.Notice('Note "' + conditionPath + '" not found');
    return;
  }
  const workspace = app.workspace;
  const leaf = workspace.getLeaf("tab");
  await leaf.setViewState({ type: VIEW_TYPE_DIFF_COMPARE, state: { file: conditionPath } });
  const view = leaf.view;
  if (view instanceof DiffCompareView) {
    await view.setCondition(conditionPath);
  }
  workspace.setActiveLeaf(leaf, { focus: true });
}
var DiffCompareView = class extends import_obsidian8.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.conditionPath = "";
    this.conditions = [];
    this.primaryName = "";
    this.opened = false;
    this.plugin = plugin;
  }
  async setCondition(path) {
    if (path && path !== this.conditionPath) {
      this.conditionPath = path;
      if (this.opened) await this.refresh();
    }
  }
  getViewType() {
    return VIEW_TYPE_DIFF_COMPARE;
  }
  getDisplayText() {
    return this.primaryName ? this.primaryName + " Differentials" : "Differential Comparison";
  }
  getIcon() {
    return "git-compare";
  }
  async setState(state, result) {
    const prev = this.conditionPath;
    if (state && state.file) this.conditionPath = state.file;
    await super.setState(state, result);
    if (this.opened && this.conditionPath && this.conditionPath !== prev) {
      await this.refresh();
    }
  }
  async onOpen() {
    this.opened = true;
    await this.refresh();
  }
  async refresh() {
    this.contentEl.empty();
    this.contentEl.addClass("medical-comparison-view");
    if (!this.conditionPath) {
      this.contentEl.createDiv({ text: "No condition note loaded.", cls: "mc-empty-state" });
      return;
    }
    await this.loadConditions();
    this.render();
  }
  /** Parse the primary note, then resolve and parse each differential it lists. */
  async loadConditions() {
    const file = this.app.vault.getAbstractFileByPath(this.conditionPath);
    if (!(file instanceof import_obsidian8.TFile)) {
      this.contentEl.createDiv({ text: "Note not found: " + this.conditionPath, cls: "mc-empty-state" });
      return;
    }
    const props = this.plugin.settings.properties;
    const primary = parseCondition(file, await this.app.vault.read(file), this.app.metadataCache, props);
    this.primaryName = primary.name;
    this.conditions = [primary];
    const missing = [];
    for (const diff of primary.differentials) {
      const target = diff.split("|")[0].trim();
      const dest = this.app.metadataCache.getFirstLinkpathDest(target, "");
      if (dest && dest instanceof import_obsidian8.TFile) {
        this.conditions.push(parseCondition(dest, await this.app.vault.read(dest), this.app.metadataCache, props));
      } else {
        missing.push(diff);
      }
    }
    if (missing.length > 0) {
      new import_obsidian8.Notice("Skipped missing notes: " + missing.join(", "));
    }
  }
  getColumns() {
    const template = this.plugin.settings.templates.find((t) => t.id === this.plugin.activeTemplateId) || this.plugin.settings.templates[0];
    if (template) return buildColumnsFromTemplate(template.headings);
    return buildColumnTree(this.conditions);
  }
  /** Store this comparison as a Saved View inside the main table's sidebar. */
  saveView() {
    const newView = {
      id: Date.now().toString(),
      name: this.primaryName + " Differentials",
      searchQuery: "",
      propertyFilters: {},
      includedConditions: this.conditions.map((c) => c.id),
      collapsedColumns: [],
      columnOrder: [],
      columnWidths: {},
      createdAt: Date.now()
    };
    this.plugin.settings.savedViews.push(newView);
    void this.plugin.saveSettings();
    new import_obsidian8.Notice("View saved: " + newView.name);
  }
  render() {
    const contentEl = this.contentEl;
    contentEl.empty();
    contentEl.addClass("medical-comparison-view");
    const topbar = contentEl.createDiv({ cls: "mc-view-topbar" });
    topbar.createSpan({ cls: "mc-diffview-title", text: this.primaryName + " - differentials" });
    const saveBtn = topbar.createEl("button", { text: "Save view", cls: "mc-sidebar-toggle" });
    saveBtn.addEventListener("click", () => this.saveView());
    const main = contentEl.createDiv({ cls: "mc-view-container" });
    const tableContainer = main.createDiv({ cls: "mc-table-container" });
    renderDiffTable(tableContainer, this.conditions, this.conditionPath, this.getColumns(), this.app);
  }
};
function diffSpecType(heading) {
  if (heading === "Differential Diagnoses") return "differentials";
  if (heading === "Additional Notes") return "additionalNotes";
  if (heading === "Red Flags") return "redFlags";
  return "content";
}
function buildDiffSpecs(columns) {
  const specs = [];
  for (const col of columns) {
    const type = diffSpecType(col.heading);
    if (col.childrenIds.length > 0) {
      for (const childId of col.childrenIds) {
        const childHeading = childId.split("/")[1] || childId;
        specs.push({
          id: childId,
          heading: childHeading,
          type: "content",
          contentKey: childId.replace(/^col-/, "")
        });
      }
    } else {
      specs.push({
        id: col.id,
        heading: col.heading,
        type,
        contentKey: col.id.replace(/^col-/, "")
      });
    }
  }
  return specs;
}
function renderDiffLinks(parent, text, app) {
  const re = /\[\[([^\]]+)\]\]/g;
  let cursor = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > cursor) {
      parent.createSpan({ cls: "mc-line-plain", text: text.slice(cursor, m.index) });
    }
    const parts = m[1].split("|");
    const target = parts[0].trim();
    const alias = parts.length > 1 ? parts[1].trim() : "";
    const link = parent.createSpan({ cls: "mc-cell-link", text: alias || target });
    link.addEventListener("click", (e) => {
      e.stopPropagation();
      app.workspace.openLinkText(target, "", false);
    });
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) {
    parent.createSpan({ cls: "mc-line-plain", text: text.slice(cursor) });
  }
}
function renderAnnotatedText(parent, text, app) {
  const anns = findAllAnnotations(text);
  if (anns.length === 0) {
    renderDiffLinks(parent, text, app);
    return;
  }
  let cursor = 0;
  for (const ann of anns) {
    if (ann.open > cursor) {
      renderDiffLinks(parent, text.slice(cursor, ann.open), app);
    }
    parent.createSpan({ cls: "mc-ann-phrase", text: ann.phrase });
    cursor = ann.close + 2;
  }
  if (cursor < text.length) {
    renderDiffLinks(parent, text.slice(cursor), app);
  }
}
function renderReadOnlyCell(td, lines, app) {
  const wrap = td.createDiv({ cls: "mc-cell-lines" });
  for (const line of lines) {
    const row = wrap.createDiv({ cls: "mc-cell-line" });
    if (line.redFlag) {
      const f = row.createSpan({ cls: "mc-red-flag-toggle is-active" });
      f.innerHTML = FLAG_ICON_SVG;
    }
    renderAnnotatedText(row.createSpan({ cls: "mc-line-flow" }), line.text, app);
  }
}
function renderStaticRedFlags(td, condition) {
  const list = td.createEl("ul", { cls: "mc-rf-list" });
  let has = false;
  for (const key of Object.keys(condition.content)) {
    for (const line of condition.content[key].lines) {
      if (line.redFlag) {
        has = true;
        const li = list.createEl("li", { cls: "mc-rf-item" });
        const flag = li.createSpan({ cls: "mc-red-flag-toggle is-active" });
        flag.innerHTML = FLAG_ICON_SVG;
        li.createSpan({ cls: "mc-rf-text", text: rfStripLine2(line.text) });
      }
    }
  }
  const notesLines = condition.additionalNotes ? condition.additionalNotes.split("\n").filter((l) => l.trim()).map((l) => ({ text: l.trim(), redFlag: l.trim().endsWith("<!-- rf -->") })) : [];
  for (const line of notesLines) {
    if (line.redFlag) {
      has = true;
      const li = list.createEl("li", { cls: "mc-rf-item" });
      const flag = li.createSpan({ cls: "mc-red-flag-toggle is-active" });
      flag.innerHTML = FLAG_ICON_SVG;
      li.createSpan({ cls: "mc-rf-text", text: rfStripLine2(line.text) });
    }
  }
  if (!has) {
    list.remove();
    td.createEl("em", { text: "None", cls: "mc-muted" });
  }
}
function renderDiffTable(container, conditions, primaryPath, columns, app) {
  container.empty();
  const wrapper = container.createDiv({ cls: "mc-table-wrapper" });
  const table = wrapper.createEl("table", { cls: "mc-table" });
  const specs = buildDiffSpecs(columns);
  const thead = table.createEl("thead");
  const headerRow1 = thead.createEl("tr");
  const conditionTh = headerRow1.createEl("th", { cls: "mc-th-condition" });
  conditionTh.setText("Condition");
  conditionTh.setAttribute("rowspan", "2");
  for (const col of columns) {
    const cls = diffSpecType(col.heading) === "redFlags" ? "mc-th mc-th-rf" : "mc-th";
    const th = headerRow1.createEl("th", { cls });
    th.setText(col.heading);
    if (col.childrenIds.length > 0) {
      th.setAttribute("colspan", String(col.childrenIds.length));
    } else {
      th.setAttribute("rowspan", "2");
    }
  }
  const headerRow2 = thead.createEl("tr");
  for (const col of columns) {
    for (const childId of col.childrenIds) {
      const th = headerRow2.createEl("th", { cls: "mc-th mc-th-child" });
      th.setText(childId.split("/")[1] || childId);
    }
  }
  const tbody = table.createEl("tbody");
  for (const condition of conditions) {
    const row = tbody.createEl("tr");
    if (condition.path === primaryPath) row.addClass("mc-diff-row-primary");
    const nameTd = row.createEl("td", { cls: "mc-td-condition" });
    const nameLink = nameTd.createEl("a", { cls: "mc-condition-link" });
    nameLink.createEl("strong", { text: condition.name });
    nameLink.addEventListener("click", (e) => {
      e.stopPropagation();
      app.workspace.openLinkText(condition.path, "", false);
    });
    for (const spec of specs) {
      if (spec.type === "content") {
        const td = row.createEl("td", { cls: "mc-td" });
        const cell = condition.content[spec.contentKey];
        renderReadOnlyCell(td, cell ? cell.lines : [], app);
      } else if (spec.type === "differentials") {
        const td = row.createEl("td", { cls: "mc-td" });
        if (condition.differentials.length > 0) {
          const list = td.createEl("ul", { cls: "mc-diff-list" });
          for (const diff of condition.differentials) {
            const li = list.createEl("li");
            const parts = diff.split("|");
            const target = parts[0].trim();
            const alias = parts.length > 1 ? parts[1].trim() : "";
            const dest = app.metadataCache.getFirstLinkpathDest(target, "");
            if (dest) {
              const link = li.createEl("a", { cls: "mc-diff-link" });
              link.setText(alias || target);
              link.addEventListener("click", (e) => {
                e.stopPropagation();
                app.workspace.openLinkText(dest.path, "", false);
              });
            } else {
              li.setText(alias || target);
            }
          }
        }
      } else if (spec.type === "additionalNotes") {
        const td = row.createEl("td", { cls: "mc-td" });
        const notesLines = condition.additionalNotes ? condition.additionalNotes.split("\n").filter((l) => l.trim()).map((l) => ({
          text: l.trim().replace("<!-- rf -->", "").trim(),
          redFlag: l.trim().endsWith("<!-- rf -->")
        })) : [];
        renderReadOnlyCell(td, notesLines, app);
      } else if (spec.type === "redFlags") {
        const td = row.createEl("td", { cls: "mc-td mc-td-rf" });
        renderStaticRedFlags(td, condition);
      }
    }
  }
}

// src/views/comparisonView.ts
var VIEW_TYPE_COMPARISON = "medical-comparison-view";
var FIND_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
var JUMP_ICON_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
var ComparisonView = class _ComparisonView extends import_obsidian9.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.conditions = [];
    this.columns = [];
    this.activeTemplateId = "";
    this.isRendering = false;
    this.needsRerender = false;
    this.includedConditions = /* @__PURE__ */ new Set();
    this.hiddenColumnIds = /* @__PURE__ */ new Set();
    this.columnWidths = {};
    this.rowHeights = {};
    this.columnOrder = [];
    this.sidebar = null;
    this.sidebarCollapsed = false;
    this.colPanelCleanup = null;
    this.kbHandler = null;
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_COMPARISON;
  }
  getDisplayText() {
    return "Medical Comparison";
  }
  getIcon() {
    return "table";
  }
  bindKeyboardViewport() {
    if (this.kbHandler) return;
    if (!import_obsidian9.Platform.isMobile) return;
    const onIn = (ev) => {
      const t = ev.target;
      if (!(t instanceof HTMLElement)) return;
      if (!t.hasClass("mc-cell-editor")) return;
      window.setTimeout(() => {
        this.kbScrollEditorIntoView();
      }, 350);
    };
    const onOut = (ev) => {
      const t = ev.target;
      if (!(t instanceof HTMLElement)) return;
      if (!t.hasClass("mc-cell-editor")) return;
      window.scrollTo(0, 0);
    };
    this.contentEl.addEventListener("focusin", onIn);
    this.contentEl.addEventListener("focusout", onOut);
    this.kbHandler = () => {
      this.contentEl.removeEventListener("focusin", onIn);
      this.contentEl.removeEventListener("focusout", onOut);
    };
  }
  kbScrollEditorIntoView() {
    const wrap = this.contentEl.querySelector(".mc-table-wrapper");
    const editing = this.contentEl.querySelector(".mc-cell-editor");
    if (!(wrap instanceof HTMLElement)) return;
    if (!(editing instanceof HTMLElement)) return;
    const wr = wrap.getBoundingClientRect();
    const er = editing.getBoundingClientRect();
    const want = wrap.scrollTop + (er.top - wr.top) - 40;
    const maxScroll = wrap.scrollHeight - wrap.clientHeight;
    const target = Math.min(Math.round(want), Math.max(0, maxScroll));
    wrap.scrollTop = Math.max(0, target);
  }
  async onOpen() {
    this.bindKeyboardViewport();
    this.sidebarCollapsed = window.innerWidth < 600;
    if (this.plugin.activeTemplateId) {
      this.activeTemplateId = this.plugin.activeTemplateId;
    } else if (this.plugin.settings.templates.length > 0) {
      this.activeTemplateId = this.plugin.settings.templates[0].id;
    }
    await this.loadAndRender();
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (file instanceof import_obsidian9.TFile && hasComparisonTag(this.app, file, this.getCurrentTemplateName())) {
          this.loadAndRender();
        }
      })
    );
  }
  async onClose() {
    this.closeColumnPanel();
    if (this.kbHandler) {
      this.kbHandler();
      this.kbHandler = null;
    }
  }
  setTemplate(templateId) {
    this.activeTemplateId = templateId;
    this.conditions = [];
    this.includedConditions = /* @__PURE__ */ new Set();
    this.hiddenColumnIds = /* @__PURE__ */ new Set();
    this.columnWidths = {};
    this.rowHeights = {};
    this.columnOrder = [];
    this.sidebar = null;
    this.loadAndRender();
  }
  getCurrentTemplateName() {
    const template = this.plugin.settings.templates.find((t) => t.id === this.activeTemplateId);
    return (template == null ? void 0 : template.name) || "";
  }
  getTagProperties() {
    const template = this.plugin.settings.templates.find((t) => t.id === this.activeTemplateId);
    const names = template && template.properties.length > 0 ? template.properties : this.plugin.settings.properties.map((p) => p.name);
    const byName = new Map(this.plugin.settings.properties.map((p) => [p.name, p]));
    return names.map((n) => {
      var _a;
      return { name: n, color: (_a = byName.get(n)) == null ? void 0 : _a.color };
    });
  }
  async loadAndRender() {
    if (this.isRendering) {
      this.needsRerender = true;
      return;
    }
    this.isRendering = true;
    const existingWrapper = this.contentEl.querySelector(".mc-table-wrapper");
    let savedScrollTop = 0;
    let savedScrollLeft = 0;
    if (existingWrapper) {
      savedScrollTop = existingWrapper.scrollTop;
      savedScrollLeft = existingWrapper.scrollLeft;
    }
    let savedSearch = "";
    const searchInput = this.contentEl.querySelector(".mc-sidebar-search-input");
    if (searchInput) savedSearch = searchInput.value;
    try {
      const contentEl = this.contentEl;
      if (this.conditions.length === 0) {
        contentEl.empty();
        contentEl.createDiv({ text: "Loading conditions..." });
      }
      await this.loadConditions();
      const template = this.plugin.settings.templates.find((t) => t.id === this.activeTemplateId);
      if (template) {
        this.columns = buildColumnsFromTemplate(template.headings);
      } else {
        this.columns = buildColumnTree(this.conditions);
      }
      this.applyColumnOrder();
      contentEl.empty();
      contentEl.addClass("medical-comparison-view");
      const topbar = contentEl.createDiv({ cls: "mc-view-topbar" });
      const toggleBtn = topbar.createEl("button", { cls: "mc-sidebar-toggle" });
      toggleBtn.setText("Filters");
      toggleBtn.addEventListener("click", () => {
        this.sidebarCollapsed = !this.sidebarCollapsed;
        this.updateSidebarVisibility();
      });
      const columnsBtn = topbar.createEl("button", { cls: "mc-sidebar-toggle mc-columns-toggle" });
      columnsBtn.setText("Columns");
      columnsBtn.setAttribute("aria-label", "Show or hide columns");
      columnsBtn.setAttribute("title", "Show or hide columns");
      columnsBtn.addEventListener("click", () => {
        this.openColumnPanel(columnsBtn);
      });
      const findBtn = topbar.createEl("button", { cls: "mc-sidebar-toggle mc-find-toggle" });
      findBtn.innerHTML = FIND_ICON_SVG;
      findBtn.setAttribute("aria-label", "Find in table");
      findBtn.setAttribute("title", "Find in table");
      findBtn.addEventListener("click", () => {
        toggleFindBar(this.plugin);
      });
      const mainContainer = contentEl.createDiv({ cls: "mc-view-container" });
      const sidebarEl = mainContainer.createDiv({ cls: "mc-sidebar" });
      this.sidebar = new ComparisonSidebar(
        sidebarEl,
        this.conditions,
        this.plugin.settings.properties,
        this.plugin.settings.savedViews,
        this.app,
        {
          onApply: (checkedIds) => {
            this.includedConditions = new Set(checkedIds);
            this.renderTableOnly();
          },
          onSaveView: (name, state) => {
            const newView = {
              id: Date.now().toString(),
              name,
              searchQuery: state.searchQuery || "",
              propertyFilters: state.propertyFilters || {},
              includedConditions: state.checkedIds || [],
              collapsedColumns: [],
              columnOrder: [],
              columnWidths: {},
              createdAt: Date.now()
            };
            this.plugin.settings.savedViews.push(newView);
            this.plugin.saveSettings();
            this.sidebar.updateSavedViews(this.plugin.settings.savedViews);
            new import_obsidian9.Notice("View saved: " + name);
          },
          onUpdateView: (viewId, state) => {
            const view = this.plugin.settings.savedViews.find((v) => v.id === viewId);
            if (view) {
              view.searchQuery = state.searchQuery || "";
              view.propertyFilters = state.propertyFilters || {};
              view.includedConditions = state.checkedIds || [];
              this.plugin.saveSettings();
              new import_obsidian9.Notice("View updated");
            }
          },
          onDeleteView: (viewId) => {
            this.plugin.settings.savedViews = this.plugin.settings.savedViews.filter((v) => v.id !== viewId);
            this.plugin.saveSettings();
            this.sidebar.updateSavedViews(this.plugin.settings.savedViews);
            new import_obsidian9.Notice("View deleted");
          }
        },
        this.includedConditions
      );
      this.sidebar.render();
      if (savedSearch) {
        const input = sidebarEl.querySelector(".mc-sidebar-search-input");
        if (input) {
          input.value = savedSearch;
          input.dispatchEvent(new Event("input"));
        }
      }
      const tableContainer = mainContainer.createDiv({ cls: "mc-table-container" });
      this.renderTableInContainer(tableContainer);
      this.updateSidebarVisibility();
      const newWrapper = contentEl.querySelector(".mc-table-wrapper");
      if (newWrapper) {
        newWrapper.scrollTop = savedScrollTop;
        newWrapper.scrollLeft = savedScrollLeft;
      }
    } catch (e) {
      this.contentEl.empty();
      this.contentEl.createDiv({ text: "Error loading conditions: " + e.message });
    } finally {
      this.isRendering = false;
      if (this.needsRerender) {
        this.needsRerender = false;
        this.loadAndRender();
      }
    }
  }
  applyColumnOrder() {
    if (this.columnOrder.length === 0) return;
    const byId = new Map(this.columns.map((c) => [c.id, c]));
    const ordered = [];
    const seen = /* @__PURE__ */ new Set();
    for (const id of this.columnOrder) {
      const c = byId.get(id);
      if (c) {
        ordered.push(c);
        seen.add(c.id);
      }
    }
    for (const c of this.columns) {
      if (!seen.has(c.id)) ordered.push(c);
    }
    this.columns = ordered;
  }
  handleColumnReorder(fromId, toId, side) {
    const fromIdx = this.columns.findIndex((c) => c.id === fromId);
    const toIdx = this.columns.findIndex((c) => c.id === toId);
    if (fromIdx < 0 || toIdx < 0) return;
    const moved = this.columns.splice(fromIdx, 1)[0];
    const insertIdx = this.columns.findIndex((c) => c.id === toId);
    const finalIdx = side === "before" ? insertIdx : insertIdx + 1;
    this.columns.splice(finalIdx, 0, moved);
    this.columnOrder = this.columns.map((c) => c.id);
    this.renderTableOnly();
  }
  getColumns() {
    return this.columns;
  }
  isColumnVisible(colId) {
    const root = this.columns.find((c) => c.id === colId);
    if (root) {
      if (this.hiddenColumnIds.has(root.id)) return false;
      if (root.childrenIds.length > 0) {
        return root.childrenIds.some((cid) => !this.hiddenColumnIds.has(cid));
      }
      return true;
    }
    for (const c of this.columns) {
      if (c.childrenIds.indexOf(colId) >= 0) {
        return !this.hiddenColumnIds.has(colId) && !this.hiddenColumnIds.has(c.id);
      }
    }
    return false;
  }
  setColumnHidden(colId, hidden) {
    const root = this.columns.find((c) => c.id === colId);
    if (root) {
      if (hidden) {
        this.hiddenColumnIds.add(root.id);
      } else {
        this.hiddenColumnIds.delete(root.id);
        for (const cid of root.childrenIds) {
          this.hiddenColumnIds.delete(cid);
        }
      }
    } else {
      if (hidden) {
        this.hiddenColumnIds.add(colId);
      } else {
        this.hiddenColumnIds.delete(colId);
        for (const c of this.columns) {
          if (c.childrenIds.indexOf(colId) >= 0) {
            this.hiddenColumnIds.delete(c.id);
          }
        }
      }
    }
    this.renderTableOnly();
  }
  closeColumnPanel() {
    if (this.colPanelCleanup) {
      this.colPanelCleanup();
      this.colPanelCleanup = null;
    }
  }
  openColumnPanel(anchorBtn) {
    this.closeColumnPanel();
    const panel = document.body.createDiv({ cls: "mc-col-menu" });
    const renderPanel = () => {
      panel.empty();
      const header = panel.createDiv({ cls: "mc-col-menu-header" });
      header.setText("Columns");
      for (const col of this.columns) {
        const rootRow = panel.createDiv({ cls: "mc-col-menu-row mc-col-menu-root" });
        const rootCb = rootRow.createEl("input", { type: "checkbox" });
        rootCb.checked = this.isColumnVisible(col.id);
        rootRow.createSpan({ text: col.heading });
        this.addJumpBtn(rootRow, col.id);
        rootCb.addEventListener("change", () => {
          this.setColumnHidden(col.id, !rootCb.checked);
          renderPanel();
        });
        for (const childId of col.childrenIds) {
          const childHeading = childId.split("/")[1] || childId;
          const childRow = panel.createDiv({ cls: "mc-col-menu-row mc-col-menu-child" });
          const childCb = childRow.createEl("input", { type: "checkbox" });
          childCb.checked = this.isColumnVisible(childId);
          childRow.createSpan({ text: childHeading });
          this.addJumpBtn(childRow, childId);
          childCb.addEventListener("change", () => {
            this.setColumnHidden(childId, !childCb.checked);
            renderPanel();
          });
        }
      }
      const doneRow = panel.createDiv({ cls: "mc-col-menu-done-row" });
      const doneBtn = doneRow.createEl("button", { text: "Done", cls: "mc-col-menu-done" });
      doneBtn.addEventListener("click", () => {
        this.closeColumnPanel();
      });
    };
    renderPanel();
    const rect = anchorBtn.getBoundingClientRect();
    panel.style.top = rect.bottom + 6 + "px";
    panel.style.left = Math.max(8, rect.left) + "px";
    const onDocMouseDown = (e) => {
      const target = e.target;
      if (panel.contains(target)) return;
      if (anchorBtn.contains(target)) return;
      this.closeColumnPanel();
    };
    document.addEventListener("mousedown", onDocMouseDown, true);
    this.colPanelCleanup = () => {
      panel.remove();
      document.removeEventListener("mousedown", onDocMouseDown, true);
    };
  }
  addJumpBtn(row, colId) {
    const btn = row.createEl("button", { cls: "mc-col-jump-btn" });
    btn.innerHTML = JUMP_ICON_SVG;
    btn.setAttribute("aria-label", "Jump to column");
    btn.setAttribute("title", "Jump to column");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.jumpToColumn(colId);
    });
  }
  jumpToColumn(colId) {
    const wrap = this.contentEl.querySelector(".mc-table-wrapper");
    const th = this.contentEl.querySelector(
      'th[data-col-id="' + colId + '"]'
    );
    if (!(wrap instanceof HTMLElement)) return;
    if (!(th instanceof HTMLElement)) return;
    const z = parseFloat(getComputedStyle(wrap).zoom) || 1;
    const wr = wrap.getBoundingClientRect();
    const tr = th.getBoundingClientRect();
    const want = wrap.scrollLeft + (tr.left - wr.left) / z - 8;
    const maxL = wrap.scrollWidth - wrap.clientWidth;
    const left = Math.max(
      0,
      Math.min(Math.round(want), Math.max(0, maxL))
    );
    wrap.scrollTo({ left, behavior: "smooth" });
    this.closeColumnPanel();
  }
  getVisibleColumns() {
    const out = [];
    for (const col of this.columns) {
      if (this.hiddenColumnIds.has(col.id)) continue;
      if (col.childrenIds.length > 0) {
        const visibleChildren = col.childrenIds.filter((cid) => !this.hiddenColumnIds.has(cid));
        if (visibleChildren.length === 0) continue;
        out.push({ ...col, childrenIds: visibleChildren });
      } else {
        out.push(col);
      }
    }
    return out;
  }
  renderTableInContainer(container) {
    container.empty();
    const visibleConditions = this.conditions.filter((c) => this.includedConditions.has(c.id));
    if (visibleConditions.length === 0) {
      container.createDiv({ text: "Select conditions from the sidebar and click Apply.", cls: "mc-empty-state" });
    } else {
      renderTable(
        container,
        visibleConditions,
        this.getVisibleColumns(),
        this.app.vault,
        this.app,
        () => {
          this.loadAndRender();
        },
        (colId) => {
          this.setColumnHidden(colId, true);
        },
        this.columnWidths,
        (colId, width) => {
          this.columnWidths[colId] = width;
        },
        this.rowHeights,
        (rowId, height) => {
          this.rowHeights[rowId] = height;
        },
        this.getTagProperties(),
        (fromId, toId, side) => {
          this.handleColumnReorder(fromId, toId, side);
        },
        (conditionPath) => {
          void openDiffView(this.app, conditionPath);
        }
      );
    }
  }
  renderTableOnly() {
    const tableContainer = this.contentEl.querySelector(".mc-table-container");
    if (!tableContainer) return;
    const oldWrapper = tableContainer.querySelector(".mc-table-wrapper");
    const savedTop = oldWrapper ? oldWrapper.scrollTop : 0;
    const savedLeft = oldWrapper ? oldWrapper.scrollLeft : 0;
    this.renderTableInContainer(tableContainer);
    const newWrapper = tableContainer.querySelector(".mc-table-wrapper");
    if (newWrapper) {
      newWrapper.scrollTop = savedTop;
      newWrapper.scrollLeft = savedLeft;
    }
  }
  updateSidebarVisibility() {
    const sidebar = this.contentEl.querySelector(".mc-sidebar");
    if (sidebar) {
      sidebar.style.display = this.sidebarCollapsed ? "none" : "";
    }
  }
  async loadConditions() {
    this.conditions = [];
    const templateName = this.getCurrentTemplateName();
    const files = this.app.vault.getMarkdownFiles().filter((f) => hasComparisonTag(this.app, f, templateName));
    if (files.length === 0) {
      new import_obsidian9.Notice('No notes are tagged Comparison: "' + templateName + '"');
      return;
    }
    for (const file of files) {
      const fileContent = await this.app.vault.read(file);
      const condition = parseCondition(file, fileContent, this.app.metadataCache, this.plugin.settings.properties);
      this.conditions.push(condition);
    }
  }
  async save() {
    new import_obsidian9.Notice("Changes are saved automatically");
  }
  async refresh() {
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian9.ItemView);
    if (activeView instanceof import_obsidian9.MarkdownView) {
      const file = activeView.file;
      if (file) {
        const content = await this.app.vault.read(file);
        activeView.editor.setValue(content);
        new import_obsidian9.Notice("Sheet refreshed");
      }
    } else if (activeView instanceof _ComparisonView) {
      this.conditions = [];
      await this.loadAndRender();
      new import_obsidian9.Notice("Table refreshed");
    } else {
      new import_obsidian9.Notice("No refreshable view active");
    }
  }
};

// src/toolbar/toolbar.ts
var import_obsidian14 = require("obsidian");

// src/dialogs/coreHeadingsModal.ts
var import_obsidian10 = require("obsidian");
var CoreHeadingsModal = class extends import_obsidian10.Modal {
  constructor(app, plugin, templateId) {
    super(app);
    this.dragIndex = null;
    this.plugin = plugin;
    this.templateId = templateId;
    const template = plugin.settings.templates.find((t) => t.id === templateId);
    if (template) {
      this.templateName = template.name;
      this.originalName = template.name;
      this.headings = JSON.parse(JSON.stringify(template.headings));
      this.originalHeadings = JSON.parse(JSON.stringify(template.headings));
    } else {
      this.templateName = "New Template";
      this.originalName = "New Template";
      this.headings = [];
      this.originalHeadings = [];
    }
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Edit Template" });
    const nameContainer = contentEl.createDiv({ cls: "mc-template-name-container" });
    nameContainer.createEl("label", { text: "Template Name: ", cls: "mc-template-name-label" });
    const nameInput = nameContainer.createEl("input", { type: "text", cls: "mc-template-name-input" });
    nameInput.value = this.templateName;
    nameInput.addEventListener("input", () => {
      this.templateName = nameInput.value;
    });
    contentEl.createEl("p", {
      text: "Drag to reorder. Use arrows to indent/outdent. Editing a name preserves content; adding a new heading starts empty.",
      cls: "mc-modal-desc"
    });
    const listContainer = contentEl.createDiv({ cls: "mc-template-list" });
    this.renderList(listContainer);
    const buttonContainer = contentEl.createDiv({ cls: "mc-modal-buttons" });
    new import_obsidian10.Setting(buttonContainer).addButton((btn) => btn.setButtonText("Delete Template").setWarning().onClick(async () => {
      const idx = this.plugin.settings.templates.findIndex((t) => t.id === this.templateId);
      if (idx >= 0) {
        this.plugin.settings.templates.splice(idx, 1);
        await this.plugin.saveSettings();
        new import_obsidian10.Notice("Template deleted");
        this.close();
      }
    }));
    new import_obsidian10.Setting(buttonContainer).addButton((btn) => btn.setButtonText("Save for Future Pages").setCta().onClick(async () => {
      await this.handleRename();
      this.saveTemplate();
      new import_obsidian10.Notice("Template saved for future pages");
      this.close();
    })).addButton((btn) => btn.setButtonText("Update All Pages & Save").onClick(async () => {
      const renamed = await this.handleRename();
      if (renamed) await new Promise((r) => {
        window.setTimeout(r, 500);
      });
      this.saveTemplate();
      new import_obsidian10.Notice("Updating all pages...");
      await updateAllPages(this.app, this.templateName, this.originalHeadings, this.headings);
      new import_obsidian10.Notice("All pages updated and template saved");
      this.close();
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
  /** Renaming a template renames its Comparison tag everywhere - no orphaned notes. */
  async handleRename() {
    const newName = this.templateName.trim();
    if (!newName || newName === this.originalName) return false;
    const count = await renameComparisonTag(this.app, this.originalName, newName);
    if (count > 0) new import_obsidian10.Notice("Renamed Comparison tag on " + count + " note(s)");
    this.originalName = newName;
    return true;
  }
  saveTemplate() {
    const template = this.plugin.settings.templates.find((t) => t.id === this.templateId);
    if (template) {
      template.name = this.templateName;
      template.headings = this.headings;
    }
    this.plugin.saveSettings();
  }
  renderList(container) {
    container.empty();
    this.headings.forEach((heading, index) => {
      const row = container.createDiv({ cls: "mc-template-row" });
      row.draggable = true;
      if (heading.level === 3) row.addClass("is-subheading");
      const handle = row.createSpan({ cls: "mc-drag-handle" });
      handle.innerHTML = "\u22EE\u22EE";
      row.addEventListener("dragstart", () => {
        this.dragIndex = index;
        row.addClass("is-dragging");
      });
      row.addEventListener("dragend", () => {
        this.dragIndex = null;
        row.removeClass("is-dragging");
      });
      row.addEventListener("dragover", (e) => {
        e.preventDefault();
        row.addClass("is-drop-target");
      });
      row.addEventListener("dragleave", () => {
        row.removeClass("is-drop-target");
      });
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        row.removeClass("is-drop-target");
        if (this.dragIndex !== null && this.dragIndex !== index) {
          const [moved] = this.headings.splice(this.dragIndex, 1);
          this.headings.splice(index, 0, moved);
          this.renderList(container);
        }
      });
      const input = row.createEl("input", { type: "text", cls: "mc-template-input" });
      input.value = heading.text;
      input.addEventListener("input", () => {
        this.headings[index].text = input.value;
      });
      const indentBtn = row.createEl("button", { text: "\u2192", cls: "mc-indent-btn" });
      indentBtn.disabled = heading.level === 3;
      indentBtn.addEventListener("click", () => {
        this.headings[index].level = 3;
        this.renderList(container);
      });
      const outdentBtn = row.createEl("button", { text: "\u2190", cls: "mc-outdent-btn" });
      outdentBtn.disabled = heading.level === 2;
      outdentBtn.addEventListener("click", () => {
        this.headings[index].level = 2;
        this.renderList(container);
      });
      const deleteBtn = row.createEl("button", { text: "\u2715", cls: "mc-delete-btn" });
      deleteBtn.addEventListener("click", () => {
        this.headings.splice(index, 1);
        this.renderList(container);
      });
    });
    const addBtn = container.createEl("button", { text: "+ Add Heading", cls: "mc-add-btn" });
    addBtn.addEventListener("click", () => {
      this.headings.push({ id: Date.now().toString(), text: "New Heading", level: 2 });
      this.renderList(container);
    });
  }
};

// src/dialogs/propertiesModal.ts
var import_obsidian12 = require("obsidian");

// src/storage/propertyManager.ts
var import_obsidian11 = require("obsidian");
async function insertPropertyIntoCurrentPage(app, propertyName) {
  const activeView = app.workspace.getActiveViewOfType(import_obsidian11.MarkdownView);
  if (!activeView || !activeView.file) {
    new import_obsidian11.Notice("No active Markdown file");
    return;
  }
  const file = activeView.file;
  await app.fileManager.processFrontMatter(file, (fm) => {
    if (fm[propertyName] === void 0) {
      fm[propertyName] = [];
    }
  });
  new import_obsidian11.Notice('Property "' + propertyName + '" inserted');
}
async function insertAllPropertiesIntoCurrentPage(app, properties) {
  const activeView = app.workspace.getActiveViewOfType(import_obsidian11.MarkdownView);
  if (!activeView || !activeView.file) {
    new import_obsidian11.Notice("No active Markdown file");
    return;
  }
  const file = activeView.file;
  await app.fileManager.processFrontMatter(file, (fm) => {
    for (const prop of properties) {
      if (fm[prop.name] === void 0) {
        fm[prop.name] = [];
      }
    }
  });
  new import_obsidian11.Notice("All properties inserted");
}

// src/dialogs/propertiesModal.ts
var PropertiesModal = class extends import_obsidian12.Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.properties = JSON.parse(JSON.stringify(plugin.settings.properties));
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Manage Properties" });
    contentEl.createEl("p", {
      text: "These are the frontmatter properties used for filtering. Click 'Insert' to add it to the current page.",
      cls: "mc-modal-desc"
    });
    const listContainer = contentEl.createDiv({ cls: "mc-template-list" });
    this.renderList(listContainer);
    const buttonContainer = contentEl.createDiv({ cls: "mc-modal-buttons" });
    new import_obsidian12.Setting(buttonContainer).addButton((btn) => btn.setButtonText("Insert All into Current Page").onClick(async () => {
      await insertAllPropertiesIntoCurrentPage(this.app, this.properties);
    })).addButton((btn) => btn.setButtonText("Save").setCta().onClick(async () => {
      this.plugin.settings.properties = this.properties;
      await this.plugin.saveSettings();
      new import_obsidian12.Notice("Properties saved");
      this.close();
    }));
  }
  onClose() {
    this.contentEl.empty();
  }
  renderList(container) {
    container.empty();
    this.properties.forEach((prop, index) => {
      const row = container.createDiv({ cls: "mc-template-row" });
      const input = row.createEl("input", { type: "text", cls: "mc-template-input" });
      input.value = prop.name;
      input.addEventListener("input", () => {
        this.properties[index].name = input.value;
      });
      const palette = row.createDiv({ cls: "mc-palette" });
      palette.setAttribute("title", "Tag colour");
      for (const c of PASTEL_PALETTE) {
        const dot = palette.createSpan({ cls: "mc-palette-dot" });
        dot.style.backgroundColor = tagColorFor(c);
        if (prop.color === c) dot.addClass("is-selected");
        dot.addEventListener("click", () => {
          this.properties[index].color = c;
          this.renderList(container);
        });
      }
      const insertBtn = row.createEl("button", { text: "Insert", cls: "mc-insert-btn" });
      insertBtn.addEventListener("click", async () => {
        await insertPropertyIntoCurrentPage(this.app, prop.name);
      });
      const deleteBtn = row.createEl("button", { text: "X", cls: "mc-delete-btn" });
      deleteBtn.addEventListener("click", () => {
        this.properties.splice(index, 1);
        this.renderList(container);
      });
    });
    const addBtn = container.createEl("button", { text: "+ Add Property", cls: "mc-add-btn" });
    addBtn.addEventListener("click", () => {
      this.properties.push({
        id: "prop-" + Date.now(),
        name: "New Property",
        color: PASTEL_PALETTE[Math.floor(Math.random() * PASTEL_PALETTE.length)]
      });
      this.renderList(container);
    });
  }
};

// src/editor/annotateCommand.ts
var import_obsidian13 = require("obsidian");
function annotateSelection(app) {
  const view = app.workspace.getActiveViewOfType(import_obsidian13.MarkdownView);
  if (!view) {
    new import_obsidian13.Notice("No active Markdown editor - open a note and select text");
    return;
  }
  const editor = view.editor;
  const sel = editor.getSelection();
  if (sel && sel.trim().length > 0 && sel.indexOf("\n") < 0 && sel.indexOf("%%") < 0) {
    const to = editor.getCursor("to");
    new AnnotationModal(app, {
      initial: "",
      onSave: (detail) => {
        editor.replaceSelection(buildMarker(sel, detail));
        editor.setCursor({ line: to.line, ch: to.ch + detail.length + 8 });
      }
    }).open();
    return;
  }
  const cursor = editor.getCursor("from");
  const lineNo = cursor.line;
  const line = editor.getLine(lineNo);
  const ann = findAnnotationAt(line, cursor.ch);
  if (ann) {
    new AnnotationModal(app, {
      initial: ann.detail,
      onSave: (detail) => {
        const merged = updateDetail(line, ann.occ, detail);
        editor.replaceRange(merged, { line: lineNo, ch: 0 }, { line: lineNo, ch: line.length });
      },
      onDelete: () => {
        const merged = removeAnnotation(line, ann.occ);
        editor.replaceRange(merged, { line: lineNo, ch: 0 }, { line: lineNo, ch: line.length });
      }
    }).open();
    return;
  }
  if (sel && sel.indexOf("\n") >= 0) {
    new import_obsidian13.Notice("Select within a single line");
    return;
  }
  new import_obsidian13.Notice("Select the phrase to annotate, or place the cursor inside an existing annotation");
}

// src/toolbar/toolbar.ts
var ZOOM_STYLE_ID = "mc-global-zoom-style";
var MIN_ZOOM = 0.5;
var MAX_ZOOM = 2;
var ZOOM_STEP = 0.1;
var REDO_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>';
var UNDO_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>';
var SAVE_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>';
var REFRESH_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>';
var CHEVRON_LEFT_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
var CHEVRON_RIGHT_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
var TABLE_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line></svg>';
var TEMPLATE_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="7" rx="1"></rect><rect x="3" y="14" width="8" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>';
var PROPERTIES_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>';
var ANNOTATE_ICON_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>';
var LOGO_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"></rect><line x1="3" y1="10" x2="21" y2="10"></line><line x1="9" y1="4" x2="9" y2="20"></line><line x1="14.5" y1="14.5" x2="14.5" y2="17.5"></line><line x1="13" y1="16" x2="16" y2="16"></line></svg>';
function clampZoom(zoom) {
  const rounded = Math.round(zoom * 100) / 100;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, rounded));
}
function applyToolbarButtonConfig(btn, key, icon, settings) {
  const labels = settings && settings.toolbarButtonLabels || {};
  const hiddenKeys = settings && settings.hiddenToolbarButtons || [];
  if (labels[key]) {
    btn.setText(labels[key]);
  } else {
    btn.innerHTML = icon;
  }
  if (hiddenKeys.indexOf(key) >= 0) {
    btn.style.display = "none";
  }
}
function applyGlobalZoom(zoom) {
  let styleEl = document.getElementById(ZOOM_STYLE_ID);
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = ZOOM_STYLE_ID;
    document.head.appendChild(styleEl);
  }
  const safeZoom = clampZoom(zoom);
  const zoomSel = import_obsidian14.Platform.isMobile ? ".workspace-split.mod-root .mc-table-wrapper" : ".workspace-split.mod-root .view-content";
  styleEl.textContent = ":root { --mc-zoom: " + safeZoom + "; } " + zoomSel + " { zoom: " + safeZoom + "; }";
  const dockedBar = document.querySelector(".mc-toolbar-docked");
  if (dockedBar) {
    if (import_obsidian14.Platform.isMobile) {
      dockedBar.style.zoom = dockedBar.hasClass("mc-toolbar-compact") ? "0.85" : "";
    } else {
      const compactBar = dockedBar.hasClass("mc-toolbar-compact");
      dockedBar.style.zoom = String((compactBar ? 0.85 : 1) / safeZoom);
    }
  }
}
function adjustGlobalZoom(plugin, delta) {
  const z = clampZoom(plugin.settings.defaultZoom + delta);
  plugin.settings.defaultZoom = z;
  applyGlobalZoom(z);
  const label = document.querySelector(".mc-zoom-value");
  if (label) label.setText(Math.round(z * 100) + "%");
  void plugin.saveSettings();
}
var scrollZoomBound = false;
function bindScrollZoomOnce(plugin) {
  if (scrollZoomBound) return;
  scrollZoomBound = true;
  document.addEventListener("wheel", (e) => {
    if (plugin.settings.scrollZoom === false) return;
    if (!e.ctrlKey) return;
    e.preventDefault();
    adjustGlobalZoom(plugin, e.deltaY < 0 ? 0.1 : -0.1);
  }, { passive: false });
}
function isDockedMode(plugin) {
  return import_obsidian14.Platform.isMobile || plugin.settings.toolbarMode === "docked";
}
function createToolbar(plugin) {
  const toolbar = document.createElement("div");
  toolbar.addClass("mc-toolbar");
  if (plugin.settings.compactToolbar === true) toolbar.addClass("mc-toolbar-compact");
  if (isDockedMode(plugin)) {
    toolbar.addClass("mc-toolbar-docked");
  }
  const title = toolbar.createDiv({ cls: "mc-toolbar-title mc-toolbar-logo" });
  title.innerHTML = LOGO_SVG;
  title.setAttribute("aria-label", "Medical Comparison - drag to move");
  title.setAttribute("title", "Medical Comparison - drag to move");
  const collapseBtn = toolbar.createEl("button", { cls: "mc-toolbar-btn mc-toolbar-collapse-btn" });
  collapseBtn.innerHTML = CHEVRON_LEFT_SVG;
  collapseBtn.setAttribute("aria-label", "Collapse toolbar");
  collapseBtn.setAttribute("title", "Collapse toolbar");
  collapseBtn.addEventListener("click", () => {
    if (toolbar.hasClass("is-collapsed")) {
      toolbar.removeClass("is-collapsed");
      collapseBtn.innerHTML = CHEVRON_LEFT_SVG;
      collapseBtn.setAttribute("aria-label", "Collapse toolbar");
      collapseBtn.setAttribute("title", "Collapse toolbar");
    } else {
      toolbar.addClass("is-collapsed");
      collapseBtn.innerHTML = CHEVRON_RIGHT_SVG;
      collapseBtn.setAttribute("aria-label", "Expand toolbar");
      collapseBtn.setAttribute("title", "Expand toolbar");
    }
  });
  const actions = toolbar.createDiv({ cls: "mc-toolbar-actions" });
  const actionsEdit = actions.createDiv({ cls: "mc-tb-group mc-tb-group-edit" });
  const actionsCtrl = actions.createDiv({ cls: "mc-tb-group mc-tb-group-ctrl" });
  const openBtn = actionsEdit.createEl("button", { cls: "mc-toolbar-btn mc-toolbar-icon-btn" });
  openBtn.innerHTML = TABLE_ICON_SVG;
  openBtn.setAttribute("aria-label", "Compare");
  openBtn.setAttribute("title", "Compare");
  applyToolbarButtonConfig(openBtn, "compare", TABLE_ICON_SVG, plugin.settings);
  const templateBtn = actionsEdit.createEl("button", { cls: "mc-toolbar-btn mc-toolbar-icon-btn" });
  templateBtn.innerHTML = TEMPLATE_ICON_SVG;
  templateBtn.setAttribute("aria-label", "Template");
  templateBtn.setAttribute("title", "Template");
  applyToolbarButtonConfig(templateBtn, "template", TEMPLATE_ICON_SVG, plugin.settings);
  const propBtn = actionsEdit.createEl("button", { cls: "mc-toolbar-btn mc-toolbar-icon-btn" });
  propBtn.innerHTML = PROPERTIES_ICON_SVG;
  propBtn.setAttribute("aria-label", "Properties");
  propBtn.setAttribute("title", "Properties");
  applyToolbarButtonConfig(propBtn, "properties", PROPERTIES_ICON_SVG, plugin.settings);
  const annBtn = actionsEdit.createEl("button", { cls: "mc-toolbar-btn mc-toolbar-icon-btn" });
  annBtn.innerHTML = ANNOTATE_ICON_SVG;
  annBtn.setAttribute("aria-label", "Annotate selected text");
  annBtn.setAttribute("title", "Annotate selected text (select a phrase in a note first)");
  annBtn.addEventListener("click", () => {
    annotateSelection(plugin.app);
  });
  applyToolbarButtonConfig(annBtn, "annotate", ANNOTATE_ICON_SVG, plugin.settings);
  const zoomCluster = actionsCtrl.createDiv({ cls: "mc-zoom-cluster" });
  if ((plugin.settings.hiddenToolbarButtons || []).indexOf("zoom") >= 0) {
    zoomCluster.style.display = "none";
  }
  const zoomOutBtn = zoomCluster.createEl("button", { text: "-", cls: "mc-toolbar-btn mc-zoom-btn" });
  zoomOutBtn.setAttribute("aria-label", "Zoom out");
  zoomOutBtn.setAttribute("title", "Zoom out");
  const zoomValueBtn = zoomCluster.createEl("button", { cls: "mc-toolbar-btn mc-zoom-value" });
  zoomValueBtn.setAttribute("aria-label", "Reset zoom to 100 percent");
  zoomValueBtn.setAttribute("title", "Reset zoom to 100%");
  const zoomInBtn = zoomCluster.createEl("button", { text: "+", cls: "mc-toolbar-btn mc-zoom-btn" });
  zoomInBtn.setAttribute("aria-label", "Zoom in");
  zoomInBtn.setAttribute("title", "Zoom in");
  async function setZoom(nextZoom) {
    const z = clampZoom(nextZoom);
    plugin.settings.defaultZoom = z;
    applyGlobalZoom(z);
    zoomValueBtn.setText(Math.round(z * 100) + "%");
    await plugin.saveSettings();
  }
  zoomOutBtn.addEventListener("click", () => {
    void setZoom(plugin.settings.defaultZoom - ZOOM_STEP);
  });
  zoomInBtn.addEventListener("click", () => {
    void setZoom(plugin.settings.defaultZoom + ZOOM_STEP);
  });
  zoomValueBtn.addEventListener("click", () => {
    void setZoom(1);
  });
  zoomValueBtn.setText(Math.round(clampZoom(plugin.settings.defaultZoom) * 100) + "%");
  applyGlobalZoom(plugin.settings.defaultZoom);
  const undoRedoGroup = actionsCtrl.createDiv({ cls: "mc-segmented" });
  if ((plugin.settings.hiddenToolbarButtons || []).indexOf("undo") >= 0) {
    undoRedoGroup.style.display = "none";
  }
  const undoSegBtn = undoRedoGroup.createEl("button", { cls: "mc-toolbar-btn mc-seg-btn" });
  undoSegBtn.innerHTML = UNDO_ICON_SVG;
  undoSegBtn.setAttribute("aria-label", "Undo last cell change");
  undoSegBtn.setAttribute("title", "Undo last cell change");
  const redoSegBtn = undoRedoGroup.createEl("button", { cls: "mc-toolbar-btn mc-seg-btn" });
  redoSegBtn.innerHTML = REDO_ICON_SVG;
  redoSegBtn.setAttribute("aria-label", "Redo");
  redoSegBtn.setAttribute("title", "Redo");
  async function restoreEntry(entry, direction) {
    const file = plugin.app.vault.getAbstractFileByPath(entry.path);
    if (!(file instanceof import_obsidian14.TFile)) {
      new import_obsidian14.Notice("Original file not found");
      return;
    }
    const lines = direction === "redo" ? entry.after || entry.lines : entry.lines;
    await writeCellToFile(plugin.app.vault, file, entry.contentKey, lines);
    const view = getActiveComparisonView(plugin);
    if (view) await view.loadAndRender();
  }
  async function doUndo() {
    if (undoDepth() === 0) {
      new import_obsidian14.Notice("Nothing to undo");
      return;
    }
    const entry = undo();
    if (!entry) {
      new import_obsidian14.Notice("Nothing to undo");
      return;
    }
    await restoreEntry(entry, "undo");
    new import_obsidian14.Notice("Undid: " + entry.label);
  }
  async function doRedo() {
    if (redoDepth() === 0) {
      new import_obsidian14.Notice("Nothing to redo");
      return;
    }
    const entry = redo();
    if (!entry) {
      new import_obsidian14.Notice("Nothing to redo");
      return;
    }
    await restoreEntry(entry, "redo");
    new import_obsidian14.Notice("Redid: " + entry.label);
  }
  undoSegBtn.addEventListener("click", () => {
    void doUndo();
  });
  redoSegBtn.addEventListener("click", () => {
    void doRedo();
  });
  const saveBtn = actionsCtrl.createEl("button", { cls: "mc-toolbar-btn mc-toolbar-icon-btn" });
  saveBtn.innerHTML = SAVE_ICON_SVG;
  saveBtn.setAttribute("aria-label", "Save");
  saveBtn.setAttribute("title", "Save");
  applyToolbarButtonConfig(saveBtn, "save", SAVE_ICON_SVG, plugin.settings);
  const refreshBtn = actionsCtrl.createEl("button", { cls: "mc-toolbar-btn mc-toolbar-icon-btn" });
  refreshBtn.innerHTML = REFRESH_ICON_SVG;
  refreshBtn.setAttribute("aria-label", "Refresh");
  refreshBtn.setAttribute("title", "Refresh");
  applyToolbarButtonConfig(refreshBtn, "refresh", REFRESH_ICON_SVG, plugin.settings);
  openBtn.addEventListener("click", (e) => {
    const menu = new import_obsidian14.Menu();
    for (const template of plugin.settings.templates) {
      menu.addItem((item) => {
        item.setTitle(template.name).setIcon("table").onClick(() => {
          plugin.activeTemplateId = template.id;
          plugin.activateView();
        });
      });
    }
    menu.showAtMouseEvent(e);
  });
  templateBtn.addEventListener("click", (e) => {
    const menu = new import_obsidian14.Menu();
    for (const template of plugin.settings.templates) {
      menu.addItem((item) => {
        item.setTitle("Apply: " + template.name).setIcon("file-plus").onClick(async () => {
          await applyTemplateToCurrentPage(plugin.app, template.headings, template.name);
        });
      });
    }
    menu.addSeparator();
    for (const template of plugin.settings.templates) {
      menu.addItem((item) => {
        item.setTitle("Edit: " + template.name + "...").setIcon("settings").onClick(() => {
          new CoreHeadingsModal(plugin.app, plugin, template.id).open();
        });
      });
    }
    menu.addSeparator();
    menu.addItem((item) => {
      item.setTitle("+ New Template").setIcon("plus").onClick(async () => {
        const newId = Date.now().toString();
        plugin.settings.templates.push({
          id: newId,
          name: "New Template",
          folder: "New Folder",
          properties: [],
          headings: []
        });
        await plugin.saveSettings();
        new CoreHeadingsModal(plugin.app, plugin, newId).open();
      });
    });
    menu.showAtMouseEvent(e);
  });
  propBtn.addEventListener("click", () => {
    new PropertiesModal(plugin.app, plugin).open();
  });
  saveBtn.addEventListener("click", () => {
    const view = getActiveComparisonView(plugin);
    if (view) view.save();
  });
  refreshBtn.addEventListener("click", () => {
    const view = getActiveComparisonView(plugin);
    if (view) view.refresh();
  });
  bindScrollZoomOnce(plugin);
  bindDockPositionOnce(plugin);
  if (!import_obsidian14.Platform.isMobile) makeDraggable(toolbar, title, plugin);
  if (isDockedMode(plugin)) {
    toolbar.style.display = "none";
    document.body.appendChild(toolbar);
    plugin.app.workspace.onLayoutReady(() => {
      dockToolbarIntoActiveView(plugin, toolbar);
    });
  } else {
    document.body.appendChild(toolbar);
  }
  return toolbar;
}
function recreateToolbar(plugin) {
  document.querySelectorAll(".mc-toolbar").forEach((el) => el.remove());
  createToolbar(plugin);
}
var DOCK_SNAP_Y = 36;
var UNDOCK_PULL_Y = 80;
function getDockHost() {
  const root = document.querySelector(".workspace-split.mod-root");
  if (!root) return null;
  const leafEl = root.querySelector(".workspace-leaf.mod-active") || root.querySelector(".workspace-leaf");
  if (!leafEl) return null;
  return leafEl.querySelector(".view-content") || leafEl;
}
function dockToolbarIntoActiveView(plugin, toolbarEl) {
  const toolbar = toolbarEl || document.querySelector(".mc-toolbar");
  if (!toolbar) return;
  const host = getDockHost();
  if (!host) {
    if (!toolbar.isConnected) document.body.appendChild(toolbar);
    return;
  }
  toolbar.style.display = "";
  if (toolbar.parentElement !== host) host.insertBefore(toolbar, host.firstChild);
  toolbar.addClass("mc-toolbar-docked");
  toolbar.style.left = "";
  toolbar.style.top = "";
  toolbar.style.transform = "";
  const compact = toolbar.hasClass("mc-toolbar-compact");
  if (import_obsidian14.Platform.isMobile) {
    toolbar.style.zoom = compact ? "0.85" : "";
  } else {
    toolbar.style.zoom = String((compact ? 0.85 : 1) / clampZoom(plugin.settings.defaultZoom));
  }
  document.querySelectorAll(".mc-tb-dock-host").forEach((el) => el.removeClass("mc-tb-dock-host"));
  host.addClass("mc-tb-dock-host");
}
var dockPosBound = false;
function bindDockPositionOnce(plugin) {
  if (dockPosBound) return;
  dockPosBound = true;
  const redock = () => {
    if (!plugin.app.workspace.layoutReady) return;
    const toolbar = document.querySelector(".mc-toolbar");
    if (toolbar) {
      if (toolbar.hasClass("mc-toolbar-docked")) dockToolbarIntoActiveView(plugin, toolbar);
    } else if (isDockedMode(plugin)) {
      recreateToolbar(plugin);
    }
  };
  plugin.registerDomEvent(window, "resize", redock);
  plugin.registerEvent(plugin.app.workspace.on("layout-change", redock));
  plugin.registerEvent(plugin.app.workspace.on("active-leaf-change", redock));
  plugin.registerInterval(window.setInterval(() => {
    if (!isDockedMode(plugin)) return;
    if (!plugin.app.workspace.layoutReady) {
      return;
    }
    const strips = document.querySelectorAll(".mc-toolbar");
    if (strips.length === 0) {
      recreateToolbar(plugin);
      return;
    }
    for (let i = 1; i < strips.length; i++) strips[i].remove();
    const strip = strips[0];
    const host = getDockHost();
    if (host && strip.parentElement !== host) {
      dockToolbarIntoActiveView(plugin, strip);
    }
  }, 2e3));
}
function makeDraggable(toolbar, handle, plugin) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let startY = 0;
  const isDocked = () => toolbar.hasClass("mc-toolbar-docked");
  const dragScale = () => {
    let z = parseFloat(getComputedStyle(toolbar).zoom) || 1;
    let p = toolbar.parentElement;
    while (p && p !== document.body) {
      z = z * (parseFloat(getComputedStyle(p).zoom) || 1);
      p = p.parentElement;
    }
    return z;
  };
  const dock = () => {
    dockToolbarIntoActiveView(plugin, toolbar);
  };
  const floatAt = (x, y) => {
    toolbar.removeClass("mc-toolbar-docked");
    document.body.appendChild(toolbar);
    toolbar.style.left = x + "px";
    toolbar.style.top = y + "px";
    toolbar.style.transform = "none";
    toolbar.style.zoom = "";
    document.querySelectorAll(".mc-tb-dock-host").forEach((el) => el.removeClass("mc-tb-dock-host"));
  };
  handle.addEventListener("mousedown", (e) => {
    isDragging = true;
    startY = e.clientY;
    const rect = toolbar.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    toolbar.addClass("dragging");
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const z = dragScale();
    const x = (e.clientX - offsetX) / z;
    const y = (e.clientY - offsetY) / z;
    if (isDocked()) {
      if (e.clientY - startY > UNDOCK_PULL_Y) {
        floatAt(x, y);
      }
    } else {
      if (y <= DOCK_SNAP_Y) {
        dock();
      } else {
        floatAt(x, y);
      }
    }
  });
  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    toolbar.removeClass("dragging");
    plugin.settings.toolbarMode = isDocked() ? "docked" : "floating";
    void plugin.saveSettings();
  });
}
function getActiveComparisonView(plugin) {
  const leaves = plugin.app.workspace.getLeavesOfType(VIEW_TYPE_COMPARISON);
  if (leaves.length === 0) return null;
  const leaf = leaves[0];
  return leaf.view;
}

// src/settings/settings.ts
var ALL_BUTTONS = [
  { key: "compare", name: "Compare", hideable: false, labelable: true },
  { key: "template", name: "Template", hideable: false, labelable: true },
  { key: "properties", name: "Properties", hideable: false, labelable: true },
  { key: "annotate", name: "Annotate", hideable: true, labelable: true },
  { key: "zoom", name: "Zoom cluster", hideable: true, labelable: false },
  { key: "undo", name: "Undo / Redo", hideable: true, labelable: false },
  { key: "save", name: "Save", hideable: true, labelable: true },
  { key: "refresh", name: "Refresh", hideable: true, labelable: true }
];
var recreateTimer = null;
function scheduleRecreate(plugin) {
  if (recreateTimer !== null) window.clearTimeout(recreateTimer);
  recreateTimer = window.setTimeout(() => {
    recreateTimer = null;
    recreateToolbar(plugin);
  }, 400);
}
var MedicalComparisonSettingTab = class extends import_obsidian15.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h3", { text: "Toolbar" });
    new import_obsidian15.Setting(containerEl).setName("Toolbar position").setDesc("Docked pins it to the top, horizontally centred. Dragging it to the top edge docks it; dragging it back down floats it.").addDropdown(
      (drop) => drop.addOption("floating", "Floating").addOption("docked", "Docked top").setValue(this.plugin.settings.toolbarMode === "docked" ? "docked" : "floating").onChange(async (v) => {
        this.plugin.settings.toolbarMode = v;
        await this.plugin.saveSettings();
        recreateToolbar(this.plugin);
      })
    );
    new import_obsidian15.Setting(containerEl).setName("Compact size").setDesc("Shrink the whole toolbar proportionally.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.compactToolbar === true).onChange(async (v) => {
        this.plugin.settings.compactToolbar = v;
        await this.plugin.saveSettings();
        recreateToolbar(this.plugin);
      })
    );
    new import_obsidian15.Setting(containerEl).setName("Ctrl + scroll zoom").setDesc("Hold Ctrl and scroll anywhere to zoom in or out (trackpad pinch works too).").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.scrollZoom !== false).onChange(async (v) => {
        this.plugin.settings.scrollZoom = v;
        await this.plugin.saveSettings();
      })
    );
    const labels = this.plugin.settings.toolbarButtonLabels || {};
    const hidden = this.plugin.settings.hiddenToolbarButtons || [];
    for (const b of ALL_BUTTONS) {
      let desc;
      if (!b.hideable) {
        desc = "Always shown; text label replaces the icon (empty = icon).";
      } else if (!b.labelable) {
        desc = "Show/hide this button. Icon only - a text label would break it.";
      } else {
        desc = "Show/hide the button; text label replaces the icon (empty = icon).";
      }
      const row = new import_obsidian15.Setting(containerEl).setName(b.name).setDesc(desc);
      if (b.hideable) {
        row.addToggle(
          (toggle) => toggle.setValue(hidden.indexOf(b.key) < 0).onChange(async (v) => {
            const list = this.plugin.settings.hiddenToolbarButtons || [];
            const i = list.indexOf(b.key);
            if (!v && i < 0) list.push(b.key);
            if (v && i >= 0) list.splice(i, 1);
            this.plugin.settings.hiddenToolbarButtons = list;
            await this.plugin.saveSettings();
            recreateToolbar(this.plugin);
          })
        );
      }
      if (b.labelable) {
        row.addText(
          (text) => text.setPlaceholder("(icon)").setValue(labels[b.key] || "").onChange(async (v) => {
            labels[b.key] = v;
            this.plugin.settings.toolbarButtonLabels = labels;
            await this.plugin.saveSettings();
            scheduleRecreate(this.plugin);
          })
        );
      }
    }
  }
};

// src/editor/diffCompareExtension.ts
var import_view = require("@codemirror/view");
var DIFF_ICON_SVG = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>';
var DiffCompareWidget = class extends import_view.WidgetType {
  toDOM(view) {
    const span = document.createElement("span");
    span.className = "mc-cm-diff-btn";
    span.setAttribute("title", "Compare differentials");
    span.innerHTML = DIFF_ICON_SVG;
    span.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const app = window.app;
      if (!app || !app.workspace) return;
      const file = app.workspace.getActiveFile ? app.workspace.getActiveFile() : null;
      if (file) {
        void openDiffView(app, file.path);
      }
    });
    return span;
  }
  ignoreEvent() {
    return false;
  }
};
var diffComparePlugin = import_view.ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = this.build(view);
    }
    update(update) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.build(update.view);
      }
    }
    build(view) {
      const decorations = [];
      for (let i = 1; i <= view.state.doc.lines; i++) {
        const line = view.state.doc.line(i);
        if (/^##\s+Differential Diagnoses\s*$/.test(line.text)) {
          decorations.push(
            import_view.Decoration.widget({
              widget: new DiffCompareWidget(),
              side: 1
            }).range(line.to)
          );
        }
      }
      return import_view.Decoration.set(decorations);
    }
  },
  {
    decorations: (v) => v.decorations
  }
);
var diffCompareExtension = diffComparePlugin;

// src/editor/redFlagEditorExtension.ts
var import_view2 = require("@codemirror/view");
var import_obsidian16 = require("obsidian");
var RedFlagWidget = class extends import_view2.WidgetType {
  constructor(active, lineNum, isSummary) {
    super();
    this.active = active;
    this.lineNum = lineNum;
    this.isSummary = isSummary;
  }
  toDOM(view) {
    const span = document.createElement("span");
    span.className = "mc-cm-flag" + (this.active ? " is-active" : "");
    span.innerHTML = FLAG_ICON_SVG;
    span.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.isSummary) {
        this.unflagSource(view);
        return;
      }
      const line = view.state.doc.line(this.lineNum);
      const text = line.text;
      let newText;
      if (text.trim().endsWith("<!-- rf -->")) {
        newText = text.replace(/\s*<!-- rf -->\s*$/, "").trimEnd();
      } else {
        newText = text.trimEnd() + " <!-- rf -->";
      }
      view.dispatch({
        changes: { from: line.from, to: line.to, insert: newText }
      });
    });
    return span;
  }
  unflagSource(view) {
    const entryLine = view.state.doc.line(this.lineNum);
    const entryText = entryLine.text.replace(/^[-*]\s*/, "").trim();
    const total = view.state.doc.lines;
    let inRf = false;
    for (let i = 1; i <= total; i++) {
      const line = view.state.doc.line(i);
      const h2 = line.text.match(/^##\s+(.+)$/);
      if (h2) {
        inRf = h2[1].trim() === "Red Flags";
        continue;
      }
      if (inRf) continue;
      if (!line.text.trim().endsWith("<!-- rf -->")) continue;
      const cleaned = line.text.replace("<!-- rf -->", "").replace(/^[-*]\s*/, "");
      if (rfStripLine2(cleaned) === entryText) {
        const newText = line.text.replace(/\s*<!-- rf -->\s*$/, "").trimEnd();
        view.dispatch({
          changes: { from: line.from, to: line.to, insert: newText }
        });
        new import_obsidian16.Notice("Red flag removed");
        return;
      }
    }
    new import_obsidian16.Notice("Matching source line not found");
  }
  ignoreEvent() {
    return false;
  }
};
var redFlagPlugin = import_view2.ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.decorations = this.buildDecorations(view);
    }
    update(update) {
      if (update.docChanged || update.viewportChanged || update.focusChanged) {
        this.decorations = this.buildDecorations(update.view);
      }
    }
    buildDecorations(view) {
      const decorations = [];
      let inRfSection = false;
      for (let i = 1; i <= view.state.doc.lines; i++) {
        const line = view.state.doc.line(i);
        const trimmed = line.text.trim();
        const h2Match = line.text.match(/^##\s+(.+)$/);
        if (h2Match) {
          inRfSection = h2Match[1].trim() === "Red Flags";
        }
        if (trimmed === "---" || trimmed.length === 0 || trimmed.startsWith("#")) {
          continue;
        }
        if (inRfSection) {
          const isEntry = (trimmed.startsWith("- ") || trimmed.startsWith("* ")) && trimmed.replace(/^[-*]\s*/, "").trim().length > 0;
          if (isEntry) {
            decorations.push(
              import_view2.Decoration.widget({
                widget: new RedFlagWidget(true, i, true),
                side: -1
              }).range(line.from)
            );
          }
          continue;
        }
        const isActive = trimmed.endsWith("<!-- rf -->");
        decorations.push(
          import_view2.Decoration.widget({
            widget: new RedFlagWidget(isActive, i, false),
            side: -1
          }).range(line.from)
        );
      }
      return import_view2.Decoration.set(decorations);
    }
  },
  {
    decorations: (v) => v.decorations
  }
);
var redFlagEditorExtension = redFlagPlugin;

// src/main.ts
var MedicalComparisonPlugin = class extends import_obsidian17.Plugin {
  constructor() {
    super(...arguments);
    this.activeTemplateId = "";
    this.syncingFiles = /* @__PURE__ */ new Set();
    this.lastSweepRun = 0;
    this.sweepBusy = false;
  }
  async onload() {
    await this.loadSettings();
    this.registerView(
      VIEW_TYPE_COMPARISON,
      (leaf) => new ComparisonView(leaf, this)
    );
    this.registerView(
      VIEW_TYPE_DIFF_COMPARE,
      (leaf) => new DiffCompareView(leaf, this)
    );
    this.addRibbonIcon("table", "Open Medical Comparison", () => this.activateView());
    this.addCommand({
      id: "open-medical-comparison",
      name: "Open Medical Comparison table",
      callback: () => this.activateView()
    });
    this.addCommand({
      id: "annotate-selection",
      name: "Annotate selected text",
      callback: () => annotateSelection(this.app)
    });
    this.addCommand({
      id: "compare-differentials-note",
      name: "Compare differentials of this note",
      callback: () => {
        const view = this.app.workspace.getActiveViewOfType(import_obsidian17.MarkdownView);
        if (view && view.file) {
          void openDiffView(this.app, view.file.path);
        } else {
          new import_obsidian17.Notice("Open a condition note first");
        }
      }
    });
    this.addCommand({
      id: "tag-existing-notes",
      name: "Tag existing notes (migrate folders to Comparison tags)",
      callback: () => {
        void migrateFoldersToTags(this.app, this.settings.templates);
      }
    });
    this.registerEditorExtension(redFlagEditorExtension);
    this.registerEditorExtension(diffCompareExtension);
    this.addSettingTab(new MedicalComparisonSettingTab(this.app, this));
    this.registerEvent(
      this.app.vault.on("modify", async (file) => {
        if (!(file instanceof import_obsidian17.TFile)) return;
        const names = this.settings.templates.map((t) => t.name);
        if (!names.some((n) => hasComparisonTag(this.app, file, n))) return;
        if (this.syncingFiles.has(file.path)) return;
        this.syncingFiles.add(file.path);
        try {
          await syncRedFlagsInFile(this.app.vault, file);
        } finally {
          setTimeout(() => this.syncingFiles.delete(file.path), 500);
        }
      })
    );
    this.registerInterval(window.setInterval(() => this.runSweepTick(), 1e3));
    this.toolbarEl = createToolbar(this);
  }
  /** 1s master tick: honours settings.redFlagSweepEnabled + interval live. */
  runSweepTick() {
    if (this.sweepBusy) return;
    const now = Date.now();
    const enabled = this.settings.redFlagSweepEnabled !== false;
    const intervalMs = Math.max(500, this.settings.redFlagSweepIntervalMs || 2500);
    if (!enabled || now - this.lastSweepRun < intervalMs) return;
    this.lastSweepRun = now;
    this.sweepBusy = true;
    void this.sweepActiveFileRf().finally(() => {
      this.sweepBusy = false;
    });
  }
  async sweepActiveFileRf() {
    try {
      const view = this.app.workspace.getActiveViewOfType(import_obsidian17.MarkdownView);
      if (!view || !view.file) return;
      const names = this.settings.templates.map((t) => t.name);
      const file = view.file;
      if (!names.some((n) => hasComparisonTag(this.app, file, n))) return;
      const disk = await this.app.vault.read(view.file);
      if (view.editor.getValue() !== disk) return;
      await syncRedFlagsInFile(this.app.vault, view.file);
    } catch (e) {
    }
  }
  async onunload() {
    var _a;
    (_a = this.toolbarEl) == null ? void 0 : _a.remove();
    this.toolbarEl = void 0;
  }
  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_COMPARISON)[0];
    const isNew = !leaf;
    if (!leaf) {
      leaf = workspace.getLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_COMPARISON, state: {} });
    }
    if (!isNew) {
      const view = leaf.view;
      if (view && this.activeTemplateId) {
        view.setTemplate(this.activeTemplateId);
      }
    }
    workspace.revealLeaf(leaf);
    workspace.setActiveLeaf(leaf, { focus: true });
  }
  async loadSettings() {
    const loaded = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
    if (this.settings.coreHeadingsTemplate && !this.settings.templates) {
      let oldHeadings;
      const oldTemplate = this.settings.coreHeadingsTemplate;
      if (typeof oldTemplate === "string") {
        oldHeadings = DEFAULT_SETTINGS.templates[0].headings;
      } else {
        oldHeadings = oldTemplate;
      }
      this.settings.templates = [
        { id: "conditions", name: "Conditions", folder: "Conditions", properties: ["Speciality", "Presenting Complaint"], headings: oldHeadings },
        DEFAULT_DRUGS_TEMPLATE
      ];
      delete this.settings.coreHeadingsTemplate;
      await this.saveSettings();
    } else if (!Array.isArray(this.settings.templates)) {
      this.settings.templates = DEFAULT_TEMPLATES;
      await this.saveSettings();
    }
    let needsSave = false;
    for (const template of this.settings.templates) {
      if (!template.folder) {
        template.folder = template.name;
        needsSave = true;
      }
    }
    if (!Array.isArray(this.settings.properties)) {
      this.settings.properties = DEFAULT_PROPERTIES;
      needsSave = true;
    }
    const LEGACY_COLOR_MAP = {
      "#ffd6e0": "#dcecdf",
      "#ffe8cc": "#d4eae4",
      "#fff5ba": "#d3e8ee",
      "#d4f0c8": "#d7e2f2",
      "#c8ede6": "#dee0f5",
      "#c5e3f6": "#e6def3",
      "#d9d2f1": "#dfe4ea",
      "#f5d5e9": "#dcd9ec",
      "#f2e0e4": "#dcecdf",
      "#f2e8db": "#d4eae4",
      "#f1efd8": "#d3e8ee",
      "#e1eedf": "#d7e2f2",
      "#dfefea": "#dee0f5",
      "#dfe8f2": "#e6def3",
      "#e7e1f0": "#dfe4ea",
      "#f1e0ec": "#dcd9ec",
      "#f6e3d5": "#d6e9c9",
      "#f7dccd": "#cfeae6",
      "#f5d5c3": "#d2e8ef",
      "#f3cfc9": "#d4def5",
      "#e9d3dc": "#e4dcf5",
      "#e0d3e0": "#f3d7de",
      "#dcd3ea": "#f7e0d2",
      "#f2e7d0": "#f7edd2",
      "#dcecdf": "#d6e9c9",
      "#d4eae4": "#cfeae6",
      "#d3e8ee": "#d2e8ef",
      "#d7e2f2": "#d4def5",
      "#dee0f5": "#e4dcf5",
      "#e6def3": "#f3d7de",
      "#dfe4ea": "#f7e0d2",
      "#dcd9ec": "#f7edd2"
    };
    for (const prop of this.settings.properties) {
      const current = (prop.color || "").toLowerCase();
      const legacy = LEGACY_COLOR_MAP[current];
      if (legacy) {
        if (prop.color !== legacy) {
          prop.color = legacy;
          needsSave = true;
        }
      } else if (!prop.color || PASTEL_PALETTE.indexOf(prop.color) < 0) {
        prop.color = PASTEL_PALETTE[Math.floor(Math.random() * PASTEL_PALETTE.length)];
        needsSave = true;
      }
    }
    if (needsSave) {
      await this.saveSettings();
    }
    if (!this.activeTemplateId && this.settings.templates.length > 0) {
      this.activeTemplateId = this.settings.templates[0].id;
    }
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};
var main_default = MedicalComparisonPlugin;
