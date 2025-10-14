import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../shared/shared-imports';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { ToastService } from '../toast-service';
import { AuthService } from '../auth-service';
import { RefreshService } from '../refresh-service';
import { Router } from '@angular/router';
import { LoadingService } from '../loading-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-viewinvoice',
  imports: [...SHARED_IMPORTS],
  templateUrl: './viewinvoice.html',
  styleUrl: './viewinvoice.css'
})
export class Viewinvoice implements OnInit{
@ViewChild('invoice', { static: false }) invoiceElement!: ElementRef;
transID: any;
token: any
result:any
companyDetails: any
invoices:any
invoicesDetails: any;

subtotal: number = 0;
vat: number = 0;
total: number = 0;
  accounts$: Observable<any[]>; // Observable for table

  constructor(private toast: ToastService, private service: AuthService, private refreshService: RefreshService, private router: Router, private loadingService: LoadingService){
        this.accounts$ = this.refreshService.getObservable('cashbank');

  }
  getInitials(name: string | undefined): string {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}
postData = {
  paidfrom:"",
  amount:"",
  description:""
}

 ngOnInit(): void {
   this.transID = history.state.transID
   console.log(this.transID, "ahhshjsj")
      this.token = localStorage.getItem('auth_token');
     if (this.token) {
      this.loadingService.show();
      this.service.viewSalesInvoices(this.transID.transaction_id, this.token).subscribe({
        next: (res: any) => {
          this.result = res;
          this.companyDetails =this.result.companyDets;
          console.log(this.companyDetails);
          this.invoices = this.result.payments
          console.log(this.invoices);
          this.invoicesDetails = this.result.paymentsDet;
              this.calculateTotals()

          console.log(res, "invoice Details"); // you see the data here
           this.loadingService.hide();
           
        },
        error: (err) => {
          console.error(err);
          this.loadingService.hide();
        }
      });
      this.service.getcashbank(this.token).subscribe({
        next: (res: any) => {
              this.loadingService.hide();

          },
        error: (err) => console.error(err)
      });
    }
 }
 getBase64ImageFromURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); // handle CORS
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = error => reject(error);
  });
}

  
exportPDF() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // === HEADER BACKGROUND ===
  doc.setFillColor(200, 200, 200); // light grey
  doc.rect(0, 0, pageWidth, 40, 'F'); // header box

  // === LOGO / INITIALS ===
  const logoX = 14, logoY = 10, logoSize = 30;

  const drawInitials = () => {
    const companyName = this.companyDetails?.company || '??';
    const initials = companyName
      .split(' ')
      .map((w: string) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    doc.setFillColor(41, 128, 185); // blue background
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 'F');

    doc.setFontSize(18).setTextColor(255, 255, 255).setFont('helvetica', 'bold'); 
    doc.text(initials, logoX + logoSize / 2, logoY + logoSize / 2 + 5, { align: 'center' });
  };

  const logoBase64 = this.companyDetails?.logo_base64 || '';

  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
  } else {
    drawInitials();
  }

  // === HEADER TEXT ===
  doc.setFontSize(10).setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); 
  doc.text(`Company: ${this.companyDetails?.company || ''}`, pageWidth - 14, 12, { align: 'right' });
  doc.text(`TIN: ${this.companyDetails?.tin || ''}`, pageWidth - 14, 18, { align: 'right' });
  doc.text(`VAT: ${this.companyDetails?.vat || ''}`, pageWidth - 14, 24, { align: 'right' });
  doc.text(`Address: ${this.companyDetails?.adress || ''}`, pageWidth - 14, 30, { align: 'right' });

  // === INVOICE INFO ===
  const yAfterHeader = 60;
  doc.setFontSize(11).setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${this.invoices?.receipt_no || ''}`, pageWidth - 14, yAfterHeader + 10, { align: 'right' });

  const createdAt = this.invoices?.created_at ? new Date(this.invoices.created_at) : null;
  const formattedDate = createdAt ? createdAt.toLocaleDateString('en-GB') : '';
  doc.text(`Due date: ${formattedDate}`, pageWidth - 14, yAfterHeader + 18, { align: 'right' });

  // === Billed To ===
  doc.setFontSize(12).setFont('helvetica', 'bold');
  doc.text('Billed To:', 14, yAfterHeader + 10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); 
  doc.text(this.invoices?.payee || '', 14, yAfterHeader + 18);

  // === TABLE BODY ===
  const body = this.invoicesDetails.map((inv: any, i: number) => [
    i + 1,
    inv.item,
    this.formatNumber(inv.unit_amount),
    this.formatNumber(inv.unit_amount),
    this.formatNumber(inv.vatamount),
    this.formatNumber(inv.Qty),
    this.formatNumber(inv.total_amount),
  ]);

  autoTable(doc, {
    startY: yAfterHeader + 30,
    head: [['#', 'Item', 'Unit Price (USD)', 'Unit Price (TZS)', 'VAT (18%)', 'Qty', 'Total']],
    body,
    styles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      5: { halign: 'center' },
      6: { halign: 'right' },
    },
    theme: 'striped',
  });

  // === DIMENSIONS ===
  const boxWidth = 90;
  const boxHeight = 30;
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // === PAYMENT METHODS BOX ===
  const paymentBoxX = 14;
  const paymentMethods = [
    { method: this.companyDetails.bank_one, account: '' },
    { method: this.companyDetails.bank_two, account: '' },
    { method: 'A/C Name', account: this.companyDetails.accountname }
  ];
  const paymentBoxHeight = 16 + paymentMethods.length * 6;

  doc.setFillColor(245, 245, 245);
  doc.roundedRect(paymentBoxX, finalY, boxWidth, paymentBoxHeight, 3, 3, 'F');

  doc.setFontSize(11).setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Payment Methods:', paymentBoxX + 4, finalY + 7);

  doc.setFontSize(10).setFont('helvetica', 'normal');
  paymentMethods.forEach((p, index) => {
    doc.text(`${p?.method}: ${p?.account}`, paymentBoxX + 4, finalY + 16 + index * 6);
  });

  // === TOTALS BOX ===
  const totalsBoxX = pageWidth - boxWidth - 14;
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(totalsBoxX, finalY, boxWidth, boxHeight, 3, 3, 'F');

  doc.setFontSize(11).setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); 
  doc.text(`Subtotal: ${this.formatNumber(this.subtotal)}`, totalsBoxX + boxWidth - 4, finalY + 8, { align: 'right' });
  doc.text(`VAT (18%): ${this.formatNumber(this.vat)}`, totalsBoxX + boxWidth - 4, finalY + 16, { align: 'right' });

  doc.setFontSize(13).setFont('helvetica', 'bold');
  doc.text(`Total: ${this.formatNumber(this.total)}`, totalsBoxX + boxWidth - 4, finalY + 26, { align: 'right' });

  // === THANK YOU BOX ===
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const thankBoxHeight = 25;
  const thankBoxWidth = pageWidth - 28;
  const thankBoxX = 14;
  const thankBoxY = pageHeight - margin - thankBoxHeight;

  doc.setFillColor(245, 245, 245);
  doc.roundedRect(thankBoxX, thankBoxY, thankBoxWidth, thankBoxHeight, 3, 3, 'F');

  doc.setFontSize(12).setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0); 
  const thankMsg = 'Thank you, we are honored to work with you. Welcome back!';
  doc.text(thankMsg, pageWidth / 2, thankBoxY + thankBoxHeight / 2 + 4, { align: 'center' });

  // === SAVE PDF ===
  doc.save(`Invoice_${this.invoices?.transID || '001'}.pdf`);
}




// Helper to format numbers
private formatNumber(value: any): string {
  return Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

 
calculateTotals() {
   if (!this.invoicesDetails) return;

 
  this.subtotal = this.invoicesDetails
  .reduce((sum: number, inv: any) => sum + parseFloat(inv.unit_amount || '0'), 0);


  this.vat = this.invoicesDetails
  .reduce((sum: number, inv: any) => sum + parseFloat(inv.vatamount || '0'), 0);
  this.total = this.subtotal + this.vat;
}

 RecordPayment(data: any){
        this.token = localStorage.getItem('auth_token');

  let params = {paidfrom: this.postData.paidfrom, paidamount: this.postData.amount, description: this.postData.description, transaction_id: data}
  this.service.makePayments(params, this.token).subscribe(
    res=>{
      console.log(res);
      this.result = res;
      this.toast.success(this.result.message);
      this.router.navigate(['salesinvoice']);
    }
  )
  console.log(this.postData, data, this.token);
 }
}
