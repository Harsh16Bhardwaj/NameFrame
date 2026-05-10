import { parse } from "papaparse";
import * as XLSX from "xlsx";

export type ParticipantImportRow = {
  rowNumber: number;
  name: string;
  email: string;
  participated: boolean;
};

export type ParticipantImportError = {
  rowNumber: number;
  message: string;
  raw: Record<string, unknown>;
};

export type ParticipantImportPreview = {
  validRows: ParticipantImportRow[];
  invalidRows: ParticipantImportError[];
  duplicateRows: ParticipantImportError[];
  totalRows: number;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME_KEYS = ["name", "student name", "participant name", "full name"];
const EMAIL_KEYS = ["email", "student email", "participant email", "email address"];
const PARTICIPATED_KEYS = ["participated", "participation", "attended", "present"];

function normalizeKey(key: string) {
  return key.trim().toLowerCase().replace(/[_-]+/g, " ");
}

function pickValue(row: Record<string, unknown>, keys: string[]) {
  const entries = Object.entries(row);
  const match = entries.find(([key]) => keys.includes(normalizeKey(key)));
  return match?.[1];
}

export function parseParticipated(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["true", "yes", "y", "1", "participated", "attended", "present"].includes(normalized)) {
    return true;
  }

  if (["false", "no", "n", "0", "absent"].includes(normalized)) {
    return false;
  }

  return false;
}

function parseRows(rows: Array<Record<string, unknown>>): ParticipantImportPreview {
  const validRows: ParticipantImportRow[] = [];
  const invalidRows: ParticipantImportError[] = [];
  const duplicateRows: ParticipantImportError[] = [];
  const seenEmails = new Set<string>();

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const name = String(pickValue(row, NAME_KEYS) ?? "").trim();
    const email = String(pickValue(row, EMAIL_KEYS) ?? "").trim().toLowerCase();
    const participated = parseParticipated(pickValue(row, PARTICIPATED_KEYS));

    if (!name || !email) {
      invalidRows.push({ rowNumber, message: "Missing name or email", raw: row });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      invalidRows.push({ rowNumber, message: "Invalid email", raw: row });
      return;
    }

    if (seenEmails.has(email)) {
      duplicateRows.push({ rowNumber, message: "Duplicate email in file", raw: row });
      return;
    }

    seenEmails.add(email);
    validRows.push({ rowNumber, name, email, participated });
  });

  return {
    validRows,
    invalidRows,
    duplicateRows,
    totalRows: rows.length,
  };
}

export async function previewParticipantFile(file: File): Promise<ParticipantImportPreview> {
  const fileType = file.name.split(".").pop()?.toLowerCase();

  if (fileType !== "csv" && fileType !== "xlsx" && fileType !== "xls") {
    throw new Error("Unsupported file format. Please upload a CSV or Excel file");
  }

  if (fileType === "csv") {
    const fileContent = await file.text();
    const { data, errors } = parse<Record<string, unknown>>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      throw new Error("Error parsing CSV file");
    }

    return parseRows(data);
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

  return parseRows(rows);
}
