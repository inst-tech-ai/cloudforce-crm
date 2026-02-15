export const LEAD_STATUS_LABELS = { "New": "新規", "Working": "対応中", "Nurturing": "育成中", "Converted": "取引開始済み" };
export const LEAD_STATUSES = ["New", "Working", "Nurturing", "Converted"];
export const STAGES = ["Prospecting", "Discovery", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
export const STAGE_LABELS = { "Prospecting": "見込み", "Discovery": "ニーズ把握", "Proposal": "提案", "Negotiation": "交渉", "Closed Won": "受注", "Closed Lost": "失注" };
export const formatCurrency = (amount) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
export const API_URL = import.meta.env.VITE_API_URL || 'https://cloudforce-api-987189753237.asia-northeast1.run.app';
export const GOOGLE_CLIENT_ID = "987189753237-ebplf2i51fq0dkp9tctmcpt983ug9rmp.apps.googleusercontent.com";
