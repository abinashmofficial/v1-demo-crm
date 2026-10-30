'use client';

import React, { useState } from 'react';
import { Invoice, ThemeMode } from '@/types/crm';
import { 
  Receipt, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  DollarSign, 
  FileText, 
  Download, 
  Eye, 
  Printer, 
  X,
  Building2,
  ShieldCheck
} from 'lucide-react';

interface InvoiceAppProps {
  invoices: Invoice[];
  themeMode?: ThemeMode;
}

export const InvoiceApp: React.FC<InvoiceAppProps> = ({ invoices }) => {
  const [selectedPdfInvoice, setSelectedPdfInvoice] = useState<Invoice | null>(null);

  const totalInvoiced = invoices.reduce((acc, i) => acc + i.amount, 0);
  const paidTotal = invoices.filter(i => i.status === 'Paid').reduce((acc, i) => acc + i.amount, 0);
  const pendingTotal = invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.amount, 0);

  const handleDownloadPdf = (inv: Invoice) => {
    const pdfContent = `
====================================================
               COMMERCIAL TAX INVOICE               
====================================================
Invoice Number: ${inv.invoiceNo}
Date Issued:    ${new Date().toISOString().split('T')[0]}
Due Date:       ${inv.dueDate}
Status:         ${inv.status.toUpperCase()}

ISSUER:
Test CRM Multi-Tenant Billing Engine
100 Enterprise Way, Silicon Valley, CA

BILL TO:
Client: ${inv.client}
Tax ID / Account: REF-${inv.id.toUpperCase()}

----------------------------------------------------
DESCRIPTION                             AMOUNT
----------------------------------------------------
Enterprise CRM Subscription & Services   $${inv.amount.toLocaleString()}.00
Tax / VAT (0% Included):                 $0.00
----------------------------------------------------
TOTAL DUE AMOUNT:                        $${inv.amount.toLocaleString()}.00
====================================================
Thank you for your business!
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${inv.invoiceNo}_${inv.client.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden p-6 sm:p-8 shadow-xl transition duration-300 theme-hero-custom text-white">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md bg-white/20 text-white border-white/30">
              <Receipt className="w-3.5 h-3.5" />
              <span>Smart Billing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight drop-shadow-sm text-white">
              Smart Invoices & PDF Quotes
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
              Automated billing workflows, instant PDF previews, and downloadable client invoices.
            </p>
          </div>

          <button className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-xl transition self-start sm:self-auto">
            <Plus className="w-4 h-4 text-teal-600" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-2xl p-5 sm:p-6 space-y-2 shadow-sm transition hover:shadow-md theme-card-custom">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Total Invoiced</p>
            <DollarSign className="w-4 h-4 theme-svg-custom" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">${totalInvoiced.toLocaleString()}</p>
          <span className="text-[10px] theme-span-custom px-2 py-0.5 rounded-full font-bold inline-block">Enterprise Ledger</span>
        </div>

        <div className="rounded-2xl p-5 sm:p-6 space-y-2 shadow-sm transition hover:shadow-md theme-card-custom">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Collected Payments</p>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">${paidTotal.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500 font-bold">Settled Invoices</span>
        </div>

        <div className="rounded-2xl p-5 sm:p-6 space-y-2 shadow-sm transition hover:shadow-md theme-card-custom">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500">Pending Receivables</p>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">${pendingTotal.toLocaleString()}</p>
          <span className="text-[10px] text-slate-500 font-bold">Awaiting Client Settlement</span>
        </div>
      </div>

      <div className="shadow-lg overflow-x-auto theme-card-custom">
        <table className="w-full text-left text-xs min-w-[720px]">
          <thead className="font-extrabold theme-span-custom border-b">
            <tr>
              <th className="py-4 px-4 font-extrabold uppercase tracking-wider text-[11px]">Invoice #</th>
              <th className="py-4 px-4 font-extrabold uppercase tracking-wider text-[11px]">Client Name</th>
              <th className="py-4 px-4 font-extrabold uppercase tracking-wider text-[11px]">Amount</th>
              <th className="py-4 px-4 font-extrabold uppercase tracking-wider text-[11px]">Status</th>
              <th className="py-4 px-4 font-extrabold uppercase tracking-wider text-[11px]">Due Date</th>
              <th className="py-4 px-4 font-extrabold uppercase tracking-wider text-[11px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="transition duration-150 border-b border-slate-100">
                <td className="py-3.5 px-4 font-mono theme-record-id">{inv.invoiceNo}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{inv.client}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">${inv.amount.toLocaleString()}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 w-max theme-span-custom">
                    {inv.status === 'Paid' && <CheckCircle className="w-3 h-3 theme-svg-custom" />}
                    {inv.status === 'Pending' && <Clock className="w-3 h-3 theme-svg-custom" />}
                    {inv.status === 'Overdue' && <AlertTriangle className="w-3 h-3 theme-svg-custom" />}
                    <span>{inv.status}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">{inv.dueDate}</td>
                <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedPdfInvoice(inv)}
                    className="px-3 py-1.5 text-[11px] font-extrabold rounded-lg theme-btn-custom shadow-sm transition inline-flex items-center space-x-1"
                    title="Preview PDF Invoice"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>PDF Preview</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPdf(inv)}
                    className="px-3 py-1.5 text-[11px] font-extrabold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition inline-flex items-center space-x-1"
                    title="Download PDF Invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPdfInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-white text-slate-900 border border-slate-200">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 theme-btn-custom rounded-xl flex items-center justify-center font-extrabold shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Invoice PDF Document</h3>
                  <p className="text-xs font-mono text-slate-500">{selectedPdfInvoice.invoiceNo}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadPdf(selectedPdfInvoice)}
                  className="px-3 py-1.5 text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setSelectedPdfInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 gap-4 border-slate-200">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 theme-svg-custom" />
                    <span className="text-lg font-extrabold tracking-tight text-slate-900">Test CRM Multi-Tenant Billing</span>
                  </div>
                  <p className="text-slate-500">100 Enterprise Way, Suite 400 • Silicon Valley, CA</p>
                  <p className="text-slate-500">Billing Contact: billing@testcrm.io</p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="px-3 py-1 text-xs font-extrabold uppercase rounded-full theme-span-custom">
                    {selectedPdfInvoice.status} INVOICE
                  </span>
                  <p className="font-mono pt-1 text-slate-500">Issued: 2026-08-28</p>
                  <p className="font-mono text-slate-500">Due Date: {selectedPdfInvoice.dueDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl theme-span-custom">
                <div>
                  <p className="font-extrabold uppercase text-[10px] text-slate-500">Billed To Customer</p>
                  <p className="text-sm font-extrabold mt-1 text-slate-900">{selectedPdfInvoice.client}</p>
                  <p className="text-slate-600 mt-0.5">Account ID: REF-{selectedPdfInvoice.id.toUpperCase()}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-extrabold uppercase text-[10px] text-slate-500">Payment Details</p>
                  <p className="text-sm font-extrabold mt-1 text-slate-900">Direct Bank Wire / Credit Card</p>
                  <p className="text-slate-600 mt-0.5">Currency: USD ($)</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="theme-span-custom font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-slate-900">Itemized Service Description</th>
                      <th className="p-3 text-center text-slate-900">Qty</th>
                      <th className="p-3 text-right text-slate-900">Unit Price</th>
                      <th className="p-3 text-right text-slate-900">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-semibold text-slate-800">
                        CRM Enterprise Multi-Tenant Platform Subscription
                        <p className="text-[10px] text-slate-500">Includes AI Scoring, Lead Radar & Unlimited Seat Access</p>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700">1</td>
                      <td className="p-3 text-right font-mono text-slate-700">${selectedPdfInvoice.amount.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">${selectedPdfInvoice.amount.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col items-end space-y-2 text-xs pt-2">
                <div className="flex justify-between w-48 text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">${selectedPdfInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-48 text-slate-600">
                  <span>Tax (0% VAT):</span>
                  <span className="font-mono font-bold text-slate-900">$0.00</span>
                </div>
                <div className="flex justify-between w-56 pt-2 border-t text-sm font-extrabold theme-record-id border-slate-200">
                  <span>Total Amount Due:</span>
                  <span className="font-mono text-slate-900">${selectedPdfInvoice.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center space-x-3 text-blue-900">
                <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600" />
                <p className="text-[11px] leading-relaxed">
                  This document is digitally signed and generated by the Test CRM Smart Billing Engine. Payments are processed securely via SSL encryption.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
